/**
 * /api/auth/vendor-login
 *
 * Phone-based OTP login for EXISTING vendor accounts.
 * Uses D1 (`otp_codes` table) so codes survive across Workers requests.
 *
 * Actions
 * -------
 *  send_otp          → generate & persist a 6-digit code, return it in dev
 *  verify_otp        → check code, issue admin_session cookie
 *
 * Production delivery
 * -------------------
 *  Wire WHATSAPP_TOKEN / RESEND_API_KEY in wrangler secrets when ready.
 *  Until then the code is returned in the response body only in non-production.
 */
import { NextRequest, NextResponse } from 'next/server';
import { queryOne, batch } from '@/lib/db';
import { createAdminSession } from '@/lib/admin-session';


// ── helpers ──────────────────────────────────────────────────────────────────

function normalisePhone(raw: string): string {
  return (raw || '').replace(/\D/g, '');
}

function vendorEmail(phone: string): string {
  return `vendor_${phone}@autonegypt.local`;
}

async function generateAndStoreOtp(phone: string): Promise<string> {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const code = String(100000 + (arr[0] % 900000));
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 min

  await batch([
    {
      sql: `INSERT INTO otp_codes (phone, code, expires_at)
            VALUES (?, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
      params: [phone, code, expiresAt],
    },
  ]);
  return code;
}

async function consumeOtp(phone: string, code: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const row = await queryOne<{ code: string; expires_at: number }>(
    'SELECT code, expires_at FROM otp_codes WHERE phone = ?',
    [phone],
  );
  if (!row || row.expires_at <= now || row.code !== code) return false;
  // Delete used code
  await batch([{ sql: 'DELETE FROM otp_codes WHERE phone = ?', params: [phone] }]);
  return true;
}

// ── route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { action?: string; phone?: string; code?: string };
    const { action, code } = body;
    const phone = normalisePhone(body.phone ?? '');

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'رقم هاتف غير صحيح' }, { status: 400 });
    }

    // ── ACTION: send_otp ───────────────────────────────────────────────────
    if (action === 'send_otp') {
      // Check that this phone has an active vendor account
      const email = vendorEmail(phone);
      const user = await queryOne<{ id: string }>(
        'SELECT id FROM admin_users WHERE email = ? AND active = 1',
        [email],
      );
      if (!user) {
        return NextResponse.json(
          { error: 'لا يوجد حساب مرتبط بهذا الرقم. يرجى التسجيل أولاً.' },
          { status: 404 },
        );
      }

      const generatedCode = await generateAndStoreOtp(phone);

      // TODO: integrate WhatsApp / SMS / email delivery here when ready.
      // e.g. await sendWhatsApp(phone, generatedCode);

      const responseBody: Record<string, unknown> = {
        ok: true,
        message: 'تم إرسال كود التحقق',
        expiresInSeconds: 600,
      };
      // Expose code only in non-production for testing
      if (process.env.NODE_ENV !== 'production') {
        responseBody.demoOtp = generatedCode;
      }
      return NextResponse.json(responseBody);
    }

    // ── ACTION: verify_otp ─────────────────────────────────────────────────
    if (action === 'verify_otp') {
      if (!code) {
        return NextResponse.json({ error: 'يرجى إدخال كود التحقق' }, { status: 400 });
      }

      const valid = await consumeOtp(phone, code);
      if (!valid) {
        return NextResponse.json(
          { error: 'كود التأكيد غير صحيح أو انتهت صلاحيته' },
          { status: 400 },
        );
      }

      const email = vendorEmail(phone);
      const user = await queryOne<{ id: string; role: string; scope_ids: string }>(
        'SELECT id, role, scope_ids FROM admin_users WHERE email = ? AND active = 1',
        [email],
      );
      if (!user) {
        return NextResponse.json({ error: 'الحساب غير نشط. تواصل مع الإدارة.' }, { status: 403 });
      }

      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
      const sessionToken = await createAdminSession(email, expiresAt);

      const res = NextResponse.json({ ok: true, role: user.role });
      res.cookies.set('admin_session', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }

    return NextResponse.json({ error: 'إجراء غير مدعوم' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
