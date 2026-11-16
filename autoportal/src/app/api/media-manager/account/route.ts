import { NextRequest, NextResponse } from 'next/server';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { execute, query, queryOne } from '@/lib/db';
import { hasActivePaidPlan } from '@/lib/autofyon-customer-plan';


type AccountRow = {
  id: string;
  name: string;
  name_ar: string | null;
  plan: 'free' | 'paid';
  status: 'active' | 'suspended';
  paid_through: string | null;
};

function accountView(row: AccountRow) {
  const activePaidPlan = hasActivePaidPlan(row);
  return {
    businessId: row.id,
    businessName: row.name_ar || row.name,
    plan: activePaidPlan ? 'paid' : 'free',
    paidThrough: row.paid_through,
    sponsored: !activePaidPlan,
  };
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser(request);
  const requestedBusinessId = request.nextUrl.searchParams.get('business')?.trim();

  if (!user) {
    if (requestedBusinessId) {
      try {
        const b = await queryOne<{ id: string; name: string; name_ar: string | null }>(
          `SELECT id, name, name_ar FROM businesses WHERE id = ? AND status = 'active' LIMIT 1`,
          [requestedBusinessId],
        );
        if (b) {
          return NextResponse.json({
            accounts: [{
              businessId: b.id,
              businessName: b.name_ar || b.name,
              plan: 'free',
              paidThrough: null,
              sponsored: true,
            }],
            activeBusinessId: b.id,
            isProspectPreview: true,
          });
        }
      } catch {
        /* proceed to 401 */
      }
    }
    return NextResponse.json({ error: 'Sign in to your AUTOFYON business account to check your plan.' }, { status: 401 });
  }

  try {
    let accounts: AccountRow[] = [];

    if (user.role === 'platform_admin') {
      if (requestedBusinessId) {
        accounts = await query<AccountRow>(
          `SELECT b.id, b.name, b.name_ar,
                  COALESCE(c.plan, 'free') AS plan,
                  COALESCE(c.status, 'active') AS status,
                  c.paid_through
             FROM businesses b
             LEFT JOIN autofyon_customer_plans c ON c.business_id = b.id
            WHERE b.id = ?
            LIMIT 1`,
          [requestedBusinessId],
        );
      }
      if (!accounts.length) {
        accounts = await query<AccountRow>(
          `SELECT b.id, b.name, b.name_ar,
                  COALESCE(c.plan, 'free') AS plan,
                  COALESCE(c.status, 'active') AS status,
                  c.paid_through
             FROM businesses b
             LEFT JOIN autofyon_customer_plans c ON c.business_id = b.id
            WHERE b.type_id IN ('showroom', 'main_agency', 'distributor', 'used_car_dealer')
            ORDER BY CASE WHEN b.id = 'biz_auto_one_egypt' THEN 0 ELSE 1 END, b.name
            LIMIT 20`,
          [],
        );
      }
    } else {
      accounts = await query<AccountRow>(
        `SELECT b.id, b.name, b.name_ar,
                COALESCE(c.plan, 'free') AS plan,
                COALESCE(c.status, 'active') AS status,
                c.paid_through
           FROM business_memberships m
           JOIN businesses b ON b.id = m.business_id
           LEFT JOIN autofyon_customer_plans c ON c.business_id = b.id
          WHERE m.admin_user_id = ? AND m.status = 'active'
          ORDER BY b.name`,
        [user.id],
      );
    }

    return NextResponse.json({ accounts: accounts.map(accountView) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load Media Manager account plans:', error);
    return NextResponse.json({ error: 'Could not load your account plan.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) return NextResponse.json({ error: 'Sign in to your AUTOFYON business account to check your plan.' }, { status: 401 });

  let body: { businessId?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const businessId = typeof body.businessId === 'string' ? body.businessId.trim() : '';
  if (!businessId || businessId.length > 100) return NextResponse.json({ error: 'Select a valid business account.' }, { status: 400 });
  if (!canAccessBusiness(user, businessId)) return NextResponse.json({ error: 'Business access required.' }, { status: 403 });

  try {
    const membership = await queryOne<{ status: string; role: string }>(
      `SELECT status, role FROM business_memberships
        WHERE admin_user_id = ? AND business_id = ? LIMIT 1`,
      [user.id, businessId],
    );
    if (!membership || membership.status !== 'active' || membership.role !== 'owner') {
      return NextResponse.json({ error: 'Active business owner access required.' }, { status: 403 });
    }

    const now = new Date().toISOString();
    await execute(
      `INSERT INTO autofyon_customer_plans (business_id, plan, status, last_seen_at, updated_at)
       VALUES (?, 'free', 'active', ?, ?)
       ON CONFLICT(business_id) DO UPDATE SET
         last_seen_at = excluded.last_seen_at,
         updated_at = excluded.updated_at`,
      [businessId, now, now],
    );
    const account = await queryOne<AccountRow>(
      `SELECT b.id, b.name, b.name_ar, c.plan, c.status, c.paid_through
         FROM businesses b
         JOIN autofyon_customer_plans c ON c.business_id = b.id
        WHERE b.id = ?`,
      [businessId],
    );
    if (!account) throw new Error('The Media Manager customer record was not created.');
    return NextResponse.json({ account: accountView(account) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not activate Media Manager account tracking:', error);
    return NextResponse.json({ error: 'Could not activate account tracking.' }, { status: 500 });
  }
}
