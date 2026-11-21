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
 *  OTP delivery uses the configured Meta WhatsApp Cloud API template.
 */
import { NextRequest, NextResponse } from 'next/server';
import { queryOne, batch } from '@/lib/db';
import { createAdminSession } from '@/lib/admin-session';
import { normalizeWhatsAppPhone, sendWhatsAppOtp } from '@/lib/whatsapp';


// ── helpers ──────────────────────────────────────────────────────────────────

function normalisePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  return normalizeWhatsAppPhone(digits, 'EG') || digits;
}

function vendorEmailCandidates(phone: string): string[] {
  const internationalPhone = normalizeWhatsAppPhone(phone, 'EG');
  const localPhone = internationalPhone.startsWith('20') ? `0${internationalPhone.slice(2)}` : '';
  return [...new Set([phone, internationalPhone, localPhone].filter(Boolean).flatMap((value) => [
    `vendor_${value}@autonegypt.local`,
    `vendor_${value}@autofyon.local`,
  ]))];
}

async function generateAndStoreOtp(phone: string, sendCount: number): Promise<string> {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const code = String(100000 + (arr[0] % 900000));
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 min
  const now = Math.floor(Date.now() / 1000);

  await batch([
    {
      sql: `INSERT INTO otp_codes (phone, code, expires_at, attempts, send_count, last_sent_at)
            VALUES (?, ?, ?, 0, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET
              code = excluded.code,
              expires_at = excluded.expires_at,
              attempts = 0,
              send_count = excluded.send_count,
              last_sent_at = excluded.last_sent_at`,
      params: [phone, code, expiresAt, sendCount, now],
    },
  ]);
  return code;
}

async function consumeOtp(phone: string, code: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const row = await queryOne<{ code: string; expires_at: number; attempts: number }>(
    'SELECT code, expires_at, attempts FROM otp_codes WHERE phone = ?',
    [phone],
  );
  if (!row || row.expires_at <= now || row.attempts >= 5 || !row.code) return false;
  if (row.code !== code) {
    await batch([{
      sql: 'UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ? AND attempts < 5',
      params: [phone],
    }]);
    return false;
  }
  const consumed = await batch([{
    sql: `UPDATE otp_codes SET code = '', expires_at = ?
          WHERE phone = ? AND code = ? AND expires_at > ? AND attempts < 5`,
    params: [now, phone, code, now],
  }]);
  return consumed[0]?.changes === 1;
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
      const emails = vendorEmailCandidates(phone);
      const user = await queryOne<{ id: string }>(
        `SELECT u.id
           FROM admin_users u
           JOIN business_memberships m ON m.admin_user_id = u.id
           JOIN businesses b ON b.id = m.business_id
          WHERE lower(u.email) IN (?, ?) AND u.active = 1
            AND m.status = 'active'
            AND b.status = 'active' AND b.published = 1
          LIMIT 1`,
        emails,
      );
      if (!user) {
        return NextResponse.json(
          { error: 'لا يوجد حساب مرتبط بهذا الرقم. يرجى التسجيل أولاً.' },
          { status: 404 },
        );
      }

      const whatsappPhone = normalizeWhatsAppPhone(phone, 'EG');
      if (!whatsappPhone) {
        return NextResponse.json({ error: 'رقم الهاتف غير صالح لإرسال واتساب' }, { status: 400 });
      }

      const now = Math.floor(Date.now() / 1000);
      const previous = await queryOne<{ send_count: number; last_sent_at: number }>(
        'SELECT send_count, last_sent_at FROM otp_codes WHERE phone = ?',
        [phone],
      );
      if (previous && now - previous.last_sent_at < 60) {
        return NextResponse.json({ error: 'يرجى الانتظار دقيقة قبل طلب رمز جديد' }, { status: 429 });
      }
      if (previous && now - previous.last_sent_at < 24 * 60 * 60 && previous.send_count >= 5) {
        return NextResponse.json({ error: 'تم بلوغ الحد اليومي لإرسال الرموز لهذا الرقم' }, { status: 429 });
      }
      const nextSendCount = previous && now - previous.last_sent_at < 24 * 60 * 60
        ? previous.send_count + 1
        : 1;
      const generatedCode = await generateAndStoreOtp(phone, nextSendCount);
      try {
        await sendWhatsAppOtp(whatsappPhone, generatedCode);
      } catch {
        await batch([{
          sql: 'UPDATE otp_codes SET code = \'\', expires_at = ?, attempts = 5 WHERE phone = ?',
          params: [now, phone],
        }]);
        return NextResponse.json(
          { error: 'تعذر إرسال رمز واتساب. يرجى المحاولة لاحقاً.' },
          { status: 503 },
        );
      }

      const responseBody = {
        ok: true,
        message: 'تم إرسال كود التحقق',
        expiresInSeconds: 600,
      };
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

      const emails = vendorEmailCandidates(phone);
      const user = await queryOne<{ id: string; email: string; role: string; scope_ids: string }>(
        `SELECT u.id, u.email, u.role, u.scope_ids
           FROM admin_users u
           JOIN business_memberships m ON m.admin_user_id = u.id
           JOIN businesses b ON b.id = m.business_id
          WHERE lower(u.email) IN (?, ?) AND u.active = 1
            AND m.status = 'active'
            AND b.status = 'active' AND b.published = 1
          LIMIT 1`,
        emails,
      );
      if (!user) {
        return NextResponse.json({ error: 'الحساب غير نشط. تواصل مع الإدارة.' }, { status: 403 });
      }

      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
      const sessionToken = await createAdminSession(user.email, expiresAt);

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
