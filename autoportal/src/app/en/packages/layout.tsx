import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dealership Packages & Solutions — 30-Day Free Trial',
  description:
    'Comprehensive digital and offline management solutions for car dealerships, brokers, and official agencies in Egypt: custom showroom landing pages, CRM, offline ERP accounting & inventory system. Start your 30-day free trial today.',
  keywords: [
    'Car dealership software Egypt',
    'Automotive ERP Egypt',
    'Dealership CRM software',
    'Auto showroom management system',
    'AutoFyon dealership packages',
    'Car inventory software Cairo',
    'Dealership free trial 30 days',
  ],
  alternates: {
    canonical: '/en/packages',
    languages: {
      ar: '/packages',
      en: '/en/packages',
    },
  },
  openGraph: {
    title: 'Dealership Packages & Software Solutions | 30-Day Free Trial | AutoFyon',
    description:
      'Scale your dealership with the right plan: Free Starter, Growth, Pro Dealership, and Enterprise Agency.',
    url: 'https://autofyon.com/en/packages',
    images: [
      {
        url: '/brand/autofyon-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'AutoFyon Dealership Packages & Management Solutions',
      },
    ],
  },
};

export default function EnglishPackagesLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'AutoFyon Dealership Platform & ERP',
    description: 'Comprehensive software and digital solutions for Egyptian car dealerships — offline ERP, CRM, and verified digital showroom.',
    brand: {
      '@type': 'Brand',
      name: 'AutoFyon',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Starter Membership',
        price: '0',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'Verified digital showroom profile for up to 10 vehicles.',
      },
      {
        '@type': 'Offer',
        name: 'Growth Dealership Package',
        price: '499',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'Full offline ERP accounting & inventory system for up to 30 vehicles.',
      },
      {
        '@type': 'Offer',
        name: 'Pro Dealership Package',
        price: '999',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'Multi-device showroom network, CRM leads pipeline, and media studio.',
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Agency Membership',
        price: '1999',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        description: 'Multi-branch agency management, unlimited fleet, and priority ranking.',
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
