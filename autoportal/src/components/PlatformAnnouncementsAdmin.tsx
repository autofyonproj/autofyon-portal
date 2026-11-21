'use client';

import { useEffect, useState } from 'react';
import type { PlatformAd, PlatformNewsItem } from '@/lib/portal-site';

interface AnnouncementState {
  draft: { platformAds: PlatformAd[]; newsRibbon: PlatformNewsItem[] };
  published: { platformAds: PlatformAd[]; newsRibbon: PlatformNewsItem[] };
}

const EMPTY_STATE: AnnouncementState = {
  draft: { platformAds: [], newsRibbon: [] },
  published: { platformAds: [], newsRibbon: [] },
};

export default function PlatformAnnouncementsAdmin() {
  const [state, setState] = useState(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    void fetch('/api/admin/platform/announcements')
      .then(async (response) => {
        const data = await response.json() as AnnouncementState & { error?: string };
        if (!response.ok) throw new Error(data.error || 'تعذر تحميل محتوى الإعلانات والأخبار');
        if (active) {
          setState(data);
          setLoaded(true);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'تعذر تحميل المحتوى');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function save(action: 'save' | 'publish') {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/platform/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...state.draft }),
      });
      const data = await response.json() as AnnouncementState & { error?: string };
      if (!response.ok) throw new Error(data.error || 'تعذر حفظ المحتوى');
      setState(data);
      setMessage(action === 'publish' ? 'تم نشر الإعلانات والأخبار على صفحات المعارض.' : 'تم حفظ المسودة. لم تُنشر بعد.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ المحتوى');
    } finally {
      setSaving(false);
    }
  }

  function updateAd(id: string, key: keyof Omit<PlatformAd, 'id'>, value: string) {
    setState((current) => ({
      ...current,
      draft: {
        ...current.draft,
        platformAds: current.draft.platformAds.map((ad) => ad.id === id ? { ...ad, [key]: value } : ad),
      },
    }));
  }

  function updateNews(id: string, key: keyof Omit<PlatformNewsItem, 'id'>, value: string) {
    setState((current) => ({
      ...current,
      draft: {
        ...current.draft,
        newsRibbon: current.draft.newsRibbon.map((item) => item.id === id ? { ...item, [key]: value } : item),
      },
    }));
  }

  function addAd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ad: PlatformAd = {
      id: `ad_${crypto.randomUUID()}`,
      imageUrl: String(form.get('imageUrl') || '').trim(),
      titleAr: String(form.get('titleAr') || '').trim(),
      titleEn: String(form.get('titleEn') || '').trim(),
      linkUrl: String(form.get('linkUrl') || '').trim(),
    };
    setState((current) => ({
      ...current,
      draft: { ...current.draft, platformAds: [...current.draft.platformAds, ad] },
    }));
    event.currentTarget.reset();
  }

  function addNews(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: PlatformNewsItem = {
      id: `news_${crypto.randomUUID()}`,
      textAr: String(form.get('textAr') || '').trim(),
      textEn: String(form.get('textEn') || '').trim(),
      linkUrl: String(form.get('linkUrl') || '').trim(),
    };
    setState((current) => ({
      ...current,
      draft: { ...current.draft, newsRibbon: [...current.draft.newsRibbon, item] },
    }));
    event.currentTarget.reset();
  }

  const inputClass = 'mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-slate-900';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">إعلانات وأخبار AutoFyon العامة</h1>
          <p className="mt-1 text-sm text-neutral-500">تظهر هذه المواد في صفحات المعارض المنشورة. لا يستطيع مسؤولو المعارض تعديلها.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void save('save')} disabled={saving || loading || !loaded} className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold disabled:opacity-50">
            حفظ كمسودة
          </button>
          <button type="button" onClick={() => void save('publish')} disabled={saving || loading || !loaded} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            نشر على صفحات المعارض
          </button>
        </div>
      </header>

      {loading && <p className="rounded-lg bg-neutral-50 p-4 text-sm">جارٍ تحميل المحتوى...</p>}
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {state.published.platformAds.length + state.published.newsRibbon.length > 0 && (
        <p className="text-xs text-neutral-500">
          المحتوى المنشور حاليًا: {state.published.platformAds.length} إعلان و{state.published.newsRibbon.length} خبر.
        </p>
      )}

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <div>
          <h2 className="text-lg font-bold">سلايدر الإعلانات العامة</h2>
          <p className="text-sm text-neutral-500">إعلانات AutoFyon فقط، في عمود جانبي على الكمبيوتر وبطاقة مختصرة تحت شريط الأخبار على الهاتف.</p>
        </div>
        <form onSubmit={addAd} className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold">رابط صورة HTTPS
            <input name="imageUrl" type="url" pattern="https://.*" required maxLength={1000} className={inputClass} dir="ltr" />
          </label>
          <label className="text-xs font-bold">رابط الإعلان (HTTPS أو مسار على AutoFyon)
            <input name="linkUrl" required maxLength={1000} placeholder="https://autofyon.com/cars أو /cars" className={inputClass} dir="ltr" />
          </label>
          <label className="text-xs font-bold">عنوان الإعلان بالعربية
            <input name="titleAr" required maxLength={160} className={inputClass} />
          </label>
          <label className="text-xs font-bold">عنوان الإعلان بالإنجليزية
            <input name="titleEn" maxLength={160} className={inputClass} dir="ltr" />
          </label>
          <button className="rounded-lg border border-red-700/30 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 sm:col-span-2">إضافة إعلان للمسودة</button>
        </form>

        <div className="space-y-3">
          {state.draft.platformAds.map((ad, index) => (
            <article key={ad.id} className="grid gap-3 rounded-xl border border-black/10 p-3 sm:grid-cols-2">
              <p className="text-xs font-bold text-red-800 sm:col-span-2">الإعلان {index + 1}</p>
              <label className="text-xs font-bold">رابط الصورة
                <input value={ad.imageUrl} onChange={(event) => updateAd(ad.id, 'imageUrl', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <label className="text-xs font-bold">رابط الإعلان
                <input value={ad.linkUrl} onChange={(event) => updateAd(ad.id, 'linkUrl', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <label className="text-xs font-bold">العنوان بالعربية
                <input value={ad.titleAr} onChange={(event) => updateAd(ad.id, 'titleAr', event.target.value)} className={inputClass} />
              </label>
              <label className="text-xs font-bold">العنوان بالإنجليزية
                <input value={ad.titleEn} onChange={(event) => updateAd(ad.id, 'titleEn', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <button type="button" onClick={() => setState((current) => ({ ...current, draft: { ...current.draft, platformAds: current.draft.platformAds.filter((item) => item.id !== ad.id) } }))} className="justify-self-start rounded-lg border border-red-700/30 px-3 py-1.5 text-xs font-bold text-red-800 sm:col-span-2">إزالة الإعلان من المسودة</button>
            </article>
          ))}
          {!state.draft.platformAds.length && <p className="text-sm text-neutral-500">لا توجد إعلانات في المسودة.</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <div>
          <h2 className="text-lg font-bold">شريط أخبار وروابط AutoFyon</h2>
          <p className="text-sm text-neutral-500">يعرض الأخبار كروابط أفقية قابلة للتمرير، مع دعم العربية والإنجليزية.</p>
        </div>
        <form onSubmit={addNews} className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold">نص الخبر بالعربية
            <input name="textAr" required maxLength={240} className={inputClass} />
          </label>
          <label className="text-xs font-bold">نص الخبر بالإنجليزية
            <input name="textEn" maxLength={240} className={inputClass} dir="ltr" />
          </label>
          <label className="text-xs font-bold sm:col-span-2">رابط الخبر (HTTPS أو مسار على AutoFyon)
            <input name="linkUrl" required maxLength={1000} placeholder="https://autofyon.com/blog أو /blog" className={inputClass} dir="ltr" />
          </label>
          <button className="rounded-lg border border-red-700/30 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 sm:col-span-2">إضافة الخبر للمسودة</button>
        </form>

        <div className="space-y-3">
          {state.draft.newsRibbon.map((item, index) => (
            <article key={item.id} className="grid gap-3 rounded-xl border border-black/10 p-3 sm:grid-cols-2">
              <p className="text-xs font-bold text-red-800 sm:col-span-2">الخبر {index + 1}</p>
              <label className="text-xs font-bold">النص بالعربية
                <input value={item.textAr} onChange={(event) => updateNews(item.id, 'textAr', event.target.value)} className={inputClass} />
              </label>
              <label className="text-xs font-bold">النص بالإنجليزية
                <input value={item.textEn} onChange={(event) => updateNews(item.id, 'textEn', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <label className="text-xs font-bold sm:col-span-2">الرابط
                <input value={item.linkUrl} onChange={(event) => updateNews(item.id, 'linkUrl', event.target.value)} className={inputClass} dir="ltr" />
              </label>
              <button type="button" onClick={() => setState((current) => ({ ...current, draft: { ...current.draft, newsRibbon: current.draft.newsRibbon.filter((news) => news.id !== item.id) } }))} className="justify-self-start rounded-lg border border-red-700/30 px-3 py-1.5 text-xs font-bold text-red-800 sm:col-span-2">إزالة الخبر من المسودة</button>
            </article>
          ))}
          {!state.draft.newsRibbon.length && <p className="text-sm text-neutral-500">لا توجد أخبار في المسودة.</p>}
        </div>
      </section>
    </div>
  );
}
