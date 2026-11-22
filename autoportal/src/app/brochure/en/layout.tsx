import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'AutoFyon — Official Product Brochure 2026 | Dealership Packages & ERP',
  description:
    'Download the official AutoFyon product brochure — full module details, upgrade paths, comparison table for all 4 tiers: Free, Growth ERP, Pro Multi-Agent, Enterprise Agency.',
  openGraph: {
    title: 'AutoFyon — Official Product Brochure 2026',
    description: "Egypt's #1 automotive dealership platform — full brochure with pricing tiers, ERP modules, and upgrade roadmap.",
    url: 'https://autofyon.com/brochure/en',
    siteName: 'AutoFyon',
    type: 'website',
  },
};

export default function BrochureEnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
