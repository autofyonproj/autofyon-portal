import { NextRequest, NextResponse } from 'next/server';
import { batch, query, queryOne } from '@/lib/db';
import { BUSINESS_APPLICATIONS, type BusinessApplicationId } from '@/lib/business-app-catalog';
import { normalizeWhatsAppPhone, sendWhatsAppOtp, sha256Hex } from '@/lib/whatsapp';

const ALLOWED_TYPES = new Set(['showroom', 'distributor', 'service_center', 'spare_parts']);

interface InviteRow {
  id: string;
  status: string;
  authorized_phone: string;
  expires_at: number;
  business_id: string | null;
  prospect_name: string;
  city: string;
  campaign_ref: string;
}

interface DraftData {
  companyName: string;
  companyNameAr: string;
  typeId: string;
  city: string;
  address: string;
  email: string;
  tagline: string;
  description: string;
  slug: string;
  applicationIds: BusinessApplicationId[];
  publishConsent: boolean;
  phoneConsent: boolean;
  whatsappConsent: boolean;
  emailConsent: boolean;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function readDraft(value: unknown): DraftData | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const companyName = cleanText(raw.companyName, 120);
  const companyNameAr = cleanText(raw.companyNameAr, 120);
  const typeId = cleanText(raw.typeId, 40);
  const slug = cleanText(raw.slug, 60).toLowerCase();
  const email = cleanText(raw.email, 160).toLowerCase();
  const applicationIds = Array.isArray(raw.applicationIds)
    ? [...new Set(raw.applicationIds.filter((id): id is string => typeof id === 'string'))]
    : [];

  if (!companyNameAr || !ALLOWED_TYPES.has(typeId)) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (applicationIds.some((id) => !isApplicationId(id))) return null;

  return {
    companyName,
    companyNameAr,
    typeId,
    city: cleanText(raw.city, 100),
    address: cleanText(raw.address, 240),
    email,
    tagline: cleanText(raw.tagline, 180),
    description: cleanText(raw.description, 1000),
    slug,
    applicationIds: applicationIds.filter(isApplicationId),
    publishConsent: raw.publishConsent === true,
    phoneConsent: raw.phoneConsent === true,
    whatsappConsent: raw.whatsappConsent === true,
    emailConsent: raw.emailConsent === true,
  };
}

function maskPhone(phone: string): string {
  return `${phone.slice(0, 3)}••••${phone.slice(-3)}`;
}

function isApplicationId(value: string): value is BusinessApplicationId {
  return BUSINESS_APPLICATIONS.some((application) => application.id === value);
}

async function loadInvite(token: string): Promise<InviteRow | null> {
  const tokenHash = await sha256Hex(token);
  return queryOne<InviteRow>(
    `SELECT i.id, i.status, i.authorized_phone, i.expires_at, i.business_id,
            p.name AS prospect_name, p.city, i.campaign_ref
       FROM vendor_registration_invites i
       JOIN vendor_prospects p ON p.id = i.prospect_id
      WHERE i.token_hash = ?`,
    [tokenHash],
  );
}

async function expireInviteIfNeeded(invite: InviteRow): Promise<boolean> {
  if (invite.expires_at > Math.floor(Date.now() / 1000)) return false;
  if (['invited', 'verified', 'changes_requested'].includes(invite.status)) {
    await batch([{
      sql: `UPDATE vendor_registration_invites
               SET status = 'expired', updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND status IN ('invited', 'verified', 'changes_requested')`,
      params: [invite.id],
    }]);
  }
  return true;
}

async function saveDraft(inviteId: string, draft: DraftData): Promise<void> {
  await batch([{
    sql: `INSERT INTO vendor_onboarding_drafts
            (invite_id, company_name, company_name_ar, type_id, city, address, email,
             tagline, description, slug, application_ids, publish_consent,
             phone_consent, whatsapp_consent, email_consent, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(invite_id) DO UPDATE SET
            company_name = excluded.company_name,
            company_name_ar = excluded.company_name_ar,
            type_id = excluded.type_id,
            city = excluded.city,
            address = excluded.address,
            email = excluded.email,
            tagline = excluded.tagline,
            description = excluded.description,
            slug = excluded.slug,
            application_ids = excluded.application_ids,
            publish_consent = excluded.publish_consent,
            phone_consent = excluded.phone_consent,
            whatsapp_consent = excluded.whatsapp_consent,
            email_consent = excluded.email_consent,
            updated_at = CURRENT_TIMESTAMP`,
    params: [
      inviteId, draft.companyName, draft.companyNameAr, draft.typeId, draft.city, draft.address,
      draft.email, draft.tagline, draft.description, draft.slug, JSON.stringify(draft.applicationIds),
      draft.publishConsent ? 1 : 0, draft.phoneConsent ? 1 : 0,
      draft.whatsappConsent ? 1 : 0, draft.emailConsent ? 1 : 0,
    ],
  }]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action?: string;
      inviteToken?: string;
      code?: string;
      draft?: unknown;
      referral?: unknown;
    };
    const action = body.action;
    const token = typeof body.inviteToken === 'string' ? body.inviteToken : '';
    if (!token || token.length > 200) return json({ error: 'رابط الدعوة غير صالح' }, 400);

    const invite = await loadInvite(token);
    if (!invite) return json({ error: 'رابط الدعوة غير صالح أو تم إلغاؤه' }, 404);
    if (await expireInviteIfNeeded(invite)) return json({ error: 'انتهت صلاحية الدعوة. اطلب رابطاً جديداً من الإدارة.' }, 410);

    if (action === 'validate_invite') {
      if (!['invited', 'verified', 'changes_requested', 'submitted', 'approved'].includes(invite.status)) {
        return json({ error: 'هذه الدعوة غير متاحة حالياً' }, 410);
      }
      const draft = await queryOne<{
        company_name: string; company_name_ar: string; type_id: string; city: string;
        address: string; email: string; tagline: string; description: string; slug: string;
        application_ids: string; publish_consent: number; phone_consent: number;
        whatsapp_consent: number; email_consent: number;
      }>('SELECT * FROM vendor_onboarding_drafts WHERE invite_id = ?', [invite.id]);
      return json({
        ok: true,
        status: invite.status,
        prospectName: invite.prospect_name,
        prospectCity: invite.city,
        maskedPhone: maskPhone(invite.authorized_phone),
        slug: invite.status === 'approved' ? (draft?.slug ?? null) : null,
        draft: draft ? {
          companyName: draft.company_name,
          companyNameAr: draft.company_name_ar,
          typeId: draft.type_id,
          city: draft.city,
          address: draft.address,
          email: draft.email,
          tagline: draft.tagline,
          description: draft.description,
          slug: draft.slug,
          applicationIds: JSON.parse(draft.application_ids) as string[],
          publishConsent: draft.publish_consent === 1,
          phoneConsent: draft.phone_consent === 1,
          whatsappConsent: draft.whatsapp_consent === 1,
          emailConsent: draft.email_consent === 1,
        } : null,
      });
    }

    if (action === 'refer_dealer') {
      if (!['invited', 'verified', 'changes_requested', 'submitted', 'approved'].includes(invite.status)) {
        return json({ error: 'لا يمكن استخدام هذه الدعوة لتسجيل إحالة جديدة' }, 410);
      }
      const referral = body.referral && typeof body.referral === 'object'
        ? body.referral as Record<string, unknown>
        : {};
      const name = cleanText(referral.name, 120);
      const contactName = cleanText(referral.contactName, 120);
      const rawPhone = cleanText(referral.phone, 40);
      const countryCode = cleanText(referral.countryCode, 2);
      const city = cleanText(referral.city, 100);
      const email = cleanText(referral.email, 160).toLowerCase();
      if (!name || !rawPhone || !['EG', 'SA', 'QA'].includes(countryCode)) {
        return json({ error: 'أدخل اسم المعرض ورقم واتساب والبلد' }, 400);
      }
      if (referral.contactConsent !== true) {
        return json({ error: 'يجب تأكيد موافقة المعرض على أن تتواصل معه إدارة أوتوفيون' }, 400);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: 'البريد الإلكتروني غير صالح' }, 400);
      }
      const phone = normalizeWhatsAppPhone(rawPhone, countryCode);
      if (!phone) return json({ error: 'رقم واتساب غير صالح للبلد المحدد' }, 400);
      if (phone === invite.authorized_phone) {
        return json({ error: 'هذا هو رقم الدعوة الحالية. لا حاجة لإضافته كإحالة.' }, 400);
      }

      const referralCount = await queryOne<{ count: number }>(
        `SELECT COUNT(*) AS count FROM vendor_referrals
          WHERE source_invite_id = ? AND created_at >= datetime('now', '-30 days')`,
        [invite.id],
      );
      if ((referralCount?.count ?? 0) >= 5) {
        return json({ error: 'وصلت هذه الدعوة إلى الحد الأقصى للإحالات. تواصل مع الإدارة لإضافة المزيد.' }, 429);
      }

      const existingRows = await query<{
        id: string;
        phones: string;
        country_code: string;
        campaign_status: string;
      }>(
        `SELECT id, phones, country_code, campaign_status
           FROM vendor_prospects
          WHERE has_phone = 1 AND phones LIKE ?
          LIMIT 50`,
        [`%${phone.slice(-7)}%`],
      );
      let prospectId: string | null = null;
      for (const candidate of existingRows) {
        let phoneData: Record<string, string> = {};
        try {
          phoneData = JSON.parse(candidate.phones) as Record<string, string>;
        } catch {
          continue;
        }
        const candidatePhones = [phoneData.whatsapp, phoneData.mobile1, phoneData.mobile2, phoneData.phone1, phoneData.phone2, phoneData.phone3]
          .filter((value): value is string => typeof value === 'string');
        if (candidatePhones.some((value) => normalizeWhatsAppPhone(value, candidate.country_code) === phone)) {
          if (['declined', 'do_not_contact'].includes(candidate.campaign_status)) {
            return json({ error: 'هذا الرقم موجود في CRM بحالة لا تسمح بالتواصل' }, 409);
          }
          if (candidate.campaign_status === 'accepted') {
            return json({ error: 'هذا المعرض مسجل بالفعل أو لديه طلب قيد المراجعة' }, 409);
          }
          prospectId = candidate.id;
          break;
        }
      }

      const newProspectId = prospectId ?? `vpr_${crypto.randomUUID()}`;
      const priorReferral = await queryOne<{ status: string }>(
        'SELECT status FROM vendor_referrals WHERE source_invite_id = ? AND prospect_id = ?',
        [invite.id, newProspectId],
      );
      if (priorReferral) return json({ error: 'تم تسجيل هذا المعرض من خلال الدعوة نفسها من قبل' }, 409);
      if (prospectId) {
        const activeInvite = await queryOne<{ id: string }>(
          `SELECT id FROM vendor_registration_invites
            WHERE prospect_id = ?
              AND (
                status IN ('submitted', 'approved')
                OR (status IN ('invited', 'verified', 'changes_requested')
                    AND expires_at > CAST(strftime('%s', 'now') AS INTEGER))
              )
            LIMIT 1`,
          [prospectId],
        );
        if (activeInvite) return json({ error: 'هذا المعرض لديه بالفعل دعوة أو طلب تسجيل نشط' }, 409);
      }
      const referralId = `vrf_${crypto.randomUUID()}`;
      const now = new Date().toISOString();
      const statements = [];
      if (!prospectId) {
        statements.push({
          sql: `INSERT INTO vendor_prospects
                  (id, name, category_key, phones, contact_name, email, city, country_code,
                   has_phone, free_offer_eligible, campaign_status, source_names, source_count,
                   source_row, notes, updated_at)
                VALUES (?, ?, 'showroom', ?, ?, ?, ?, ?, 1, 0, 'new',
                        'dealer referral', 1, 0, ?, ?)`,
          params: [
            newProspectId,
            name,
            JSON.stringify({ whatsapp: phone }),
            contactName,
            email,
            city,
            countryCode,
            'Dealer referral. Contact consent recorded; phone is unverified and requires admin review.',
            now,
          ],
        });
      }
      statements.push({
        sql: `INSERT INTO vendor_referrals
                (id, source_invite_id, prospect_id, submitted_name, submitted_phone,
                 submitted_city, submitted_contact_name, submitted_email, status,
                 contact_consent, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', 1, ?, ?)`,
        params: [referralId, invite.id, newProspectId, name, phone, city, contactName, email, now, now],
      });
      statements.push({
        sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, action, detail)
              VALUES (?, ?, 'referral_submitted', ?)`,
        params: [
          `voa_${crypto.randomUUID()}`,
          invite.id,
          JSON.stringify({ referralId, prospectId: newProspectId, contactConsent: true }),
        ],
      });
      await batch(statements);
      return json({
        ok: true,
        status: 'pending_review',
        message: 'تم تسجيل بيانات المعرض في CRM للمراجعة. لن نرسل دعوة أو رسالة إليه قبل اعتماد الإدارة.',
      });
    }

    if (action === 'send_otp') {
      if (invite.status !== 'invited') return json({ error: 'لا يمكن إرسال رمز لهذه الدعوة' }, 409);
      const now = Math.floor(Date.now() / 1000);
      const previous = await queryOne<{ send_count: number; last_sent_at: number }>(
        'SELECT send_count, last_sent_at FROM vendor_registration_otps WHERE invite_id = ?',
        [invite.id],
      );
      if (previous && previous.send_count >= 5) return json({ error: 'تم بلوغ الحد الأقصى لإرسال الرموز لهذه الدعوة' }, 429);
      if (previous && now - previous.last_sent_at < 60) {
        return json({ error: 'انتظر دقيقة قبل طلب رمز جديد' }, 429);
      }

      const random = new Uint32Array(1);
      crypto.getRandomValues(random);
      const code = String(100000 + (random[0] % 900000));
      const codeHash = await sha256Hex(`${token}:${code}`);
      await batch([{
        sql: `INSERT INTO vendor_registration_otps
                (invite_id, code_hash, expires_at, attempts, send_count, last_sent_at)
              VALUES (?, ?, ?, 0, 1, ?)
              ON CONFLICT(invite_id) DO UPDATE SET
                code_hash = excluded.code_hash,
                expires_at = excluded.expires_at,
                attempts = 0,
                send_count = vendor_registration_otps.send_count + 1,
                last_sent_at = excluded.last_sent_at`,
        params: [invite.id, codeHash, now + 5 * 60, now],
      }]);

      try {
        await sendWhatsAppOtp(invite.authorized_phone, code);
      } catch {
        await batch([{
          sql: `UPDATE vendor_registration_otps
                   SET code_hash = '', expires_at = ?, attempts = 5
                 WHERE invite_id = ?`,
          params: [now, invite.id],
        }]);
        return json({ error: 'تعذر إرسال رمز واتساب. يرجى المحاولة لاحقاً أو التواصل مع الإدارة.' }, 503);
      }

      return json({ ok: true, expiresInSeconds: 300, maskedPhone: maskPhone(invite.authorized_phone) });
    }

    if (action === 'verify_otp') {
      if (invite.status !== 'invited') return json({ error: 'الدعوة غير جاهزة للتحقق' }, 409);
      const code = typeof body.code === 'string' ? body.code : '';
      if (!/^\d{6}$/.test(code)) return json({ error: 'أدخل رمز التحقق المكوّن من 6 أرقام' }, 400);
      const otp = await queryOne<{ code_hash: string; expires_at: number; attempts: number }>(
        'SELECT code_hash, expires_at, attempts FROM vendor_registration_otps WHERE invite_id = ?',
        [invite.id],
      );
      if (!otp || otp.expires_at <= Math.floor(Date.now() / 1000) || otp.attempts >= 5) {
        return json({ error: 'انتهت صلاحية الرمز أو تم بلوغ عدد المحاولات. اطلب رمزاً جديداً.' }, 400);
      }
      const codeHash = await sha256Hex(`${token}:${code}`);
      if (codeHash !== otp.code_hash) {
        await batch([{
          sql: 'UPDATE vendor_registration_otps SET attempts = attempts + 1 WHERE invite_id = ? AND attempts < 5',
          params: [invite.id],
        }]);
        return json({ error: 'رمز التحقق غير صحيح' }, 400);
      }

      const now = new Date().toISOString();
      const consumed = await batch([
        {
          sql: `DELETE FROM vendor_registration_otps
                WHERE invite_id = ? AND code_hash = ? AND expires_at > ? AND attempts < 5`,
          params: [invite.id, codeHash, Math.floor(Date.now() / 1000)],
        },
        {
          sql: `UPDATE vendor_registration_invites
                   SET status = 'verified', verified_at = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ? AND status = 'invited'`,
          params: [now, invite.id],
        },
      ]);
      if (consumed[0]?.changes !== 1 || consumed[1]?.changes !== 1) {
        return json({ error: 'انتهت صلاحية الرمز أو تم استخدامه بالفعل' }, 409);
      }
      await batch([{
        sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, action, detail)
              VALUES (?, ?, 'phone_verified', 'Authorized CRM phone verified by WhatsApp OTP')`,
        params: [`voa_${crypto.randomUUID()}`, invite.id],
      }]);
      return json({ ok: true, status: 'verified' });
    }

    if (action === 'save_draft' || action === 'submit') {
      if (!['verified', 'changes_requested'].includes(invite.status)) {
        return json({ error: 'أكمل تأكيد رقم الهاتف قبل متابعة الطلب' }, 409);
      }
      const draft = readDraft(body.draft);
      if (!draft) return json({ error: 'راجع بيانات النشاط والاسم والرابط المختار' }, 400);
      if (action === 'submit' && !draft.publishConsent) {
        return json({ error: 'يجب الموافقة على نشر صفحة النشاط قبل إرسال الطلب للمراجعة' }, 400);
      }

      await saveDraft(invite.id, draft);
      if (action === 'save_draft') {
        await batch([{
          sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, action, detail)
                VALUES (?, ?, 'draft_saved', 'Dealer saved onboarding profile')`,
          params: [`voa_${crypto.randomUUID()}`, invite.id],
        }]);
        return json({ ok: true, status: invite.status });
      }

      const slugOwner = await queryOne<{ id: string }>(
        `SELECT id FROM businesses
          WHERE lower(slug) = lower(?)
            AND (? IS NULL OR id <> ?)
          LIMIT 1`,
        [draft.slug, invite.business_id, invite.business_id],
      );
      const landingOwner = await queryOne<{ business_id: string }>(
        `SELECT business_id FROM autofyon_media_landings
          WHERE lower(slug) = lower(?)
            AND (? IS NULL OR business_id <> ?)
          LIMIT 1`,
        [draft.slug, invite.business_id, invite.business_id],
      );
      if (slugOwner || landingOwner) return json({ error: 'الرابط المختار مستخدم بالفعل. اختر رابطاً آخر.' }, 409);

      const phone = invite.authorized_phone;
      const businessId = invite.business_id || `biz_v_${crypto.randomUUID().replace(/-/g, '')}`;
      const vendorEmail = `vendor_${phone}@autofyon.local`;
      const existingUser = await queryOne<{ id: string; role: string; scope_ids: string }>(
        'SELECT id, role, scope_ids FROM admin_users WHERE lower(email) = ?',
        [vendorEmail],
      );
      if (existingUser && existingUser.role !== 'vendor') {
        return json({ error: 'تعذر إنشاء حساب للرقم المعتمد. يرجى التواصل مع الإدارة.' }, 409);
      }
      if (existingUser) {
        const otherMembership = await queryOne<{ business_id: string }>(
          `SELECT business_id FROM business_memberships
            WHERE admin_user_id = ? AND status <> 'revoked'
              AND (? IS NULL OR business_id <> ?)
            LIMIT 1`,
          [existingUser.id, invite.business_id, invite.business_id],
        );
        if (otherMembership) return json({ error: 'هذا الرقم مرتبط بالفعل بحساب معرض آخر' }, 409);
      }

      const userId = existingUser?.id ?? `usr_${businessId}`;
      let existingScopes: string[] = [];
      try {
        existingScopes = existingUser ? JSON.parse(existingUser.scope_ids) as string[] : [];
      } catch {
        existingScopes = [];
      }
      const scopes = [...new Set([...existingScopes, businessId])];
      const now = new Date().toISOString();
      const publicPhone = draft.phoneConsent ? `+${phone}` : '';
      const publicWhatsapp = draft.whatsappConsent ? `+${phone}` : '';
      const publicEmail = draft.emailConsent ? draft.email : '';
      const customData = JSON.stringify({
        sec_1_identity: {
          name: draft.companyName || draft.companyNameAr,
          name_ar: draft.companyNameAr,
          city: draft.city,
          address: draft.address,
          email: publicEmail,
        },
        sec_auto_showroom: {
          phone: publicPhone,
          whatsapp: publicWhatsapp,
        },
      });
      const statements = [
        {
          sql: `INSERT INTO businesses
                  (id, name, name_ar, slug, type_id, status, published, minisite_mode,
                   subscription_tier, custom_data, updated_at)
                VALUES (?, ?, ?, ?, ?, 'pending', 0, 'standalone', 'free', ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name, name_ar = excluded.name_ar, slug = excluded.slug,
                  type_id = excluded.type_id, status = 'pending', published = 0,
                  custom_data = excluded.custom_data, updated_at = excluded.updated_at`,
          params: [businessId, draft.companyName || draft.companyNameAr, draft.companyNameAr, draft.slug, draft.typeId, customData, now],
        },
        existingUser
          ? {
              sql: 'UPDATE admin_users SET scope_ids = ?, active = 1 WHERE id = ?',
              params: [JSON.stringify(scopes), userId],
            }
          : {
              sql: `INSERT INTO admin_users (id, email, name, role, scope_ids, active)
                    VALUES (?, ?, ?, 'vendor', ?, 1)`,
              params: [userId, vendorEmail, draft.companyNameAr, JSON.stringify(scopes)],
            },
        {
          sql: `INSERT INTO business_memberships (id, business_id, admin_user_id, role, status)
                VALUES (?, ?, ?, 'owner', 'suspended')
                ON CONFLICT(business_id, admin_user_id) DO UPDATE
                  SET role = 'owner', status = 'suspended', updated_at = CURRENT_TIMESTAMP`,
          params: [`member_${businessId}_${userId}`, businessId, userId],
        },
        {
          sql: `INSERT INTO site_profiles (target_type, target_id, template_id, accent_color, background_color, updated_at)
                VALUES ('business', ?, 'editorial', '#c4292a', '#07090c', ?)
                ON CONFLICT(target_type, target_id) DO NOTHING`,
          params: [businessId, now],
        },
        {
          sql: `INSERT INTO autofyon_media_landings
                  (business_id, slug, display_name, tagline, description, phone, whatsapp, published, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
                ON CONFLICT(business_id) DO UPDATE SET
                  slug = excluded.slug, display_name = excluded.display_name,
                  tagline = excluded.tagline, description = excluded.description,
                  phone = excluded.phone, whatsapp = excluded.whatsapp,
                  published = 0, updated_at = excluded.updated_at`,
          params: [
            businessId, draft.slug, draft.companyNameAr, draft.tagline, draft.description,
            publicPhone, publicWhatsapp, now,
          ],
        },
        {
          sql: `UPDATE vendor_registration_invites
                   SET status = 'submitted', business_id = ?, submitted_at = ?,
                       decided_at = NULL, decision_note = '', updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
          params: [businessId, now, invite.id],
        },
        {
          sql: `UPDATE vendor_prospects
                   SET campaign_status = 'accepted', updated_at = ?
                 WHERE id = (SELECT prospect_id FROM vendor_registration_invites WHERE id = ?)`,
          params: [now, invite.id],
        },
        {
          sql: `UPDATE vendor_referrals
                   SET status = 'converted', updated_at = CURRENT_TIMESTAMP
                 WHERE prospect_id = (
                   SELECT prospect_id FROM vendor_registration_invites WHERE id = ?
                 ) AND status IN ('approved', 'invited')`,
          params: [invite.id],
        },
        {
          sql: `INSERT INTO vendor_onboarding_audit (id, invite_id, action, detail)
                VALUES (?, ?, 'submitted', ?)`,
          params: [
            `voa_${crypto.randomUUID()}`,
            invite.id,
            JSON.stringify({
              publishConsent: draft.publishConsent,
              phoneConsent: draft.phoneConsent,
              whatsappConsent: draft.whatsappConsent,
              emailConsent: draft.emailConsent,
            }),
          ],
        },
        ...draft.applicationIds.map((applicationId) => ({
          sql: `INSERT INTO business_app_licenses (id, business_id, application_id, status, updated_at)
                VALUES (?, ?, ?, 'requested', ?)
                ON CONFLICT(business_id, application_id) DO UPDATE
                  SET status = 'requested', updated_at = excluded.updated_at`,
          params: [`app_${businessId}_${applicationId}`, businessId, applicationId, now],
        })),
      ];
      await batch(statements);
      return json({ ok: true, status: 'submitted', message: 'تم إرسال بيانات المعرض للمراجعة. لن تظهر الصفحة للعامة قبل موافقة الإدارة.' });
    }

    return json({ error: 'إجراء غير مدعوم' }, 400);
  } catch (error) {
    console.error('Vendor onboarding request failed', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'تعذر إكمال الطلب. يرجى المحاولة لاحقاً.' }, 500);
  }
}
