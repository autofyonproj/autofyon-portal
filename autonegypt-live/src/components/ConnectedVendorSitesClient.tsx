'use client';

import { useEffect, useState } from 'react';
import {
  CONNECTED_SITE_FEATURES,
  CONNECTED_SITE_FEATURE_LABELS,
  type ConnectedSiteFeature,
} from '@/lib/connected-vendor-sites';

interface VendorChoice {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
}

interface SiteConfig {
  allowedOrigin: string;
  enabled: boolean;
  features: ConnectedSiteFeature[];
}

interface VendorSiteResponse {
  business: VendorChoice;
  site: SiteConfig;
  error?: string;
}

export default function ConnectedVendorSitesClient({ vendors }: { vendors: VendorChoice[] }) {
  const [businessId, setBusinessId] = useState('');
  const [site, setSite] = useState<SiteConfig>({
    allowedOrigin: '',
    enabled: false,
    features: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!businessId) return;
    let active = true;
    fetch(`/api/admin/vendor-sites/${encodeURIComponent(businessId)}`)
      .then(async (response) => {
        const data = await response.json() as VendorSiteResponse;
        if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
        if (active) setSite(data.site);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Could not load site settings.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [businessId]);

  function updateFeature(feature: ConnectedSiteFeature, checked: boolean) {
    setSite((current) => ({
      ...current,
      features: checked
        ? [...new Set([...current.features, feature])]
        : current.features.filter((item) => item !== feature),
    }));
  }

  async function save() {
    if (!businessId) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/vendor-sites/${encodeURIComponent(businessId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      const data = await response.json() as { site?: SiteConfig; error?: string };
      if (!response.ok || !data.site) throw new Error(data.error || `Request failed (${response.status})`);
      setSite(data.site);
      setNotice('Connected-site settings saved. The external site can now read the selected public data.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save connected-site settings.');
    } finally {
      setSaving(false);
    }
  }

  const selectedVendor = vendors.find((vendor) => vendor.id === businessId);
  const endpoint = selectedVendor
    ? `https://autofyon.com/api/connected-sites/${encodeURIComponent(selectedVendor.slug)}`
    : '';

  return (
    <div className="space-y-5">
      <section className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
        <label className="block space-y-1 text-sm font-semibold">
          <span>Vendor</span>
          <select
            value={businessId}
            onChange={(event) => {
              const nextBusinessId = event.target.value;
              setBusinessId(nextBusinessId);
              setSite({ allowedOrigin: '', enabled: false, features: [] });
              setLoading(Boolean(nextBusinessId));
              setError('');
              setNotice('');
            }}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2"
          >
            <option value="">Choose a vendor…</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>{vendor.name_ar || vendor.name}</option>
            ))}
          </select>
        </label>

        {businessId ? (
          <>
            <label className="block space-y-1 text-sm font-semibold">
              <span>External site origin</span>
              <input
                type="url"
                value={site.allowedOrigin}
                onChange={(event) => setSite((current) => ({ ...current, allowedOrigin: event.target.value }))}
                placeholder="https://vendor.example"
                autoComplete="url"
                className="w-full rounded-lg border border-black/15 px-3 py-2 font-normal"
              />
              <span className="block text-xs font-normal opacity-60">
                Enter only the origin (scheme and host), without a path. HTTPS is required except for localhost testing.
              </span>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-bold">Features this site may read</legend>
              {CONNECTED_SITE_FEATURES.map((feature) => (
                <label key={feature} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={site.features.includes(feature)}
                    onChange={(event) => updateFeature(feature, event.target.checked)}
                  />
                  {CONNECTED_SITE_FEATURE_LABELS[feature]}
                </label>
              ))}
            </fieldset>

            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={site.enabled}
                onChange={(event) => setSite((current) => ({ ...current, enabled: event.target.checked }))}
              />
              Enable connected access
            </label>

            <button
              type="button"
              disabled={loading || saving}
              onClick={() => void save()}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save connected-site settings'}
            </button>
          </>
        ) : null}
      </section>

      {loading ? <p role="status" className="text-sm opacity-60">Loading site settings…</p> : null}
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p> : null}

      {site.enabled && endpoint ? (
        <section className="space-y-2 rounded-xl border border-blue-700/20 bg-blue-50 p-4 text-sm">
          <h2 className="font-bold">Read-only connected data endpoint</h2>
          <code className="block overflow-x-auto rounded bg-white p-2 text-xs">{endpoint}</code>
          <p className="text-xs opacity-80">
            The vendor website must request this endpoint from the exact allowed origin. Only selected, published public data is returned.
          </p>
        </section>
      ) : null}
    </div>
  );
}
