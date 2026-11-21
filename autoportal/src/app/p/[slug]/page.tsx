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
  if (!dealer) return { title: 'أوتوفيون AutoFyon' };

  return {
    title: `${dealer.displayName} | أوتوفيون AutoFyon`,
    description: dealer.description || dealer.tagline || `صفحة ${dealer.displayName} الرسمية على منصة أوتوفيون.`,
    alternates: {
      canonical: `/p/${slug}`,
      languages: { ar: `/p/${slug}`, en: `/en/p/${slug}` },
    },
  };
}

export default async function StarterLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealer = await getPublishedVendorLanding(slug);
  if (!dealer) notFound();

  return <DealerPublicLanding dealer={dealer} />;
}
