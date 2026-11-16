'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Offer {
  unit_id: string;
  vendor_business_id: string;
  price_egp: number | null;
  price_currency: string;
  negotiable: number;
  status: string;
  availability_note: string | null;
  availability_note_ar: string | null;
  published: number;
  unit_slug: string;
  unit_title: string;
  unit_title_ar: string | null;
  vendor_name: string;
  vendor_name_ar: string | null;
  vendor_slug: string;
}

export default function UnitVendorOfferEditor({ offer }: { offer: Offer }) {
  const router = useRouter();
  const [form, setForm] = useState({
    price_egp: offer.price_egp?.toString() ?? '',
    status: offer.status,
    negotiable: offer.negotiable,
    availability_note: offer.availability_note ?? '',
    availability_note_ar: offer.availability_note_ar ?? '',
    published: offer.published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function save(publish?: number) {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const body = {
        vendor_business_id: offer.vendor_business_id,
        price_egp: form.price_egp ? Number(form.price_egp) : null,
        price_currency: offer.price_currency,
        status: form.status,
        negotiable: form.negotiable,
        availability_note: form.availability_note || null,
        availability_note_ar: form.availability_note_ar || null,
        published: publish ?? form.published,
      };
      const response = await fetch(`/api/admin/units/${encodeURIComponent(offer.unit_id)}/vendor-offer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save your offer.');
      setForm((current) => ({ ...current, published: body.published }));
      setMessage(body.published ? 'Offer saved and published to your vendor mini-site.' : 'Offer saved as a draft.');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save your offer.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm';
  return (
    <div className="space-y-5">
      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">Your car offer</h1>
        <p className="mt-1 text-sm opacity-70">{offer.unit_title_ar || offer.unit_title} · {offer.vendor_name_ar || offer.vendor_name}</p>
        <p className="mt-2 text-sm opacity-70">
          You can edit your own price and availability. Vehicle specifications, photos, and carousel are controlled by the car owner.
        </p>
      </header>
      <section className="grid gap-4 rounded-xl border border-black/10 bg-white p-5 sm:grid-cols-2">
        <label className="text-xs font-bold">
          Your price (EGP; leave blank for contact)
          <input type="number" min={1} step={1} value={form.price_egp} onChange={(event) => setForm({ ...form, price_egp: event.target.value })} className={inputClass} />
        </label>
        <label className="text-xs font-bold">
          Availability
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="inactive">Not listed</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.negotiable === 1} onChange={(event) => setForm({ ...form, negotiable: event.target.checked ? 1 : 0 })} />
          Price is negotiable
        </label>
        <label className="text-xs font-bold">
          Availability note
          <input maxLength={500} value={form.availability_note} onChange={(event) => setForm({ ...form, availability_note: event.target.value })} className={inputClass} />
        </label>
        <label className="text-xs font-bold sm:col-span-2">
          Arabic availability note
          <input dir="rtl" maxLength={500} value={form.availability_note_ar} onChange={(event) => setForm({ ...form, availability_note_ar: event.target.value })} className={inputClass} />
        </label>
      </section>
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <a
          href={`/admin/showroom/${encodeURIComponent(offer.vendor_business_id)}`}
          className="rounded-lg border border-black/15 px-5 py-2.5 text-sm font-bold"
        >
          Manage vendor contact details
        </a>
        <button type="button" disabled={saving} onClick={() => void save(0)} className="rounded-lg border border-black/15 px-5 py-2.5 text-sm font-bold disabled:opacity-50">
          Save draft
        </button>
        <button type="button" disabled={saving} onClick={() => void save(1)} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Publish my offer'}
        </button>
        {offer.published ? (
          <a href={`/${offer.vendor_slug}/u/${offer.unit_slug}`} className="rounded-lg border border-black/15 px-5 py-2.5 text-sm font-bold">
            Preview car mini-site ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
