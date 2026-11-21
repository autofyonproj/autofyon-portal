import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DealerPublicLanding from '@/components/DealerPublicLanding';
import { getPublishedVendorLanding } from '@/lib/vendor-public-landing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dealer = await getPublishedVendorLanding(slug);
  if (!dealer) return { title: 'AutoFyon' };

  return {
    title: `${dealer.displayNameEn || dealer.displayName} | AutoFyon`,
    description: dealer.description || dealer.tagline || `Official page of ${dealer.displayNameEn || dealer.displayName}.`,
    alternates: {
      canonical: `/en/p/${slug}`,
      languages: { ar: `/p/${slug}`, en: `/en/p/${slug}` },
    },
  };
}

export default async function EnglishStarterLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealer = await getPublishedVendorLanding(slug);
  if (!dealer) notFound();

  return <DealerPublicLanding dealer={dealer} locale="en" />;
}
