'use client';

import { useState } from 'react';
import { SOCIAL_PLATFORMS, safeSocialUrl, type SocialLink } from '@/lib/social-link-types';

interface Props {
  businessId: string;
  unitId?: string;
  initialLinks: SocialLink[];
  locale?: 'ar' | 'en';
}

export default function SocialLinksEditor({
  businessId, unitId, initialLinks, locale = 'en',
}: Props) {
  const [links, setLinks] = useState(initialLinks);
  const [platform, setPlatform] = useState<string>(
    SOCIAL_PLATFORMS.find((item) => !initialLinks.some((link) => link.platformKey === item.key))?.key ?? 'other',
  );
  const [customLabel, setCustomLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const isAr = locale === 'ar';

  const addLink = () => {
    setError('');
    setMessage('');
    const preset = SOCIAL_PLATFORMS.find((item) => item.key === platform);
    const label = platform === 'other' ? customLabel.trim() : preset?.label ?? '';
    const key = platform === 'other'
      ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `custom-${Date.now()}`
      : platform;
    const url = safeSocialUrl(newUrl.trim());
    if (!label || !url) {
      setError(isAr ? 'أدخل اسم المنصة ورابطاً صحيحاً يبدأ بـ HTTP أو HTTPS.' : 'Enter a platform name and a valid HTTP(S) URL.');
      return;
    }
    if (links.some((item) => item.platformKey === key)) {
      setError(isAr ? 'هذه المنصة مضافة بالفعل.' : 'That platform is already listed.');
      return;
    }
    setLinks((current) => [...current, {
      platformKey: key,
      label,
      url,
      visible: true,
      displayOrder: current.length,
    }]);
    setCustomLabel('');
    setNewUrl('');
  };

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          unit_id: unitId,
          links: links.map(({ platformKey, label, url, visible }) => ({ platformKey, label, url, visible })),
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save social links.');
      setMessage(isAr ? 'تم حفظ الروابط.' : 'Social links saved.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save social links.');
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    setLinks((current) => current.map((link, i) => i === index ? { ...link, ...patch } : link));
    setMessage('');
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= links.length) return;
    setLinks((current) => {
      const reordered = [...current];
      [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
      return reordered.map((link, order) => ({ ...link, displayOrder: order }));
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">{isAr ? 'روابط التواصل الاجتماعي' : 'Social links'}</h2>
        <p className="text-sm opacity-60">
          {isAr
            ? 'أضف روابط الموقع أو السيارة، ثم اختر الروابط الظاهرة للزوار.'
            : 'Manage links for this page. Hidden links stay saved but are not shown to visitors.'}
        </p>
      </div>

      {links.length ? (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={link.platformKey} className="grid gap-3 rounded-xl border border-black/10 p-3 sm:grid-cols-[minmax(7rem,0.6fr)_minmax(12rem,1fr)_minmax(12rem,1.5fr)_auto] sm:items-center">
              <label className="text-xs font-bold">
                {isAr ? 'المنصة' : 'Platform'}
                <input
                  value={link.label}
                  maxLength={60}
                  onChange={(event) => updateLink(index, { label: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-xs font-bold">
                URL
                <input
                  type="url"
                  value={link.url}
                  onChange={(event) => updateLink(index, { url: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm font-normal"
                  dir="ltr"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={link.visible}
                  onChange={(event) => updateLink(index, { visible: event.target.checked })}
                />
                {isAr ? 'إظهار للزوار' : 'Show to visitors'}
              </label>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveLink(index, -1)} disabled={index === 0} aria-label={isAr ? 'تحريك لأعلى' : 'Move up'} className="rounded border border-black/15 px-2 py-1 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1} aria-label={isAr ? 'تحريك لأسفل' : 'Move down'} className="rounded border border-black/15 px-2 py-1 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => setLinks((current) => current.filter((_, i) => i !== index))} className="rounded border border-red-300 px-2 py-1 text-red-600">
                  {isAr ? 'إزالة' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-black/15 p-4 text-sm opacity-60">
          {isAr ? 'لم تتم إضافة روابط بعد.' : 'No links added yet.'}
        </p>
      )}

      <div className="grid gap-3 rounded-xl border border-black/10 bg-black/[.02] p-3 sm:grid-cols-[12rem_minmax(12rem,1fr)_minmax(12rem,1.5fr)_auto] sm:items-end">
        <label className="text-xs font-bold">
          {isAr ? 'المنصة' : 'Platform'}
          <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal">
            {SOCIAL_PLATFORMS.map((item) => (
              <option key={item.key} value={item.key} disabled={links.some((link) => link.platformKey === item.key)}>{item.label}</option>
            ))}
            <option value="other">{isAr ? 'منصة أخرى' : 'Other platform'}</option>
          </select>
        </label>
        {platform === 'other' ? (
          <label className="text-xs font-bold">
            {isAr ? 'اسم المنصة' : 'Platform name'}
            <input value={customLabel} onChange={(event) => setCustomLabel(event.target.value)} maxLength={60} className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal" />
          </label>
        ) : null}
        <label className="text-xs font-bold">
          URL
          <input type="url" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} placeholder="https://…" dir="ltr" className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal" />
        </label>
        <button type="button" onClick={addLink} className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold hover:bg-black/5">
          {isAr ? 'إضافة رابط' : 'Add link'}
        </button>
      </div>

      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
      <button type="button" onClick={() => void save()} disabled={saving} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
        {saving ? (isAr ? 'جارٍ الحفظ…' : 'Saving…') : (isAr ? 'حفظ الروابط' : 'Save links')}
      </button>
    </section>
  );
}
