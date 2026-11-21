'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';

type Channel = 'facebook' | 'instagram' | 'telegram' | 'whatsapp';
type SocialPost = {
  id: string;
  title: string;
  captionEn: string;
  captionAr: string;
  channels: Channel[];
  plannedFor: string | null;
  status: 'draft' | 'approved' | 'archived';
  createdAt: string;
};
type SocialData = {
  posts: SocialPost[];
  draftsCreatedThisMonth: number;
  approvalAllowed: boolean;
  publishingEnabled: false;
  entitlements: {
    draftPacksPerMonth: number | null;
    scheduledPostsPerMonth: number | null;
    contentCalendar: boolean;
  };
};

const CHANNELS: Array<{ value: Channel; label: string }> = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

function localDateTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.valueOf() - offset).toISOString().slice(0, 16);
}

export default function VendorSocialManagerClient({ businessId }: { businessId: string }) {
  const [data, setData] = useState<SocialData | null>(null);
  const [title, setTitle] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [captionAr, setCaptionAr] = useState('');
  const [channels, setChannels] = useState<Channel[]>(['facebook', 'instagram']);
  const [plannedFor, setPlannedFor] = useState('');
  const [editingId, setEditingId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const endpoint = `/api/admin/showroom/${encodeURIComponent(businessId)}/social-posts`;
  const load = useCallback(async () => {
    const response = await fetch(endpoint, { cache: 'no-store' });
    const result = await response.json() as SocialData & { error?: string };
    if (!response.ok || !Array.isArray(result.posts)) {
      throw new Error(result.error || 'تعذر تحميل منشورات التواصل.');
    }
    return result;
  }, [endpoint]);

  useEffect(() => {
    let active = true;
    load()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'تعذر تحميل منشورات التواصل.');
      });
    return () => { active = false; };
  }, [load]);

  function resetForm() {
    setEditingId('');
    setTitle('');
    setCaptionEn('');
    setCaptionAr('');
    setChannels(['facebook', 'instagram']);
    setPlannedFor('');
  }

  function editPost(post: SocialPost) {
    setEditingId(post.id);
    setTitle(post.title);
    setCaptionEn(post.captionEn);
    setCaptionAr(post.captionAr);
    setChannels(post.channels);
    setPlannedFor(localDateTime(post.plannedFor));
    setNotice('');
    setError('');
  }

  function toggleChannel(channel: Channel) {
    setChannels((current) => current.includes(channel)
      ? current.filter((value) => value !== channel)
      : [...current, channel]);
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const requestBody = {
        title,
        captionEn,
        captionAr,
        channels,
        plannedFor: plannedFor ? new Date(plannedFor).toISOString() : null,
      };
      const response = await fetch(endpoint, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...requestBody, postId: editingId } : requestBody),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ المسودة.');
      resetForm();
      setData(await load());
      setNotice('تم حفظ المحتوى كمسودة يدوية؛ لم يتم نشره أو جدولة نشر آلي.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ المسودة.');
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(postId: string, action: 'approve' | 'archive') {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'تعذر تحديث حالة المسودة.');
      setData(await load());
      setNotice(action === 'approve' ? 'تم اعتماد المحتوى داخلياً؛ لم يتم نشره.' : 'تمت أرشفة المسودة.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحديث المسودة.');
    } finally {
      setBusy(false);
    }
  }

  async function copyCaption(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice('تم نسخ النص للمشاركة اليدوية.');
    } catch {
      setError('تعذر نسخ النص تلقائياً؛ حدده وانسخه يدوياً.');
    }
  }

  return (
    <div className="space-y-5" dir="rtl">
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        هذه المرحلة تحفظ مسودات وتقويماً تحريرياً فقط. لا توجد حسابات اجتماعية موثقة أو عملية نشر/جدولة تلقائية مفعلة؛ استخدم النسخ والمشاركة اليدوية.
      </section>
      {data ? (
        <p className="text-sm text-neutral-600">
          المسودات هذا الشهر: {data.draftsCreatedThisMonth}
          {data.entitlements.draftPacksPerMonth === null ? ' · دون حد مسودات' : ` من ${data.entitlements.draftPacksPerMonth}`}
          {data.entitlements.contentCalendar
            ? ` · حد التقويم الشهري: ${data.entitlements.scheduledPostsPerMonth ?? 'حسب العقد'}`
            : ' · التقويم غير متاح في هذه الباقة'}
        </p>
      ) : null}

      <form onSubmit={savePost} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="font-bold">{editingId ? 'تعديل مسودة' : 'إنشاء محتوى اجتماعي'}</h2>
        <label className="block space-y-1 text-sm">
          <span>عنوان داخلي</span>
          <input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-lg border p-2" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span>النص بالعربية</span>
            <textarea maxLength={4000} value={captionAr} onChange={(event) => setCaptionAr(event.target.value)} className="min-h-32 w-full rounded-lg border p-2" />
          </label>
          <label className="block space-y-1 text-sm">
            <span>النص بالإنجليزية</span>
            <textarea maxLength={4000} value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} className="min-h-32 w-full rounded-lg border p-2" />
          </label>
        </div>
        <fieldset className="flex flex-wrap gap-4 text-sm">
          <legend className="mb-2 font-semibold">قنوات المشاركة اليدوية</legend>
          {CHANNELS.map((channel) => (
            <label key={channel.value} className="flex items-center gap-2">
              <input type="checkbox" checked={channels.includes(channel.value)} onChange={() => toggleChannel(channel.value)} />
              {channel.label}
            </label>
          ))}
        </fieldset>
        {data?.entitlements.contentCalendar ? (
          <label className="block max-w-sm space-y-1 text-sm">
            <span>تاريخ مخطط في التقويم (لا يعني النشر التلقائي)</span>
            <input type="datetime-local" value={plannedFor} onChange={(event) => setPlannedFor(event.target.value)} className="w-full rounded-lg border p-2" />
          </label>
        ) : null}
        <div className="flex gap-2">
          <button disabled={busy} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {editingId ? 'حفظ التعديلات' : 'حفظ المسودة'}
          </button>
          {editingId ? <button type="button" disabled={busy} onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm">إلغاء</button> : null}
        </div>
      </form>

      <section className="space-y-3">
        {data?.posts.map((post) => (
          <article key={post.id} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">{post.title}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {post.status === 'approved' ? 'معتمد داخلياً — غير منشور' : 'مسودة'}
                  {post.plannedFor ? ` · ${new Date(post.plannedFor).toLocaleString()}` : ''}
                  {' · '}{post.channels.map((channel) => CHANNELS.find((item) => item.value === channel)?.label).join('، ')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.captionAr ? <button onClick={() => void copyCaption(post.captionAr)} className="rounded border px-3 py-1 text-xs">نسخ العربية</button> : null}
                {post.captionEn ? <button onClick={() => void copyCaption(post.captionEn)} className="rounded border px-3 py-1 text-xs">نسخ الإنجليزية</button> : null}
                {data?.approvalAllowed && post.status === 'draft' ? (
                  <button disabled={busy} onClick={() => void updateStatus(post.id, 'approve')} className="rounded bg-emerald-700 px-3 py-1 text-xs font-bold text-white disabled:opacity-50">اعتماد داخلي</button>
                ) : null}
                {post.status === 'draft' ? <button disabled={busy} onClick={() => editPost(post)} className="rounded border px-3 py-1 text-xs">تعديل</button> : null}
                <button disabled={busy} onClick={() => void updateStatus(post.id, 'archive')} className="rounded border border-red-200 px-3 py-1 text-xs text-red-700 disabled:opacity-50">أرشفة</button>
              </div>
            </div>
            {post.captionAr ? <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm">{post.captionAr}</p> : null}
            {post.captionEn ? <p dir="ltr" className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm">{post.captionEn}</p> : null}
          </article>
        ))}
        {data && !data.posts.length ? <p className="rounded-xl border border-black/10 bg-white p-5 text-sm opacity-70">لا توجد مسودات بعد.</p> : null}
      </section>
    </div>
  );
}
