'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const DEFAULT_TEMPLATE = `مرحباً يا أهل *{{name}}* 👋

نحن من منصة *أوتوفيون (AutoFyon)*، المنصة الذكية لتجار ومعارض السيارات في مصر.

نود دعوتكم لإكمال بيانات معرضكم وإنشاء صفحة تعريفية خاصة بكم:
✅ تأكيد رقم واتساب المسجل
✅ مراجعة بيانات المعرض ومعاينة الصفحة قبل النشر
✅ لا تظهر الصفحة للعامة إلا بعد مراجعة الإدارة وموافقتكم على النشر

لبدء التسجيل الآمن:
👇 {{inviteUrl}}

يسعدنا خدمتكم دائماً 🙏
فريق أوتوفيون AutoFyon — autofyon.com`;

const STATUSES = [
  { value: '', label: 'كل الحالات' },
  { value: 'offer_ready', label: 'جاهز للعرض المجاني' },
  { value: 'new', label: 'جديد' },
  { value: 'queued', label: 'في الانتظار' },
  { value: 'contacted', label: 'تم التواصل' },
  { value: 'accepted', label: 'قبل' },
  { value: 'declined', label: 'رفض' },
];

const VARS = ['{{name}}', '{{city}}', '{{inviteUrl}}', '{{phone}}'];

interface BlastResult {
  id: string;
  name: string;
  phone: string;
  city: string;
  whatsappUrl: string;
  message: string;
}

interface BlastResponse {
  ok: boolean;
  total: number;
  skippedNoPhone: number;
  skippedActiveApplications: number;
  results: BlastResult[];
}

export default function WhatsAppBlastPage() {
  // Filters
  const [filterStatus, setFilterStatus] = useState('offer_ready');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCountry, setFilterCountry] = useState('EG');

  // Message
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [campaignRef, setCampaignRef] = useState('autofyon-blast-2026');
  const [markQueued, setMarkQueued] = useState(true);

  // State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BlastResult[] | null>(null);
  const [summary, setSummary] = useState<{ total: number; skippedNoPhone: number; skippedActiveApplications: number } | null>(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  function insertVar(variable: string) {
    setTemplate((prev) => prev + variable);
  }

  async function generate() {
    setLoading(true);
    setError('');
    setResults(null);
    setSummary(null);
    try {
      const targetLead = new URLSearchParams(window.location.search).get('lead');
      const res = await fetch('/api/admin/vendor-prospects/whatsapp-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            ids: targetLead ? [targetLead] : undefined,
            status: targetLead ? undefined : filterStatus || undefined,
            city: targetLead ? undefined : filterCity || undefined,
            category: targetLead ? undefined : filterCategory || undefined,
            country: targetLead ? undefined : filterCountry || undefined,
          },
          messageTemplate: template,
          campaignRef,
          updateStatus: markQueued,
        }),
      });
      const data = await res.json() as BlastResponse;
      if (!res.ok) throw new Error(JSON.stringify(data));
      setResults(data.results);
      setSummary({
        total: data.total,
        skippedNoPhone: data.skippedNoPhone,
        skippedActiveApplications: data.skippedActiveApplications,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل التوليد');
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(id: string, message: string) {
    await navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  }

  function downloadAll() {
    if (!results) return;
    const text = results.map((r, i) =>
      `=== ${i + 1}. ${r.name} (${r.city}) ===\nهاتف: ${r.phone}\nرابط: ${r.whatsappUrl}\n\n${r.message}\n\n${'─'.repeat(60)}\n`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autofyon-whatsapp-blast-${campaignRef}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openBatch() {
    if (!results) return;
    const batch = results.slice(0, 10);
    if (!window.confirm(`هذا سيفتح ${batch.length} نوافذ واتساب في المتصفح. هل تريد المتابعة؟`)) return;
    batch.forEach((r) => window.open(r.whatsappUrl, '_blank'));
  }

  const preview = useCallback((r: BlastResult) => {
    return r.message.slice(0, 120) + (r.message.length > 120 ? '...' : '');
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4" dir="rtl">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60" dir="ltr">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <Link href="/admin/platform/vendor-prospects" className="hover:underline">Vendor Prospects</Link><span>/</span>
        <span>WhatsApp Blast</span>
      </nav>

      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">📲 مركز إرسال WhatsApp للمعارض</h1>
        <p className="mt-1 text-sm text-neutral-500">فلتر المعارض، أنشئ دعوات آمنة مرتبطة بأرقام CRM، ثم أرسلها يدوياً عبر واتساب</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT — Filters */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <h2 className="font-bold">🎯 فلترة المعارض المستهدفة</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold">
              حالة الحملة
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold">
              البلد
              <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
                <option value="EG">مصر</option>
                <option value="SA">السعودية</option>
                <option value="QA">قطر</option>
                <option value="">الكل</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              المدينة / المحافظة
              <input value={filterCity} onChange={(e) => setFilterCity(e.target.value)} placeholder="القاهرة، الجيزة، ..." className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold">
              التصنيف
              <input value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} placeholder="showroom, dealer, ..." className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" dir="ltr" />
            </label>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
            💡 سيتم إنشاء دعوة فريدة صالحة 7 أيام لكل رقم صالح — الحد الأقصى 500 دعوة، ولا تُنشأ صفحة عامة قبل موافقة الإدارة
          </div>
        </section>

        {/* RIGHT — Message Composer */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <h2 className="font-bold">✍️ تخصيص رسالة الواتساب</h2>

          <div>
            <p className="text-xs font-bold mb-2">أدرج متغير في الرسالة:</p>
            <div className="flex flex-wrap gap-2">
              {VARS.map((v) => (
                <button key={v} type="button" onClick={() => insertVar(v)} className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-blue-800 hover:bg-blue-100">
                  {v}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-xs font-bold">
            نص الرسالة
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-lg border border-black/15 bg-black/[.02] px-4 py-3 text-sm"
            />
          </label>

          <label className="text-xs font-bold">
            كود الحملة (campaign ref)
            <input value={campaignRef} onChange={(e) => setCampaignRef(e.target.value)} dir="ltr" className="mt-1 w-full rounded border px-3 py-2 text-sm font-mono font-normal" placeholder="autofyon-blast-2026" />
            <span className="text-[10px] text-neutral-400 font-normal">يُحفظ في سجل الدعوة ولا يُستخدم للتحقق من هوية المسجل</span>
          </label>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={markQueued} onChange={(e) => setMarkQueued(e.target.checked)} className="rounded" />
              <span className="font-medium">وضع السجلات في قائمة انتظار التواصل (لم تُرسل رسالة بعد)</span>
            </label>
          </div>
        </section>
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => void generate()}
          disabled={loading || !template.trim()}
          className="rounded-xl bg-neutral-900 px-10 py-3 text-base font-bold text-white shadow-lg hover:bg-neutral-800 disabled:opacity-40"
        >
          {loading ? '⏳ جاري التوليد...' : '🚀 توليد روابط WhatsApp'}
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">❌ {error}</p>}

      {/* Results */}
      {results && summary && (
        <section className="space-y-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-green-800">✅ تم التوليد بنجاح!</p>
              <p className="text-sm text-green-700 mt-1">
                <strong>{summary.total}</strong> دعوة مرتبطة برقم CRM جاهزة
                {summary.skippedNoPhone > 0 && ` · تم تجاوز ${summary.skippedNoPhone} سجل لعدم وجود رقم صالح`}
                {summary.skippedActiveApplications > 0 && ` · تم تجاوز ${summary.skippedActiveApplications} طلب قيد المراجعة أو معتمد`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={downloadAll} className="rounded-lg border border-green-700 bg-white px-4 py-2 text-sm font-bold text-green-800 hover:bg-green-50">
                💾 تحميل كملف نصي
              </button>
              <button type="button" onClick={openBatch} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800">
                💬 فتح أول 10 في WhatsApp
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-black/[.04] text-xs uppercase">
                <tr>
                  <th className="p-3 text-start">#</th>
                  <th className="p-3 text-start">المعرض</th>
                  <th className="p-3 text-start">المدينة</th>
                  <th className="p-3 text-start">الهاتف</th>
                  <th className="p-3 text-start">معاينة الرسالة</th>
                  <th className="p-3 text-start">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className="border-t border-black/5 align-top hover:bg-black/[.01]">
                    <td className="p-3 opacity-40 text-xs">{i + 1}</td>
                    <td className="p-3 font-bold">{r.name}</td>
                    <td className="p-3 opacity-70 text-xs">{r.city || '—'}</td>
                    <td className="p-3 font-mono text-xs opacity-70 dir-ltr" dir="ltr">{r.phone || '—'}</td>
                    <td className="p-3 text-xs opacity-60 max-w-xs" style={{ direction: 'rtl' }}>{preview(r)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void copyMessage(r.id, r.message)}
                          className="rounded bg-black/5 px-3 py-1 text-xs font-bold hover:bg-black/10"
                        >
                          {copiedId === r.id ? '✓ نُسخ' : '📋 نسخ'}
                        </button>
                        {r.phone ? (
                          <a
                            href={r.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
                          >
                            💬 واتساب
                          </a>
                        ) : (
                          <span className="rounded bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">لا يوجد هاتف</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="flex gap-3 pb-8">
        <Link href="/admin/platform/vendor-prospects" className="text-sm underline opacity-60 hover:opacity-100">← العودة لقائمة المتوقعين</Link>
        <Link href="/admin/platform/vendor-prospects/import" className="text-sm underline opacity-60 hover:opacity-100">📥 استيراد معارض جديدة</Link>
      </div>
    </div>
  );
}
