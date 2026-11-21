import { NextRequest, NextResponse } from 'next/server';
import { batch, query, queryOne } from '@/lib/db';
import { requireVendorLeadAccess } from '@/lib/vendor-lead-auth';
import {
  isValidLeadDate,
  isVendorLeadBusinessType,
  VENDOR_LEAD_STATUSES,
  type VendorLeadStatus,
} from '@/lib/vendor-leads';

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  inquiry_for: string;
  source: string;
  source_path: string;
  status: VendorLeadStatus;
  next_follow_up_at: string | null;
  notes: string;
  created_at: string;
};

type ActivityRow = {
  id: string;
  lead_id: string;
  activity_type: string;
  summary: string;
  created_at: string;
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) return auth;

  try {
    const business = await queryOne<{ type_id: string }>(
      'SELECT type_id FROM businesses WHERE id = ? AND published = 1 AND status = \'active\'',
      [id],
    );
    if (!business || !isVendorLeadBusinessType(business.type_id)) {
      return NextResponse.json({ error: 'An eligible published landing page is required for this CRM.' }, { status: 403 });
    }

    const leads = await query<LeadRow>(
      `SELECT id, name, phone, email, inquiry, inquiry_for, source, source_path,
              status, next_follow_up_at, notes, created_at
         FROM vendor_leads
        WHERE business_id = ? AND archived_at IS NULL
        ORDER BY CASE WHEN status IN ('won', 'lost') THEN 1 ELSE 0 END,
                 CASE WHEN next_follow_up_at IS NULL THEN 1 ELSE 0 END,
                 next_follow_up_at, created_at DESC
        LIMIT 500`,
      [id],
    );
    const activities = leads.length
      ? await query<ActivityRow>(
          `SELECT id, lead_id, activity_type, summary, created_at
             FROM vendor_lead_activities
            WHERE business_id = ? AND lead_id IN (${leads.map(() => '?').join(',')})
            ORDER BY created_at DESC`,
          [id, ...leads.map((lead) => lead.id)],
        )
      : [];
    const byLead = new Map<string, ActivityRow[]>();
    for (const activity of activities) {
      const current = byLead.get(activity.lead_id) ?? [];
      if (current.length < 10) current.push(activity);
      byLead.set(activity.lead_id, current);
    }

    return NextResponse.json({
      leads: leads.map((lead) => ({ ...lead, activities: byLead.get(lead.id) ?? [] })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load vendor landing-page CRM leads:', error);
    return NextResponse.json({ error: 'Could not load lead records.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) return auth;
  const business = await queryOne<{ type_id: string }>(
    'SELECT type_id FROM businesses WHERE id = ? AND published = 1 AND status = \'active\'',
    [id],
  );
  if (!business || !isVendorLeadBusinessType(business.type_id)) {
    return NextResponse.json({ error: 'An eligible published landing page is required for this CRM.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Invalid lead update.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : '';
  if (!leadId || leadId.length > 100) return NextResponse.json({ error: 'Select a valid lead.' }, { status: 400 });

  const sets: string[] = [];
  const values: unknown[] = [];
  let statusChanged = false;
  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !(VENDOR_LEAD_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: 'Select a valid lead stage.' }, { status: 400 });
    }
    const current = await queryOne<{ status: string }>(
      'SELECT status FROM vendor_leads WHERE id = ? AND business_id = ?',
      [leadId, id],
    );
    if (!current) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    statusChanged = current.status !== body.status;
    sets.push('status = ?');
    values.push(body.status);
  }
  if (body.nextFollowUpAt !== undefined) {
    const date = body.nextFollowUpAt === '' ? null : body.nextFollowUpAt;
    if (date !== null && !isValidLeadDate(date)) {
      return NextResponse.json({ error: 'Enter a valid follow-up date.' }, { status: 400 });
    }
    sets.push('next_follow_up_at = ?');
    values.push(date);
  }
  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string' || body.notes.length > 2000) {
      return NextResponse.json({ error: 'Notes must be 2000 characters or fewer.' }, { status: 400 });
    }
    sets.push('notes = ?');
    values.push(body.notes.trim());
  }

  const activity = typeof body.activity === 'string' ? body.activity.trim() : '';
  if (body.activity !== undefined && (typeof body.activity !== 'string' || activity.length > 500)) {
    return NextResponse.json({ error: 'Activity must be 500 characters or fewer.' }, { status: 400 });
  }
  const activityType = body.activityType === undefined ? 'follow_up' : body.activityType;
  const allowedActivityTypes = ['note', 'call', 'email', 'whatsapp', 'meeting', 'follow_up'];
  if (activity && (typeof activityType !== 'string' || !allowedActivityTypes.includes(activityType))) {
    return NextResponse.json({ error: 'Select a valid activity type.' }, { status: 400 });
  }
  if (!sets.length && !activity && !statusChanged) {
    return NextResponse.json({ error: 'There are no changes to save.' }, { status: 400 });
  }

  try {
    const statements = [];
    if (sets.length) {
      sets.push('updated_at = ?', 'sync_revision = sync_revision + 1');
      values.push(new Date().toISOString());
      statements.push({
        sql: `UPDATE vendor_leads SET ${sets.join(', ')}
               WHERE id = ? AND business_id = ? AND archived_at IS NULL`,
        params: [...values, leadId, id],
      });
    } else if (activity) {
      statements.push({
        sql: `UPDATE vendor_leads
                 SET updated_at = ?, sync_revision = sync_revision + 1
               WHERE id = ? AND business_id = ? AND archived_at IS NULL`,
        params: [new Date().toISOString(), leadId, id],
      });
    }
    if (statusChanged) {
      statements.push({
        sql: `INSERT INTO vendor_lead_activities
                (id, business_id, lead_id, activity_type, summary, created_by)
              VALUES (?, ?, ?, 'status_change', ?, ?)`,
        params: [crypto.randomUUID(), id, leadId, `Stage changed to ${body.status}`, auth.user.id],
      });
    }
    if (activity) {
      statements.push({
        sql: `INSERT INTO vendor_lead_activities
                (id, business_id, lead_id, activity_type, summary, created_by)
              VALUES (?, ?, ?, ?, ?, ?)`,
        params: [crypto.randomUUID(), id, leadId, activityType, activity, auth.user.id],
      });
    }
    await batch(statements);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not update vendor landing-page CRM lead:', error);
    return NextResponse.json({ error: 'Could not save lead changes.' }, { status: 500 });
  }
}
