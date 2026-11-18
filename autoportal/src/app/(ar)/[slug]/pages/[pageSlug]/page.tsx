import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import { getDraftSitePage, getPublishedSitePage } from '@/lib/site-pages';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const view = await loadMinisiteForRequest(slug, 'ar');
  if (!view) notFound();
  const page = await getPublishedSitePage(view.business.id, pageSlug);
  if (!page) notFound();
  return { title: page?.publishedTitleAr || view.business.name_ar || 'المركبة' };
}

export default async function ArabicCustomSitePage({
  params, searchParams,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug, pageSlug }, search] = await Promise.all([params, searchParams]);
  const view = await loadMinisiteForRequest(slug, 'ar');
  if (!view) notFound();
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost', { headers: Object.fromEntries(requestHeaders.entries()) });
    const user = await getAdminUser(request);
    if (user && canAccessBusiness(user, view.business.id)) {
      const draft = await getDraftSitePage(view.business.id, pageSlug);
      if (draft) return <MinisiteView view={view} pageSlug={pageSlug} previewPage={draft} preview />;
    }
  }
  if (!(await getPublishedSitePage(view.business.id, pageSlug))) notFound();
  if (!(await getPublishedSitePage(view.business.id, pageSlug))) notFound();
  return <MinisiteView view={view} pageSlug={pageSlug} />;
}
