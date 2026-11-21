'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface VendorReferralRow {
  id: string;
  status: string;
  prospect_id: string;
  source_invite_id: string;
  submitted_name: string;
  submitted_phone: string;
  submitted_city: string;
  submitted_contact_name: string;
  submitted_email: string;
  created_at: string;
  referrer_name: string;
  crm_name: string;
  review_note: string;
}

export default function VendorReferralQueue({ initialRows }: { initialRows: VendorReferralRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function review(row: VendorReferralRow, action: 'approve' | 'reject') {
    setBusyId(row.id);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/admin/vendor-referrals/${encodeURIComponent(row.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: notes[row.id] || '' }),
      });
      const data = await response.json() as { error?: string; status?: string };
      if (!response.ok) throw new Error(data.error || 'تعذر تحديث الإحالة');
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: data.status || item.status, review_note: notes[row.id] || '' } : item));
      setMessage(action === 'approve' ? 'تم اعتماد العميل المحتمل. أنشئوا له دعوة مباشرة من CRM.' : 'تم رفض الإحالة.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحديث الإحالة');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {!rows.length && <div className="rounded-xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-neutral-500">لا توجد إحالات جديدة للمراجعة.</div>}

      {rows.map((row) => (
        <article key={row.id} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-500">المعرض المُحيل: {row.referrer_name}</p>
              <h3 className="mt-1 font-bold">{row.submitted_name}</h3>
              {row.crm_name !== row.submitted_name && <p className="text-xs text-neutral-500">اسم السجل الموجود في CRM: {row.crm_name}</p>}
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
              {row.status === 'pending_review' ? 'بانتظار اعتماد الرقم' : row.status === 'approved' ? 'معتمد للدعوة' : row.status === 'invited' ? 'تم إنشاء دعوة' : row.status === 'converted' ? 'أكمل التسجيل' : 'مرفوض'}
            </span>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p><strong>واتساب:</strong> <bdi dir="ltr" className="font-mono">{row.submitted_phone}</bdi></p>
            <p><strong>المدينة:</strong> {row.submitted_city || '—'}</p>
            <p><strong>مسؤول التواصل:</strong> {row.submitted_contact_name || '—'}</p>
            <p><strong>البريد:</strong> {row.submitted_email || '—'}</p>
            <p><strong>الموافقة على التواصل:</strong> نعم</p>
            <p><strong>تاريخ الإحالة:</strong> <bdi dir="ltr">{row.created_at}</bdi></p>
          </div>
          {row.review_note && <p className="rounded bg-neutral-50 p-2 text-xs">{row.review_note}</p>}
          {row.status === 'pending_review' && (
            <>
              <label className="block text-xs font-bold">ملاحظة داخلية
                <input maxLength={500} value={notes[row.id] ?? ''} onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm font-normal" />
              </label>
              <div className="flex flex-wrap gap-2">
                <button disabled={busyId === row.id} onClick={() => void review(row, 'approve')} className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">اعتماد الرقم للمتابعة</button>
                <button disabled={busyId === row.id} onClick={() => void review(row, 'reject')} className="rounded-lg border border-red-700/30 bg-red-50 px-4 py-2 text-xs font-bold text-red-800 disabled:opacity-50">رفض الإحالة</button>
              </div>
            </>
          )}
          {row.status === 'approved' && (
            <Link href={`/admin/platform/vendor-prospects/blast?lead=${encodeURIComponent(row.prospect_id)}`} className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white">
              إنشاء دعوة مباشرة لهذا المعرض ↗
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
