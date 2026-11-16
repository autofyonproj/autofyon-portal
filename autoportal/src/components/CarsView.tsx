/**
 * CarsView — the public /cars browse page.
 *
 * Server component. Parses `searchParams` into a `SearchOpts`, runs the
 * catalog query, and renders: a facet rail, a filter form (plain HTML GET so
 * it works before hydration), the result grid, and pagination.
 *
 * Route wrappers:
 *   /(ar)/cars/page.tsx  → <CarsView locale="ar" .../>
 *   /en/cars/page.tsx    → <CarsView locale="en" .../>
 *
 * Every filter is additive and every unset filter is invisible in the WHERE
 * clause. The `q` free-text goes across title / title_ar / seller name.
 */
import Link from 'next/link';
import { searchUnits, searchCatalogModels, searchCatalogBrands, catalogFacets, type SearchOpts } from '@/lib/units';
import { localePath, localeDir, type SiteLocale } from '@/lib/site-locale';
import { VEHICLE_CATEGORIES, vehicleCategoryLabel } from '@/lib/unit-terms';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import BrandMiniCarouselCard, { type BrandCardData } from '@/components/BrandMiniCarouselCard';

export interface CarsSearchParams {
  tab?: string;
  brand?: string;
  model?: string;
  kind?: string;
  category?: string;
  seller_type?: string;
  year_from?: string;
  year_to?: string;
  price_from?: string;
  price_to?: string;
  q?: string;
  sort?: string;
  page?: string;
}

const PAGE_SIZE = 24;

const SELLER_TYPE_LABEL: Record<SiteLocale, Record<string, string>> = {
  ar: {
    showroom: 'معرض',
    used_car_dealer: 'تاجر مستعمل',
    agent_broker: 'وسيط',
    distributor: 'موزّع',
    main_agency: 'وكالة رئيسية',
  },
  en: {
    showroom: 'Showroom',
    used_car_dealer: 'Used-car dealer',
    agent_broker: 'Broker',
    distributor: 'Distributor',
    main_agency: 'Main agency',
  },
};
const KIND_LABEL: Record<SiteLocale, Record<string, string>> = {
  ar: { new: 'جديد', used: 'مستعمل', demo: 'تجريبي', lease_return: 'إرجاع تأجير' },
  en: { new: 'New', used: 'Used', demo: 'Demo', lease_return: 'Lease return' },
};

function num(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
function str(v: string | undefined): string | undefined {
  return v && v.trim() ? v.trim() : undefined;
}

function toOpts(p: CarsSearchParams, locale: SiteLocale, page: number): SearchOpts {
  return {
    locale,
    brand: str(p.brand),
    model: str(p.model),
    kind: str(p.kind),
    category: str(p.category),
    sellerType: str(p.seller_type),
    yearFrom: num(p.year_from),
    yearTo: num(p.year_to),
    priceFrom: num(p.price_from),
    priceTo: num(p.price_to),
    q: str(p.q),
    sort: (p.sort as SearchOpts['sort']) ?? 'recent',
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };
}

const T = (locale: SiteLocale) => ({
  title: locale === 'ar' ? 'تصفّح المركبات' : 'Browse vehicles',
  resultsCount: (n: number) => (locale === 'ar' ? `${n.toLocaleString('ar-EG')} نتيجة` : `${n.toLocaleString()} results`),
  empty: locale === 'ar' ? 'لا توجد مركبات مطابقة للفلاتر.' : 'No vehicles match these filters.',
  clearAll: locale === 'ar' ? 'مسح الكل' : 'Clear all',
  apply: locale === 'ar' ? 'تطبيق' : 'Apply',
  brand: locale === 'ar' ? 'العلامة' : 'Brand',
  allBrands: locale === 'ar' ? 'كل العلامات' : 'All brands',
  kind: locale === 'ar' ? 'الحالة' : 'Condition',
  allKinds: locale === 'ar' ? 'الكل' : 'All',
  category: locale === 'ar' ? 'نوع المركبة' : 'Vehicle type',
  allCategories: locale === 'ar' ? 'كل المركبات' : 'All vehicles',
  sellerType: locale === 'ar' ? 'نوع البائع' : 'Seller type',
  allSellers: locale === 'ar' ? 'كل الأنواع' : 'All types',
  yearRange: locale === 'ar' ? 'سنة الصنع' : 'Model year',
  priceRange: locale === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)',
  search: locale === 'ar' ? 'كلمة بحث' : 'Search',
  searchPlaceholder: locale === 'ar' ? 'مثال: مركبة 2022' : 'e.g. BMW X5 2022',
  sort: locale === 'ar' ? 'الترتيب' : 'Sort',
  sortRecent: locale === 'ar' ? 'الأحدث' : 'Most recent',
  sortPriceAsc: locale === 'ar' ? 'السعر ↑' : 'Price ↑',
  sortPriceDesc: locale === 'ar' ? 'السعر ↓' : 'Price ↓',
  sortYearDesc: locale === 'ar' ? 'السنة ↓' : 'Year ↓',
  sortMileageAsc: locale === 'ar' ? 'أقل كيلومترات' : 'Lowest mileage',
  prev: locale === 'ar' ? 'السابق' : 'Previous',
  next: locale === 'ar' ? 'التالي' : 'Next',
  page: (n: number) => (locale === 'ar' ? `صفحة ${n}` : `Page ${n}`),
  callPrice: locale === 'ar' ? 'السعر عند الاتصال' : 'Price on request',
  from: locale === 'ar' ? 'من' : 'From',
  to: locale === 'ar' ? 'إلى' : 'To',
  home: locale === 'ar' ? 'الرئيسية' : 'Home',
  brands: locale === 'ar' ? 'العلامات' : 'Brands',
  km: locale === 'ar' ? 'كم' : 'km',
  viewAllBrands: locale === 'ar' ? 'دليل العلامات ←' : 'Brand directory →',
});

function qs(p: CarsSearchParams, over: Record<string, string | undefined>): string {
  const merged: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) if (v) merged[k] = String(v);
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined || v === '') delete merged[k];
    else merged[k] = v;
  }
  const q = new URLSearchParams(merged).toString();
  return q ? `?${q}` : '';
}

export default async function CarsView({
  locale,
  searchParams,
}: {
  locale: SiteLocale;
  searchParams: CarsSearchParams;
}) {
  const t = T(locale);
  const dir = localeDir(locale);
  const isAr = locale === 'ar';
  const tab = searchParams.tab === 'units' ? 'units' : 'models';
  const page = Math.max(1, Number(searchParams.page ?? '1') || 1);
  const opts = toOpts(searchParams, locale, page);

  const [dataResult, facets] = await Promise.all([
    tab === 'models' ? searchCatalogBrands(opts) : searchUnits(opts),
    catalogFacets(locale),
  ]);

  const brands: BrandCardData[] = tab === 'models' ? (dataResult as { brands: BrandCardData[]; total: number }).brands : [];
  const cards = tab === 'units' ? (dataResult as { cards: any[]; total: number }).cards : [];
  const total = dataResult.total;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const inputCls = 'catalog-input';
  const labelCls = 'catalog-label';

  return (
    <main dir={dir} className="catalog-page">
      <AnalyticsTracker />
      {/* Header */}
      <header className="catalog-heading">
        <nav className="catalog-breadcrumb">
          <Link href={localePath(locale, [])} className="hover:underline">{t.home}</Link>
          <span>/</span>
          <span className="font-bold">{t.title}</span>
        </nav>
        <h1>{t.title}</h1>
        <p>{isAr ? 'استعرض كتالوج جميع موديلات السيارات المتاحة في مصر بجميع الفئات والمواصفات الرسمية والمخزون.' : 'Browse the full catalog of car models in Egypt with official trims, specs, and showroom stock.'}</p>
      </header>

      {/* Tabs: Models Catalog vs Showroom Units */}
      <div className="flex gap-2 border-b border-[var(--line)] mb-6">
        <Link
          href={`${localePath(locale, ['cars'])}${qs(searchParams, { tab: 'models', page: '1' })}`}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'models'
              ? 'border-[#c4a265] text-[#8b7340] dark:text-[#e6cb97]'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span>🚗</span>
          <span>{isAr ? 'دليل وكتالوج موديلات السيارات' : 'Car Models Catalog'}</span>
          {tab === 'models' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c4a265]/15 text-[#8b7340] dark:text-[#e6cb97] font-mono">
              {total} {isAr ? 'علامة' : 'brands'}
            </span>
          )}
        </Link>
        <Link
          href={`${localePath(locale, ['cars'])}${qs(searchParams, { tab: 'units', page: '1' })}`}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'units'
              ? 'border-[#c4a265] text-[#8b7340] dark:text-[#e6cb97]'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span>🏢</span>
          <span>{isAr ? 'عروض وسيارات المعارض' : 'Showroom Inventory'}</span>
          {tab === 'units' && <span className="text-xs px-2 py-0.5 rounded-full bg-[#c4a265]/15 text-[#8b7340] dark:text-[#e6cb97] font-mono">{total}</span>}
        </Link>
      </div>

      <div className="catalog-result-count">{t.resultsCount(total)}</div>

      {/* Filter form (GET so it works without JS) */}
      <form method="GET" className="catalog-filter-panel">
        <input type="hidden" name="tab" value={tab} />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div>
            <label className={labelCls}>{t.brand}</label>
            <select name="brand" defaultValue={searchParams.brand ?? ''} className={inputCls}>
              <option value="">{t.allBrands}</option>
              {facets.brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>{t.kind}</label>
            <select name="kind" defaultValue={searchParams.kind ?? ''} className={inputCls}>
              <option value="">{t.allKinds}</option>
              {facets.kinds.map((k) => (
                <option key={k} value={k}>{KIND_LABEL[locale][k] ?? k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>{t.category}</label>
            <select name="category" defaultValue={searchParams.category ?? ''} className={inputCls}>
              <option value="">{t.allCategories}</option>
              {VEHICLE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {vehicleCategoryLabel(category, locale === 'ar')}
                </option>
              ))}
            </select>
          </div>

          {tab === 'units' && (
            <div>
              <label className={labelCls}>{t.sellerType}</label>
              <select name="seller_type" defaultValue={searchParams.seller_type ?? ''} className={inputCls}>
                <option value="">{t.allSellers}</option>
                {facets.sellerTypes.map((s) => (
                  <option key={s} value={s}>{SELLER_TYPE_LABEL[locale][s] ?? s}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelCls}>{t.priceRange}</label>
            <div className="flex gap-1">
              <input type="number" name="price_from" placeholder={t.from} defaultValue={searchParams.price_from ?? ''} className={inputCls} />
              <input type="number" name="price_to" placeholder={t.to} defaultValue={searchParams.price_to ?? ''} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t.search}</label>
            <input type="search" name="q" placeholder={isAr ? 'ابحث بالاسم أو الماركة...' : 'Search by model or brand...'} defaultValue={searchParams.q ?? ''} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t.sort}</label>
            <select name="sort" defaultValue={searchParams.sort ?? 'recent'} className={inputCls}>
              <option value="recent">{t.sortRecent}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
              <option value="year_desc">{t.sortYearDesc}</option>
              <option value="mileage_asc">{t.sortMileageAsc}</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-6 flex items-end gap-2 pt-2">
            <button type="submit" className="catalog-submit">
              {t.apply}
            </button>
            <Link href={`${localePath(locale, ['cars'])}?tab=${tab}`} className="catalog-clear">
              {t.clearAll}
            </Link>
          </div>
        </div>
        {/* Preserve page=1 on new filter submit */}
        <input type="hidden" name="page" value="1" />
      </form>

      {/* Result grid */}
      {tab === 'models' ? (
        brands.length === 0 ? (
          <div className="public-empty-state">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-bold">{t.empty}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {brands.map((b) => (
              <BrandMiniCarouselCard key={b.id} brand={b} locale={locale} />
            ))}
          </div>
        )
      ) : (
        cards.length === 0 ? (
          <div className="public-empty-state">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-bold">{t.empty}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {cards.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="car-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-white dark:bg-[#121518] hover:border-[#c4a265]/50 transition-all duration-300 shadow-sm hover:shadow-xl no-underline"
                data-analytics-business-id={c.sellerBusinessId}
                data-analytics-unit-id={c.id}
              >
                <div className="car-card-media relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#181c22] dark:to-[#121518]">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt={c.title} className="car-card-image aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="relative w-full aspect-[16/10] flex flex-col items-center justify-center p-6 text-center select-none">
                      {/* Background Autofyon watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <span className="font-mono text-2xl font-black tracking-widest uppercase text-gray-800 dark:text-white rotate-[-12deg]">
                          autofyon.com
                        </span>
                      </div>

                      {/* Official Brand Logo */}
                      {c.brandSlug ? (
                        <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-white/90 dark:bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm border border-black/5 dark:border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset/logos/optimized/${c.brandSlug}.svg`}
                            alt={c.brandName || ''}
                            className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="text-3xl font-black text-gray-300 dark:text-gray-700">AUTO</div>
                      )}

                      {/* Category pill */}
                      <span className="relative z-10 mt-3 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#c4a265]/15 text-[#8b7340] dark:text-[#e6cb97] border border-[#c4a265]/25">
                        {vehicleCategoryLabel(c.vehicleCategory, isAr)}
                      </span>

                      {/* Corner watermark badge */}
                      <span className="absolute bottom-2 font-mono text-[9px] tracking-wider uppercase opacity-40 font-semibold text-gray-500 dark:text-gray-400">
                        autofyon.com
                      </span>
                    </div>
                  )}
                </div>

                <div className="car-card-body p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="car-card-meta flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {c.brandName && <span className="font-bold text-[#8b7340] dark:text-[#e6cb97]">{c.brandName}</span>}
                      {c.brandName && <span>·</span>}
                      <span>{vehicleCategoryLabel(c.vehicleCategory, isAr)}</span>
                    </div>
                    <div className="car-card-title text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mt-1 group-hover:text-[#8b7340] dark:group-hover:text-[#e6cb97] transition-colors">
                      {c.title}
                    </div>
                    <div className="car-card-details text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-between">
                      <span>{c.sellerName}</span>
                      <span className="text-[11px] font-semibold text-[#8b7340] dark:text-[#e6cb97]">
                        {isAr ? 'الموقع المصغر ←' : 'Minisite →'}
                      </span>
                    </div>
                  </div>

                  <div className="car-card-price pt-2 border-t border-black/5 dark:border-white/5 font-bold text-sm text-gray-900 dark:text-gray-100">
                    {c.priceEgp ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-500 font-normal">{isAr ? 'يبدأ من' : 'From'}</span>
                        <span className="text-[#8b7340] dark:text-[#e6cb97] font-mono text-base font-black">
                          {c.priceEgp.toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                        </span>
                        <span className="text-xs font-normal text-gray-500">{c.currency}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-normal">
                        {isAr ? 'تصفّح المواصفات والفئات' : 'View Specs & Trims'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="catalog-pagination">
          {page > 1 && (
            <Link href={`${localePath(locale, ['cars'])}${qs(searchParams, { page: String(page - 1) })}`}>
              ← {t.prev}
            </Link>
          )}
          <span className="text-sm opacity-70 mx-4">{t.page(page)} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`${localePath(locale, ['cars'])}${qs(searchParams, { page: String(page + 1) })}`}>
              {t.next} →
            </Link>
          )}
        </nav>
      )}

      <div className="catalog-breadcrumb">
        <Link href={localePath(locale, ['brands'])} className="hover:underline font-bold">{t.viewAllBrands}</Link>
        <span>·</span>
        <Link href={localePath(locale, [])} className="hover:underline">{t.home}</Link>
      </div>
    </main>
  );
}
