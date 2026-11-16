'use client';

import { useState } from 'react';
import {
  VENDOR_PROSPECT_STATUSES,
  VENDOR_PROSPECT_STATUS_LABELS,
  type VendorProspectStatus,
} from '@/lib/vendor-prospects';

export default function VendorProspectStatusControl({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: VendorProspectStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function changeStatus(value: VendorProspectStatus) {
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/vendor-prospects/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignStatus: value }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not update prospect status.');
      setStatus(value);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update prospect status.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <select
        aria-label="Free-offer outreach status"
        value={status}
        disabled={saving}
        onChange={(event) => void changeStatus(event.target.value as VendorProspectStatus)}
        className="min-w-40 rounded border border-black/15 bg-white px-2 py-1 text-xs"
      >
        {VENDOR_PROSPECT_STATUSES.map((item) => (
          <option key={item} value={item}>{VENDOR_PROSPECT_STATUS_LABELS[item]}</option>
        ))}
      </select>
      {error ? <p role="alert" className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
