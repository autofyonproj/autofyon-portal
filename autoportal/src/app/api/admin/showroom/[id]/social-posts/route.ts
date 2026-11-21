import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne } from '@/lib/db';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { getVendorTier } from '@/lib/tiers';

type RouteContext = { params: Promise<{ id: string }> };
type SocialChannel = 'facebook' | 'instagram' | 'telegram' | 'whatsapp';

const CHANNELS: SocialChannel[] = ['facebook', 'instagram', 'telegram', 'whatsapp'];

type BusinessRow = {
  id: string;
  status: string;
  published: number;
  subscription_tier: string;
};

async function authorize(request: NextRequest, businessId: string) {
  const auth = await requireBusinessAccess(request, businessId);
  if (auth instanceof Response) return auth;
  const [business, membership] = await Promise.all([
    queryOne<BusinessRow>(
      'SELECT id, status, published, subscription_tier FROM businesses WHERE id = ?',
      [businessId],
    ),
    auth.user.role === 'platform_admin'
      ? Promise.resolve(null)
      : queryOne<{ role: string; status: string }>(
          'SELECT role, status FROM business_memberships WHERE business_id = ? AND admin_user_id = ?',
          [businessId, auth.user.id],
        ),
  ]);
  if (!business || business.status !== 'active' || business.published !== 1) {
    return NextResponse.json({ error: 'An active, published dealer page is required for social drafts.' }, { status: 403 });
  }
  if (auth.user.role !== 'platform_admin' &&
      (!membership || membership.status !== 'active' || !['owner', 'sales'].includes(membership.role))) {
    return NextResponse.json({ error: 'Owner or sales access is required for social drafts.' }, { status: 403 });
  }
  return {
    user: auth.user,
    role: auth.user.role === 'platform_admin' ? 'platform_admin' : membership?.role,
    business,
    tier: getVendorTier(business.subscription_tier),
  };
}

function parseChannels(value: unknown): SocialChannel[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > CHANNELS.length) return null;
  const channels = new Set<SocialChannel>();
  for (const channel of value) {
    if (typeof channel !== 'string' || !CHANNELS.includes(channel as SocialChannel)) return null;
    channels.add(channel as SocialChannel);
  }
  return channels.size === value.length ? [...channels] : null;
}

function parseScheduledAt(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()) || date.toISOString() !== value || date.valueOf() <= Date.now()) {
    return undefined;
  }
  return value;
}

function utcMonthBounds(value: string) {
  const date = new Date(value);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  return [start.toISOString(), end.toISOString()] as const;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await authorize(request, id);
  if (auth instanceof Response) return auth;

  try {
    const [posts, usage] = await Promise.all([
      query<{
        id: string;
        title: string;
        caption_en: string;
        caption_ar: string;
        channels_json: string;
        planned_for: string | null;
        status: string;
        created_at: string;
        approved_at: string | null;
      }>(
        `SELECT id, title, caption_en, caption_ar, channels_json, planned_for,
                status, created_at, approved_at
           FROM vendor_social_posts
          WHERE business_id = ? AND archived_at IS NULL
          ORDER BY CASE WHEN planned_for IS NULL THEN 1 ELSE 0 END, planned_for, created_at DESC
          LIMIT 200`,
        [id],
      ),
      queryOne<{ count: number }>(
        `SELECT COUNT(*) AS count FROM vendor_social_posts
          WHERE business_id = ? AND created_at >= strftime('%Y-%m-01 00:00:00', 'now')
            AND created_at < strftime('%Y-%m-01 00:00:00', 'now', '+1 month')
            AND status != 'archived'`,
        [id],
      ),
    ]);
    return NextResponse.json({
      posts: posts.map((post) => {
        let channels: unknown;
        try {
          channels = JSON.parse(post.channels_json);
        } catch {
          throw new Error(`Social post ${post.id} contains invalid channel JSON.`);
        }
        const validChannels = parseChannels(channels);
        if (!validChannels) throw new Error(`Social post ${post.id} contains invalid channel data.`);
        return {
          id: post.id,
          title: post.title,
          captionEn: post.caption_en,
          captionAr: post.caption_ar,
          channels: validChannels,
          plannedFor: post.planned_for,
          status: post.status,
          createdAt: post.created_at,
          approvedAt: post.approved_at,
        };
      }),
      entitlements: auth.tier.social,
      draftsCreatedThisMonth: Number(usage?.count ?? 0),
      approvalAllowed: auth.tier.social.approvalWorkflow &&
        (auth.role === 'owner' || auth.role === 'platform_admin'),
      publishingEnabled: false,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load dealer social drafts:', error);
    return NextResponse.json({ error: 'Could not load social drafts.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await authorize(request, id);
  if (auth instanceof Response) return auth;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Invalid social draft.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const captionEn = typeof body.captionEn === 'string' ? body.captionEn.trim() : '';
  const captionAr = typeof body.captionAr === 'string' ? body.captionAr.trim() : '';
  const channels = parseChannels(body.channels);
  const plannedFor = parseScheduledAt(body.plannedFor);
  if (!title || title.length > 120 || captionEn.length > 4000 || captionAr.length > 4000 ||
      (!captionEn && !captionAr) || !channels || plannedFor === undefined) {
    return NextResponse.json({ error: 'Enter a title, at least one caption, valid channels, and a valid future calendar date.' }, { status: 400 });
  }
  if (plannedFor && (!auth.tier.social.contentCalendar || auth.tier.social.scheduledPostsPerMonth === 0)) {
    return NextResponse.json({ error: 'The content calendar is not included in this tier.' }, { status: 403 });
  }

  try {
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const nextMonth = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1));
    const draftLimit = auth.tier.social.draftPacksPerMonth;
    const conditions: string[] = [];
    const conditionParams: unknown[] = [];
    if (draftLimit !== null) {
      conditions.push(`(SELECT COUNT(*) FROM vendor_social_posts
                         WHERE business_id = ? AND created_at >= ? AND created_at < ?
                           AND archived_at IS NULL) < ?`);
      conditionParams.push(
        id,
        `${monthStart.toISOString().slice(0, 10)} 00:00:00`,
        `${nextMonth.toISOString().slice(0, 10)} 00:00:00`,
        draftLimit,
      );
    }
    if (plannedFor && auth.tier.social.scheduledPostsPerMonth !== null) {
      const [periodStart, periodEnd] = utcMonthBounds(plannedFor);
      conditions.push(`(SELECT COUNT(*) FROM vendor_social_posts
                         WHERE business_id = ? AND planned_for >= ? AND planned_for < ?
                           AND archived_at IS NULL) < ?`);
      conditionParams.push(id, periodStart, periodEnd, auth.tier.social.scheduledPostsPerMonth);
    }

    const postId = crypto.randomUUID();
    const insert = await execute(
      `INSERT INTO vendor_social_posts
         (id, business_id, created_by, title, caption_en, caption_ar, channels_json, planned_for)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}`,
      [postId, id, auth.user.id, title, captionEn, captionAr, JSON.stringify(channels), plannedFor, ...conditionParams],
    );
    if (insert.changes !== 1) {
      return NextResponse.json({ error: 'The monthly draft or calendar allowance for this tier has been reached.' }, { status: 429 });
    }
    return NextResponse.json({
      ok: true,
      id: postId,
      status: 'draft',
      publishingEnabled: false,
    }, { status: 201 });
  } catch (error) {
    console.error('Could not save dealer social draft:', error);
    return NextResponse.json({ error: 'Could not save social draft.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await authorize(request, id);
  if (auth instanceof Response) return auth;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Invalid social post update.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const postId = typeof body.postId === 'string' ? body.postId.trim() : '';
  if (!/^[A-Za-z0-9-]{1,100}$/.test(postId)) {
    return NextResponse.json({ error: 'Select a valid social draft.' }, { status: 400 });
  }

  try {
    const current = await queryOne<{ id: string; status: string; planned_for: string | null }>(
      `SELECT id, status, planned_for FROM vendor_social_posts
        WHERE id = ? AND business_id = ? AND archived_at IS NULL`,
      [postId, id],
    );
    if (!current) return NextResponse.json({ error: 'Social draft not found.' }, { status: 404 });

    if (body.action === 'approve') {
      if (!auth.tier.social.approvalWorkflow ||
          auth.role !== 'owner' && auth.role !== 'platform_admin') {
        return NextResponse.json({ error: 'This tier or role cannot approve social content.' }, { status: 403 });
      }
      if (current.status !== 'draft') {
        return NextResponse.json({ error: 'Only draft content can be approved.' }, { status: 409 });
      }
      const update = await execute(
        `UPDATE vendor_social_posts
            SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND business_id = ? AND status = 'draft' AND archived_at IS NULL`,
        [auth.user.id, postId, id],
      );
      if (update.changes !== 1) return NextResponse.json({ error: 'The draft changed before it could be approved.' }, { status: 409 });
      return NextResponse.json({ ok: true, status: 'approved', publishingEnabled: false });
    }

    if (body.action === 'archive') {
      const update = await execute(
        `UPDATE vendor_social_posts SET status = 'archived', archived_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND business_id = ? AND archived_at IS NULL`,
        [postId, id],
      );
      if (update.changes !== 1) return NextResponse.json({ error: 'The draft changed before it could be archived.' }, { status: 409 });
      return NextResponse.json({ ok: true, status: 'archived' });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const captionEn = typeof body.captionEn === 'string' ? body.captionEn.trim() : '';
    const captionAr = typeof body.captionAr === 'string' ? body.captionAr.trim() : '';
    const channels = parseChannels(body.channels);
    const plannedFor = parseScheduledAt(body.plannedFor);
    if (current.status !== 'draft' || !title || title.length > 120 ||
        captionEn.length > 4000 || captionAr.length > 4000 || (!captionEn && !captionAr) ||
        !channels || plannedFor === undefined) {
      return NextResponse.json({ error: 'Only valid draft content can be edited.' }, { status: 400 });
    }
    if (plannedFor && (!auth.tier.social.contentCalendar || auth.tier.social.scheduledPostsPerMonth === 0)) {
      return NextResponse.json({ error: 'The content calendar is not included in this tier.' }, { status: 403 });
    }
    const scheduleCondition = plannedFor && auth.tier.social.scheduledPostsPerMonth !== null;
    const scheduleParams: unknown[] = [];
    let quotaCondition = '';
    if (scheduleCondition) {
      const [periodStart, periodEnd] = utcMonthBounds(plannedFor);
      quotaCondition = `AND (SELECT COUNT(*) FROM vendor_social_posts
                             WHERE business_id = ? AND id != ? AND planned_for >= ? AND planned_for < ?
                               AND archived_at IS NULL) < ?`;
      scheduleParams.push(id, postId, periodStart, periodEnd, auth.tier.social.scheduledPostsPerMonth);
    }
    const update = await execute(
      `UPDATE vendor_social_posts
          SET title = ?, caption_en = ?, caption_ar = ?, channels_json = ?,
              planned_for = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND business_id = ? AND status = 'draft' AND archived_at IS NULL ${quotaCondition}`,
      [title, captionEn, captionAr, JSON.stringify(channels), plannedFor, postId, id, ...scheduleParams],
    );
    if (update.changes !== 1) {
      return NextResponse.json({
        error: scheduleCondition
          ? 'The draft changed or the scheduled-post allowance for that month has been reached.'
          : 'The draft changed before it could be saved.',
      }, { status: scheduleCondition ? 429 : 409 });
    }
    return NextResponse.json({ ok: true, status: 'draft', publishingEnabled: false });
  } catch (error) {
    console.error('Could not update dealer social draft:', error);
    return NextResponse.json({ error: 'Could not update social draft.' }, { status: 500 });
  }
}
