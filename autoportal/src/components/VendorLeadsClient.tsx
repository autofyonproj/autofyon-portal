'use client';

import { useEffect, useMemo, useState } from 'react';
import type { VendorLeadStatus } from '@/lib/vendor-leads';
import VendorLeadDocuments from '@/components/VendorLeadDocuments';

type Activity = {
  id: string;
  activity_type: string;
  summary: string;
  created_at: string;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  inquiry_for: string;
  source: string;
  source_path: string;
  status: VendorLeadStatus;
  next_follow_up_at: string | null;
  notes: string;
  created_at: string;
  activities: Activity[];
};

type Connection = {
  connected: boolean;
  canWrite: boolean;
  canConnectStandalone: boolean;
  tokenHint: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
};

const STAGES: Array<{ value: VendorLeadStatus; label: string }> = [
  { value: 'new', label: 'جديد' },
  { value: 'contacted', label: 'تم التواصل' },
  { value: 'qualified', label: 'مؤهل' },
  { value: 'visit_or_quote', label: 'زيارة / عرض سعر' },
  { value: 'won', label: 'ناجح' },
  { value: 'lost', label: 'مفقود' },
];

function formatDate(value: string | null): string {
  if (!value) return 'غير محدد';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString();
}

export default function VendorLeadsClient({
  businessId,
  canManageConnection,
  canReviewAccounting,
}: {
  businessId: string;
  canManageConnection: boolean;
  canReviewAccounting: boolean;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [stageFilter, setStageFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pendingToken, setPendingToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setError('');
    const [leadResponse, connectionResponse] = await Promise.all([
      fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/leads`, { cache: 'no-store' }),
      fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/lead-connection`, { cache: 'no-store' }),
    ]);
    const leadData = await leadResponse.json() as { leads?: Lead[]; error?: string };
    const connectionData = await connectionResponse.json() as Connection & { error?: string };
    if (!leadResponse.ok || !leadData.leads) throw new Error(leadData.error || 'تعذر تحميل العملاء المحتملين.');
    if (!connectionResponse.ok) throw new Error(connectionData.error || 'تعذر تحميل حالة الربط.');
    setLeads(leadData.leads);
    setConnection(connectionData);
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/leads`, { cache: 'no-store' }),
      fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/lead-connection`, { cache: 'no-store' }),
    ])
      .then(async ([leadResponse, connectionResponse]) => {
        const leadData = await leadResponse.json() as { leads?: Lead[]; error?: string };
        const connectionData = await connectionResponse.json() as Connection & { error?: string };
        if (!leadResponse.ok || !leadData.leads) throw new Error(leadData.error || 'تعذر تحميل العملاء المحتملين.');
        if (!connectionResponse.ok) throw new Error(connectionData.error || 'تعذر تحميل حالة الربط.');
        if (active) {
          setLeads(leadData.leads);
          setConnection(connectionData);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'تعذر تحميل العملاء المحتملين.');
      });
    return () => { active = false; };
  }, [businessId]);

  const visibleLeads = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return leads.filter((lead) => {
      const matchesStage = !stageFilter || lead.status === stageFilter;
      const haystack = `${lead.name} ${lead.phone} ${lead.email} ${lead.inquiry_for} ${lead.inquiry}`.toLocaleLowerCase();
      return matchesStage && (!needle || haystack.includes(needle));
    });
  }, [leads, search, stageFilter]);

  const today = new Date().toISOString().slice(0, 10);
  const openCount = leads.filter((lead) => lead.status !== 'won' && lead.status !== 'lost').length;
  const dueCount = leads.filter((lead) => lead.status !== 'won' && lead.status !== 'lost'
    && lead.next_follow_up_at && lead.next_follow_up_at.slice(0, 10) <= today).length;

  async function saveLead(lead: Lead, form: HTMLFormElement) {
    const data = new FormData(form);
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/leads`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          status: data.get('status'),
          nextFollowUpAt: data.get('nextFollowUpAt'),
          notes: data.get('notes'),
          activity: data.get('activity'),
          activityType: data.get('activityType'),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ المتابعة.');
      await load();
      setNotice('تم حفظ بيانات المتابعة.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ المتابعة.');
    } finally {
      setBusy(false);
    }
  }

  async function createConnection() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/lead-connection`, { method: 'POST' });
      const result = await response.json() as { token?: string; error?: string };
      if (!response.ok || !result.token) throw new Error(result.error || 'تعذر إنشاء رمز الربط.');
      setPendingToken(result.token);
      setNotice('انسخ الرمز الآن إلى برنامج ERP. لن يظهر مرة أخرى.');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إنشاء رمز الربط.');
    } finally {
      setBusy(false);
    }
  }

  async function revokeConnection() {
    if (!window.confirm('هل تريد إيقاف ربط برنامج ERP؟')) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/showroom/${encodeURIComponent(businessId)}/lead-connection`, { method: 'DELETE' });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر إيقاف الربط.');
      setPendingToken('');
      await load();
      setNotice('تم إيقاف الربط. العملاء المستوردون سابقاً يظلون في ERP.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إيقاف الربط.');
    } finally {
      setBusy(false);
    }
  }

  async function copyToken() {
    try {
      await navigator.clipboard.writeText(pendingToken);
      setNotice('تم نسخ الرمز. الصقه في إعدادات CRM داخل ERP.');
    } catch {
      setError('تعذر النسخ تلقائياً؛ حدد الرمز وانسخه يدوياً.');
    }
  }

  return (
    <div className="space-y-5" dir="rtl">
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-black/10 bg-white p-4"><p className="text-xs opacity-60">كل استفسارات الصفحة</p><p className="mt-1 text-2xl font-bold">{leads.length}</p></article>
        <article className="rounded-xl border border-black/10 bg-white p-4"><p className="text-xs opacity-60">قيد المتابعة</p><p className="mt-1 text-2xl font-bold">{openCount}</p></article>
        <article className="rounded-xl border border-amber-700/20 bg-amber-50 p-4"><p className="text-xs opacity-60">متابعات مستحقة</p><p className="mt-1 text-2xl font-bold">{dueCount}</p></article>
      </section>

      <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <div>
          <h2 className="font-bold">ربط اختياري مع برنامج ERP المستقل</h2>
          <p className="mt-1 text-sm text-neutral-600">
            تتم مزامنة استفسارات الصفحة المرتبطة وتحديثاتها بين النظامين. العملاء الذين أُنشئوا داخل ERP فقط لا يُنشأ لهم سجل في AUTOFYON.
          </p>
        </div>
        <p className="text-xs text-neutral-500">
          {connection?.canConnectStandalone === false
            ? 'باقة Free تشمل CRM المرتبط بصفحتك فقط؛ مزامنة ERP المستقل متاحة في Growth وPro وEnterprise.'
            : connection?.connected
            ? `الربط نشط (${connection.canWrite ? 'مزامنة تحديثات في الاتجاهين' : 'استيراد فقط؛ أعد إصدار الرمز لتفعيل التحديثات'}) · آخر أحرف الرمز: ${connection.tokenHint} · آخر مزامنة: ${formatDate(connection.lastUsedAt)}`
            : 'لا يوجد ربط نشط. يعمل صندوق CRM المرتبط بصفحتك دون الحاجة إلى ERP.'}
        </p>
        {pendingToken ? (
          <div className="space-y-2 rounded-lg bg-neutral-50 p-3">
            <label htmlFor="erp-connection-token" className="text-xs font-bold">رمز سري — انسخه الآن إلى ERP</label>
            <input id="erp-connection-token" readOnly value={pendingToken} dir="ltr" className="w-full rounded border border-black/15 bg-white p-2 font-mono text-xs" onFocus={(event) => event.currentTarget.select()} />
            <button type="button" onClick={() => void copyToken()} className="rounded-lg border border-black/15 px-3 py-2 text-sm">نسخ الرمز</button>
          </div>
        ) : null}
        {canManageConnection ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy || connection?.canConnectStandalone === false} onClick={() => void createConnection()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              {connection?.connected ? 'إعادة إصدار الرمز' : 'إنشاء رمز ربط'}
            </button>
            {connection?.connected ? (
              <button type="button" disabled={busy} onClick={() => void revokeConnection()} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50">
                إيقاف الربط
              </button>
            ) : null}
          </div>
        ) : <p className="text-xs text-neutral-500">يمكن لمالك النشاط إدارة رمز ربط ERP.</p>}
        {canManageConnection ? <p className="text-xs text-neutral-500">الرمز يتيح مزامنة محدودة للحقول المسموح بها في سجلات الصفحة المرتبطة، ويُعرض مرة واحدة. إعادة الإصدار تبطل الرمز السابق.</p> : null}
      </section>

      {canReviewAccounting ? (
        <a
          href={`/admin/showroom/${encodeURIComponent(businessId)}/accounting-drafts`}
          className="block rounded-xl border border-amber-700/20 bg-amber-50 p-4 text-sm font-bold text-amber-950 hover:bg-amber-100"
        >
          مراجعة مسودات المحاسبة الواردة من نسخ ERP المرتبطة
        </a>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو الهاتف أو الاستفسار" className="rounded-lg border border-black/15 bg-white p-2 text-sm" />
        <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="rounded-lg border border-black/15 bg-white p-2 text-sm">
          <option value="">كل المراحل</option>
          {STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
        </select>
      </section>

      <section className="space-y-3">
        {visibleLeads.map((lead) => (
          <article key={lead.id} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{lead.name}</h2>
                <p className="text-sm" dir="ltr">{lead.phone}{lead.email ? ` · ${lead.email}` : ''}</p>
                <p className="text-xs text-neutral-500">وصل {formatDate(lead.created_at)} · المصدر: {lead.source}</p>
              </div>
              {lead.inquiry_for ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{lead.inquiry_for}</span> : null}
            </header>
            <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm">{lead.inquiry}</p>
            {lead.source_path ? <p className="text-xs text-neutral-500">صفحة المصدر: {lead.source_path}</p> : null}
            <VendorLeadDocuments businessId={businessId} leadId={lead.id} />
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void saveLead(lead, event.currentTarget);
              }}
            >
              <label className="grid gap-1 text-xs font-semibold">المرحلة
                <select name="status" defaultValue={lead.status} className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal">
                  {STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-semibold">المتابعة القادمة
                <input name="nextFollowUpAt" type="date" defaultValue={lead.next_follow_up_at?.slice(0, 10) || ''} className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal" />
              </label>
              <label className="grid gap-1 text-xs font-semibold sm:col-span-2">ملاحظات داخلية
                <textarea name="notes" defaultValue={lead.notes} maxLength={2000} rows={2} className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal" />
              </label>
              <label className="grid gap-1 text-xs font-semibold">نوع النشاط
                <select name="activityType" defaultValue="follow_up" className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal">
                  <option value="follow_up">متابعة</option><option value="call">اتصال</option><option value="whatsapp">واتساب</option><option value="email">بريد إلكتروني</option><option value="meeting">اجتماع / زيارة</option><option value="note">ملاحظة</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs font-semibold">نتيجة النشاط (اختياري)
                <input name="activity" maxLength={500} className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal" />
              </label>
              <button type="submit" disabled={busy} className="w-fit rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">حفظ المتابعة</button>
            </form>
            {lead.activities.length ? (
              <details>
                <summary className="cursor-pointer text-xs font-bold">سجل الأنشطة ({lead.activities.length})</summary>
                <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                  {lead.activities.map((activity) => (
                    <li key={activity.id}>{formatDate(activity.created_at)} · {activity.activity_type} · {activity.summary}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </article>
        ))}
        {!visibleLeads.length ? <p className="rounded-xl border border-dashed border-black/20 p-6 text-center text-sm text-neutral-500">لا توجد استفسارات مطابقة بعد.</p> : null}
      </section>
    </div>
  );
}
