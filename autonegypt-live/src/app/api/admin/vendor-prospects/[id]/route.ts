import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import {
  VENDOR_PROSPECT_STATUSES,
  type VendorProspectStatus,
} from '@/lib/vendor-prospects';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') return json({ error: 'platform admin required' }, 403);

  let body: { campaignStatus?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }
  if (typeof body.campaignStatus !== 'string' ||
      !VENDOR_PROSPECT_STATUSES.includes(body.campaignStatus as VendorProspectStatus)) {
    return json({ error: 'unsupported campaign status' }, 400);
  }

  const { id } = await params;
  const prospect = await queryOne<{ id: string }>(
    'SELECT id FROM vendor_prospects WHERE id = ?',
    [id],
  );
  if (!prospect) return json({ error: 'prospect not found' }, 404);

  await execute(
    'UPDATE vendor_prospects SET campaign_status = ?, updated_at = ? WHERE id = ?',
    [body.campaignStatus, new Date().toISOString(), id],
  );
  return json({ ok: true, campaignStatus: body.campaignStatus });
}
