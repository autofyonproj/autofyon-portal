import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { execute, query, queryOne } from '@/lib/db';
import { hasActivePaidPlan } from '@/lib/autofyon-customer-plan';


type CustomerRow = {
  business_id: string;
  business_name: string;
  business_name_ar: string | null;
  business_slug: string;
  owner_name: string | null;
  owner_email: string | null;
  plan: 'free' | 'paid' | null;
  status: 'active' | 'suspended' | null;
  paid_through: string | null;
  contact_phone: string | null;
  last_seen_at: string | null;
  follow_up_at: string | null;
  notes: string | null;
  updated_at: string | null;
};

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const rows = await query<CustomerRow>(
      `SELECT b.id AS business_id, b.name AS business_name, b.name_ar AS business_name_ar,
              b.slug AS business_slug, owner.name AS owner_name, owner.email AS owner_email,
              c.plan, c.status, c.paid_through, c.contact_phone, c.last_seen_at,
              c.follow_up_at, c.notes, c.updated_at
         FROM businesses b
         LEFT JOIN autofyon_customer_plans c ON c.business_id = b.id
         LEFT JOIN (
           SELECT m.business_id, u.name, u.email,
                  ROW_NUMBER() OVER (PARTITION BY m.business_id ORDER BY m.created_at, u.email) AS row_number
             FROM business_memberships m
             JOIN admin_users u ON u.id = m.admin_user_id
            WHERE m.role = 'owner' AND m.status = 'active'
         ) owner ON owner.business_id = b.id AND owner.row_number = 1
        WHERE owner.business_id IS NOT NULL
        ORDER BY CASE WHEN c.follow_up_at IS NULL THEN 1 ELSE 0 END,
                 c.follow_up_at, b.name
        LIMIT 1000`,
    );
    const customers = rows.map((row) => {
      const plan = row.plan ?? 'free';
      const status = row.status ?? 'active';
      const effectivePlan = hasActivePaidPlan({ plan, status, paid_through: row.paid_through })
        ? 'paid'
        : 'free';
      return { ...row, plan, status, effective_plan: effectivePlan };
    });
    return NextResponse.json({ customers }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not load Media Manager customer follow-up:', error);
    return NextResponse.json({ error: 'Could not load Media Manager customers.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  const businessId = typeof body.businessId === 'string' ? body.businessId.trim() : '';
  const plan = body.plan;
  const status = body.status;
  const paidThrough = body.paidThrough === '' ? null : body.paidThrough;
  const followUpAt = body.followUpAt === '' ? null : body.followUpAt;
  const contactPhone = body.contactPhone;
  const notes = body.notes;

  if (!businessId || businessId.length > 100) return NextResponse.json({ error: 'Select a valid business.' }, { status: 400 });
  if (plan !== 'free' && plan !== 'paid') return NextResponse.json({ error: 'Plan must be free or paid.' }, { status: 400 });
  if (status !== 'active' && status !== 'suspended') return NextResponse.json({ error: 'Status must be active or suspended.' }, { status: 400 });
  if ((paidThrough !== null && !validDate(paidThrough)) || (followUpAt !== null && !validDate(followUpAt))) {
    return NextResponse.json({ error: 'Enter valid dates in YYYY-MM-DD format.' }, { status: 400 });
  }
  if (plan === 'paid' && (!paidThrough || status !== 'active')) {
    return NextResponse.json({ error: 'An active paid plan requires a paid-through date.' }, { status: 400 });
  }
  if (plan === 'free' && paidThrough !== null) return NextResponse.json({ error: 'Free plans cannot have a paid-through date.' }, { status: 400 });
  if (typeof contactPhone !== 'string' || contactPhone.length > 40) return NextResponse.json({ error: 'Contact phone must be 40 characters or fewer.' }, { status: 400 });
  if (typeof notes !== 'string' || notes.length > 2000) return NextResponse.json({ error: 'Notes must be 2000 characters or fewer.' }, { status: 400 });

  try {
    const business = await queryOne<{ id: string }>(
      `SELECT b.id FROM businesses b
        WHERE b.id = ?
          AND EXISTS (
            SELECT 1 FROM business_memberships m
             WHERE m.business_id = b.id AND m.role = 'owner' AND m.status = 'active'
          )`,
      [businessId],
    );
    if (!business) return NextResponse.json({ error: 'Registered customer business not found.' }, { status: 404 });

    const now = new Date().toISOString();
    await execute(
      `INSERT INTO autofyon_customer_plans
         (business_id, plan, status, paid_through, contact_phone, follow_up_at, notes, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(business_id) DO UPDATE SET
         plan = excluded.plan,
         status = excluded.status,
         paid_through = excluded.paid_through,
         contact_phone = excluded.contact_phone,
         follow_up_at = excluded.follow_up_at,
         notes = excluded.notes,
         updated_at = excluded.updated_at,
         updated_by = excluded.updated_by`,
      [
        businessId,
        plan,
        status,
        paidThrough,
        contactPhone.trim(),
        followUpAt,
        notes.trim(),
        now,
        auth.user.id,
      ],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not update Media Manager customer plan:', error);
    return NextResponse.json({ error: 'Could not save Media Manager customer details.' }, { status: 500 });
  }
}
