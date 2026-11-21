import type { Metadata } from 'next';
import CarsView, { type CarsSearchParams } from '@/components/CarsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cars for Sale in Egypt | Verified Showrooms & Deals | AutoFyon',
  description:
    'Explore the latest cars for sale from certified dealerships and authorized agencies across Egypt. Filter by brand, price, year, and fuel type with direct WhatsApp inquiry.',
  alternates: {
    canonical: '/en/cars',
    languages: {
      ar: '/cars',
      en: '/en/cars',
    },
  },
  openGraph: {
    title: 'Cars for Sale in Egypt | AutoFyon',
    description: 'Explore the latest cars for sale from certified dealerships across Egypt.',
    url: 'https://autofyon.com/en/cars',
  },
};

interface Props {
  searchParams: Promise<CarsSearchParams>;
}

export default async function EnglishCarsPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <CarsView locale="en" searchParams={sp} />;
}
