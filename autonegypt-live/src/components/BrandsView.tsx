/**
 * BrandsView — the public A→Z brand directory.
 *
 * Lists automotive makes with their official marks and logos.
 * Optimized for mobile touch, high contrast, and luxury dark presentation.
 */
import Link from 'next/link';
import { listBrands } from '@/lib/units';
import { localePath, localeDir, type SiteLocale } from '@/lib/site-locale';

export default async function BrandsView({ locale }: { locale: SiteLocale }) {
  const brands = await listBrands(locale);
  const dir = localeDir(locale);
  const isAr = locale === 'ar';

  const title = isAr ? 'دليل وكالات وعلامات السيارات' : 'Automotive Brands Directory';
  const subtitle = isAr
    ? 'تصفح كبرى العلامات التجارية العالمية وموديلاتها المتوفرة لدى معارض مصر'
    : 'Explore world-class automotive manufacturers and models across Egyptian showrooms';
  const carsLabel = isAr ? 'مركبة معروضة' : 'vehicles in stock';
  const availableLabel = isAr ? 'متاح للطلب والاستيراد' : 'Available on request';
  const browse = isAr ? 'تصفّح كل السيارات المعروضة ←' : 'Browse all vehicles in market →';
  const home = isAr ? 'الرئيسية' : 'Home';

  return (
    <main dir={dir} className="min-h-screen bg-[#07090c] text-white selection:bg-red-600 selection:text-white px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href={localePath(locale, [])} className="hover:text-white transition">
            {home}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-white font-medium">{title}</span>
        </nav>

        {/* Heading */}
        <header className="border-b border-white/10 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold">
            <span>🛡️</span>
            <span>{isAr ? 'العلامات المعتمدة في مصر' : 'Official Automotive Registry'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Brands Grid */}
        {brands.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg">{isAr ? 'جاري تحديث دليل العلامات...' : 'Updating brand registry...'}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 list-none p-0">
            {brands.map((b) => (
              <li key={b.slug} className="group">
                <Link
                  href={localePath(locale, [b.slug])}
                  className="h-full flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-red-500/50 hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.03] shadow-lg group-hover:shadow-red-600/10"
                >
                  {/* Brand Emblem / Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/40 border border-white/5 p-3 flex items-center justify-center relative overflow-hidden group-hover:border-red-500/30 transition-colors">
                    {b.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl font-black text-neutral-600 group-hover:text-red-400 transition-colors">
                        {b.name.slice(0, 1)}
                      </span>
                    )}
                  </div>

                  {/* Brand Title & Info */}
                  <div className="mt-3 text-center space-y-1 w-full">
                    <h2 className="font-black text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {b.name}
                    </h2>
                    {isAr && b.nameEn !== b.name && (
                      <p className="text-[10px] text-neutral-400 font-mono tracking-wider line-clamp-1">
                        {b.nameEn}
                      </p>
                    )}
                  </div>

                  {/* Stock Count Pill */}
                  <div className="mt-3 w-full text-center">
                    {b.count > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <span>●</span> {b.count} {carsLabel}
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-medium text-neutral-500 bg-white/[0.02] px-2 py-0.5 rounded-full border border-white/5">
                        {availableLabel}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={localePath(locale, ['cars'])}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-bold text-xs text-white shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02]"
          >
            <span>{browse}</span>
          </Link>
          <span className="text-xs text-neutral-500">
            {isAr
              ? `إجمالي ${brands.length} علامة تجارية معتمدة`
              : `Total ${brands.length} registered manufacturers`}
          </span>
        </div>
      </div>
    </main>
  );
}
