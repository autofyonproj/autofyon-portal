'use client';

import { useMemo, useState } from 'react';
import type { SiteTemplate, SiteTargetType } from '@/lib/site-builder';
import {
  UNIT_SOCIAL_PLATFORMS,
  UNIT_SOCIAL_LABELS,
  validateUnitSocialLinks,
  type UnitSocialLinks,
} from '@/lib/social-links';

interface MinisiteTreeNode {
  target: SiteBuilderTarget;
  children: MinisiteTreeNode[];
}

export interface SiteBuilderTarget {
  id: string;
  targetType: SiteTargetType;
  name: string;
  typeId: string;
  kind: string;
  parentId: string | null;
  parentName: string | null;
  siteGroup: 'automotive' | 'vendors';
  market: string;
  category: string;
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
  const initialTarget = targets.find((target) => `${target.targetType}:${target.id}` === initialTargetKey)
    ?? targets.find((target) => target.siteGroup === 'automotive')
    ?? targets[0];
  const [selectedKey, setSelectedKey] = useState(initialTarget ? `${initialTarget.targetType}:${initialTarget.id}` : '');
  const [siteGroup, setSiteGroup] = useState<'automotive' | 'vendors'>(initialTarget?.siteGroup ?? 'automotive');
  const groupTargets = useMemo(() => targets.filter((target) => target.siteGroup === siteGroup), [targets, siteGroup]);
  const hierarchy = useMemo(() => {
    const markets = new Map<string, Map<string, SiteBuilderTarget[]>>();
    for (const target of groupTargets) {
      let categories = markets.get(target.market);
      if (!categories) markets.set(target.market, (categories = new Map()));
      const entries = categories.get(target.category) ?? [];
      entries.push(target);
      categories.set(target.category, entries);
    }
    return [...markets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([market, categories]) => ({
        market,
        categories: [...categories.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, entries]) => {
            const nodes = new Map(entries.map((target) => [target.id, { target, children: [] as MinisiteTreeNode[] }]));
            const roots: MinisiteTreeNode[] = [];
            for (const node of nodes.values()) {
              const parent = node.target.parentId ? nodes.get(node.target.parentId) : undefined;
              if (parent) parent.children.push(node);
              else roots.push(node);
            }
            const sortNodes = (items: MinisiteTreeNode[]) => {
              items.sort((a, b) => a.target.name.localeCompare(b.target.name));
              items.forEach((item) => sortNodes(item.children));
            };
            sortNodes(roots);
            return {
            category,
            roots,
            count: entries.length,
          };
          }),
      }));
  }, [groupTargets]);
  const selected = useMemo(
    () => groupTargets.find((target) => `${target.targetType}:${target.id}` === selectedKey),
    [groupTargets, selectedKey],
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
    setSiteGroup(target.siteGroup);
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

  function chooseGroup(group: 'automotive' | 'vendors') {
    const first = targets.find((target) => target.siteGroup === group);
    setSiteGroup(group);
    if (first) chooseTarget(`${first.targetType}:${first.id}`);
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
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider opacity-60">Choose a minisite directory</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              ['automotive', 'Automotive & vehicle minisites', 'Brands, models, cars, motorcycles and scooters'],
              ['vendors', 'Vendor minisites', 'Agencies, showrooms, service, finance and parts'],
            ] as const).map(([group, title, description]) => {
              const count = targets.filter((target) => target.siteGroup === group).length;
              return (
                <button key={group} type="button" onClick={() => chooseGroup(group)}
                  aria-pressed={siteGroup === group}
                  className={`rounded-xl border p-3 text-start transition ${siteGroup === group ? 'border-[#b28a45] bg-[#b28a45]/[.07] ring-1 ring-[#b28a45]/30' : 'border-black/10 hover:border-black/25'}`}>
                  <span className="flex items-center justify-between gap-2 text-sm font-bold">
                    {title}<span className="rounded-full bg-black/[.06] px-2 py-0.5 text-[10px]">{count}</span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 opacity-60">{description}</span>
                </button>
              );
            })}
          </div>
          <label htmlFor="site-target" className="mb-1 block text-xs font-bold uppercase opacity-60">Site or vehicle</label>
          <select id="site-target" className="w-full rounded-lg border border-black/15 bg-white px-3 py-2" value={selectedKey} onChange={(event) => chooseTarget(event.target.value)}>
            {groupTargets.map((target) => (
              <option key={`${target.targetType}:${target.id}`} value={`${target.targetType}:${target.id}`}>{target.kind} · {target.name}{target.isPublished ? '' : ' (Draft)'}</option>
            ))}
          </select>
        </div>

        <section aria-label="Minisite taxonomy hierarchy" className="space-y-2 rounded-xl border border-black/10 p-3">
          <div className="mb-2">
            <h3 className="text-sm font-bold">Minisite hierarchy</h3>
            <p className="text-xs opacity-60">Market → category → type → minisite</p>
          </div>
          {!hierarchy.length ? (
            <p className="rounded-lg bg-black/[.03] p-3 text-sm opacity-70">No minisites are available in this directory within your account scope.</p>
          ) : hierarchy.map(({ market, categories: marketCategories }) => (
            <details key={market} open={market === selected?.market} className="rounded-lg border border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold hover:bg-black/[.03]">
                <span>{market}</span>
                <span className="rounded-full bg-black/[.06] px-2 py-0.5 text-xs font-semibold">
                  {marketCategories.reduce((total, item) => total + item.count, 0)}
                </span>
              </summary>
              <div className="space-y-2 border-t border-black/10 p-2 sm:p-3">
                {marketCategories.map(({ category: categoryName, roots, count }) => (
                  <details key={categoryName} open={categoryName === selected?.category && market === selected?.market}
                    className="rounded-lg border border-black/10 bg-black/[.02]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-semibold hover:bg-black/[.03]">
                      <span>{categoryName}</span>
                      <span className="text-xs opacity-60">{count} minisites</span>
                    </summary>
                    <div className="space-y-1 border-t border-black/10 p-2 sm:p-3">
                      {roots.map((node) => (
                        <MinisiteTreeItem key={node.target.id} node={node} selectedId={selected?.id ?? null} onSelect={chooseTarget} />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </section>

        {selected ? (
          <>
            <div>
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <p className="text-xs opacity-60">{selected.market} · {selected.category} · {selected.kind}</p>
              {selected.parentName ? (
                <p className="mt-1 text-sm">
                  {selected.typeId === 'vehicle_model' ? 'Brand' : 'Parent'}: <span className="font-semibold">{selected.parentName}</span>
                </p>
              ) : null}
              {selected.typeId === 'vehicle_model' ? (
                <p className="mt-1 text-sm opacity-60">Model specifications are edited in this model’s Content Studio under the Fields tab.</p>
              ) : null}
              <p className="mt-1 text-sm opacity-60">Choose a category-specific visual preset, then customize its colors and logo. The category’s own sections and fields are configured in Platform Setup.</p>
              <p className="text-sm opacity-60">
                {selected.targetType === 'business'
                  ? 'Customer minisites share the Auto One Egypt-inspired layout and page structure. Customize this customer’s colors and logo without changing the design.'
                  : 'Customize this vehicle mini-site layout, colors, and logo. Its photos, videos, and carousel slides are managed separately in the vehicle media editor.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {templates.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => chooseTemplate(template.id)}
                    aria-pressed={templateId === template.id}
                    className={`rounded-xl border p-4 text-start transition ${templateId === template.id ? 'border-[#b28a45] ring-2 ring-[#b28a45]/20' : 'border-black/10 hover:border-black/30'}`}
                  >
                    <span className="mb-3 block h-8 rounded" style={{ background: template.backgroundColor, borderBottom: `4px solid ${template.accentColor}` }} />
                    <span className="block text-sm font-bold">{template.name}</span>
                    <span className="mt-1 block text-xs opacity-60">{template.description}</span>
                  </button>
                ))}
            </div>

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
            {selected.typeId === 'vehicle_model' ? 'Edit model specs and content ↗'
              : selected.targetType === 'unit' ? 'Edit vehicle gallery and carousel ↗'
                : 'Edit content, carousel, and blog ↗'}
          </a>
          {selected.pageBuilderUrl ? (
            <a className="block rounded-xl border border-[var(--gold)] p-4 text-sm font-bold hover:bg-black/[.03]" href={selected.pageBuilderUrl}>
              {selected.targetType === 'unit' ? 'Edit vehicle page layout ↗' : 'Manage pages and components ↗'}
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

function MinisiteTreeItem({
  node,
  selectedId,
  onSelect,
}: {
  node: MinisiteTreeNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { target, children } = node;
  const isSelected = selectedId === target.id;
  return (
    <div className="min-w-0">
      <div className={`flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 transition ${
        isSelected ? 'border-[#c6a363] bg-[#c6a363]/10' : 'border-black/10 hover:border-[#c6a363]/60'
      }`}>
        {children.length ? <span aria-hidden="true" className="text-xs opacity-60">├─</span> : <span aria-hidden="true" className="text-xs opacity-60">•</span>}
        <button type="button" onClick={() => onSelect(target.id)} aria-current={isSelected ? 'true' : undefined}
          className="min-w-0 flex-1 text-start">
          <span className="block truncate text-sm font-semibold">{target.name}</span>
          <span className="block text-xs opacity-60">
            {target.kind} · {target.isPublished ? 'Published' : 'Draft'}
          </span>
        </button>
        {children.length ? <span className="shrink-0 rounded-full bg-black/[.06] px-2 py-0.5 text-xs">{children.length}</span> : null}
      </div>
      {children.length ? (
        <div className="ms-4 mt-1 space-y-1 border-s border-black/10 ps-2">
          {children.map((child) => (
            <MinisiteTreeItem key={child.target.id} node={child} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
