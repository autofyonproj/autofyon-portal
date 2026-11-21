import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'مركز تحميل وتثبيت برنامج المعارض ERP | أوتوفيون AutoFyon',
  description:
    'مركز التحميل الرسمي المعتمد لتنزيل برنامج AutoFyon Standalone ERP لمعارض السيارات وإدارة المخزون والحسابات.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DownloadLayout({ children }: { children: ReactNode }) {
  return children;
}
