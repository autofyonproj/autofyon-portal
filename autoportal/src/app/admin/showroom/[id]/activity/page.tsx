import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { query, queryOne } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };
type EventCount = { event_type: string; event_count: number };

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Website page views',
  vehicle_view: 'Vehicle detail views',
  vehicle_click: 'Vehicle detail clicks',
  phone_click: 'Phone link clicks (not completed calls)',
  whatsapp_click: 'WhatsApp link clicks',
};

export default async function BusinessActivityPage({ params }: Params) {
  const { id } = await params;
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/activity', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || !canAccessBusiness(user, id)) notFound();

  const business = await queryOne<{ name: string; name_ar: string | null }>(
    'SELECT name, name_ar FROM businesses WHERE id = ? AND status = \'active\'',
    [id],
  );
  if (!business) notFound();

  const [counts, byHost, byLocation, contactTargets, topVehicles] = await Promise.all([
    query<EventCount>(
      `SELECT event_type, COUNT(*) AS event_count
       FROM business_analytics_events
       WHERE business_id = ? AND created_at >= datetime('now', '-30 days')
       GROUP BY event_type ORDER BY event_type`,
      [id],
    ),
    query<{ host: string; event_count: number }>(
      `SELECT host, COUNT(*) AS event_count
       FROM business_analytics_events
       WHERE business_id = ? AND created_at >= datetime('now', '-30 days')
       GROUP BY host ORDER BY event_count DESC, host`,
      [id],
    ),
    query<{ country: string | null; city: string | null; event_count: number }>(
      `SELECT country, city, COUNT(*) AS event_count
       FROM business_analytics_events
       WHERE business_id = ? AND (country IS NOT NULL OR city IS NOT NULL)
         AND created_at >= datetime('now', '-30 days')
       GROUP BY country, city ORDER BY event_count DESC, country LIMIT 15`,
      [id],
    ),
    query<{ event_type: string; contact_target: string; event_count: number }>(
      `SELECT event_type, contact_target, COUNT(*) AS event_count
       FROM business_analytics_events
       WHERE business_id = ? AND contact_target IS NOT NULL
         AND created_at >= datetime('now', '-30 days')
       GROUP BY event_type, contact_target ORDER BY event_count DESC, contact_target`,
      [id],
    ),
    query<{ unit_id: string; title: string; title_ar: string | null; event_type: string; event_count: number }>(
      `SELECT e.unit_id, u.title, u.title_ar, e.event_type, COUNT(*) AS event_count
       FROM business_analytics_events e
       JOIN units u ON u.id = e.unit_id
       WHERE e.business_id = ? AND e.event_type IN ('vehicle_view', 'vehicle_click')
         AND e.created_at >= datetime('now', '-30 days')
       GROUP BY e.unit_id, e.event_type ORDER BY event_count DESC, u.title LIMIT 20`,
      [id],
    ),
  ]);
  const countMap = new Map(counts.map((row) => [row.event_type, row.event_count]));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-slate-500">Last 30 days</p>
        <h1 className="text-2xl font-bold">Activity — {business.name}</h1>
        {business.name_ar ? <p className="text-sm text-slate-500">{business.name_ar}</p> : null}
        <p className="text-sm text-slate-600">
          Phone and WhatsApp figures count link clicks only; they do not confirm a call or conversation.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(EVENT_LABELS).map(([type, label]) => (
          <article key={type} className="rounded-xl border border-black/10 p-4">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-1 text-3xl font-bold">{countMap.get(type) ?? 0}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-4">
          <h2 className="mb-3 font-bold">Traffic by website host</h2>
          {byHost.length ? (
            <ul className="space-y-2">
              {byHost.map((row) => <li key={row.host} className="flex justify-between gap-4 text-sm">
                <span className="break-all">{row.host}</span><strong>{row.event_count}</strong>
              </li>)}
            </ul>
          ) : <p className="text-sm text-slate-500">No activity recorded yet.</p>}
        </div>

        <div className="rounded-xl border border-black/10 p-4">
          <h2 className="mb-3 font-bold">Visitor locations (Country & City)</h2>
          {byLocation.length ? (
            <ul className="space-y-2">
              {byLocation.map((row, idx) => (
                <li key={idx} className="flex justify-between gap-4 text-sm">
                  <span>📍 {[row.city, row.country].filter(Boolean).join(', ') || 'Unknown'}</span>
                  <strong>{row.event_count}</strong>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">No geo data recorded yet.</p>}
        </div>

        <div className="rounded-xl border border-black/10 p-4">
          <h2 className="mb-3 font-bold">Contact destinations clicked</h2>
          {contactTargets.length ? (
            <ul className="space-y-2">
              {contactTargets.map((row) => <li key={`${row.event_type}:${row.contact_target}`} className="flex justify-between gap-4 text-sm">
                <span>{row.event_type === 'phone_click' ? 'Phone' : 'WhatsApp'}: {row.contact_target}</span>
                <strong>{row.event_count}</strong>
              </li>)}
            </ul>
          ) : <p className="text-sm text-slate-500">No contact links clicked yet.</p>}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 p-4">
        <h2 className="mb-3 font-bold">Vehicle activity</h2>
        {topVehicles.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead><tr className="border-b border-black/10 text-slate-500">
                <th className="py-2 pe-3">Vehicle</th><th className="py-2 pe-3">Activity</th><th className="py-2">Count</th>
              </tr></thead>
              <tbody>{topVehicles.map((row) => (
                <tr key={`${row.unit_id}:${row.event_type}`} className="border-b border-black/5">
                  <td className="py-2 pe-3">{row.title}</td>
                  <td className="py-2 pe-3">{row.event_type === 'vehicle_view' ? 'Detail views' : 'Clicks'}</td>
                  <td className="py-2">{row.event_count}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="text-sm text-slate-500">No vehicle activity recorded yet.</p>}
      </section>
    </div>
  );
}
