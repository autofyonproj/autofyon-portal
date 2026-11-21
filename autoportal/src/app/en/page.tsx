import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { listFeatured } from '@/lib/minisite';
import { loadPortalPageState, loadPublishedPortalContent } from '@/lib/portal-site';
import HomeListing from '@/components/HomeListing';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AutoFyon — Premier Automotive & Dealerships Portal in Egypt',
  description:
    'The premier central portal for Egypt\'s automotive market and car dealerships. Explore cars, verified showrooms, dealers, and automotive management solutions.',
  alternates: {
    canonical: '/en',
    languages: {
      ar: '/',
      en: '/en',
    },
  },
  openGraph: {
    title: 'AutoFyon — Premier Automotive & Dealerships Portal in Egypt',
    description:
      'The premier central portal for Egypt\'s automotive market and car dealerships.',
    url: 'https://autofyon.com/en',
  },
};

export default async function EnglishHome({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const [items, search, requestHeaders] = await Promise.all([listFeatured(), searchParams, headers()]);
  const request = new Request('http://localhost/en', { headers: Object.fromEntries(requestHeaders.entries()) });
  const isPreview = search.preview === '1' && !(await requirePlatformAdmin(request) instanceof Response);
  const content = isPreview ? (await loadPortalPageState()).draft : await loadPublishedPortalContent();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://autofyon.com/en',
    name: 'AutoFyon Egypt',
    description: 'Premier Automotive & Dealerships Portal in Egypt',
    inLanguage: 'en-US',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeListing locale="en" items={items} content={content} preview={isPreview} />
    </>
  );
}
