import type { Metadata } from 'next';
import DealersDirectoryClient from '@/components/DealersDirectoryClient';
import { getDealersWithVerified } from '@/lib/dealers-directory';
import { DICTIONARY } from '@/data/dealers_i18n';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Egypt Car Dealerships & Official Agencies Directory | AutoFyon',
  description:
    'Egypt’s automotive directory powered by AutoFyon (autofyon.com): explore showrooms, official agencies, maintenance centers, and auto lenders across Egypt.',
  alternates: {
    canonical: '/en/dealers',
    languages: {
      ar: '/dealers',
      en: '/en/dealers',
    },
  },
  openGraph: {
    title: 'Egypt Car Dealerships & Official Agencies Directory | AutoFyon',
    description:
      'Search verified showrooms, agencies, and auto service centers across Cairo, Giza, Alexandria, and other governorates on AutoFyon.',
    url: 'https://autofyon.com/en/dealers',
  },
};

export default async function EnglishDealersDirectoryPage() {
  const dealers = await getDealersWithVerified();
  const dict = DICTIONARY.en;

  return (
    <main
      lang="en"
      dir="ltr"
      className="min-h-screen bg-[#07090c] text-white selection:bg-red-600 selection:text-white px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24"
    >
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Page Header */}
        <header className="border-b border-white/10 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold">
            <span>🏛️</span>
            <span>{dict.headerBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {dict.headerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
            {dict.headerSubtitle}
          </p>
        </header>

        {/* Interactive Client Component */}
        <DealersDirectoryClient dealers={dealers} locale="en" />
      </div>
    </main>
  );
}
