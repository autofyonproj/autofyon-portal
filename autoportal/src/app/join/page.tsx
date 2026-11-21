'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BUSINESS_APPLICATIONS } from '@/lib/business-app-catalog';

type Stage = 'loading' | 'invite' | 'otp' | 'profile' | 'review' | 'pending' | 'approved' | 'referral' | 'referral_success' | 'invalid';

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
  applicationIds: string[];
  publishConsent: boolean;
  phoneConsent: boolean;
  whatsappConsent: boolean;
  emailConsent: boolean;
}

interface InviteResponse {
  ok: boolean;
  status: string;
  error?: string;
  prospectName?: string;
  prospectCity?: string;
  maskedPhone?: string;
  slug?: string | null;
  draft?: Partial<DraftData> | null;
}

interface ReferralData {
  name: string;
  phone: string;
  countryCode: string;
  city: string;
  contactName: string;
  email: string;
  contactConsent: boolean;
}

const EMPTY_DRAFT: DraftData = {
  companyName: '',
  companyNameAr: '',
  typeId: 'showroom',
  city: '',
  address: '',
  email: '',
  tagline: '',
  description: '',
  slug: '',
  applicationIds: [],
  publishConsent: false,
  phoneConsent: false,
  whatsappConsent: false,
  emailConsent: false,
};

function initialSlug(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-').slice(0, 50);
  return slug || `dealer-${Math.random().toString(36).slice(2, 7)}`;
}

export default function VendorRegistrationPage() {
  const [stage, setStage] = useState<Stage>('loading');
  const inviteToken = useRef('');
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [draft, setDraft] = useState<DraftData>(EMPTY_DRAFT);
  const [referral, setReferral] = useState<ReferralData>({
    name: '',
    phone: '',
    countryCode: 'EG',
    city: '',
    contactName: '',
    email: '',
    contactConsent: false,
  });
  const [returnStage, setReturnStage] = useState<Stage>('invite');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('invite') || sessionStorage.getItem('autofyon_vendor_invite') || '';
    if (!token) {
      void Promise.resolve().then(() => {
        if (active) setStage('invalid');
      });
      return () => { active = false; };
    }

    sessionStorage.setItem('autofyon_vendor_invite', token);
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    inviteToken.current = token;
    void fetch('/api/auth/vendor-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'validate_invite', inviteToken: token }),
    })
      .then(async (response) => {
        const data = await response.json() as InviteResponse;
        if (!response.ok) throw new Error(data.error || 'تعذر التحقق من رابط الدعوة');
        if (!active) return;
        setInvite(data);
        if (data.draft) {
          setDraft({ ...EMPTY_DRAFT, ...data.draft });
        } else if (data.prospectName) {
          setDraft((current) => ({
            ...current,
            companyName: data.prospectName || '',
            companyNameAr: data.prospectName || '',
            city: data.prospectCity || '',
            slug: initialSlug(data.prospectName || ''),
          }));
        }

        if (data.status === 'submitted') setStage('pending');
        else if (data.status === 'approved') setStage('approved');
        else if (['verified', 'changes_requested'].includes(data.status)) setStage('profile');
        else setStage('invite');
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'رابط الدعوة غير صالح');
        setStage('invalid');
      });

    return () => { active = false; };
  }, []);

  async function post(action: string, extra: Record<string, unknown> = {}) {
    const response = await fetch('/api/auth/vendor-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, inviteToken: inviteToken.current, ...extra }),
    });
    const data = await response.json() as { error?: string; status?: string; message?: string };
    if (!response.ok) throw new Error(data.error || 'تعذر إكمال الطلب');
    return data;
  }

  async function sendOtp(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await post('send_otp');
      setStage('otp');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await post('verify_otp', { code: otpCode });
      setStage('profile');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  }

  async function saveAndContinue(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await post('save_draft', { draft });
      setStage('review');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ البيانات');
    } finally {
      setLoading(false);
    }
  }

  async function submitApplication() {
    setLoading(true);
    setError('');
    try {
      await post('submit', { draft });
      sessionStorage.removeItem('autofyon_vendor_invite');
      setStage('pending');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إرسال الطلب للمراجعة');
    } finally {
      setLoading(false);
    }
  }

  async function submitReferral(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await post('refer_dealer', { referral });
      setStage('referral_success');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تسجيل الإحالة');
    } finally {
      setLoading(false);
    }
  }

  function updateDraft<Key extends keyof DraftData>(key: Key, value: DraftData[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const inputClass = 'mt-1 w-full rounded-xl border border-[#c4a265]/30 bg-white px-4 py-3 text-sm focus:border-[#c4a265] focus:outline-none focus:ring-2 focus:ring-[#c4a265]/20';
  const cardClass = 'rounded-3xl border border-[#c4a265]/25 bg-white/90 p-6 shadow-xl shadow-[#c4a265]/5 sm:p-9';

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#faf9f6] p-4 text-[#0d0f12] sm:p-8" dir="rtl">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between border-b border-[#c4a265]/20 pb-5">
        <Link href="/" className="flex items-center gap-3 text-inherit no-underline">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 font-black text-white">A</span>
          <span>
            <strong className="block">أوتوفيون <span className="font-mono text-red-600">AUTOFYON.com</span></strong>
            <small className="text-[#636b75]">إعداد صفحة المعرض ومراجعة طلب التسجيل</small>
          </span>
        </Link>
        <Link href="/dealers" className="text-xs font-bold text-[#636b75] hover:text-black">دليل المعارض</Link>
      </header>

      <main className="mx-auto my-8 w-full max-w-2xl">
        {invite && !['loading', 'invalid', 'referral', 'referral_success'].includes(stage) && (
          <div className="mb-4 text-center">
            <button type="button" onClick={() => { setReturnStage(stage); setStage('referral'); }} className="text-sm font-bold text-blue-700 underline">
              هذه الدعوة ليست لمعرضكم؟ سجّلوا بياناتكم أو رشّحوا معرضاً آخر
            </button>
          </div>
        )}
        {stage === 'loading' && <div className={`${cardClass} text-center text-sm text-neutral-500`}>جارٍ التحقق من رابط الدعوة...</div>}

        {stage === 'invalid' && (
          <section className={`${cardClass} text-center`}>
            <h1 className="text-2xl font-bold">التسجيل بدعوة خاصة</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {error || 'هذه الصفحة مخصصة للدعوات التي ترسلها إدارة أوتوفيون.'}
            </p>
            <p className="mt-2 text-sm text-neutral-600">يرجى التواصل مع مسؤول حسابكم للحصول على رابط دعوة صالح.</p>
          </section>
        )}

        {stage === 'invite' && (
          <section className={cardClass}>
            <p className="mb-3 inline-flex rounded-full bg-[#c4a265]/10 px-3 py-1 text-xs font-bold text-[#8b7340]">دعوة خاصة من AutoFyon</p>
            <h1 className="text-2xl font-bold">ابدأ إعداد صفحة معرضكم</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              الدعوة مخصصة لـ <strong>{invite?.prospectName}</strong>{invite?.prospectCity ? ` في ${invite.prospectCity}` : ''}.
              سنرسل رمز التحقق إلى رقم التواصل المعتمد في سجل CRM: <bdi dir="ltr" className="font-mono">{invite?.maskedPhone}</bdi>.
              لا يمكن تغيير الرقم من هذا الرابط.
            </p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={(event) => void sendOtp(event)} className="mt-6">
              <button disabled={loading} className="w-full rounded-xl bg-[#9b7131] px-5 py-4 font-bold text-white disabled:opacity-50">
                {loading ? 'جارٍ إرسال الرمز...' : 'إرسال رمز التحقق إلى واتساب'}
              </button>
            </form>
          </section>
        )}

        {stage === 'otp' && (
          <section className={cardClass}>
            <h1 className="text-2xl font-bold">تأكيد رقم واتساب</h1>
            <p className="mt-3 text-sm text-neutral-600">أدخل الرمز المرسل إلى <bdi dir="ltr" className="font-mono">{invite?.maskedPhone}</bdi>.</p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={(event) => void verifyOtp(event)} className="mt-6 space-y-4">
              <input
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                aria-label="رمز التحقق"
                className={`${inputClass} text-center font-mono text-2xl tracking-[0.5em]`}
                dir="ltr"
              />
              <button disabled={loading} className="w-full rounded-xl bg-[#9b7131] px-5 py-4 font-bold text-white disabled:opacity-50">
                {loading ? 'جارٍ التحقق...' : 'تأكيد الرقم والمتابعة'}
              </button>
            </form>
          </section>
        )}

        {stage === 'profile' && (
          <section className={cardClass}>
            <p className="mb-2 text-xs font-bold text-[#8b7340]">الخطوة 1 من 2 · بيانات الصفحة</p>
            <h1 className="text-2xl font-bold">أكمل بيانات معرضكم</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">سيتم حفظها كمسودة خاصة، ولن تظهر للعامة خلال المراجعة.</p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={(event) => void saveAndContinue(event)} className="mt-6 space-y-4">
              <label className="block text-xs font-bold">اسم المعرض بالعربية
                <input required maxLength={120} value={draft.companyNameAr} onChange={(event) => updateDraft('companyNameAr', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-bold">اسم المعرض بالإنجليزية (اختياري)
                <input maxLength={120} value={draft.companyName} onChange={(event) => updateDraft('companyName', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold">نوع النشاط
                  <select value={draft.typeId} onChange={(event) => updateDraft('typeId', event.target.value)} className={inputClass}>
                    <option value="showroom">معرض سيارات</option>
                    <option value="distributor">موزع معتمد / وكالة</option>
                    <option value="service_center">مركز صيانة</option>
                    <option value="spare_parts">قطع غيار</option>
                  </select>
                </label>
                <label className="block text-xs font-bold">المدينة / المحافظة
                  <input maxLength={100} value={draft.city} onChange={(event) => updateDraft('city', event.target.value)} className={inputClass} />
                </label>
              </div>
              <label className="block text-xs font-bold">العنوان
                <input maxLength={240} value={draft.address} onChange={(event) => updateDraft('address', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-bold">البريد الإلكتروني
                <input type="email" maxLength={160} value={draft.email} onChange={(event) => updateDraft('email', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <label className="block text-xs font-bold">نبذة مختصرة
                <input maxLength={180} value={draft.tagline} onChange={(event) => updateDraft('tagline', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-bold">تفاصيل النشاط
                <textarea maxLength={1000} rows={4} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} className={inputClass} />
              </label>
              <label className="block text-xs font-bold">الرابط المقترح لصفحتكم
                <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-[#c4a265]/30 bg-white" dir="ltr">
                  <span className="bg-neutral-50 px-3 py-3 text-xs text-neutral-500">autofyon.com/p/</span>
                  <input required maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(event) => updateDraft('slug', event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full px-3 py-3 text-sm focus:outline-none" />
                </div>
              </label>
              <fieldset className="space-y-3 rounded-xl border border-[#c4a265]/20 p-4">
                <legend className="px-1 text-xs font-bold">تطبيقات إضافية (اختياري)</legend>
                {BUSINESS_APPLICATIONS.map((application) => (
                  <label key={application.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.applicationIds.includes(application.id)}
                      onChange={(event) => updateDraft(
                        'applicationIds',
                        event.target.checked
                          ? [...draft.applicationIds, application.id]
                          : draft.applicationIds.filter((id) => id !== application.id),
                      )}
                      className="mt-1"
                    />
                    <span>{application.nameAr}<small className="block text-neutral-500">{application.name}</small></span>
                  </label>
                ))}
              </fieldset>
              <button disabled={loading} className="w-full rounded-xl bg-[#9b7131] px-5 py-4 font-bold text-white disabled:opacity-50">
                {loading ? 'جارٍ حفظ المسودة...' : 'حفظ ومراجعة النشر'}
              </button>
            </form>
          </section>
        )}

        {stage === 'review' && (
          <section className={cardClass}>
            <p className="mb-2 text-xs font-bold text-[#8b7340]">الخطوة 2 من 2 · المعاينة والموافقة</p>
            <h1 className="text-2xl font-bold">راجع ما سيظهر للعامة</h1>
            <div className="mt-5 rounded-2xl border border-black/10 bg-[#faf9f6] p-5">
              <strong className="text-lg">{draft.companyNameAr}</strong>
              {draft.companyName && <p className="text-sm text-neutral-600" dir="ltr">{draft.companyName}</p>}
              <p className="mt-2 text-sm text-neutral-600">{draft.city || 'المدينة غير محددة'}</p>
              {draft.address && <p className="text-sm text-neutral-600">{draft.address}</p>}
              {draft.tagline && <p className="mt-3 text-sm">{draft.tagline}</p>}
              {draft.description && <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{draft.description}</p>}
              <p className="mt-4 font-mono text-xs text-blue-700" dir="ltr">autofyon.com/p/{draft.slug}</p>
              {(draft.phoneConsent || draft.whatsappConsent) && (
                <p className="mt-2 text-xs text-neutral-600">سيظهر رقم واتساب الذي تم التحقق منه، وفق اختيارات الموافقة أدناه.</p>
              )}
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="mt-5 space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6">
                <input type="checkbox" checked={draft.publishConsent} onChange={(event) => updateDraft('publishConsent', event.target.checked)} className="mt-1" />
                <span><strong>أوافق على نشر صفحة المعرض بهذا الرابط وفي دليل المعارض</strong> بعد مراجعة وموافقة إدارة AutoFyon.</span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={draft.phoneConsent} onChange={(event) => updateDraft('phoneConsent', event.target.checked)} />
                إظهار رقم الهاتف الذي تم التحقق منه في الصفحة العامة والدليل
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={draft.whatsappConsent} onChange={(event) => updateDraft('whatsappConsent', event.target.checked)} />
                إظهار الرقم كوسيلة تواصل عبر واتساب
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={draft.emailConsent} onChange={(event) => updateDraft('emailConsent', event.target.checked)} />
                إظهار البريد الإلكتروني الذي أدخلته
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStage('profile')} className="rounded-xl border border-black/15 px-5 py-3 text-sm font-bold">العودة للتعديل</button>
              <button
                type="button"
                disabled={loading || !draft.publishConsent}
                onClick={() => void submitApplication()}
                className="flex-1 rounded-xl bg-[#9b7131] px-5 py-3 font-bold text-white disabled:opacity-40"
              >
                {loading ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب للمراجعة'}
              </button>
            </div>
          </section>
        )}

        {stage === 'pending' && (
          <section className={`${cardClass} text-center`}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">✓</div>
            <h1 className="text-2xl font-bold">تم استلام طلبكم</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">بياناتكم وصفحتكم قيد مراجعة إدارة أوتوفيون. لن تظهر الصفحة أو بيانات التواصل للعامة قبل الاعتماد.</p>
          </section>
        )}

        {stage === 'approved' && (
          <section className={`${cardClass} text-center`}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <h1 className="text-2xl font-bold">تم اعتماد صفحة معرضكم</h1>
            <p className="mt-3 text-sm text-neutral-600">يمكنكم فتح الصفحة المنشورة:</p>
            {invite?.slug && <Link className="mt-4 inline-block font-mono text-blue-700 underline" href={`/p/${invite.slug}`}>autofyon.com/p/{invite.slug}</Link>}
          </section>
        )}

        {stage === 'referral' && (
          <section className={cardClass}>
            <p className="mb-2 text-xs font-bold text-[#8b7340]">إحالة جديدة إلى CRM</p>
            <h1 className="text-2xl font-bold">اطلبوا دعوة خاصة لمعرضكم</h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              أدخلوا بيانات المعرض الذي يرغب في الانضمام. ستراجع الإدارة الرقم أولاً، ولن نرسل رسالة أو دعوة تلقائياً.
            </p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={(event) => void submitReferral(event)} className="mt-5 space-y-4">
              <label className="block text-xs font-bold">اسم المعرض
                <input required maxLength={120} value={referral.name} onChange={(event) => setReferral((current) => ({ ...current, name: event.target.value }))} className={inputClass} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold">البلد
                  <select value={referral.countryCode} onChange={(event) => setReferral((current) => ({ ...current, countryCode: event.target.value }))} className={inputClass}>
                    <option value="EG">مصر</option><option value="SA">السعودية</option><option value="QA">قطر</option>
                  </select>
                </label>
                <label className="block text-xs font-bold">رقم واتساب
                  <input required type="tel" inputMode="tel" maxLength={40} value={referral.phone} onChange={(event) => setReferral((current) => ({ ...current, phone: event.target.value }))} className={inputClass} dir="ltr" />
                </label>
                <label className="block text-xs font-bold">المدينة
                  <input maxLength={100} value={referral.city} onChange={(event) => setReferral((current) => ({ ...current, city: event.target.value }))} className={inputClass} />
                </label>
                <label className="block text-xs font-bold">اسم مسؤول التواصل (اختياري)
                  <input maxLength={120} value={referral.contactName} onChange={(event) => setReferral((current) => ({ ...current, contactName: event.target.value }))} className={inputClass} />
                </label>
              </div>
              <label className="block text-xs font-bold">البريد الإلكتروني (اختياري)
                <input type="email" maxLength={160} value={referral.email} onChange={(event) => setReferral((current) => ({ ...current, email: event.target.value }))} className={inputClass} dir="ltr" />
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6">
                <input type="checkbox" required checked={referral.contactConsent} onChange={(event) => setReferral((current) => ({ ...current, contactConsent: event.target.checked }))} className="mt-1" />
                <span>أؤكد أن المعرض المذكور طلب التواصل أو وافق على مشاركة بياناته مع إدارة أوتوفيون لمراجعته وإرسال دعوة مباشرة إليه.</span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => { setError(''); setStage(returnStage); }} className="rounded-xl border border-black/15 px-5 py-3 text-sm font-bold">رجوع</button>
                <button disabled={loading} className="flex-1 rounded-xl bg-[#9b7131] px-5 py-3 font-bold text-white disabled:opacity-50">
                  {loading ? 'جارٍ تسجيل الإحالة...' : 'إرسال بيانات المعرض للمراجعة'}
                </button>
              </div>
            </form>
          </section>
        )}

        {stage === 'referral_success' && (
          <section className={`${cardClass} text-center`}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <h1 className="text-2xl font-bold">تم تسجيل بيانات المعرض في CRM</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">ستراجع الإدارة الرقم وموافقة التواصل، ثم يمكنها إرسال دعوة خاصة مباشرة. لم يتم إرسال أي رسالة تلقائياً.</p>
          </section>
        )}
      </main>

      <footer className="mx-auto w-full max-w-4xl border-t border-[#c4a265]/20 pt-5 text-center text-xs text-[#636b75]">
        أوتوفيون AutoFyon © {new Date().getFullYear()} — تواصل ومراجعة آمنة قبل النشر
      </footer>
    </div>
  );
}
