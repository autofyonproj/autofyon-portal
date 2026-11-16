/**
 * Admin authorization helper.
 *
 * Cloudflare Access authenticates the user; this module maps the verified email
 * to an active platform or business-scoped role in D1.
 */
import { queryOne } from '@/lib/db';
import { verifyAdminSession } from '@/lib/admin-session';

export interface AdminUser {
  id: string;
  email: string;
  role: 'platform_admin' | 'vendor';
  scope_ids: string[];   // ['*'] means unrestricted
  active: number;
}

export const SUPER_ADMIN_EMAIL = 'platformadmin@autofyon.com';
export const AUTOFYON_MASTER_EMAIL = 'autofyon@gmail.com';

/**
 * Load the admin user based on session cookie, Cloudflare header, or dev fallback.
 */
export async function getAdminUser(request: Request): Promise<AdminUser | null> {
  let email = request.headers.get('cf-access-authenticated-user-email')?.trim().toLowerCase() ?? null;

  // Check admin session cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (match) {
    email = (await verifyAdminSession(match[1]))?.trim().toLowerCase() ?? email;
  }

  // Do not automatically default unauthenticated requests to super admin.
  // Every user must authenticate through a signed admin_session cookie or Cloudflare Access.
  if (!email) return null;

  const row = await queryOne<{ id: string; email: string; role: string; scope_ids: string; active: number }>(
    'SELECT id, email, role, scope_ids, active FROM admin_users WHERE email = ? AND active = 1',
    [email],
  );
  if (!row) return null;

  let scope_ids: string[] = [];
  try { scope_ids = JSON.parse(row.scope_ids) as string[]; } catch { /* keep empty */ }

  return {
    id: row.id,
    email: row.email,
    role: row.role as AdminUser['role'],
    scope_ids,
    active: row.active,
  };
}

/**
 * Check whether an admin user may act on a specific business id.
 * Platform admins pass unconditionally; vendors need the id in their scope list.
 */
export function canAccessBusiness(user: AdminUser, businessId: string): boolean {
  if (user.role === 'platform_admin') return true;
  return user.scope_ids.includes('*') || user.scope_ids.includes(businessId);
}

/** Convenience: load user + check business access in one call. */
export async function requireBusinessAccess(
  request: Request,
  businessId: string,
): Promise<{ user: AdminUser } | Response> {
  const user = await getAdminUser(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!canAccessBusiness(user, businessId)) {
    return new Response(JSON.stringify({ error: 'forbidden' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }
  return { user };
}

/** Convenience: require platform_admin role. */
export async function requirePlatformAdmin(
  request: Request,
): Promise<{ user: AdminUser } | Response> {
  const user = await getAdminUser(request);
  if (!user || user.role !== 'platform_admin') {
    return new Response(JSON.stringify({ error: 'forbidden: platform admin required' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }
  return { user };
}

export async function requireAutofyonMaster(
  request: Request,
): Promise<{ user: AdminUser } | Response> {
  const user = await getAdminUser(request);
  const isLocalFallback =
    process.env.NODE_ENV !== 'production' &&
    user?.email.toLowerCase() === SUPER_ADMIN_EMAIL;
  if (!user || (user.email.toLowerCase() !== AUTOFYON_MASTER_EMAIL && !isLocalFallback)) {
    return new Response(JSON.stringify({ error: 'Autofyon master access required' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }
  return { user };
}
