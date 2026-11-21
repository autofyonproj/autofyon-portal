import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireVendorLeadAccess } from '@/lib/vendor-lead-auth';
import { queryOne } from '@/lib/db';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';
import VendorLeadsClient from '@/components/VendorLeadsClient';

type Params = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export default async function VendorLeadsPage({ params }: Params) {
  const { id } = await params;
  const requestHeaders = await headers();
  const request = new Request('https://autofyon.com/admin/showroom/leads', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const auth = await requireVendorLeadAccess(request, id);
  if (auth instanceof Response) notFound();

  const business = await queryOne<{ name: string; name_ar: string | null; type_id: string }>(
    'SELECT name, name_ar, type_id FROM businesses WHERE id = ? AND status = \'active\' AND published = 1',
    [id],
  );
  if (!business || !isVendorLeadBusinessType(business.type_id)) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Landing-page CRM · {business.name_ar || business.name}</p>
        <h1 className="mt-1 text-2xl font-bold">استفسارات العملاء ومتابعتها</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          هذا الصندوق جزء من صفحة النشاط المنشورة، ولا يعمل كمنتج CRM مستقل. نقرات الاتصال وواتساب تظل إحصاءات فقط ولا تُسجل كعملاء معروفين.
        </p>
      </header>
      <VendorLeadsClient
        businessId={id}
        canManageConnection={auth.membershipRole === 'owner' || auth.membershipRole === 'platform_admin'}
        canReviewAccounting={auth.membershipRole === 'owner' || auth.membershipRole === 'platform_admin'}
      />
    </div>
  );
}
