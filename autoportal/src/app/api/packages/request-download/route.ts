import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { isVendorTierId, getVendorTier } from '@/lib/tiers';
import { getVendorTypeConfig, VENDOR_BUSINESS_TYPES } from '@/lib/vendor-business-types';

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

function generateSerial(): string {
  const year = new Date().getFullYear();
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(5)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `AFY-${year}-${hex}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      showroomName,
      contactName,
      phone: rawPhone,
      city = 'القاهرة',
      packageId = 'growth',
      businessTypeId = 'showroom',
      commercialReg = '',
      claimBusinessId = '',
      notes = '',
    } = body;

    if (!showroomName || !rawPhone) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم النشاط التجاري ورقم الهاتف/الواتساب' },
        { status: 400 }
      );
    }

    // Validate businessTypeId against allowed claimable types
    const validTypeIds = VENDOR_BUSINESS_TYPES.map((t) => t.id);
    const resolvedTypeId = validTypeIds.includes(String(businessTypeId)) ? String(businessTypeId) : 'showroom';
    const typeConfig = getVendorTypeConfig(resolvedTypeId);

    const phone = normalizePhone(rawPhone);
    if (phone.length < 10) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم هاتف محمول مصري صحيح' },
        { status: 400 }
      );
    }

    const selectedTier = isVendorTierId(packageId) ? packageId : 'growth';
    const tierConfig = getVendorTier(selectedTier);
    const isFreeTier = selectedTier === 'free';
    const crmTier = selectedTier === 'free' ? 'growth' : selectedTier;
    const now = new Date().toISOString();

    // Check if claimant phone matches known existing business directory phone
    let phoneMatchedShowroom = false;
    let matchedShowroomId: string | null = null;

    if (claimBusinessId) {
      const biz = await queryOne<{ id: string; custom_data: string }>(
        'SELECT id, custom_data FROM businesses WHERE id = ? OR slug = ? LIMIT 1',
        [claimBusinessId, claimBusinessId]
      );
      if (biz) {
        matchedShowroomId = biz.id;
        try {
          const cd = JSON.parse(biz.custom_data || '{}');
          const registeredPhone = cd?.sec_auto_showroom?.phone || cd?.sec_1_identity?.phone || '';
          if (registeredPhone && normalizePhone(registeredPhone) === phone) {
            phoneMatchedShowroom = true;
          }
        } catch {}
      }
    }

    // Check directory prospect record
    const existingProspect = await queryOne<{ id: string; phones: string }>(
      'SELECT id, phones FROM vendor_prospects WHERE duplicate_key = ? OR id = ? LIMIT 1',
      [phone, `pros_${phone}`]
    );

    const prospectId = existingProspect?.id || `pros_${phone}`;
    const claimNotes = [
      `طلب باقة: ${tierConfig.name.ar} (${selectedTier})`,
      `نوع النشاط: ${typeConfig?.nameAr || resolvedTypeId} (${resolvedTypeId})`,
      commercialReg ? `السجل التجاري/إثبات الملكية: ${commercialReg}` : null,
      claimBusinessId ? `محاولة تأكيد ملكية صفحة: ${claimBusinessId}` : null,
      phoneMatchedShowroom ? '✓ تطابق رقم الموبايل مع هاتف المعرض المسجل' : 'يحتاج مراجعة هاتف المعرض',
      notes ? `ملاحظات العميل: ${notes}` : null,
    ].filter(Boolean).join(' | ');

    if (existingProspect) {
      await execute(
        `UPDATE vendor_prospects
            SET name = ?, contact_name = ?, city = ?, notes = ?, campaign_status = 'offer_ready', updated_at = ?
          WHERE id = ?`,
        [showroomName, contactName || showroomName, city, claimNotes, now, prospectId]
      );
    } else {
      await execute(
        `INSERT INTO vendor_prospects (
          id, name, original_category, category_key, city, phones, contact_name,
          notes, duplicate_key, has_phone, free_offer_eligible, campaign_status,
          source_names, source_count, source_row, country_code, imported_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 'offer_ready', 'packages_request', 1, 1, 'EG', ?, ?)`,
        [
          prospectId,
          showroomName,
          typeConfig?.originalCategoryAr || 'معرض سيارات',
          typeConfig?.categoryKey || resolvedTypeId,
          city,
          JSON.stringify({ primary: phone }),
          contactName || showroomName,
          claimNotes,
          phone,
          now,
          now,
        ]
      );
    }

    // Check or generate standalone client copy
    const existingCopy = await queryOne<{ serial: string; status: string }>(
      'SELECT serial, status FROM standalone_client_copies WHERE phone = ? LIMIT 1',
      [phone]
    );

    let serial = existingCopy?.serial;
    if (!serial) {
      serial = generateSerial();
      await execute(
        `INSERT INTO standalone_client_copies (
          serial, company_name, phone, template_id, crm_tier,
          feature_overrides_json, status, business_id, notes, created_by, updated_by
        ) VALUES (?, ?, ?, 'tpl_standard', ?, '{}', ?, ?, ?, 'system', 'system')`,
        [
          serial,
          showroomName,
          phone,
          crmTier,
          isFreeTier ? 'pending_verification' : 'active',
          matchedShowroomId,
          claimNotes,
        ]
      );
    } else if (!isFreeTier && existingCopy && existingCopy.status === 'pending_verification') {
      // Paid upgrades activate immediately
      await execute(
        `UPDATE standalone_client_copies
            SET status = 'active', crm_tier = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
          WHERE serial = ?`,
        [crmTier, claimNotes, serial]
      );
    }

    // ── RATE LIMITING: max 3 OTP/passcode requests per phone per hour ────
    if (!isFreeTier) {
      const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
      const recentOtp = await queryOne<{ created_epoch: number }>(
        `SELECT CAST(strftime('%s', created_at) AS INTEGER) as created_epoch
           FROM otp_codes WHERE phone = ? LIMIT 1`,
        [phone]
      );
      // If an OTP was created less than 20 minutes ago, slow down
      if (recentOtp && recentOtp.created_epoch > oneHourAgo + 2400) {
        return NextResponse.json(
          {
            error: 'تم إرسال كود مؤخراً. يرجى الانتظار 20 دقيقة قبل طلب كود جديد.',
            retryAfterSeconds: recentOtp.created_epoch - (oneHourAgo + 2400),
          },
          { status: 429 }
        );
      }
    }

    // ── TWO-SPEED APPROVAL LOGIC ──────────────────────────────────────────
    // Free Tier: Strictly gated by Admin Approval (Anti-Hijack & Anti-Squatting).
    // Paid Tiers: Instant self-serve activation.
    if (isFreeTier) {
      return NextResponse.json({
        ok: true,
        requiresApproval: true,
        phone,
        serial,
        businessTypeId: resolvedTypeId,
        businessTypeNameAr: typeConfig?.nameAr || 'معرض سيارات',
        message:
          'تم استلام طلب العضوية المجانية بنجاح! حرصاً على حماية حقوق أصحاب النشاط ومنع انتحال الهوية، يخضع الطلب لمراجعة الإدارة للتأكد من ملكية الصفحة. سيصلكم كود التحميل والتفعيل عبر الواتساب فور الاعتماد.',
        package: {
          id: selectedTier,
          nameAr: tierConfig.name.ar,
          nameEn: tierConfig.name.en,
        },
      });
    }

    // Paid Tier: Immediate Passcode & Instant Download Enabled
    const passcode = generateNumericCode(6);
    const expiresAt = Math.floor(Date.now() / 1000) + 48 * 3600;

    await execute(
      `INSERT INTO otp_codes (phone, code, expires_at, created_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(phone) DO UPDATE SET
         code = excluded.code,
         expires_at = excluded.expires_at,
         created_at = excluded.created_at`,
      [phone, passcode, expiresAt]
    );

    return NextResponse.json({
      ok: true,
      requiresApproval: false,
      message: 'تهانينا! تم تفعيل باقتكم فوراً وبدون انتظار. استخدم كود التحميل أدناه لبدء العمل.',
      phone,
      passcode,
      serial,
      businessTypeId: resolvedTypeId,
      businessTypeNameAr: typeConfig?.nameAr || 'معرض سيارات',
      package: {
        id: selectedTier,
        nameAr: tierConfig.name.ar,
        nameEn: tierConfig.name.en,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل تسجيل الطلب';
    return NextResponse.json({ error }, { status: 500 });
  }
}
