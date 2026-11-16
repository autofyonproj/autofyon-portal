import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ProspectGroupRow {
  id: string;
  display_name: string;
  review_status: 'candidate' | 'confirmed' | 'separated';
  campaign_status: string;
  next_follow_up_at: string | null;
  records: number;
  locations: number;
  eligible_records: number;
  cities: string;
}

export default async function VendorProspectGroupsPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects/groups', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const groups = await query<ProspectGroupRow>(
    `SELECT g.id, g.display_name, g.review_status, g.campaign_status,
            g.next_follow_up_at, COUNT(p.id) AS records,
            COUNT(DISTINCT NULLIF(p.city, '')) AS locations,
            SUM(p.free_offer_eligible) AS eligible_records,
            GROUP_CONCAT(DISTINCT NULLIF(p.city, '')) AS cities
       FROM vendor_prospect_groups g
       LEFT JOIN vendor_prospects p ON p.prospect_group_id = g.id
      GROUP BY g.id
      ORDER BY CASE g.review_status WHEN 'candidate' THEN 0 WHEN 'confirmed' THEN 1 ELSE 2 END,
               g.next_follow_up_at IS NULL, g.next_follow_up_at, g.display_name`,
  );
  const candidates = groups.filter((group) => group.review_status === 'candidate').length;
  const confirmed = groups.filter((group) => group.review_status === 'confirmed').length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <Link href="/admin/platform/vendor-prospects" className="hover:underline">Vendor prospects</Link><span>/</span>
        <span>Company groups</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">CRM · prospect accounts and branches</p>
        <h1 className="mt-1 text-2xl font-bold">Company groups &amp; follow-up</h1>
        <p className="mt-2 max-w-4xl text-sm text-neutral-600">
          Same-name directory records are suggested as one prospective client, with every original record preserved as a possible branch or service location. Confirm or separate each suggestion before treating it as one company. No messages are sent here.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{groups.length.toLocaleString()}</strong><p className="text-xs opacity-60">Group suggestions &amp; review history</p></div>
        <div className="rounded-xl border border-amber-700/20 bg-amber-50 p-4"><strong className="text-2xl">{candidates.toLocaleString()}</strong><p className="text-xs opacity-70">Need admin identity review</p></div>
        <div className="rounded-xl border border-green-700/20 bg-green-50 p-4"><strong className="text-2xl">{confirmed.toLocaleString()}</strong><p className="text-xs opacity-70">Confirmed prospective clients</p></div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full min-w-[60rem] text-start text-sm">
          <thead className="bg-black/[.04] text-xs uppercase">
            <tr>
              <th className="p-3 text-start">Prospective client</th>
              <th className="p-3 text-start">Group review</th>
              <th className="p-3 text-start">Records / locations</th>
              <th className="p-3 text-start">Offer leads</th>
              <th className="p-3 text-start">Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-t border-black/10 align-top">
                <td className="p-3">
                  <Link className="font-bold underline" href={`/admin/platform/vendor-prospects/groups/${encodeURIComponent(group.id)}`}>{group.display_name}</Link>
                  {group.cities ? <p className="mt-1 max-w-md text-xs opacity-60">{group.cities}</p> : null}
                </td>
                <td className="p-3">
                  <span className={`rounded px-2 py-1 text-xs font-bold ${group.review_status === 'candidate' ? 'bg-amber-100 text-amber-900' : group.review_status === 'confirmed' ? 'bg-green-100 text-green-900' : 'bg-neutral-100 text-neutral-600'}`}>
                    {group.review_status === 'candidate' ? 'Suggested · review' : group.review_status === 'confirmed' ? 'Confirmed company' : 'Separated'}
                  </span>
                </td>
                <td className="p-3">{group.records} records · {group.locations} cities</td>
                <td className="p-3">{group.eligible_records ?? 0}</td>
                <td className="p-3">{group.next_follow_up_at ? new Date(group.next_follow_up_at).toLocaleString() : 'Not scheduled'}</td>
              </tr>
            ))}
            {!groups.length ? <tr><td colSpan={5} className="p-8 text-center text-sm opacity-60">No same-name prospect groups were found.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
