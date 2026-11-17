'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import GalleryCarousel from '@/components/GalleryCarousel';
import type { Slide } from '@/lib/minisite';
import { extractYouTubeVideoId } from '@/lib/youtube';
import type {
  CarouselPresentationType,
  PortalCarouselSlide,
  PortalPageState,
} from '@/lib/portal-site';

const CAROUSEL_PRESETS: {
  id: CarouselPresentationType;
  titleAr: string;
  titleEn: string;
  icon: string;
  descAr: string;
}[] = [
  {
    id: 'cinematic',
    titleAr: 'النمط السينمائي الفاخر (Cinematic 21:9)',
    titleEn: 'Cinematic Grandeur',
    icon: '🎬',
    descAr: 'عرض بانورامي عريض وفخم مع شريط تحكم ليلي هادئ، مثالي لجولات اليوتيوب ومقاطع الفيديو والسيارات الفاخرة.',
  },
  {
    id: 'modern_split',
    titleAr: 'المسرح المقسم العصري (Modern Split)',
    titleEn: 'Modern Split Stage',
    icon: '⚡',
    descAr: 'تصميم مقسم يعرض الفيديو أو الصورة في جانب، وعنوان المواصفات وزر الحجز في الجانب المقابل.',
  },
  {
    id: 'card_stage',
    titleAr: 'منصة البطاقات البارزة (3D Card Stage)',
    titleEn: '3D Card Stage',
    icon: '🎴',
    descAr: 'بطاقات عائمة تبرز الشريحة الحالية في المنتصف مع ظهور أطراف الشرائح السابقة والقادمة ثلاثية الأبعاد.',
  },
  {
    id: 'filmstrip',
    titleAr: 'معرض شريط المشاهد (Filmstrip Gallery)',
    titleEn: 'Filmstrip Gallery',
    icon: '🎞️',
    descAr: 'شريط مصغرات احترافي في الأسفل يعرض لقطات من كافة مقاطع وصور السلايدر للتنقل الفوري.',
  },
  {
    id: 'fade_minimal',
    titleAr: 'التلاشي الانسيابي البسيط (Minimalist Fade)',
    titleEn: 'Minimalist Fade',
    icon: '✨',
    descAr: 'تلاشي متدرج هادئ فائق النعومة مع مؤشرات دائرية صغيرة دون ازدحام بصري.',
  },
];

export default function PlatformCarouselAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const [carouselType, setCarouselType] = useState<CarouselPresentationType>('cinematic');
  const [slides, setSlides] = useState<PortalCarouselSlide[]>([]);

  // New slide form state
  const [newMediaType, setNewMediaType] = useState<'image' | 'youtube'>('youtube');
  const [newUrl, setNewUrl] = useState('');
  const [newBadgeAr, setNewBadgeAr] = useState('');
  const [newBadgeEn, setNewBadgeEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCaptionAr, setNewCaptionAr] = useState('');
  const [newCaptionEn, setNewCaptionEn] = useState('');
  const [newCtaTextAr, setNewCtaTextAr] = useState('');
  const [newCtaLink, setNewCtaLink] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/platform/carousel');
      if (!res.ok) throw new Error('فشل تحميل إعدادات السلايدر');
      const data: PortalPageState = await res.json();
      const draft = data.draft;
      if (draft.carouselType) setCarouselType(draft.carouselType);
      if (draft.carouselSlides && draft.carouselSlides.length > 0) {
        setSlides(draft.carouselSlides);
      }
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (action: 'save' | 'publish') => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/platform/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          carouselType,
          carouselSlides: slides,
        }),
      });
      if (!res.ok) throw new Error('فشل حفظ الإعدادات');
      const data = await res.json();
      setMessage({
        text: action === 'publish'
          ? '🎉 تم نشر إعدادات السلايدر مباشرة على البوابة بنجاح!'
          : '✓ تم حفظ المسودة للمراجعة والمعاينة.',
      });
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setSaving(false);
    }
  };

  const parseTimeToSeconds = (val: string): number | undefined => {
    if (!val) return undefined;
    if (val.includes(':')) {
      const parts = val.split(':').map((p) => parseFloat(p) || 0);
      if (parts.length === 2) return Math.round(parts[0] * 60 + parts[1]);
      if (parts.length === 3) return Math.round(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }
    const num = parseFloat(val);
    return isNaN(num) ? undefined : Math.round(num);
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newSlide: PortalCarouselSlide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      media_type: newMediaType,
      url: newUrl.trim(),
      badge_ar: newBadgeAr.trim() || undefined,
      badge_en: newBadgeEn.trim() || undefined,
      title_ar: newTitleAr.trim() || (newMediaType === 'youtube' ? 'فيديو مراجعة وتجربة حية' : 'سيارة مميزة'),
      title_en: newTitleEn.trim() || 'Featured Showcase',
      caption_ar: newCaptionAr.trim() || undefined,
      caption_en: newCaptionEn.trim() || undefined,
      cta_text_ar: newCtaTextAr.trim() || undefined,
      cta_link: newCtaLink.trim() || undefined,
      startTime: parseTimeToSeconds(newStart),
      endTime: parseTimeToSeconds(newEnd),
    };

    setSlides((prev) => [...prev, newSlide]);
    setNewUrl('');
    setNewBadgeAr('');
    setNewBadgeEn('');
    setNewTitleAr('');
    setNewTitleEn('');
    setNewCaptionAr('');
    setNewCaptionEn('');
    setNewCtaTextAr('');
    setNewCtaLink('');
    setNewStart('');
    setNewEnd('');
    setShowAddModal(false);
    setMessage({ text: '✓ تمت إضافة الشريحة بنجاح. لا تنسَ الحفظ أو النشر!' });
  };

  const handleDeleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMoveSlide = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    setSlides((prev) => {
      const arr = [...prev];
      const temp = arr[idx];
      arr[idx] = arr[targetIdx];
      arr[targetIdx] = temp;
      return arr;
    });
  };

  // Prepare slides for live preview
  const previewSlides: Slide[] = useMemo(() => {
    return slides.map((s, idx) => {
      const isYoutube = s.media_type === 'youtube';
      const videoId = isYoutube ? extractYouTubeVideoId(s.url) : null;
      return {
        id: s.id,
        mediaType: s.media_type,
        videoId,
        url: s.url,
        fieldKey: `portal_slide_${idx}`,
        fieldSectionId: 'portal_hero',
        eyebrow: s.badge_ar || 'عرض ترويجي مميز',
        title: s.title_ar,
        note: s.caption_ar ?? null,
        caption: s.caption_ar ?? null,
        isHero: idx === 0 ? 1 : 0,
        placeholder: false,
        startTime: s.startTime,
        endTime: s.endTime,
        ctaText: s.cta_text_ar ?? 'عرض التفاصيل ←',
        ctaLink: s.cta_link ?? null,
        animation: 'kenburns',
        imageFit: 'cover',
        imagePosition: 'center',
      };
    });
  }, [slides]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#07090c] text-white p-6 sm:p-10 font-['Cairo',sans-serif]">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#dfbe7e] font-bold mb-1">
            <Link href="/admin/platform" className="hover:underline opacity-80">
              ← العودة للوحة الإدارة المركزية
            </Link>
            <span>/</span>
            <span>إدارة السلايدر السينمائي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            استوديو السلايدر السينمائي والوسائط المتعددة (Universal Carousel Studio)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            تحكم بنمط السلايدر، وخصص مقاطع اليوتيوب مع تحديد أوقات البداية والنهاية (التقليم الزمني)، وقم بمعاينة التشغيل المباشر.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-bold hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <span>🌐</span>
            <span>معاينة البوابة الرئيسية</span>
          </Link>
          <button
            onClick={() => handleSave('save')}
            disabled={saving || loading}
            className="px-5 py-2.5 rounded-xl border border-[#c4a265]/40 bg-[#c4a265]/10 text-[#dfbe7e] text-xs font-bold hover:bg-[#c4a265]/20 transition active:scale-95 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : '💾 حفظ كمسودة'}
          </button>
          <button
            onClick={() => handleSave('publish')}
            disabled={saving || loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black text-xs font-black shadow-lg hover:brightness-110 transition active:scale-95 disabled:opacity-50"
          >
            {saving ? 'جاري النشر...' : '🚀 نشر مباشر على البوابة'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`max-w-7xl mx-auto mb-6 p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            message.error
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* ════════════════════════════════════════════════════════════
            1. CHOOSE CAROUSEL PRESENTATION STYLE
        ════════════════════════════════════════════════════════════ */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <span>🎨</span>
              <span>اختر نمط وطريقة عرض السلايدر (Presentation Type):</span>
            </h2>
            <span className="text-xs text-[#dfbe7e] font-mono font-bold bg-[#c4a265]/10 px-3 py-1 rounded-full border border-[#c4a265]/20">
              النمط النشط: {carouselType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CAROUSEL_PRESETS.map((preset) => {
              const isSelected = carouselType === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCarouselType(preset.id)}
                  className={`text-right p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#dfbe7e]/20 to-transparent border-[#dfbe7e] shadow-lg shadow-[#c4a265]/10 scale-[1.02]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-2">{preset.icon}</div>
                    <h3 className="text-sm font-bold text-white mb-1">{preset.titleAr}</h3>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">{preset.descAr}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500 font-mono">{preset.id}</span>
                    {isSelected && (
                      <span className="text-[#dfbe7e] font-bold">✓ مُفعل</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            2. LIVE CAROUSEL PREVIEW SANDBOX
        ════════════════════════════════════════════════════════════ */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>👁️</span>
                <span>المعاينة الحية للسلايدر (Interactive Preview):</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                جرب تشغيل فيديو اليوتيوب، أو التنقل بين الشرائح، وتأكد من أن السلايدر لا يقفز أثناء تشغيل الفيديو.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">إجمالي الشرائح:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-bold">{slides.length}</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            {previewSlides.length > 0 ? (
              <GalleryCarousel
                slides={previewSlides}
                locale="ar"
                label="معاينة السلايدر"
                defaults={{
                  carouselType,
                  aspect: '21 / 9',
                  interval: 7000,
                  transition: 700,
                  autoPlay: true,
                  showArrows: true,
                  showIndicators: true,
                  showProgress: true,
                }}
                brand="AutoFyon"
              />
            ) : (
              <div className="p-16 text-center text-neutral-500 text-sm">
                لا توجد شرائح حالياً. أضف شريحة أولى للبدء!
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            3. SLIDES MANAGEMENT & CLIPPING STUDIO
        ════════════════════════════════════════════════════════════ */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>📑</span>
                <span>إدارة شرائح العرض وتوقيتات الفيديو (Slides & Clips):</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                يمكنك إعادة ترتيب الشرائح أو تعديل وقت بداية ونهاية مقاطع اليوتيوب.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <span>+ إضافة شريحة / فيديو يوتيوب جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Media thumbnail / info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center relative flex-shrink-0">
                    {s.media_type === 'youtube' ? (
                      <span className="text-2xl text-red-500">▶️</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.media_type === 'youtube'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {s.media_type === 'youtube' ? '▶️ يوتيوب' : '🖼️ صورة'}
                      </span>
                      <h4 className="text-sm font-bold text-white">{s.title_ar}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                      {s.caption_ar && <span>{s.caption_ar}</span>}
                      {s.media_type === 'youtube' && (
                        <span className="font-mono text-[#dfbe7e] bg-[#c4a265]/10 px-2 py-0.5 rounded text-[11px]">
                          ⏱️ التقليم: {s.startTime ?? 0} ثانية ➔ {s.endTime ?? 'نهاية الفيديو'} ثانية
                        </span>
                      )}
                      {s.cta_link && (
                        <span className="text-neutral-500 text-[11px]">
                          🔗 الرابط: {s.cta_link}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls (Move Up/Down, Delete) */}
                <div className="flex items-center gap-2 mr-auto md:mr-0">
                  <button
                    onClick={() => handleMoveSlide(idx, -1)}
                    disabled={idx === 0}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs disabled:opacity-30"
                    title="تحريك لأعلى"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => handleMoveSlide(idx, 1)}
                    disabled={idx === slides.length - 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs disabled:opacity-30"
                    title="تحريك لأسفل"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(s.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                    title="حذف الشريحة"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          ADD SLIDE MODAL
      ════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f141c] border border-white/20 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="font-bold text-base text-white">إضافة شريحة وسائط جديدة إلى السلايدر</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlide} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1.5 font-bold">نوع الوسائط:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={newMediaType === 'youtube'}
                      onChange={() => setNewMediaType('youtube')}
                    />
                    <span>▶️ فيديو يوتيوب (Walkaround Embed)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={newMediaType === 'image'}
                      onChange={() => setNewMediaType('image')}
                    />
                    <span>🖼️ صورة فائقة الجودة (High-Res Image)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">
                  {newMediaType === 'youtube' ? 'رابط فيديو اليوتيوب:' : 'رابط الصورة:'}
                </label>
                <input
                  type="url"
                  placeholder={newMediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              {newMediaType === 'youtube' && (
                <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl space-y-2">
                  <div className="font-bold text-red-400">⏱️ تحديد مقطع المشاهدة (التقليم الزمني):</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 block mb-1">وقت البداية (ثواني أو 0:15):</label>
                      <input
                        type="text"
                        placeholder="0:10"
                        value={newStart}
                        onChange={(e) => setNewStart(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">وقت النهاية (ثواني أو 0:45):</label>
                      <input
                        type="text"
                        placeholder="0:40"
                        value={newEnd}
                        onChange={(e) => setNewEnd(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    💡 ملاحظة: سيتوقف السلايدر تلقائياً عن التحريك أثناء تشغيل هذا الفيديو حتى ينتهي تماماً أو يصل لوقت النهاية!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">وسم العرض الترويجي (Badge عربي):</label>
                  <input
                    type="text"
                    placeholder="مثال: 🔥 عرض حصري أو 👑 سيارة الأسبوع"
                    value={newBadgeAr}
                    onChange={(e) => setNewBadgeAr(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">وسم العرض (Badge إنجليزي):</label>
                  <input
                    type="text"
                    placeholder="e.g. 🔥 Exclusive Offer or 👑 Spotlight"
                    value={newBadgeEn}
                    onChange={(e) => setNewBadgeEn(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">العنوان الرئيسي (عربي):</label>
                  <input
                    type="text"
                    placeholder="مثال: بي إم دبليو الفئة السابعة"
                    value={newTitleAr}
                    onChange={(e) => setNewTitleAr(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">العنوان (إنجليزي):</label>
                  <input
                    type="text"
                    placeholder="e.g. BMW 7 Series"
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">الوصف الترويجي (عربي):</label>
                <input
                  type="text"
                  placeholder="مثال: تسليم فوري وتسهيلات بنكية كبرى"
                  value={newCaptionAr}
                  onChange={(e) => setNewCaptionAr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">نص الزر التفاعلي:</label>
                  <input
                    type="text"
                    placeholder="مثال: احجز الآن أو استكشف الموديل"
                    value={newCtaTextAr}
                    onChange={(e) => setNewCtaTextAr(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">رابط الزر (URL):</label>
                  <input
                    type="text"
                    placeholder="مثال: /bmw أو /cars"
                    value={newCtaLink}
                    onChange={(e) => setNewCtaLink(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-neutral-300 hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black font-bold shadow-lg"
                >
                  + إضافة الشريحة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
