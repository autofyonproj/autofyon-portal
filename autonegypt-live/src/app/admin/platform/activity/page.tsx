import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';

type BusinessActivity = {
  business_id: string;
  business_name: string;
  name_ar: string | null;
  event_type: string;
  event_count: number;
};

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Website page views',
  vehicle_view: 'Vehicle detail views',
  vehicle_click: 'Vehicle detail clicks',
  phone_click: 'Phone link clicks',
  whatsapp_click: 'WhatsApp link clicks',
};

export default async function PlatformActivityPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/activity', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  const activity = await query<BusinessActivity>(
    `SELECT e.business_id, b.name AS business_name, b.name_ar,
            e.event_type, COUNT(*) AS event_count
     FROM business_analytics_events e
     JOIN businesses b ON b.id = e.business_id
     WHERE e.created_at >= datetime('now', '-30 days')
     GROUP BY e.business_id, e.event_type
     ORDER BY b.name, e.event_type`,
  );

  const totals = new Map<string, number>();
  for (const row of activity) {
    totals.set(row.business_id, (totals.get(row.business_id) ?? 0) + row.event_count);
  }
  const businessIds = [...new Set(activity.map((row) => row.business_id))];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-slate-500">Last 30 days · all AUTOFYON clients</p>
        <h1 className="text-2xl font-bold">Platform activity</h1>
        <p className="text-sm text-slate-600">
          Phone and WhatsApp figures represent link clicks, not completed calls or conversations.
        </p>
      </header>

      {businessIds.length ? businessIds.map((businessId) => {
        const rows = activity.filter((row) => row.business_id === businessId);
        const business = rows[0];
        return (
          <section key={businessId} className="rounded-xl border border-black/10 p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-bold">{business.business_name}{business.name_ar ? ` · ${business.name_ar}` : ''}</h2>
              <span className="text-sm text-slate-500">{totals.get(businessId)} total events</span>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((row) => (
                <li key={row.event_type} className="flex justify-between gap-4 rounded-lg bg-black/[.03] p-3 text-sm">
                  <span>{EVENT_LABELS[row.event_type] ?? row.event_type}</span>
                  <strong>{row.event_count}</strong>
                </li>
              ))}
            </ul>
          </section>
        );
      }) : <p className="rounded-xl border border-black/10 p-4 text-sm text-slate-500">No activity recorded yet.</p>}
    </div>
  );
}
