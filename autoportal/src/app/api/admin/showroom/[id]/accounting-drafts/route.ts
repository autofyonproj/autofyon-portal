import { NextRequest, NextResponse } from 'next/server';
import { batch, query, queryOne } from '@/lib/db';
import { requireVendorAccountingAccess } from '@/lib/vendor-lead-auth';
import { parseAccountingDraftRecords } from '@/lib/standalone-accounting-sync';

type RouteContext = { params: Promise<{ id: string }> };

type DraftRow = {
  id: string;
  source_serial: string;
  source_record_id: string;
  record_type: 'sale' | 'purchase';
  occurred_at: string;
  amount: number;
  payload_json: string;
  status: string;
  created_at: string;
  review_note: string;
};

async function authorize(request: NextRequest, businessId: string) {
  return requireVendorAccountingAccess(request, businessId);
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await authorize(request, id);
  if (auth instanceof Response) return auth;

  try {
    const rows = await query<DraftRow>(
      `SELECT id, source_serial, source_record_id, record_type, occurred_at,
              amount, payload_json, status, created_at, review_note
         FROM standalone_accounting_drafts
        WHERE business_id = ? AND status = 'pending_review'
        ORDER BY created_at, id
        LIMIT 100`,
      [id],
    );
    const drafts = rows.map((row) => {
      let rawPayload: unknown;
      try {
        rawPayload = JSON.parse(row.payload_json);
      } catch {
        throw new Error(`Accounting draft ${row.id} contains invalid stored JSON.`);
      }
      const parsed = parseAccountingDraftRecords([rawPayload]);
      if ('error' in parsed) throw new Error(`Accounting draft ${row.id} failed validation: ${parsed.error}`);
      return {
        id: row.id,
        sourceSerial: row.source_serial,
        sourceRecordId: row.source_record_id,
        type: row.record_type,
        occurredAt: row.occurred_at,
        amount: row.amount,
        payload: parsed.records[0],
        status: row.status,
        createdAt: row.created_at,
        reviewNote: row.review_note,
      };
    });
    return NextResponse.json({ drafts, hasMore: rows.length === 100 }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Could not load standalone accounting drafts:', error);
    return NextResponse.json({ error: 'Could not load accounting drafts.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid accounting draft review.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const draftId = typeof body.draftId === 'string' ? body.draftId.trim() : '';
  const status = body.status;
  const reviewNote = typeof body.reviewNote === 'string' ? body.reviewNote.trim() : '';
  if (!/^[A-Za-z0-9-]{1,100}$/.test(draftId) ||
      (status !== 'approved' && status !== 'rejected') ||
      reviewNote.length > 500) {
    return NextResponse.json({ error: 'Select a valid decision and optional note (maximum 500 characters).' }, { status: 400 });
  }

  try {
    const draft = await queryOne<{ id: string }>(
      `SELECT id FROM standalone_accounting_drafts
        WHERE id = ? AND business_id = ? AND status = 'pending_review'`,
      [draftId, id],
    );
    if (!draft) return NextResponse.json({ error: 'Draft not found or already reviewed.' }, { status: 409 });

    const reviewedAt = new Date().toISOString();
    const writes = await batch([
      {
        sql: `UPDATE standalone_accounting_drafts
                 SET status = ?, review_note = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ?
               WHERE id = ? AND business_id = ? AND status = 'pending_review'`,
        params: [status, reviewNote, auth.user.id, reviewedAt, reviewedAt, draftId, id],
      },
      {
        sql: `INSERT INTO standalone_accounting_draft_events
                (id, draft_id, event_type, actor_type, actor_id, details_json)
              SELECT ?, id, ?, 'admin', ?, ?
                FROM standalone_accounting_drafts
               WHERE id = ? AND business_id = ? AND status = ?
                 AND reviewed_by = ? AND reviewed_at = ?`,
        params: [
          crypto.randomUUID(), status, auth.user.id,
          JSON.stringify({ reviewNote }), draftId, id, status, auth.user.id, reviewedAt,
        ],
      },
    ]);
    if (writes[0]?.changes !== 1) {
      return NextResponse.json({ error: 'Another reviewer already handled this draft.' }, { status: 409 });
    }
    if (writes[1]?.changes !== 1) {
      throw new Error(`Could not record the review event for draft ${draftId}.`);
    }
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error('Could not review standalone accounting draft:', error);
    return NextResponse.json({ error: 'Could not save the accounting draft decision.' }, { status: 500 });
  }
}
