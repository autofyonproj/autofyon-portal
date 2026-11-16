import { NextRequest, NextResponse } from 'next/server';
import { batch, queryOne } from '@/lib/db';
import { createAdminSession } from '@/lib/admin-session';
import { BUSINESS_APPLICATIONS, type BusinessApplicationId } from '@/lib/business-app-catalog';

// ── Slug generator ────────────────────────────────────────────────────────────

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `vendor-${Date.now().toString().slice(-4)}`;
}

// ── OTP store (D1-backed via otp_codes table) ─────────────────────────────────
// In production, use the same `otp_codes` table that vendor-login uses.
// WhatsApp/SMS delivery is controlled by WHATSAPP_TOKEN env var.

async function storeOtp(phone: string, code: string): Promise<void> {
  const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60;
  await batch([{
    sql: `INSERT INTO otp_codes (phone, code, expires_at)
          VALUES (?, ?, ?)
          ON CONFLICT(phone) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
    params: [phone, code, expiresAt],
  }]);
}

async function verifyAndConsumeOtp(phone: string, code: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const row = await queryOne<{ code: string; expires_at: number }>(
    'SELECT code, expires_at FROM otp_codes WHERE phone = ?',
    [phone],
  );
  if (!row || row.expires_at <= now || row.code !== code) return false;
  await batch([{ sql: 'DELETE FROM otp_codes WHERE phone = ?', params: [phone] }]);
  return true;
}

async function sendWhatsAppOtp(phone: string, code: string, whatsappToken?: string): Promise<void> {
  if (!whatsappToken) return; // No token = dev mode, code returned in response
  // Wire Twilio / Meta WhatsApp Business API here when WHATSAPP_TOKEN is set
  // Example (Twilio):
  // await fetch(`https://api.twilio.com/...`, { method: 'POST', body: ... });
  console.log(`[OTP] Would send ${code} to +${phone} via WhatsApp`);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action?: string;
      phone?: string;
      companyName?: string;
      companyNameAr?: string;
      typeId?: string;
      code?: string;
      applicationIds?: string[];
      ref?: string;      // campaign / group tracking
      email?: string;    // optional vendor email for password-based login
      password?: string; // optional initial password
    };

    const { action, companyName, companyNameAr, typeId, code } = body;
    const normalizedPhone = (body.phone || '').replace(/\D/g, '');
    const ref = (body.ref || '').trim();

    if (!normalizedPhone || normalizedPhone.length < 10) {
      return NextResponse.json({ error: 'رقم هاتف غير صحيح. يرجى إدخال رقم هاتف صالح.' }, { status: 400 });
    }

    // ── ACTION 1: Send OTP ────────────────────────────────────────────────────
    if (action === 'send_otp') {
      if (!companyName && !companyNameAr) {
        return NextResponse.json({ error: 'يرجى إدخال اسم الشركة أو المعرض' }, { status: 400 });
      }

      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const generatedCode = String(100000 + (arr[0] % 900000));

      await storeOtp(normalizedPhone, generatedCode);

      // Try WhatsApp delivery; fall back to returning code in dev
      const whatsappToken = process.env.WHATSAPP_TOKEN;
      await sendWhatsAppOtp(normalizedPhone, generatedCode, whatsappToken);

      const responseBody: Record<string, unknown> = {
        ok: true,
        message: 'تم إرسال كود التحقق',
        expiresInSeconds: 600,
      };
      // Always expose OTP in response when no WhatsApp token (dev / testing)
      if (!whatsappToken) {
        responseBody.demoOtp = generatedCode;
      }

      return NextResponse.json(responseBody);
    }

    // ── ACTION 2: Verify OTP & Create Minisite ────────────────────────────────
    if (action === 'verify_and_register') {
      const valid = await verifyAndConsumeOtp(normalizedPhone, code ?? '');
      if (!valid) {
        return NextResponse.json({ error: 'كود التأكيد غير صحيح أو انتهت صلاحيته' }, { status: 400 });
      }

      const requestedApplications = Array.isArray(body.applicationIds)
        ? [...new Set(body.applicationIds)]
        : [];
      if (requestedApplications.some((id) =>
        !BUSINESS_APPLICATIONS.some((app) => app.id === id),
      )) {
        return NextResponse.json({ error: 'اختيار تطبيق غير صالح' }, { status: 400 });
      }

      // ── Generate IDs and slug ─────────────────────────────────────────────
      const businessId = `biz_v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const rawSlug = companyName ? generateSlug(companyName) : `showroom-${normalizedPhone.slice(-4)}`;
      let finalSlug = rawSlug;
      const slugExists = await queryOne<{ id: string }>('SELECT id FROM businesses WHERE slug = ?', [finalSlug]);
      if (slugExists) {
        finalSlug = `${rawSlug}-${Math.floor(100 + Math.random() * 900)}`;
      }

      // ── Vendor email & user ───────────────────────────────────────────────
      const selectedType = typeId || 'showroom';
      // Prefer the vendor's own email if provided, otherwise derive from phone
      const vendorEmail = body.email?.trim().toLowerCase() || `vendor_${normalizedPhone}@autofyon.local`;

      const existingUser = await queryOne<{ id: string; role: string; scope_ids: string }>(
        'SELECT id, role, scope_ids FROM admin_users WHERE lower(email) = ? AND active = 1',
        [vendorEmail],
      );
      if (existingUser && existingUser.role !== 'vendor') {
        return NextResponse.json({ error: 'لا يمكن استخدام هذا الحساب للتسجيل كمعرض' }, { status: 409 });
      }

      let existingScopes: string[] = [];
      try { existingScopes = existingUser ? JSON.parse(existingUser.scope_ids) as string[] : []; }
      catch { /* ok */ }

      const adminUserId = existingUser?.id ?? `usr_${businessId}`;
      const scopes = [...new Set([...existingScopes, businessId])];

      // ── Hash password if provided ─────────────────────────────────────────
      let passwordHash: string | null = null;
      if (body.password && body.password.trim().length >= 8) {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(body.password.trim()), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 }, keyMaterial, 256);
        const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
        const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
        passwordHash = `pbkdf2:${saltHex}:${hashHex}`;
      }

      // ── Initial custom_data ────────────────────────────────────────────────
      const initialCustomData = JSON.stringify({
        sec_1_identity: {
          name: companyName || companyNameAr,
          name_ar: companyNameAr || companyName,
          tagline: 'عضو شبكة أوتوفيون للسيارات في مصر',
          tagline_ar: 'عضو شبكة أوتوفيون للسيارات في مصر',
        },
        sec_auto_showroom: {
          phone: `+20${normalizedPhone.replace(/^20|^0/, '')}`,
          opening_hours: '10:00 AM - 10:00 PM',
        },
      });

      const now = new Date().toISOString();

      // ── Build all INSERT statements atomically ────────────────────────────
      const statements = [
        // 1. Create the business (minisite)
        {
          sql: `INSERT INTO businesses (
                  id, name, name_ar, slug, type_id, status, published,
                  minisite_mode, service_level, subscription_tier, custom_data
                ) VALUES (?, ?, ?, ?, ?, 'active', 1, 'standalone', 'template', 'free', ?)`,
          params: [
            businessId, companyName || companyNameAr, companyNameAr || companyName,
            finalSlug, selectedType, initialCustomData,
          ],
        },
        // 2. Create or update the admin user
        existingUser
          ? {
              sql: `UPDATE admin_users SET scope_ids = ?, active = 1${passwordHash ? ', password_hash = ?' : ''} WHERE id = ?`,
              params: passwordHash ? [JSON.stringify(scopes), passwordHash, adminUserId] : [JSON.stringify(scopes), adminUserId],
            }
          : {
              sql: `INSERT INTO admin_users (id, email, name, role, scope_ids, active${passwordHash ? ', password_hash' : ''})
                    VALUES (?, ?, ?, 'vendor', ?, 1${passwordHash ? ', ?' : ''})`,
              params: passwordHash
                ? [adminUserId, vendorEmail, companyNameAr || companyName, JSON.stringify(scopes), passwordHash]
                : [adminUserId, vendorEmail, companyNameAr || companyName, JSON.stringify(scopes)],
            },
        // 3. Create membership (owner)
        {
          sql: `INSERT INTO business_memberships (id, business_id, admin_user_id, role, status)
                VALUES (?, ?, ?, 'owner', 'active')
                ON CONFLICT(business_id, admin_user_id) DO UPDATE SET role = 'owner', status = 'active', updated_at = CURRENT_TIMESTAMP`,
          params: [`member_${businessId}_${adminUserId}`, businessId, adminUserId],
        },
        // 4. Create site profile
        {
          sql: `INSERT INTO site_profiles (target_type, target_id, template_id, accent_color, background_color, updated_at)
                VALUES ('business', ?, 'editorial', '#c4292a', '#07090c', ?)`,
          params: [businessId, now],
        },
        // 5. Auto-create the Marketing Manager / Landing Page entry
        {
          sql: `INSERT INTO autofyon_media_landings (
                  id, business_id, slug, display_name, tagline, description,
                  phone, whatsapp, published, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                ON CONFLICT(slug) DO NOTHING`,
          params: [
            `landing_${businessId}`,
            businessId,
            finalSlug,
            companyNameAr || companyName || '',
            'عضو شبكة أوتوفيون للسيارات في مصر',
            `معرض ${companyNameAr || companyName} — عضو معتمد في شبكة أوتوفيون`,
            `+20${normalizedPhone.replace(/^20|^0/, '')}`,
            `+20${normalizedPhone.replace(/^20|^0/, '')}`,
            now,
          ],
        },
        // 6. Track campaign source (ref param → vendor_prospects if matched)
        ...(ref ? [{
          sql: `UPDATE vendor_prospects SET campaign_status = 'accepted', updated_at = ?
                WHERE id = (
                  SELECT id FROM vendor_prospects
                  WHERE campaign_status IN ('offer_ready', 'queued', 'contacted')
                    AND (source_names LIKE ? OR phones LIKE ?)
                  LIMIT 1
                )`,
          params: [now, `%${ref}%`, `%${normalizedPhone}%`],
        }] : []),
        // 7. Requested application licenses
        ...requestedApplications.map((applicationId) => ({
          sql: `INSERT INTO business_app_licenses (id, business_id, application_id, status, updated_at)
                VALUES (?, ?, ?, 'requested', ?)
                ON CONFLICT(business_id, application_id) DO NOTHING`,
          params: [`app_${businessId}_${applicationId}`, businessId, applicationId as BusinessApplicationId, now],
        })),
      ];

      await batch(statements);

      // ── Issue session cookie ─────────────────────────────────────────────
      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
      const sessionToken = await createAdminSession(vendorEmail, expiresAt);

      const res = NextResponse.json({
        ok: true,
        businessId,
        slug: finalSlug,
        email: vendorEmail,
        minisiteUrl: `/${finalSlug}`,
        landingUrl: `/p/${finalSlug}`,
        dashboardUrl: `/admin/showroom/${businessId}`,
        applicationsUrl: `/admin/showroom/${businessId}/applications`,
        applicationsRequested: requestedApplications,
      });

      res.cookies.set('admin_session', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      return res;
    }

    return NextResponse.json({ error: 'إجراء غير مدعوم' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل التسجيل';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
