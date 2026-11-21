import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser } from '@/lib/admin-auth';
import { batch, query, queryOne } from '@/lib/db';
import VendorOnboardingQueue, { type VendorOnboardingRow } from '@/components/VendorOnboardingQueue';
import VendorReferralQueue, { type VendorReferralRow } from '@/components/VendorReferralQueue';

export const dynamic = 'force-dynamic';

export default async function VendorOnboardingPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request('https://autofyon.com/admin/platform/vendor-onboarding', {
    headers: Object.fromEntries(requestHeaders.entries()),
  }));
  if (!user || user.role !== 'platform_admin') notFound();

  await batch([{
    sql: `UPDATE vendor_registration_invites
             SET status = 'expired', updated_at = CURRENT_TIMESTAMP
           WHERE status IN ('invited', 'verified', 'changes_requested')
               AND expires_at <= CAST(strftime('%s', 'now') AS INTEGER)`,
    params: [],
  }]);

  const [rows, pendingRow, referrals, pendingReferralRow] = await Promise.all([
    query<VendorOnboardingRow>(
    `SELECT i.id, i.status, i.authorized_phone, i.campaign_ref, i.expires_at,
            i.created_at, i.submitted_at, i.decision_note, i.business_id,
            p.name AS prospect_name,
            d.company_name, d.company_name_ar, d.type_id, d.city, d.address, d.email,
            d.slug, d.tagline, d.description, d.publish_consent, d.phone_consent,
            d.whatsapp_consent, d.email_consent
       FROM vendor_registration_invites i
       JOIN vendor_prospects p ON p.id = i.prospect_id
  LEFT JOIN vendor_onboarding_drafts d ON d.invite_id = i.id
      ORDER BY CASE i.status
        WHEN 'submitted' THEN 0
        WHEN 'changes_requested' THEN 1
        WHEN 'verified' THEN 2
        WHEN 'invited' THEN 3
        ELSE 4 END,
        i.created_at DESC
      LIMIT 200`,
    ),
    queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM vendor_registration_invites WHERE status = 'submitted'`),
    query<VendorReferralRow>(
      `SELECT r.id, r.status, r.prospect_id, r.source_invite_id, r.submitted_name,
              r.submitted_phone, r.submitted_city, r.submitted_contact_name,
              r.submitted_email, r.created_at, r.review_note,
              source.name AS referrer_name, target.name AS crm_name
         FROM vendor_referrals r
         JOIN vendor_registration_invites i ON i.id = r.source_invite_id
         JOIN vendor_prospects source ON source.id = i.prospect_id
         JOIN vendor_prospects target ON target.id = r.prospect_id
        ORDER BY CASE r.status WHEN 'pending_review' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
                 r.created_at DESC
        LIMIT 200`,
    ),
    queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM vendor_referrals WHERE status = 'pending_review'`),
  ]);
  const pendingCount = pendingRow?.count ?? 0;
  const pendingReferralCount = pendingReferralRow?.count ?? 0;

  return (
    <div className="mx-auto max-w-[90rem] space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link><span>/</span>
        <Link href="/admin/platform/vendor-prospects" className="hover:underline">Vendor CRM</Link><span>/</span>
        <span>Onboarding review</span>
      </nav>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-sm text-neutral-500">Platform admin · private CRM workflow</p>
          <h1 className="mt-1 text-2xl font-bold">Dealer invitations &amp; onboarding</h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600">
            Review verified dealer submissions, consent choices, and page details. A page is published only when you approve it.
          </p>
        </div>
        <div className="rounded-xl border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm">
          <strong className="text-xl">{pendingCount}</strong><span className="ms-2">طلبات بانتظار المراجعة</span>
        </div>
      </header>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/platform/vendor-prospects/blast" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white">إنشاء دعوات WhatsApp</Link>
        <Link href="/admin/platform/vendor-prospects" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">العودة إلى سجل CRM</Link>
      </div>
      <VendorOnboardingQueue initialRows={rows} />
      <section className="space-y-4 border-t border-black/10 pt-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-500">العميل المحتمل المُحال لا يُدعى قبل مراجعة الإدارة</p>
            <h2 className="text-xl font-bold">إحالات المعارض</h2>
          </div>
          <div className="rounded-xl border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm">
            <strong className="text-xl">{pendingReferralCount}</strong><span className="ms-2">إحالة بانتظار المراجعة</span>
          </div>
        </header>
        <VendorReferralQueue initialRows={referrals} />
      </section>
    </div>
  );
}
