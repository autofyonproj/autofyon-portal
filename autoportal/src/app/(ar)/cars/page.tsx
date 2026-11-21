import type { Metadata } from 'next';
import CarsView, { type CarsSearchParams } from '@/components/CarsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'سوق ومعرض السيارات في مصر — أحدث السيارات والأسعار',
  description:
    'استكشف أحدث السيارات المتاحة للبيع لدى أفضل المعارض والوكلاء المعتمدين في مصر. فلترة ذكية حسب السعر والموديل وسنة الصنع ونوع الوقود، مع تواصل مباشر عبر واتساب.',
  keywords: [
    'سيارات للبيع مصر',
    'اسعار السيارات في مصر',
    'سيارات زيرو مصر',
    'سيارات مستعملة للبيع',
    'تقسيط سيارات مصر',
    'سوق السيارات',
    'AutoFyon Cars',
  ],
  alternates: {
    canonical: '/cars',
    languages: {
      ar: '/cars',
      en: '/en/cars',
    },
  },
  openGraph: {
    title: 'سوق ومعرض السيارات في مصر | أوتوفيون AutoFyon',
    description:
      'استكشف أحدث السيارات المتاحة للبيع لدى أفضل المعارض والوكلاء المعتمدين في مصر.',
    url: 'https://autofyon.com/cars',
  },
};

interface Props {
  searchParams: Promise<CarsSearchParams>;
}

export default async function ArabicCarsPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <CarsView locale="ar" searchParams={sp} />;
}
