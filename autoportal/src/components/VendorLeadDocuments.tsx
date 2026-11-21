'use client';

import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { combineScannedImages } from '@/lib/scanned-document-pdf';

type DocumentCategory = 'identity' | 'vehicle' | 'contract' | 'finance' | 'other';
type LeadDocument = {
  id: string;
  category: DocumentCategory;
  file_name: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
};

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  identity: 'هوية العميل',
  vehicle: 'مستندات المركبة',
  contract: 'عقد',
  finance: 'تمويل / موافقة',
  other: 'مستند آخر',
};
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

export default function VendorLeadDocuments({
  businessId,
  leadId,
}: {
  businessId: string;
  leadId: string;
}) {
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [category, setCategory] = useState<DocumentCategory>('identity');
  const [scanPages, setScanPages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const endpoint = `/api/admin/showroom/${encodeURIComponent(businessId)}/leads/${encodeURIComponent(leadId)}/documents`;

  async function loadDocuments() {
    setError('');
    const response = await fetch(endpoint, { cache: 'no-store' });
    const result = await response.json() as { documents?: LeadDocument[]; error?: string };
    if (!response.ok || !result.documents) throw new Error(result.error || 'تعذر تحميل مستندات العميل.');
    setDocuments(result.documents);
    setLoaded(true);
  }

  async function openDocuments(event: SyntheticEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.open || loaded) return;
    try {
      await loadDocuments();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحميل مستندات العميل.');
    }
  }

  async function uploadFiles(files: File[]): Promise<boolean> {
    if (!files.length) return false;
    const invalid = files.find((file) => !ACCEPTED_TYPES.has(file.type) || file.size < 1 || file.size > MAX_FILE_BYTES);
    if (invalid) {
      setError(`${invalid.name}: اختر PDF أو JPEG أو PNG أو WebP بحجم لا يتجاوز 15 ميجابايت.`);
      return false;
    }
    setBusy(true);
    setError('');
    setNotice('');
    let uploaded = 0;
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('file', file, file.name);
        form.append('category', category);
        const response = await fetch(endpoint, { method: 'POST', body: form });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || 'تعذر حفظ المستند.');
        uploaded++;
      }
      await loadDocuments();
      setNotice(`تم حفظ ${uploaded} مستند${uploaded === 1 ? '' : 'ات'} في تخزين خاص بهذا النشاط.`);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ المستند.');
      if (uploaded) {
        try {
          await loadDocuments();
        } catch (refreshError) {
          setError(refreshError instanceof Error ? refreshError.message : 'تم رفع بعض الملفات لكن تعذر تحديث القائمة.');
        }
      }
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    await uploadFiles(files);
  }

  function addScanPages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    const combined = [...scanPages, ...files];
    if (combined.length > 20 || files.some((file) =>
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > MAX_FILE_BYTES)) {
      setError('اختر حتى 20 صورة صفحات، بحجم لا يتجاوز 15 ميجابايت لكل صفحة.');
      return;
    }
    setError('');
    setScanPages(combined);
  }

  async function finishScan() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const pdf = await combineScannedImages(scanPages);
      if (await uploadFiles([pdf])) setScanPages([]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إنشاء ملف المسح.');
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(document: LeadDocument) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(
        `/api/admin/showroom/${encodeURIComponent(businessId)}/lead-documents/${encodeURIComponent(document.id)}`,
        { cache: 'no-store' },
      );
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error || 'تعذر تنزيل المستند.');
      }
      const url = URL.createObjectURL(await response.blob());
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.file_name;
      link.rel = 'noopener';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تنزيل المستند.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteDocument(document: LeadDocument) {
    if (!window.confirm(`حذف المستند "${document.file_name}" نهائياً؟`)) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(
        `/api/admin/showroom/${encodeURIComponent(businessId)}/lead-documents/${encodeURIComponent(document.id)}`,
        { method: 'DELETE' },
      );
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر حذف المستند.');
      await loadDocuments();
      setNotice('تم حذف المستند من التخزين الخاص.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حذف المستند.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="rounded-lg border border-black/10 p-3" onToggle={(event) => void openDocuments(event)}>
      <summary className="cursor-pointer text-sm font-bold">المستندات الخاصة (هوية، مركبة، عقد، تمويل)</summary>
      <div className="mt-3 space-y-3">
        <p className="text-xs text-neutral-500">الملفات خاصة بهذا النشاط ولا تُرسل إلى ERP أو إلى صفحة العميل. ارفع ما يلزم فقط، ولا تُرفق مستنداً دون حاجة العمل.</p>
        <label className="grid gap-1 text-xs font-semibold">تصنيف المستند
          <select value={category} onChange={(event) => setCategory(event.target.value as DocumentCategory)} className="rounded-lg border border-black/15 bg-white p-2 text-sm font-normal">
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block rounded-lg border border-black/15 p-2 text-sm">
          رفع ملفات من الجهاز
          <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => void handleUpload(event)} className="mt-1 block w-full text-xs" />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block rounded-lg border border-black/15 p-2 text-sm">
            التقاط صفحة بالكاميرا
            <input type="file" accept="image/*" capture="environment" disabled={busy} onChange={addScanPages} className="mt-1 block w-full text-xs" />
          </label>
          <label className="block rounded-lg border border-black/15 p-2 text-sm">
            إضافة صفحات ممسوحة
            <input type="file" accept="image/*" multiple disabled={busy} onChange={addScanPages} className="mt-1 block w-full text-xs" />
          </label>
        </div>
        {scanPages.length ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span>{scanPages.length} صفحة جاهزة لتجميعها في PDF واحد.</span>
            <button type="button" disabled={busy} onClick={() => void finishScan()} className="rounded-lg bg-emerald-700 px-3 py-2 font-bold text-white disabled:opacity-50">تجميع الصفحات ورفع PDF</button>
            <button type="button" disabled={busy} onClick={() => setScanPages([])} className="rounded-lg border border-black/15 px-3 py-2 disabled:opacity-50">مسح الصفحات</button>
          </div>
        ) : null}
        {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}
        {notice ? <p role="status" className="text-xs text-emerald-700">{notice}</p> : null}
        {loaded && !documents.length ? <p className="text-xs text-neutral-500">لا توجد مستندات مرفقة.</p> : null}
        {documents.map((document) => (
          <div key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 p-2 text-xs">
            <span>{CATEGORY_LABELS[document.category]} · {document.file_name} · {Math.ceil(document.size_bytes / 1024)} KB</span>
            <span className="flex gap-2">
              <button type="button" disabled={busy} onClick={() => void downloadDocument(document)} className="rounded border border-black/15 px-2 py-1">تنزيل</button>
              <button type="button" disabled={busy} onClick={() => void deleteDocument(document)} className="rounded border border-red-300 px-2 py-1 text-red-700">حذف</button>
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}
