import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';
import {
  VENDOR_PROSPECT_CATEGORIES,
  VENDOR_PROSPECT_STATUSES,
  VENDOR_PROSPECT_STATUS_LABELS,
  type VendorProspectStatus,
} from '@/lib/vendor-prospects';
import VendorProspectStatusControl from '@/components/VendorProspectStatus';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 50;

interface SearchParams {
  q?: string;
  category?: string;
  country?: string;
  city?: string;
  brand?: string;
  contact?: string;
  offer?: string;
  status?: string;
  duplicates?: string;
  page?: string;
}

function countryLabel(value: string) {
  return value === 'EG' ? 'Egypt' : value === 'SA' ? 'Saudi Arabia' : value === 'QA' ? 'Qatar' : 'Unknown';
}

export default async function VendorProspectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const filters = await searchParams;
  const page = Math.max(1, Math.trunc(Number(filters.page) || 1));
  const where: string[] = [];
  const values: unknown[] = [];
  const validCategory = new Set<string>(VENDOR_PROSPECT_CATEGORIES.map((item) => item.id)).has(filters.category ?? '');
  const validStatus = VENDOR_PROSPECT_STATUSES.includes(filters.status as VendorProspectStatus);
  if (validCategory) { where.push('category_key = ?'); values.push(filters.category); }
  if (['EG', 'SA', 'QA', 'unknown'].includes(filters.country ?? '')) { where.push('country_code = ?'); values.push(filters.country); }
  if (filters.city) { where.push('city = ?'); values.push(filters.city); }
  if (filters.brand) { where.push('brand = ?'); values.push(filters.brand); }
  if (filters.contact === 'yes') where.push('has_phone = 1');
  if (filters.contact === 'no') where.push('has_phone = 0');
  if (filters.offer === 'eligible') where.push('free_offer_eligible = 1');
  if (filters.offer === 'not_eligible') where.push('free_offer_eligible = 0');
  if (validStatus) { where.push('campaign_status = ?'); values.push(filters.status); }
  if (filters.duplicates === 'yes') {
    where.push(`duplicate_key IS NOT NULL AND duplicate_key IN (
      SELECT duplicate_key FROM vendor_prospects
       WHERE duplicate_key IS NOT NULL GROUP BY duplicate_key HAVING COUNT(*) > 1
    )`);
  }
  if (filters.duplicates === 'no') {
    where.push(`(duplicate_key IS NULL OR duplicate_key NOT IN (
      SELECT duplicate_key FROM vendor_prospects
       WHERE duplicate_key IS NOT NULL GROUP BY duplicate_key HAVING COUNT(*) > 1
    ))`);
  }
  if (filters.q?.trim()) {
    const term = `%${filters.q.trim().toLowerCase()}%`;
    where.push(`(lower(name) LIKE ? OR lower(brand) LIKE ? OR lower(city) LIKE ?
      OR lower(address) LIKE ? OR lower(email) LIKE ? OR lower(phones) LIKE ?)`);
    values.push(term, term, term, term, term, term);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [prospects, totalRow, categories, countries, cities, brands, offerReady] = await Promise.all([
    query<{
      id: string; name: string; original_category: string; original_subcategory: string;
      category_key: string; brand: string; address: string; district: string; city: string;
      phones: string; email: string; contact_name: string; source_count: number;
      source_names: string; country_code: string; has_phone: number; duplicate_key: string | null;
      prospect_group_id: string | null;
      free_offer_eligible: number; campaign_status: VendorProspectStatus;
    }>(
      `SELECT id, name, original_category, original_subcategory, category_key, brand,
              address, district, city, phones, email, contact_name, source_count,
              source_names, country_code, has_phone, duplicate_key, prospect_group_id, free_offer_eligible,
              campaign_status
         FROM vendor_prospects ${clause}
        ORDER BY free_offer_eligible DESC, source_count DESC, name
        LIMIT ? OFFSET ?`,
      [...values, PAGE_SIZE, (page - 1) * PAGE_SIZE],
    ),
    queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM vendor_prospects ${clause}`, values),
    query<{ category_key: string }>('SELECT DISTINCT category_key FROM vendor_prospects ORDER BY category_key'),
    query<{ country_code: string }>('SELECT DISTINCT country_code FROM vendor_prospects ORDER BY country_code'),
    query<{ city: string }>(`SELECT DISTINCT city FROM vendor_prospects WHERE trim(city) <> '' ORDER BY city`),
    query<{ brand: string }>(`SELECT DISTINCT brand FROM vendor_prospects WHERE trim(brand) <> '' ORDER BY brand`),
    queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM vendor_prospects WHERE free_offer_eligible = 1 AND campaign_status = 'offer_ready'`),
  ]);
  const total = totalRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categoryLabel = new Map<string, string>(VENDOR_PROSPECT_CATEGORIES.map((item) => [item.id, item.label]));

  return (
    <div className="mx-auto max-w-[90rem] space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <span>Vendor prospects</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Platform admin · unclaimed directory prospects</p>
        <h1 className="mt-1 text-2xl font-bold">Vendor prospects &amp; free-offer targeting</h1>
        <p className="mt-2 max-w-4xl text-sm text-neutral-600">
          These directory records are not registered vendors. Filter the reviewed Egypt sales cohort, then update outreach status manually. This screen never sends messages.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/platform/vendor-onboarding" className="inline-flex items-center gap-1.5 rounded-lg border border-violet-700/25 bg-violet-700/5 px-4 py-2 text-sm font-bold text-violet-900 hover:bg-violet-700/10">
            مراجعة تسجيلات المعارض ↗
          </Link>
          <Link href="/admin/platform/vendor-prospects/groups" className="inline-flex rounded-lg border border-amber-700/25 bg-amber-700/5 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-700/10">
            Review company groups &amp; follow-ups ↗
          </Link>
          <a href="/api/contacts/export-vcf" download="autofyon-prospect-contacts.vcf" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700/25 bg-emerald-700/5 px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-700/10">
            📥 Export prospect contacts (VCF)
          </a>
          <Link href="/admin/platform/vendor-prospects/import" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700/25 bg-blue-700/5 px-4 py-2 text-sm font-bold text-blue-900 hover:bg-blue-700/10">
            📥 Import vendors
          </Link>
          <Link href="/admin/platform/vendor-prospects/blast" className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800">
            📲 WhatsApp Blast
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{total.toLocaleString()}</strong><p className="text-xs opacity-60">Records matching filters</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{(offerReady?.count ?? 0).toLocaleString()}</strong><p className="text-xs opacity-60">Egypt sales prospects ready for free-offer review</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">0</strong><p className="text-xs opacity-60">Messages sent automatically</p></div>
      </div>

      <form method="GET" className="grid gap-3 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-bold">Search
          <input name="q" defaultValue={filters.q} placeholder="Name, city, brand, or phone" className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
        </label>
        <label className="text-xs font-bold">Category
          <select name="category" defaultValue={filters.category ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">All categories</option>
            {categories.map(({ category_key }) => <option key={category_key} value={category_key}>{categoryLabel.get(category_key) ?? category_key}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">Country
          <select name="country" defaultValue={filters.country ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">All countries</option>
            {countries.map(({ country_code }) => <option key={country_code} value={country_code}>{countryLabel(country_code)}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">City / governorate
          <select name="city" defaultValue={filters.city ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">All locations</option>
            {cities.map(({ city }) => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">Brand
          <select name="brand" defaultValue={filters.brand ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">All brands</option>
            {brands.map(({ brand }) => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">Phone available
          <select name="contact" defaultValue={filters.contact ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">Any</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
        <label className="text-xs font-bold">Free-offer eligibility
          <select name="offer" defaultValue={filters.offer ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">Any</option><option value="eligible">Eligible cohort</option><option value="not_eligible">Outside current cohort</option>
          </select>
        </label>
        <label className="text-xs font-bold">Campaign status
          <select name="status" defaultValue={filters.status ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">All statuses</option>
            {VENDOR_PROSPECT_STATUSES.map((status) => <option key={status} value={status}>{VENDOR_PROSPECT_STATUS_LABELS[status]}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold">Possible duplicates
          <select name="duplicates" defaultValue={filters.duplicates ?? ''} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="">Any</option><option value="yes">Flagged</option><option value="no">Not flagged</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded bg-neutral-900 px-4 py-2 text-sm font-bold text-white">Filter</button>
          <Link href="/admin/platform/vendor-prospects" className="px-2 py-2 text-sm underline">Clear</Link>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full min-w-[75rem] text-start text-sm">
          <thead className="bg-black/[.04] text-xs uppercase">
            <tr>
              <th className="p-3 text-start">Prospect</th><th className="p-3 text-start">Category</th>
              <th className="p-3 text-start">Location / brand</th><th className="p-3 text-start">Contact</th>
              <th className="p-3 text-start">Sources</th><th className="p-3 text-start">Free offer</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((prospect) => {
              let phones: Record<string, string> = {};
              try { phones = JSON.parse(prospect.phones) as Record<string, string>; } catch { phones = {}; }
              const phoneText = Object.entries(phones)
                .filter(([key, value]) => ['phone1', 'phone2', 'phone3', 'mobile1', 'mobile2'].includes(key) && Boolean(value))
                .map(([, value]) => value)
                .join(' · ');
              const supplementaryContact = Object.entries(phones)
                .filter(([key, value]) => ['fax', 'other'].includes(key) && Boolean(value))
                .map(([key, value]) => `${key === 'fax' ? 'Fax' : 'Other'}: ${value}`)
                .join(' · ');
              return (
                <tr key={prospect.id} className="border-t border-black/10 align-top">
                  <td className="p-3">
                    <strong>{prospect.name}</strong>
                    {prospect.prospect_group_id ? <span className="ms-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">Review company group</span> : null}
                    {prospect.address ? <p className="mt-1 max-w-xs text-xs opacity-60">{prospect.address}</p> : null}
                  </td>
                  <td className="p-3">
                    <span>{categoryLabel.get(prospect.category_key) ?? prospect.category_key}</span>
                    <p className="mt-1 text-xs opacity-60">{prospect.original_category}{prospect.original_subcategory ? ` · ${prospect.original_subcategory}` : ''}</p>
                  </td>
                  <td className="p-3">
                    <span>{prospect.city || prospect.district || '—'} · {countryLabel(prospect.country_code)}</span>
                    {prospect.brand ? <p className="mt-1 text-xs opacity-60">Brand: {prospect.brand}</p> : null}
                  </td>
                  <td className="p-3 text-xs">
                    {phoneText ? <p>{phoneText}</p> : <p className="text-amber-800">No phone</p>}
                    {supplementaryContact ? <p className="mt-1 opacity-70">{supplementaryContact}</p> : null}
                    {prospect.email ? <p className="mt-1">{prospect.email}</p> : null}
                    {prospect.contact_name ? <p className="mt-1 opacity-60">{prospect.contact_name}</p> : null}
                  </td>
                  <td className="p-3 text-xs">
                    <strong>{prospect.source_count}</strong> source{prospect.source_count === 1 ? '' : 's'}
                    {prospect.source_names ? <p className="mt-1 max-w-xs opacity-60">{prospect.source_names}</p> : null}
                  </td>
                  <td className="p-3">
                    {prospect.prospect_group_id ? (
                      <Link className="text-xs font-bold underline" href={`/admin/platform/vendor-prospects/groups/${encodeURIComponent(prospect.prospect_group_id)}`}>
                        Manage company account
                      </Link>
                    ) : (
                      <VendorProspectStatusControl id={prospect.id} initialStatus={prospect.campaign_status} />
                    )}
                    {!prospect.free_offer_eligible ? <p className="mt-1 text-[10px] opacity-60">Outside initial Egypt sales cohort</p> : null}
                  </td>
                </tr>
              );
            })}
            {!prospects.length ? <tr><td colSpan={6} className="p-8 text-center text-sm opacity-60">No prospects match these filters.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between text-sm">
        <span>Page {page} of {totalPages} · {total.toLocaleString()} matching prospects</span>
        <span className="flex gap-3">
          {page > 1 ? <Link className="underline" href={{ pathname: '/admin/platform/vendor-prospects', query: { ...filters, page: String(page - 1) } }}>Previous</Link> : null}
          {page < totalPages ? <Link className="underline" href={{ pathname: '/admin/platform/vendor-prospects', query: { ...filters, page: String(page + 1) } }}>Next</Link> : null}
        </span>
      </footer>
    </div>
  );
}
