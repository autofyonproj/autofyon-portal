import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import { requirePlatformAdmin } from '@/lib/admin-auth';

type ReviewAction = 'approve' | 'request_changes' | 'reject' | 'revoke';

interface ReviewRow {
  id: string;
  prospect_id: string;
  status: string;
  business_id: string | null;
  publish_consent: number | null;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ inviteId: string }> },
) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  const { inviteId } = await context.params;
  let body: { action?: ReviewAction; note?: string };
  try {
    body = await request.json() as { action?: ReviewAction; note?: string };
  } catch {
    return NextResponse.json({ error: 'Request must be valid JSON' }, { status: 400 });
  }

  const action = body.action;
  if (!['approve', 'request_changes', 'reject', 'revoke'].includes(action ?? '')) {
    return NextResponse.json({ error: 'Unsupported review action' }, { status: 400 });
  }
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : '';
  const invite = await queryOne<ReviewRow>(
    `SELECT i.id, i.prospect_id, i.status, i.business_id, d.publish_consent
       FROM vendor_registration_invites i
  LEFT JOIN vendor_onboarding_drafts d ON d.invite_id = i.id
      WHERE i.id = ?`,
    [inviteId],
  );
  if (!invite) return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });

  const now = new Date().toISOString();
  const auditId = `voa_${crypto.randomUUID()}`;
  const statements = [];

  if (action === 'approve') {
    if (invite.status !== 'submitted' || !invite.business_id) {
      return NextResponse.json({ error: 'Only submitted applications can be approved' }, { status: 409 });
    }
    if (invite.publish_consent !== 1) {
      return NextResponse.json({ error: 'Dealer has not consented to public publication' }, { status: 409 });
    }
    statements.push(
      {
        sql: `UPDATE businesses SET status = 'active', published = 1, updated_at = ?
              WHERE id = ? AND status = 'pending'`,
        params: [now, invite.business_id],
      },
      {
        sql: `UPDATE business_memberships SET status = 'active', updated_at = CURRENT_TIMESTAMP
              WHERE business_id = ?`,
        params: [invite.business_id],
      },
      {
        sql: `UPDATE autofyon_media_landings SET published = 1, updated_at = ?
              WHERE business_id = ?`,
        params: [now, invite.business_id],
      },
      {
        sql: `UPDATE business_app_licenses SET status = 'active', starts_at = COALESCE(starts_at, ?),
                updated_by = ?, updated_at = ?
              WHERE business_id = ? AND status = 'requested'`,
        params: [now, auth.user.id, now, invite.business_id],
      },
      {
        sql: `UPDATE vendor_registration_invites
                 SET status = 'approved', decided_at = ?, decision_note = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ? AND status = 'submitted'`,
        params: [now, note, inviteId],
      },
    );
  } else if (action === 'request_changes' || action === 'reject') {
    if (invite.status !== 'submitted' || !invite.business_id) {
      return NextResponse.json({ error: 'Only submitted applications can be reviewed' }, { status: 409 });
    }
    const newStatus = action === 'request_changes' ? 'changes_requested' : 'rejected';
    statements.push(
      {
        sql: `UPDATE businesses SET status = 'pending', published = 0, updated_at = ? WHERE id = ?`,
        params: [now, invite.business_id],
      },
      {
        sql: `UPDATE business_memberships SET status = 'suspended', updated_at = CURRENT_TIMESTAMP
              WHERE business_id = ?`,
        params: [invite.business_id],
      },
      {
        sql: `UPDATE autofyon_media_landings SET published = 0, updated_at = ? WHERE business_id = ?`,
        params: [now, invite.business_id],
      },
      {
        sql: `UPDATE business_app_licenses SET status = 'suspended', updated_by = ?, updated_at = ?
              WHERE business_id = ? AND status IN ('requested', 'active')`,
        params: [auth.user.id, now, invite.business_id],
      },
      {
        sql: `UPDATE vendor_registration_invites
                 SET status = ?, decided_at = ?, decision_note = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ? AND status = 'submitted'`,
        params: [newStatus, now, note, inviteId],
      },
    );
    if (action === 'reject') {
      statements.push({
        sql: `UPDATE vendor_prospects SET campaign_status = 'declined', updated_at = ?
              WHERE id = ?`,
        params: [now, invite.prospect_id],
      });
      statements.push({
        sql: `UPDATE vendor_referrals SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
              WHERE prospect_id = ? AND status IN ('approved', 'invited')`,
        params: [invite.prospect_id],
      });
    }
  } else {
    if (!['invited', 'verified', 'changes_requested'].includes(invite.status)) {
      return NextResponse.json({ error: 'Only active invitations can be revoked' }, { status: 409 });
    }
    statements.push(
      {
        sql: `UPDATE vendor_registration_invites
                 SET status = 'revoked', decided_at = ?, decision_note = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`,
        params: [now, note, inviteId],
      },
      { sql: 'DELETE FROM vendor_registration_otps WHERE invite_id = ?', params: [inviteId] },
    );
  }

  statements.push({
    sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, actor_id, action, detail)
          VALUES (?, ?, ?, ?, ?)`,
    params: [auditId, inviteId, auth.user.id, action, note],
  });
  await batch(statements);

  return NextResponse.json({ ok: true, inviteId, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'request_changes' ? 'changes_requested' : 'revoked' });
}
