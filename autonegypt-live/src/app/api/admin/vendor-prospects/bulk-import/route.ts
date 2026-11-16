import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';

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

function buildPhonesJson(phones?: string, whatsapp?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (phones) {
    const parts = phones.split(/[,،\n]+/).map((p) => p.trim()).filter(Boolean);
    parts.forEach((p, i) => {
      result[`phone${i + 1}`] = p;
    });
  }
  if (whatsapp?.trim()) result.whatsapp = whatsapp.trim();
  return result;
}

function cleanPhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

function isEgyptianSales(categoryKey: string): boolean {
  return ['showroom', 'dealer', 'authorized_agent', 'distributor', 'agent', 'used_car_dealer'].includes(categoryKey);
}

interface VendorRow {
  name?: unknown;
  phones?: unknown;
  whatsapp?: unknown;
  city?: unknown;
  country_code?: unknown;
  category_key?: unknown;
  brand?: unknown;
  email?: unknown;
  address?: unknown;
  source?: unknown;
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') return json({ error: 'platform admin required' }, 403);

  let rows: VendorRow[];
  try {
    rows = await request.json() as VendorRow[];
    if (!Array.isArray(rows)) return json({ error: 'body must be a JSON array' }, 400);
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }

  if (rows.length > 2000) return json({ error: 'max 2000 rows per import' }, 400);

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row.name ?? '').trim();
    if (!name) { errors.push(`Row ${i + 1}: name required`); skipped++; continue; }
    if (name.length > 200) { errors.push(`Row ${i + 1}: name too long`); skipped++; continue; }

    const phones = String(row.phones ?? '').trim();
    const whatsapp = String(row.whatsapp ?? '').trim();
    const city = String(row.city ?? '').trim();
    const country_code = String(row.country_code ?? 'EG').trim().toUpperCase() || 'EG';
    const category_key = String(row.category_key ?? 'showroom').trim() || 'showroom';
    const brand = String(row.brand ?? '').trim();
    const email = String(row.email ?? '').trim();
    const address = String(row.address ?? '').trim();
    const source = String(row.source ?? '').trim();

    const phonesJson = buildPhonesJson(phones, whatsapp);
    const phonesStr = JSON.stringify(phonesJson);
    const hasPhone = Object.values(phonesJson).some((p) => cleanPhone(p).length >= 7) ? 1 : 0;
    const freeOfferEligible = country_code === 'EG' && isEgyptianSales(category_key) ? 1 : 0;
    const campaignStatus = freeOfferEligible ? 'offer_ready' : 'new';
    const duplicateKey = slugify(name);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Check duplicate
    const existing = await queryOne<{ id: string }>(
      'SELECT id FROM vendor_prospects WHERE duplicate_key = ?',
      [duplicateKey],
    );
    if (existing) { skipped++; continue; }

    try {
      await execute(
        `INSERT INTO vendor_prospects
           (id, name, original_category, category_key, brand, address, city, phones, email,
            source_count, source_names, country_code, has_phone, duplicate_key,
            free_offer_eligible, campaign_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, category_key, category_key, brand, address, city, phonesStr, email,
         source, country_code, hasPhone, duplicateKey,
         freeOfferEligible, campaignStatus, now, now],
      );
      imported++;
    } catch {
      skipped++;
    }
  }

  return json({ ok: true, imported, skipped, errors: errors.slice(0, 20) });
}
