import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import {
  CUSTOM_SITE_OVERRIDE_FIELDS,
  type CustomSiteOverrideField,
  type CustomSiteVehicleOverride,
} from '@/lib/site-builder';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function platformAdmin() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/custom-sites', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  return user?.role === 'platform_admin' ? user : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ businessId: string; unitId: string }> },
) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  const { businessId, unitId } = await params;

  let body: { overrides?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }
  if (!body.overrides || typeof body.overrides !== 'object' || Array.isArray(body.overrides)) {
    return json({ error: 'overrides must be an object' }, 400);
  }

  const business = await queryOne<{ id: string }>(
    `SELECT id FROM businesses
      WHERE id = ? AND custom_domain IS NOT NULL AND status = 'active' AND published = 1`,
    [businessId],
  );
  if (!business) return json({ error: 'active custom-domain business not found' }, 404);
  const unit = await queryOne<{ id: string }>(
    `SELECT id FROM units WHERE id = ? AND seller_business_id = ? AND status <> 'inactive'`,
    [unitId, businessId],
  );
  if (!unit) return json({ error: 'vehicle does not belong to this business' }, 404);

  const profile = await queryOne<{ override_options: string }>(
    'SELECT override_options FROM custom_site_profiles WHERE business_id = ?',
    [businessId],
  );
  let allowed: string[] = [];
  try {
    const parsed: unknown = JSON.parse(profile?.override_options ?? '[]');
    if (Array.isArray(parsed)) allowed = parsed.filter((field): field is string => typeof field === 'string');
  } catch {
    throw new Error(`Saved custom-site override policy for "${businessId}" is invalid.`);
  }

  const input = body.overrides as Record<string, unknown>;
  if (Object.keys(input).some((field) =>
    !CUSTOM_SITE_OVERRIDE_FIELDS.includes(field as CustomSiteOverrideField) || !allowed.includes(field),
  )) {
    return json({ error: 'an override field is not enabled for this custom-site template' }, 400);
  }

  const normalized: CustomSiteVehicleOverride = {};
  if (Object.hasOwn(input, 'price')) {
    const value = input.price;
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 500_000_000)) {
      return json({ error: 'price must be a positive number no greater than 500000000, or null to clear it' }, 400);
    }
    if (typeof value === 'number') normalized.priceEgp = value;
  }
  if (Object.hasOwn(input, 'availability')) {
    const value = input.availability;
    if (value !== null && !['available', 'reserved', 'sold', 'rented'].includes(String(value))) {
      return json({ error: 'availability must be available, reserved, sold, rented, or null' }, 400);
    }
    if (typeof value === 'string') normalized.availability = value as CustomSiteVehicleOverride['availability'];
  }
  for (const [field, key, maxLength] of [
    ['promotionalCopy', 'promotionalCopy', 500],
    ['specifications', 'specificationsNote', 1000],
    ['media', 'mediaUrl', 2000],
  ] as const) {
    if (!Object.hasOwn(input, field)) continue;
    const value = input[field];
    if (value === null) continue;
    if (typeof value !== 'string' || value.length > maxLength) {
      return json({ error: `${field} must be text no longer than ${maxLength} characters, or null to clear it` }, 400);
    }
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (field === 'media') {
      let url: URL;
      try {
        url = new URL(trimmed);
      } catch {
        return json({ error: 'media must be an HTTPS image URL' }, 400);
      }
      if (url.protocol !== 'https:') return json({ error: 'media must be an HTTPS image URL' }, 400);
    }
    Object.assign(normalized, { [key]: trimmed });
  }

  const existing = await queryOne<{ overrides: string }>(
    `SELECT overrides FROM custom_site_vehicle_overrides
      WHERE business_id = ? AND unit_id = ?`,
    [businessId, unitId],
  );
  let merged: CustomSiteVehicleOverride = {};
  try {
    const parsed: unknown = JSON.parse(existing?.overrides ?? '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      merged = parsed as CustomSiteVehicleOverride;
    }
  } catch {
    throw new Error(`Saved custom-site vehicle overrides for "${unitId}" are invalid.`);
  }
  for (const field of Object.keys(input) as CustomSiteOverrideField[]) {
    const value = normalized[field === 'price' ? 'priceEgp'
      : field === 'availability' ? 'availability'
      : field === 'promotionalCopy' ? 'promotionalCopy'
      : field === 'specifications' ? 'specificationsNote'
      : 'mediaUrl'];
    const key = field === 'price' ? 'priceEgp'
      : field === 'availability' ? 'availability'
      : field === 'promotionalCopy' ? 'promotionalCopy'
      : field === 'specifications' ? 'specificationsNote'
      : 'mediaUrl';
    if (value === undefined) delete merged[key];
    else Object.assign(merged, { [key]: value });
  }

  if (Object.keys(merged).length === 0) {
    await execute(
      'DELETE FROM custom_site_vehicle_overrides WHERE business_id = ? AND unit_id = ?',
      [businessId, unitId],
    );
    return json({ ok: true, overrides: {} });
  }

  await execute(
    `INSERT INTO custom_site_vehicle_overrides (business_id, unit_id, overrides, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(business_id, unit_id) DO UPDATE SET
       overrides = excluded.overrides,
       updated_at = excluded.updated_at`,
    [businessId, unitId, JSON.stringify(merged), new Date().toISOString()],
  );
  return json({ ok: true, overrides: merged });
}
