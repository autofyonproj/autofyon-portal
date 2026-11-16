'use client';

import { useState } from 'react';

interface Vendor {
  id: string;
  name: string;
  slug: string;
}

interface Vehicle {
  id: string;
  title: string;
  title_ar: string | null;
  seller_name: string;
}

interface Site {
  vendor_business_id: string;
  enabled: number;
  updated_at: string;
  vendor_name: string;
  vendor_slug: string;
}

interface Proposal {
  id: string;
  vendor_business_id: string;
  direction: 'import' | 'export';
  external_vehicle_id: string;
  unit_id: string | null;
  version_hash: string;
  payload: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  decided_at: string | null;
  vendor_name: string;
  vendor_slug: string;
}

interface ExchangeData {
  sites: Site[];
  proposals: Proposal[];
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

export default function VehicleExchangeAdminClient({
  vendors,
  vehicles,
  initialData,
}: {
  vendors: Vendor[];
  vehicles: Vehicle[];
  initialData: ExchangeData;
}) {
  const [data, setData] = useState(initialData);
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? '');
  const [unitId, setUnitId] = useState('');
  const [token, setToken] = useState('');
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [publishImports, setPublishImports] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refresh() {
    const next = await requestJson<ExchangeData>('/api/admin/vehicle-exchange');
    setData(next);
  }

  async function rotateToken() {
    if (!vendorId) return;
    setBusy('token');
    setError('');
    setNotice('');
    setToken('');
    try {
      const result = await requestJson<{ token: string }>('/api/admin/vehicle-exchange', {
        method: 'POST',
        body: JSON.stringify({ action: 'rotate_token', vendor_business_id: vendorId }),
      });
      setToken(result.token);
      setNotice('Exchange key created and enabled. Copy it now; it is shown only once.');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create the exchange key.');
    } finally {
      setBusy('');
    }
  }

  async function disableSite() {
    if (!vendorId) return;
    setBusy('disable');
    setError('');
    setNotice('');
    try {
      await requestJson('/api/admin/vehicle-exchange', {
        method: 'POST',
        body: JSON.stringify({ action: 'disable_site', vendor_business_id: vendorId }),
      });
      setNotice('Vehicle exchange disabled for this client site.');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not disable vehicle exchange.');
    } finally {
      setBusy('');
    }
  }

  async function stageExport() {
    if (!vendorId || !unitId) return;
    setBusy('stage');
    setError('');
    setNotice('');
    try {
      await requestJson('/api/admin/vehicle-exchange', {
        method: 'POST',
        body: JSON.stringify({ action: 'stage_export', vendor_business_id: vendorId, unit_id: unitId }),
      });
      setNotice('Vehicle snapshot staged. Review and approve it below before it becomes available to the client site.');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not stage this vehicle.');
    } finally {
      setBusy('');
    }
  }

  async function decide(proposal: Proposal, decision: 'approve' | 'reject') {
    const rejectionReason = rejectReasons[proposal.id]?.trim() ?? '';
    if (decision === 'reject' && !rejectionReason) {
      setError('Enter a reason before rejecting a proposal.');
      return;
    }
    setBusy(proposal.id);
    setError('');
    setNotice('');
    try {
      await requestJson('/api/admin/vehicle-exchange', {
        method: 'PATCH',
        body: JSON.stringify({
          proposal_id: proposal.id,
          decision,
          rejection_reason: rejectionReason,
          publish: publishImports[proposal.id] === true,
        }),
      });
      setNotice(decision === 'approve'
        ? proposal.direction === 'import'
          ? 'Import approved and applied. Any future update must be submitted and approved separately.'
          : 'Export approved. The client site can now fetch this approved snapshot.'
        : 'Proposal rejected; no vehicle data was applied.');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update this proposal.');
    } finally {
      setBusy('');
    }
  }

  const selectedVendor = vendors.find((vendor) => vendor.id === vendorId);
  const site = data.sites.find((item) => item.vendor_business_id === vendorId);
  const pending = data.proposals.filter((proposal) => proposal.status === 'pending');

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="font-bold">Client exchange access</h2>
        <label className="block space-y-1 text-sm font-semibold">
          <span>Client minisite</span>
          <select
            value={vendorId}
            onChange={(event) => { setVendorId(event.target.value); setToken(''); setNotice(''); }}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2"
          >
            <option value="">Choose a client site…</option>
            {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
          </select>
        </label>
        {selectedVendor ? (
          <div className="space-y-3">
            <p className="text-sm opacity-70">
              Access is {site?.enabled ? 'enabled' : 'not yet configured'}.
              The client uses its private server-side key to submit car updates and fetch approved outbound snapshots.
            </p>
            <button
              type="button"
              disabled={busy !== ''}
              onClick={() => void rotateToken()}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              {busy === 'token' ? 'Creating…' : site ? 'Rotate key and enable exchange' : 'Create key and enable exchange'}
            </button>
            {site?.enabled ? (
              <button
                type="button"
                disabled={busy !== ''}
                onClick={() => void disableSite()}
                className="ms-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
              >
                {busy === 'disable' ? 'Disabling…' : 'Disable exchange'}
              </button>
            ) : null}
            {token ? (
              <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-50 p-3">
                <p className="text-sm font-bold text-amber-900">Copy this key to the client server secret store now. It cannot be shown again.</p>
                <code className="block break-all rounded bg-white p-2 text-xs">{token}</code>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="font-bold">Send a portal vehicle to the client</h2>
        <p className="text-sm opacity-70">The exported snapshot includes approved carousel media, car specs, social links, selected design, and this client’s published offer. Assign and publish the car for this client before staging. Approval is required for every staged version.</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select value={vendorId} onChange={(event) => setVendorId(event.target.value)} className="rounded-lg border border-black/15 bg-white px-3 py-2">
            <option value="">Choose a client site…</option>
            {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
          </select>
          <select value={unitId} onChange={(event) => setUnitId(event.target.value)} className="min-w-0 rounded-lg border border-black/15 bg-white px-3 py-2">
            <option value="">Choose a published car…</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.title_ar || vehicle.title} · {vehicle.seller_name}</option>)}
          </select>
          <button type="button" disabled={!vendorId || !unitId || busy !== ''} onClick={() => void stageExport()} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {busy === 'stage' ? 'Staging…' : 'Stage snapshot'}
          </button>
        </div>
      </section>

      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {notice ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p> : null}

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Approval queue ({pending.length} pending)</h2>
        {!pending.length ? <p className="rounded-xl border border-dashed border-black/20 p-5 text-sm opacity-60">No vehicle changes are waiting for approval.</p> : null}
        {pending.map((proposal) => {
          let summary = 'Snapshot details unavailable';
          try {
            const payload = JSON.parse(proposal.payload) as { vehicle?: { title?: string; title_ar?: string | null }; media?: unknown[]; socialLinks?: object };
            summary = `${payload.vehicle?.title_ar || payload.vehicle?.title || proposal.external_vehicle_id} · ${payload.media?.length ?? 0} media items · ${Object.keys(payload.socialLinks ?? {}).length} social links`;
          } catch { /* Invalid persisted payload is surfaced by the decision endpoint. */ }
          return (
            <article key={proposal.id} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold">{proposal.direction === 'import' ? 'Import from' : 'Export to'} {proposal.vendor_name}</h3>
                  <p className="mt-1 text-sm opacity-70">{summary}</p>
                  <p className="mt-1 font-mono text-[11px] opacity-50">Version {proposal.version_hash.slice(0, 16)} · {new Date(proposal.created_at).toLocaleString()}</p>
                </div>
                <details className="max-w-full">
                  <summary className="cursor-pointer text-xs font-bold underline">Review snapshot JSON</summary>
                  <pre className="mt-2 max-h-80 max-w-full overflow-auto rounded bg-neutral-950 p-3 text-[11px] text-white">{JSON.stringify(JSON.parse(proposal.payload), null, 2)}</pre>
                </details>
              </div>
              {proposal.direction === 'import' ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={publishImports[proposal.id] ?? false}
                    onChange={(event) => setPublishImports((current) => ({ ...current, [proposal.id]: event.target.checked }))}
                  />
                  Publish imported vehicle on AUTOFYON after approval
                </label>
              ) : null}
              <label className="block space-y-1 text-xs font-bold">
                Rejection reason (required to reject)
                <textarea
                  value={rejectReasons[proposal.id] ?? ''}
                  onChange={(event) => setRejectReasons((current) => ({ ...current, [proposal.id]: event.target.value }))}
                  maxLength={500}
                  rows={2}
                  className="w-full rounded-lg border border-black/15 px-3 py-2 font-normal"
                />
              </label>
              <div className="flex gap-2">
                <button type="button" disabled={busy !== ''} onClick={() => void decide(proposal, 'approve')} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                  {busy === proposal.id ? 'Saving…' : 'Approve this version'}
                </button>
                <button type="button" disabled={busy !== ''} onClick={() => void decide(proposal, 'reject')} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50">
                  Reject
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <details className="rounded-xl border border-black/10 p-4">
        <summary className="cursor-pointer text-sm font-bold">Previously decided vehicle updates</summary>
        <div className="mt-3 space-y-2">
          {data.proposals.filter((proposal) => proposal.status !== 'pending').map((proposal) => (
            <div key={proposal.id} className="rounded-lg bg-black/[.03] p-3 text-sm">
              <strong>{proposal.status}</strong> · {proposal.direction} · {proposal.vendor_name} · {proposal.external_vehicle_id}
              {proposal.rejection_reason ? <p className="mt-1 text-xs text-red-700">{proposal.rejection_reason}</p> : null}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
