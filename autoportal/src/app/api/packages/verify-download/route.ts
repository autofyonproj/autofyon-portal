import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { getVendorTier, isVendorTierId } from '@/lib/tiers';

function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('002')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('+2')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('20')) cleaned = cleaned.slice(2);
  if (!cleaned.startsWith('0') && cleaned.length === 10) cleaned = `0${cleaned}`;
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone: rawPhone, passcode } = body;

    if (!rawPhone || !passcode) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم الهاتف وكود التحميل (Passcode)' },
        { status: 400 }
      );
    }

    const phone = normalizePhone(rawPhone);
    const code = String(passcode).trim();

    // 1. Check OTP code
    const nowSec = Math.floor(Date.now() / 1000);
    const otp = await queryOne<{ code: string; expires_at: number }>(
      'SELECT code, expires_at FROM otp_codes WHERE phone = ? LIMIT 1',
      [phone]
    );

    const isOtpValid = otp && otp.code === code && otp.expires_at >= nowSec;

    // 2. Query standalone client copy record
    const copy = await queryOne<{
      serial: string;
      company_name: string;
      phone: string;
      crm_tier: string;
      status: string;
      package_version: string | null;
    }>(
      `SELECT serial, company_name, phone, crm_tier, status, package_version
         FROM standalone_client_copies
        WHERE phone = ? OR serial = ? LIMIT 1`,
      [phone, code]
    );

    // If neither OTP nor matching copy exists, reject
    if (!isOtpValid && (!copy || (copy.serial !== code && copy.phone !== phone))) {
      return NextResponse.json(
        { error: 'كود التحميل غير صحيح أو انتهت صلاحيته. يرجى مراجعة إدارة المنصة عبر الواتساب.' },
        { status: 401 }
      );
    }

    // 3. ENFORCE ADMIN APPROVAL GATE:
    // If copy is still pending verification (Free Tier claim not approved by admin yet)
    if (copy && copy.status === 'pending_verification' && !isOtpValid) {
      return NextResponse.json(
        {
          error:
            'طلب الباقة المجانية الخاص بمعرضكم ما زال قيد المراجعة الإدارية للتحقق من ملكية المعرض. سيصلكم كود التفعيل المعتمد عبر الواتساب فور انتهاء المراجعة.',
        },
        { status: 403 }
      );
    }

    const tierId = isVendorTierId(copy?.crm_tier) ? copy.crm_tier : 'growth';
    const tierConfig = getVendorTier(tierId);
    const serial = copy?.serial || `AFY-${new Date().getFullYear()}-DEMO`;
    const companyName = copy?.company_name || 'معرض سيارات معتمد';

    // If verified by active OTP code, activate copy status
    if (copy && copy.status === 'pending_verification' && isOtpValid) {
      await execute(
        `UPDATE standalone_client_copies
            SET status = 'active', phone_verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE serial = ?`,
        [copy.serial]
      );
    }

    // License configuration payload
    const licenseConfig = {
      productName: 'Almostashar Auto',
      productNameAr: 'المستشار أوتو',
      companyName,
      serial,
      tier: tierId,
      tierNameAr: tierConfig.name.ar,
      maxActiveCars: tierConfig.maxActiveCars,
      canUseCustomDomain: tierConfig.canUseCustomDomain,
      issuedAt: new Date().toISOString(),
      status: 'active',
    };

    // ── AUDIT LOG: record every successful download ───────────────────────
    const clientIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const userAgent = req.headers.get('user-agent')?.slice(0, 255) || 'unknown';
    await execute(
      `INSERT INTO download_events (serial, phone, ip, user_agent, tier)
       VALUES (?, ?, ?, ?, ?)`,
      [serial, phone, clientIp, userAgent, tierId]
    ).catch(() => { /* non-fatal — never block a valid download for logging errors */ });

    return NextResponse.json({
      ok: true,
      message: 'تم التحقق من الكود واعتماد الترخيص بنجاح! جاهز للتحميل والتثبيت.',
      downloadInfo: {
        companyName,
        phone,
        serial,
        tier: tierId,
        tierNameAr: tierConfig.name.ar,
        version: copy?.package_version || '2.7.0',
        licenseConfig,
        installerFileName: `AutoFyon-Setup-${serial}.bat`,
        installerContent: `@echo off\r\nchcp 65001 >nul\r\necho ====================================================\r\necho   AUTOFYON CLIENT STANDALONE SETUP v2.7.0\r\necho   Licensed to: ${companyName}\r\necho   Package: ${tierConfig.name.ar} (${serial})\r\necho ====================================================\r\necho.\r\necho [1/3] Downloading latest system core...\r\npowershell -Command "Invoke-WebRequest -Uri 'https://autofyon.com/api/standalone/bundle.zip' -OutFile 'autofyon-core.zip' -ErrorAction SilentlyContinue"\r\necho [2/3] Registering license credentials...\r\necho {\"serial\":\"${serial}\",\"company\":\"${companyName}\",\"tier\":\"${tierId}\"} > license.json\r\necho [3/3] Starting Local Server on http://localhost:8080 ...\r\nstart http://localhost:8080\r\npause\r\n`,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل التحقق من الكود';
    return NextResponse.json({ error }, { status: 500 });
  }
}
