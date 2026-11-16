import { queryOne } from '@/lib/db';
import { contactFor } from '@/lib/minisite';
import {
  parseConnectedSiteFeatures,
  type ConnectedSiteFeature,
} from '@/lib/connected-vendor-sites';
import { loadSiteProfile } from '@/lib/site-builder';
import { unitsBySeller, type UnitCard } from '@/lib/units';


type RouteContext = { params: Promise<{ slug: string }> };

async function configuredSite(slug: string) {
  return queryOne<{
    id: string;
    slug: string;
    name: string;
    name_ar: string | null;
    type_id: string;
    allowed_origin: string;
    features: string;
  }>(
    `SELECT b.id, b.slug, b.name, b.name_ar, b.type_id,
            c.allowed_origin, c.features
       FROM connected_vendor_sites c
       JOIN businesses b ON b.id = c.vendor_business_id
      WHERE b.slug = ? AND b.status = 'active' AND b.published = 1
        AND c.enabled = 1
      LIMIT 1`,
    [slug],
  );
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

function denied() {
  return Response.json({ error: 'connected site is not enabled for this origin' }, { status: 403 });
}

function externalVehicleCard(vehicle: UnitCard, requestUrl: string) {
  return {
    ...vehicle,
    href: new URL(vehicle.href, requestUrl).toString(),
    imageUrl: vehicle.imageUrl ? new URL(vehicle.imageUrl, requestUrl).toString() : null,
  };
}

export async function OPTIONS(request: Request, { params }: RouteContext) {
  const origin = request.headers.get('origin');
  if (!origin) return denied();
  const { slug } = await params;
  const site = await configuredSite(slug);
  if (!site || origin.toLowerCase() !== site.allowed_origin.toLowerCase()) return denied();
  return new Response(null, { status: 204, headers: corsHeaders(site.allowed_origin) });
}

export async function GET(request: Request, { params }: RouteContext) {
  const origin = request.headers.get('origin');
  if (!origin) return denied();
  const { slug } = await params;
  const site = await configuredSite(slug);
  if (!site || origin.toLowerCase() !== site.allowed_origin.toLowerCase()) return denied();

  const features = parseConnectedSiteFeatures(site.features);
  const selected = new Set<ConnectedSiteFeature>(features);
  const locale = new URL(request.url).searchParams.get('locale') === 'ar' ? 'ar' : 'en';
  const payload: Record<string, unknown> = {
    vendor: { slug: site.slug },
    features,
  };

  if (selected.has('profile')) {
    const siteProfile = await loadSiteProfile('business', site.id);
    payload.profile = {
      id: site.id,
      slug: site.slug,
      name: site.name,
      name_ar: site.name_ar,
      type_id: site.type_id,
      siteProfile,
    };
  }
  if (selected.has('contact')) {
    payload.contact = await contactFor(site.id);
  }
  if (selected.has('inventory') || selected.has('shared_vehicle_offers')) {
    const vehicles = await unitsBySeller(site.id, { locale });
    if (selected.has('inventory')) {
      payload.inventory = vehicles
        .filter((vehicle) => !vehicle.isShared)
        .map((vehicle) => externalVehicleCard(vehicle, request.url));
    }
    if (selected.has('shared_vehicle_offers')) {
      payload.sharedVehicleOffers = vehicles
        .filter((vehicle) => vehicle.isShared)
        .map((vehicle) => externalVehicleCard(vehicle, request.url));
    }
  }

  return Response.json(payload, { headers: corsHeaders(site.allowed_origin) });
}
