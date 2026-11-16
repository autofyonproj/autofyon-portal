'use client';

import { useEffect, useState } from 'react';

type Customer = {
  business_id: string;
  business_name: string;
  business_name_ar: string | null;
  business_slug: string;
  owner_name: string | null;
  owner_email: string | null;
  plan: 'free' | 'paid';
  status: 'active' | 'suspended';
  paid_through: string | null;
  contact_phone: string | null;
  last_seen_at: string | null;
  follow_up_at: string | null;
  notes: string | null;
  updated_at: string | null;
  effective_plan: 'free' | 'paid';
};

function localDate(value: string | null): string {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString();
}

export default function MediaManagerCustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadCustomers() {
    setError('');
    try {
      const response = await fetch('/api/admin/media-manager/customers', { cache: 'no-store' });
      const data = await response.json() as { customers?: Customer[]; error?: string };
      if (!response.ok || !data.customers) throw new Error(data.error || 'Could not load customer records.');
      setCustomers(data.customers);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load customer records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetch('/api/admin/media-manager/customers', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json() as { customers?: Customer[]; error?: string };
        if (!response.ok || !data.customers) throw new Error(data.error || 'Could not load customer records.');
        if (active) setCustomers(data.customers);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Could not load customer records.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  function updateCustomer(businessId: string, changes: Partial<Customer>) {
    setCustomers((items) => items.map((item) => item.business_id === businessId ? { ...item, ...changes } : item));
  }

  async function saveCustomer(customer: Customer) {
    setBusy(customer.business_id);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/media-manager/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: customer.business_id,
          plan: customer.plan,
          status: customer.status,
          paidThrough: customer.plan === 'paid' ? customer.paid_through : null,
          contactPhone: customer.contact_phone || '',
          followUpAt: customer.follow_up_at || null,
          notes: customer.notes || '',
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save customer details.');
      setMessage(`Saved ${customer.business_name_ar || customer.business_name}.`);
      await loadCustomers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save customer details.');
    } finally {
      setBusy(null);
    }
  }

  const freeCount = customers.filter((customer) => customer.effective_plan === 'free').length;
  const paidCount = customers.filter((customer) => customer.effective_plan === 'paid').length;
  const followUpCount = customers.filter((customer) => customer.follow_up_at && customer.follow_up_at <= new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4"><p className="text-xs text-neutral-500">Free / sponsored</p><p className="mt-1 text-2xl font-bold">{freeCount}</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><p className="text-xs text-neutral-500">Paid and currently active</p><p className="mt-1 text-2xl font-bold">{paidCount}</p></div>
        <div className="rounded-xl border border-black/10 bg-white p-4"><p className="text-xs text-neutral-500">Follow-up due</p><p className="mt-1 text-2xl font-bold">{followUpCount}</p></div>
      </div>
      {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p> : null}
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="rounded-xl border border-black/10 p-5 text-sm text-neutral-600">Loading customer accounts…</p> : null}
      {!loading && !customers.length ? <p className="rounded-xl border border-black/10 p-5 text-sm text-neutral-600">No registered business owner accounts are available to follow up yet.</p> : null}

      <div className="space-y-4">
        {customers.map((customer) => {
          const expired = customer.plan === 'paid' && customer.paid_through !== null
            && customer.paid_through < new Date().toISOString().slice(0, 10);
          const key = customer.business_id;
          return (
            <article key={key} className="space-y-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{customer.business_name_ar || customer.business_name}</h2>
                  <p className="text-xs text-neutral-500" dir="ltr">/{customer.business_slug}</p>
                  <p className="mt-1 text-sm">{customer.owner_name || 'Owner name not recorded'} · {customer.owner_email || 'Email not recorded'}</p>
                  <p className="mt-1 text-xs text-neutral-500">Last activity: {localDate(customer.last_seen_at)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${customer.effective_plan === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {customer.effective_plan === 'paid' ? 'Paid · sponsorship removed' : 'Free · AUTOFYON sponsored'}
                  {expired ? ' · expired' : ''}
                </span>
              </header>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-xs font-semibold">Plan
                  <select value={customer.plan} onChange={(event) => updateCustomer(key, { plan: event.target.value as Customer['plan'], status: event.target.value === 'paid' ? 'active' : customer.status, paid_through: event.target.value === 'free' ? null : customer.paid_through })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm">
                    <option value="free">Free · sponsored</option>
                    <option value="paid">Paid · sponsorship removed</option>
                  </select>
                </label>
                <label className="text-xs font-semibold">Account status
                  <select value={customer.status} onChange={(event) => updateCustomer(key, { status: event.target.value as Customer['status'] })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
                <label className="text-xs font-semibold">Paid through
                  <input type="date" value={customer.paid_through || ''} disabled={customer.plan !== 'paid'} onChange={(event) => updateCustomer(key, { paid_through: event.target.value || null })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm disabled:bg-neutral-100" />
                </label>
                <label className="text-xs font-semibold">Contact phone
                  <input type="tel" maxLength={40} value={customer.contact_phone || ''} onChange={(event) => updateCustomer(key, { contact_phone: event.target.value })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm" />
                </label>
                <label className="text-xs font-semibold">Follow-up date
                  <input type="date" value={customer.follow_up_at || ''} onChange={(event) => updateCustomer(key, { follow_up_at: event.target.value || null })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm" />
                </label>
                <label className="text-xs font-semibold sm:col-span-2 lg:col-span-3">Follow-up notes
                  <textarea maxLength={2000} rows={2} value={customer.notes || ''} onChange={(event) => updateCustomer(key, { notes: event.target.value })} className="mt-1 w-full rounded-lg border border-black/15 bg-white p-2 text-sm" />
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-500">Paid plans are activated only after offline payment verification. Changes made here do not charge a customer.</p>
                <button type="button" disabled={busy === key} onClick={() => void saveCustomer(customer)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                  {busy === key ? 'Saving…' : 'Save customer'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
