import type { Metadata } from 'next';
import DealersDirectoryClient from '@/components/DealersDirectoryClient';
import { getDealersWithVerified } from '@/lib/dealers-directory';
import { DICTIONARY } from '@/data/dealers_i18n';
import { IconBuilding } from '@/components/icons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'دليل معارض وتوكيلات ومراكز السيارات في مصر',
  description:
    'دليل قطاع السيارات الشامل في مصر من منصة أوتوفيون (AutoFyon): المعارض والوكلاء ومراكز الصيانة وشركات التمويل والتأمين في جميع المحافظات.',
  alternates: {
    canonical: '/dealers',
    languages: {
      ar: '/dealers',
      en: '/en/dealers',
    },
  },
  openGraph: {
    title: 'دليل معارض وتوكيلات ومراكز السيارات في مصر | أوتوفيون AutoFyon',
    description: 'ابحث في المعارض والتوكيلات ومراكز الصيانة وشركات التأمين والتمويل في القاهرة والجيزة والإسكندرية والمحافظات عبر أوتوفيون.',
    url: 'https://autofyon.com/dealers',
  },
};

export default async function DealersDirectoryPage() {
  const dealers = await getDealersWithVerified();
  const dict = DICTIONARY.ar;

  return (
    <main
      lang="ar"
      dir="rtl"
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
            <IconBuilding size={14} className="text-red-400" />
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
        <DealersDirectoryClient dealers={dealers} locale="ar" />
      </div>
    </main>
  );
}
