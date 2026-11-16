import { execute, query, queryOne } from '@/lib/db';
import { sha256, validateExchangePayload } from '@/lib/vehicle-exchange';


type RouteContext = { params: Promise<{ slug: string }> };

async function authenticate(request: Request, slug: string) {
  const authorization = request.headers.get('authorization') ?? '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) return null;
  const site = await queryOne<{ id: string; slug: string }>(
    `SELECT b.id, b.slug FROM vehicle_exchange_sites x
       JOIN businesses b ON b.id = x.vendor_business_id
      WHERE b.slug = ? AND x.enabled = 1 AND b.status = 'active' AND b.published = 1
        AND x.token_hash = ?`,
    [slug, await sha256(token)],
  );
  if (!site) return null;
  await execute(
    'UPDATE vehicle_exchange_sites SET last_used_at = ? WHERE vendor_business_id = ?',
    [new Date().toISOString(), site.id],
  );
  return site;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const site = await authenticate(request, slug);
  if (!site) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const proposals = await query<{
    id: string; external_vehicle_id: string; version_hash: string; payload: string; created_at: string;
  }>(
    `SELECT id, external_vehicle_id, version_hash, payload, created_at
       FROM vehicle_exchange_proposals
      WHERE vendor_business_id = ? AND direction = 'export'
        AND status = 'approved' AND delivered_at IS NULL
      ORDER BY created_at`,
    [site.id],
  );
  return Response.json({
    schemaVersion: 1,
    updates: proposals.map((proposal) => ({
      id: proposal.id,
      externalVehicleId: proposal.external_vehicle_id,
      version: proposal.version_hash,
      createdAt: proposal.created_at,
      payload: JSON.parse(proposal.payload) as unknown,
    })),
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const site = await authenticate(request, slug);
  if (!site) return Response.json({ error: 'unauthorized' }, { status: 401 });
  let body: { action?: string; proposalId?: string; payload?: unknown };
  try { body = await request.json() as typeof body; }
  catch { return Response.json({ error: 'body must be valid JSON' }, { status: 400 }); }

  if (body.action === 'acknowledge') {
    if (typeof body.proposalId !== 'string') {
      return Response.json({ error: 'proposalId is required' }, { status: 400 });
    }
    const result = await execute(
      `UPDATE vehicle_exchange_proposals SET delivered_at = ?
        WHERE id = ? AND vendor_business_id = ? AND direction = 'export'
          AND status = 'approved' AND delivered_at IS NULL`,
      [new Date().toISOString(), body.proposalId, site.id],
    );
    if (!result.changes) return Response.json({ error: 'approved update not found or already acknowledged' }, { status: 404 });
    return Response.json({ ok: true });
  }

  if (body.action !== 'submit') {
    return Response.json({ error: 'action must be submit or acknowledge' }, { status: 400 });
  }
  const payload = validateExchangePayload(body.payload);
  if (!payload) return Response.json({ error: 'vehicle payload failed schema validation' }, { status: 400 });

  const serialized = JSON.stringify(payload);
  const versionHash = await sha256(serialized);
  const now = new Date().toISOString();
  const proposalId = `vxi_${crypto.randomUUID()}`;
  const insert = await execute(
    `INSERT OR IGNORE INTO vehicle_exchange_proposals
      (id, vendor_business_id, direction, external_vehicle_id, version_hash, payload, status, created_at)
     VALUES (?, ?, 'import', ?, ?, ?, 'pending', ?)`,
    [proposalId, site.id, payload.vehicle.externalId, versionHash, serialized, now],
  );
  if (!insert.changes) {
    const existing = await queryOne<{ id: string; status: string }>(
      `SELECT id, status FROM vehicle_exchange_proposals
        WHERE vendor_business_id = ? AND direction = 'import'
          AND external_vehicle_id = ? AND version_hash = ?`,
      [site.id, payload.vehicle.externalId, versionHash],
    );
    return Response.json({ ok: true, duplicate: true, proposal: existing });
  }
  return Response.json({ ok: true, pendingApproval: true, proposalId }, { status: 202 });
}
