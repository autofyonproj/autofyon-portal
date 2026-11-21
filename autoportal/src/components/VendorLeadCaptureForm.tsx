'use client';

import { useState } from 'react';
import type { SiteLocale } from '@/lib/site-locale';

export default function VendorLeadCaptureForm({
  businessSlug,
  businessName,
  locale,
  landingType,
}: {
  businessSlug: string;
  businessName: string;
  locale: SiteLocale;
  landingType: 'minisite' | 'starter';
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const ar = locale === 'ar';

  async function submit(form: HTMLFormElement) {
    setBusy(true);
    setError('');
    setMessage('');
    const data = new FormData(form);
    const query = new URLSearchParams(window.location.search);
    const campaignSource = query.get('utm_source')?.toLowerCase() || '';
    const referrer = document.referrer.toLowerCase();
    const source = campaignSource
      ? (/facebook|instagram|tiktok|snapchat|linkedin|youtube/.test(campaignSource) ? 'social' : 'campaign')
      : (/facebook|instagram|tiktok|snapchat|linkedin|youtube/.test(referrer) ? 'social' : 'website');

    try {
      const response = await fetch('/api/public/vendor-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug,
          landingType,
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          inquiry: data.get('inquiry'),
          inquiryFor: data.get('inquiryFor'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          source,
          sourcePath: window.location.pathname,
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || (ar ? 'تعذر إرسال الاستفسار.' : 'Could not send your inquiry.'));
      form.reset();
      setMessage(ar ? 'تم إرسال استفسارك إلى ' + businessName + '.' : `Your inquiry was sent to ${businessName}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : (ar ? 'تعذر إرسال الاستفسار.' : 'Could not send your inquiry.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5 text-slate-900 shadow-sm sm:p-7" aria-labelledby="vendor-lead-title">
      <header className="mb-2">
        <h2 id="vendor-lead-title" className="text-xl font-bold">
          {ar ? 'أرسل استفسارك' : 'Send an inquiry'}
        </h2>
      </header>
      <p className="mb-4 text-sm opacity-75">
        {ar ? 'سيظهر استفسارك في صندوق متابعة هذا النشاط التجاري.' : 'Your inquiry will appear in this business’s lead inbox.'}
      </p>
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(event.currentTarget);
        }}
      >
        <label className="grid gap-1 text-sm">
          {ar ? 'الاسم' : 'Name'}
          <input name="name" required maxLength={100} autoComplete="name" className="rounded-lg border border-black/15 bg-white p-2 text-slate-900" />
        </label>
        <label className="grid gap-1 text-sm">
          {ar ? 'رقم الهاتف' : 'Phone'}
          <input name="phone" type="tel" required maxLength={40} autoComplete="tel" className="rounded-lg border border-black/15 bg-white p-2 text-slate-900" />
        </label>
        <label className="grid gap-1 text-sm">
          {ar ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
          <input name="email" type="email" maxLength={254} autoComplete="email" className="rounded-lg border border-black/15 bg-white p-2 text-slate-900" />
        </label>
        <label className="grid gap-1 text-sm">
          {ar ? 'السيارة / الخدمة / المنتج (اختياري)' : 'Vehicle, service, or product (optional)'}
          <input name="inquiryFor" maxLength={160} className="rounded-lg border border-black/15 bg-white p-2 text-slate-900" />
        </label>
        <label className="grid gap-1 text-sm sm:col-span-2">
          {ar ? 'تفاصيل الاستفسار' : 'How can the business help you?'}
          <textarea name="inquiry" required minLength={3} maxLength={2000} rows={4} className="rounded-lg border border-black/15 bg-white p-2 text-slate-900" />
        </label>
        <label className="hidden" aria-hidden="true">
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="flex items-start gap-2 text-xs sm:col-span-2">
          <input name="consent" type="checkbox" required className="mt-1" />
          <span>
            {ar
              ? 'أوافق على مشاركة بياناتي مع هذا النشاط التجاري للتواصل معي بشأن استفساري.'
              : 'I agree to share my details with this business so they can respond to my inquiry.'}
          </span>
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {busy ? (ar ? 'جارٍ الإرسال…' : 'Sending…') : (ar ? 'إرسال الاستفسار' : 'Send inquiry')}
          </button>
          {message ? <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
        </div>
      </form>
    </section>
  );
}
