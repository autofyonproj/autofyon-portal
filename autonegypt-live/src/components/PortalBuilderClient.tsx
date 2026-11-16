'use client';

import { useState } from 'react';
import type { PortalPageContent } from '@/lib/portal-site';

const COPY: { key: keyof PortalPageContent['en']; label: string; multiline?: boolean }[] = [
  { key: 'badge', label: 'Hero eyebrow' },
  { key: 'title', label: 'Hero title' },
  { key: 'description', label: 'Hero description', multiline: true },
  { key: 'productsTitle', label: 'Solutions section title' },
  { key: 'productsDescription', label: 'Solutions section description', multiline: true },
  { key: 'featuredTitle', label: 'Featured partners title' },
  { key: 'ctaTitle', label: 'Partner call-to-action title' },
  { key: 'ctaDescription', label: 'Partner call-to-action description', multiline: true },
  { key: 'ctaButton', label: 'Partner call-to-action button' },
];
const SECTIONS = [
  { id: 'products', label: 'Showroom solutions' },
  { id: 'featured', label: 'Featured showrooms and brands' },
  { id: 'cta', label: 'Partner call to action' },
];

export default function PortalBuilderClient({
  initialDraft,
  hasPublished,
}: {
  initialDraft: PortalPageContent;
  hasPublished: boolean;
}) {
  const [content, setContent] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const updateCopy = (locale: 'en' | 'ar', key: keyof PortalPageContent['en'], value: string) => {
    setContent((current) => ({ ...current, [locale]: { ...current[locale], [key]: value } }));
  };
  const toggleSection = (section: string) => {
    setContent((current) => ({
      ...current,
      enabledSections: current.enabledSections.includes(section)
        ? current.enabledSections.filter((item) => item !== section)
        : [...current.enabledSections, section],
    }));
  };
  async function persist(action: 'save' | 'publish') {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/site-builder/portal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, content }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save portal settings.');
      setMessage(action === 'publish' ? 'Portal changes are published.' : 'Draft saved. The live portal is unchanged.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save portal settings.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <a href="/?preview=1" target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Preview draft (Arabic) ↗</a>
        <a href="/en?preview=1" target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Preview draft (English) ↗</a>
        <a href="/" target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Live portal ↗</a>
        <span className="self-center text-xs opacity-60">{hasPublished ? 'A published version is live.' : 'No custom version published; defaults remain live.'}</span>
      </div>

      <section className="rounded-xl border border-black/10 p-4">
        <h2 className="font-bold">Homepage sections</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          {SECTIONS.map((section) => (
            <label key={section.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={content.enabledSections.includes(section.id)} onChange={() => toggleSection(section.id)} />
              {section.label}
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {(['en', 'ar'] as const).map((locale) => (
          <section key={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="space-y-3 rounded-xl border border-black/10 p-4">
            <h2 className="font-bold">{locale === 'ar' ? 'النص العربي' : 'English content'}</h2>
            {COPY.map(({ key, label, multiline }) => (
              <label key={key} className="block text-xs font-bold">
                {label}
                {multiline ? (
                  <textarea rows={3} maxLength={1000} value={content[locale][key]} onChange={(event) => updateCopy(locale, key, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 font-normal" />
                ) : (
                  <input maxLength={1000} value={content[locale][key]} onChange={(event) => updateCopy(locale, key, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 font-normal" />
                )}
              </label>
            ))}
          </section>
        ))}
      </div>

      <section className="flex flex-wrap items-center gap-5 rounded-xl border border-black/10 p-4">
        <label className="flex items-center gap-2 text-xs font-bold">
          Accent color
          <input type="color" value={content.accentColor} onChange={(event) => setContent((current) => ({ ...current, accentColor: event.target.value }))} />
        </label>
        <label className="flex items-center gap-2 text-xs font-bold">
          Background color
          <input type="color" value={content.backgroundColor} onChange={(event) => setContent((current) => ({ ...current, backgroundColor: event.target.value }))} />
        </label>
        <div className="ms-auto flex gap-2">
          <button type="button" disabled={saving} onClick={() => void persist('save')} className="rounded-lg border border-black/20 px-4 py-2 text-sm font-bold disabled:opacity-50">
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" disabled={saving} onClick={() => void persist('publish')} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            Publish
          </button>
        </div>
      </section>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
    </div>
  );
}
