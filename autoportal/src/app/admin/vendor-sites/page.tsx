import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import { SELLABLE_TYPES } from '@/lib/typology';
import ConnectedVendorSitesClient from '@/components/ConnectedVendorSitesClient';

export const dynamic = 'force-dynamic';

export default async function ConnectedVendorSitesPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/vendor-sites', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const placeholders = SELLABLE_TYPES.map(() => '?').join(', ');
  const vendors = await query<{
    id: string;
    name: string;
    name_ar: string | null;
    slug: string;
  }>(
    `SELECT id, name, name_ar, slug FROM businesses
      WHERE status = 'active' AND published = 1 AND type_id IN (${placeholders})
      ORDER BY name`,
    [...SELLABLE_TYPES],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link>
        <span>/</span>
        <span>Connected vendor sites</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Platform admin · connected-only hosting</p>
        <h1 className="mt-1 text-2xl font-bold">External vendor sites</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Enable a vendor’s external website to read selected, public AUTOFYON features live.
          Nothing is exported or copied to the vendor host. Published shared vehicles remain centrally managed.
        </p>
      </header>
      <ConnectedVendorSitesClient vendors={vendors} />
    </div>
  );
}
