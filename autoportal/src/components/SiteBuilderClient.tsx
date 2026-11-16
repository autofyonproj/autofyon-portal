'use client';

import { useMemo, useState } from 'react';
import type { SiteTemplate, SiteTargetType } from '@/lib/site-builder';
import {
  UNIT_SOCIAL_PLATFORMS,
  UNIT_SOCIAL_LABELS,
  validateUnitSocialLinks,
  type UnitSocialLinks,
} from '@/lib/social-links';

export interface SiteBuilderTarget {
  id: string;
  targetType: SiteTargetType;
  name: string;
  kind: string;
  previewUrl: string | null;
  isPublished: boolean;
  contentUrl: string;
  sharedContentUrl?: string;
  pageBuilderUrl?: string;
  editUrl: string;
  templateId: string | null;
  logoUrl: string | null;
  accentColor: string | null;
  backgroundColor: string | null;
  socialLinks: string;
}

export default function SiteBuilderClient({
  targets,
  templates,
  initialTargetKey,
}: {
  targets: SiteBuilderTarget[];
  templates: SiteTemplate[];
  initialTargetKey?: string;
}) {
  const [selectedKey, setSelectedKey] = useState(
    targets.some((target) => `${target.targetType}:${target.id}` === initialTargetKey)
      ? initialTargetKey ?? ''
      : targets[0] ? `${targets[0].targetType}:${targets[0].id}` : '',
  );
  const selected = useMemo(
    () => targets.find((target) => `${target.targetType}:${target.id}` === selectedKey),
    [targets, selectedKey],
  );
  const [templateId, setTemplateId] = useState(selected?.templateId ?? 'editorial');
  const [logoUrl, setLogoUrl] = useState(selected?.logoUrl ?? '');
  const [accentColor, setAccentColor] = useState(selected?.accentColor ?? templates[0]?.accentColor ?? '#b28a45');
  const [backgroundColor, setBackgroundColor] = useState(selected?.backgroundColor ?? templates[0]?.backgroundColor ?? '#f7f4ed');
  const [socialLinks, setSocialLinks] = useState<UnitSocialLinks>(() => parseSocialLinks(selected?.socialLinks));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function parseSocialLinks(raw: string | undefined): UnitSocialLinks {
    try {
      const value: unknown = JSON.parse(raw ?? '{}');
      return validateUnitSocialLinks(value) ?? {};
    } catch {
      return {};
    }
  }

  function chooseTarget(key: string) {
    const target = targets.find((item) => `${item.targetType}:${item.id}` === key);
    if (!target) return;
    setSelectedKey(key);
    const targetTemplateId = target.targetType === 'business' ? 'editorial' : target.templateId ?? 'editorial';
    setTemplateId(targetTemplateId);
    const preset = templates.find((item) => item.id === targetTemplateId) ?? templates[0];
    setLogoUrl(target.logoUrl ?? '');
    setAccentColor(target.accentColor ?? preset.accentColor);
    setBackgroundColor(target.backgroundColor ?? preset.backgroundColor);
    setSocialLinks(parseSocialLinks(target.socialLinks));
    setMessage('');
    setError('');
  }

  function chooseTemplate(id: string) {
    setTemplateId(id);
    const preset = templates.find((item) => item.id === id);
    if (preset) {
      setAccentColor(preset.accentColor);
      setBackgroundColor(preset.backgroundColor);
    }
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/admin/site-builder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: selected.targetType,
          targetId: selected.id,
          templateId,
          logoUrl,
          accentColor,
          backgroundColor,
          ...(selected.targetType === 'unit' ? { socialLinks } : {}),
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save site design.');
      setMessage('Design saved and applied to the public page.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save site design.');
    } finally {
      setSaving(false);
    }
  }

  if (!targets.length) {
    return <p className="rounded-xl border border-black/10 p-5 text-sm opacity-70">No sites or vehicles are available in your account scope.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="space-y-5 rounded-2xl border border-black/10 bg-white p-5">
        <div>
          <label htmlFor="site-target" className="mb-1 block text-xs font-bold uppercase opacity-60">Site or vehicle</label>
          <select id="site-target" className="w-full rounded-lg border border-black/15 bg-white px-3 py-2" value={selectedKey} onChange={(event) => chooseTarget(event.target.value)}>
            {targets.map((target) => (
              <option key={`${target.targetType}:${target.id}`} value={`${target.targetType}:${target.id}`}>{target.kind} · {target.name}{target.isPublished ? '' : ' (Draft)'}</option>
            ))}
          </select>
        </div>

        {selected ? (
          <>
            <div>
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <p className="text-sm opacity-60">
                {selected.targetType === 'business'
                  ? 'Customer minisites share the Auto One Egypt-inspired layout and page structure. Customize this customer’s colors and logo without changing the design.'
                  : 'Customize this vehicle mini-site layout, colors, and logo. Its photos, videos, and carousel slides are managed separately in the vehicle media editor.'}
              </p>
            </div>

            {selected.targetType === 'unit' ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {templates.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => chooseTemplate(template.id)}
                    aria-pressed={templateId === template.id}
                    className={`rounded-xl border p-4 text-start transition ${templateId === template.id ? 'border-[var(--gold)] ring-2 ring-[var(--gold-glass)]' : 'border-black/10 hover:border-black/30'}`}
                  >
                    <span className="mb-3 block h-8 rounded" style={{ background: template.backgroundColor, borderBottom: `4px solid ${template.accentColor}` }} />
                    <span className="block text-sm font-bold">{template.name}</span>
                    <span className="mt-1 block text-xs opacity-60">{template.description}</span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold">
                Logo URL
                <input className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 font-normal" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://… or /media/logo.png" />
              </label>
              <label className="text-xs font-bold">
                Accent color
                <span className="mt-1 flex gap-2">
                  <input aria-label="Accent color" type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="h-10 w-12 rounded border p-1" />
                  <input className="min-w-0 flex-1 rounded-lg border border-black/15 px-3 py-2 font-mono font-normal" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} />
                </span>
              </label>
              <label className="text-xs font-bold">
                Page background
                <span className="mt-1 flex gap-2">
                  <input aria-label="Page background color" type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="h-10 w-12 rounded border p-1" />
                  <input className="min-w-0 flex-1 rounded-lg border border-black/15 px-3 py-2 font-mono font-normal" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} />
                </span>
              </label>
            </div>

            {selected.targetType === 'unit' ? (
              <fieldset className="space-y-3 rounded-xl border border-black/10 p-4">
                <legend className="px-1 text-sm font-bold">Car-specific social links</legend>
                <p className="text-xs opacity-60">These links appear on this car mini-site and can be included in an approved vehicle transfer.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {UNIT_SOCIAL_PLATFORMS.map((platform) => (
                    <label key={platform} className="text-xs font-bold">
                      {UNIT_SOCIAL_LABELS[platform]}
                      <input
                        type="url"
                        autoComplete="url"
                        placeholder="https://…"
                        value={socialLinks[platform] ?? ''}
                        onChange={(event) => setSocialLinks((current) => ({
                          ...current,
                          [platform]: event.target.value,
                        }))}
                        className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 font-normal"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
            <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {saving ? 'Saving…' : 'Save and apply design'}
            </button>
          </>
        ) : null}
      </section>

      {selected ? (
        <aside className="space-y-3">
          {selected.previewUrl ? (
            <a className="block rounded-xl border border-black/10 p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.previewUrl} target="_blank" rel="noreferrer">Preview public page ↗</a>
          ) : (
            <p className="rounded-xl border border-black/10 p-4 text-sm opacity-60">Public preview becomes available after publishing this page.</p>
          )}
          <a className="block rounded-xl border border-black/10 p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.contentUrl}>
            {selected.targetType === 'unit' ? 'Edit vehicle gallery and carousel ↗' : 'Edit content, carousel, and blog ↗'}
          </a>
          {selected.pageBuilderUrl ? (
            <a className="block rounded-xl border border-[var(--gold)] p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.pageBuilderUrl}>
              Manage pages and components ↗
            </a>
          ) : null}
          {selected.sharedContentUrl ? (
            <a className="block rounded-xl border border-black/10 p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.sharedContentUrl}>Manage vendor content and blog ↗</a>
          ) : null}
          <a className="block rounded-xl border border-black/10 p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.editUrl}>Manage site or vehicle ↗</a>
          <p className="px-1 text-xs leading-5 opacity-60">Model and vendor pages use Content Studio. Each vehicle listing has its own media carousel; shared posts remain with its vendor or model.</p>
        </aside>
      ) : null}
    </div>
  );
}
