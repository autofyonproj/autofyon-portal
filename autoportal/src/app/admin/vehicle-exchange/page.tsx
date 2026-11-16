import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import { SELLABLE_TYPES } from '@/lib/typology';
import VehicleExchangeAdminClient from '@/components/VehicleExchangeAdminClient';

export const dynamic = 'force-dynamic';

export default async function VehicleExchangePage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/vehicle-exchange', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const placeholders = SELLABLE_TYPES.map(() => '?').join(', ');
  const [vendors, vehicles, proposals] = await Promise.all([
    query<{ id: string; name: string; slug: string }>(
      `SELECT id, name, slug FROM businesses
        WHERE status = 'active' AND published = 1 AND type_id IN (${placeholders})
        ORDER BY name`,
      [...SELLABLE_TYPES],
    ),
    query<{ id: string; title: string; title_ar: string | null; seller_name: string }>(
      `SELECT u.id, u.title, u.title_ar, b.name AS seller_name
         FROM units u JOIN businesses b ON b.id = u.seller_business_id
        WHERE u.published = 1 AND u.status <> 'inactive'
        ORDER BY u.updated_at DESC LIMIT 500`,
    ),
    query<{
      id: string; vendor_business_id: string; direction: 'import' | 'export';
      external_vehicle_id: string; unit_id: string | null; version_hash: string;
      payload: string; status: 'pending' | 'approved' | 'rejected';
      rejection_reason: string | null; created_at: string; decided_at: string | null;
      vendor_name: string; vendor_slug: string;
    }>(
      `SELECT p.id, p.vendor_business_id, p.direction, p.external_vehicle_id, p.unit_id,
              p.version_hash, p.payload, p.status, p.rejection_reason, p.created_at,
              p.decided_at, b.name AS vendor_name, b.slug AS vendor_slug
         FROM vehicle_exchange_proposals p
         JOIN businesses b ON b.id = p.vendor_business_id
        ORDER BY CASE p.status WHEN 'pending' THEN 0 ELSE 1 END, p.created_at DESC
        LIMIT 100`,
    ),
  ]);
  const sites = await query<{
    vendor_business_id: string; enabled: number; updated_at: string;
    vendor_name: string; vendor_slug: string;
  }>(
    `SELECT x.vendor_business_id, x.enabled, x.updated_at,
            b.name AS vendor_name, b.slug AS vendor_slug
       FROM vehicle_exchange_sites x JOIN businesses b ON b.id = x.vendor_business_id
      ORDER BY b.name`,
  );

  return (
    <div className="space-y-6">
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Platform admin · bidirectional, approval-gated exchange</p>
        <h1 className="mt-1 text-2xl font-bold">Vehicle minisite exchange</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Cars remain independently owned by each site. A proposal copies a version of its specs, approved carousel media, social links, and mini-site design. Nothing imports or exports until a platform admin approves that exact version.
        </p>
      </header>
      <VehicleExchangeAdminClient
        vendors={vendors}
        vehicles={vehicles}
        initialData={{ sites, proposals }}
      />
    </div>
  );
}
