import { headers } from 'next/headers';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { execute, query, queryOne } from '@/lib/db';
import { assertSellable, TypologyError } from '@/lib/typology';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function admin() {
  const requestHeaders = await headers();
  return getAdminUser(new Request('http://localhost/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
}

async function requirePlatformAdmin() {
  const user = await admin();
  if (!user) return { error: json({ error: 'unauthorized' }, 401) } as const;
  if (user.role !== 'platform_admin') return { error: json({ error: 'platform admin required' }, 403) } as const;
  return { user } as const;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await admin();
  if (!user) return json({ error: 'unauthorized' }, 401);
  const { id } = await params;
  const unit = await queryOne<{ id: string; seller_business_id: string }>(
    'SELECT id, seller_business_id FROM units WHERE id = ?', [id],
  );
  if (!unit) return json({ error: 'vehicle not found' }, 404);
  if (user.role !== 'platform_admin' && !canAccessBusiness(user, unit.seller_business_id)) {
    return json({ error: 'forbidden' }, 403);
  }

  const offers = await query(
    `SELECT o.id, o.unit_id, o.vendor_business_id, o.price_egp, o.price_currency,
            o.negotiable, o.status, o.availability_note, o.availability_note_ar,
            o.published, b.name AS vendor_name, b.name_ar AS vendor_name_ar,
            b.slug AS vendor_slug, b.type_id AS vendor_type
       FROM unit_vendor_offers o
       JOIN businesses b ON b.id = o.vendor_business_id
      WHERE o.unit_id = ?
      ORDER BY CASE WHEN o.vendor_business_id = (
        SELECT seller_business_id FROM units WHERE id = ?
      ) THEN 0 ELSE 1 END, b.name`,
    [id, id],
  );
  return json({ offers });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePlatformAdmin();
  if ('error' in auth) return auth.error;
  const { id } = await params;
  let body: { vendor_business_id?: string };
  try { body = await request.json() as { vendor_business_id?: string }; }
  catch { return json({ error: 'body must be valid JSON' }, 400); }
  if (!body.vendor_business_id) return json({ error: 'vendor_business_id is required' }, 400);

  const unit = await queryOne<{ seller_business_id: string }>(
    'SELECT seller_business_id FROM units WHERE id = ?', [id],
  );
  if (!unit) return json({ error: 'vehicle not found' }, 404);
  if (unit.seller_business_id === body.vendor_business_id) {
    return json({ error: 'the original seller already has this vehicle offer' }, 409);
  }
  try {
    await assertSellable(body.vendor_business_id);
  } catch (reason) {
    if (reason instanceof TypologyError) return json({ error: reason.message }, 409);
    throw reason;
  }

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM unit_vendor_offers WHERE unit_id = ? AND vendor_business_id = ?',
    [id, body.vendor_business_id],
  );
  if (existing) return json({ error: 'this vehicle is already assigned to that vendor' }, 409);

  const offerId = `uvo_${id}_${body.vendor_business_id}`;
  await execute(
    `INSERT INTO unit_vendor_offers
       (id, unit_id, vendor_business_id, price_egp, price_currency, negotiable,
        status, published, created_at, updated_at)
     VALUES (?, ?, ?, NULL, 'EGP', 0, 'available', 0, ?, ?)`,
    [offerId, id, body.vendor_business_id, new Date().toISOString(), new Date().toISOString()],
  );
  return json({ ok: true, id: offerId }, 201);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePlatformAdmin();
  if ('error' in auth) return auth.error;
  const { id } = await params;
  let body: { vendor_business_id?: string; published?: number };
  try { body = await request.json() as { vendor_business_id?: string; published?: number }; }
  catch { return json({ error: 'body must be valid JSON' }, 400); }
  if (!body.vendor_business_id || ![0, 1].includes(body.published ?? -1)) {
    return json({ error: 'vendor_business_id and published (0 or 1) are required' }, 400);
  }
  const offer = await queryOne<{ id: string; seller_business_id: string; unit_published: number }>(
    `SELECT id, u.seller_business_id, u.published AS unit_published
       FROM unit_vendor_offers o JOIN units u ON u.id = o.unit_id
      WHERE o.unit_id = ? AND o.vendor_business_id = ?`,
    [id, body.vendor_business_id],
  );
  if (!offer) return json({ error: 'vendor offer not found' }, 404);
  if (offer.seller_business_id === body.vendor_business_id && body.published === 0) {
    return json({ error: 'the original seller listing cannot be unlinked from its own vehicle' }, 409);
  }
  if (body.published === 1 && offer.unit_published !== 1) {
    return json({ error: 'publish the car listing before distributing it to vendors' }, 409);
  }
  await execute(
    'UPDATE unit_vendor_offers SET published = ?, updated_at = ? WHERE id = ?',
    [body.published, new Date().toISOString(), offer.id],
  );
  return json({ ok: true, id: offer.id, published: body.published });
}
