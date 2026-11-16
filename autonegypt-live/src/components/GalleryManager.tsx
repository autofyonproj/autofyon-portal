'use client';

import { useState, useRef, useCallback } from 'react';
import type { StudioGalleryItem, StudioField, ContentPermissions } from '@/lib/content-admin';
import GalleryCarousel from '@/components/GalleryCarousel';
import type { CarouselDefaults, Slide } from '@/lib/minisite';
import type { SiteLocale } from '@/lib/site-locale';

const PREVIEW_MEDIA_TYPES = ['image', 'youtube', 'video', 'embed', 'branded'] as const;

function toPreviewSlide(
  item: StudioGalleryItem,
  locale: SiteLocale,
  mediaData: Record<string, unknown> = item.media_data ?? {},
): Slide {
  const mediaType = PREVIEW_MEDIA_TYPES.includes(item.media_type as typeof PREVIEW_MEDIA_TYPES[number])
    ? item.media_type as Slide['mediaType']
    : 'image';
  const text = (key: string) => typeof mediaData[key] === 'string' ? mediaData[key] as string : '';
  const localized = (en: string, ar: string) => locale === 'ar' ? ar || en : en || ar;
  const caption = localized(item.caption ?? '', item.caption_ar ?? '');
  const title = localized(text('heroTitle'), text('heroTitle_ar')) || caption || item.field_key || 'Slide preview';
  const subtitle = localized(text('heroSubtitle'), text('heroSubtitle_ar'));
  const enumValue = <T extends string>(key: string, values: readonly T[]): T | undefined => {
    const value = mediaData[key];
    return typeof value === 'string' && values.includes(value as T) ? value as T : undefined;
  };
  const numberValue = (key: string): number | undefined =>
    typeof mediaData[key] === 'number' && Number.isFinite(mediaData[key]) ? mediaData[key] as number : undefined;

  return {
    id: item.id,
    fieldKey: item.field_key ?? 'preview',
    fieldSectionId: item.field_section_id ?? 'preview',
    eyebrow: item.field_key ?? (locale === 'ar' ? 'معاينة الشريحة' : 'Slide preview'),
    title,
    note: subtitle || caption || null,
    url: item.url || null,
    mediaType,
    videoId: item.video_id,
    isHero: item.is_hero,
    placeholder: false,
    animation: enumValue('animation', ['kenburns', 'fade', 'zoom', 'slide']),
    transition: numberValue('transition'),
    overlayOpacity: numberValue('overlayOpacity'),
    imageFit: enumValue('imageFit', ['cover', 'contain']),
    imagePosition: enumValue('imagePosition', ['center', 'top', 'bottom']),
    bgColor: text('bgColor') || undefined,
    displayMode: enumValue('displayMode', ['media', 'text_only']),
    ctaText: text('ctaText') || undefined,
    ctaLink: text('ctaLink') || undefined,
    targetSectionId: text('targetSectionId') || undefined,
    maxDuration: numberValue('maxDuration'),
    watermark: text('watermark') || undefined,
    titleColor: text('titleColor') || undefined,
    titleSize: numberValue('titleSize'),
    subtitleSize: numberValue('subtitleSize'),
    subtitleColor: text('subtitleColor') || undefined,
    textAlign: enumValue('textAlign', ['start', 'center', 'end']),
    fontFamily: text('fontFamily') || undefined,
    showCaption: mediaData.showCaption !== false,
  };
}

function CarouselPreview({
  slides,
  defaults,
  label,
}: {
  slides: (locale: SiteLocale) => Slide[];
  defaults?: CarouselDefaults;
  label: string;
}) {
  const [locale, setLocale] = useState<SiteLocale>('en');
  const localizedSlides = slides(locale);
  if (!localizedSlides.length) {
    return (
      <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-white/15 bg-[#111820] px-6 text-center text-sm text-white/55">
        Bind a slide to a carousel field to preview the live carousel here.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1117] p-2 shadow-2xl">
      <div className="flex items-center justify-between gap-3 px-2 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">Live preview</span>
        <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
          {(['en', 'ar'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLocale(value)}
              aria-pressed={locale === value}
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${locale === value ? 'bg-[#c6a363] text-[#111]' : 'text-white/55'}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <GalleryCarousel slides={localizedSlides} locale={locale} label={label} defaults={defaults} />
    </div>
  );
}

interface Props {
  businessId: string;
  unitId?: string;
  sectionId: string;
  items: StudioGalleryItem[];
  fields: StudioField[];
  permissions: ContentPermissions;
  onUpdate: (items: StudioGalleryItem[]) => void;
}

export default function GalleryManager({
  businessId, unitId, sectionId, items, fields, permissions, onUpdate,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addingYoutube, setAddingYoutube] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [newMediaType, setNewMediaType] = useState<'video' | 'embed' | 'branded'>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaField, setNewMediaField] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaTitleAr, setNewMediaTitleAr] = useState('');
  const [addingMedia, setAddingMedia] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image uploads are supported.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image files must be 10MB or smaller.');
    }

    const form = new FormData();
    form.append('file', file);
    form.append('business_id', businessId);
    if (unitId) form.append('unit_id', unitId);
    const uploadUrl = new URL('/api/upload', window.location.origin);
    uploadUrl.searchParams.set('business_id', businessId);
    if (unitId) uploadUrl.searchParams.set('unit_id', unitId);
    const response = await fetch(uploadUrl, { method: 'POST', body: form });
    const result = await response.json() as { url?: string; error?: string };
    if (!response.ok || !result.url) {
      throw new Error(result.error || `Image upload failed (HTTP ${response.status}).`);
    }
    return result.url;
  }, [businessId, unitId]);

  // ── Upload handler ──
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setError(null);
    const newItems: StudioGalleryItem[] = [];

    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file);

        // Insert into vendor_gallery
        const addRes = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            unit_id: unitId,
            section_id: sectionId,
            url,
            placement: 'body',
          }),
        });
        if (!addRes.ok) throw new Error(`Could not add ${file.name} to this gallery (HTTP ${addRes.status}).`);
        const added = await addRes.json() as { id: string; approval_status: string };
        newItems.push({
          id: added.id, url, caption: null, caption_ar: null,
          media_data: null, group_key: null, field_key: null, field_section_id: null,
          display_order: items.length + newItems.length + 1,
          placement: 'body', is_hero: 0, show_on_minisite: 1,
          approval_status: added.approval_status, media_type: 'image', video_id: null,
        });
      } catch (reason) {
        setError(`${file.name}: ${reason instanceof Error ? reason.message : 'Could not upload image.'}`);
      }
    }

    if (newItems.length) onUpdate([...items, ...newItems]);
    setUploading(false);
  }, [businessId, unitId, sectionId, items, onUpdate, uploadImage]);

  const replaceImage = async (id: string, file: File) => {
    setReplacingId(id);
    setError(null);
    try {
      const url = await uploadImage(file);
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url }),
      });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error || `Could not replace the image (HTTP ${response.status}).`);
      }
      onUpdate(items.map((item) => item.id === id ? { ...item, url } : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not replace the image.');
    } finally {
      setReplacingId(null);
    }
  };

  const addYouTubeVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddingYoutube(true);
    setError(null);
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
      const data = await response.json() as {
        id?: string;
        url?: string;
        video_id?: string;
        approval_status?: string;
        error?: string;
      };
      if (!response.ok || !data.id || !data.url || !data.video_id) {
        throw new Error(data.error || 'Could not add this YouTube video.');
      }

      onUpdate([...items, {
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
        approval_status: data.approval_status ?? 'pending',
        media_type: 'youtube',
        video_id: data.video_id,
      }]);
      setYoutubeUrl('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not add this YouTube video.');
    } finally {
      setAddingYoutube(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  // ── Hero ──
  const setHero = async (id: string) => {
    setError(null);
    try {
      const selectedItem = items.find((item) => item.id === id);
      if (!selectedItem) throw new Error('The selected slide is no longer available.');
      const placement = !selectedItem.field_key && selectedItem.placement === 'body'
        ? 'carousel'
        : selectedItem.placement;
      const prev = items.find((i) => i.is_hero === 1);
      if (prev && prev.id !== id) {
        const response = await fetch('/api/admin/media', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: prev.id, is_hero: 0 }),
        });
        if (!response.ok) throw new Error(`Could not update the current hero (HTTP ${response.status}).`);
      }
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_hero: 1, ...(placement !== selectedItem.placement ? { placement } : {}) }),
      });
      if (!response.ok) throw new Error(`Could not set the hero image (HTTP ${response.status}).`);
      onUpdate(items.map((i) => ({
        ...i,
        is_hero: i.id === id ? 1 : 0,
        ...(i.id === id ? { placement } : {}),
      })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update the hero image.');
    }
  };

  // ── Placement toggle ──
  const setPlacement = async (id: string, placement: string) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, placement }),
      });
      if (!response.ok) throw new Error(`Could not update placement (HTTP ${response.status}).`);
      onUpdate(items.map((i) => (i.id === id ? { ...i, placement } : i)));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update placement.');
    }
  };

  const setVisibility = async (id: string, show: boolean) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, show_on_minisite: show ? 1 : 0 }),
      });
      if (!response.ok) throw new Error(`Could not update visibility (HTTP ${response.status}).`);
      onUpdate(items.map((item) => item.id === id ? { ...item, show_on_minisite: show ? 1 : 0 } : item));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update visibility.');
    }
  };

  // ── Field binding ──
  const setFieldKey = async (id: string, fieldKey: string) => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field_key: fieldKey || null }),
      });
      if (!response.ok) throw new Error(`Could not bind the photo to a field (HTTP ${response.status}).`);
      onUpdate(items.map((i) => (i.id === id ? { ...i, field_key: fieldKey || null } : i)));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update the field binding.');
    }
  };

  // ── Caption ──
  const saveSlide = async (
    id: string, caption: string, caption_ar: string, media_data: Record<string, unknown>,
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, caption, caption_ar, media_data }),
      });
      if (!response.ok) throw new Error(`Could not save the caption (HTTP ${response.status}).`);
      onUpdate(items.map((i) => (i.id === id ? { ...i, caption, caption_ar, media_data } : i)));
      setError(null);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save the caption.');
      return false;
    }
  };

  const saveMediaData = async (id: string, media_data: Record<string, unknown>): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, media_data }),
      });
      if (!response.ok) throw new Error(`Could not save carousel settings (HTTP ${response.status}).`);
      onUpdate(items.map((item) => item.id === id ? { ...item, media_data } : item));
      setError(null);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save carousel settings.');
      return false;
    }
  };

  const addMedia = async () => {
    const carouselFields = fields.filter((field) =>
      field.show_as_slide === 1 || field.destination === 'carousel' || field.destination === 'both',
    );
    const selectedField = carouselFields.find((field) => field.name === newMediaField);
    const fieldKey = newMediaField === '__standalone__'
      ? ''
      : selectedField?.name ?? carouselFields[0]?.name ?? '';
    if (newMediaType !== 'branded' && !newMediaUrl.trim()) {
      setError('Enter the video or embed URL.');
      return;
    }
    if (!fieldKey && !newMediaTitle.trim() && !newMediaTitleAr.trim()) {
      setError('Standalone slides need a headline in at least one language.');
      return;
    }
    if (newMediaType === 'branded' && !newMediaTitle.trim() && !newMediaTitleAr.trim()) {
      setError('Branded slides need a headline in at least one language.');
      return;
    }
    setAddingMedia(true);
    setError(null);
    try {
      const isHero = !items.some((item) => item.is_hero === 1 && (item.field_key || item.placement !== 'body'));
      const media_data = {
        ...(newMediaTitle.trim() ? { heroTitle: newMediaTitle.trim() } : {}),
        ...(newMediaTitleAr.trim() ? { heroTitle_ar: newMediaTitleAr.trim() } : {}),
      };
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          unit_id: unitId,
          section_id: sectionId,
          url: newMediaType === 'branded' ? '' : newMediaUrl.trim(),
          media_type: newMediaType,
          field_key: fieldKey || null,
          placement: 'carousel',
          is_hero: isHero ? 1 : 0,
          caption: newMediaTitle.trim() || null,
          caption_ar: newMediaTitleAr.trim() || null,
          media_data,
        }),
      });
      const result = await response.json() as { id?: string; approval_status?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || `Could not add media (HTTP ${response.status}).`);
      onUpdate([...items, {
        id: result.id, url: newMediaType === 'branded' ? '' : newMediaUrl.trim(),
        caption: newMediaTitle.trim() || null,
        caption_ar: newMediaTitleAr.trim() || null,
        media_data, group_key: null, field_key: fieldKey || null, field_section_id: null,
        display_order: items.length + 1, placement: 'carousel', is_hero: isHero ? 1 : 0,
        show_on_minisite: 1, approval_status: result.approval_status ?? 'approved',
        media_type: newMediaType, video_id: null,
      }]);
      setNewMediaUrl('');
      setNewMediaTitle('');
      setNewMediaTitleAr('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not add media.');
    } finally {
      setAddingMedia(false);
    }
  };

  // ── Delete ──
  const deleteItem = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(`Could not delete the image (HTTP ${response.status}).`);
      onUpdate(items.filter((i) => i.id !== id));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete the image.');
    }
  };

  // ── Reorder (move up) ──
  const moveItem = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const arr = [...items];
    [arr[index], arr[nextIndex]] = [arr[nextIndex], arr[index]];
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          unit_id: unitId,
          section_id: sectionId,
          order: arr.map((i) => i.id),
        }),
      });
      if (!response.ok) throw new Error(`Could not reorder images (HTTP ${response.status}).`);
      onUpdate(arr);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not reorder images.');
    }
  };

  const carouselFields = fields.filter((field) =>
    field.show_as_slide === 1 || field.destination === 'carousel' || field.destination === 'both',
  );
  const carouselItems = items.filter((item) =>
    (item.field_key || item.placement === 'carousel' || item.placement === 'both')
    && item.show_on_minisite === 1 && item.approval_status !== 'rejected',
  );
  const heroSlide = items.find((item) => item.is_hero === 1 && (item.field_key || item.placement !== 'body')) ?? null;

  return (
    <div className="space-y-6">
      {error ? <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <header className="rounded-2xl bg-[#111820] px-5 py-5 text-white shadow-lg sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#c6a363]">Content studio / visual editor</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Carousel studio</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/55">
              Build a cinematic, bilingual vehicle story. Preview the actual minisite carousel while you tune its slides and behavior.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
            {carouselItems.length} live-ready {carouselItems.length === 1 ? 'slide' : 'slides'}
          </span>
        </div>
      </header>

      <HeroSettingsEditor
        key={heroSlide?.id ?? 'no-hero-slide'}
        hero={heroSlide}
        slides={(locale) => carouselItems.map((item) => toPreviewSlide(item, locale))}
        onSave={saveMediaData}
      />

      <section className="grid gap-5 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.85fr)]">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9b793d]">Media library</p>
            <h3 className="mt-1 text-base font-bold">Add a video, embed, or branded slide</h3>
            <p className="mt-1 text-xs opacity-60">Bind to a vehicle fact or create a standalone promotional slide for showroom stories.</p>
          </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            value={newMediaType}
            onChange={(event) => setNewMediaType(event.target.value as typeof newMediaType)}
            className="text-sm px-2 py-2 rounded border border-black/15 dark:border-white/20 bg-transparent"
          >
            <option value="video">Direct video URL</option>
            <option value="embed">YouTube / Vimeo / TikTok / Instagram embed</option>
            <option value="branded">Branded text slide</option>
          </select>
          <select
            value={newMediaField || (carouselFields.length ? '' : '__standalone__')}
            onChange={(event) => setNewMediaField(event.target.value)}
            className="text-sm px-2 py-2 rounded border border-black/15 dark:border-white/20 bg-transparent"
          >
            {carouselFields.length ? <option value="">Use first carousel field</option> : null}
            <option value="__standalone__">Standalone promotional slide</option>
            {carouselFields.map((field) => <option key={field.name} value={field.name}>{field.label || field.name}</option>)}
          </select>
        </div>
        {newMediaType !== 'branded' ? (
          <input
            type="url"
            value={newMediaUrl}
            onChange={(event) => setNewMediaUrl(event.target.value)}
            placeholder={newMediaType === 'video' ? 'https://…/walkaround.mp4' : 'https://…'}
            className="w-full text-sm px-2 py-2 rounded border border-black/15 dark:border-white/20 bg-transparent"
          />
        ) : null}
        {(newMediaType === 'branded' || newMediaField === '__standalone__' || !carouselFields.length) ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <input value={newMediaTitle} onChange={(event) => setNewMediaTitle(event.target.value)}
              placeholder="Slide headline (EN)" maxLength={240} className="text-sm px-2 py-2 rounded border border-black/15 dark:border-white/20 bg-transparent" />
            <input value={newMediaTitleAr} onChange={(event) => setNewMediaTitleAr(event.target.value)}
              placeholder="Slide headline (AR)" maxLength={240} dir="rtl" className="text-sm px-2 py-2 rounded border border-black/15 dark:border-white/20 bg-transparent" />
          </div>
        ) : null}
        <button type="button" onClick={() => void addMedia()} disabled={addingMedia}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          {addingMedia ? 'Adding…' : 'Add to vehicle carousel'}
        </button>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`grid min-h-48 place-items-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${
            dragOver ? 'border-[#c6a363] bg-[#c6a363]/10' : 'border-black/15 hover:border-[#c6a363] dark:border-white/15'
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <div>
            <div className="mb-2 text-2xl">▧</div>
            <p className="text-sm font-semibold">Drop images here or choose files</p>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="mt-3 rounded-lg bg-[#111820] px-4 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black">
              {uploading ? 'Uploading…' : 'Browse device'}
            </button>
            <p className="mt-2 text-[10px] opacity-50">Up to 10MB per image · images are optimized for mobile</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-3 dark:border-white/10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9b793d]">Sequence &amp; content</p>
          <h3 className="mt-1 text-lg font-bold">Your slides</h3>
        </div>
        <p className="text-xs opacity-55">Reorder, choose the opening hero, bind fields, and fine-tune each slide.</p>
      </div>
      <form onSubmit={(event) => void addYouTubeVideo(event)} className="flex flex-col gap-2 rounded-xl border border-red-500/20 bg-red-500/[.03] p-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-xs font-bold">
          YouTube video URL
          <input
            type="url"
            required
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="https://youtu.be/…"
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={addingYoutube || !youtubeUrl.trim()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {addingYoutube ? 'Adding…' : 'Add to carousel'}
        </button>
        <p className="text-[11px] opacity-60 sm:max-w-44">Embeds the video URL; it does not upload the video.</p>
      </form>

      {/* Gallery grid */}
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 px-5 py-10 text-center text-sm opacity-55 dark:border-white/15">No media yet. Upload images or add a video, embed, or branded slide above.</p>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 transition sm:flex-row sm:items-start ${
                item.is_hero === 1
                  ? 'border-[#c6a363]/70 bg-[#c6a363]/[.07] shadow-sm'
                  : 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900'
              }`}
            >
              {item.media_type === 'image' || item.media_type === 'youtube' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.caption || ''} className="h-20 w-24 rounded-lg bg-black/10 object-cover" />
              ) : (
                <div className="grid h-20 w-24 flex-shrink-0 place-items-center rounded-lg bg-[#111820] text-[10px] font-bold uppercase text-white">
                  {item.media_type}
                </div>
              )}

              {/* Info + controls */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.is_hero === 1 && (
                    <span className="rounded bg-[#c6a363] px-1.5 py-0.5 text-[10px] font-bold text-[#111]">HERO</span>
                  )}
                  <span className="text-[10px] font-bold uppercase opacity-50">{item.placement}</span>
                  {item.approval_status !== 'approved' && (
                    <span className="text-[10px] font-bold text-amber-600">⏳ {item.approval_status}</span>
                  )}
                  {item.show_on_minisite !== 1 && (
                    <span className="text-[10px] font-bold text-neutral-500">Hidden from site</span>
                  )}
                  {item.field_key && (
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
                      🔗 {item.field_key}
                    </span>
                  )}
                </div>

                {/* Inline edit toggle */}
                {editingId === item.id ? (
                  <InlineEditor
                    item={item}
                    fields={fields}
                    permissions={permissions}
                    replacing={replacingId === item.id}
                    onReplace={(file) => void replaceImage(item.id, file)}
                    onSave={(caption, captionAr, mediaData) => saveSlide(item.id, caption, captionAr, mediaData)}
                    onPlacement={(p) => setPlacement(item.id, p)}
                    onFieldKey={(fk) => setFieldKey(item.id, fk)}
                    onClose={() => setEditingId(null)}
                  />
                ) : (
                  <div className="text-xs opacity-60 truncate">
                    {item.caption || item.caption_ar || 'No caption'}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex min-w-0 flex-row flex-wrap items-start gap-1 sm:flex-col sm:items-end">
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    title={item.show_on_minisite === 1 ? 'Hide from public site' : 'Show on public site'}
                    aria-label={item.show_on_minisite === 1 ? 'Hide from public site' : 'Show on public site'}
                    aria-pressed={item.show_on_minisite === 1}
                    onClick={() => void setVisibility(item.id, item.show_on_minisite !== 1)}
                    className="text-xs px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
                  >{item.show_on_minisite === 1 ? '◉' : '○'}</button>
                  <button
                    title="Move up"
                    aria-label="Move up"
                    onClick={() => void moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="text-xs px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 disabled:opacity-30"
                  >↑</button>
                  <button
                    title="Move down"
                    aria-label="Move down"
                    onClick={() => void moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="text-xs px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 hover:bg-black/5 disabled:opacity-30"
                  >↓</button>
                  <button
                    title="Toggle hero"
                    onClick={() => setHero(item.id)}
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      item.is_hero === 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-black/10 dark:border-white/15 hover:bg-black/5'
                    }`}
                  >★</button>
                  <button
                    title="Edit"
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                    className="text-xs px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 hover:bg-black/5"
                  >✎</button>
                  {permissions.canDeleteMedia && (
                    <button
                      title="Delete"
                      onClick={() => deleteItem(item.id)}
                      className="text-xs px-1.5 py-0.5 rounded border border-red-300 text-red-600 hover:bg-red-50"
                    >✕</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inline editor for a gallery item ──────────────────────────────────────────
function InlineEditor({
  item, fields, permissions, replacing, onReplace, onSave, onPlacement, onFieldKey, onClose,
}: {
  item: StudioGalleryItem;
  fields: StudioField[];
  permissions: ContentPermissions;
  replacing: boolean;
  onReplace: (file: File) => void;
  onSave: (caption: string, captionAr: string, mediaData: Record<string, unknown>) => Promise<boolean>;
  onPlacement: (p: string) => void;
  onFieldKey: (fk: string) => void;
  onClose: () => void;
}) {
  const [caption, setCap] = useState(item.caption ?? '');
  const [captionAr, setCapAr] = useState(item.caption_ar ?? '');
  const [mediaData, setMediaData] = useState<Record<string, unknown>>(item.media_data ?? {});
  const [saving, setSaving] = useState(false);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const setStage = (key: string, value: unknown) => setMediaData((current) => ({ ...current, [key]: value }));
  const previewItem = { ...item, caption, caption_ar: captionAr, media_data: mediaData };
  const previewDefaults = typeof mediaData.carouselDefaults === 'object' && mediaData.carouselDefaults !== null
    ? mediaData.carouselDefaults as CarouselDefaults
    : undefined;
  const handleSave = async () => {
    setSaving(true);
    try {
      if (await onSave(caption, captionAr, mediaData)) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-4 rounded-xl border border-[#c6a363]/20 bg-[#111820] p-3 text-white sm:p-4">
      <CarouselPreview
        slides={(locale) => [toPreviewSlide(previewItem, locale, mediaData)]}
        defaults={previewDefaults}
        label="Slide design preview"
      />
      {item.media_type === 'image' ? (
        <div className="flex items-center gap-2">
          <input
            ref={replaceFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onReplace(file);
              event.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => replaceFileRef.current?.click()}
            disabled={replacing}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 disabled:opacity-50"
          >
            {replacing ? 'Uploading replacement…' : 'Replace image from device'}
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <input
          value={caption}
          onChange={(e) => setCap(e.target.value)}
          placeholder="Caption (EN)"
          className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/20 bg-transparent"
        />
        <input
          value={captionAr}
          onChange={(e) => setCapAr(e.target.value)}
          placeholder="Caption (AR)"
          dir="rtl"
          className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/20 bg-transparent"
        />
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-[11px] font-bold opacity-60">Placement:</label>
        {['body', 'carousel', 'both'].map((p) => (
          <button
            key={p}
            onClick={() => onPlacement(p)}
            className={`text-[11px] px-2 py-0.5 rounded ${
              item.placement === p
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'border border-black/15 dark:border-white/20'
            }`}
          >{p}</button>
        ))}
      </div>
      {permissions.canEditFields && (
        <div className="flex gap-2 items-center">
          <label className="text-[11px] font-bold opacity-60">Bind to field:</label>
          <select
            value={item.field_key ?? ''}
            onChange={(e) => onFieldKey(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/20 bg-transparent"
          >
            <option value="">— none —</option>
            {fields.filter((f) => f.show_as_slide === 1 || f.destination === 'carousel' || f.destination === 'both').map((f) => (
              <option key={f.name} value={f.name}>{f.label || f.name}</option>
            ))}
          </select>
        </div>
      )}
      <details className="rounded-lg border border-white/10 bg-white/[.03] p-3">
        <summary className="cursor-pointer text-xs font-bold">Slide design &amp; effects</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Motion effect</span>
            <select value={String(mediaData.animation ?? 'fade')} onChange={(e) => setStage('animation', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              <option value="fade">Cinematic fade</option><option value="kenburns">Ken Burns</option>
              <option value="zoom">Zoom</option><option value="slide">Slide</option>
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Display</span>
            <select value={String(mediaData.displayMode ?? 'media')} onChange={(e) => setStage('displayMode', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              <option value="media">Media with text</option><option value="text_only">Text only</option>
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Image fit</span>
            <select value={String(mediaData.imageFit ?? 'cover')} onChange={(e) => setStage('imageFit', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              <option value="cover">Fill / cover</option><option value="contain">Fit / contain</option>
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Image position</span>
            <select value={String(mediaData.imagePosition ?? 'center')} onChange={(e) => setStage('imagePosition', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              <option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option>
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Font preset</span>
            <select value={String(mediaData.fontFamily ?? 'Arial')} onChange={(e) => setStage('fontFamily', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              {['Arial', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana', 'system-ui', 'serif', 'sans-serif']
                .map((font) => <option key={font} value={font}>{font}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Text alignment</span>
            <select value={String(mediaData.textAlign ?? 'start')} onChange={(e) => setStage('textAlign', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20">
              <option value="start">Start</option><option value="center">Center</option><option value="end">End</option>
            </select>
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Hero title (EN)</span>
            <input value={String(mediaData.heroTitle ?? '')} onChange={(e) => setStage('heroTitle', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={240} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Hero title (AR)</span>
            <input dir="rtl" value={String(mediaData.heroTitle_ar ?? '')} onChange={(e) => setStage('heroTitle_ar', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={240} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Subtitle (EN)</span>
            <input value={String(mediaData.heroSubtitle ?? '')} onChange={(e) => setStage('heroSubtitle', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={240} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Subtitle (AR)</span>
            <input dir="rtl" value={String(mediaData.heroSubtitle_ar ?? '')} onChange={(e) => setStage('heroSubtitle_ar', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={240} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Title size: {String(mediaData.titleSize ?? 42)}px</span>
            <input type="range" min="16" max="96" value={Number(mediaData.titleSize ?? 42)}
              onChange={(e) => setStage('titleSize', Number(e.target.value))} className="w-full" />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Subtitle size: {String(mediaData.subtitleSize ?? 16)}px</span>
            <input type="range" min="12" max="48" value={Number(mediaData.subtitleSize ?? 16)}
              onChange={(e) => setStage('subtitleSize', Number(e.target.value))} className="w-full" />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Overlay strength: {Math.round(Number(mediaData.overlayOpacity ?? 0.58) * 100)}%</span>
            <input type="range" min="0" max="100" value={Math.round(Number(mediaData.overlayOpacity ?? 0.58) * 100)}
              onChange={(e) => setStage('overlayOpacity', Number(e.target.value) / 100)} className="w-full" />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Slide transition (ms)</span>
            <input type="number" min="100" max="3000" step="100" value={Number(mediaData.transition ?? 700)}
              onChange={(e) => setStage('transition', Math.min(3000, Math.max(100, Number(e.target.value))))}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" />
          </label>
          <ColorSetting label="Title color" value={String(mediaData.titleColor ?? '#ffffff')} onChange={(value) => setStage('titleColor', value)} />
          <ColorSetting label="Subtitle color" value={String(mediaData.subtitleColor ?? '#ffffff')} onChange={(value) => setStage('subtitleColor', value)} />
          <ColorSetting label="Background color" value={String(mediaData.bgColor ?? '#101820')} onChange={(value) => setStage('bgColor', value)} />
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Watermark</span>
            <input value={String(mediaData.watermark ?? '')} onChange={(e) => setStage('watermark', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={120} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Call-to-action label</span>
            <input value={String(mediaData.ctaText ?? '')} onChange={(e) => setStage('ctaText', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={120} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">Call-to-action URL</span>
            <input value={String(mediaData.ctaLink ?? '')} onChange={(e) => setStage('ctaLink', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20" maxLength={240} />
          </label>
          <label className="space-y-1 text-[11px]">
            <span className="block font-bold opacity-60">In-page destination</span>
            <input value={String(mediaData.targetSectionId ?? '')} onChange={(e) => setStage('targetSectionId', e.target.value)}
              className="w-full rounded border border-black/15 bg-transparent px-2 py-1.5 dark:border-white/20"
              maxLength={120} placeholder="Optional section ID, e.g. sec_auto_inventory" />
          </label>
          {['video', 'youtube', 'embed'].includes(item.media_type) ? (
            <label className="space-y-1 text-[11px]">
              <span className="block font-bold opacity-60">Video slide hold: {Number(mediaData.maxDuration ?? 20)} sec</span>
              <input type="range" min="5" max="180" value={Math.min(180, Math.max(5, Number(mediaData.maxDuration ?? 20)))}
                onChange={(e) => setStage('maxDuration', Number(e.target.value))}
                className="w-full accent-[#c6a363]" />
            </label>
          ) : null}
          <label className="flex items-center gap-2 text-[11px] sm:col-span-2">
            <input type="checkbox" checked={mediaData.showCaption !== false} onChange={(e) => setStage('showCaption', e.target.checked)} />
            Show slide caption
          </label>
        </div>
      </details>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="text-xs px-2 py-1 opacity-60">Cancel</button>
        <button
          type="button" onClick={() => void handleSave()} disabled={saving}
          className="text-xs px-3 py-1 bg-blue-600 text-white rounded font-bold disabled:opacity-50"
        >{saving ? 'Saving…' : 'Save slide'}</button>
      </div>
    </div>
  );
}

function ColorSetting({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-[11px]">
      <span className="font-bold opacity-60">{label}</span>
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function HeroSettingsEditor({
  hero, slides, onSave,
}: {
  hero: StudioGalleryItem | null;
  slides: (locale: SiteLocale) => Slide[];
  onSave: (id: string, mediaData: Record<string, unknown>) => Promise<boolean>;
}) {
  const existing = hero?.media_data?.carouselDefaults;
  const current = typeof existing === 'object' && existing !== null
    ? existing as Record<string, unknown>
    : {};
  const [settings, setSettings] = useState<Record<string, unknown>>({
    autoPlay: true, interval: 6000, transition: 700, aspect: '16 / 9',
    showArrows: true, showIndicators: true, showProgress: true,
    titleSize: 42, subtitleSize: 16, overlayOpacity: 0.58,
    imageFit: 'cover', imagePosition: 'center', contentAlign: 'start',
    fontFamily: 'Arial', accent: '#c9a55c', titleColor: '#ffffff',
    subtitleColor: '#ffffff', bgColor: '#101820', ...current,
  });
  const [activeGroup, setActiveGroup] = useState<'look' | 'playback'>('look');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!hero) {
    return (
      <section className="rounded-2xl border border-[#c6a363]/25 bg-[#111820] p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c6a363]">Carousel design</p>
        <p className="mt-2 text-sm text-white/65">Choose a field-bound slide below and mark it as the hero to unlock the global carousel controls.</p>
      </section>
    );
  }
  const set = (key: string, value: unknown) => {
    setSaved(false);
    setSettings((state) => ({ ...state, [key]: value }));
  };
  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      setSaved(await onSave(hero.id, { ...(hero.media_data ?? {}), carouselDefaults: settings }));
    } finally {
      setSaving(false);
    }
  };
  const bool = (key: string) => settings[key] !== false;
  const number = (key: string, fallback: number) => Number(settings[key] ?? fallback);
  const inputClass = 'mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs dark:border-white/15 dark:bg-[#10161d]';
  const labelClass = 'block text-[11px] font-semibold';
  return (
    <section className="overflow-hidden rounded-2xl border border-[#c6a363]/25 bg-[#111820] p-4 text-white shadow-lg sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c6a363]">Hero &amp; carousel</p>
          <h3 className="mt-1 text-sm font-bold">Design the overall experience</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/55">Editing the HERO slide</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(19rem,.75fr)]">
        <CarouselPreview slides={slides} defaults={settings as CarouselDefaults} label="Carousel settings preview" />
        <div className="rounded-xl border border-white/10 bg-white/[.035] p-4">
          <div className="flex gap-2 border-b border-white/10 pb-3">
            {([
              ['look', 'Look & typography'],
              ['playback', 'Playback & controls'],
            ] as const).map(([group, label]) => (
              <button key={group} type="button" onClick={() => setActiveGroup(group)}
                aria-pressed={activeGroup === group}
                className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${activeGroup === group ? 'bg-[#c6a363] text-[#111]' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                {label}
              </button>
            ))}
          </div>

          {activeGroup === 'look' ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>Aspect ratio
                <select value={String(settings.aspect)} onChange={(e) => set('aspect', e.target.value)} className={inputClass}>
                  {['21 / 9', '16 / 9', '4 / 3', '4 / 5', '1 / 1'].map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
              </label>
              <label className={labelClass}>Default image fit
                <select value={String(settings.imageFit)} onChange={(e) => set('imageFit', e.target.value)} className={inputClass}>
                  <option value="cover">Fill frame</option><option value="contain">Show full image</option>
                </select>
              </label>
              <label className={labelClass}>Image position
                <select value={String(settings.imagePosition)} onChange={(e) => set('imagePosition', e.target.value)} className={inputClass}>
                  <option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option>
                </select>
              </label>
              <label className={labelClass}>Content alignment
                <select value={String(settings.contentAlign)} onChange={(e) => set('contentAlign', e.target.value)} className={inputClass}>
                  <option value="start">Start</option><option value="center">Center</option><option value="end">End</option>
                </select>
              </label>
              <label className={labelClass}>Font preset
                <select value={String(settings.fontFamily)} onChange={(e) => set('fontFamily', e.target.value)} className={inputClass}>
                  {['Arial', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana', 'system-ui', 'serif', 'sans-serif'].map((font) => <option key={font} value={font}>{font}</option>)}
                </select>
              </label>
              <label className={labelClass}>Watermark
                <input value={String(settings.watermark ?? '')} onChange={(e) => set('watermark', e.target.value)} maxLength={120} className={inputClass} placeholder="Brand or showroom name" />
              </label>
              <RangeSetting label="Title size" value={number('titleSize', 42)} min={16} max={96} suffix="px" onChange={(value) => set('titleSize', value)} />
              <RangeSetting label="Subtitle size" value={number('subtitleSize', 16)} min={12} max={48} suffix="px" onChange={(value) => set('subtitleSize', value)} />
              <RangeSetting label="Overlay strength" value={Math.round(number('overlayOpacity', 0.58) * 100)} min={0} max={100} suffix="%" onChange={(value) => set('overlayOpacity', value / 100)} />
              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <ColorSetting label="Accent" value={String(settings.accent)} onChange={(v) => set('accent', v)} />
                <ColorSetting label="Title color" value={String(settings.titleColor)} onChange={(v) => set('titleColor', v)} />
                <ColorSetting label="Subtitle color" value={String(settings.subtitleColor)} onChange={(v) => set('subtitleColor', v)} />
                <ColorSetting label="Background" value={String(settings.bgColor)} onChange={(v) => set('bgColor', v)} />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <RangeSetting label="Slide hold" value={number('interval', 6000) / 1000} min={2} max={30} step={0.5} suffix=" sec" onChange={(value) => set('interval', value * 1000)} />
              <RangeSetting label="Transition duration" value={number('transition', 700)} min={100} max={3000} step={100} suffix=" ms" onChange={(value) => set('transition', value)} />
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ['autoPlay', 'Autoplay'], ['showArrows', 'Navigation arrows'],
                  ['showIndicators', 'Slide indicators'], ['showProgress', 'Progress bar'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-white/75">
                    <input type="checkbox" checked={bool(key)} onChange={(e) => set(key, e.target.checked)} className="accent-[#c6a363]" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={() => void save()} disabled={saving}
            className="mt-5 w-full rounded-lg bg-[#c6a363] px-4 py-2.5 text-xs font-extrabold text-[#111] transition hover:bg-[#d8b979] disabled:opacity-50">
            {saving ? 'Saving design…' : 'Save carousel design'}
          </button>
          {saved ? <p role="status" className="mt-2 text-center text-[11px] text-emerald-300">Carousel design saved.</p> : null}
        </div>
      </div>
    </section>
  );
}

function RangeSetting({
  label, value, min, max, step = 1, suffix = '', onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-[11px] font-semibold text-white/75">
      <span className="flex justify-between gap-2"><span>{label}</span><span className="text-[#c6a363]">{value}{suffix}</span></span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-[#c6a363]" />
    </label>
  );
}
