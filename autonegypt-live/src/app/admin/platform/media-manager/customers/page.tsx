import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import MediaManagerCustomersClient from '@/components/MediaManagerCustomersClient';

export const dynamic = 'force-dynamic';

export default async function MediaManagerCustomersPage() {
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin/platform/media-manager/customers', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const user = await getAdminUser(request);
  if (!user || user.role !== 'platform_admin') notFound();

  return (
    <div className="space-y-6">
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">AUTOFYON platform control</p>
        <h1 className="mt-1 text-2xl font-bold">AUTOFYON customer follow-up</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Track registered business owners, verify paid plans manually, and manage renewals and follow-up.
          Free customers keep an AUTOFYON.com promotion in Media Manager exports and eligible AUTOFYON showroom sites.
          A manually verified paid entitlement removes that promotion only while the plan is active and within its paid-through date.
        </p>
        <p className="mt-2 max-w-3xl text-xs text-neutral-500">
          Anonymous local-only users are not identifiable or listed here. This dashboard does not process payments.
          This status is shared across the Media Manager and showroom minisites. Any additional AUTOFYON service must check the same plan before removing its sponsorship.
        </p>
      </header>
      <MediaManagerCustomersClient />
    </div>
  );
}
