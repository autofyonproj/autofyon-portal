'use client';

import { useState } from 'react';

const CATEGORIES = [
  { id: 'showroom', label: 'معرض سيارات (Showroom)' },
  { id: 'dealer', label: 'تاجر (Dealer)' },
  { id: 'authorized_agent', label: 'وكيل معتمد' },
  { id: 'distributor', label: 'موزع (Distributor)' },
  { id: 'agent', label: 'وكيل (Agent)' },
  { id: 'parts_supplier', label: 'قطع غيار' },
  { id: 'service_center', label: 'مركز صيانة' },
  { id: 'finance_company', label: 'تمويل' },
  { id: 'insurance_company', label: 'تأمين' },
  { id: 'unclassified', label: 'غير مصنف' },
];

interface ParsedRow {
  name: string;
  phones: string;
  whatsapp: string;
  city: string;
  category_key: string;
  brand: string;
  email: string;
  address: string;
  valid: boolean;
  error?: string;
}

function parseCSV(raw: string, defaultCategory: string): ParsedRow[] {
  const lines = raw.trim().split('\n').filter((l) => l.trim());
  if (!lines.length) return [];

  // Detect header
  const firstLower = lines[0].toLowerCase();
  const hasHeader = firstLower.includes('name') || firstLower.includes('اسم') || firstLower.includes('phone');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const cols = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());
    const [name = '', phones = '', whatsapp = '', city = '', category_key = '', brand = '', email = '', address = ''] = cols;
    const valid = name.length > 0 && name.length <= 200;
    return {
      name,
      phones,
      whatsapp,
      city,
      category_key: category_key || defaultCategory,
      brand,
      email,
      address,
      valid,
      error: !name ? 'الاسم مطلوب' : name.length > 200 ? 'الاسم طويل جداً' : undefined,
    };
  });
}

export default function VendorImportPage() {
  const [csv, setCsv] = useState('');
  const [defaultCategory, setDefaultCategory] = useState('showroom');
  const [defaultCountry, setDefaultCountry] = useState('EG');
  const [source, setSource] = useState('');
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [error, setError] = useState('');

  // Manual form
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualWhatsapp, setManualWhatsapp] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualCategory, setManualCategory] = useState('showroom');
  const [manualBrand, setManualBrand] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualSaving, setManualSaving] = useState(false);
  const [manualResult, setManualResult] = useState('');

  function handleParse() {
    setParsed(parseCSV(csv, defaultCategory));
    setResult(null);
    setError('');
  }

  async function handleImport() {
    if (!parsed.length) return;
    setImporting(true);
    setError('');
    setResult(null);
    try {
      const rows = parsed.filter((r) => r.valid).map((r) => ({
        ...r,
        country_code: defaultCountry,
        source,
      }));
      const res = await fetch('/api/admin/vendor-prospects/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      const data = await res.json() as { imported: number; skipped: number; errors: string[] };
      if (!res.ok) throw new Error(JSON.stringify(data));
      setResult(data);
      setCsv('');
      setParsed([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault();
    setManualSaving(true);
    setManualResult('');
    try {
      const res = await fetch('/api/admin/vendor-prospects/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          name: manualName,
          phones: manualPhone,
          whatsapp: manualWhatsapp,
          city: manualCity,
          category_key: manualCategory,
          brand: manualBrand,
          email: manualEmail,
          country_code: defaultCountry,
          source,
        }]),
      });
      const data = await res.json() as { imported: number; skipped: number };
      if (!res.ok) throw new Error('فشل الحفظ');
      setManualResult(data.imported > 0 ? '✅ تم إضافة المعرض بنجاح' : '⚠️ المعرض موجود مسبقاً (مكرر)');
      if (data.imported > 0) {
        setManualName(''); setManualPhone(''); setManualWhatsapp('');
        setManualCity(''); setManualBrand(''); setManualEmail('');
      }
    } catch (e) {
      setManualResult(e instanceof Error ? `❌ ${e.message}` : '❌ فشل الحفظ');
    } finally {
      setManualSaving(false);
    }
  }

  const validCount = parsed.filter((r) => r.valid).length;
  const invalidCount = parsed.filter((r) => !r.valid).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <a href="/admin" className="hover:underline">Admin</a><span>/</span>
        <a href="/admin/platform" className="hover:underline">Platform</a><span>/</span>
        <a href="/admin/platform/vendor-prospects" className="hover:underline">Vendor Prospects</a><span>/</span>
        <span>Import</span>
      </nav>

      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">📥 استيراد قائمة المعارض</h1>
        <p className="mt-1 text-sm text-neutral-500">الصق بيانات المعارض من Excel / CSV أو أضفها يدوياً</p>
      </header>

      {/* Global settings */}
      <div className="grid gap-4 rounded-xl border border-black/10 bg-white p-5 sm:grid-cols-3">
        <label className="text-xs font-bold">
          اسم المصدر / الحملة
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="مثال: قائمة القاهرة 2026" className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
        </label>
        <label className="text-xs font-bold">
          البلد الافتراضي
          <select value={defaultCountry} onChange={(e) => setDefaultCountry(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            <option value="EG">مصر (EG)</option>
            <option value="SA">السعودية (SA)</option>
            <option value="QA">قطر (QA)</option>
          </select>
        </label>
        <label className="text-xs font-bold">
          التصنيف الافتراضي
          <select value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
      </div>

      {/* CSV Import */}
      <section className="rounded-xl border border-black/10 bg-white p-5 space-y-4">
        <div>
          <h2 className="font-bold text-lg">استيراد CSV / Excel</h2>
          <p className="text-xs text-neutral-500 mt-1">
            الأعمدة (بالترتيب): <code className="bg-black/5 px-1 rounded">اسم المعرض, هاتف, واتساب, مدينة, تصنيف, براند, إيميل, عنوان</code>
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">يمكن الفصل بفاصلة أو TAB — السطر الأول يمكن أن يكون header</p>
        </div>

        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={10}
          placeholder={'معرض أوتو ون إيجيبت,01000000000,01000000000,القاهرة,showroom,مرسيدس,,\nمعرض النيل للسيارات,01111111111,,الجيزة,dealer,هيونداي,,'}
          className="w-full rounded-lg border border-black/15 bg-black/[.02] px-4 py-3 font-mono text-sm"
          dir="ltr"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleParse}
            disabled={!csv.trim()}
            className="rounded-lg border border-black/20 bg-white px-5 py-2 text-sm font-bold hover:bg-black/5 disabled:opacity-40"
          >
            معاينة البيانات
          </button>
          {parsed.length > 0 && (
            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={importing || validCount === 0}
              className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              {importing ? 'جاري الاستيراد...' : `استيراد ${validCount} معرض`}
            </button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="font-bold text-green-800">✅ اكتمل الاستيراد</p>
            <p className="text-sm text-green-700 mt-1">تم استيراد <strong>{result.imported}</strong> معرض · تخطي <strong>{result.skipped}</strong> مكرر</p>
            {result.errors.length > 0 && (
              <ul className="mt-2 text-xs text-red-700">
                {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            )}
          </div>
        )}
        {error && <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">❌ {error}</p>}

        {/* Preview table */}
        {parsed.length > 0 && (
          <div>
            <p className="text-sm font-bold mb-2">
              معاينة: <span className="text-green-700">{validCount} صحيح</span>
              {invalidCount > 0 && <span className="text-red-600 ml-2">{invalidCount} خطأ</span>}
            </p>
            <div className="overflow-x-auto rounded-lg border border-black/10">
              <table className="w-full text-xs">
                <thead className="bg-black/5">
                  <tr>
                    <th className="p-2 text-start">#</th>
                    <th className="p-2 text-start">الاسم</th>
                    <th className="p-2 text-start">هاتف</th>
                    <th className="p-2 text-start">مدينة</th>
                    <th className="p-2 text-start">تصنيف</th>
                    <th className="p-2 text-start">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 50).map((row, i) => (
                    <tr key={i} className={`border-t border-black/5 ${row.valid ? '' : 'bg-red-50'}`}>
                      <td className="p-2 opacity-40">{i + 1}</td>
                      <td className="p-2 font-medium">{row.name || <span className="text-red-500">فارغ</span>}</td>
                      <td className="p-2 font-mono opacity-70">{row.phones || row.whatsapp || '—'}</td>
                      <td className="p-2 opacity-70">{row.city || '—'}</td>
                      <td className="p-2 opacity-70">{row.category_key}</td>
                      <td className="p-2">{row.valid ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-600 text-xs">{row.error}</span>}</td>
                    </tr>
                  ))}
                  {parsed.length > 50 && (
                    <tr><td colSpan={6} className="p-2 text-center opacity-50">... و {parsed.length - 50} صف آخر</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Manual add */}
      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="font-bold text-lg mb-4">➕ إضافة معرض واحد يدوياً</h2>
        <form onSubmit={(e) => void handleManualAdd(e)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-bold">
            اسم المعرض <span className="text-red-500">*</span>
            <input required value={manualName} onChange={(e) => setManualName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" placeholder="معرض أوتو ون إيجيبت" />
          </label>
          <label className="text-xs font-bold">
            رقم الهاتف
            <input value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" dir="ltr" placeholder="01000000000" />
          </label>
          <label className="text-xs font-bold">
            واتساب
            <input value={manualWhatsapp} onChange={(e) => setManualWhatsapp(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" dir="ltr" placeholder="01000000000" />
          </label>
          <label className="text-xs font-bold">
            المدينة
            <input value={manualCity} onChange={(e) => setManualCity(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" placeholder="القاهرة" />
          </label>
          <label className="text-xs font-bold">
            التصنيف
            <select value={manualCategory} onChange={(e) => setManualCategory(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold">
            البراند / الماركة
            <input value={manualBrand} onChange={(e) => setManualBrand(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" placeholder="تويوتا، هيونداي، ..." />
          </label>
          <label className="text-xs font-bold">
            البريد الإلكتروني
            <input type="email" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" dir="ltr" placeholder="info@showroom.com" />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={manualSaving || !manualName.trim()} className="rounded-lg bg-neutral-900 px-6 py-2 text-sm font-bold text-white disabled:opacity-40">
              {manualSaving ? 'جاري الحفظ...' : 'إضافة المعرض'}
            </button>
          </div>
          {manualResult && <p className="sm:col-span-2 lg:col-span-3 text-sm font-medium">{manualResult}</p>}
        </form>
      </section>

      <div className="flex gap-3">
        <a href="/admin/platform/vendor-prospects" className="text-sm underline opacity-60 hover:opacity-100">← العودة لقائمة المتوقعين</a>
        <a href="/admin/platform/vendor-prospects/blast" className="rounded-lg bg-green-700 px-5 py-2 text-sm font-bold text-white hover:bg-green-800">📲 انتقل لمركز إرسال WhatsApp →</a>
      </div>
    </div>
  );
}
