import { NextRequest, NextResponse } from 'next/server';
import { batch, execute, query, queryOne } from '@/lib/db';
import {
  effectiveStandaloneFeatures,
  parseStandaloneFeatureOverrides,
  parseStandaloneFeatures,
} from '@/lib/standalone-license';
import { parseAccountingDraftRecords } from '@/lib/standalone-accounting-sync';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-License-Serial',
  'Access-Control-Max-Age': '600',
  'Cache-Control': 'no-store',
};

type CopyRow = {
  serial: string;
  status: string;
  business_id: string | null;
  business_status: string | null;
  template_id: string;
  features_json: string;
  feature_overrides_json: string;
};

function response(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

function validSerial(value: unknown): value is string {
  return typeof value === 'string' && /^AFY-\d{4}-[A-F0-9]{10}$/.test(value);
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function authenticatedCopy(serialValue: unknown, tokenValue: unknown): Promise<CopyRow | Response> {
  const token = typeof tokenValue === 'string' ? tokenValue.trim() : '';
  if (!validSerial(serialValue) || !/^[a-f0-9]{64}$/.test(token)) {
    return response({ error: 'Valid standalone license credentials are required.' }, 401);
  }
  const copy = await queryOne<CopyRow>(
    `SELECT c.serial, c.status, c.business_id, b.status AS business_status,
            c.template_id, t.features_json, c.feature_overrides_json
       FROM standalone_client_copies c
       JOIN standalone_license_templates t ON t.id = c.template_id
       LEFT JOIN businesses b ON b.id = c.business_id
      WHERE c.serial = ? AND c.client_token_hash = ?`,
    [serialValue, await hash(token)],
  );
  if (!copy) return response({ error: 'Invalid standalone license credentials.' }, 401);
  if (copy.status !== 'active') return response({ error: 'The standalone license is not active.' }, 403);
  if (!copy.business_id || copy.business_status !== 'active') {
    return response({ error: 'Link this license to an active AutoFyon business before syncing accounting data.' }, 409);
  }

  let templateFeatures: ReturnType<typeof parseStandaloneFeatures>;
  let overrides: ReturnType<typeof parseStandaloneFeatureOverrides>;
  try {
    templateFeatures = parseStandaloneFeatures(JSON.parse(copy.features_json));
    overrides = parseStandaloneFeatureOverrides(JSON.parse(copy.feature_overrides_json));
  } catch {
    return response({ error: 'The standalone license feature configuration is invalid.' }, 500);
  }
  if (!templateFeatures || !overrides) {
    return response({ error: 'The standalone license feature configuration is invalid.' }, 500);
  }
  const features = effectiveStandaloneFeatures(templateFeatures, overrides);
  if (!features.accounting || !features.cloud_sync) {
    return response({ error: 'Accounting and cloud synchronization must both be enabled for this license.' }, 403);
  }
  return copy;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const serial = request.headers.get('x-license-serial');
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer ([a-f0-9]{64})$/);
  const copy = await authenticatedCopy(serial, match?.[1]);
  if (copy instanceof Response) return copy;
  const afterReviewedAt = request.nextUrl.searchParams.get('afterReviewedAt')?.slice(0, 40) || '';
  const afterId = request.nextUrl.searchParams.get('afterId')?.slice(0, 100) || '';
  if (Boolean(afterReviewedAt) !== Boolean(afterId)) {
    return response({ error: 'Provide both cursor values: afterReviewedAt and afterId.' }, 400);
  }
  if (afterReviewedAt) {
    const parsedCursorDate = new Date(afterReviewedAt);
    if (Number.isNaN(parsedCursorDate.valueOf()) || parsedCursorDate.toISOString() !== afterReviewedAt) {
      return response({ error: 'The accounting draft cursor is invalid.' }, 400);
    }
  }

  try {
    const rows = await query<{
      id: string;
      source_serial: string;
      source_record_id: string;
      record_type: string;
      occurred_at: string;
      amount: number;
      payload_json: string;
      created_at: string;
      reviewed_at: string;
    }>(
      `SELECT d.id, d.source_serial, d.source_record_id, d.record_type, d.occurred_at,
              d.amount, d.payload_json, d.created_at, d.reviewed_at
         FROM standalone_accounting_drafts d
         LEFT JOIN standalone_accounting_deliveries sent
           ON sent.draft_id = d.id AND sent.recipient_serial = ?
        WHERE d.business_id = ? AND d.status = 'approved'
         AND d.source_serial != ? AND sent.acknowledged_at IS NULL
         AND (? = '' OR d.reviewed_at > ? OR (d.reviewed_at = ? AND d.id > ?))
        ORDER BY d.reviewed_at, d.id
        LIMIT 100`,
      [copy.serial, copy.business_id, copy.serial, afterReviewedAt, afterReviewedAt, afterReviewedAt, afterId],
    );
    const drafts = rows.map((row) => {
      let payload: unknown;
      try {
        payload = JSON.parse(row.payload_json);
      } catch {
        throw new Error(`Accounting draft ${row.id} contains invalid stored JSON.`);
      }
      return {
        id: row.id,
        sourceSerial: row.source_serial,
        sourceRecordId: row.source_record_id,
        type: row.record_type,
        occurredAt: row.occurred_at,
        amount: row.amount,
        payload,
        createdAt: row.created_at,
      };
    });
    await execute(
      'UPDATE standalone_client_copies SET last_seen_at = CURRENT_TIMESTAMP WHERE serial = ?',
      [copy.serial],
    );
    const last = rows[rows.length - 1];
    return response({
      drafts,
      hasMore: rows.length === 100,
      nextCursor: rows.length === 100 && last
        ? { reviewedAt: last.reviewed_at, id: last.id }
        : null,
    });
  } catch (error) {
    console.error('Could not load approved standalone accounting drafts:', error);
    return response({ error: 'Could not load approved accounting drafts.' }, 500);
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return response({ error: 'Invalid accounting sync request.' }, 400);
    }
    body = parsed as Record<string, unknown>;
    if (JSON.stringify(body).length > 256_000) {
      return response({ error: 'The accounting sync request is too large.' }, 413);
    }
  } catch {
    return response({ error: 'Invalid JSON.' }, 400);
  }

  const copy = await authenticatedCopy(body.serial, body.clientTrackingToken);
  if (copy instanceof Response) return copy;

  try {
    if (body.action === 'acknowledge') {
      if (!Array.isArray(body.draftIds) || body.draftIds.length < 1 || body.draftIds.length > 100 ||
          body.draftIds.some((id) => typeof id !== 'string' || !/^[A-Za-z0-9-]{1,100}$/.test(id)) ||
          new Set(body.draftIds).size !== body.draftIds.length) {
        return response({ error: 'Provide between 1 and 100 valid approved draft IDs.' }, 400);
      }
      const placeholders = body.draftIds.map(() => '?').join(',');
      const eligible = await query<{ id: string }>(
        `SELECT id FROM standalone_accounting_drafts
          WHERE id IN (${placeholders}) AND business_id = ? AND status = 'approved' AND source_serial != ?`,
        [...body.draftIds, copy.business_id, copy.serial],
      );
      if (eligible.length !== body.draftIds.length) {
        return response({ error: 'One or more drafts are not approved for this linked license.' }, 409);
      }
      const statements = body.draftIds.map((draftId) => ({
        sql: `INSERT INTO standalone_accounting_deliveries (draft_id, recipient_serial, acknowledged_at)
              SELECT id, ?, CURRENT_TIMESTAMP
                FROM standalone_accounting_drafts
               WHERE id = ? AND business_id = ? AND status = 'approved' AND source_serial != ?
              ON CONFLICT(draft_id, recipient_serial) DO UPDATE
                SET acknowledged_at = excluded.acknowledged_at
              WHERE standalone_accounting_deliveries.acknowledged_at IS NULL`,
        params: [copy.serial, draftId, copy.business_id, copy.serial],
      }));
      await batch(statements);
      await execute(
        'UPDATE standalone_client_copies SET last_seen_at = CURRENT_TIMESTAMP WHERE serial = ?',
        [copy.serial],
      );
      return response({ ok: true });
    }

    const parsedRecords = parseAccountingDraftRecords(body.records);
    if ('error' in parsedRecords) return response({ error: parsedRecords.error }, 400);
    const featureRow = await queryOne<{ features_json: string; feature_overrides_json: string }>(
      `SELECT t.features_json, c.feature_overrides_json
         FROM standalone_client_copies c
         JOIN standalone_license_templates t ON t.id = c.template_id
        WHERE c.serial = ?`,
      [copy.serial],
    );
    if (!featureRow) return response({ error: 'Standalone license configuration is unavailable.' }, 500);
    let purchasingEnabled = false;
    try {
      const template = parseStandaloneFeatures(JSON.parse(featureRow.features_json));
      const overrides = parseStandaloneFeatureOverrides(JSON.parse(featureRow.feature_overrides_json));
      purchasingEnabled = Boolean(template && overrides && effectiveStandaloneFeatures(template, overrides).purchasing);
    } catch {
      return response({ error: 'The standalone license feature configuration is invalid.' }, 500);
    }
    if (parsedRecords.records.some((record) => record.type === 'purchase') && !purchasingEnabled) {
      return response({ error: 'Purchasing is not enabled for this license.' }, 403);
    }

    const draftsToInsert: Array<{ id: string; record: (typeof parsedRecords.records)[number]; payload: string; payloadHash: string }> = [];
    for (const record of parsedRecords.records) {
      const payload = JSON.stringify(record);
      draftsToInsert.push({
        id: crypto.randomUUID(),
        record,
        payload,
        payloadHash: await hash(payload),
      });
    }
    const statements = draftsToInsert.flatMap(({ id, record, payload, payloadHash }) => [
      {
        sql: `INSERT OR IGNORE INTO standalone_accounting_drafts
                (id, business_id, source_serial, source_record_id, record_type, occurred_at,
                 amount, payload_json, payload_hash)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          id, copy.business_id, copy.serial, record.sourceRecordId, record.type,
          record.occurredAt, record.amount, payload, payloadHash,
        ],
      },
      {
        sql: `INSERT INTO standalone_accounting_draft_events
                (id, draft_id, event_type, actor_type, actor_id, details_json)
              SELECT ?, ?, 'submitted', 'license', ?, ?
               WHERE EXISTS (SELECT 1 FROM standalone_accounting_drafts WHERE id = ?)`,
        params: [
          crypto.randomUUID(), id, copy.serial,
          JSON.stringify({ sourceRecordId: record.sourceRecordId }),
          id,
        ],
      },
    ]);
    await batch(statements);

    const results: Array<Record<string, unknown>> = [];
    for (const item of draftsToInsert) {
      const existing = await queryOne<{
        id: string;
        payload_hash: string;
        status: string;
      }>(
        `SELECT id, payload_hash, status FROM standalone_accounting_drafts
          WHERE source_serial = ? AND source_record_id = ?`,
        [copy.serial, item.record.sourceRecordId],
      );
      if (!existing) throw new Error(`Accounting draft ${item.record.sourceRecordId} was not saved.`);
      if (existing.payload_hash !== item.payloadHash) {
        results.push({ sourceRecordId: item.record.sourceRecordId, status: 'conflict' });
      } else {
        results.push({
          sourceRecordId: item.record.sourceRecordId,
          draftId: existing.id,
          status: existing.id === item.id ? 'submitted' : 'duplicate',
          reviewStatus: existing.status,
        });
      }
    }
    await execute(
      'UPDATE standalone_client_copies SET last_seen_at = CURRENT_TIMESTAMP WHERE serial = ?',
      [copy.serial],
    );
    return response({ results });
  } catch (error) {
    console.error('Could not submit standalone accounting drafts:', error);
    return response({ error: 'Could not submit accounting drafts.' }, 500);
  }
}
