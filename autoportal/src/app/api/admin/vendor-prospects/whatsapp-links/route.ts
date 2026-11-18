import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { query, execute } from '@/lib/db';
import type { VendorProspectStatus } from '@/lib/vendor-prospects';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'vendor';
}

function extractFirstPhone(phonesStr: string): string {
  try {
    const obj = JSON.parse(phonesStr) as Record<string, string>;
    const val = obj.whatsapp || obj.phone1 || obj.mobile1 || Object.values(obj)[0] || '';
    return val.replace(/\D/g, '');
  } catch {
    return '';
  }
}

function buildWaUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  // Add country code 20 for Egypt if starts with 0
  const intl = clean.startsWith('0') ? `20${clean.slice(1)}` : clean.startsWith('20') ? clean : `20${clean}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
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
  preCreateLandingPages?: boolean;
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

  const {
    filters = {},
    messageTemplate = '',
    campaignRef = 'autofyon-blast',
    preCreateLandingPages = false,
    updateStatus = false,
  } = body;

  if (!messageTemplate.trim()) return json({ error: 'messageTemplate required' }, 400);

  // Build WHERE clause
  const where: string[] = [];
  const values: unknown[] = [];

  if (filters.ids && Array.isArray(filters.ids) && filters.ids.length > 0) {
    const placeholders = filters.ids.map(() => '?').join(',');
    where.push(`id IN (${placeholders})`);
    values.push(...filters.ids);
  } else {
    if (filters.status) { where.push('campaign_status = ?'); values.push(filters.status); }
    if (filters.city) { where.push('city = ?'); values.push(filters.city); }
    if (filters.category) { where.push('category_key = ?'); values.push(filters.category); }
    if (filters.country) { where.push('country_code = ?'); values.push(filters.country); }
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const prospects = await query<{
    id: string; name: string; city: string; phones: string; email: string; campaign_status: VendorProspectStatus;
  }>(
    `SELECT id, name, city, phones, email, campaign_status FROM vendor_prospects ${clause} LIMIT 500`,
    values,
  );

  const results: Array<{
    id: string; name: string; phone: string; city: string;
    whatsappUrl: string; message: string; slug: string;
  }> = [];
  const landingPagesCreated: string[] = [];

  for (const p of prospects) {
    const phone = extractFirstPhone(p.phones);
    const slug = slugify(p.name);
    const inviteUrl = `https://autofyon.com/join?claim=${encodeURIComponent(p.id)}&name=${encodeURIComponent(p.name)}&phone=${encodeURIComponent(phone)}&slug=${encodeURIComponent(slug)}&ref=${encodeURIComponent(campaignRef)}`;
    const message = interpolate(messageTemplate, {
      name: p.name,
      city: p.city || 'مصر',
      inviteUrl,
      phone,
    });
    const waUrl = buildWaUrl(phone, message);

    results.push({ id: p.id, name: p.name, phone, city: p.city, whatsappUrl: waUrl, message, slug });

    // Pre-create landing page
    if (preCreateLandingPages) {
      const businessId = `prospect_${p.id}`;
      const now = new Date().toISOString();
      try {
        await execute(
          `INSERT OR IGNORE INTO autofyon_media_landings
             (business_id, slug, name, whatsapp, phone, city, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [businessId, slug, p.name, phone, phone, p.city, now, now],
        );
        landingPagesCreated.push(slug);
      } catch {
        // skip
      }
    }
  }

  // Update status
  if (updateStatus && results.length > 0) {
    const ids = results.map((r) => r.id);
    const placeholders = ids.map(() => '?').join(',');
    await execute(
      `UPDATE vendor_prospects SET campaign_status = 'contacted', updated_at = ? WHERE id IN (${placeholders})`,
      [new Date().toISOString(), ...ids],
    );
  }

  return json({
    ok: true,
    total: results.length,
    landingPagesCreated: landingPagesCreated.length,
    results,
  });
}
