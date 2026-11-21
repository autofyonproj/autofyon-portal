import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest, context: { params: Promise<{ businessId: string }> }) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  const { businessId } = await context.params;
  const business = await queryOne<{ id: string; status: string }>(
    'SELECT id, status FROM businesses WHERE id = ?',
    [businessId],
  );
  if (!business) {
    return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({})) as { action?: 'approve' | 'suspend' };
  if (body.action !== 'approve' && body.action !== 'suspend') {
    return NextResponse.json({ error: 'Action must be approve or suspend' }, { status: 400 });
  }

  const onboardingRequest = await queryOne<{ id: string }>(
    `SELECT id FROM vendor_registration_invites
      WHERE business_id = ? AND status IN ('submitted', 'changes_requested')`,
    [businessId],
  );
  if (onboardingRequest) {
    return NextResponse.json(
      { error: 'Review this dealer through the CRM onboarding queue.' },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  if (body.action === 'approve') {
    await batch([
      { sql: `UPDATE businesses SET status = 'active', published = 1, updated_at = ? WHERE id = ?`, params: [now, businessId] },
      { sql: `UPDATE business_memberships SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE business_id = ?`, params: [businessId] },
      { sql: `UPDATE autofyon_media_landings SET published = 1, updated_at = ? WHERE business_id = ?`, params: [now, businessId] },
      { sql: `UPDATE business_app_licenses SET status = 'active', starts_at = COALESCE(starts_at, ?), updated_by = ?, updated_at = ? WHERE business_id = ? AND status = 'requested'`, params: [now, auth.user.id, now, businessId] },
    ]);
  } else {
    await batch([
      { sql: `UPDATE businesses SET status = 'inactive', published = 0, updated_at = ? WHERE id = ?`, params: [now, businessId] },
      { sql: `UPDATE business_memberships SET status = 'suspended', updated_at = CURRENT_TIMESTAMP WHERE business_id = ?`, params: [businessId] },
      { sql: `UPDATE autofyon_media_landings SET published = 0, updated_at = ? WHERE business_id = ?`, params: [now, businessId] },
    ]);
  }

  return NextResponse.json({
    ok: true,
    businessId,
    status: body.action === 'approve' ? 'active' : 'inactive',
  });
}
