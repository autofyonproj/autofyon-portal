import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { requireVendorLeadAccess } from '@/lib/vendor-lead-auth';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';
import { getVendorTier } from '@/lib/tiers';

type RouteContext = { params: Promise<{ id: string }> };

async function eligiblePublishedBusiness(id: string): Promise<{ type_id: string; subscription_tier: string } | null> {
  const business = await queryOne<{ type_id: string; subscription_tier: string }>(
    'SELECT type_id, subscription_tier FROM businesses WHERE id = ? AND published = 1 AND status = \'active\'',
    [id],
  );
  return business && isVendorLeadBusinessType(business.type_id) ? business : null;
}

async function tokenHash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `afcrm_${[...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) return auth;
  const business = await eligiblePublishedBusiness(id);
  if (!business) {
    return NextResponse.json({ error: 'An eligible published landing page is required.' }, { status: 403 });
  }

  try {
    const connection = await queryOne<{
      token_hint: string;
      created_at: string;
      last_used_at: string | null;
      can_write: number;
    }>(
      `SELECT token_hint, created_at, last_used_at, can_write
         FROM vendor_lead_connections
        WHERE business_id = ? AND revoked_at IS NULL`,
      [id],
    );
    return NextResponse.json({
      connected: Boolean(connection),
      tokenHint: connection?.token_hint ?? null,
      createdAt: connection?.created_at ?? null,
      lastUsedAt: connection?.last_used_at ?? null,
      canWrite: connection?.can_write === 1,
      canConnectStandalone: getVendorTier(business.subscription_tier).crm.standalone,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load standalone CRM connection:', error);
    return NextResponse.json({ error: 'Could not load CRM connection status.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) return auth;
  if (auth.membershipRole !== 'owner' && auth.membershipRole !== 'platform_admin') {
    return NextResponse.json({ error: 'Only a business owner can create or rotate an ERP connection.' }, { status: 403 });
  }
  const business = await eligiblePublishedBusiness(id);
  if (!business) {
    return NextResponse.json({ error: 'An eligible published landing page is required.' }, { status: 403 });
  }
  if (!getVendorTier(business.subscription_tier).crm.standalone) {
    return NextResponse.json({ error: 'Standalone CRM connections require Growth, Pro, or Enterprise.' }, { status: 403 });
  }

  try {
    const token = createToken();
    const hash = await tokenHash(token);
    const now = new Date().toISOString();
    await execute(
      `INSERT INTO vendor_lead_connections
         (business_id, token_hash, token_hint, created_at, last_used_at, revoked_at, can_write)
       VALUES (?, ?, ?, ?, NULL, NULL, 1)
       ON CONFLICT(business_id) DO UPDATE SET
         token_hash = excluded.token_hash,
         token_hint = excluded.token_hint,
         created_at = excluded.created_at,
         last_used_at = NULL,
         revoked_at = NULL,
         can_write = 1`,
      [id, hash, token.slice(-8), now],
    );
    return NextResponse.json({ token }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not create standalone CRM connection:', error);
    return NextResponse.json({ error: 'Could not create the CRM connection.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) return auth;
  if (auth.membershipRole !== 'owner' && auth.membershipRole !== 'platform_admin') {
    return NextResponse.json({ error: 'Only a business owner can revoke an ERP connection.' }, { status: 403 });
  }
  if (!await eligiblePublishedBusiness(id)) {
    return NextResponse.json({ error: 'An eligible published landing page is required.' }, { status: 403 });
  }

  try {
    await execute(
      `UPDATE vendor_lead_connections SET revoked_at = ?
        WHERE business_id = ? AND revoked_at IS NULL`,
      [new Date().toISOString(), id],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not revoke standalone CRM connection:', error);
    return NextResponse.json({ error: 'Could not revoke the CRM connection.' }, { status: 500 });
  }
}
