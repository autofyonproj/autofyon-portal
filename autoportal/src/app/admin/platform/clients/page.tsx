import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ClientRow {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  custom_domain: string | null;
  type_id: string;
  status: string;
  published: number;
  subscription_tier: string | null;
  vehicle_count: number;
  admin_count: number;
}

export default async function PlatformClientsPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/clients', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const clients = await query<ClientRow>(
    `SELECT b.id, b.name, b.name_ar, b.slug, b.custom_domain, b.type_id,
            b.status, b.published, b.subscription_tier,
            (SELECT COUNT(*) FROM units u
              WHERE u.seller_business_id = b.id AND u.status <> 'inactive') AS vehicle_count,
            (SELECT COUNT(DISTINCT m.admin_user_id) FROM business_memberships m
              WHERE m.business_id = b.id AND m.status = 'active') AS admin_count
       FROM businesses b
      WHERE b.parent_business_id IS NULL
        AND b.type_id IN ('showroom', 'main_agency', 'distributor', 'used_car_dealer')
      ORDER BY CASE WHEN b.id = 'biz_auto_one_egypt' THEN 0 ELSE 1 END, b.name`,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <span>Clients</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">AUTOFYON central portal · client account management</p>
        <h1 className="mt-1 text-2xl font-bold">Client accounts</h1>
        <p className="mt-2 max-w-4xl text-sm text-neutral-600">
          Manage each client from the AUTOFYON dashboard. A client’s custom domain is its public website; it is not the admin entry point. Dashboard access stays on this portal and requires an authorized admin session.
        </p>
      </header>

      <div className="space-y-3">
        {clients.map((client) => (
          <article key={client.id} className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">{client.name_ar || client.name}</h2>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-800">{client.type_id.replaceAll('_', ' ')}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${client.status === 'active' ? 'bg-green-50 text-green-800' : 'bg-neutral-100 text-neutral-600'}`}>{client.status}{client.published ? ' · public' : ' · unpublished'}</span>
              </div>
              {client.name_ar ? <p className="text-sm opacity-60">{client.name}</p> : null}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs opacity-70">
                <span>AUTOFYON page: <strong>/{client.slug}</strong></span>
                {client.custom_domain ? <span>Client website: <strong>{client.custom_domain}</strong></span> : <span>No custom domain assigned</span>}
                <span>{client.vehicle_count} vehicles</span>
                <span>{client.admin_count} authorized account(s)</span>
                <span>Plan: {client.subscription_tier || 'not set'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/showroom/${encodeURIComponent(client.id)}`} className="rounded-lg bg-neutral-900 px-4 py-2.5 text-center text-sm font-bold text-white hover:opacity-85">
                Manage client dashboard
              </Link>
              <Link href={`/${encodeURIComponent(client.slug)}`} target="_blank" className="rounded-lg border border-black/15 px-4 py-2.5 text-center text-sm font-bold hover:bg-black/5">
                AUTOFYON page
              </Link>
              {client.custom_domain ? (
                <a href={`https://${client.custom_domain}`} target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2.5 text-center text-sm font-bold hover:bg-black/5">
                  Public website
                </a>
              ) : null}
            </div>
          </article>
        ))}
        {!clients.length ? <p className="rounded-xl border border-dashed border-black/20 p-6 text-sm opacity-60">No client accounts are registered yet.</p> : null}
      </div>
    </div>
  );
}
