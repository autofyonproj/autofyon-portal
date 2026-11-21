import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import {
  effectiveStandaloneFeatures,
  isStandaloneCrmTierId,
  parseStandaloneFeatureOverrides,
  parseStandaloneFeatures,
} from '@/lib/standalone-license';
import { getVendorTier } from '@/lib/tiers';


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

function validSerial(value: unknown): value is string {
  return typeof value === 'string' && /^AFY-\d{4}-[A-F0-9]{10}$/.test(value);
}

function validToken(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  if (!validSerial(body.serial) || !validToken(body.clientTrackingToken)) {
    return jsonResponse({ error: 'Invalid client credentials' }, 400);
  }
  const version = typeof body.version === 'string' && body.version.length <= 40
    ? body.version.trim()
    : '';

  try {
    const tokenHash = await hashToken(body.clientTrackingToken);
    const copy = await queryOne<{
      serial: string;
      status: string;
      business_id: string | null;
      package_version: string | null;
      template_id: string;
      crm_tier: string;
      feature_overrides_json: string;
      phone_verified_at: string | null;
    }>(
      `SELECT serial, status, business_id, package_version, template_id, crm_tier, feature_overrides_json, phone_verified_at
         FROM standalone_client_copies
        WHERE serial = ? AND client_token_hash = ?`,
      [body.serial, tokenHash],
    );
    if (!copy) return jsonResponse({ error: 'Invalid client credentials' }, 401);
    if (!isStandaloneCrmTierId(copy.crm_tier)) {
      return jsonResponse({ error: 'Client CRM tier configuration is invalid' }, 500);
    }

    const template = await queryOne<{ features_json: string }>(
      'SELECT features_json FROM standalone_license_templates WHERE id = ?',
      [copy.template_id],
    );
    if (!template) return jsonResponse({ error: 'Client feature template is unavailable' }, 503);

    let templateFeatures: ReturnType<typeof parseStandaloneFeatures>;
    let featureOverrides: ReturnType<typeof parseStandaloneFeatureOverrides>;
    try {
      templateFeatures = parseStandaloneFeatures(JSON.parse(template.features_json));
      featureOverrides = parseStandaloneFeatureOverrides(JSON.parse(copy.feature_overrides_json));
    } catch {
      return jsonResponse({ error: 'Client feature configuration is invalid' }, 500);
    }
    if (!templateFeatures || !featureOverrides) {
      return jsonResponse({ error: 'Client feature configuration is invalid' }, 500);
    }

    const effectiveFeatures = effectiveStandaloneFeatures(templateFeatures, featureOverrides);
    await batch([
      {
        sql: `UPDATE standalone_client_copies
                 SET last_seen_at = CURRENT_TIMESTAMP,
                     package_version = CASE WHEN ? = '' THEN package_version ELSE ? END,
                     updated_at = CURRENT_TIMESTAMP
               WHERE serial = ?`,
        params: [version, version, copy.serial],
      },
      ...(version && version !== copy.package_version ? [{
        sql: `INSERT INTO standalone_license_events
                (id, subject_type, subject_id, event_type, details_json, actor_email)
              VALUES (?, 'copy', ?, 'client_version_reported', ?, 'client-heartbeat')`,
        params: [crypto.randomUUID(), copy.serial, JSON.stringify({ version })],
      }] : []),
    ]);

    if (copy.status === 'suspended' || copy.status === 'revoked') {
      return jsonResponse({ ok: false, serial: copy.serial, status: copy.status }, 403);
    }

    return jsonResponse({
      ok: true,
      serial: copy.serial,
      status: copy.status,
      businessId: copy.business_id,
      phoneVerified: Boolean(copy.phone_verified_at),
      features: effectiveFeatures,
      crmTier: copy.crm_tier,
      crmEntitlements: getVendorTier(copy.crm_tier).crm,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to process standalone copy heartbeat:', error);
    return jsonResponse({ error: 'Unable to verify client copy status' }, 500);
  }
}
