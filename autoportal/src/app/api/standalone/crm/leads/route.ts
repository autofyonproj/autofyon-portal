import { NextRequest, NextResponse } from 'next/server';
import { batch, execute, query, queryOne } from '@/lib/db';
import { isValidLeadDate, isVendorLeadBusinessType } from '@/lib/vendor-leads';
import { getVendorTier } from '@/lib/tiers';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '600',
  'Cache-Control': 'no-store',
};

type ConnectionRow = {
  business_id: string;
  type_id: string;
  slug: string;
  subscription_tier: string;
  can_write: number;
};

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  inquiry_for: string;
  source: string;
  source_path: string;
  status: string;
  next_follow_up_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  sync_revision: number;
  archived_at: string | null;
};

type ActivitySyncRow = {
  id: string;
  lead_id: string;
  activity_type: string;
  summary: string;
  created_at: string;
  external_id: string | null;
};

type ParsedActivityUpdate = { externalId: string; type: string; summary: string };
type ParsedLeadUpdate = {
  leadId: string;
  baseRevision: number;
  patch: Record<string, unknown>;
  activities: ParsedActivityUpdate[];
};

function parseLeadUpdates(value: unknown): { updates: ParsedLeadUpdate[] } | { error: string } {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) {
    return { error: 'Submit between 1 and 50 lead updates.' };
  }
  const updates: ParsedLeadUpdate[] = [];
  const seenLeadIds = new Set<string>();
  const allowedKeys = ['status', 'nextFollowUpAt', 'notes', 'archived', 'activities'];
  const allowedActivityTypes = ['note', 'call', 'email', 'whatsapp', 'meeting', 'follow_up'];

  for (const rawUpdate of value) {
    if (!rawUpdate || typeof rawUpdate !== 'object' || Array.isArray(rawUpdate)) {
      return { error: 'Each update must be an object.' };
    }
    const update = rawUpdate as Record<string, unknown>;
    const leadId = typeof update.leadId === 'string' ? update.leadId.trim() : '';
    const baseRevision = update.baseRevision;
    const rawPatch = update.changes;
    if (!leadId || leadId.length > 100 || typeof baseRevision !== 'number' ||
        !Number.isInteger(baseRevision) || baseRevision < 1 ||
        !rawPatch || typeof rawPatch !== 'object' || Array.isArray(rawPatch)) {
      return { error: 'Each update needs a lead ID, base revision, and changes.' };
    }
    if (seenLeadIds.has(leadId)) return { error: 'A lead may appear only once per sync request.' };
    seenLeadIds.add(leadId);

    const patch = rawPatch as Record<string, unknown>;
    if (Object.keys(patch).some((key) => !allowedKeys.includes(key))) {
      return { error: 'The update contains unsupported fields.' };
    }
    if (patch.status !== undefined &&
        (typeof patch.status !== 'string' || !['new', 'contacted', 'qualified', 'visit_or_quote', 'won', 'lost'].includes(patch.status))) {
      return { error: 'Select a valid lead stage.' };
    }
    if (patch.nextFollowUpAt !== undefined &&
        patch.nextFollowUpAt !== null && !isValidLeadDate(patch.nextFollowUpAt)) {
      return { error: 'Enter a valid follow-up date.' };
    }
    if (patch.notes !== undefined && (typeof patch.notes !== 'string' || patch.notes.length > 2000)) {
      return { error: 'Notes must be 2000 characters or fewer.' };
    }
    if (patch.archived !== undefined && typeof patch.archived !== 'boolean') {
      return { error: 'Archive must be a boolean value.' };
    }

    const rawActivities = patch.activities === undefined ? [] : patch.activities;
    if (!Array.isArray(rawActivities) || rawActivities.length > 20) {
      return { error: 'Submit no more than 20 activities per lead update.' };
    }
    const activities: ParsedActivityUpdate[] = [];
    for (const rawActivity of rawActivities) {
      if (!rawActivity || typeof rawActivity !== 'object' || Array.isArray(rawActivity)) {
        return { error: 'Each activity must be an object.' };
      }
      const activity = rawActivity as Record<string, unknown>;
      const externalId = typeof activity.externalId === 'string' ? activity.externalId.trim() : '';
      const type = activity.type === undefined ? 'follow_up' : activity.type;
      const summary = typeof activity.summary === 'string' ? activity.summary.trim() : '';
      if (!/^[A-Za-z0-9:_-]{1,100}$/.test(externalId) ||
          typeof type !== 'string' || !allowedActivityTypes.includes(type) ||
          !summary || summary.length > 500) {
        return { error: 'An activity needs a valid ID, type, and summary of 500 characters or fewer.' };
      }
      activities.push({ externalId, type, summary });
    }
    if (!Object.keys(patch).some((key) => key !== 'activities') && !activities.length) {
      return { error: 'Provide at least one lead field or activity to update.' };
    }
    updates.push({ leadId, baseRevision, patch, activities });
  }
  return { updates };
}

async function tokenHash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function response(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer (afcrm_[a-f0-9]{64})$/);
  if (!match) return response({ error: 'A valid landing-page CRM connection token is required.' }, 401);

  const url = request.nextUrl;
  const afterUpdatedAt = url.searchParams.get('afterUpdatedAt')?.slice(0, 40) || '';
  const afterCreatedAt = url.searchParams.get('afterCreatedAt')?.slice(0, 40) || '';
  const afterId = url.searchParams.get('afterId')?.slice(0, 100) || '';
  if ((afterUpdatedAt && afterCreatedAt) ||
      (afterCreatedAt && !afterId) ||
      (afterId && !afterUpdatedAt && !afterCreatedAt)) {
    return response({ error: 'Provide a complete cursor: updatedAt (optional id) or createdAt/id.' }, 400);
  }
  const cursorField = afterUpdatedAt ? 'updated_at' : 'created_at';
  const cursorValue = afterUpdatedAt || afterCreatedAt;

  try {
    const connection = await queryOne<ConnectionRow>(
      `SELECT c.business_id, b.type_id, b.slug, b.subscription_tier, c.can_write
         FROM vendor_lead_connections c
         JOIN businesses b ON b.id = c.business_id
        WHERE c.token_hash = ? AND c.revoked_at IS NULL
          AND b.status = 'active' AND b.published = 1`,
      [await tokenHash(match[1])],
    );
    if (!connection || !isVendorLeadBusinessType(connection.type_id)) {
      return response({ error: 'This landing-page CRM connection is inactive.' }, 403);
    }
    if (!getVendorTier(connection.subscription_tier).crm.standalone) {
      return response({ error: 'Standalone CRM syncing requires a Growth, Pro, or Enterprise plan.' }, 403);
    }

    const rows = await query<LeadRow>(
      `SELECT id, name, phone, email, inquiry, inquiry_for, source, source_path,
              status, next_follow_up_at, notes, created_at, updated_at,
              sync_revision, archived_at
         FROM vendor_leads
        WHERE business_id = ?
          AND (? = '' OR ${cursorField} > ? OR (${cursorField} = ? AND id > ?))
        ORDER BY ${cursorField}, id
        LIMIT 251`,
      [connection.business_id, cursorValue, cursorValue, cursorValue, afterId],
    );
    const hasMore = rows.length > 250;
    const leads = rows.slice(0, 250);
    const last = leads[leads.length - 1];
    const activities = leads.length
      ? await query<ActivitySyncRow>(
          `SELECT id, lead_id, activity_type, summary, created_at, external_id
             FROM vendor_lead_activities
            WHERE business_id = ? AND lead_id IN (${leads.map(() => '?').join(',')})
            ORDER BY created_at DESC, id DESC
            LIMIT 5000`,
          [connection.business_id, ...leads.map((lead) => lead.id)],
        )
      : [];
    const activitiesByLead = new Map<string, ActivitySyncRow[]>();
    for (const activity of activities) {
      const current = activitiesByLead.get(activity.lead_id) ?? [];
      current.push(activity);
      activitiesByLead.set(activity.lead_id, current);
    }
    for (const leadActivities of activitiesByLead.values()) leadActivities.reverse();
    await execute(
      'UPDATE vendor_lead_connections SET last_used_at = ? WHERE business_id = ? AND revoked_at IS NULL',
      [new Date().toISOString(), connection.business_id],
    );

    return response({
      businessSlug: connection.slug,
      leads: leads.map((lead) => ({
        ...lead,
        activities: activitiesByLead.get(lead.id) ?? [],
      })),
      hasMore,
      nextCursor: hasMore && last
        ? { createdAt: last.created_at, updatedAt: last.updated_at, id: last.id }
        : null,
    });
  } catch (error) {
    console.error('Could not export landing-page leads to a connected ERP:', error);
    return response({ error: 'Could not load landing-page inquiries.' }, 500);
  }
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer (afcrm_[a-f0-9]{64})$/);
  if (!match) return response({ error: 'A valid landing-page CRM connection token is required.' }, 401);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return response({ error: 'Invalid sync request.' }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return response({ error: 'Invalid JSON.' }, 400);
  }

  const parsedUpdates = parseLeadUpdates(body.updates);
  if ('error' in parsedUpdates) return response({ error: parsedUpdates.error }, 400);

  try {
    const connection = await queryOne<ConnectionRow>(
      `SELECT c.business_id, b.type_id, b.slug, b.subscription_tier, c.can_write
         FROM vendor_lead_connections c
         JOIN businesses b ON b.id = c.business_id
        WHERE c.token_hash = ? AND c.revoked_at IS NULL
          AND b.status = 'active' AND b.published = 1`,
      [await tokenHash(match[1])],
    );
    if (!connection || !isVendorLeadBusinessType(connection.type_id)) {
      return response({ error: 'This landing-page CRM connection is inactive.' }, 403);
    }
    if (!getVendorTier(connection.subscription_tier).crm.standalone) {
      return response({ error: 'Standalone CRM syncing requires a Growth, Pro, or Enterprise plan.' }, 403);
    }
    if (connection.can_write !== 1) {
      return response({ error: 'This connection is read-only. The business owner must issue a new sync token.' }, 403);
    }

    const results: Array<Record<string, unknown>> = [];
    for (const update of parsedUpdates.updates) {
      const { leadId, baseRevision, patch, activities: parsedActivities } = update;
      const current = await queryOne<LeadRow>(
        `SELECT id, name, phone, email, inquiry, inquiry_for, source, source_path,
                status, next_follow_up_at, notes, created_at, updated_at,
                sync_revision, archived_at
           FROM vendor_leads
          WHERE id = ? AND business_id = ?`,
        [leadId, connection.business_id],
      );
      if (!current) {
        results.push({ leadId, status: 'not_found' });
        continue;
      }
      if (current.sync_revision !== baseRevision) {
        const fieldsMatch = (patch.status === undefined || patch.status === current.status)
          && (patch.nextFollowUpAt === undefined || patch.nextFollowUpAt === current.next_follow_up_at)
          && (patch.notes === undefined || patch.notes === current.notes)
          && (patch.archived === undefined || patch.archived === Boolean(current.archived_at));
        if (fieldsMatch) {
          if (parsedActivities.length) {
            await batch(parsedActivities.map((activity) => ({
              sql: `INSERT OR IGNORE INTO vendor_lead_activities
                      (id, business_id, lead_id, activity_type, summary, external_id)
                    SELECT ?, ?, ?, ?, ?, ?
                     WHERE EXISTS (
                       SELECT 1 FROM vendor_leads
                        WHERE id = ? AND business_id = ? AND sync_revision > ?
                     )`,
              params: [
                crypto.randomUUID(),
                connection.business_id,
                leadId,
                activity.type,
                activity.summary,
                activity.externalId,
                leadId,
                connection.business_id,
                baseRevision,
              ],
            })));
          }
          results.push({ leadId, status: 'updated', remote: current });
          continue;
        }
        results.push({ leadId, status: 'conflict', remote: current });
        continue;
      }

      const sets: string[] = [];
      const values: unknown[] = [];
      if (patch.status !== undefined) {
        sets.push('status = ?');
        values.push(patch.status);
      }
      if (patch.nextFollowUpAt !== undefined) {
        sets.push('next_follow_up_at = ?');
        values.push(patch.nextFollowUpAt);
      }
      if (patch.notes !== undefined) {
        sets.push('notes = ?');
        values.push(patch.notes);
      }
      if (patch.archived !== undefined) {
        sets.push('archived_at = ?');
        values.push(patch.archived ? new Date().toISOString() : null);
      }
      if (parsedActivities.length && !sets.length) {
        sets.push('updated_at = ?', 'sync_revision = sync_revision + 1');
        values.push(new Date().toISOString());
      }
      const now = new Date().toISOString();
      const statements = [];
      if (sets.length) {
        if (!sets.some((set) => set.startsWith('updated_at = '))) {
          sets.push('updated_at = ?', 'sync_revision = sync_revision + 1');
          values.push(now);
        }
        statements.push({
          sql: `UPDATE vendor_leads
              SET ${sets.join(', ')}
            WHERE id = ? AND business_id = ? AND sync_revision = ?`,
          params: [...values, leadId, connection.business_id, baseRevision],
        });
      }
      const updateIndex = sets.length ? 0 : -1;
      if (parsedActivities.length) {
        statements.push(...parsedActivities.map((activity) => ({
          sql: `INSERT OR IGNORE INTO vendor_lead_activities
                  (id, business_id, lead_id, activity_type, summary, external_id)
                SELECT ?, ?, ?, ?, ?, ?
                 WHERE EXISTS (
                   SELECT 1 FROM vendor_leads
                    WHERE id = ? AND business_id = ? AND sync_revision > ?
                 )`,
          params: [
            crypto.randomUUID(),
            connection.business_id,
            leadId,
            activity.type,
            activity.summary,
            activity.externalId,
            leadId,
            connection.business_id,
            baseRevision,
          ],
        })));
      }
      const writes = statements.length ? await batch(statements) : [];
      if (updateIndex >= 0 && writes[updateIndex].changes !== 1) {
          const remote = await queryOne<LeadRow>(
            `SELECT id, name, phone, email, inquiry, inquiry_for, source, source_path,
                    status, next_follow_up_at, notes, created_at, updated_at,
                    sync_revision, archived_at
               FROM vendor_leads
              WHERE id = ? AND business_id = ?`,
            [leadId, connection.business_id],
          );
          results.push({ leadId, status: 'conflict', remote });
          continue;
      }
      const updated = await queryOne<LeadRow>(
        `SELECT id, name, phone, email, inquiry, inquiry_for, source, source_path,
                status, next_follow_up_at, notes, created_at, updated_at,
                sync_revision, archived_at
           FROM vendor_leads
          WHERE id = ? AND business_id = ?`,
        [leadId, connection.business_id],
      );
      results.push({ leadId, status: 'updated', remote: updated });
    }

    await execute(
      'UPDATE vendor_lead_connections SET last_used_at = ? WHERE business_id = ? AND revoked_at IS NULL',
      [new Date().toISOString(), connection.business_id],
    );
    return response({ results });
  } catch (error) {
    console.error('Could not apply standalone ERP lead updates:', error);
    return response({ error: 'Could not sync lead updates.' }, 500);
  }
}
