import type { Metadata } from 'next';
import DealersDirectoryClient from '@/components/DealersDirectoryClient';
import { getDealersWithVerified } from '@/lib/dealers-directory';
import { DICTIONARY } from '@/data/dealers_i18n';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'دليل معارض وتوكيلات السيارات في مصر | أوتوفاي أون AutoFy On',
  description:
    'دليل قطاع السيارات الأكبر في مصر من منصة أوتوفاي أون (AutoFy On): أكثر من 2,800 معرض سيارات، وكيل معتمد، ومراكز صيانة وتمويل مع أرقام الواتساب والاتصال والعناوين.',
  alternates: {
    canonical: '/dealers',
    languages: {
      ar: '/dealers',
      en: '/en/dealers',
    },
  },
  openGraph: {
    title: 'دليل معارض وتوكيلات السيارات في مصر - أوتوفاي أون AutoFy On',
    description: 'ابحث في أكثر من 2,800 معرض وتوكيل ومركز صيانة في القاهرة والجيزة والإسكندرية والمحافظات عبر أوتوفاي أون.',
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

        {/* VCF WhatsApp Mobile Bulk Download Banner */}
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-[#0a1f18] to-emerald-900/40 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span>{dict.vcfBadge}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {dict.vcfTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
              {dict.vcfDesc}
            </p>
          </div>
          <a
            href="/api/contacts/export-vcf"
            download="autofyon-dealers-egypt.vcf"
            className="shrink-0 inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-neutral-950 px-6 py-3.5 text-sm font-black shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
          >
            <span className="text-base">📥</span>
            <span>{dict.vcfButton}</span>
          </a>
        </section>

        {/* Interactive Client Component */}
        <DealersDirectoryClient dealers={dealers} locale="ar" />
      </div>
    </main>
  );
}
