import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { batch, query } from '@/lib/db';
import type { VendorProspectStatus } from '@/lib/vendor-prospects';
import { normalizeWhatsAppPhone, sha256Hex } from '@/lib/whatsapp';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function extractFirstPhone(phonesStr: string, countryCode: string): string {
  try {
    const obj = JSON.parse(phonesStr) as Record<string, string>;
    const val = obj.whatsapp || obj.mobile1 || obj.mobile2 || obj.phone1 || obj.phone2 || obj.phone3 || '';
    return normalizeWhatsAppPhone(val, countryCode);
  } catch {
    return '';
  }
}

function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

interface BlastFilters {
  status?: string;
  city?: string;
  category?: string;
  country?: string;
  ids?: string[];
}

interface BlastBody {
  filters?: BlastFilters;
  messageTemplate?: string;
  campaignRef?: string;
  updateStatus?: boolean;
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') return json({ error: 'platform admin required' }, 403);

  let body: BlastBody;
  try {
    body = await request.json() as BlastBody;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }

  const filters = body.filters ?? {};
  const messageTemplate = body.messageTemplate ?? '';
  const campaignRef = body.campaignRef ?? 'autofyon-blast';
  const updateStatus = body.updateStatus ?? false;

  if (typeof messageTemplate !== 'string' || !messageTemplate.trim()) {
    return json({ error: 'messageTemplate required' }, 400);
  }
  if (!messageTemplate.includes('{{inviteUrl}}')) {
    return json({ error: 'messageTemplate must include {{inviteUrl}}' }, 400);
  }
  if (typeof campaignRef !== 'string') return json({ error: 'Invalid campaign reference' }, 400);
  if (messageTemplate.length > 2000) return json({ error: 'messageTemplate is too long' }, 400);
  if (filters.status && !['new', 'offer_ready', 'queued', 'contacted', 'accepted', 'declined', 'do_not_contact'].includes(filters.status)) {
    return json({ error: 'Invalid campaign status' }, 400);
  }
  const safeCampaignRef = campaignRef.trim().slice(0, 100);

  // Build WHERE clause
  const where: string[] = [
    `campaign_status NOT IN ('accepted', 'declined', 'do_not_contact')`,
    `(
      NOT EXISTS (SELECT 1 FROM vendor_referrals r WHERE r.prospect_id = vendor_prospects.id)
      OR EXISTS (
        SELECT 1 FROM vendor_referrals r
         WHERE r.prospect_id = vendor_prospects.id AND r.status IN ('approved', 'invited', 'converted')
      )
    )`,
  ];
  const values: unknown[] = [];

  if (filters.ids && Array.isArray(filters.ids) && filters.ids.length > 0) {
    const ids = filters.ids.slice(0, 500);
    const placeholders = ids.map(() => '?').join(',');
    where.push(`id IN (${placeholders})`);
    values.push(...ids);
  } else {
    if (filters.status) { where.push('campaign_status = ?'); values.push(filters.status); }
    if (filters.city) { where.push('city = ?'); values.push(filters.city); }
    if (filters.category) { where.push('category_key = ?'); values.push(filters.category); }
    if (filters.country) { where.push('country_code = ?'); values.push(filters.country); }
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const prospects = await query<{
    id: string; name: string; city: string; phones: string;
    country_code: string; campaign_status: VendorProspectStatus;
  }>(
    `SELECT id, name, city, phones, country_code, campaign_status
       FROM vendor_prospects ${clause} LIMIT 500`,
    values,
  );
  const activeInvites = prospects.length
    ? await query<{ id: string; prospect_id: string; status: string; authorized_phone: string }>(
        `SELECT id, prospect_id, status, authorized_phone FROM vendor_registration_invites
          WHERE prospect_id IN (${prospects.map(() => '?').join(',')})
            AND status IN ('invited', 'verified', 'changes_requested', 'submitted', 'approved')`,
        prospects.map((prospect) => prospect.id),
      )
    : [];
  const inviteByProspect = new Map(activeInvites.map((invite) => [invite.prospect_id, invite]));

  const results: Array<{
    id: string; name: string; phone: string; city: string;
    whatsappUrl: string; message: string;
  }> = [];
  const invitations: Array<{
    id: string;
    prospectId: string;
    phone: string;
    tokenHash: string;
    auditId: string;
    existingStatus: string | null;
  }> = [];
  let skippedNoPhone = 0;
  let skippedActiveApplications = 0;

  for (const p of prospects) {
    const activeInvite = inviteByProspect.get(p.id);
    if (activeInvite && ['submitted', 'approved'].includes(activeInvite.status)) {
      skippedActiveApplications++;
      continue;
    }
    const phone = activeInvite?.status === 'changes_requested'
      ? activeInvite.authorized_phone
      : extractFirstPhone(p.phones, p.country_code);
    if (!phone) {
      skippedNoPhone++;
      continue;
    }

    const rawToken = crypto.getRandomValues(new Uint8Array(32));
    const inviteToken = btoa(String.fromCharCode(...rawToken))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    const tokenHash = await sha256Hex(inviteToken);
    const inviteId = activeInvite?.status === 'changes_requested'
      ? activeInvite.id
      : `vri_${crypto.randomUUID()}`;
    const inviteUrl = `https://autofyon.com/join#invite=${encodeURIComponent(inviteToken)}`;
    const message = interpolate(messageTemplate, {
      name: p.name,
      city: p.city || 'مصر',
      inviteUrl,
      phone,
    });
    const waUrl = buildWaUrl(phone, message);

    results.push({ id: p.id, name: p.name, phone, city: p.city, whatsappUrl: waUrl, message });
    invitations.push({
      id: inviteId,
      prospectId: p.id,
      phone,
      tokenHash,
      auditId: `voa_${crypto.randomUUID()}`,
      existingStatus: activeInvite?.status ?? null,
    });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  for (let offset = 0; offset < invitations.length; offset += 30) {
    const statements = invitations.slice(offset, offset + 30).flatMap((invite) => {
      const updates = invite.existingStatus === 'changes_requested'
        ? [{
            sql: `UPDATE vendor_registration_invites
                     SET token_hash = ?, authorized_phone = ?, campaign_ref = ?, expires_at = ?,
                         created_by = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ? AND status = 'changes_requested'`,
            params: [invite.tokenHash, invite.phone, safeCampaignRef, expiresAt, user.id, invite.id],
          }]
        : [
            {
              sql: `UPDATE vendor_registration_invites
                       SET status = 'revoked', updated_at = CURRENT_TIMESTAMP
                     WHERE prospect_id = ? AND status IN ('invited', 'verified')`,
              params: [invite.prospectId],
            },
            {
              sql: `INSERT INTO vendor_registration_invites
                      (id, prospect_id, token_hash, authorized_phone, campaign_ref, status, expires_at, created_by)
                    VALUES (?, ?, ?, ?, ?, 'invited', ?, ?)`,
              params: [invite.id, invite.prospectId, invite.tokenHash, invite.phone, safeCampaignRef, expiresAt, user.id],
            },
          ];
      return [
        ...updates,
        {
          sql: `UPDATE vendor_referrals SET status = 'invited', updated_at = CURRENT_TIMESTAMP
                WHERE prospect_id = ? AND status = 'approved'`,
          params: [invite.prospectId],
        },
        {
          sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, actor_id, action, detail)
                VALUES (?, ?, ?, ?, ?)`,
          params: [
            invite.auditId,
            invite.id,
            user.id,
            invite.existingStatus === 'changes_requested' ? 'invite_resent' : 'invited',
            safeCampaignRef,
          ],
        },
      ];
    });
    await batch(statements);
  }

  // Update status
  if (updateStatus && results.length > 0) {
    const ids = results.map((r) => r.id);
    const placeholders = ids.map(() => '?').join(',');
    await batch([{
      sql: `UPDATE vendor_prospects SET campaign_status = 'queued', updated_at = ? WHERE id IN (${placeholders})`,
      params: [new Date().toISOString(), ...ids],
    }]);
  }

  return json({
    ok: true,
    total: results.length,
    skippedNoPhone,
    skippedActiveApplications,
    results,
  });
}
