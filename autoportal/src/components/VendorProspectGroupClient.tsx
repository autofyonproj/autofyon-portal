'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VendorProspectStatus } from '@/lib/vendor-prospects';

type ReviewStatus = 'candidate' | 'confirmed' | 'separated';
type ActivityType = 'note' | 'call' | 'email' | 'whatsapp' | 'meeting' | 'follow_up';

const ACTIVITY_TYPES: Array<{ value: ActivityType; label: string }> = [
  { value: 'note', label: 'Note' },
  { value: 'call', label: 'Manual call' },
  { value: 'whatsapp', label: 'Manual WhatsApp' },
  { value: 'email', label: 'Manual email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'follow_up', label: 'Follow-up' },
];

export default function VendorProspectGroupClient({
  groupId,
  reviewStatus: initialReviewStatus,
  campaignStatus: initialCampaignStatus,
  nextFollowUpAt: initialNextFollowUpAt,
  campaignStatuses,
}: {
  groupId: string;
  reviewStatus: ReviewStatus;
  campaignStatus: VendorProspectStatus;
  nextFollowUpAt: string | null;
  campaignStatuses: Array<{ value: VendorProspectStatus; label: string }>;
}) {
  const router = useRouter();
  const [reviewStatus, setReviewStatus] = useState(initialReviewStatus);
  const [campaignStatus, setCampaignStatus] = useState(initialCampaignStatus);
  const [nextFollowUpAt, setNextFollowUpAt] = useState(initialNextFollowUpAt?.slice(0, 10) ?? '');
  const [activityType, setActivityType] = useState<ActivityType>('note');
  const [summary, setSummary] = useState('');
  const [outcome, setOutcome] = useState('');
  const [activityFollowUpAt, setActivityFollowUpAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function updateGroup(payload: Record<string, unknown>, successMessage: string) {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/admin/vendor-prospect-groups/${encodeURIComponent(groupId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not update this prospect account.');
      if (payload.reviewStatus) setReviewStatus(payload.reviewStatus as ReviewStatus);
      if (payload.campaignStatus) setCampaignStatus(payload.campaignStatus as VendorProspectStatus);
      if (Object.hasOwn(payload, 'nextFollowUpAt')) setNextFollowUpAt(String(payload.nextFollowUpAt ?? ''));
      setMessage(successMessage);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update this prospect account.');
    } finally {
      setSaving(false);
    }
  }

  async function saveActivity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/admin/vendor-prospect-groups/${encodeURIComponent(groupId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType,
          summary,
          outcome,
          nextFollowUpAt: activityFollowUpAt || null,
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not save this CRM activity.');
      setSummary('');
      setOutcome('');
      setActivityFollowUpAt('');
      if (activityFollowUpAt) setNextFollowUpAt(activityFollowUpAt);
      setMessage('CRM activity saved. No message was sent.');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save this CRM activity.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
        <div>
          <h2 className="font-bold">Company identity review</h2>
          <p className="mt-1 text-xs opacity-65">A match is provisional until an admin confirms these are the same organization.</p>
        </div>
        <p className="text-sm">Current review: <strong>{reviewStatus === 'candidate' ? 'Needs review' : reviewStatus === 'confirmed' ? 'Confirmed company' : 'Separated into individual leads'}</strong></p>
        {reviewStatus === 'candidate' ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={saving} onClick={() => void updateGroup({ reviewStatus: 'confirmed' }, 'Company group confirmed.')} className="rounded-lg bg-green-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              Confirm same company
            </button>
            <button type="button" disabled={saving} onClick={() => {
              if (window.confirm('Separate these records into individual leads? Their source data will be preserved.')) {
                void updateGroup({ reviewStatus: 'separated' }, 'Records separated; each remains an individual lead.');
              }
            }} className="rounded-lg border border-black/20 px-4 py-2 text-sm font-bold disabled:opacity-50">
              Separate records
            </button>
          </div>
        ) : reviewStatus === 'confirmed' ? (
          <button type="button" disabled={saving} onClick={() => {
            if (window.confirm('Separate this confirmed company into individual leads? The records and activity history will be preserved.')) {
              void updateGroup({ reviewStatus: 'separated' }, 'Company group separated into individual leads.');
            }
          }} className="rounded-lg border border-black/20 px-4 py-2 text-sm font-bold disabled:opacity-50">
            Separate into individual leads
          </button>
        ) : <p className="text-xs opacity-60">This suggestion was rejected; the original prospect records remain in the lead list.</p>}

        <div className="grid gap-3 border-t border-black/10 pt-4 sm:grid-cols-2">
          <label className="text-xs font-bold">Account outreach status
            <select value={campaignStatus} disabled={saving || reviewStatus === 'separated'} onChange={(event) => {
              const value = event.target.value as VendorProspectStatus;
              setCampaignStatus(value);
              void updateGroup({ campaignStatus: value }, 'Account status updated.');
            }} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
              {campaignStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold">Next follow-up date
            <input type="date" value={nextFollowUpAt} disabled={saving || reviewStatus === 'separated'} onChange={(event) => setNextFollowUpAt(event.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
          </label>
          <button type="button" disabled={saving || reviewStatus === 'separated'} onClick={() => void updateGroup({ nextFollowUpAt: nextFollowUpAt || null }, 'Next follow-up saved.')} className="w-fit rounded border border-black/20 px-3 py-2 text-xs font-bold disabled:opacity-50">
            Save follow-up date
          </button>
        </div>
      </div>

      <form onSubmit={(event) => void saveActivity(event)} className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <div>
          <h2 className="font-bold">Log admin activity</h2>
          <p className="mt-1 text-xs opacity-65">Record a manual call, email, or WhatsApp follow-up here. This CRM does not send anything.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold">Activity type
            <select value={activityType} onChange={(event) => setActivityType(event.target.value as ActivityType)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
              {ACTIVITY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold">Next follow-up date (optional)
            <input type="date" value={activityFollowUpAt} onChange={(event) => setActivityFollowUpAt(event.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
          </label>
        </div>
        <label className="block text-xs font-bold">What happened / next step
          <textarea required maxLength={2000} value={summary} onChange={(event) => setSummary(event.target.value)} rows={2} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
        </label>
        <label className="block text-xs font-bold">Outcome (optional)
          <textarea maxLength={1000} value={outcome} onChange={(event) => setOutcome(event.target.value)} rows={2} className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
        </label>
        <button type="submit" disabled={saving || !summary.trim()} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save CRM activity'}
        </button>
      </form>

      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 lg:col-span-2">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700 lg:col-span-2">{message}</p> : null}
    </section>
  );
}
