import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';
import {
  VENDOR_PROSPECT_STATUSES,
  VENDOR_PROSPECT_STATUS_LABELS,
  type VendorProspectStatus,
} from '@/lib/vendor-prospects';
import VendorProspectGroupClient from '@/components/VendorProspectGroupClient';

export const dynamic = 'force-dynamic';

interface GroupRow {
  id: string;
  display_name: string;
  review_status: 'candidate' | 'confirmed' | 'separated';
  campaign_status: VendorProspectStatus;
  next_follow_up_at: string | null;
}

interface MemberRow {
  id: string;
  name: string;
  original_category: string;
  original_subcategory: string;
  category_key: string;
  brand: string;
  address: string;
  district: string;
  city: string;
  phones: string;
  email: string;
  contact_name: string;
  source_names: string;
  source_count: number;
  country_code: string;
  free_offer_eligible: number;
  campaign_status: VendorProspectStatus;
}

interface ActivityRow {
  id: string;
  activity_type: string;
  summary: string;
  outcome: string;
  next_follow_up_at: string | null;
  created_at: string;
  admin_name: string | null;
}

function countryLabel(value: string) {
  return value === 'EG' ? 'Egypt' : value === 'SA' ? 'Saudi Arabia' : value === 'QA' ? 'Qatar' : 'Unknown';
}

export default async function VendorProspectGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects/groups', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const group = await queryOne<GroupRow>(
    `SELECT id, display_name, review_status, campaign_status, next_follow_up_at
       FROM vendor_prospect_groups WHERE id = ?`,
    [groupId],
  );
  if (!group) notFound();
  const [members, activities] = await Promise.all([
    query<MemberRow>(
      `SELECT id, name, original_category, original_subcategory, category_key,
              brand, address, district, city, phones, email, contact_name,
              source_names, source_count, country_code, free_offer_eligible,
              campaign_status
         FROM vendor_prospects
        WHERE prospect_group_id = ?
        ORDER BY country_code, city, name`,
      [groupId],
    ),
    query<ActivityRow>(
      `SELECT a.id, a.activity_type, a.summary, a.outcome, a.next_follow_up_at,
              a.created_at, u.name AS admin_name
         FROM vendor_prospect_activities a
         LEFT JOIN admin_users u ON u.id = a.created_by
        WHERE a.group_id = ?
        ORDER BY a.created_at DESC
        LIMIT 100`,
      [groupId],
    ),
  ]);
  const eligible = members.filter((member) => member.free_offer_eligible).length;
  const categoryLabel = new Map([
    ['dealer', 'Car dealer'], ['showroom', 'Showroom'], ['authorized_agent', 'Authorized agent'],
    ['distributor', 'Distributor'], ['agent', 'Agent'], ['parts_supplier', 'Parts supplier'],
    ['service_center', 'Service / maintenance'], ['rental_company', 'Rental company'],
    ['insurer', 'Insurance'], ['driving_school', 'Driving school'],
    ['finance_company', 'Finance'], ['manufacturer', 'Manufacturer'], ['unclassified', 'Unclassified'],
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <Link href="/admin/platform/vendor-prospects" className="hover:underline">Vendor prospects</Link><span>/</span>
        <Link href="/admin/platform/vendor-prospects/groups" className="hover:underline">Company groups</Link><span>/</span>
        <span>{group.display_name}</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Prospective client · {group.review_status === 'candidate' ? 'provisional same-name group' : group.review_status}</p>
        <h1 className="mt-1 text-2xl font-bold">{group.display_name}</h1>
        <p className="mt-2 max-w-4xl text-sm text-neutral-600">
          Review every source record as a possible branch, showroom, or service. Confirm the group only when these records belong to the same organization; separating it preserves every record as an individual lead.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{members.length}</strong><p className="text-xs opacity-60">Preserved directory records</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{new Set(members.map((member) => member.city).filter(Boolean)).size}</strong><p className="text-xs opacity-60">Distinct cities / possible branches</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><strong className="text-2xl">{eligible}</strong><p className="text-xs opacity-60">Records in initial free-offer cohort</p></div>
      </div>

      <VendorProspectGroupClient
        groupId={group.id}
        reviewStatus={group.review_status}
        campaignStatus={group.campaign_status}
        nextFollowUpAt={group.next_follow_up_at}
        campaignStatuses={VENDOR_PROSPECT_STATUSES.map((status) => ({
          value: status,
          label: VENDOR_PROSPECT_STATUS_LABELS[status],
        }))}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Branches, showrooms, and source records</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {members.map((member) => {
            let phones: Record<string, string> = {};
            try { phones = JSON.parse(member.phones) as Record<string, string>; } catch { phones = {}; }
            return (
              <article key={member.id} className="space-y-2 rounded-xl border border-black/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-xs opacity-65">{categoryLabel.get(member.category_key) ?? member.category_key} · {member.original_category}{member.original_subcategory ? ` / ${member.original_subcategory}` : ''}</p>
                  </div>
                  <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{countryLabel(member.country_code)}</span>
                </div>
                <p className="text-sm">{[member.city, member.district, member.address].filter(Boolean).join(' · ') || 'No location in source'}</p>
                {member.brand ? <p className="text-xs">Brand: {member.brand}</p> : null}
                <div className="text-xs opacity-75">
                  {Object.entries(phones).filter(([, value]) => value).map(([key, value]) => (
                    <span key={key} className="me-3">{key}: {value}</span>
                  ))}
                  {member.email ? <span className="me-3">Email: {member.email}</span> : null}
                  {member.contact_name ? <span>Contact: {member.contact_name}</span> : null}
                </div>
                <p className="text-[11px] opacity-50">{member.source_count} source(s){member.source_names ? ` · ${member.source_names}` : ''} · {member.free_offer_eligible ? 'Free-offer eligible' : 'Outside initial cohort'} · {VENDOR_PROSPECT_STATUS_LABELS[member.campaign_status]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Admin follow-up history</h2>
        {activities.length ? (
          <ol className="space-y-2">
            {activities.map((activity) => (
              <li key={activity.id} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex flex-wrap justify-between gap-2 text-xs opacity-60">
                  <span>{activity.activity_type.replace('_', ' ')} · {activity.admin_name ?? 'Admin'}</span>
                  <time dateTime={activity.created_at}>{new Date(activity.created_at).toLocaleString()}</time>
                </div>
                <p className="mt-2 text-sm font-medium">{activity.summary}</p>
                {activity.outcome ? <p className="mt-1 text-sm opacity-70">Outcome: {activity.outcome}</p> : null}
                {activity.next_follow_up_at ? <p className="mt-1 text-xs opacity-60">Next follow-up: {new Date(activity.next_follow_up_at).toLocaleString()}</p> : null}
              </li>
            ))}
          </ol>
        ) : <p className="rounded-xl border border-dashed border-black/20 p-5 text-sm opacity-60">No activity recorded yet.</p>}
      </section>
    </div>
  );
}
