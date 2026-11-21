'use client';

import { useCallback, useEffect, useState } from 'react';

type AccountingDraft = {
  id: string;
  sourceSerial: string;
  sourceRecordId: string;
  type: 'sale' | 'purchase';
  occurredAt: string;
  amount: number;
  payload: {
    description: string;
    details: { reference: string; vehicle: string; chassis: string; terms: string };
    counterparty: { name: string; phone: string };
    journalEntries: Array<{
      sourceEntryId: string;
      date: string;
      description: string;
      debitAccount: string;
      creditAccount: string;
      amount: number;
    }>;
  };
  createdAt: string;
};

function formatAmount(value: number) {
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(value);
}

export default function AccountingDraftsClient({ businessId }: { businessId: string }) {
  const [drafts, setDrafts] = useState<AccountingDraft[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loadedBusinessId, setLoadedBusinessId] = useState('');
  const loading = loadedBusinessId !== businessId;
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    const response = await fetch(
      `/api/admin/showroom/${encodeURIComponent(businessId)}/accounting-drafts`,
      { cache: 'no-store' },
    );
    const result = await response.json() as { drafts?: AccountingDraft[]; error?: string };
    if (!response.ok || !Array.isArray(result.drafts)) {
      throw new Error(result.error || 'تعذر تحميل مسودات المحاسبة.');
    }
    return result.drafts;
  }, [businessId]);

  useEffect(() => {
    let active = true;
    load()
      .then((items) => {
        if (active) {
          setDrafts(items);
          setLoadedBusinessId(businessId);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'تعذر تحميل مسودات المحاسبة.');
          setLoadedBusinessId(businessId);
        }
      });
    return () => { active = false; };
  }, [businessId, load]);

  async function review(draftId: string, status: 'approved' | 'rejected') {
    setBusyId(draftId);
    setError('');
    setNotice('');
    try {
      const response = await fetch(
        `/api/admin/showroom/${encodeURIComponent(businessId)}/accounting-drafts`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId, status, reviewNote: notes[draftId] || '' }),
        },
      );
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ قرار المراجعة.');
      setNotice(status === 'approved'
        ? 'اعتُمدت المسودة؛ ستصبح متاحة للاستيراد في نسخة ERP مرتبطة أخرى.'
        : 'تم رفض المسودة؛ لن تُرسل إلى الأستاذ العام.');
      setDrafts(await load());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ قرار المراجعة.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="space-y-4" dir="rtl">
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}
      <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
        اعتماد المسودة لا يرحّلها في هذا الموقع؛ يسمح لنسخة ERP أخرى مرتبطة بالنشاط باستيرادها بعد مراجعتها محلياً.
      </p>
      {loading ? <p className="text-sm opacity-60">جاري التحميل…</p> : null}
      {!loading && !drafts.length ? (
        <p className="rounded-xl border border-black/10 bg-white p-5 text-sm opacity-70">لا توجد مسودات بانتظار المراجعة.</p>
      ) : null}
      {!loading ? drafts.map((draft) => (
        <article key={draft.id} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-bold">{draft.type === 'sale' ? 'عملية بيع' : 'عملية شراء'} · {draft.payload.description}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                الطرف: {draft.payload.counterparty.name}
                {draft.payload.counterparty.phone ? ` · ${draft.payload.counterparty.phone}` : ''}
                {' · '}{draft.occurredAt}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                مرجع: {draft.payload.details.reference || '—'} · المركبة: {draft.payload.details.vehicle || '—'}
                {draft.payload.details.chassis ? ` · الشاسيه: ${draft.payload.details.chassis}` : ''}
              </p>
              <p className="mt-1 text-xs text-neutral-500">{draft.payload.details.terms}</p>
              <p className="mt-1 font-mono text-xs text-neutral-500">
                {draft.sourceSerial} · {draft.sourceRecordId}
              </p>
            </div>
            <strong>{formatAmount(draft.amount)}</strong>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-right text-xs">
              <thead><tr className="border-b"><th className="p-2">البيان</th><th className="p-2">مدين</th><th className="p-2">دائن</th><th className="p-2">المبلغ</th></tr></thead>
              <tbody>
                {draft.payload.journalEntries.map((entry) => (
                  <tr key={entry.sourceEntryId} className="border-b border-black/5">
                    <td className="p-2">{entry.description}</td>
                    <td className="p-2">{entry.debitAccount}</td>
                    <td className="p-2">{entry.creditAccount}</td>
                    <td className="p-2">{formatAmount(entry.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className="block space-y-1 text-sm">
            <span>ملاحظة المراجعة (اختيارية)</span>
            <input
              maxLength={500}
              value={notes[draft.id] || ''}
              onChange={(event) => setNotes((current) => ({ ...current, [draft.id]: event.target.value }))}
              className="w-full rounded-lg border p-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              disabled={Boolean(busyId)}
              onClick={() => void review(draft.id, 'approved')}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              اعتماد للمزامنة
            </button>
            <button
              disabled={Boolean(busyId)}
              onClick={() => void review(draft.id, 'rejected')}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
            >
              رفض
            </button>
          </div>
        </article>
      )) : null}
    </div>
  );
}
