import Link from 'next/link';
import type { VendorPublicLanding } from '@/lib/vendor-public-landing';
import { loadPublishedPortalContent } from '@/lib/portal-site';
import { PlatformAdRail, PlatformNewsRibbon } from '@/components/PlatformAnnouncements';
import VendorLeadCaptureForm from '@/components/VendorLeadCaptureForm';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';
import { buildWhatsAppCtaUrl, getWhatsAppCtaLabel, getVendorTypeConfig } from '@/lib/vendor-business-types';

function phoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `20${digits.slice(1)}`;
  return digits;
}

/** Badge colour per business type parent group */
function typeBadgeStyle(typeId: string): string {
  const config = getVendorTypeConfig(typeId);
  if (!config) return 'bg-emerald-50 text-emerald-800';
  if (config.parentGroup === 'auto_aftermarket') return 'bg-orange-50 text-orange-800';
  if (config.parentGroup === 'auto_finance') return 'bg-blue-50 text-blue-800';
  return 'bg-emerald-50 text-emerald-800'; // auto_sales
}

function typeBadgeLabel(typeId: string, locale: 'ar' | 'en'): string {
  const config = getVendorTypeConfig(typeId);
  if (!config) return locale === 'ar' ? 'معتمد على أوتوفيون' : 'Approved on AutoFyon';
  return `${config.icon} ${locale === 'ar' ? config.nameAr : config.nameEn}`;
}

export default async function DealerPublicLanding({
  dealer,
  locale = 'ar',
}: {
  dealer: VendorPublicLanding;
  locale?: 'ar' | 'en';
}) {
  const announcements = await loadPublishedPortalContent();
  const isAr = locale === 'ar';
  const phone = phoneDigits(dealer.phone);
  const whatsappRaw = dealer.whatsapp || dealer.phone;
  const socialLinks = Object.entries(dealer.socials).filter(([, url]) => Boolean(url));
  const typeId = dealer.typeId || 'showroom';

  // Smart WhatsApp CTA based on business type
  const whatsappCtaUrl = buildWhatsAppCtaUrl(whatsappRaw, typeId, isAr ? dealer.displayName : (dealer.displayNameEn || dealer.displayName), locale);
  const whatsappCtaLabel = getWhatsAppCtaLabel(typeId, locale);

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <PlatformNewsRibbon items={announcements.newsRibbon} locale={locale} />
      <div dir="ltr" className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 px-3 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:px-6">
        <div className="order-2 min-w-0 lg:order-1" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="font-black text-red-700">AutoFyon</Link>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${typeBadgeStyle(typeId)}`}>
            {typeBadgeLabel(typeId, locale)}
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">AutoFyon · {isAr ? 'صفحة النشاط التجاري' : 'Business Profile'}</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">{isAr ? dealer.displayName : dealer.displayNameEn || dealer.displayName}</h1>
          {dealer.displayNameEn && dealer.displayNameEn !== dealer.displayName && (
            <p className="mt-2 text-lg text-slate-500" dir="ltr">{dealer.displayNameEn}</p>
          )}
          {dealer.tagline && <p className="mt-5 text-lg font-semibold text-slate-700">{dealer.tagline}</p>}
          {dealer.description && <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-8 text-slate-600">{dealer.description}</p>}
          {(dealer.city || dealer.address) && (
            <address className="mt-5 not-italic text-sm text-slate-600">
              {dealer.city}{dealer.city && dealer.address ? ' · ' : ''}{dealer.address}
            </address>
          )}

          {dealer.isClaimable && (
            <div className="mt-6 rounded-2xl border border-dashed border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-700">
                  <span>⭐</span>
                  <span>{isAr ? 'صفحة مسجلة في دليل أوتوفيون الرسمي' : 'Official AutoFyon Directory Listing'}</span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  {isAr ? `هل أنت صاحب أو مفوض إدارة [${dealer.displayName}]؟` : `Are you the owner or manager of [${dealer.displayNameEn || dealer.displayName}]?`}
                </h2>
                <p className="text-xs text-slate-600">
                  {isAr ? 'وثّق ملكية صفحة معرضك الآن مجاناً لتفعيل استقبال استفسارات المشترين وتخصيص بياناتك.' : 'Claim and verify your business profile for free to start receiving direct buyer inquiries.'}
                </p>
              </div>
              <Link
                href={`/join?claim=${encodeURIComponent(dealer.businessId)}&slug=${encodeURIComponent(dealer.slug)}&name=${encodeURIComponent(dealer.displayName)}&city=${encodeURIComponent(dealer.city)}`}
                className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-black text-neutral-950 hover:brightness-105 shadow-md transition"
              >
                {isAr ? 'توثيق واعتماد المعرض مجاناً ←' : 'Claim Showroom for Free →'}
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {whatsappCtaUrl && (
              <a href={whatsappCtaUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">
                {whatsappCtaLabel}
              </a>
            )}
            {phone && <a href={`tel:+${phone}`} className="rounded-xl border border-black/15 px-5 py-3 text-sm font-bold">{isAr ? 'اتصال هاتفي' : 'Call'}</a>}
            {dealer.email && <a href={`mailto:${dealer.email}`} className="rounded-xl border border-black/15 px-5 py-3 text-sm font-bold">{isAr ? 'البريد الإلكتروني' : 'Email'}</a>}
            {dealer.websiteUrl && (
              <a href={dealer.websiteUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-black/15 px-5 py-3 text-sm font-bold">
                {isAr ? 'الموقع الإلكتروني' : 'Website'}
              </a>
            )}
          </div>
          {socialLinks.length > 0 && (
            <nav aria-label="Social profiles" className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-5">
              {socialLinks.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline">
                  {name}
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>
      {isVendorLeadBusinessType(dealer.typeId) ? (
        <div className="mx-auto max-w-5xl px-4 pb-12">
          <VendorLeadCaptureForm
            businessSlug={dealer.slug}
            businessName={isAr ? dealer.displayName : dealer.displayNameEn || dealer.displayName}
            locale={locale}
            landingType="starter"
          />
        </div>
      ) : null}
        </div>
        {announcements.platformAds.length ? (
          <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-4" dir={isAr ? 'rtl' : 'ltr'}>
            <PlatformAdRail ads={announcements.platformAds} locale={locale} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
