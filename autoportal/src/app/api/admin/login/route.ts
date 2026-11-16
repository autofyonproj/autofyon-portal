import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { createAdminSession } from '@/lib/admin-session';

// Master platform-admin passwords (platform super-admin only)
const MASTER_ADMIN_PASSWORDS = [
  'autofyon@2026',
  'autofyon2026',
  'admin@autofyon.com',
  'AutofyonAdmin2026!',
];

// ── PBKDF2 helpers (Web Crypto — works in Cloudflare Workers edge) ─────────────

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

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;
  const salt = Uint8Array.from(parts[1].match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const expectedHash = parts[2];
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
    keyMaterial, 256,
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex === expectedHash;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string; key?: string };
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || body.key || '').trim();

    if (!password) {
      return NextResponse.json({ error: 'يرجى إدخال كلمة المرور' }, { status: 400 });
    }

    // ── 1. Platform super-admin master password ───────────────────────────────
    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(password);
    if (isMasterPassword && (!email || email === 'platformadmin@autofyon.com')) {
      const user = await queryOne<{ id: string; email: string; role: string; scope_ids: string }>(
        `SELECT id, email, role, scope_ids FROM admin_users
          WHERE lower(email) = 'platformadmin@autofyon.com' AND active = 1`,
        [],
      );
      return issueSession(user?.email ?? 'platformadmin@autofyon.com', 'platform_admin', '/admin');
    }

    // ── 2. Vendor (minisite owner / sales) password login ────────────────────
    if (!email) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 });
    }

    const user = await queryOne<{
      id: string; email: string; role: string; scope_ids: string;
      active: number; password_hash: string | null;
    }>(
      `SELECT id, email, role, scope_ids, active, password_hash
         FROM admin_users WHERE lower(email) = ? AND active = 1`,
      [email],
    );

    if (!user) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير مسجل أو الحساب غير نشط' }, { status: 401 });
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'لم يتم تعيين كلمة مرور لهذا الحساب بعد. تواصل مع مدير المنصة.' },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // Determine redirect based on membership role
    let scopes: string[] = [];
    try { scopes = JSON.parse(user.scope_ids) as string[]; } catch { /* ok */ }

    const redirectTo = user.role === 'platform_admin'
      ? '/admin'
      : scopes.length > 0 ? `/admin/showroom/${scopes[0]}` : '/admin';

    return issueSession(user.email, user.role, redirectTo);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function issueSession(email: string, _role: string, redirectTo: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const token = await createAdminSession(email, expiresAt);
  const res = NextResponse.json({ ok: true, email, redirect: redirectTo });
  res.cookies.set('admin_session', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

// ── Password management (platform admin sets/resets vendor passwords) ─────────

export async function PUT(req: NextRequest) {
  try {
    // Only platform admin (master password header or valid platform session) can set passwords
    const body = await req.json() as {
      adminKey?: string;        // platform master key to authorize this call
      targetEmail?: string;     // which vendor to update
      newPassword?: string;     // the new password to set
    };

    const adminKey = (body.adminKey || '').trim();
    if (!MASTER_ADMIN_PASSWORDS.includes(adminKey)) {
      return NextResponse.json({ error: 'غير مصرح. مفتاح إدارة المنصة مطلوب.' }, { status: 403 });
    }

    const targetEmail = (body.targetEmail || '').trim().toLowerCase();
    const newPassword = (body.newPassword || '').trim();

    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      return NextResponse.json({ error: 'بريد إلكتروني غير صحيح' }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }

    const user = await queryOne<{ id: string; role: string }>(
      'SELECT id, role FROM admin_users WHERE lower(email) = ?',
      [targetEmail],
    );
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const hash = await hashPassword(newPassword);
    await queryOne(
      'UPDATE admin_users SET password_hash = ? WHERE lower(email) = ?',
      [hash, targetEmail],
    );

    return NextResponse.json({ ok: true, message: `تم تعيين كلمة المرور لـ ${targetEmail}` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تعيين كلمة المرور';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, redirect: '/login' });
  res.cookies.delete('admin_session');
  return res;
}
