import { requireActiveBusiness, requireBusinessAccess, type AdminUser } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';

export type VendorLeadAccess = {
  user: AdminUser;
  membershipRole: 'platform_admin' | 'owner' | 'sales';
};

export type VendorAccountingAccess = {
  user: AdminUser;
  membershipRole: 'platform_admin' | 'owner' | 'accountant';
};

export async function requireVendorAccountingAccess(
  request: Request,
  businessId: string,
): Promise<VendorAccountingAccess | Response> {
  const auth = await requireBusinessAccess(request, businessId);
  if (auth instanceof Response) return auth;
  const business = await queryOne<{ status: string }>(
    'SELECT status FROM businesses WHERE id = ?',
    [businessId],
  );
  if (!business || business.status !== 'active') {
    return new Response(JSON.stringify({ error: 'The AutoFyon business account is inactive.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (auth.user.role === 'platform_admin') {
    return { user: auth.user, membershipRole: 'platform_admin' };
  }

  const membership = await queryOne<{ role: string; status: string }>(
    `SELECT role, status FROM business_memberships
      WHERE business_id = ? AND admin_user_id = ?`,
    [businessId, auth.user.id],
  );
  if (!membership || membership.status !== 'active' || !['owner', 'accountant'].includes(membership.role)) {
    return new Response(JSON.stringify({ error: 'Owner or accountant access is required for accounting drafts.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return {
    user: auth.user,
    membershipRole: membership.role as VendorAccountingAccess['membershipRole'],
  };
}

export async function requireVendorLeadAccess(
  request: Request,
  businessId: string,
): Promise<VendorLeadAccess | Response> {
  const auth = await requireActiveBusiness(request, businessId);
  if (auth instanceof Response) return auth;
  if (auth.user.role === 'platform_admin') {
    return { user: auth.user, membershipRole: 'platform_admin' };
  }

  const membership = await queryOne<{ role: string; status: string }>(
    `SELECT role, status FROM business_memberships
      WHERE business_id = ? AND admin_user_id = ?`,
    [businessId, auth.user.id],
  );
  if (!membership || membership.status !== 'active' || !['owner', 'sales'].includes(membership.role)) {
    return new Response(JSON.stringify({ error: 'Owner or sales access is required for the landing-page CRM.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return {
    user: auth.user,
    membershipRole: membership.role as VendorLeadAccess['membershipRole'],
  };
}
