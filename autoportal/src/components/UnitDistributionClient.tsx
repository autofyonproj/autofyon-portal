'use client';

import { useState } from 'react';

interface VendorChoice {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  type_id: string;
}

interface VendorOffer {
  id: string;
  vendor_business_id: string;
  price_egp: number | null;
  status: string;
  published: number;
  vendor_name: string;
  vendor_name_ar: string | null;
  vendor_slug: string;
  vendor_type: string;
}

export default function UnitDistributionClient({
  unitId,
  unitSlug,
  ownerBusinessId,
  canManageDistribution,
  vendors,
  initialOffers,
}: {
  unitId: string;
  unitSlug: string;
  ownerBusinessId: string;
  canManageDistribution: boolean;
  vendors: VendorChoice[];
  initialOffers: VendorOffer[];
}) {
  const [offers, setOffers] = useState(initialOffers);
  const [vendorId, setVendorId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const assigned = new Set(offers.map((offer) => offer.vendor_business_id));
  const availableVendors = vendors.filter((vendor) =>
    vendor.id !== ownerBusinessId && !assigned.has(vendor.id),
  );

  async function addVendor() {
    if (!vendorId) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/units/${encodeURIComponent(unitId)}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_business_id: vendorId }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not assign this car to the vendor.');
      window.location.reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not assign this car to the vendor.');
    } finally {
      setSaving(false);
    }
  }

  async function setPublished(offer: VendorOffer, published: number) {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/units/${encodeURIComponent(unitId)}/vendors`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_business_id: offer.vendor_business_id, published }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not update vendor distribution.');
      setOffers((current) => current.map((item) =>
        item.id === offer.id ? { ...item, published } : item,
      ));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update vendor distribution.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="font-bold">Add this car to a vendor mini-site</h2>
        <p className="text-sm opacity-70">
          The car details and media stay shared from the owner. Each vendor edits only their own price, availability, and vendor contact profile.
        </p>
        {canManageDistribution ? <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={vendorId}
            onChange={(event) => setVendorId(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-2"
          >
            <option value="">Choose a vendor…</option>
            {availableVendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name_ar || vendor.name} · {vendor.type_id.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!vendorId || saving}
            onClick={() => void addVendor()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? 'Working…' : 'Assign vendor'}
          </button>
        </div> : null}
        {canManageDistribution && !availableVendors.length ? <p className="text-xs opacity-60">All eligible vendors are already assigned.</p> : null}
      </section>

      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <section className="space-y-3">
        <h2 className="font-bold">Vendor offers ({offers.length})</h2>
        {offers.map((offer) => (
          <article key={offer.id} className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold">{offer.vendor_name_ar || offer.vendor_name}</h3>
              <p className="text-xs opacity-60">
                {offer.vendor_type.replaceAll('_', ' ')} · {offer.price_egp == null ? 'No price yet' : `${offer.price_egp.toLocaleString()} EGP`} · {offer.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canManageDistribution ? (
                <a
                  href={`/admin/vendor-offers/${encodeURIComponent(unitId)}?vendor_business_id=${encodeURIComponent(offer.vendor_business_id)}`}
                  className="rounded-lg border border-black/15 px-3 py-2 text-xs font-bold"
                >
                  Edit offer
                </a>
              ) : null}
              <a
                href={`/${offer.vendor_slug}/u/${encodeURIComponent(unitSlug)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-black/15 px-3 py-2 text-xs font-bold"
              >
                Preview vendor page ↗
              </a>
              {canManageDistribution ? <button
                type="button"
                disabled={saving || offer.vendor_business_id === ownerBusinessId}
                onClick={() => void setPublished(offer, offer.published ? 0 : 1)}
                className="rounded-lg border border-black/15 px-3 py-2 text-xs font-bold disabled:opacity-50"
              >
                {offer.vendor_business_id === ownerBusinessId
                  ? 'Owner listing'
                  : offer.published ? 'Unpublish from vendor' : 'Publish to vendor'}
              </button> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
