'use client';

import { useState } from 'react';

export interface VendorOnboardingRow {
  id: string;
  status: string;
  prospect_name: string;
  authorized_phone: string;
  campaign_ref: string;
  expires_at: number;
  created_at: string;
  submitted_at: string | null;
  decision_note: string;
  business_id: string | null;
  company_name: string | null;
  company_name_ar: string | null;
  type_id: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  slug: string | null;
  tagline: string | null;
  description: string | null;
  publish_consent: number | null;
  phone_consent: number | null;
  whatsapp_consent: number | null;
  email_consent: number | null;
}

const STATUS_LABELS: Record<string, string> = {
  invited: 'دعوة مرسلة',
  verified: 'تم التحقق من الهاتف',
  changes_requested: 'مطلوب استكمال تعديلات',
  submitted: 'بانتظار مراجعة الإدارة',
  approved: 'معتمد ومنشور',
  rejected: 'مرفوض',
  revoked: 'ملغي',
  expired: 'منتهي الصلاحية',
};

function consentLabel(value: number | null, label: string) {
  return <li key={label} className={value === 1 ? 'text-emerald-800' : 'text-neutral-500'}>{value === 1 ? '✓' : '—'} {label}</li>;
}

export default function VendorOnboardingQueue({ initialRows }: { initialRows: VendorOnboardingRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function review(row: VendorOnboardingRow, action: 'approve' | 'request_changes' | 'reject' | 'revoke') {
    setBusyId(row.id);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/admin/vendor-onboarding/${encodeURIComponent(row.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: notes[row.id] || '' }),
      });
      const data = await response.json() as { error?: string; status?: string };
      if (!response.ok) throw new Error(data.error || 'تعذر تحديث الطلب');
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: data.status || item.status, decision_note: notes[row.id] || '' } : item));
      setMessage(action === 'approve' ? 'تم اعتماد الصفحة ونشرها.' : action === 'request_changes' ? 'تم طلب استكمال التعديلات.' : action === 'reject' ? 'تم رفض الطلب.' : 'تم إلغاء الدعوة.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحديث الطلب');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {!rows.length && <div className="rounded-xl border border-dashed border-black/20 bg-white p-10 text-center text-sm text-neutral-500">لا توجد دعوات أو طلبات تسجيل حتى الآن.</div>}

      {rows.map((row) => (
        <article key={row.id} className="space-y-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-500">سجل CRM: {row.prospect_name}</p>
              <h2 className="mt-1 text-lg font-bold">{row.company_name_ar || row.company_name || row.prospect_name}</h2>
              {row.company_name && row.company_name_ar && <p className="text-sm text-neutral-500" dir="ltr">{row.company_name}</p>}
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">{STATUS_LABELS[row.status] || row.status}</span>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p><strong>رقم الدعوة المعتمد:</strong> <bdi dir="ltr" className="font-mono">{row.authorized_phone}</bdi></p>
            <p><strong>المدينة:</strong> {row.city || '—'}</p>
            <p><strong>التصنيف:</strong> {row.type_id || '—'}</p>
            <p><strong>الحملة:</strong> {row.campaign_ref || '—'}</p>
            <p><strong>الرابط المقترح:</strong> <bdi dir="ltr">/p/{row.slug || '—'}</bdi></p>
            <p><strong>البريد:</strong> {row.email || '—'}</p>
            <p><strong>تاريخ الدعوة:</strong> {new Date(row.created_at).toLocaleString('ar-EG')}</p>
            <p><strong>طلب التسجيل:</strong> {row.submitted_at ? new Date(row.submitted_at).toLocaleString('ar-EG') : 'لم يُرسل بعد'}</p>
          </div>

          {row.address && <p className="text-sm"><strong>العنوان:</strong> {row.address}</p>}
          {row.tagline && <p className="text-sm"><strong>النبذة:</strong> {row.tagline}</p>}
          {row.description && <p className="whitespace-pre-wrap text-sm text-neutral-600">{row.description}</p>}

          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold">
            {consentLabel(row.publish_consent, 'موافقة نشر الصفحة والدليل')}
            {consentLabel(row.phone_consent, 'إظهار الهاتف')}
            {consentLabel(row.whatsapp_consent, 'إظهار واتساب')}
            {consentLabel(row.email_consent, 'إظهار البريد')}
          </ul>

          {row.decision_note && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>ملاحظة الإدارة:</strong> {row.decision_note}</p>}
          <label className="block text-xs font-bold">ملاحظة أو طلب تعديل
            <textarea
              rows={2}
              maxLength={500}
              value={notes[row.id] ?? ''}
              onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm font-normal"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {row.status === 'submitted' && (
              <>
                <button disabled={busyId === row.id} onClick={() => void review(row, 'approve')} className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">اعتماد ونشر</button>
                <button disabled={busyId === row.id} onClick={() => void review(row, 'request_changes')} className="rounded-lg border border-amber-700/30 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 disabled:opacity-50">طلب تعديلات</button>
                <button disabled={busyId === row.id} onClick={() => void review(row, 'reject')} className="rounded-lg border border-red-700/30 bg-red-50 px-4 py-2 text-xs font-bold text-red-800 disabled:opacity-50">رفض الطلب</button>
              </>
            )}
            {['invited', 'verified', 'changes_requested'].includes(row.status) && (
              <button disabled={busyId === row.id} onClick={() => void review(row, 'revoke')} className="rounded-lg border border-red-700/30 px-4 py-2 text-xs font-bold text-red-800 disabled:opacity-50">إلغاء الدعوة</button>
            )}
            {row.status === 'approved' && row.slug && <a href={`/p/${encodeURIComponent(row.slug)}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-black px-4 py-2 text-xs font-bold text-white">فتح الصفحة المنشورة ↗</a>}
          </div>
        </article>
      ))}
    </div>
  );
}
