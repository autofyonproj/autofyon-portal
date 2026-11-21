import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { loadMinisiteForRequest } from '@/lib/minisite';
import { getDraftSitePage } from '@/lib/site-pages';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const view = await loadMinisiteForRequest(slug, 'ar');
  if (!view) return {};

  const name = view.business.name_ar || view.business.name;
  const typeName = view.business.typeName_ar || 'معرض سيارات معتمد';
  const description = `${name} — ${typeName} في مصر عبر منصة أوتوفيون AutoFyon. استكشف السيارات المتاحة، المواصفات والأسعار، وساعات العمل ومعلومات التواصل المباشر.`;
  const heroImage = view.active?.gallery?.[0]?.url || view.business.brandLogoUrl || '/brand/autofyon-logo-dark.png';

  return {
    title: `${name} — ${typeName}`,
    description,
    alternates: {
      canonical: `/${slug}`,
      languages: {
        ar: `/${slug}`,
        en: `/en/${slug}`,
      },
    },
    openGraph: {
      title: `${name} — ${typeName} | AutoFyon`,
      description,
      url: `https://autofyon.com/${slug}`,
      images: [
        {
          url: heroImage,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | أوتوفيون`,
      description,
      images: [heroImage],
    },
  };
}

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
