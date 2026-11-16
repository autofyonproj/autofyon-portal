import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import {
  loadCustomSiteProfile, loadCustomSiteVehicleOverrides, SITE_TEMPLATES,
} from '@/lib/site-builder';
import CustomDomainSitesClient from '@/components/CustomDomainSitesClient';

export const dynamic = 'force-dynamic';

export default async function CustomDomainSitesPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/custom-sites', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const businesses = await query<{
    id: string;
    name: string;
    slug: string;
    custom_domain: string;
  }>(
    `SELECT id, name, slug, custom_domain
       FROM businesses
      WHERE custom_domain IS NOT NULL AND trim(custom_domain) <> ''
        AND status = 'active' AND published = 1
      ORDER BY name`,
  );
  const sites = await Promise.all(businesses.map(async (business) => {
    const [profile, vehicles] = await Promise.all([
      loadCustomSiteProfile(business.id),
      query<{
        id: string; title: string; title_ar: string | null; year: number | null;
        mileage_km: number | null; price_egp: number | null; price_currency: string;
        status: string;
      }>(
        `SELECT id, title, title_ar, year, mileage_km, price_egp, price_currency, status
           FROM units
          WHERE seller_business_id = ? AND published = 1 AND status <> 'inactive'
          ORDER BY updated_at DESC
          LIMIT 100`,
        [business.id],
      ),
    ]);
    const overrides = await loadCustomSiteVehicleOverrides(business.id, vehicles.map((vehicle) => vehicle.id));
    return {
      ...business,
      customDomain: business.custom_domain,
      ...profile,
      vehicles: vehicles.map((vehicle) => ({
        id: vehicle.id,
        title: vehicle.title,
        titleAr: vehicle.title_ar,
        year: vehicle.year,
        mileageKm: vehicle.mileage_km,
        priceEgp: vehicle.price_egp,
        currency: vehicle.price_currency,
        status: vehicle.status,
        overrides: overrides[vehicle.id] ?? {},
      })),
    };
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link>
        <span>/</span>
        <span>Custom-domain sites</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Platform admin · AUTOFYON-hosted client sites</p>
        <h1 className="mt-1 text-2xl font-bold">Custom-domain site templates</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Assign an independent presentation to a client domain while keeping the AUTOFYON slug as the marketplace presence. Vehicle information remains sourced from AUTOFYON inventory.
        </p>
      </header>
      <CustomDomainSitesClient initialSites={sites} templates={SITE_TEMPLATES} />
    </div>
  );
}
