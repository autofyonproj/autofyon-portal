'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { StudioGalleryItem, StudioField, ContentPermissions } from '@/lib/content-admin';
import GalleryCarousel from '@/components/GalleryCarousel';
import type { Slide } from '@/lib/minisite';
import { extractYouTubeVideoId } from '@/lib/youtube';

interface Props {
  businessId: string;
  unitId?: string;
  sectionId: string;
  items: StudioGalleryItem[];
  fields: StudioField[];
  permissions: ContentPermissions;
  onUpdate: (items: StudioGalleryItem[]) => void;
}

/**
 * Client-side canvas image compression to ensure camera & device uploads
 * are fast (<200KB WebP) and never fail on mobile networks.
 */
async function compressImage(file: File): Promise<File> {
  if (file.size < 300 * 1024) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1600;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
          });
          resolve(compressed);
        },
        'image/webp',
        0.82
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export default function GalleryManager({
  businessId,
  unitId,
  sectionId,
  items,
  fields,
  permissions,
  onUpdate,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addingYoutube, setAddingYoutube] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // ── Upload handler (supports both Camera and Device Files) ──
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setError(null);
    const newItems: StudioGalleryItem[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const originalFile = fileArray[i];
      if (!originalFile.type.startsWith('image/')) {
        setError(`${originalFile.name}: صيغ الصور فقط هي المدعومة.`);
        continue;
      }
      setUploadProgress(`جاري معالجة ورفع صورة ${i + 1} من ${fileArray.length}...`);
      try {
        const file = await compressImage(originalFile);
        const form = new FormData();
        form.append('file', file);
        form.append('business_id', businessId);
        if (unitId) form.append('unit_id', unitId);
        form.append('section_id', sectionId);

        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: form,
        });

        if (!upRes.ok) {
          const errData = await upRes.json().catch(() => ({}));
          throw new Error(errData.error || `فشل رفع ${file.name} (رمز ${upRes.status})`);
        }
        const { url } = (await upRes.json()) as { url: string };

        // Insert into vendor_gallery
        const addRes = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            unit_id: unitId,
            section_id: sectionId,
            url,
            placement: 'carousel',
            is_hero: items.length === 0 && newItems.length === 0 ? 1 : 0,
          }),
        });

        if (!addRes.ok) throw new Error(`تعذر حفظ الصورة في المعرض`);
        const added = (await addRes.json()) as { id: string; approval_status: string };

        newItems.push({
          id: added.id,
          url,
          caption: null,
          caption_ar: null,
          media_data: null,
          group_key: null,
          field_key: null,
          field_section_id: null,
          display_order: items.length + newItems.length + 1,
          placement: 'carousel',
          is_hero: items.length === 0 && newItems.length === 0 ? 1 : 0,
          show_on_minisite: 1,
          approval_status: added.approval_status || 'approved',
          media_type: 'image',
          video_id: null,
        });
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : `تعذر رفع ${originalFile.name}`);
      }
    }

    if (newItems.length) onUpdate([...items, ...newItems]);
    setUploading(false);
    setUploadProgress(null);
  }, [businessId, unitId, sectionId, items, onUpdate]);

  // ── YouTube Video Embed Handler ──
  const addYouTubeVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddingYoutube(true);
    setError(null);
    const videoId = extractYouTubeVideoId(youtubeUrl.trim());
    if (!videoId) {
      setError('يرجى إدخال رابط يوتيوب صحيح (يدعم youtube.com, youtu.be, shorts)');
      setAddingYoutube(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          unit_id: unitId,
          section_id: sectionId,
          url: youtubeUrl.trim(),
          media_type: 'youtube',
          placement: 'carousel',
        }),
      });
      const data = (await response.json()) as {
        id?: string;
        url?: string;
        video_id?: string;
        approval_status?: string;
        error?: string;
      };
      if (!response.ok || !data.id || !data.url || !data.video_id) {
        throw new Error(data.error || 'تعذر تضمين مقطع فيديو اليوتيوب');
      }

      onUpdate([
        ...items,
        {
          id: data.id,
          url: data.url,
          caption: null,
          caption_ar: null,
          media_data: null,
          group_key: null,
          field_key: null,
          field_section_id: null,
          display_order: items.length + 1,
          placement: 'carousel',
          is_hero: 0,
          show_on_minisite: 1,
          approval_status: data.approval_status ?? 'approved',
          media_type: 'youtube',
          video_id: data.video_id,
        },
      ]);
      setYoutubeUrl('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إضافة فيديو اليوتيوب.');
    } finally {
      setAddingYoutube(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  // ── Hero Slide Toggle ──
  const setHero = async (id: string) => {
    setError(null);
    try {
      const prev = items.find((i) => i.is_hero === 1);
      if (prev && prev.id !== id) {
        await fetch('/api/admin/media', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: prev.id, is_hero: 0 }),
        });
      }
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_hero: 1 }),
      });
      if (!response.ok) throw new Error('تعذر تعيين الصورة الرئيسية.');
      onUpdate(items.map((i) => ({ ...i, is_hero: i.id === id ? 1 : 0 })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحديث الصورة الرئيسية.');
    }
  };

  // ── Placement toggle ──
  const setPlacement = async (id: string, placement: string) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, placement }),
      });
      if (!response.ok) throw new Error('تعذر تحديث موضع العرض.');
      onUpdate(items.map((i) => (i.id === id ? { ...i, placement } : i)));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر تحديث موضع العرض.');
    }
  };

  // ── Caption ──
  const setCaption = async (id: string, caption: string, caption_ar: string) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, caption, caption_ar }),
      });
      if (!response.ok) throw new Error('تعذر حفظ الوصف.');
      onUpdate(items.map((i) => (i.id === id ? { ...i, caption, caption_ar } : i)));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حفظ الوصف.');
    }
  };

  // ── Delete ──
  const deleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة / الصورة؟')) return;
    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('تعذر حذف الصورة.');
      onUpdate(items.filter((i) => i.id !== id));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر حذف الصورة.');
    }
  };

  // ── Reorder ──
  const moveItem = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const arr = [...items];
    const temp = arr[index];
    arr[index] = arr[targetIdx];
    arr[targetIdx] = temp;

    try {
      await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          section_id: sectionId,
          order: arr.map((i) => i.id),
        }),
      });
      onUpdate(arr);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذر إعادة ترتيب الشرائح.');
    }
  };

  // ── Live Carousel Preview Slides ──
  const previewSlides: Slide[] = useMemo(() => {
    return items
      .filter((i) => i.placement === 'carousel' || i.placement === 'both' || i.is_hero === 1)
      .map((item) => ({
        id: item.id,
        mediaType: (item.media_type as 'image' | 'youtube' | 'video' | 'embed') || 'image',
        url: item.url,
        videoId: item.video_id,
        title: item.caption_ar || item.caption || (item.media_type === 'youtube' ? 'فيديو مراجعة يوتيوب' : 'معرض السيارة'),
        eyebrow: item.is_hero === 1 ? '🌟 Cover Slide' : '',
        fieldKey: item.field_key || '',
        fieldSectionId: item.field_section_id || sectionId,
        note: null,
        isHero: item.is_hero ?? 0,
        placeholder: false,
      }));
  }, [items, sectionId]);

  return (
    <div dir="rtl" className="space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs font-bold underline">إغلاق</button>
        </div>
      )}

      {/* ── Top Action Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🎬</span>
            <span>استوديو الكاروسيل والوسائط المتطور</span>
          </h2>
          <p className="text-xs opacity-60 mt-0.5">
            تحكم كامل في شرائح الكاروسيل، التقاط صور من الكاميرا، رفع ملفات الجهاز، وتضمين مقاطع اليوتيوب.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {previewSlides.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLivePreview((p) => !p)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                showLivePreview
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15'
              }`}
            >
              <span>{showLivePreview ? '✕ إخفاء المعاينة' : '👁️ معاينة الكاروسيل الحية'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Live Carousel Preview Container ── */}
      {showLivePreview && previewSlides.length > 0 && (
        <div className="p-4 rounded-2xl border-2 border-red-500/40 bg-black text-white shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold px-2">
            <span className="text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              معاينة حية مباشرة كما تظهر للجمهور في الميني سايت
            </span>
            <span className="opacity-50">{previewSlides.length} شرائح في الكاروسيل</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <GalleryCarousel
              slides={previewSlides}
              locale="ar"
              label="معاينة حية للكاروسيل"
              defaults={{
                carouselType: 'cinematic',
                aspect: '21 / 9',
                interval: 6000,
                transition: 700,
                autoPlay: true,
                showArrows: true,
                showIndicators: true,
                showProgress: true,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Upload & Media Inputs Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Device Files & Camera Upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`p-6 rounded-2xl border-2 border-dashed text-center transition flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? 'border-red-500 bg-red-500/10'
              : 'border-black/15 dark:border-white/20 bg-black/[.02] dark:bg-white/[.02] hover:border-red-400'
          }`}
        >
          {/* Hidden file inputs */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className="text-3xl">📸</div>
          <div>
            <h3 className="font-bold text-sm">رفع صور من الجهاز أو التقاط بالكاميرا</h3>
            <p className="text-xs opacity-60 mt-1">
              اسحب الصور وأفلتها هنا، أو اختر من الجهاز أو التقط فوراً بكاميرا الموبايل
            </p>
          </div>

          {uploadProgress && (
            <div className="text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
              {uploadProgress}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>📷</span>
              <span>التقاط بالكاميرا مباشرة</span>
            </button>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>📁</span>
              <span>اختيار من الجهاز</span>
            </button>
          </div>
          <p className="text-[10px] opacity-40">يتم ضغط الصور تلقائياً لسرعة تصفح فائقة على شبكات الموبايل</p>
        </div>

        {/* Box 2: YouTube Embed Form */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/[.03] flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-red-600">▶️</span>
              <h3 className="font-bold text-sm text-red-600 dark:text-red-400">تضمين فيديو يوتيوب إلى الكاروسيل</h3>
            </div>
            <p className="text-xs opacity-60">
              أدخل رابط فيديو المراجعة أو الجولة الحية للسيارة (يدعم YouTube Shorts, youtu.be, والفيديوهات العادية).
            </p>
          </div>

          <form onSubmit={(event) => void addYouTubeVideo(event)} className="space-y-3">
            <input
              type="text"
              required
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
              className="w-full rounded-xl border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 transition"
              dir="ltr"
            />
            <button
              type="submit"
              disabled={addingYoutube || !youtubeUrl.trim()}
              className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{addingYoutube ? 'جاري الفحص والإضافة...' : '+ إضافة الفيديو إلى شرائح الكاروسيل'}</span>
            </button>
          </form>
          <p className="text-[10px] opacity-40">يتم تشغيل الفيديو بسلاسة مع خلفية صورة حقيقية وأزرار تحكم كاملة</p>
        </div>
      </div>

      {/* ── Gallery & Slides Management List ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold opacity-80 flex items-center gap-2">
            <span>🖼️</span>
            <span>شرائح الكاروسيل والصور الحالية ({items.length})</span>
          </h3>
          <span className="text-xs opacity-50">انقر على النجمة ★ لتعيين الشريحة كغلاف رئيسي للكاروسيل</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-black/10 dark:border-white/10 opacity-60 space-y-2">
            <div className="text-3xl">🚗</div>
            <p className="text-sm">لا توجد صور أو فيديوهات مضافة حتى الآن في هذا القسم.</p>
            <p className="text-xs">استخدم أزرار الرفع أعلاه لبدء بناء كاروسيل السيارة.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition shadow-sm ${
                  item.is_hero === 1
                    ? 'border-red-500/60 bg-red-500/[.06] dark:bg-red-500/[.08]'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-black/20'
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-black/10 flex-shrink-0 border border-black/10 dark:border-white/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.caption_ar || item.caption || ''}
                    className="w-full h-full object-cover"
                  />
                  {item.media_type === 'youtube' && (
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-base">
                      ▶
                    </span>
                  )}
                  {item.is_hero === 1 && (
                    <span className="absolute top-1 start-1 text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded shadow">
                      الغلاف
                    </span>
                  )}
                </div>

                {/* Content & Metadata */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono opacity-40">#{idx + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.media_type === 'youtube' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-black/5 dark:bg-white/10'
                    }`}>
                      {item.media_type === 'youtube' ? 'فيديو YouTube' : 'صورة'}
                    </span>
                    <span className="text-[10px] font-semibold opacity-60">
                      الموضع: {item.placement === 'carousel' ? 'الكاروسيل فقط' : item.placement === 'body' ? 'المعرض السفلي' : 'الكاروسيل والمعرض'}
                    </span>
                  </div>

                  {editingId === item.id ? (
                    <InlineEditor
                      item={item}
                      fields={fields}
                      permissions={permissions}
                      onSave={(caption, captionAr) => setCaption(item.id, caption, captionAr)}
                      onPlacement={(p) => setPlacement(item.id, p)}
                      onClose={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="text-xs font-medium truncate opacity-75">
                      {item.caption_ar || item.caption || (item.media_type === 'youtube' ? `فيديو ID: ${item.video_id}` : 'بدون وصف')}
                    </div>
                  )}
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Move Up */}
                  <button
                    type="button"
                    title="تحريك لأعلى"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 text-xs"
                  >
                    ▲
                  </button>
                  {/* Move Down */}
                  <button
                    type="button"
                    title="تحريك لأسفل"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 text-xs"
                  >
                    ▼
                  </button>
                  {/* Hero / Cover Toggle */}
                  <button
                    type="button"
                    title="تعيين كغلاف رئيسي"
                    onClick={() => setHero(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      item.is_hero === 1
                        ? 'bg-red-600 text-white shadow'
                        : 'border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>★</span>
                    <span className="hidden sm:inline">{item.is_hero === 1 ? 'الغلاف الرئيسي' : 'تعيين كغلاف'}</span>
                  </button>
                  {/* Edit Toggle */}
                  <button
                    type="button"
                    title="تعديل الوصف"
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-xs"
                  >
                    ✏️
                  </button>
                  {/* Delete */}
                  {permissions.canDeleteMedia && (
                    <button
                      type="button"
                      title="حذف"
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Inline editor for a gallery item ──────────────────────────────────────────
function InlineEditor({
  item,
  fields: _fields,
  permissions: _permissions,
  onSave,
  onPlacement,
  onClose,
}: {
  item: StudioGalleryItem;
  fields: StudioField[];
  permissions: ContentPermissions;
  onSave: (caption: string, captionAr: string) => void;
  onPlacement: (p: string) => void;
  onClose: () => void;
}) {
  const [caption, setCap] = useState(item.caption ?? '');
  const [captionAr, setCapAr] = useState(item.caption_ar ?? '');

  return (
    <div className="space-y-3 mt-2 p-3.5 rounded-xl bg-black/[.03] dark:bg-white/5 border border-black/10 dark:border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold opacity-60 block mb-1">الوصف بالعربية:</label>
          <input
            value={captionAr}
            onChange={(e) => setCapAr(e.target.value)}
            placeholder="مثال: الواجهة الأمامية والمصابيح الليزرية"
            dir="rtl"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold opacity-60 block mb-1">English Caption:</label>
          <input
            value={caption}
            onChange={(e) => setCap(e.target.value)}
            placeholder="e.g. Front dynamic laser headlights"
            dir="ltr"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-[11px] font-bold opacity-60">موضع الظهور:</span>
        {[
          { key: 'carousel', label: 'سلايدر الكاروسيل' },
          { key: 'body', label: 'المعرض السفلي' },
          { key: 'both', label: 'كلاهما (سلايدر ومعرض)' },
        ].map((p) => (
          <button
            type="button"
            key={p.key}
            onClick={() => onPlacement(p.key)}
            className={`text-[11px] px-2.5 py-1 rounded-lg transition ${
              item.placement === p.key
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                : 'border border-black/15 dark:border-white/20 hover:bg-black/5'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="text-xs px-3 py-1 rounded-lg opacity-60 hover:opacity-100"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(caption, captionAr);
            onClose();
          }}
          className="text-xs px-4 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
        >
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}