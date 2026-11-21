import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';
import VendorSocialManagerClient from '@/components/VendorSocialManagerClient';

type Params = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export default async function VendorSocialManagerPage({ params }: Params) {
  const { id } = await params;
  const requestHeaders = await headers();
  const request = new Request('https://autofyon.com/admin/showroom/social', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const auth = await requireBusinessAccess(request, id);
  if (auth instanceof Response) notFound();

  const [business, membership] = await Promise.all([
    queryOne<{ name: string; name_ar: string | null }>(
      'SELECT name, name_ar FROM businesses WHERE id = ? AND status = \'active\' AND published = 1',
      [id],
    ),
    auth.user.role === 'platform_admin'
      ? Promise.resolve(null)
      : queryOne<{ role: string; status: string }>(
          'SELECT role, status FROM business_memberships WHERE business_id = ? AND admin_user_id = ?',
          [id, auth.user.id],
        ),
  ]);
  if (!business || auth.user.role !== 'platform_admin' &&
      (!membership || membership.status !== 'active' || !['owner', 'sales'].includes(membership.role))) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Social content · {business.name_ar || business.name}</p>
        <h1 className="mt-1 text-2xl font-bold">إدارة المحتوى الاجتماعي</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          أنشئ مسودات عربية وإنجليزية، خطط موعد المشاركة حسب الباقة، وراجع المحتوى داخلياً في Pro وEnterprise.
        </p>
      </header>
      <VendorSocialManagerClient businessId={id} />
    </div>
  );
}
