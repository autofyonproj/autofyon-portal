import { NextRequest, NextResponse } from 'next/server';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { batch, query, queryOne } from '@/lib/db';
import { getBusinessMembership } from '@/lib/business-apps';

// ── App access rules ──────────────────────────────────────────────────────────
//
//  role      │ crm   │ marketplace │ accounting
//  ──────────┼───────┼─────────────┼───────────
//  owner     │  ✅   │     ✅      │    ✅
//  sales     │  ✅   │     ✅      │    ❌
//
// This is enforced by hasBusinessApplicationAccess() in business-apps.ts (line 118).
// Here we surface it in the member list so the UI can show it clearly.
// ─────────────────────────────────────────────────────────────────────────────

const enc = new TextEncoder();

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
    keyMaterial, 256,
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:${saltHex}:${hashHex}`;
}

// ── Authorization helper ──────────────────────────────────────────────────────

async function authorizeOwner(request: Request, businessId: string) {
  const user = await getAdminUser(request);
  if (!user || !canAccessBusiness(user, businessId)) return null;
  if (user.role === 'platform_admin') return { user };
  const membership = await getBusinessMembership(user.id, businessId);
  if (membership?.status !== 'active' || membership.role !== 'owner') return null;
  return { user };
}

// ── GET — list members ────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const { businessId } = await params;
  const auth = await authorizeOwner(request, businessId);
  if (!auth) return NextResponse.json({ error: 'client owner or platform admin access required' }, { status: 403 });

  const members = await query<{
    membershipId: string;
    userId: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
    createdAt: string;
    hasPassword: number;
  }>(
    `SELECT m.id AS membershipId, u.id AS userId, u.email, u.name,
            m.role, m.status, m.created_at AS createdAt,
            CASE WHEN u.password_hash IS NOT NULL THEN 1 ELSE 0 END AS hasPassword
       FROM business_memberships m
       JOIN admin_users u ON u.id = m.admin_user_id
      WHERE m.business_id = ?
      ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'sales' THEN 1 ELSE 2 END,
               u.name, u.email`,
    [businessId],
  );

  // Enrich with app access summary
  const enriched = members.map((m) => ({
    ...m,
    hasPassword: Boolean(m.hasPassword),
    appAccess: {
      crm: true,          // owner + sales both get CRM (when licensed)
      marketplace: true,  // owner + sales both get Marketplace (when licensed)
      accounting: m.role === 'owner', // ONLY owner gets accounting
    },
  }));

  return NextResponse.json({ members: enriched });
}

// ── POST — add member (owner or sales) ───────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const { businessId } = await params;
  const auth = await authorizeOwner(request, businessId);
  if (!auth) return NextResponse.json({ error: 'client owner or platform admin access required' }, { status: 403 });

  let body: { email?: unknown; name?: unknown; role?: unknown; password?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'body must be valid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const password = typeof body.password === 'string' ? body.password.trim() : '';

  // role: only platform_admin can appoint 'owner'; minisite owner can add 'sales' only
  const requestedRole = body.role === 'owner' ? 'owner' : 'sales';
  if (requestedRole === 'owner' && auth.user.role !== 'platform_admin') {
    return NextResponse.json({ error: 'فقط مدير المنصة يمكنه تعيين مالك (owner) للمعرض.' }, { status: 403 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح' }, { status: 400 });
  }
  if (!name || name.length > 120) {
    return NextResponse.json({ error: 'الاسم مطلوب ولا يتجاوز 120 حرفاً' }, { status: 400 });
  }
  if (password && password.length < 8) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
  }

  const business = await queryOne<{ id: string }>(
    'SELECT id FROM businesses WHERE id = ? AND status = ?',
    [businessId, 'active'],
  );
  if (!business) return NextResponse.json({ error: 'المعرض غير موجود' }, { status: 404 });

  // Guard: max 1 owner + 4 sales = 5 total per business
  const existingUser = await queryOne<{ id: string; role: string; scope_ids: string }>(
    'SELECT id, role, scope_ids FROM admin_users WHERE lower(email) = ?',
    [email],
  );

  if (existingUser?.role === 'platform_admin') {
    return NextResponse.json({ error: 'لا يمكن إضافة مدير المنصة كموظف مبيعات.' }, { status: 409 });
  }

  const existingMembership = existingUser
    ? await queryOne<{ id: string; status: string; role: string }>(
        'SELECT id, status, role FROM business_memberships WHERE business_id = ? AND admin_user_id = ?',
        [businessId, existingUser.id],
      )
    : null;

  if (existingMembership && existingMembership.status !== 'revoked') {
    return NextResponse.json({ error: 'هذا الشخص لديه حساب مسجل بالفعل في هذا المعرض.' }, { status: 409 });
  }

  // Count current active non-owner members (sales cap = 4)
  if (requestedRole === 'sales') {
    const count = await queryOne<{ count: number }>(
      `SELECT COUNT(*) AS count FROM business_memberships
        WHERE business_id = ? AND role = 'sales' AND status <> 'revoked'`,
      [businessId],
    );
    if (!existingMembership && (count?.count ?? 0) >= 4) {
      return NextResponse.json(
        { error: 'الحد الأقصى للمعرض هو 4 موظفي مبيعات. أوقف حساباً قبل إضافة آخر.' },
        { status: 409 },
      );
    }
  }

  // Build scopes
  let scopes: string[] = [];
  if (existingUser) {
    try {
      const parsed: unknown = JSON.parse(existingUser.scope_ids);
      if (Array.isArray(parsed)) scopes = parsed as string[];
    } catch { /* ok */ }
  }
  if (scopes.includes('*')) {
    return NextResponse.json({ error: 'حساب بصلاحيات غير محدودة لا يمكن إضافته كموظف.' }, { status: 409 });
  }
  if (!scopes.includes(businessId)) scopes.push(businessId);

  const userId = existingUser?.id ?? `usr_${crypto.randomUUID()}`;
  const membershipId = existingMembership?.id ?? `member_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  // Hash password if provided
  const passwordHash = password ? await hashPassword(password) : null;

  const accountStatement = existingUser
    ? {
        sql: `UPDATE admin_users SET name = ?, scope_ids = ?, active = 1${passwordHash ? ', password_hash = ?' : ''}
               WHERE id = ? AND role = 'vendor'`,
        params: passwordHash
          ? [name, JSON.stringify(scopes), passwordHash, userId]
          : [name, JSON.stringify(scopes), userId],
      }
    : {
        sql: `INSERT INTO admin_users (id, email, name, role, scope_ids, active${passwordHash ? ', password_hash' : ''})
              VALUES (?, ?, ?, 'vendor', ?, 1${passwordHash ? ', ?' : ''})`,
        params: passwordHash
          ? [userId, email, name, JSON.stringify(scopes), passwordHash]
          : [userId, email, name, JSON.stringify(scopes)],
      };

  await batch([
    accountStatement,
    {
      sql: `INSERT INTO business_memberships (id, business_id, admin_user_id, role, status, invited_by, updated_at)
              VALUES (?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT(business_id, admin_user_id) DO UPDATE SET
                role = excluded.role, status = 'active', invited_by = excluded.invited_by,
              updated_at = excluded.updated_at`,
      params: [membershipId, businessId, userId, requestedRole, auth.user.id, now],
    },
  ]);

  const appNote = requestedRole === 'sales'
    ? 'الحساب يتيح الوصول للـ CRM والسوق الإلكتروني (إن كانت مفعّلة). المحاسبة للمالك فقط.'
    : 'الحساب يتيح الوصول الكامل للتطبيقات المفعّلة بما فيها المحاسبة.';

  return NextResponse.json({
    ok: true,
    message: `تم إنشاء الحساب بنجاح. ${appNote}`,
  }, { status: 201 });
}

// ── PATCH — change membership status (suspend / reactivate / revoke) ──────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const { businessId } = await params;
  const auth = await authorizeOwner(request, businessId);
  if (!auth) return NextResponse.json({ error: 'client owner or platform admin access required' }, { status: 403 });

  let body: { membershipId?: unknown; status?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'body must be valid JSON' }, { status: 400 });
  }

  if (typeof body.membershipId !== 'string' || !['active', 'suspended', 'revoked'].includes(String(body.status))) {
    return NextResponse.json({ error: 'membershipId والحالة المطلوبة مطلوبان' }, { status: 400 });
  }

  const membership = await queryOne<{ id: string; admin_user_id: string; role: string }>(
    `SELECT id, admin_user_id, role FROM business_memberships
      WHERE id = ? AND business_id = ?`,
    [body.membershipId, businessId],
  );

  if (!membership) {
    return NextResponse.json({ error: 'الحساب غير موجود في هذا المعرض' }, { status: 404 });
  }
  // Minisite owner can manage sales; only platform_admin can manage owner accounts
  if (membership.role === 'owner' && auth.user.role !== 'platform_admin') {
    return NextResponse.json({ error: 'فقط مدير المنصة يمكنه تعديل صلاحيات المالك' }, { status: 403 });
  }

  // Recalculate scopes after status change
  const memberships = await query<{ business_id: string; id: string; status: string }>(
    `SELECT id, business_id, status FROM business_memberships
      WHERE admin_user_id = ?`,
    [membership.admin_user_id],
  );
  const scopes = memberships
    .filter((item) => item.id === membership.id ? body.status === 'active' : item.status === 'active')
    .map((item) => item.business_id);

  const now = new Date().toISOString();
  await batch([
    {
      sql: 'UPDATE business_memberships SET status = ?, updated_at = ? WHERE id = ?',
      params: [body.status, now, membership.id],
    },
    {
      sql: 'UPDATE admin_users SET scope_ids = ?, active = ? WHERE id = ? AND role = ?',
      params: [JSON.stringify(scopes), scopes.length ? 1 : 0, membership.admin_user_id, 'vendor'],
    },
  ]);

  return NextResponse.json({ ok: true });
}

// ── PUT — reset password for a member (owner or platform_admin only) ──────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> },
) {
  const { businessId } = await params;
  const auth = await authorizeOwner(request, businessId);
  if (!auth) return NextResponse.json({ error: 'client owner or platform admin access required' }, { status: 403 });

  let body: { membershipId?: unknown; newPassword?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'body must be valid JSON' }, { status: 400 });
  }

  const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
  }

  const membership = await queryOne<{ admin_user_id: string; role: string }>(
    `SELECT admin_user_id, role FROM business_memberships
      WHERE id = ? AND business_id = ?`,
    [body.membershipId as string, businessId],
  );
  if (!membership) {
    return NextResponse.json({ error: 'الحساب غير موجود في هذا المعرض' }, { status: 404 });
  }
  // Minisite owner can reset sales passwords; only platform_admin can reset owner password
  if (membership.role === 'owner' && auth.user.role !== 'platform_admin') {
    return NextResponse.json({ error: 'فقط مدير المنصة يمكنه تغيير كلمة مرور المالك' }, { status: 403 });
  }

  const hash = await hashPassword(newPassword);
  await queryOne(
    'UPDATE admin_users SET password_hash = ? WHERE id = ?',
    [hash, membership.admin_user_id],
  );

  return NextResponse.json({ ok: true, message: 'تم تحديث كلمة المرور بنجاح' });
}
