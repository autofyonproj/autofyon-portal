import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/admin-auth';

interface ReferralRow {
  id: string;
  status: string;
  prospect_id: string;
  prospect_status: string;
  source_invite_id: string;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ referralId: string }> },
) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  const { referralId } = await context.params;
  let body: { action?: string; note?: string };
  try {
    body = await request.json() as { action?: string; note?: string };
  } catch {
    return NextResponse.json({ error: 'Request must be valid JSON' }, { status: 400 });
  }
  if (body.action !== 'approve' && body.action !== 'reject') {
    return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
  }

  const referral = await queryOne<ReferralRow>(
    `SELECT r.id, r.status, r.prospect_id, r.source_invite_id,
            p.campaign_status AS prospect_status
       FROM vendor_referrals r
       JOIN vendor_prospects p ON p.id = r.prospect_id
      WHERE r.id = ?`,
    [referralId],
  );
  if (!referral) return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
  if (referral.status !== 'pending_review') {
    return NextResponse.json({ error: 'Referral has already been reviewed' }, { status: 409 });
  }

  const now = new Date().toISOString();
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : '';
  if (body.action === 'approve') {
    if (['accepted', 'declined', 'do_not_contact'].includes(referral.prospect_status)) {
      return NextResponse.json({ error: 'This CRM record is not eligible for a new invitation' }, { status: 409 });
    }
    const activeInvite = await queryOne<{ id: string }>(
      `SELECT id FROM vendor_registration_invites
        WHERE prospect_id = ?
          AND (
            status IN ('submitted', 'approved')
            OR (status IN ('invited', 'verified', 'changes_requested')
                AND expires_at > CAST(strftime('%s', 'now') AS INTEGER))
          )
        LIMIT 1`,
      [referral.prospect_id],
    );
    if (activeInvite) return NextResponse.json({ error: 'This dealer already has an active invitation or application' }, { status: 409 });
  }

  const status = body.action === 'approve' ? 'approved' : 'rejected';
  const statements = [
    {
      sql: `UPDATE vendor_referrals
               SET status = ?, reviewed_by = ?, reviewed_at = ?, review_note = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND status = 'pending_review'`,
      params: [status, auth.user.id, now, note, referralId],
    },
    ...(body.action === 'approve' ? [{
      sql: `UPDATE vendor_prospects SET campaign_status = 'queued', updated_at = ?
            WHERE id = ? AND campaign_status NOT IN ('accepted', 'declined', 'do_not_contact')
              AND EXISTS (
                SELECT 1 FROM vendor_referrals
                 WHERE id = ? AND status = 'approved' AND reviewed_by = ? AND reviewed_at = ?
              )`,
      params: [now, referral.prospect_id, referralId, auth.user.id, now],
    }] : []),
    {
      sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, actor_id, action, detail)
            SELECT ?, ?, ?, ?, ?
             WHERE EXISTS (
               SELECT 1 FROM vendor_referrals
                WHERE id = ? AND status = ? AND reviewed_by = ? AND reviewed_at = ?
             )`,
      params: [
        `voa_${crypto.randomUUID()}`,
        referral.source_invite_id,
        auth.user.id,
        `referral_${body.action}`,
        JSON.stringify({ referralId, prospectId: referral.prospect_id, note }),
        referralId,
        status,
        auth.user.id,
        now,
      ],
    },
  ];
  const results = await batch(statements);
  if (results[0]?.changes !== 1) {
    return NextResponse.json({ error: 'Referral was reviewed by another administrator' }, { status: 409 });
  }
  return NextResponse.json({ ok: true, referralId, status });
}
