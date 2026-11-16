import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';
import UnitVendorOfferEditor from '@/components/UnitVendorOfferEditor';

export default async function VendorUnitOfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ vendor_business_id?: string }>;
}) {
  const { unitId } = await params;
  const { vendor_business_id: vendorId } = await searchParams;
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('http://localhost/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || !vendorId || !canAccessBusiness(user, vendorId)) notFound();

  const offer = await queryOne<{
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
    vendor_name: string;
    vendor_name_ar: string | null;
    vendor_slug: string;
  }>(
    `SELECT o.unit_id, o.vendor_business_id, o.price_egp, o.price_currency,
            o.negotiable, o.status, o.availability_note, o.availability_note_ar,
            o.published, u.slug AS unit_slug, u.title AS unit_title,
            u.title_ar AS unit_title_ar, b.name AS vendor_name,
            b.name_ar AS vendor_name_ar, b.slug AS vendor_slug
       FROM unit_vendor_offers o
       JOIN units u ON u.id = o.unit_id
       JOIN businesses b ON b.id = o.vendor_business_id
      WHERE o.unit_id = ? AND o.vendor_business_id = ?`,
    [unitId, vendorId],
  );
  if (!offer) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <UnitVendorOfferEditor offer={offer} />
    </div>
  );
}
