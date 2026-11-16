import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';
import { SELLABLE_TYPES } from '@/lib/typology';
import UnitDistributionClient from '@/components/UnitDistributionClient';

export default async function UnitDistributionPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('http://localhost/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || (user.role !== 'platform_admin' && !canAccessBusiness(user, id))) notFound();

  const unit = await queryOne<{
    id: string; slug: string; title: string; title_ar: string | null;
    seller_business_id: string; seller_name: string; seller_name_ar: string | null;
  }>(
    `SELECT u.id, u.slug, u.title, u.title_ar, u.seller_business_id,
            b.name AS seller_name, b.name_ar AS seller_name_ar
       FROM units u JOIN businesses b ON b.id = u.seller_business_id
      WHERE u.id = ? AND u.seller_business_id = ?`,
    [unitId, id],
  );
  if (!unit) notFound();

  const placeholders = SELLABLE_TYPES.map(() => '?').join(', ');
  const [vendors, offers] = await Promise.all([
    query<{
      id: string; name: string; name_ar: string | null; slug: string; type_id: string;
    }>(
      `SELECT id, name, name_ar, slug, type_id FROM businesses
        WHERE status = 'active' AND published = 1 AND type_id IN (${placeholders})
        ORDER BY name`,
      [...SELLABLE_TYPES],
    ),
    query<{
      id: string; vendor_business_id: string; price_egp: number | null;
      status: string; published: number; vendor_name: string; vendor_name_ar: string | null;
      vendor_slug: string; vendor_type: string;
    }>(
      `SELECT o.id, o.vendor_business_id, o.price_egp, o.status, o.published,
              b.name AS vendor_name, b.name_ar AS vendor_name_ar,
              b.slug AS vendor_slug, b.type_id AS vendor_type
         FROM unit_vendor_offers o
         JOIN businesses b ON b.id = o.vendor_business_id
        WHERE o.unit_id = ?
        ORDER BY CASE WHEN o.vendor_business_id = ? THEN 0 ELSE 1 END, b.name`,
      [unitId, unit.seller_business_id],
    ),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href={`/admin/showroom/${id}/inventory`} className="hover:underline">Vehicle inventory</Link><span>/</span>
        <span>Car mini-site dashboard</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">Car mini-site dashboard</h1>
        <p className="mt-1 text-sm opacity-70">
          {unit.title_ar || unit.title} · Owner: {unit.seller_name_ar || unit.seller_name}
        </p>
        <p className="mt-2 text-sm opacity-70">
          The owner controls the car record and shared media. Each vendor receives a separate offer and can edit only that offer and its own business contact details.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
          <Link href={`/admin/showroom/${id}/inventory/${unitId}`} className="hover:underline">Edit car details →</Link>
          <Link href={`/admin/showroom/${id}/inventory/${unitId}/content`} className="hover:underline">Manage car media →</Link>
          <Link href={`/admin/site-builder?targetType=unit&targetId=${encodeURIComponent(unitId)}`} className="hover:underline">Customize mini-site →</Link>
        </div>
      </header>
      <UnitDistributionClient
        unitId={unit.id}
        unitSlug={unit.slug}
        ownerBusinessId={unit.seller_business_id}
        canManageDistribution={user.role === 'platform_admin'}
        vendors={vendors}
        initialOffers={offers}
      />
    </div>
  );
}
