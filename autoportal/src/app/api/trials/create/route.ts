import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { isVendorTierId, getVendorTier, type VendorTierId } from '@/lib/tiers';
import { BUSINESS_APPLICATIONS } from '@/lib/business-app-catalog';
import { getAdminUser } from '@/lib/admin-auth';
import { getVendorTypeConfig, VENDOR_BUSINESS_TYPES } from '@/lib/vendor-business-types';

function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('002')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('+2')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('20')) cleaned = cleaned.slice(2);
  if (!cleaned.startsWith('0') && cleaned.length === 10) cleaned = `0${cleaned}`;
  return cleaned;
}

function sanitizeText(raw: unknown, maxLength = 80): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .replace(/[<>"'/\\;`]/g, '')
    .slice(0, maxLength);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser(req);
    const isPlatformAdmin = user?.role === 'platform_admin';

    const body = await req.json();
    const rawShowroom = sanitizeText(body.showroomName || 'معرض التجربة الحية', 60);
    const showroomName = rawShowroom || 'معرض التجربة الحية';
    const rawContact = sanitizeText(body.contactName || 'مدير المعرض التجريبي', 50);
    const contactName = rawContact || 'مدير المعرض التجريبي';
    const city = sanitizeText(body.city || 'القاهرة', 30);
    const phone = normalizePhone(String(body.phone || '01000000000'));
    const rawTier = body.tier || 'enterprise';
    const tier: VendorTierId = isVendorTierId(rawTier) ? rawTier : 'enterprise';
    const tierConfig = getVendorTier(tier);

    // Resolve business type for the trial
    const validTypeIds = VENDOR_BUSINESS_TYPES.map((t) => t.id);
    const rawTypeId = String(body.businessTypeId || 'showroom');
    const businessTypeId = validTypeIds.includes(rawTypeId) ? rawTypeId : 'showroom';
    const typeConfig = getVendorTypeConfig(businessTypeId);

    // ── SECURITY: Validate inputs before any DB work ──────────────────────
    // Require a real business name (not just whitespace)
    if (showroomName.length < 3) {
      return NextResponse.json(
        { error: 'اسم النشاط التجاري مطلوب (3 حروف على الأقل)' },
        { status: 400 }
      );
    }
    // Require a real Egyptian phone number; block dummy default for non-admins
    if (!isPlatformAdmin && (phone.length < 10 || phone === '01000000000')) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم هاتف محمول مصري حقيقي لإنشاء النسخة التجريبية' },
        { status: 400 }
      );
    }

    // Non-admin rate limiting: maximum 1 active trial showroom per phone number
    if (!isPlatformAdmin && phone.length >= 10 && phone !== '01000000000') {
      const activeExistingTrial = await queryOne<{ id: string; slug: string }>(
        `SELECT id, slug FROM businesses
          WHERE id LIKE 'biz_trial_%' AND status = 'active' AND custom_data LIKE ? LIMIT 1`,
        [`%"phone":"${phone}"%`]
      );
      if (activeExistingTrial) {
        return NextResponse.json(
          {
            error: 'يوجد معرض تجريبي نشط مسجل بالفعل بهذا الرقم. يمكنك معاينة واستخدام المعرض القائم أو انتظار انتهاء فترته.',
            existingShowroomUrl: `/${activeExistingTrial.slug}`,
          },
          { status: 429 }
        );
      }
    }

    const now = new Date();
    const startedAt = now.toISOString();
    // 30 days trial = 30 * 24 * 3600 * 1000 ms
    const expiresDate = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
    const expiresAt = expiresDate.toISOString();

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanSlug = slugify(showroomName) || 'demo-showroom';
    const slug = `demo-${cleanSlug}-${randomSuffix}`;
    const businessId = `biz_trial_${randomSuffix}_${Date.now().toString(36)}`;

    // Prepare custom_data with _trial metadata for automatic lifecycle tracking
    const customData = JSON.stringify({
      sec_1_identity: {
        name: showroomName,
        name_ar: showroomName,
        tagline: 'نسخة تجريبية حية شاملة لجميع الموديولات (30 يوماً)',
        tagline_ar: 'نسخة تجريبية حية شاملة لجميع الموديولات (30 يوماً)',
        city,
        phone,
      },
      sec_auto_showroom: {
        phone,
        whatsapp: phone,
      },
      _trial: {
        is_trial: true,
        tier,
        business_type_id: businessTypeId,
        business_type_ar: typeConfig?.nameAr ?? 'معرض سيارات',
        started_at: startedAt,
        expires_at: expiresAt,
        duration_days: 30,
        auto_delete: true,
      },
    });

    // 1. Create the Trial Showroom in businesses table
    await execute(
      `INSERT INTO businesses (
        id, name, name_ar, slug, type_id, status, published,
        minisite_mode, subscription_tier, custom_data
      ) VALUES (?, ?, ?, ?, ?, 'active', 1, 'standalone', ?, ?)`,
      [businessId, showroomName, showroomName, slug, businessTypeId, tier, customData]
    );

    // 2. Grant full active licenses to all 3 applications for 30 days
    for (const app of BUSINESS_APPLICATIONS) {
      await execute(
        `INSERT INTO business_app_licenses (
          business_id, application_id, status, starts_at, expires_at, license_key
        ) VALUES (?, ?, 'active', ?, ?, ?)
        ON CONFLICT(business_id, application_id) DO UPDATE SET
          status = 'active', starts_at = excluded.starts_at, expires_at = excluded.expires_at`,
        [businessId, app.id, startedAt, expiresAt, `LIC-TRIAL-30D-${app.id.toUpperCase()}-${randomSuffix}`]
      );
    }

    // 3. Pre-seed 3 realistic demo cars in units table so the showroom is alive
    // (Only for sales types; finance/aftermarket types skip demo cars)
    const isSalesType = typeConfig?.parentGroup === 'auto_sales' || !typeConfig;
    const sampleUnits = isSalesType ? [
      {
        id: `unit_trial_${randomSuffix}_1`,
        title: 'مرسيدس بنز C200 موديل 2024 AMG فابريكا',
        price: 3450000,
        year: 2024,
        mileage: 12000,
      },
      {
        id: `unit_trial_${randomSuffix}_2`,
        title: 'كيا سبورتاج 2023 توب لاين بلس فابريكا بالكامل',
        price: 1850000,
        year: 2023,
        mileage: 28000,
      },
      {
        id: `unit_trial_${randomSuffix}_3`,
        title: 'بي إم دبليو 320i M-Sport موديل 2024 بحالة الزيرو',
        price: 3750000,
        year: 2024,
        mileage: 6500,
      },
    ] : [];

    for (const car of sampleUnits) {
      await execute(
        `INSERT INTO units (
          id, seller_business_id, status, asking_price, custom_data
        ) VALUES (?, ?, 'available', ?, ?)`,
        [
          car.id,
          businessId,
          car.price,
          JSON.stringify({
            title: car.title,
            year: car.year,
            mileage_km: car.mileage,
            transmission: 'أوتوماتيك',
            fuel: 'بنزين',
            condition: 'مستعمل فابريكا',
          }),
        ]
      );
    }

    // 4. Create Standalone Desktop ERP copy entry for offline trial
    const serial = `AFY-${now.getFullYear()}-TRIAL-${randomSuffix.toUpperCase()}`;
    await execute(
      `INSERT INTO standalone_client_copies (
        serial, company_name, phone, template_id, crm_tier,
        feature_overrides_json, status, business_id, notes, created_by, updated_by
      ) VALUES (?, ?, ?, 'tpl_standard', ?, '{}', 'active', ?, ?, 'system', 'system')`,
      [
        serial,
        showroomName,
        phone,
        tier,
        businessId,
        `نسخة تجريبية كاملة 30 يوماً - ${typeConfig?.nameAr ?? 'معرض سيارات'} - تنتهي في ${expiresAt.slice(0, 10)}`,
      ]
    );

    return NextResponse.json({
      ok: true,
      message: `تم إنشاء النسخة التجريبية الشاملة لجميع الموديولات بنجاح لمدة 30 يوماً! (${typeConfig?.nameAr ?? 'معرض سيارات'})`,
      trial: {
        businessId,
        businessTypeId,
        businessTypeNameAr: typeConfig?.nameAr ?? 'معرض سيارات',
        showroomName,
        slug,
        tier,
        tierNameAr: tierConfig.name.ar,
        startedAt,
        expiresAt,
        remainingDays: 30,
        serial,
        publicUrl: `/${slug}`,
        adminUrl: `/admin/showroom/${businessId}`,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل إنشاء النسخة التجريبية';
    return NextResponse.json({ error }, { status: 500 });
  }
}
