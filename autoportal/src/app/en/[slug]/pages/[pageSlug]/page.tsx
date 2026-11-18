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
  const view = await loadMinisiteForRequest(slug, 'en');
  if (!view) notFound();
  const page = await getPublishedSitePage(view.business.id, pageSlug);
  if (!page) notFound();
  return { title: page?.publishedTitle || view.business.name };
}

export default async function EnglishCustomSitePage({
  params, searchParams,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug, pageSlug }, search] = await Promise.all([params, searchParams]);
  const view = await loadMinisiteForRequest(slug, 'en');
  if (!view) notFound();
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost/en', { headers: Object.fromEntries(requestHeaders.entries()) });
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
