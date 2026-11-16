import { execute, parseJson, queryOne } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-session';

const EVENT_TYPES = [
  'page_view',
  'vehicle_view',
  'vehicle_click',
  'phone_click',
  'whatsapp_click',
] as const;
type EventType = typeof EVENT_TYPES[number];

function badRequest(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

async function actorForBusiness(request: Request, businessId: string): Promise<string | null> {
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)admin_session=([^;]+)/)?.[1];
  if (!cookie) return null;

  const email = (await verifyAdminSession(cookie))?.trim().toLowerCase();
  if (!email) return null;

  const user = await queryOne<{ id: string; role: string; scope_ids: string }>(
    'SELECT id, role, scope_ids FROM admin_users WHERE email = ? AND active = 1',
    [email],
  );
  if (!user) return null;

  const scopes = parseJson<string[]>(user.scope_ids, []);
  return user.role === 'platform_admin' || scopes.includes('*') || scopes.includes(businessId)
    ? user.id
    : null;
}

export async function POST(request: Request): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 4096) return badRequest('Request body is too large.', 413);

  const rawBody = await request.text();
  if (rawBody.length > 4096) return badRequest('Request body is too large.', 413);

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return badRequest('Invalid JSON body.');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return badRequest('Invalid event payload.');
  }

  const data = payload as Record<string, unknown>;
  const businessId = typeof data.businessId === 'string' ? data.businessId.trim() : '';
  const eventType = data.eventType;
  const unitId = typeof data.unitId === 'string' && data.unitId.trim() ? data.unitId.trim() : null;
  const path = typeof data.path === 'string' ? data.path : '';
  const sourceHost = typeof data.sourceHost === 'string' ? data.sourceHost.toLowerCase() : '';
  const contactTarget = typeof data.contactTarget === 'string' ? data.contactTarget : null;

  if (!businessId || businessId.length > 120) return badRequest('Invalid business id.');
  if (typeof eventType !== 'string' || !EVENT_TYPES.includes(eventType as EventType)) {
    return badRequest('Unsupported event type.');
  }
  if (!path.startsWith('/') || path.startsWith('//') || path.length > 512 || /[?#\u0000-\u001f]/.test(path)) {
    return badRequest('Invalid page path.');
  }
  if (sourceHost && (sourceHost.length > 253 || !/^[a-z0-9.-]+$/.test(sourceHost))) {
    return badRequest('Invalid source host.');
  }
  if (contactTarget !== null && (contactTarget.length > 24 || !/^\+?\d{7,18}$/.test(contactTarget))) {
    return badRequest('Invalid contact target.');
  }
  if (['vehicle_view', 'vehicle_click'].includes(eventType) && !unitId) {
    return badRequest('Vehicle events require a vehicle id.');
  }
  if (contactTarget && !['phone_click', 'whatsapp_click'].includes(eventType)) {
    return badRequest('Contact target is only valid for contact events.');
  }

  const business = await queryOne<{ id: string }>(
    'SELECT id FROM businesses WHERE id = ? AND status = \'active\'',
    [businessId],
  );
  if (!business) return badRequest('Business not found.', 404);

  if (unitId) {
    const unit = await queryOne<{ id: string }>(
      'SELECT id FROM units WHERE id = ? AND seller_business_id = ?',
      [unitId, businessId],
    );
    if (!unit) return badRequest('Vehicle does not belong to this business.', 404);
  }

  let actorId: string | null = null;
  try {
    actorId = await actorForBusiness(request, businessId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('ADMIN_SESSION_SECRET')) {
      console.error('Analytics staff attribution unavailable: ADMIN_SESSION_SECRET is not configured.');
    } else {
      throw error;
    }
  }

  const host = new URL(request.url).hostname.toLowerCase();
  if (host.length > 253 || !/^[a-z0-9.-]+$/.test(host)) return badRequest('Invalid request host.');

  await execute(
    `INSERT INTO business_analytics_events
      (id, business_id, unit_id, actor_admin_user_id, event_type, host, path, source_host, contact_target)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      businessId,
      unitId,
      actorId,
      eventType,
      host,
      path,
      sourceHost,
      contactTarget,
    ],
  );

  return new Response(null, { status: 204 });
}
