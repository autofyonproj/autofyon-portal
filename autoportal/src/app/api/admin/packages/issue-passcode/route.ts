import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';

function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('002')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('+2')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('20')) cleaned = cleaned.slice(2);
  if (!cleaned.startsWith('0') && cleaned.length === 10) cleaned = `0${cleaned}`;
  return cleaned;
}

function generateNumericCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

export async function POST(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const { phone: rawPhone, showroomName = 'معرضكم الكريم', serial: reqSerial } = await req.json();
    if (!rawPhone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 });
    }

    const phone = normalizePhone(rawPhone);
    const code = generateNumericCode(6);
    const expiresAt = Math.floor(Date.now() / 1000) + 48 * 3600;

    // 1. Issue OTP passcode valid for 48 hours
    await execute(
      `INSERT INTO otp_codes (phone, code, expires_at, created_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(phone) DO UPDATE SET
         code = excluded.code,
         expires_at = excluded.expires_at,
         created_at = excluded.created_at`,
      [phone, code, expiresAt]
    );

    // 2. Activate copy status in standalone_client_copies
    const copy = await queryOne<{ serial: string }>(
      'SELECT serial FROM standalone_client_copies WHERE phone = ? OR serial = ? LIMIT 1',
      [phone, reqSerial || '']
    );

    if (copy) {
      await execute(
        `UPDATE standalone_client_copies
            SET status = 'active', phone_verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE serial = ?`,
        [copy.serial]
      );
    }

    // 3. Mark prospect campaign status as accepted / active
    await execute(
      `UPDATE vendor_prospects
          SET campaign_status = 'accepted', updated_at = CURRENT_TIMESTAMP
        WHERE duplicate_key = ? OR id = ?`,
      [phone, `pros_${phone}`]
    );

    const intlPhone = phone.startsWith('0') ? `20${phone.slice(1)}` : `20${phone}`;
    const text = encodeURIComponent(
      `مرحباً بكم في ${showroomName}!\nتمت الموافقة واعتماد طلب معرضكم على منصة أوتوفيون بنجاح.\nكود تحميل وتفعيل باقتكم هو: *${code}*\n\nيمكنكم إدخال الكود وبدء التحميل فوراً عبر الرابط:\nhttps://autofyon.com/download?phone=${phone}&code=${code}\n(الكود صالح لمدة 48 ساعة).`
    );
    const whatsappUrl = `https://wa.me/${intlPhone}?text=${text}`;

    return NextResponse.json({
      ok: true,
      phone,
      passcode: code,
      serial: copy?.serial,
      expiresInHours: 48,
      whatsappUrl,
      message: 'تم اعتماد الطلب وتوليد كود التحميل بنجاح!',
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل إصدار كود التحميل';
    return NextResponse.json({ error }, { status: 500 });
  }
}
