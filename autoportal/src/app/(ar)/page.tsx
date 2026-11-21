import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { listFeatured } from '@/lib/minisite';
import { loadPortalPageState, loadPublishedPortalContent } from '@/lib/portal-site';
import HomeListing from '@/components/HomeListing';

// Data comes from D1 at request time; nothing here is statically prerendered.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'أوتوفيون | AutoFyon — المنصة الأولى للسيارات ومعارض السيارات في مصر',
  description:
    'البوابة المركزية الأولى لسوق ومعارض السيارات في مصر: تصفح أحدث السيارات وأسعارها، اعثر على المعارض والوكلاء المعتمدين، وحلول إدارة المعارض المتطورة.',
  alternates: {
    canonical: '/',
    languages: {
      ar: '/',
      en: '/en',
    },
  },
  openGraph: {
    title: 'أوتوفيون | AutoFyon — المنصة الأولى للسيارات ومعارض السيارات في مصر',
    description:
      'البوابة المركزية الأولى لسوق ومعارض السيارات في مصر: تصفح أحدث السيارات وأسعارها، اعثر على المعارض والوكلاء المعتمدين.',
    url: 'https://autofyon.com',
  },
};

export default async function ArabicHome({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const [items, search, requestHeaders] = await Promise.all([listFeatured(), searchParams, headers()]);
  const request = new Request('http://localhost/', { headers: Object.fromEntries(requestHeaders.entries()) });
  const isPreview = search.preview === '1' && !(await requirePlatformAdmin(request) instanceof Response);
  const content = isPreview ? (await loadPortalPageState()).draft : await loadPublishedPortalContent();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://autofyon.com/#website',
        url: 'https://autofyon.com',
        name: 'AutoFyon أوتوفيون',
        description: 'البوابة المركزية الأولى لسوق ومعارض السيارات في مصر',
        inLanguage: 'ar-EG',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://autofyon.com/cars?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://autofyon.com/#organization',
        name: 'AutoFyon',
        alternateName: 'أوتوفيون',
        url: 'https://autofyon.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://autofyon.com/brand/autofyon-logo-dark.png',
        },
        sameAs: ['https://www.facebook.com/autofyon'],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeListing locale="ar" items={items} content={content} preview={isPreview} />
    </>
  );
}
