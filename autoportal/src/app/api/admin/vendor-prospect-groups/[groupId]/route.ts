import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { executeBatch, queryOne } from '@/lib/db';
import {
  VENDOR_PROSPECT_STATUSES,
  type VendorProspectStatus,
} from '@/lib/vendor-prospects';


const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

const ACTIVITY_TYPES = ['note', 'call', 'email', 'whatsapp', 'meeting', 'follow_up'] as const;
type ActivityType = typeof ACTIVITY_TYPES[number];

async function platformAdmin() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-prospects', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  return user?.role === 'platform_admin' ? user : null;
}

function validFollowUp(value: unknown): value is string | null {
  if (value === null || value === '') return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  const { groupId } = await params;
  let body: { reviewStatus?: unknown; campaignStatus?: unknown; nextFollowUpAt?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }
  const reviewStatus = body.reviewStatus;
  const campaignStatus = body.campaignStatus;
  const hasReview = reviewStatus !== undefined;
  const hasCampaign = campaignStatus !== undefined;
  const hasFollowUp = body.nextFollowUpAt !== undefined;
  if (!hasReview && !hasCampaign && !hasFollowUp) {
    return json({ error: 'at least one supported CRM field is required' }, 400);
  }
  if (hasReview && !['confirmed', 'separated'].includes(String(reviewStatus))) {
    return json({ error: 'reviewStatus must be confirmed or separated' }, 400);
  }
  if (hasCampaign && (typeof campaignStatus !== 'string' ||
      !VENDOR_PROSPECT_STATUSES.includes(campaignStatus as VendorProspectStatus))) {
    return json({ error: 'unsupported campaign status' }, 400);
  }
  if (hasFollowUp && !validFollowUp(body.nextFollowUpAt)) {
    return json({ error: 'nextFollowUpAt must be a date, datetime, or null' }, 400);
  }
  const group = await queryOne<{ id: string; review_status: string }>(
    'SELECT id, review_status FROM vendor_prospect_groups WHERE id = ?',
    [groupId],
  );
  if (!group) return json({ error: 'prospect group not found' }, 404);
  if (hasReview && group.review_status === 'separated') {
    return json({ error: 'separated prospect groups cannot be reconfirmed' }, 409);
  }

  const now = new Date().toISOString();
  const sets: string[] = [];
  const values: unknown[] = [];
  if (hasReview) { sets.push('review_status = ?'); values.push(reviewStatus); }
  if (hasCampaign) { sets.push('campaign_status = ?'); values.push(campaignStatus); }
  if (hasFollowUp) { sets.push('next_follow_up_at = ?'); values.push(body.nextFollowUpAt || null); }
  sets.push('updated_at = ?');
  values.push(now, groupId);

  const statements = [{
    sql: `UPDATE vendor_prospect_groups SET ${sets.join(', ')} WHERE id = ?`,
    params: values,
  }];
  if (reviewStatus === 'confirmed' || reviewStatus === 'separated') {
    statements.push({
      sql: `INSERT INTO vendor_prospect_activities (id, group_id, activity_type, summary, outcome, created_by, created_at)
            VALUES (?, ?, 'status_change', ?, ?, ?, ?)`,
      params: [
        crypto.randomUUID(),
        groupId,
        reviewStatus === 'confirmed' ? 'Confirmed matching records as one prospective client.' : 'Separated matching records; they remain individual leads.',
        reviewStatus,
        user.id,
        now,
      ],
    });
  }
  if (hasCampaign) {
    statements.push({
      sql: `INSERT INTO vendor_prospect_activities (id, group_id, activity_type, summary, outcome, created_by, created_at)
            VALUES (?, ?, 'status_change', ?, ?, ?, ?)`,
      params: [
        crypto.randomUUID(),
        groupId,
        `Account outreach status changed to ${campaignStatus}.`,
        String(campaignStatus),
        user.id,
        now,
      ],
    });
  }
  if (hasFollowUp) {
    statements.push({
      sql: `INSERT INTO vendor_prospect_activities (id, group_id, activity_type, summary, outcome, next_follow_up_at, created_by, created_at)
            VALUES (?, ?, 'follow_up', ?, '', ?, ?, ?)`,
      params: [
        crypto.randomUUID(),
        groupId,
        body.nextFollowUpAt ? 'Next follow-up scheduled.' : 'Next follow-up cleared.',
        body.nextFollowUpAt || null,
        user.id,
        now,
      ],
    });
  }
  if (reviewStatus === 'separated') {
    statements.push({
      sql: 'UPDATE vendor_prospects SET prospect_group_id = NULL, updated_at = ? WHERE prospect_group_id = ?',
      params: [now, groupId],
    });
  }
  await executeBatch(statements);
  return json({ ok: true });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const user = await platformAdmin();
  if (!user) return json({ error: 'platform admin required' }, 403);
  const { groupId } = await params;
  let body: { activityType?: unknown; summary?: unknown; outcome?: unknown; nextFollowUpAt?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: 'body must be valid JSON' }, 400);
  }
  if (typeof body.activityType !== 'string' || !ACTIVITY_TYPES.includes(body.activityType as ActivityType)) {
    return json({ error: 'unsupported activity type' }, 400);
  }
  if (typeof body.summary !== 'string' || !body.summary.trim() || body.summary.length > 2000) {
    return json({ error: 'summary is required and must be at most 2000 characters' }, 400);
  }
  if (body.outcome !== undefined && (typeof body.outcome !== 'string' || body.outcome.length > 1000)) {
    return json({ error: 'outcome must be at most 1000 characters' }, 400);
  }
  if (body.nextFollowUpAt !== undefined && !validFollowUp(body.nextFollowUpAt)) {
    return json({ error: 'nextFollowUpAt must be a date, datetime, or null' }, 400);
  }
  const group = await queryOne<{ id: string }>(
    'SELECT id FROM vendor_prospect_groups WHERE id = ?',
    [groupId],
  );
  if (!group) return json({ error: 'prospect group not found' }, 404);
  const now = new Date().toISOString();
  const nextFollowUpAt = body.nextFollowUpAt ? String(body.nextFollowUpAt) : null;
  const statements = [{
    sql: `INSERT INTO vendor_prospect_activities
            (id, group_id, activity_type, summary, outcome, next_follow_up_at, created_by, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    params: [
      crypto.randomUUID(), groupId, body.activityType, body.summary.trim(),
      typeof body.outcome === 'string' ? body.outcome.trim() : '',
      nextFollowUpAt, user.id, now,
    ],
  }];
  if (body.nextFollowUpAt !== undefined) {
    statements.push({
      sql: 'UPDATE vendor_prospect_groups SET next_follow_up_at = ?, updated_at = ? WHERE id = ?',
      params: [nextFollowUpAt, now, groupId],
    });
  }
  await executeBatch(statements);
  return json({ ok: true });
}
