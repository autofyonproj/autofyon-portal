import type { Metadata } from 'next';
import DealersDirectoryClient, { type DealerItem } from '@/components/DealersDirectoryClient';
import dealersJson from '@/data/egypt_dealers_directory.json';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'دليل معارض وتوكيلات السيارات في مصر | AUTOFYON.com',
  description:
    'دليل قطاع السيارات الأكبر في مصر: أكثر من 2800 معرض سيارات، وكيل معتمد، مركز صيانة، وشركات قطع غيار وتمويل مع أرقام الواتساب والاتصال والعناوين.',
  alternates: { canonical: '/dealers' },
  openGraph: {
    title: 'دليل معارض وتوكيلات السيارات في مصر - أوتوفيون',
    description: 'ابحث في أكثر من 2800 معرض وتوكيل ومركز صيانة في القاهرة والجيزة والإسكندرية والمحافظات.',
    url: 'https://autofyon.com/dealers',
  },
};

export default function DealersDirectoryPage() {
  const dealers = dealersJson as DealerItem[];

  return (
    <main lang="ar" dir="rtl" className="min-h-screen bg-[#07090c] text-white selection:bg-red-600 selection:text-white px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
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
            <span>الدليل الموحد لقطاع تجارة وصناعة السيارات في مصر</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            دليل معارض ووكلاء ومراكز السيارات
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
            قاعدة بيانات معتمدة تضم أكثر من <strong className="text-white font-bold">2,800 كِيان سيارات</strong> تشمل معارض بيع واستبدال الزيرو والمستعمل، الوكلاء الرسميين والموزعين، مراكز الصيانة، وشركات قطع الغيار والتمويل والبنوك والتأمين بجميع المحافظات.
          </p>
        </header>

        {/* VCF WhatsApp Mobile Bulk Download Banner */}
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-[#0a1f18] to-emerald-900/40 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span>📲 ميزة الموبايل والواتساب</span>
              <span>•</span>
              <span>حفظ فوري</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              حفظ جميع جهات الاتصال (2,800+ رقم واتساب وهاتف) في هاتفك بضغطة واحدة
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
              قم بتحميل ملف جهات الاتصال الموحد (VCF) وافتحه من موبايلك، سيتم إضافة جميع أرقام المعارض والوكلاء والبنوك وشركات التأمين تلقائياً لدفتر الهاتف والواتساب باسم &quot;AutoFyon&quot;.
            </p>
          </div>
          <a
            href="/api/contacts/export-vcf"
            download="autofyon-dealers-egypt.vcf"
            className="shrink-0 inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-neutral-950 px-6 py-3.5 text-sm font-black shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
          >
            <span className="text-base">📥</span>
            <span>تحميل ملف جهات الاتصال (VCF)</span>
          </a>
        </section>

        {/* Interactive Client Component */}
        <DealersDirectoryClient dealers={dealers} />
      </div>
    </main>
  );
}
