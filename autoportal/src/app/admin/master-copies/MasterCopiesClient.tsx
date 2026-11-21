'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  isStandaloneCrmTierId,
  STANDALONE_FEATURES,
  type StandaloneCrmTierId,
  type StandaloneFeature,
  type StandaloneFeatureMap,
  type StandaloneFeatureOverrides,
} from '@/lib/standalone-license';

type Template = {
  id: string;
  name: string;
  description: string;
  features: StandaloneFeatureMap;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ClientCopy = {
  serial: string;
  companyName: string;
  phone: string;
  businessId: string | null;
  templateId: string;
  crmTier: StandaloneCrmTierId;
  templateName: string;
  featureOverrides: StandaloneFeatureOverrides;
  effectiveFeatures: StandaloneFeatureMap;
  status: 'pending_verification' | 'active' | 'suspended' | 'revoked';
  phoneVerifiedAt: string | null;
  packageVersion: string | null;
  lastSeenAt: string | null;
  followUpAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type LicenseEvent = {
  id: string;
  subjectType: 'template' | 'copy';
  subjectId: string;
  eventType: string;
  details: Record<string, unknown>;
  actorEmail: string;
  createdAt: string;
};

type MasterData = {
  features: StandaloneFeatureMap;
  templates: Template[];
  copies: ClientCopy[];
  events: LicenseEvent[];
};

const featureKeys = Object.keys(STANDALONE_FEATURES) as StandaloneFeature[];
const emptyTemplateFeatures = Object.fromEntries(featureKeys.map((key) => [key, true])) as StandaloneFeatureMap;

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleDateString();
}

function statusLabel(status: ClientCopy['status']) {
  return {
    pending_verification: 'بانتظار تحقق واتساب',
    active: 'مفعل',
    suspended: 'موقوف',
    revoked: 'ملغي',
  }[status];
}

function downloadCopyConfig(copy: ClientCopy, clientTrackingToken: string) {
  const config = {
    productName: 'Almostashar Auto',
    productNameAr: 'المستشار أوتو',
    companyName: copy.companyName,
    businessId: copy.businessId,
    licensee: copy.companyName,
    masterSenderPhone: copy.phone,
    masterEmail: 'autofyon@gmail.com',
    allowedDevices: 2,
    issueDate: copy.createdAt.slice(0, 10),
    version: copy.packageVersion || '2.7.0',
    crmTier: copy.crmTier,
    clientId: copy.serial,
    serial: copy.serial,
    status: copy.status,
    activationStatus: copy.status,
    clientTrackingToken,
    masterCopy: false,
    isLockedBranding: false,
    features: copy.effectiveFeatures,
  };
  const file = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${copy.serial}-license.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function MasterCopiesClient() {
  const [data, setData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateFeatures, setTemplateFeatures] = useState<StandaloneFeatureMap>(emptyTemplateFeatures);
  const [templateActive, setTemplateActive] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [copyTemplateId, setCopyTemplateId] = useState('');
  const [copyCrmTier, setCopyCrmTier] = useState<StandaloneCrmTierId>('growth');
  const [copyFollowUpAt, setCopyFollowUpAt] = useState('');
  const [copyNotes, setCopyNotes] = useState('');
  const [copyOverrides, setCopyOverrides] = useState<StandaloneFeatureOverrides>({});
  const [editingSerial, setEditingSerial] = useState('');
  const [copyStatus, setCopyStatus] = useState<ClientCopy['status']>('pending_verification');
  const [copyVersion, setCopyVersion] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await requestJson<MasterData>('/api/admin/master-copies'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر تحميل بيانات التراخيص');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function loadInitialData() {
      try {
        const result = await requestJson<MasterData>('/api/admin/master-copies');
        if (active) setData(result);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'تعذر تحميل بيانات التراخيص');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  function resetTemplateForm() {
    setEditingTemplateId('');
    setTemplateName('');
    setTemplateId('');
    setTemplateDescription('');
    setTemplateFeatures(emptyTemplateFeatures);
    setTemplateActive(true);
  }

  function editTemplate(template: Template) {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateId(template.id);
    setTemplateDescription(template.description);
    setTemplateFeatures(template.features);
    setTemplateActive(template.active);
  }

  function editCopy(copy: ClientCopy) {
    setEditingSerial(copy.serial);
    setCompanyName(copy.companyName);
    setPhone(copy.phone);
    setBusinessId(copy.businessId || '');
    setCopyTemplateId(copy.templateId);
    setCopyCrmTier(copy.crmTier);
    setCopyFollowUpAt(copy.followUpAt || '');
    setCopyNotes(copy.notes);
    setCopyOverrides(copy.featureOverrides);
    setCopyStatus(copy.status);
    setCopyVersion(copy.packageVersion || '');
  }

  async function submitTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (editingTemplateId) {
        await requestJson('/api/admin/master-copies', {
          method: 'PATCH',
          body: JSON.stringify({
            action: 'update_template',
            id: editingTemplateId,
            name: templateName,
            description: templateDescription,
            features: templateFeatures,
            active: templateActive,
          }),
        });
        setNotice('تم تحديث قالب المزايا');
      } else {
        await requestJson('/api/admin/master-copies', {
          method: 'POST',
          body: JSON.stringify({
            action: 'create_template',
            id: templateId,
            name: templateName,
            description: templateDescription,
            features: templateFeatures,
          }),
        });
        setNotice('تم إنشاء قالب المزايا');
      }
      resetTemplateForm();
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر حفظ القالب');
    } finally {
      setBusy(false);
    }
  }

  async function submitCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (editingSerial) {
        await requestJson('/api/admin/master-copies', {
          method: 'PATCH',
          body: JSON.stringify({
            action: 'update_copy',
            serial: editingSerial,
            companyName,
            phone,
            businessId: businessId.trim() || null,
            templateId: copyTemplateId,
            crmTier: copyCrmTier,
            featureOverrides: copyOverrides,
            status: copyStatus,
            followUpAt: copyFollowUpAt || null,
            notes: copyNotes,
            packageVersion: copyVersion,
          }),
        });
        setNotice(`تم تحديث نسخة ${editingSerial}`);
      } else {
        const result = await requestJson<{ serial: string }>('/api/admin/master-copies', {
          method: 'POST',
          body: JSON.stringify({
            action: 'create_copy',
            companyName,
            phone,
            businessId: businessId.trim() || null,
            templateId: copyTemplateId,
            crmTier: copyCrmTier,
            featureOverrides: copyOverrides,
            followUpAt: copyFollowUpAt || null,
            notes: copyNotes,
          }),
        });
        setNotice(`تم إنشاء سجل النسخة ${result.serial}؛ ستبقى معلقة حتى تحقق واتساب`);
      }
      setEditingSerial('');
      setCompanyName('');
      setPhone('');
      setBusinessId('');
      setCopyFollowUpAt('');
      setCopyCrmTier('growth');
      setCopyNotes('');
      setCopyOverrides({});
      setCopyStatus('pending_verification');
      setCopyVersion('');
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر حفظ نسخة العميل');
    } finally {
      setBusy(false);
    }
  }

  async function issueCopyConfig(copy: ClientCopy) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await requestJson<{ clientTrackingToken: string }>('/api/admin/master-copies', {
        method: 'POST',
        body: JSON.stringify({ action: 'issue_package_config', serial: copy.serial }),
      });
      downloadCopyConfig(copy, result.clientTrackingToken);
      setNotice(`تم إصدار إعدادات النسخة ${copy.serial}. احفظ الملف بأمان؛ إصدار إعدادات جديدة يبطل رمز التتبع السابق.`);
      await refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر إصدار إعدادات النسخة');
    } finally {
      setBusy(false);
    }
  }

  function setTemplateFeature(key: StandaloneFeature, enabled: boolean) {
    setTemplateFeatures((current) => ({ ...current, [key]: enabled }));
  }

  function setCopyFeatureOverride(key: StandaloneFeature, value: string) {
    setCopyOverrides((current) => {
      const next = { ...current };
      if (value === 'inherit') delete next[key];
      else next[key] = value === 'true';
      return next;
    });
  }

  const activeTemplates = data?.templates.filter((template) => template.active) ?? [];

  return (
    <div dir="rtl" className="space-y-6">
      <header className="space-y-2 border-b border-black/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Autofyon · Master Only</p>
        <h1 className="text-2xl font-bold">إدارة نسخ العملاء والتراخيص</h1>
        <p className="max-w-3xl text-sm opacity-70">
          أنشئ قوالب مزايا، خصص نسخة لكل معرض، وتابع الرقم التسلسلي والحالة والمتابعة وسجل التغييرات.
          هذه اللوحة لا تفعّل النسخة قبل تحقق رقم واتساب.
        </p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {notice && <div role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</div>}

      <section className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={submitTemplate} className="space-y-4 rounded-xl border border-black/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">{editingTemplateId ? 'تعديل قالب مزايا' : 'إنشاء قالب إصدار'}</h2>
            {editingTemplateId && <button type="button" className="text-xs underline" onClick={resetTemplateForm}>قالب جديد</button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>اسم القالب</span>
              <input required maxLength={80} value={templateName} onChange={(event) => setTemplateName(event.target.value)} className="w-full rounded-lg border p-2" />
            </label>
            <label className="space-y-1 text-sm">
              <span>المعرّف</span>
              <input required disabled={Boolean(editingTemplateId)} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={80} value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="w-full rounded-lg border p-2 disabled:opacity-50" />
            </label>
          </div>
          <label className="block space-y-1 text-sm">
            <span>وصف الاستخدام</span>
            <textarea maxLength={500} value={templateDescription} onChange={(event) => setTemplateDescription(event.target.value)} className="min-h-16 w-full rounded-lg border p-2" />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {featureKeys.map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={templateFeatures[key]} onChange={(event) => setTemplateFeature(key, event.target.checked)} />
                {STANDALONE_FEATURES[key]}
              </label>
            ))}
          </div>
          {editingTemplateId && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={templateActive} onChange={(event) => setTemplateActive(event.target.checked)} />
              القالب متاح لإنشاء نسخ جديدة
            </label>
          )}
          <button disabled={busy} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {editingTemplateId ? 'حفظ تعديلات القالب' : 'إنشاء القالب'}
          </button>
          <div className="grid gap-2 sm:grid-cols-2">
            {(data?.templates ?? []).map((template) => (
              <button key={template.id} type="button" onClick={() => editTemplate(template)} className="rounded-lg border p-3 text-right hover:bg-black/[.03]">
                <span className="block font-bold">{template.name} {!template.active && <span className="text-xs text-red-600">(متوقف)</span>}</span>
                <span className="block text-xs opacity-60">{template.id} · {Object.values(template.features).filter(Boolean).length} مزايا</span>
              </button>
            ))}
          </div>
        </form>

        <form onSubmit={submitCopy} className="space-y-4 rounded-xl border border-black/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">{editingSerial ? `تعديل النسخة ${editingSerial}` : 'تسجيل نسخة عميل'}</h2>
            {editingSerial && <button type="button" className="text-xs underline" onClick={() => { setEditingSerial(''); setCompanyName(''); setPhone(''); setBusinessId(''); setCopyCrmTier('growth'); setCopyTemplateId(''); }}>نسخة جديدة</button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>اسم الشركة</span>
              <input required maxLength={120} value={companyName} onChange={(event) => setCompanyName(event.target.value)} className="w-full rounded-lg border p-2" />
            </label>
            <label className="space-y-1 text-sm">
              <span>هاتف واتساب</span>
              <input required inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-lg border p-2" />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span>معرّف نشاط AutoFyon لربط البيانات (اختياري)</span>
              <input maxLength={100} value={businessId} onChange={(event) => setBusinessId(event.target.value)} className="w-full rounded-lg border p-2 font-mono" />
              <span className="block text-xs opacity-60">اتركه فارغاً للنسخة المستقلة فقط. الربط يتيح إرسال العمليات كمسودات مراجعة واستيراد المسودات المعتمدة.</span>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>قالب المزايا</span>
              <select required value={copyTemplateId} onChange={(event) => setCopyTemplateId(event.target.value)} className="w-full rounded-lg border p-2">
                <option value="">اختر قالباً</option>
                {activeTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>باقة CRM للنسخة المستقلة</span>
              <select value={copyCrmTier} onChange={(event) => { if (isStandaloneCrmTierId(event.target.value)) setCopyCrmTier(event.target.value); }} className="w-full rounded-lg border p-2">
                <option value="growth">Growth — CRM أساسي</option>
                <option value="pro">Pro — CRM متقدم</option>
                <option value="enterprise">Enterprise — CRM مؤسسي</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>موعد المتابعة</span>
              <input type="date" value={copyFollowUpAt} onChange={(event) => setCopyFollowUpAt(event.target.value)} className="w-full rounded-lg border p-2" />
            </label>
          </div>
          {editingSerial && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span>الحالة</span>
                  <select value={copyStatus} onChange={(event) => setCopyStatus(event.target.value as ClientCopy['status'])} className="w-full rounded-lg border p-2">
                    <option value="pending_verification">بانتظار تحقق واتساب</option>
                    <option value="active" disabled={!data?.copies.find((copy) => copy.serial === editingSerial)?.phoneVerifiedAt}>مفعل (يتطلب تحققاً)</option>
                    <option value="suspended">موقوف</option>
                    <option value="revoked">ملغي نهائياً</option>
                  </select>
                </label>
                <label className="space-y-1 text-sm">
                  <span>إصدار البرنامج</span>
                  <input maxLength={40} value={copyVersion} onChange={(event) => setCopyVersion(event.target.value)} className="w-full rounded-lg border p-2" />
                </label>
              </div>
              <fieldset className="space-y-2 rounded-lg border p-3">
                <legend className="px-1 text-sm font-bold">تخصيص مزايا هذه النسخة</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {featureKeys.map((key) => (
                    <label key={key} className="flex items-center justify-between gap-2 text-xs">
                      <span>{STANDALONE_FEATURES[key]}</span>
                      <select value={copyOverrides[key] === undefined ? 'inherit' : String(copyOverrides[key])} onChange={(event) => setCopyFeatureOverride(key, event.target.value)} className="rounded border p-1">
                        <option value="inherit">من القالب</option>
                        <option value="true">مفعلة</option>
                        <option value="false">متوقفة</option>
                      </select>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}
          <label className="block space-y-1 text-sm">
            <span>ملاحظات المتابعة</span>
            <textarea maxLength={2000} value={copyNotes} onChange={(event) => setCopyNotes(event.target.value)} className="min-h-16 w-full rounded-lg border p-2" />
          </label>
          <button disabled={busy || !activeTemplates.length} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {editingSerial ? 'حفظ تغييرات النسخة' : 'إنشاء سجل ورقم تسلسلي'}
          </button>
          {!editingSerial && <p className="text-xs text-amber-800">يُنشأ السجل بحالة معلقة. إصدار تفعيل فعلي متوقف إلى أن تتوفر خدمة تحقق واتساب.</p>}
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">نسخ العملاء والمتابعة</h2>
          <button onClick={() => void refresh()} disabled={loading} className="text-sm underline disabled:opacity-50">تحديث</button>
        </div>
        {loading ? <p className="text-sm opacity-60">جاري التحميل…</p> : (
          <div className="overflow-x-auto rounded-xl border border-black/10">
            <table className="w-full min-w-[1120px] text-right text-sm">
              <thead className="bg-black/[.04]">
                <tr>{['الرقم التسلسلي','الشركة','واتساب','معرّف AutoFyon','القالب','باقة CRM','الحالة','المتابعة','آخر اتصال','إجراء'].map((title) => <th key={title} className="p-3">{title}</th>)}</tr>
              </thead>
              <tbody>
                {data?.copies.map((copy) => (
                  <tr key={copy.serial} className="border-t border-black/10">
                    <td className="p-3 font-mono text-xs">{copy.serial}</td>
                    <td className="p-3">{copy.companyName}</td>
                    <td className="p-3" dir="ltr">{copy.phone}</td>
                    <td className="p-3 font-mono text-xs">{copy.businessId || 'غير مربوط'}</td>
                    <td className="p-3">{copy.templateName}</td>
                    <td className="p-3">{copy.crmTier.toUpperCase()}</td>
                    <td className="p-3">{statusLabel(copy.status)}</td>
                    <td className="p-3">{formatDate(copy.followUpAt)}</td>
                    <td className="p-3">{formatDate(copy.lastSeenAt)}</td>
                    <td className="flex gap-3 p-3">
                      <button onClick={() => editCopy(copy)} className="text-blue-700 underline">إدارة</button>
                      <button disabled={busy || copy.status === 'suspended' || copy.status === 'revoked'} onClick={() => void issueCopyConfig(copy)} className="text-emerald-700 underline disabled:opacity-50">إصدار إعدادات الحزمة</button>
                    </td>
                  </tr>
                ))}
                {!data?.copies.length && <tr><td colSpan={10} className="p-6 text-center opacity-60">لا توجد نسخ مسجلة بعد.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">سجل التغييرات والمتابعة</h2>
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full min-w-[700px] text-right text-sm">
            <thead className="bg-black/[.04]"><tr>{['التاريخ','النوع','الرقم / القالب','الحدث','المنفذ'].map((title) => <th key={title} className="p-3">{title}</th>)}</tr></thead>
            <tbody>
              {data?.events.map((event) => (
                <tr key={event.id} className="border-t border-black/10">
                  <td className="p-3">{formatDate(event.createdAt)}</td>
                  <td className="p-3">{event.subjectType === 'copy' ? 'نسخة' : 'قالب'}</td>
                  <td className="p-3 font-mono text-xs">{event.subjectId}</td>
                  <td className="p-3">{event.eventType}</td>
                  <td className="p-3">{event.actorEmail}</td>
                </tr>
              ))}
              {!data?.events.length && <tr><td colSpan={5} className="p-6 text-center opacity-60">لا يوجد سجل بعد.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
