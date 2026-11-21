/**
 * Minisite renderer — presents a loaded MinisiteView bilingually.
 *
 * The page is built for one visitor: a buyer deciding between cars and needing
 * to reach the showroom to finish. So the order is the order of that decision:
 *
 *   who is this  → identity plate, with the showroom's address, hours and phone
 *                  beside it, never buried under the fold
 *   show me      → the value carousel: one pane per authored answer, photo or
 *                  walkaround film behind it
 *   the numbers  → the spec groups the carousel did not already print
 *   what else    → graph shelves (models, inventory, network), the unbound
 *                  gallery, then notes
 *
 * Direction is carried by the caller's locale tree, and every surface uses
 * logical properties, so the Arabic page is a mirror rather than a translation
 * of the layout.
 */
import type {
  ActiveSectionView, ClaimedKeys, GalleryItem, GraphShelf, MinisiteView as MinisiteData,
  SlideFieldsIndex, CarouselDefaults,
} from '@/lib/minisite';
import {
  DEFAULT_CUSTOM_SITE_PROFILE, loadCustomSiteVehicleOverrides,
  type CustomSiteOverrideField, type CustomSiteVehicleOverride,
} from '@/lib/site-builder';
import type { CSSProperties } from 'react';
import GalleryCarousel from '@/components/GalleryCarousel';
import SitePageRenderer from '@/components/SitePageRenderer';
import { getPublishedSitePage, listPublishedCustomPages, type SitePage } from '@/lib/site-pages';
import { notFound } from 'next/navigation';
import FinanceCalculator from '@/components/FinanceCalculator';
import ContactDock from '@/components/ContactDock';
import { IconClock, IconPhone, IconPin, IconWhatsApp } from '@/components/icons';
import { localeDir, localePath, type SiteLocale } from '@/lib/site-locale';
import SocialLinks from '@/components/SocialLinks';
import { socialLinksLabel } from '@/lib/social-link-types';
import { requiresAutofyonSponsorship } from '@/lib/autofyon-customer-plan';
import { unitsBySeller, type UnitCard } from '@/lib/units';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ModelEcosystemDock from '@/components/ModelEcosystemDock';
import { PlatformAdRail, PlatformNewsRibbon } from '@/components/PlatformAnnouncements';
import { loadPublishedPortalContent } from '@/lib/portal-site';
import VendorLeadCaptureForm from '@/components/VendorLeadCaptureForm';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';

// ── UI strings: labels around the data, never the data itself ────────────────
const UI: Record<string, { en: string; ar: string }> = {
  home: { en: 'Home', ar: 'الرئيسية' },
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  gallery: { en: 'Gallery', ar: 'معرض الصور' },
  none: { en: 'Nothing authored on this shelf yet.', ar: 'لا يوجد محتوى على هذا الرف بعد.' },
  visit: { en: 'Visit the showroom', ar: 'زيارة المعرض' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  hours: { en: 'Opening hours', ar: 'مواعيد العمل' },
  call: { en: 'Call', ar: 'اتصال' },
  whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
  models: { en: 'Models', ar: 'الطرازات' },
  variants: { en: 'Variants', ar: 'الفئات' },
  inventory: { en: 'Inventory', ar: 'المخزون' },
  relation: { en: 'Network', ar: 'الشبكة' },
  origin: { en: 'Manufactured at', ar: 'بلد المنشأ' },
  protection: { en: 'Protection', ar: 'الحماية' },
  portfolio: { en: 'Portfolio', ar: 'المحفظة' },
};

const t = (k: keyof typeof UI, locale: SiteLocale): string => UI[k]?.[locale] ?? String(k);

function loc(en: unknown, ar: unknown, locale: SiteLocale): string | null {
  const primary = locale === 'ar' ? ar : en;
  if (typeof primary === 'string' && primary.trim()) return primary.trim();
  return null;
}

function displayName(row: { name: string; name_ar: string | null }, locale: SiteLocale): string {
  return loc(row.name, row.name_ar, locale) ?? '';
}

function displayMeta(value: string | null, locale: SiteLocale): string {
  if (!value) return '';
  if (locale === 'ar' && /[A-Za-z]/.test(value) && !/[\u0600-\u06FF]/.test(value)) return '';
  if (locale === 'en' && /[\u0600-\u06FF]/.test(value)) return '';
  return value;
}

function VehicleInventory({
  units,
  locale,
  isCustomDomain,
  options,
  overrideFields,
  vehicleOverrides,
}: {
  units: UnitCard[];
  locale: SiteLocale;
  isCustomDomain: boolean;
  options: typeof DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions;
  overrideFields: CustomSiteOverrideField[];
  vehicleOverrides: Record<string, CustomSiteVehicleOverride>;
}) {
  if (!units.length) return null;
  const heading = locale === 'ar' ? 'المركبات المتاحة' : 'Available vehicles';
  const price = (amount: number, currency: string) => new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
  const statusLabel = (status: string) => locale === 'ar'
    ? ({ available: 'متاح', reserved: 'محجوز', sold: 'تم البيع', rented: 'مؤجر', inactive: 'غير متاح' }[status] ?? status)
    : ({ available: 'Available', reserved: 'Reserved', sold: 'Sold', rented: 'Rented', inactive: 'Unavailable' }[status] ?? status);

  const cardClass = 'block overflow-hidden border border-[var(--line)] bg-white text-[var(--ink)] no-underline transition-colors hover:border-[var(--signal)]';
  return (
    <section className="panel" id="sec_auto_inventory">
      <div className="panel-head">
        <h2 className="panel-title">{heading}</h2>
        <span className="panel-rule" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => {
            const overrides = vehicleOverrides[unit.id] ?? {};
            const priceEgp = overrideFields.includes('price') ? overrides.priceEgp ?? unit.priceEgp : unit.priceEgp;
            const status = overrideFields.includes('availability') ? overrides.availability ?? unit.status : unit.status;
            const imageUrl = overrideFields.includes('media') ? overrides.mediaUrl ?? unit.imageUrl : unit.imageUrl;
            const promotionalCopy = overrideFields.includes('promotionalCopy') ? overrides.promotionalCopy : undefined;
            const specificationsNote = overrideFields.includes('specifications') ? overrides.specificationsNote : undefined;
            const content = (
              <>
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={unit.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-black/[.03] text-sm opacity-50">
                    {locale === 'ar' ? 'الصورة غير متاحة' : 'Photo unavailable'}
                  </div>
                )}
                <div className="space-y-1 p-3">
                  <h3 className="font-bold">{unit.title}</h3>
                  {options.showYear || options.showAvailability || options.showMileage ? (
                    <p className="text-xs opacity-70">
                      {[
                        options.showYear ? unit.year : null,
                        options.showAvailability ? statusLabel(status) : null,
                        options.showMileage && unit.mileageKm != null
                          ? `${unit.mileageKm.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-EG')} ${locale === 'ar' ? 'كم' : 'km'}`
                          : null,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {options.showPrice && priceEgp != null ? <p className="text-sm font-bold">{price(priceEgp, unit.currency)}</p> : null}
                  {promotionalCopy ? <p className="text-sm">{promotionalCopy}</p> : null}
                  {specificationsNote ? <p className="text-xs opacity-70">{specificationsNote}</p> : null}
                  {isCustomDomain && options.showAutofyonDetailsLink ? (
                    <span className="inline-block pt-1 text-xs font-bold text-[var(--signal)]">
                      {locale === 'ar' ? 'التفاصيل الكاملة على AUTOFYON ↗' : 'Full details on AUTOFYON ↗'}
                    </span>
                  ) : null}
                </div>
              </>
            );
            const href = isCustomDomain
              ? `https://autofyon.com${unit.href}`
              : unit.href;
            return options.showAutofyonDetailsLink || !isCustomDomain
              ? <a key={unit.id} href={href} className={cardClass} data-analytics-business-id={unit.sellerBusinessId} data-analytics-unit-id={unit.id} target={isCustomDomain ? '_blank' : undefined} rel={isCustomDomain ? 'noreferrer' : undefined}>{content}</a>
              : <article key={unit.id} className={cardClass}>{content}</article>;
        })}
      </div>
    </section>
  );
}

/** Section shelves get a human heading; unknown ids keep their authored name. */
function shelfHeading(sectionId: string, fallback: string, locale: SiteLocale): string {
  const known: Record<string, keyof typeof UI> = {
    sec_auto_models: 'models', sec_auto_variants: 'variants', sec_auto_inventory: 'inventory',
    sec_auto_network: 'relation', sec_auto_origin: 'origin', sec_auto_protection: 'protection',
    sec_auto_portfolio: 'portfolio',
  };
  const key = known[sectionId];
  return key ? t(key, locale) : fallback;
}

const homeHref = (locale: SiteLocale, slug: string, isCustomDomain = false) =>
  isCustomDomain ? `https://autofyon.com${localePath(locale, [slug])}` : localePath(locale, [slug]);
const sectionHref = (locale: SiteLocale, slug: string, sectionId: string, isCustomDomain = false) =>
  localePath(locale, isCustomDomain ? [sectionId] : [slug, sectionId]);

// ── graph shelves ────────────────────────────────────────────────────────────
function ShelfItems({
  shelf,
  locale,
  isCustomDomain,
}: {
  shelf: GraphShelf;
  locale: SiteLocale;
  isCustomDomain: boolean;
}) {
  const items = shelf.items;
  if (shelf.as === 'chips') {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={it.slug ? homeHref(locale, it.slug, isCustomDomain) : undefined}
              className="inline-flex items-center gap-2 border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)] no-underline transition-colors hover:border-[var(--signal)]"
            >
              {displayName(it, locale)}
              {displayMeta(it.meta, locale) ? <span className="text-xs text-[var(--ink-soft)]">{displayMeta(it.meta, locale)}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (shelf.as === 'table') {
    return (
      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full text-sm">
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-[rgba(150,160,148,0.28)] last:border-0">
                <td className="px-4 py-2.5 font-medium">
                  <a href={it.slug ? homeHref(locale, it.slug, isCustomDomain) : undefined} className="text-[var(--ink)] no-underline hover:text-[var(--signal)]">
                    {displayName(it, locale)}
                  </a>
                </td>
                <td className="px-4 py-2.5 text-end text-[var(--ink-soft)]">{displayMeta(it.meta, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (shelf.as === 'tree' || shelf.as === 'list') {
    return (
      <ul className={shelf.as === 'tree' ? 'ms-4 border-s border-[var(--line)] ps-4' : ''}>
        {items.map((it) => (
          <li key={it.id} className="border-b border-[rgba(150,160,148,0.22)] last:border-0">
            <a
              href={it.slug ? homeHref(locale, it.slug, isCustomDomain) : undefined}
              className="flex items-baseline justify-between gap-4 py-2.5 text-[var(--ink)] no-underline hover:text-[var(--signal)]"
            >
              <span className="font-medium">{displayName(it, locale)}</span>
              {displayMeta(it.meta, locale) ? <span className="text-sm text-[var(--ink-soft)]">{displayMeta(it.meta, locale)}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  // cards
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <a
          key={it.id}
          href={it.slug ? homeHref(locale, it.slug, isCustomDomain) : undefined}
          className="block border border-[var(--line)] bg-white/70 p-4 no-underline transition-colors hover:border-[var(--line-strong)] hover:bg-white"
        >
          <span className="block font-display text-[var(--ink)]">{displayName(it, locale)}</span>
          {displayMeta(it.meta, locale) ? <span className="mt-1 block text-sm text-[var(--ink-soft)]">{displayMeta(it.meta, locale)}</span> : null}
        </a>
      ))}
    </div>
  );
}

// ── the unbound gallery: photographs with no value attached to them ──────────
function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((g) => (
        <figure key={g.id} className="group overflow-hidden border border-[var(--line)] bg-white">
          {/* External/CDN URLs of unknown dimensions: plain <img> avoids a remote
              image allow-list, and `cover` keeps the grid honest. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={g.url}
            alt={g.caption || g.caption2Title || ''}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {(g.caption || g.caption2Title || g.caption2Subtitle) ? (
            <figcaption className="px-3.5 py-3">
              {g.caption ? <p className="text-sm font-medium text-[var(--ink)]">{g.caption}</p> : null}
              {g.caption2Title ? (
                <p className="mt-0.5 text-[13px] text-[var(--ink-soft)]">{g.caption2Title}</p>
              ) : null}
              {g.caption2Subtitle ? (
                <p className="mt-0.5 font-mono text-xs text-[var(--ink-soft)]">{g.caption2Subtitle}</p>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

// ── contact plate: the buyer's exit, beside the name that earned the trust ───
function ContactPlate({
  contact, locale, phone, socialLinks,
}: {
  contact: Record<string, unknown>; locale: SiteLocale; phone: string | null;
  socialLinks: MinisiteData['business']['socialLinks'];
}) {
  const address = loc(contact.address, contact.address_ar, locale);
  const hours = loc(contact.opening_hours, contact.opening_hours_ar, locale);
  const rows: Array<{ key: keyof typeof UI; icon: React.ReactNode; value: string | null }> = [
    { key: 'address', icon: <IconPin size={13} />, value: address },
    { key: 'hours', icon: <IconClock size={13} />, value: hours },
    { key: 'phone', icon: <IconPhone size={13} />, value: phone },
  ];
  const shown = rows.filter((r) => r.value);
  const digits = phone ? phone.replace(/\D/g, '') : '';

  return (
    <section className="plate" aria-label={t('visit', locale)}>
      <header className="plate-head">
        <IconPin size={13} />
        {t('visit', locale)}
      </header>
      {shown.length ? shown.map((r) => (
        <div className="plate-row" key={r.key}>
          <span className="plate-key">{r.icon}{t(r.key, locale)}</span>
          <p className="plate-val">{r.value}</p>
        </div>
      )) : (
        <div className="plate-row">
          <p className="plate-val text-start text-[var(--ink-soft)]">{t('none', locale)}</p>
        </div>
      )}
      {digits ? (
        <div className="plate-actions">
          <a className="act act--call" href={`tel:${phone!.replace(/[^\d+]/g, '')}`}>
            <IconPhone size={14} />{t('call', locale)}
          </a>
          <a
            className="act act--wa"
            href={`https://wa.me/${digits.replace(/^0/, '20')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp size={14} />{t('whatsapp', locale)}
          </a>
        </div>
      ) : null}
      <SocialLinks links={socialLinks} locale={locale} label={socialLinksLabel(locale, 'business')} />
    </section>
  );
}

// ── active shelf body ────────────────────────────────────────────────────────
interface BodyProps {
  active: ActiveSectionView;
  locale: SiteLocale;
  identity: Record<string, unknown>;
  fieldsIndex: SlideFieldsIndex;
  claimed: ClaimedKeys;
  carousel: CarouselDefaults;
  brand: string;
  isCustomDomain: boolean;
  /** Carried to the carousel so a slide can link out to a shelf not on this page. */
  slug: string;
  /**
   * The front page lifts the carousel above the identity block so the hero is what
   * a visitor meets first; when it does, this body must not print the same rail a
   * second time below the fold.
   */
  heroHoisted?: boolean;
}

function SectionBody({ active, locale, identity, fieldsIndex, claimed, carousel, brand, slug, isCustomDomain, heroHoisted }: BodyProps) {
  const { section, groups, gallery, slides, shelves, blogs } = active;
  const isOverview = section.id === 'sec_1_identity';
  const sectionName = displayName(section, locale);

  // A value the hero already prints does not get printed twice on one page.
  const claimedHere = new Set([...claimed.anySection, ...(claimed.bySection[section.id] ?? [])]);

  const priceRaw = isOverview ? null : (() => {
    const field = groups.flatMap((g) => g.fields).find((f) => f.name === 'price_egp');
    const num = field ? Number(String(field.value).replace(/[^0-9.]/g, '')) : 0;
    return num > 0 ? num : null;
  })();

  const tagline = loc(identity.tagline, identity.tagline_ar, locale);
  const description = loc(identity.description, identity.description_ar, locale);

  return (
    <>
      {isOverview && (tagline || description) ? (
        <section className="panel" id={section.id}>
          <div className="panel-head">
            <h2 className="panel-title">{sectionName}</h2>
            <span className="panel-rule" />
          </div>
          {description ? (
            <p className="lede">{description}</p>
          ) : null}
        </section>
      ) : null}

      {slides.length && !heroHoisted ? (
        <section className="panel" id={`${section.id}-carousel`} aria-label={sectionName}>
          <GalleryCarousel
            slides={slides}
            locale={locale}
            label={sectionName}
            defaults={carousel}
            fieldsIndex={fieldsIndex}
            brand={brand}
            slug={slug}
          />
        </section>
      ) : null}

      {priceRaw ? (
        <section className="panel" id="finance">
          <div className="panel-head">
            <h2 className="panel-title">{locale === 'ar' ? 'حاسبة التمويل' : 'Finance calculator'}</h2>
            <span className="panel-rule" />
          </div>
          <FinanceCalculator price={priceRaw} locale={locale} />
        </section>
      ) : null}

      {groups.map((g) => {
        const fields = g.fields.filter((f) => !claimedHere.has(f.name));
        if (!fields.length) return null;
        return (
          <section className="panel" id={`${section.id}:${g.key}`} key={g.key}>
            <div className="panel-head">
              <h2 className="panel-title">{loc(g.label, g.label_ar, locale) ?? (locale === 'ar' ? '' : g.key)}</h2>
              <span className="panel-rule" />
            </div>
            <dl className="speclist">
              {fields.map((f) => (
                <div className="specitem" key={f.name}>
                  <dt className="speckey">{loc(f.label, f.label_ar, locale) ?? (locale === 'ar' ? '' : f.name)}</dt>
                  <dd className="specval">{f.value ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {shelves.map((shelf, i) => {
        const heading = shelfHeading(section.id, shelf.label, locale);
        const showHeading = shelves.length > 1 || shelf.label !== sectionName;
        return (
          <section className="panel" id={`${section.id}-shelf-${i}`} key={`${section.id}-${i}`}>
            {showHeading ? (
              <div className="panel-head">
                <h2 className="panel-title">{heading}</h2>
                <span className="panel-rule" />
              </div>
            ) : null}
            <ShelfItems shelf={shelf} locale={locale} isCustomDomain={isCustomDomain} />
          </section>
        );
      })}

      {gallery.length ? (
        <section className="panel" id={`${section.id}-gallery`}>
          <div className="panel-head">
            <h2 className="panel-title">{t('gallery', locale)}</h2>
            <span className="panel-rule" />
          </div>
          <GalleryGrid items={gallery} />
        </section>
      ) : null}

      {blogs.map((b) => (
        <article className="panel" key={b.id} id={`${section.id}-blog-${b.id}`}>
          <div className="panel-head">
            <h2 className="panel-title">{b.title}</h2>
            <span className="panel-rule" />
          </div>
          <p className="max-w-[68ch] whitespace-pre-wrap text-[15px] leading-[1.85] text-[var(--ink)]">
            {b.content}
          </p>
        </article>
      ))}

      {!isOverview && !slides.length && !groups.length && !shelves.length && !gallery.length && !blogs.length ? (
        <p className="panel text-[var(--ink-soft)]">{t('none', locale)}</p>
      ) : null}
    </>
  );
}

// ── top-level renderer ───────────────────────────────────────────────────────
export default async function MinisiteView({
  view,
  pageSlug,
  previewPage,
  preview = false,
}: {
  view: MinisiteData;
  pageSlug?: string;
  previewPage?: SitePage | null;
  preview?: boolean;
}) {
  const [publishedPage, customPages] = await Promise.all([
    previewPage ? Promise.resolve(null) : getPublishedSitePage(view.business.id, pageSlug ?? ''),
    listPublishedCustomPages(view.business.id),
  ]);
  const sitePage = previewPage ?? publishedPage;
  if (pageSlug && !sitePage) notFound();

  const locale = view.locale;
  const b = view.business;
  const isCustomerBusiness = ['main_agency', 'distributor', 'showroom', 'agent_broker', 'used_car_dealer'].includes(b.type_id);
  const canCaptureVendorLeads = isVendorLeadBusinessType(b.type_id);
  const showAutofyonSponsorship = isCustomerBusiness
    ? await requiresAutofyonSponsorship(b.id)
    : false;
  const announcements = !preview && !pageSlug && view.activeSectionId === 'sec_1_identity'
    ? await loadPublishedPortalContent()
    : null;
  const vendorVehicles = !pageSlug && isCustomerBusiness
    ? await unitsBySeller(b.id, { locale, limit: 12 })
    : [];
  const vehicleOverrides = view.isCustomDomain && view.customSiteProfile?.overrideOptions.length
    ? await loadCustomSiteVehicleOverrides(b.id, vendorVehicles.map((vehicle) => vehicle.id))
    : {};
  const name = displayName(b, locale);
  const typeName = loc(b.typeName, b.typeName_ar, locale) ?? '';
  const tagline = loc(b.identity.tagline, b.identity.tagline_ar, locale);
  const phone = typeof b.contact.phone === 'string' ? b.contact.phone : null;
  const siteStyle = {
    '--gold': view.siteProfile.accentColor,
    '--signal': view.siteProfile.accentColor,
    '--page': view.siteProfile.backgroundColor,
  } as CSSProperties;

  // On the front page the carousel is the hero, not a section: measured at 390px it
  // began 739px down, so the buyer's first screen was a name and a phone number and
  // the car itself was below the fold. The rail is lifted above the identity block
  // there, and SectionBody is told not to print it again.
  const active = view.active;
  const heroFirst = Boolean(active && active.section.id === 'sec_1_identity' && active.slides.length);
  const heroLabel = active ? displayName(active.section, locale) : '';

  return (
    <div
      dir={localeDir(locale)}
      lang={locale}
      className={`minisite-template minisite-template--${view.siteProfile.layout}`}
      data-template={view.siteProfile.layout}
      style={siteStyle}
    >
      {preview ? <div className="sticky top-0 z-50 bg-amber-300 px-4 py-2 text-center text-sm font-bold text-black">Admin draft preview — this version is not live</div> : null}
      <AnalyticsTracker businessId={b.id} />
      {announcements ? <PlatformNewsRibbon items={announcements.newsRibbon} locale={locale} /> : null}
      <div dir="ltr" className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 px-3 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:px-6">
        <div className="order-2 min-w-0 lg:order-1" dir={localeDir(locale)}>
        <div className="sheet">
        {/* The seller trail sits beneath the shared portal navigation. */}
        <div className="mark">
          <nav aria-label={t('home', locale)} className="flex flex-wrap items-center gap-2">
            <a className="link-quiet" href={localePath(locale, [])}>{t('home', locale)}</a>
            {view.ancestry.map((a) => (
              <span key={a.id} className="flex items-center gap-2">
                <span aria-hidden className="opacity-40">/</span>
                {a.slug
                  ? <a className="link-quiet" href={homeHref(locale, a.slug, view.isCustomDomain)}>{displayName(a, locale)}</a>
                  : <span>{displayName(a, locale)}</span>}
              </span>
            ))}
          </nav>
        </div>

        {!sitePage && heroFirst && active ? (
          <section className="panel panel--hero" id={`${active.section.id}-carousel`} aria-label={heroLabel}>
            <GalleryCarousel
              slides={active.slides}
              locale={locale}
              label={heroLabel}
              defaults={view.carousel}
              fieldsIndex={view.fieldsIndex}
              brand={name}
              slug={b.slug}
            />
          </section>
        ) : null}

        {!sitePage ? <header className="identity">
          <div>
            {view.siteProfile.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={view.siteProfile.logoUrl} alt={name} className="mb-3 max-h-16 max-w-40 object-contain" />
            ) : null}
            <h1 className="nameplate">{name}</h1>
            {typeName ? <p className="kicker">{typeName}</p> : null}
            {tagline ? <p className="tagline">{tagline}</p> : null}

            {b.type_id === 'vehicle_model' ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`/api/cars/${b.slug}/brochure`}
                  download
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600/15 border border-red-500/30 hover:bg-red-600/25 text-xs font-semibold text-red-300 transition shadow-sm hover:text-white"
                  title={locale === 'ar' ? 'تحميل مباشر للبروشور دون مغادرة الموقع' : 'Download official brochure without leaving'}
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{locale === 'ar' ? 'تحميل الكتالوج الرسمي (PDF)' : 'Download Official Brochure (PDF)'}</span>
                </a>

                {Boolean(b.identity.show_agent_link && b.identity.agent_source_url) ? (
                  <a
                    href={String(b.identity.agent_source_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-200 underline underline-offset-4"
                  >
                    <span>{locale === 'ar' ? 'المصدر: موقع الوكيل المعتمد' : 'Source: Official Agent Site'}</span>
                    <span className="text-xs">↗</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          <ContactPlate contact={b.contact} locale={locale} phone={phone} socialLinks={b.socialLinks} />
        </header> : null}

        {view.sections.length > 1 ? (
          <nav className="nav-shelf" aria-label={t('overview', locale)}>
            {view.sections.map((s) => {
              const on = s.id === view.activeSectionId;
              return (
                <a
                  key={s.id}
                  href={sectionHref(locale, b.slug, s.id, view.isCustomDomain)}
                  aria-current={on ? 'page' : undefined}
                  className={`shelf-link${on ? ' is-on' : ''}`}
                >
                  {displayName(s, locale)}
                </a>
              );
            })}
          </nav>
        ) : null}

        {customPages.length ? (
          <nav className="nav-shelf" aria-label={locale === 'ar' ? 'صفحات الموقع' : 'Site pages'}>
            <a
              href={localePath(locale, view.isCustomDomain ? [] : [b.slug])}
              aria-current={!pageSlug ? 'page' : undefined}
              className={`shelf-link${!pageSlug ? ' is-on' : ''}`}
            >
              {locale === 'ar' ? 'الرئيسية' : 'Main page'}
            </a>
            {customPages.map((page) => {
              const label = locale === 'ar' ? page.publishedTitleAr : page.publishedTitle;
              if (!label?.trim() || !page.publishedSlug) return null;
              const href = localePath(locale, view.isCustomDomain ? ['pages', page.publishedSlug] : [b.slug, 'pages', page.publishedSlug]);
              return (
                <a
                  key={page.id}
                  href={href}
                  aria-current={pageSlug === page.publishedSlug ? 'page' : undefined}
                  className={`shelf-link${pageSlug === page.publishedSlug ? ' is-on' : ''}`}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        ) : null}

        {sitePage ? (
          <SitePageRenderer view={view} page={sitePage} />
        ) : view.active ? (
          <SectionBody
            active={view.active}
            locale={locale}
            identity={b.identity}
            fieldsIndex={view.fieldsIndex}
            claimed={view.claimed}
            carousel={view.carousel}
            brand={name}
            slug={b.slug}
            isCustomDomain={view.isCustomDomain}
            heroHoisted={heroFirst}
          />
        ) : (
          <p className="panel text-[var(--ink-soft)]">{t('none', locale)}</p>
        )}

        {b.type_id === 'vehicle_model' && !sitePage ? (
          <ModelEcosystemDock carName={name} locale={locale} />
        ) : null}
        {!pageSlug && isCustomerBusiness ? (
          <VehicleInventory
            units={vendorVehicles}
            locale={locale}
            isCustomDomain={view.isCustomDomain}
            options={view.customSiteProfile?.inventoryOptions ?? DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions}
            overrideFields={view.customSiteProfile?.overrideOptions ?? []}
            vehicleOverrides={vehicleOverrides}
          />
        ) : null}
        {!preview && !pageSlug && canCaptureVendorLeads ? (
          <VendorLeadCaptureForm businessSlug={b.slug} businessName={name} locale={locale} landingType="minisite" />
        ) : null}

        {showAutofyonSponsorship ? (
          <footer className="mt-10 border-t border-[var(--line)] pt-4 text-center text-xs text-[var(--ink-soft)]">
            {locale === 'ar' ? 'هذا الموقع مقدم عبر ' : 'Powered by '}
            <a href="https://AUTOFYON.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--signal)] underline">
              AUTOFYON.com
            </a>
          </footer>
        ) : null}
        {isCustomerBusiness ? (
          <div className="mt-4 text-center text-xs text-[var(--ink-soft)]">
            <a
              href={`https://autofyon.com/admin/showroom/${encodeURIComponent(b.id)}`}
              className="font-semibold underline"
            >
              {locale === 'ar' ? 'إدارة موقع المعرض' : 'Manage this business'}
            </a>
          </div>
        ) : null}
      </div>
        </div>
        {announcements?.platformAds.length ? (
          <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-4" dir={localeDir(locale)}>
            <PlatformAdRail ads={announcements.platformAds} locale={locale} />
          </div>
        ) : null}
      </div>

      {phone ? (
        <ContactDock
          phone={phone}
          brand={name}
          carTitle={view.activeSectionId === 'sec_1_identity' ? null : name}
          locale={locale}
        />
      ) : null}
    </div>
  );
}
