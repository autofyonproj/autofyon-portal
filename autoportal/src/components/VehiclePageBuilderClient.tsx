'use client';

import { useState } from 'react';
import {
  DEFAULT_UNIT_PAGE_COMPONENTS,
  type UnitPageComponent,
} from '@/lib/site-pages';

const LABELS: Record<UnitPageComponent, string> = {
  identity: 'Vehicle name and identity',
  hero: 'Hero carousel',
  price: 'Price and price status',
  specifications: 'Vehicle specifications',
  offers: 'Model offers',
  price_history: 'Price history',
  seller: 'Seller contact and social links',
  trim: 'Trim information',
  similar: 'Similar vehicles',
  browse_all: 'Browse all vehicles link',
};

export default function VehiclePageBuilderClient({
  unitId,
  initialComponents,
  previewUrl,
}: {
  unitId: string;
  initialComponents: UnitPageComponent[];
  previewUrl: string;
}) {
  const [components, setComponents] = useState(initialComponents);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const required = (component: UnitPageComponent) => component === 'identity' || component === 'price';

  function toggle(component: UnitPageComponent) {
    if (required(component)) return;
    setComponents((current) => current.includes(component)
      ? current.filter((item) => item !== component)
      : [...current, component]);
  }
  function move(component: UnitPageComponent, direction: -1 | 1) {
    setComponents((current) => {
      const index = current.indexOf(component);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }
  async function persist(action: 'save' | 'publish') {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/units/${encodeURIComponent(unitId)}/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, components }),
      });
      const result = await response.json() as { error?: string; draft?: UnitPageComponent[] };
      if (!response.ok) throw new Error(result.error || 'Could not save vehicle page layout.');
      setNotice(action === 'publish' ? 'Vehicle page layout published.' : 'Draft saved; the public layout is unchanged.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save vehicle page layout.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <a href={`${previewUrl}?preview=1`} target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Preview draft ↗</a>
        <a href={previewUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Live page ↗</a>
      </div>
      <p className="text-sm opacity-70">Choose which page sections visitors see, and reorder them. Vehicle identity and price remain required. Specs, media, offers, and contact details still come from their existing records.</p>
      <ol className="space-y-2">
        {DEFAULT_UNIT_PAGE_COMPONENTS.map((component) => {
          const index = components.indexOf(component);
          return (
            <li key={component} className="flex items-center gap-3 rounded-xl border border-black/10 p-3">
              <input type="checkbox" checked={index >= 0} disabled={required(component)} onChange={() => toggle(component)} aria-label={`Show ${LABELS[component]}`} />
              <span className="min-w-0 flex-1 text-sm font-semibold">{LABELS[component]}{required(component) ? ' · required' : ''}</span>
              {index >= 0 ? (
                <span className="text-xs opacity-50">Position {index + 1}</span>
              ) : null}
              <button type="button" disabled={index <= 0} onClick={() => move(component, -1)} aria-label={`Move ${LABELS[component]} up`} className="rounded border border-black/15 px-2 py-1 disabled:opacity-30">↑</button>
              <button type="button" disabled={index < 0 || index === components.length - 1} onClick={() => move(component, 1)} aria-label={`Move ${LABELS[component]} down`} className="rounded border border-black/15 px-2 py-1 disabled:opacity-30">↓</button>
            </li>
          );
        })}
      </ol>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={saving} onClick={() => void persist('save')} className="rounded-lg border border-black/20 px-4 py-2 text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save draft'}</button>
        <button type="button" disabled={saving} onClick={() => void persist('publish')} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Publish layout</button>
      </div>
    </div>
  );
}
