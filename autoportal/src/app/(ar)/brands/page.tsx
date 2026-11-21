import type { Metadata } from 'next';
import BrandsView from '@/components/BrandsView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'دليل ماركات وتوكيلات السيارات في مصر',
  description:
    'دليل شامل لجميع ماركات وتوكيلات السيارات في مصر: مرسيدس، بي إم دبليو، تويوتا، هيونداي، كيا، أودي وغيرها. استكشف تاريخ الماركات والموديلات المتاحة والوكلاء المعتمدين.',
  keywords: [
    'ماركات السيارات مصر',
    'توكيلات السيارات في مصر',
    'وكيل سيارات معتمد',
    'اسعار الماركات في مصر',
    'AutoFyon Brands',
  ],
  alternates: {
    canonical: '/brands',
    languages: {
      ar: '/brands',
      en: '/en/brands',
    },
  },
  openGraph: {
    title: 'دليل ماركات وتوكيلات السيارات في مصر',
    description: 'دليل شامل لجميع ماركات وتوكيلات السيارات في مصر مع استعراض الموديلات والوكلاء.',
    url: 'https://autofyon.com/brands',
  },
};

export default function ArabicBrandsPage() {
  return <BrandsView locale="ar" />;
}
