import { headers } from 'next/headers';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function admin() {
  const requestHeaders = await headers();
  return getAdminUser(new Request('http://localhost/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
}

async function loadOffer(unitId: string, vendorId: string) {
  return queryOne<{
    id: string;
    unit_id: string;
    vendor_business_id: string;
    price_egp: number | null;
    price_currency: string;
    negotiable: number;
    status: string;
    availability_note: string | null;
    availability_note_ar: string | null;
    published: number;
    unit_slug: string;
    unit_title: string;
    unit_title_ar: string | null;
    unit_published: number;
    vendor_name: string;
    vendor_name_ar: string | null;
    vendor_slug: string;
  }>(
    `SELECT o.id, o.unit_id, o.vendor_business_id, o.price_egp, o.price_currency,
            o.negotiable, o.status, o.availability_note, o.availability_note_ar,
            o.published, u.slug AS unit_slug, u.title AS unit_title,
            u.title_ar AS unit_title_ar, u.published AS unit_published,
            b.name AS vendor_name, b.name_ar AS vendor_name_ar, b.slug AS vendor_slug
       FROM unit_vendor_offers o
       JOIN units u ON u.id = o.unit_id
       JOIN businesses b ON b.id = o.vendor_business_id
      WHERE o.unit_id = ? AND o.vendor_business_id = ?`,
    [unitId, vendorId],
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await admin();
  if (!user) return json({ error: 'unauthorized' }, 401);
  const { id } = await params;
  const vendorId = new URL(request.url).searchParams.get('vendor_business_id');
  if (!vendorId || !canAccessBusiness(user, vendorId)) return json({ error: 'forbidden' }, 403);
  const offer = await loadOffer(id, vendorId);
  if (!offer) return json({ error: 'vendor offer not found' }, 404);
  return json({ offer });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await admin();
  if (!user) return json({ error: 'unauthorized' }, 401);
  let body: {
    vendor_business_id?: string;
    price_egp?: number | null;
    price_currency?: string;
    negotiable?: number;
    status?: string;
    availability_note?: string | null;
    availability_note_ar?: string | null;
    published?: number;
  };
  try { body = await request.json() as typeof body; }
  catch { return json({ error: 'body must be valid JSON' }, 400); }
  if (!body.vendor_business_id || !canAccessBusiness(user, body.vendor_business_id)) {
    return json({ error: 'forbidden' }, 403);
  }
  const { id } = await params;
  const offer = await loadOffer(id, body.vendor_business_id);
  if (!offer) return json({ error: 'vendor offer not found' }, 404);

  if (body.price_egp !== undefined
    && body.price_egp !== null
    && (!Number.isInteger(body.price_egp) || body.price_egp <= 0)) {
    return json({ error: 'price_egp must be a positive whole number or null' }, 400);
  }
  if (body.negotiable !== undefined && ![0, 1].includes(body.negotiable)) {
    return json({ error: 'negotiable must be 0 or 1' }, 400);
  }
  if (body.status !== undefined
    && !['available', 'reserved', 'sold', 'rented', 'inactive'].includes(body.status)) {
    return json({ error: 'invalid offer status' }, 400);
  }
  if (body.published !== undefined && ![0, 1].includes(body.published)) {
    return json({ error: 'published must be 0 or 1' }, 400);
  }
  for (const field of ['availability_note', 'availability_note_ar'] as const) {
    if (body[field] !== undefined && body[field] !== null && body[field]!.length > 500) {
      return json({ error: `${field} must be 500 characters or fewer` }, 400);
    }
  }
  if (body.published === 1 && offer.unit_published !== 1) {
    return json({ error: 'the car owner must publish the vehicle before a vendor offer can go live' }, 409);
  }
  if (body.published === 1 && (body.status ?? offer.status) === 'inactive') {
    return json({ error: 'change availability from inactive before publishing this offer' }, 409);
  }

  const fields: string[] = [];
  const values: unknown[] = [];
  for (const field of [
    'price_egp', 'price_currency', 'negotiable', 'status',
    'availability_note', 'availability_note_ar', 'published',
  ] as const) {
    if (body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(body[field]);
    }
  }
  if (!fields.length) return json({ error: 'no offer fields to update' }, 400);
  const now = new Date().toISOString();
  fields.push('updated_at = ?');
  values.push(now, offer.id);
  await execute(`UPDATE unit_vendor_offers SET ${fields.join(', ')} WHERE id = ?`, values);

  if (body.price_egp !== undefined && body.price_egp !== offer.price_egp && body.price_egp !== null) {
    await execute(
      `INSERT INTO price_snapshots
         (id, subject_type, subject_id, price_egp, currency, source_type, source_url, captured_by, captured_at)
       VALUES (?, 'offer', ?, ?, ?, 'dealer_listing', ?, ?, ?)`,
      [
        `ps_${offer.id}_${Date.now().toString(36)}`,
        offer.id,
        body.price_egp,
        body.price_currency ?? offer.price_currency,
        `/${offer.vendor_slug}/u/${offer.unit_slug}`,
        user.id,
        now,
      ],
    );
  }
  return json({ ok: true, id: offer.id });
}
