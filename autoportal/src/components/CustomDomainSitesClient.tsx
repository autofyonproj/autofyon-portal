'use client';

import { useState } from 'react';
import {
  type CustomSiteOverrideField,
  type CustomSiteProfile,
  type CustomSiteVehicleOverride,
  type SiteTemplate,
} from '@/lib/site-builder';

interface CustomDomainVehicle {
  id: string;
  title: string;
  titleAr: string | null;
  year: number | null;
  mileageKm: number | null;
  priceEgp: number | null;
  currency: string;
  status: string;
  overrides: CustomSiteVehicleOverride;
}
interface CustomDomainSite extends CustomSiteProfile {
  id: string;
  name: string;
  slug: string;
  customDomain: string;
  vehicles: CustomDomainVehicle[];
}

const INVENTORY_OPTIONS = [
  { key: 'showYear', label: 'Show model year' },
  { key: 'showPrice', label: 'Show price' },
  { key: 'showAvailability', label: 'Show availability' },
  { key: 'showMileage', label: 'Show mileage' },
  { key: 'showAutofyonDetailsLink', label: 'Link to full AUTOFYON vehicle details' },
] as const;

const OVERRIDE_OPTIONS: Array<{ key: CustomSiteOverrideField; label: string }> = [
  { key: 'price', label: 'Price' },
  { key: 'availability', label: 'Availability' },
  { key: 'promotionalCopy', label: 'Promotional copy' },
  { key: 'specifications', label: 'Specifications note' },
  { key: 'media', label: 'Primary card image URL' },
];

export default function CustomDomainSitesClient({
  initialSites,
  templates,
}: {
  initialSites: CustomDomainSite[];
  templates: SiteTemplate[];
}) {
  const [sites, setSites] = useState(initialSites);
  const [selectedId, setSelectedId] = useState(initialSites[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialSites[0]?.vehicles[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const selected = sites.find((site) => site.id === selectedId);
  const selectedVehicle = selected?.vehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  function updateSite(changes: Partial<CustomDomainSite>) {
    if (!selected) return;
    setSites((current) => current.map((site) => site.id === selected.id ? { ...site, ...changes } : site));
  }

  function updateVehicleOverride<K extends keyof CustomSiteVehicleOverride>(
    key: K,
    value: CustomSiteVehicleOverride[K],
  ) {
    if (!selected || !selectedVehicle) return;
    setSites((current) => current.map((site) => site.id !== selected.id ? site : {
    ...site,
    vehicles: site.vehicles.map((vehicle) => vehicle.id !== selectedVehicle.id ? vehicle : {
      ...vehicle,
      overrides: { ...vehicle.overrides, [key]: value },
    }),
    }));
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/admin/custom-sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selected.id,
          templateId: selected.templateId,
          inventoryOptions: selected.inventoryOptions,
          overrideOptions: selected.overrideOptions,
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not save custom-domain settings.');
      setMessage('Custom-domain template, inventory presentation, and override policy saved.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save custom-domain settings.');
    } finally {
      setSaving(false);
    }
  }

  async function saveVehicleOverride() {
    if (!selected || !selectedVehicle) return;
    setSavingVehicle(true);
    setMessage('');
    setError('');
    const overrides: Record<string, unknown> = {};
    for (const field of selected.overrideOptions) {
      if (field === 'price') overrides.price = selectedVehicle.overrides.priceEgp ?? null;
      if (field === 'availability') overrides.availability = selectedVehicle.overrides.availability ?? null;
      if (field === 'promotionalCopy') overrides.promotionalCopy = selectedVehicle.overrides.promotionalCopy ?? null;
      if (field === 'specifications') overrides.specifications = selectedVehicle.overrides.specificationsNote ?? null;
      if (field === 'media') overrides.media = selectedVehicle.overrides.mediaUrl ?? null;
    }
    try {
      const response = await fetch(`/api/admin/custom-sites/${encodeURIComponent(selected.id)}/vehicles/${encodeURIComponent(selectedVehicle.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides }),
      });
      const result = await response.json() as { error?: string; overrides?: CustomSiteVehicleOverride };
      if (!response.ok) throw new Error(result.error || 'Could not save this vehicle override.');
      if (result.overrides) {
        setSites((current) => current.map((site) => site.id !== selected.id ? site : {
          ...site,
          vehicles: site.vehicles.map((vehicle) => vehicle.id === selectedVehicle.id
            ? { ...vehicle, overrides: result.overrides ?? {} }
            : vehicle),
        }));
      }
      setMessage('Vehicle presentation saved for the custom domain only.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save this vehicle override.');
    } finally {
      setSavingVehicle(false);
    }
  }

  if (!sites.length) {
    return <p className="rounded-xl border border-black/10 p-5 text-sm opacity-70">No active published businesses have a custom domain assigned.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="space-y-5 rounded-2xl border border-black/10 bg-white p-5">
        <label className="block text-xs font-bold">
          Client custom-domain site
          <select
            value={selectedId}
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedId(nextId);
              setSelectedVehicleId(sites.find((site) => site.id === nextId)?.vehicles[0]?.id ?? '');
              setMessage('');
              setError('');
            }}
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal"
          >
            {sites.map((site) => <option key={site.id} value={site.id}>{site.name} · {site.customDomain}</option>)}
          </select>
        </label>

        {selected ? (
          <>
            <div>
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <p className="text-sm opacity-60">
                The AUTOFYON slug remains the marketplace presence. This template controls the separately branded site served on the client’s custom domain.
              </p>
              <p className="mt-1 text-xs opacity-60">
                Portal presence: <a className="underline" href={`/${selected.slug}`} target="_blank" rel="noreferrer">/{selected.slug}</a>
                {' · '}Custom domain: <a className="underline" href={`https://${selected.customDomain}`} target="_blank" rel="noreferrer">{selected.customDomain}</a>
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm font-bold">Platform-assigned template</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {templates.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => updateSite({ templateId: template.id })}
                    aria-pressed={selected.templateId === template.id}
                    className={`rounded-xl border p-4 text-start transition ${selected.templateId === template.id ? 'border-[var(--gold)] ring-2 ring-[var(--gold-glass)]' : 'border-black/10 hover:border-black/30'}`}
                  >
                    <span className="mb-3 block h-8 rounded" style={{ background: template.backgroundColor, borderBottom: `4px solid ${template.accentColor}` }} />
                    <span className="block text-sm font-bold">{template.name}</span>
                    <span className="mt-1 block text-xs opacity-60">{template.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-black/10 p-4">
              <legend className="px-1 text-sm font-bold">Custom-site vehicle cards</legend>
              <p className="text-xs opacity-60">Vehicle facts come from AUTOFYON’s canonical inventory. These options only control the custom-domain presentation.</p>
              {INVENTORY_OPTIONS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.inventoryOptions[key]}
                    onChange={(event) => updateSite({
                      inventoryOptions: { ...selected.inventoryOptions, [key]: event.target.checked },
                    })}
                    className="h-4 w-4 accent-[var(--gold)]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-black/10 p-4">
              <legend className="px-1 text-sm font-bold">Allowed custom-site vehicle overrides</legend>
              <p className="text-xs opacity-60">Enabled fields may differ on the client domain. AUTOFYON listings remain unchanged.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OVERRIDE_OPTIONS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.overrideOptions.includes(key)}
                      onChange={(event) => updateSite({
                        overrideOptions: event.target.checked
                          ? [...selected.overrideOptions, key]
                          : selected.overrideOptions.filter((field) => field !== key),
                      })}
                      className="h-4 w-4 accent-[var(--gold)]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            {selected.vehicles.length ? (
              <fieldset className="space-y-4 rounded-xl border border-black/10 p-4">
                <legend className="px-1 text-sm font-bold">Per-vehicle custom-domain presentation</legend>
                <p className="text-xs opacity-60">Select an active published vehicle and edit only the fields allowed above. Leave a field blank to use its canonical AUTOFYON value.</p>
                <label className="block text-xs font-bold">
                  Vehicle
                  <select
                    value={selectedVehicleId}
                    onChange={(event) => setSelectedVehicleId(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal"
                  >
                    {selected.vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.title}{vehicle.year ? ` · ${vehicle.year}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedVehicle ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selected.overrideOptions.includes('price') ? (
                      <label className="text-xs font-bold">Custom-site price (EGP)
                        <input type="number" min="1" max="500000000" value={selectedVehicle.overrides.priceEgp ?? ''} onChange={(event) => updateVehicleOverride('priceEgp', event.target.value ? Number(event.target.value) : undefined)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
                      </label>
                    ) : null}
                    {selected.overrideOptions.includes('availability') ? (
                      <label className="text-xs font-bold">Custom-site availability
                        <select value={selectedVehicle.overrides.availability ?? ''} onChange={(event) => updateVehicleOverride('availability', event.target.value ? event.target.value as CustomSiteVehicleOverride['availability'] : undefined)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
                          <option value="">Use AUTOFYON status</option>
                          <option value="available">Available</option><option value="reserved">Reserved</option>
                          <option value="sold">Sold</option><option value="rented">Rented</option>
                        </select>
                      </label>
                    ) : null}
                    {selected.overrideOptions.includes('promotionalCopy') ? (
                      <label className="text-xs font-bold sm:col-span-2">Promotional copy
                        <textarea maxLength={500} value={selectedVehicle.overrides.promotionalCopy ?? ''} onChange={(event) => updateVehicleOverride('promotionalCopy', event.target.value || undefined)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" rows={2} />
                      </label>
                    ) : null}
                    {selected.overrideOptions.includes('specifications') ? (
                      <label className="text-xs font-bold sm:col-span-2">Custom-site specifications note
                        <textarea maxLength={1000} value={selectedVehicle.overrides.specificationsNote ?? ''} onChange={(event) => updateVehicleOverride('specificationsNote', event.target.value || undefined)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" rows={2} />
                      </label>
                    ) : null}
                    {selected.overrideOptions.includes('media') ? (
                      <label className="text-xs font-bold sm:col-span-2">Custom-site primary image (HTTPS URL)
                        <input type="url" value={selectedVehicle.overrides.mediaUrl ?? ''} onChange={(event) => updateVehicleOverride('mediaUrl', event.target.value || undefined)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
                      </label>
                    ) : null}
                    {selected.overrideOptions.length ? (
                      <button type="button" disabled={savingVehicle} onClick={() => void saveVehicleOverride()} className="w-fit rounded-lg border border-black/20 px-4 py-2 text-sm font-bold disabled:opacity-50 sm:col-span-2">
                        {savingVehicle ? 'Saving vehicle…' : 'Save vehicle presentation'}
                      </button>
                    ) : <p className="text-xs opacity-60 sm:col-span-2">Enable at least one override field to edit this vehicle.</p>}
                  </div>
                ) : null}
              </fieldset>
            ) : (
              <p className="rounded-xl border border-dashed border-black/20 p-4 text-sm opacity-60">No active published vehicles are available for custom-site overrides.</p>
            )}

            {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
            <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {saving ? 'Saving…' : 'Save custom-domain site'}
            </button>
          </>
        ) : null}
      </section>

      <aside className="space-y-3">
        <div className="rounded-xl border border-black/10 p-4 text-sm">
          <h3 className="font-bold">How the two presences differ</h3>
          <p className="mt-2 text-xs leading-5 opacity-70">The client domain gets its assigned template and inventory-card options. The AUTOFYON slug keeps its marketplace presentation and canonical vehicle data.</p>
        </div>
      </aside>
    </div>
  );
}
