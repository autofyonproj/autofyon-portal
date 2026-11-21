import type { Metadata } from 'next';
import BrandsView from '@/components/BrandsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Car Brands & Official Agencies in Egypt | AutoFyon',
  description:
    'Comprehensive directory of all automotive brands and official agencies in Egypt: Mercedes-Benz, BMW, Toyota, Hyundai, Kia, Audi, and more.',
  alternates: {
    canonical: '/en/brands',
    languages: {
      ar: '/brands',
      en: '/en/brands',
    },
  },
  openGraph: {
    title: 'Car Brands & Official Agencies in Egypt | AutoFyon',
    description: 'Comprehensive directory of all automotive brands and official agencies in Egypt.',
    url: 'https://autofyon.com/en/brands',
  },
};

export default function EnglishBrandsPage() {
  return <BrandsView locale="en" />;
}
