import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'بروشور خدمات أوتوفيون | AutoFyon — منصة معارض السيارات في مصر',
  description:
    'البروشور الرسمي لأوتوفيون — دليل شامل لخدمات ومزايا المنصة لمعارض السيارات في مصر، الباقة المجانية، استوديو ميديا مانجر، دليل المعارض، وجدول الأسعار.',
  openGraph: {
    title: 'بروشور أوتوفيون الرسمي 2026',
    description: 'منصة معارض السيارات الأولى في مصر — بروشور كامل بالمزايا والباقات وخطوات التفعيل.',
    url: 'https://autofyon.com/brochure/ar',
    siteName: 'AutoFyon | أوتوفيون',
    type: 'website',
  },
};

export default function BrochureArLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
