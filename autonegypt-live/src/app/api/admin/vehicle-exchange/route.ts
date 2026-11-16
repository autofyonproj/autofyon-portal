import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, executeBatch, query, queryOne } from '@/lib/db';
import { extractYouTubeVideoId } from '@/lib/youtube';
import { deleteImage, isAllowedImageType, mediaUrl, putImage } from '@/lib/media';
import { validateUnitSocialLinks } from '@/lib/social-links';
import {
  sha256,
  validateExchangePayload,
  type ExchangeVehiclePayload,
} from '@/lib/vehicle-exchange';
import { assertUnitOverrideKey, TypologyError } from '@/lib/typology';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function readImageUnderLimit(response: Response, maxBytes: number): Promise<ArrayBuffer> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error('Vehicle image exceeds the 10 MB import limit.');
  }
  if (!response.body) throw new Error('Vehicle image response has no body.');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error('Vehicle image exceeds the 10 MB import limit.');
    }
    chunks.push(value);
  }
  const complete = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    complete.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return complete.buffer;
}

async function platformAdmin() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/vehicle-exchange', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  return user?.role === 'platform_admin' ? user : null;
}

async function makePayload(unitId: string, vendorBusinessId: string): Promise<ExchangeVehiclePayload | null> {
  const unit = await queryOne<{
    id: string; slug: string; title: string; title_ar: string | null;
    unit_kind: string; vehicle_category: string; status: string;
    year: number | null; mileage_km: number | null; color: string | null;
    color_ar: string | null; price_egp: number | null; price_currency: string;
    negotiable: number; overrides: string; seller_business_id: string;
  }>(
    `SELECT id, slug, title, title_ar, unit_kind, vehicle_category, status,
            year, mileage_km, color, color_ar, price_egp, price_currency,
            negotiable, overrides, seller_business_id
       FROM units WHERE id = ? AND published = 1`,
    [unitId],
  );
  if (!unit) return null;
  const [vendorOffer, mediaRows, design, gallerySections] = await Promise.all([
    queryOne<{
      price_egp: number | null; price_currency: string; negotiable: number; status: string;
      availability_note: string | null; availability_note_ar: string | null;
    }>(
      `SELECT price_egp, price_currency, negotiable, status, availability_note, availability_note_ar
         FROM unit_vendor_offers
        WHERE unit_id = ? AND vendor_business_id = ? AND published = 1 AND status <> 'inactive'`,
      [unitId, vendorBusinessId],
    ),
    query<{
      section_id: string | null; url: string; caption: string | null; caption_ar: string | null;
      media_data: string | null; group_key: string | null; field_key: string | null;
      field_section_id: string | null; display_order: number; placement: string;
      is_hero: number; show_on_minisite: number; media_type: string | null; video_id: string | null;
    }>(
      `SELECT section_id, url, caption, caption_ar, media_data, group_key, field_key,
              field_section_id, display_order, placement, is_hero, show_on_minisite,
              media_type, video_id
         FROM vendor_gallery
        WHERE unit_id = ? AND business_id = ? AND approval_status = 'approved'
        ORDER BY section_id, display_order`,
      [unitId, unit.seller_business_id],
    ),
    queryOne<{
      template_id: string; logo_url: string | null; accent_color: string | null;
      background_color: string | null; social_links: string;
    }>(
      `SELECT template_id, logo_url, accent_color, background_color, social_links
         FROM site_profiles WHERE target_type = 'unit' AND target_id = ?`,
      [unitId],
    ),
    query<{ id: string }>(
      'SELECT id FROM sections WHERE enable_gallery = 1 ORDER BY sort_order, id',
    ),
  ]);
  if (!vendorOffer) return null;
  const galleryDefault = gallerySections[0]?.id;
  if (mediaRows.length && !galleryDefault) throw new Error('No gallery section is configured for vehicle media.');
  let socialLinks: unknown = {};
  try { socialLinks = JSON.parse(design?.social_links ?? '{}') as unknown; }
  catch { throw new Error('Vehicle social links contain invalid JSON.'); }
  const validSocialLinks = validateUnitSocialLinks(socialLinks);
  if (!validSocialLinks) throw new Error('Vehicle social links are invalid.');
  const overrides: unknown = JSON.parse(unit.overrides || '{}');
  const profile = {
    template_id: design?.template_id ?? 'editorial',
    logo_url: design?.logo_url?.startsWith('/')
      ? new URL(design.logo_url, 'https://autofyon.com').toString()
      : design?.logo_url ?? null,
    accent_color: design?.accent_color ?? '#b28a45',
    background_color: design?.background_color ?? '#f7f4ed',
  };
  return validateExchangePayload({
    schemaVersion: 1,
    vehicle: {
      ...unit,
      ...vendorOffer,
      externalId: unit.id,
      overrides,
    },
    socialLinks: validSocialLinks,
    design: profile,
    media: mediaRows.map((item) => ({
      ...item,
      section_id: item.section_id ?? galleryDefault ?? '',
      url: new URL(item.url, 'https://autofyon.com').toString(),
      media_data: item.media_data ? JSON.parse(item.media_data) as Record<string, unknown> : null,
      placement: item.placement,
      media_type: item.media_type ?? 'image',
    })),
  });
}

async function applyApprovedImport(
  proposal: {
    id: string; vendor_business_id: string; external_vehicle_id: string; payload: string;
  },
  published: boolean,
  adminId: string,
) {
  let raw: unknown;
  try { raw = JSON.parse(proposal.payload) as unknown; }
  catch { throw new Error('Saved vehicle proposal contains invalid JSON.'); }
  const payload = validateExchangePayload(raw);
  if (!payload || payload.vehicle.externalId !== proposal.external_vehicle_id) {
    throw new Error('Vehicle proposal failed validation.');
  }
  for (const [sectionId, fields] of Object.entries(payload.vehicle.overrides)) {
    for (const key of Object.keys(fields)) await assertUnitOverrideKey(sectionId, key);
  }
  const vendor = await queryOne<{ id: string; slug: string }>(
    `SELECT id, slug FROM businesses
      WHERE id = ? AND status = 'active' AND published = 1`,
    [proposal.vendor_business_id],
  );
  if (!vendor) throw new Error('The vehicle source vendor is not active and published.');
  const sectionRows = await query<{ id: string }>(
    'SELECT id FROM sections WHERE enable_gallery = 1 ORDER BY sort_order, id',
  );
  if (payload.media.length && !sectionRows.length) {
    throw new Error('No gallery section is configured to receive vehicle media.');
  }
  const validSections = new Set(sectionRows.map((section) => section.id));
  const defaultSection = sectionRows[0]?.id ?? '';
  const existing = await queryOne<{ id: string; slug: string; published: number }>(
    `SELECT id, slug, published FROM units
      WHERE source_site_business_id = ? AND source_vehicle_id = ?`,
    [vendor.id, proposal.external_vehicle_id],
  );
  const sharedUnit = existing ? null : await queryOne<{
    id: string; slug: string; published: number; seller_business_id: string;
  }>(
    `SELECT u.id, u.slug, u.published, u.seller_business_id
       FROM units u
       JOIN vehicle_exchange_proposals p
         ON p.unit_id = u.id AND p.vendor_business_id = ?
        AND p.direction = 'export' AND p.status = 'approved'
      WHERE u.id = ?`,
    [vendor.id, proposal.external_vehicle_id],
  );
  const suffix = (await sha256(`${vendor.id}:${proposal.external_vehicle_id}`)).slice(0, 18);
  const unitId = existing?.id ?? sharedUnit?.id ?? `unit_ext_${suffix}`;
  const sellerBusinessId = sharedUnit?.seller_business_id ?? vendor.id;
  const slug = existing?.slug ?? sharedUnit?.slug ?? `import-${vendor.slug}-${suffix}`;
  const now = new Date().toISOString();
  const vehicle = payload.vehicle;
  const statements: Array<{ sql: string; params: unknown[] }> = [{
    sql: `INSERT INTO units
      (id, seller_business_id, owner_business_id, stock_source, slug, title, title_ar,
       unit_kind, vehicle_category, status, year, mileage_km, color, color_ar,
       price_egp, price_currency, negotiable, overrides, published,
       source_site_business_id, source_vehicle_id, created_at, updated_at)
      VALUES (?, ?, NULL, 'own_stock', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
       title = excluded.title, title_ar = excluded.title_ar, unit_kind = excluded.unit_kind,
       vehicle_category = excluded.vehicle_category, status = excluded.status,
       year = excluded.year, mileage_km = excluded.mileage_km, color = excluded.color,
       color_ar = excluded.color_ar, price_egp = excluded.price_egp,
       price_currency = excluded.price_currency, negotiable = excluded.negotiable,
       overrides = excluded.overrides, published = excluded.published, updated_at = excluded.updated_at`,
    params: [
      unitId, vendor.id, slug, vehicle.title, vehicle.title_ar, vehicle.unit_kind,
      vehicle.vehicle_category, vehicle.status, vehicle.year, vehicle.mileage_km,
      vehicle.color, vehicle.color_ar, vehicle.price_egp, vehicle.price_currency,
      vehicle.negotiable, JSON.stringify(vehicle.overrides),
      published ? 1 : existing?.published ?? sharedUnit?.published ?? 0,
      vendor.id, proposal.external_vehicle_id, now, now,
    ],
  }];
  statements.push({
    sql: `INSERT INTO unit_vendor_offers
      (id, unit_id, vendor_business_id, price_egp, price_currency, negotiable, status,
       availability_note, availability_note_ar, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(unit_id, vendor_business_id) DO UPDATE SET
        price_egp = excluded.price_egp, price_currency = excluded.price_currency,
        negotiable = excluded.negotiable, status = excluded.status,
        availability_note = excluded.availability_note,
        availability_note_ar = excluded.availability_note_ar,
        published = excluded.published, updated_at = excluded.updated_at`,
    params: [
      `uvo_${unitId}_${vendor.id}`, unitId, vendor.id, vehicle.price_egp,
      vehicle.price_currency, vehicle.negotiable, vehicle.status,
      vehicle.availability_note, vehicle.availability_note_ar,
      published ? 1 : existing?.published ?? sharedUnit?.published ?? 0, now, now,
    ],
  });
  statements.push({
    sql: `INSERT INTO site_profiles
      (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links, updated_at)
      VALUES ('unit', ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(target_type, target_id) DO UPDATE SET
        template_id = excluded.template_id, logo_url = excluded.logo_url,
        accent_color = excluded.accent_color, background_color = excluded.background_color,
        social_links = excluded.social_links, updated_at = excluded.updated_at`,
    params: [
      unitId, payload.design.template_id, payload.design.logo_url, payload.design.accent_color,
      payload.design.background_color, JSON.stringify(payload.socialLinks), now,
    ],
  });
  statements.push({
    sql: 'DELETE FROM vendor_gallery WHERE business_id = ? AND unit_id = ?',
    params: [sellerBusinessId, unitId],
  });
  const uploadedMediaKeys: string[] = [];
  try {
    let importedBytes = 0;
    for (const [index, item] of payload.media.entries()) {
      let videoId = item.video_id;
      if (item.media_type === 'youtube') {
        videoId = videoId && /^[\w-]{11}$/.test(videoId) ? videoId : extractYouTubeVideoId(item.url);
        if (!videoId) throw new Error(`Media item ${index + 1} has an invalid YouTube video ID.`);
      }
      if (item.media_type === 'image' || item.media_type === 'youtube') {
        const originalUrl = new URL(item.url);
        const isExistingPortalMedia = originalUrl.hostname === 'autofyon.com' &&
          /^\/api\/media\/gallery\/[a-z0-9-]+\.(jpg|png|webp|gif|avif)$/i.test(originalUrl.pathname);
        const sourceUrl = item.media_type === 'youtube' && !isExistingPortalMedia
          ? new URL(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
          : originalUrl;
        const isPortalMedia = sourceUrl.hostname === 'autofyon.com' &&
          /^\/api\/media\/gallery\/[a-z0-9-]+\.(jpg|png|webp|gif|avif)$/i.test(sourceUrl.pathname);
        if (!isPortalMedia) {
          const response = await fetch(sourceUrl, { redirect: 'error' });
          if (!response.ok) throw new Error(`Could not import vehicle image ${index + 1} (HTTP ${response.status}).`);
          const contentType = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
          if (!isAllowedImageType(contentType)) {
            throw new Error(`Vehicle media item ${index + 1} is not a supported image type.`);
          }
          const imageData = await readImageUnderLimit(response, 10 * 1024 * 1024);
          importedBytes += imageData.byteLength;
          if (importedBytes > 50 * 1024 * 1024) {
            throw new Error('Vehicle images exceed the 50 MB total import limit.');
          }
          const { key } = await putImage(
            imageData,
            contentType,
            `exchange-${unitId}-${index + 1}`,
          );
          uploadedMediaKeys.push(key);
          item.url = mediaUrl(key);
        }
      }
      statements.push({
        sql: `INSERT INTO vendor_gallery
        (id, business_id, unit_id, section_id, url, caption, caption_ar, media_data,
         group_key, field_key, field_section_id, display_order, placement, is_hero,
         show_on_minisite, approval_status, media_type, video_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)`,
        params: [
          `gx_${proposal.id}_${index}`, sellerBusinessId, unitId,
          validSections.has(item.section_id) ? item.section_id : defaultSection,
          item.url, item.caption, item.caption_ar,
          item.media_data ? JSON.stringify(item.media_data) : null,
          item.group_key, item.field_key, item.field_section_id, item.display_order,
          item.placement, item.is_hero, item.show_on_minisite, item.media_type, videoId,
        ],
      });
    }
    statements.push({
      sql: `UPDATE vehicle_exchange_proposals
      SET status = 'approved', unit_id = ?, decided_at = ?, decided_by = ?
      WHERE id = ? AND status = 'pending'`,
      params: [unitId, now, adminId, proposal.id],
    });
    await executeBatch(statements);
  } catch (reason) {
    const cleanupFailures: string[] = [];
    for (const key of uploadedMediaKeys) {
      try {
        await deleteImage(key);
      } catch {
        cleanupFailures.push(key);
      }
    }
    const message = reason instanceof Error ? reason.message : 'Vehicle import failed.';
    if (cleanupFailures.length) {
      throw new Error(`${message} R2 cleanup failed for ${cleanupFailures.length} uploaded media file(s).`);
    }
    throw reason;
  }
  return unitId;
}

export async function GET() {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  const [sites, proposals] = await Promise.all([
    query<{ vendor_business_id: string; enabled: number; updated_at: string; vendor_name: string; vendor_slug: string }>(
      `SELECT x.vendor_business_id, x.enabled, x.updated_at,
              b.name AS vendor_name, b.slug AS vendor_slug
         FROM vehicle_exchange_sites x JOIN businesses b ON b.id = x.vendor_business_id
        ORDER BY b.name`,
    ),
    query<{
      id: string; vendor_business_id: string; direction: string; external_vehicle_id: string;
      unit_id: string | null; version_hash: string; payload: string; status: string;
      rejection_reason: string | null; created_at: string; decided_at: string | null;
      vendor_name: string; vendor_slug: string;
    }>(
      `SELECT p.id, p.vendor_business_id, p.direction, p.external_vehicle_id, p.unit_id,
              p.version_hash, p.payload, p.status, p.rejection_reason, p.created_at,
              p.decided_at, b.name AS vendor_name, b.slug AS vendor_slug
         FROM vehicle_exchange_proposals p
         JOIN businesses b ON b.id = p.vendor_business_id
        ORDER BY CASE p.status WHEN 'pending' THEN 0 ELSE 1 END, p.created_at DESC
        LIMIT 100`,
    ),
  ]);
  return json({ sites, proposals });
}

export async function POST(request: Request) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  let body: { action?: string; vendor_business_id?: string; unit_id?: string };
  try { body = await request.json() as typeof body; }
  catch { return json({ error: 'body must be valid JSON' }, 400); }

  if (body.action === 'rotate_token') {
    if (!body.vendor_business_id) return json({ error: 'vendor_business_id is required' }, 400);
    const vendor = await queryOne<{ id: string }>(
      `SELECT id FROM businesses
        WHERE id = ? AND published = 1 AND status = 'active'`,
      [body.vendor_business_id],
    );
    if (!vendor) return json({ error: 'active vendor not found' }, 404);
    const token = `afvx_${[...crypto.getRandomValues(new Uint8Array(32))].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    const now = new Date().toISOString();
    await execute(
      `INSERT INTO vehicle_exchange_sites (vendor_business_id, token_hash, enabled, created_at, updated_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(vendor_business_id) DO UPDATE SET
         token_hash = excluded.token_hash, enabled = 1, updated_at = excluded.updated_at`,
      [vendor.id, await sha256(token), now, now],
    );
    return json({ ok: true, token }, 201);
  }

  if (body.action === 'disable_site') {
    if (!body.vendor_business_id) return json({ error: 'vendor_business_id is required' }, 400);
    const result = await execute(
      'UPDATE vehicle_exchange_sites SET enabled = 0, updated_at = ? WHERE vendor_business_id = ?',
      [new Date().toISOString(), body.vendor_business_id],
    );
    if (!result.changes) return json({ error: 'exchange site is not configured' }, 404);
    return json({ ok: true, enabled: false });
  }

  if (body.action === 'stage_export') {
    if (!body.vendor_business_id || !body.unit_id) {
      return json({ error: 'vendor_business_id and unit_id are required' }, 400);
    }
    const site = await queryOne<{ enabled: number }>(
      'SELECT enabled FROM vehicle_exchange_sites WHERE vendor_business_id = ?',
      [body.vendor_business_id],
    );
    if (!site || site.enabled !== 1) return json({ error: 'vehicle exchange must be enabled for this vendor first' }, 409);
    const payload = await makePayload(body.unit_id, body.vendor_business_id);
    if (!payload) {
      return json({ error: 'published vehicle or published offer for this client was not found' }, 409);
    }
    const serialized = JSON.stringify(payload);
    const versionHash = await sha256(serialized);
    const proposalId = `vxp_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const insert = await execute(
      `INSERT OR IGNORE INTO vehicle_exchange_proposals
        (id, vendor_business_id, direction, external_vehicle_id, unit_id, version_hash, payload, status, created_at)
       VALUES (?, ?, 'export', ?, ?, ?, ?, 'pending', ?)`,
      [proposalId, body.vendor_business_id, payload.vehicle.externalId, body.unit_id, versionHash, serialized, now],
    );
    if (!insert.changes) {
      const existing = await queryOne<{ id: string; status: string }>(
        `SELECT id, status FROM vehicle_exchange_proposals
          WHERE vendor_business_id = ? AND direction = 'export'
            AND external_vehicle_id = ? AND version_hash = ?`,
        [body.vendor_business_id, payload.vehicle.externalId, versionHash],
      );
      return json({ error: 'this exact vehicle version has already been submitted', proposal: existing }, 409);
    }
    return json({ ok: true, id: proposalId }, 201);
  }
  return json({ error: 'unsupported action' }, 400);
}

export async function PATCH(request: Request) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  let body: { proposal_id?: string; decision?: string; rejection_reason?: string; publish?: boolean };
  try { body = await request.json() as typeof body; }
  catch { return json({ error: 'body must be valid JSON' }, 400); }
  if (!body.proposal_id || !['approve', 'reject'].includes(String(body.decision))) {
    return json({ error: 'proposal_id and a valid decision are required' }, 400);
  }
  const proposal = await queryOne<{
    id: string; vendor_business_id: string; direction: 'import' | 'export';
    external_vehicle_id: string; unit_id: string | null; payload: string; status: string;
  }>(
    'SELECT id, vendor_business_id, direction, external_vehicle_id, unit_id, payload, status FROM vehicle_exchange_proposals WHERE id = ?',
    [body.proposal_id],
  );
  if (!proposal) return json({ error: 'vehicle proposal not found' }, 404);
  if (proposal.status !== 'pending') return json({ error: 'only pending proposals can be decided' }, 409);
  const now = new Date().toISOString();
  if (body.decision === 'reject') {
    const reason = body.rejection_reason?.trim() ?? '';
    if (!reason || reason.length > 500) return json({ error: 'a rejection reason (up to 500 characters) is required' }, 400);
    await execute(
      `UPDATE vehicle_exchange_proposals
        SET status = 'rejected', rejection_reason = ?, decided_at = ?, decided_by = ?
        WHERE id = ? AND status = 'pending'`,
      [reason, now, user.id, proposal.id],
    );
    return json({ ok: true, status: 'rejected' });
  }
  if (proposal.direction === 'export') {
    await execute(
      `UPDATE vehicle_exchange_proposals
        SET status = 'approved', decided_at = ?, decided_by = ?
        WHERE id = ? AND status = 'pending'`,
      [now, user.id, proposal.id],
    );
    return json({ ok: true, status: 'approved' });
  }
  if (body.publish !== undefined && typeof body.publish !== 'boolean') {
    return json({ error: 'publish must be a boolean' }, 400);
  }
  try {
    const unitId = await applyApprovedImport(proposal, body.publish === true, user.id);
    return json({ ok: true, status: 'approved', unit_id: unitId });
  } catch (reason) {
    if (reason instanceof TypologyError) return json({ error: reason.message }, 409);
    if (reason instanceof Error) return json({ error: reason.message }, 400);
    throw reason;
  }
}
