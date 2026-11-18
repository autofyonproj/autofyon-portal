import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { loadMinisiteForRequest } from '@/lib/minisite';
import { getDraftSitePage } from '@/lib/site-pages';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function ArabicMinisite({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const view = await loadMinisiteForRequest(slug, 'ar');
  if (!view) notFound();
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost', { headers: Object.fromEntries(requestHeaders.entries()) });
    const user = await getAdminUser(request);
    if (user && canAccessBusiness(user, view.business.id)) {
      const draft = await getDraftSitePage(view.business.id);
      if (draft) return <MinisiteView view={view} previewPage={draft} preview />;
    }
  }
  return <MinisiteView view={view} />;
}
