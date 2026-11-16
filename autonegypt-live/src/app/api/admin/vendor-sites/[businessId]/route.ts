import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import {
  CONNECTED_SITE_FEATURES,
  normalizeSiteOrigin,
  parseConnectedSiteFeatures,
  type ConnectedSiteFeature,
} from '@/lib/connected-vendor-sites';
import { assertSellable, TypologyError } from '@/lib/typology';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function getRequestUser() {
  const requestHeaders = await headers();
  return getAdminUser(new Request('https://autofyon.com/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const user = await getRequestUser();
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'platform_admin') return json({ error: 'platform admin required' }, 403);

  const { businessId } = await params;
  const business = await queryOne<{ id: string; slug: string; name: string; name_ar: string | null }>(
    `SELECT id, slug, name, name_ar FROM businesses
      WHERE id = ? AND status = 'active' AND published = 1`,
    [businessId],
  );
  if (!business) return json({ error: 'active vendor not found' }, 404);
  try {
    await assertSellable(businessId);
  } catch (reason) {
    if (reason instanceof TypologyError) return json({ error: reason.message }, 409);
    throw reason;
  }

  const site = await queryOne<{ allowed_origin: string; enabled: number; features: string }>(
    `SELECT allowed_origin, enabled, features FROM connected_vendor_sites
      WHERE vendor_business_id = ?`,
    [businessId],
  );
  return json({
    business,
    site: site
      ? {
          allowedOrigin: site.allowed_origin,
          enabled: site.enabled === 1,
          features: parseConnectedSiteFeatures(site.features),
        }
      : { allowedOrigin: '', enabled: false, features: [] },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const user = await getRequestUser();
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'platform_admin') return json({ error: 'platform admin required' }, 403);

  const { businessId } = await params;
  const business = await queryOne<{ id: string }>(
    `SELECT id FROM businesses
      WHERE id = ? AND status = 'active' AND published = 1`,
    [businessId],
  );
  if (!business) return json({ error: 'active vendor not found' }, 404);
  try {
    await assertSellable(businessId);
  } catch (reason) {
    if (reason instanceof TypologyError) return json({ error: reason.message }, 409);
    throw reason;
  }

  let body: { allowedOrigin?: unknown; enabled?: unknown; features?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }
  const allowedOrigin = normalizeSiteOrigin(body.allowedOrigin);
  if (!allowedOrigin) {
    return json({ error: 'allowedOrigin must be an HTTPS origin (HTTP is allowed only for localhost)' }, 400);
  }
  if (typeof body.enabled !== 'boolean') {
    return json({ error: 'enabled must be a boolean' }, 400);
  }
  if (
    !Array.isArray(body.features) ||
    body.features.some((feature) =>
      typeof feature !== 'string' || !CONNECTED_SITE_FEATURES.includes(feature as ConnectedSiteFeature),
    )
  ) {
    return json({ error: 'features contains an unsupported connected-site feature' }, 400);
  }
  const features = [...new Set(body.features as ConnectedSiteFeature[])];
  if (body.enabled && features.length === 0) {
    return json({ error: 'select at least one feature before enabling the connected site' }, 400);
  }

  const now = new Date().toISOString();
  await execute(
    `INSERT INTO connected_vendor_sites
       (vendor_business_id, allowed_origin, enabled, features, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(vendor_business_id) DO UPDATE SET
       allowed_origin = excluded.allowed_origin,
       enabled = excluded.enabled,
       features = excluded.features,
       updated_at = excluded.updated_at`,
    [businessId, allowedOrigin, body.enabled ? 1 : 0, JSON.stringify(features), now, now],
  );
  return json({ ok: true, site: { allowedOrigin, enabled: body.enabled, features } });
}
