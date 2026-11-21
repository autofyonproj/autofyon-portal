import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'باقات وحلول معارض السيارات — تجربة مجانية 30 يوماً',
  description:
    'باقات وحلول متكاملة لمعارض السيارات وتجار وموزعي السيارات في مصر: موقع رقمي مستقل، نظام إدارة علاقات العملاء CRM، برنامج حسابات ومخزون ERP أوفلاين، وبوابة سوق المعارض. احصل على تجربة مجانية 30 يوماً فوراً.',
  keywords: [
    'باقات معارض السيارات',
    'برنامج معرض سيارات',
    'سيستم معارض سيارات مصر',
    'برنامج إدارة معارض السيارات',
    'برنامج حسابات معارض السيارات',
    'AutoFyon Packages',
    'تجربة مجانية لمعارض السيارات',
    'تسويق معارض السيارات',
  ],
  alternates: {
    canonical: '/packages',
    languages: {
      ar: '/packages',
      en: '/en',
    },
  },
  openGraph: {
    title: 'باقات وحلول معارض السيارات | تجربة مجانية 30 يوماً | أوتوفيون AutoFyon',
    description:
      'اختر الباقة المثالية التي تضاعف مبيعات معرضك: العضوية المجانية، باقة النمو، باقة المعارض المتقدمة Pro، وعضوية التوكيلات Enterprise.',
    url: 'https://autofyon.com/packages',
    images: [
      {
        url: '/brand/autofyon-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'باقات وحلول معارض السيارات من أوتوفيون',
      },
    ],
  },
};

export default function PackagesLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'AutoFyon Dealership Platform & ERP',
    description: 'حلول وباقات معارض السيارات والوكلاء في مصر — برنامج ERP أوفلاين، نظام CRM، وموقع رقمي مستقل',
    brand: {
      '@type': 'Brand',
      name: 'AutoFyon',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'العضوية المجانية (Free Starter)',
        price: '0',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'صفحة معرض رقمية معتمدة ورسمية باسم معرضك فوراً',
      },
      {
        '@type': 'Offer',
        name: 'باقة النمو للمعارض النامية (Growth)',
        price: '1500',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'برنامج ERP أوفلاين كامل بدون إنترنت مع موقع رقمي وCRM',
      },
      {
        '@type': 'Offer',
        name: 'عضوية المعارض المتقدمة (Pro Dealership)',
        price: '2500',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'إدارة متقدمة لشبكة المعارض، عقود مرخصة، ومزامنة فورية',
      },
      {
        '@type': 'Offer',
        name: 'عضوية التوكيلات والمؤسسات (Enterprise)',
        price: '7500',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'منظومة مؤسسية للتوكيلات والمجموعات الكبرى متصلة بأنظمة الوكالة المركزية',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
