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
  const view = await loadMinisiteForRequest(slug, 'en');
  if (!view) return {};

  const name = view.business.name;
  const typeName = view.business.typeName || 'Certified Dealership';
  const description = `${name} — ${typeName} in Egypt on AutoFyon. Explore available cars, specs, pricing, and direct contact details.`;
  const heroImage = view.active?.gallery?.[0]?.url || view.business.brandLogoUrl || '/brand/autofyon-logo-dark.png';

  return {
    title: `${name} | ${typeName} | AutoFyon`,
    description,
    alternates: {
      canonical: `/en/${slug}`,
      languages: {
        ar: `/${slug}`,
        en: `/en/${slug}`,
      },
    },
    openGraph: {
      title: `${name} — ${typeName} | AutoFyon`,
      description,
      url: `https://autofyon.com/en/${slug}`,
      images: [
        {
          url: heroImage,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | AutoFyon`,
      description,
      images: [heroImage],
    },
  };
}

export default async function EnglishMinisite({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const view = await loadMinisiteForRequest(slug, 'en');
  if (!view) notFound();
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost/en', { headers: Object.fromEntries(requestHeaders.entries()) });
    const user = await getAdminUser(request);
    if (user && canAccessBusiness(user, view.business.id)) {
      const draft = await getDraftSitePage(view.business.id);
      if (draft) return <MinisiteView view={view} previewPage={draft} preview />;
    }
  }
  return <MinisiteView view={view} />;
}
