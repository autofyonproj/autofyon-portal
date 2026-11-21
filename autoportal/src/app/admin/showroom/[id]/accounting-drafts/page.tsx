import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { requireVendorAccountingAccess } from '@/lib/vendor-lead-auth';
import AccountingDraftsClient from '@/components/AccountingDraftsClient';

type Params = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export default async function AccountingDraftsPage({ params }: Params) {
  const { id } = await params;
  const requestHeaders = await headers();
  const request = new Request('https://autofyon.com/admin/showroom/accounting-drafts', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const auth = await requireVendorAccountingAccess(request, id);
  if (auth instanceof Response) notFound();

  const business = await queryOne<{ name: string; name_ar: string | null }>(
    'SELECT name, name_ar FROM businesses WHERE id = ? AND status = \'active\'',
    [id],
  );
  if (!business) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Accounting · {business.name_ar || business.name}</p>
        <h1 className="mt-1 text-2xl font-bold">مسودات العمليات المحاسبية</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          راجع العمليات الواردة من نسخ ERP المرتبطة. لا تُرحّل أي عملية تلقائياً، وتظل قيودها معلقة حتى اعتمادها واستيرادها من نسخة مخولة.
        </p>
      </header>
      <AccountingDraftsClient businessId={id} />
    </div>
  );
}
