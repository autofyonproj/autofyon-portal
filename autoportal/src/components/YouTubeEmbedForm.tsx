'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function YouTubeEmbedForm({ businessId }: { businessId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/gallery/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          youtube_url: url,
          title_ar: titleAr || 'فيديو مراجعة وتجربة حية',
          start_seconds: startInput ? parseTimeToSeconds(startInput) : undefined,
          end_seconds: endInput ? parseTimeToSeconds(endInput) : undefined,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'فشل في ربط الفيديو');
      }

      setStatus('✓ تم تضمين فيديو اليوتيوب بالقص الزمني في السلايدر بنجاح!');
      setUrl('');
      setTitleAr('');
      setStartInput('');
      setEndInput('');
      router.refresh();
    } catch (err: any) {
      setStatus(`❌ خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseTimeToSeconds = (val: string): number => {
    if (!val) return 0;
    if (val.includes(':')) {
      const parts = val.split(':').map((p) => parseFloat(p) || 0);
      if (parts.length === 2) return Math.round(parts[0] * 60 + parts[1]);
      if (parts.length === 3) return Math.round(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }
    return Math.round(parseFloat(val) || 0);
  };

  return (
    <div dir="rtl" className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl text-red-600">▶️</span>
        <div>
          <h4 className="font-bold text-base text-red-600 dark:text-red-400">
            تضمين فيديو يوتيوب في السلايدر السينمائي (YouTube Walkaround)
          </h4>
          <p className="text-xs opacity-70">
            ضع رابط أي فيديو يوتيوب مع إمكانية تحديد توقيت البداية والنهاية بدقة (بالثواني أو بصيغة 01:30) لعرض أفضل لقطات التجربة بدون توقف السلايدر أثناء المشاهدة!
          </p>
        </div>
      </div>

      <form onSubmit={handleEmbed} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="رابط فيديو اليوتيوب (مثال: https://youtu.be/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1 text-sm rounded-xl border border-black/15 dark:border-white/20 p-2.5 bg-white dark:bg-neutral-900"
          />
          <input
            type="text"
            placeholder="عنوان الفيديو (مثال: تجربة قيادة وتسارع)"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className="sm:w-64 text-sm rounded-xl border border-black/15 dark:border-white/20 p-2.5 bg-white dark:bg-neutral-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white/60 dark:bg-neutral-900/60 p-3 rounded-xl border border-black/10 dark:border-white/10">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            ⏱️ تقليم مقطع الفيديو (اختياري):
          </span>
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">من ثانية / دقيقة:</label>
            <input
              type="text"
              placeholder="مثال: 0:15 أو 15"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="w-28 text-xs rounded-lg border border-black/15 dark:border-white/20 p-2 bg-white dark:bg-neutral-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">إلى ثانية / دقيقة:</label>
            <input
              type="text"
              placeholder="مثال: 0:45 أو 45"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              className="w-28 text-xs rounded-lg border border-black/15 dark:border-white/20 p-2 bg-white dark:bg-neutral-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mr-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-95 transition whitespace-nowrap"
          >
            {loading ? 'جاري الربط...' : '+ تضمين في السلايدر'}
          </button>
        </div>
      </form>

      {status && <div className="text-xs font-bold mt-2 text-red-600 dark:text-red-400">{status}</div>}
    </div>
  );
}
