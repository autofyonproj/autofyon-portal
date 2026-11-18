import React from 'react';
import type { SiteLocale } from '@/lib/site-locale';

interface PartnerItem {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  category: { en: string; ar: string };
  badge: { en: string; ar: string };
  tagline: { en: string; ar: string };
  description: { en: string; ar: string };
  iconSvg: React.ReactNode;
  brandColor: string;
  badgeBg: string;
}

const PARTNERS: PartnerItem[] = [
  {
    id: 'banque-misr',
    slug: 'banque-misr',
    name: { en: 'Banque Misr Auto Finance', ar: 'بنك مصر - تمويل السيارات' },
    category: { en: 'Auto Loans & Financing', ar: 'تمويل وتقسيط السيارات' },
    badge: { en: 'Up to 84 Mos | 0% Down opt.', ar: 'تقسيط حتى 84 شهراً | تمويل حتى 100%' },
    tagline: { en: 'Fastest credit approval in Egypt', ar: 'أسهل إجراءات وأسرع موافقة ائتمانية في مصر' },
    description: {
      en: 'Flexible auto financing solutions with competitive interest rates and extended repayment terms for new vehicles.',
      ar: 'برامج تمويل مرنة تناسب الموظفين وأصحاب المهن الحرة، مع إمكانية تمويل كامل قيمة السيارة وسرعة صرف التمويل.',
    },
    brandColor: 'from-amber-600/20 to-amber-900/10 border-amber-500/30 text-amber-500',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
    iconSvg: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'mobil-1',
    slug: 'mobil-1',
    name: { en: 'Mobil 1 Engine Protection', ar: 'موبيل 1 - الزيوت التخليقية' },
    category: { en: 'Engine Oils & Lubricants', ar: 'زيوت وحماية المحركات' },
    badge: { en: '10,000 KM | Turbo & GDI Protection', ar: 'حماية 10,000 كم | للمحركات الحديثة والتيربو' },
    tagline: { en: 'Global OEM certified synthetic oil', ar: 'الزيت الموصى به عالمياً للحفاظ على ضمان محركك' },
    description: {
      en: 'Advanced full synthetic motor oil delivering ultimate engine protection, fuel efficiency, and temperature control.',
      ar: 'تركيبة تخليقية متقدمة تحمي محركات التيربو والـ GDI من الرواسب والحرارة العالية وتضمن استقرار الأداء.',
    },
    brandColor: 'from-red-600/20 to-red-900/10 border-red-500/30 text-red-500',
    badgeBg: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25',
    iconSvg: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'vodafone',
    slug: 'vodafone',
    name: { en: 'Vodafone Connected Car', ar: 'فودافون - إنترنت السيارات الذكية' },
    category: { en: 'Connected Car & Telematics', ar: 'تكنولوجيا الاتصال والـ eSIM' },
    badge: { en: '4G/5G Ready | Live GPS & Media', ar: 'شريحة مدمجة | ملاحة وتحديثات وبث مباشر' },
    tagline: { en: 'Seamless high-speed in-cabin WiFi', ar: 'أقوى شبكة لخرائط الملاحة وشاشات الترفيه' },
    description: {
      en: 'High-speed internet connectivity for onboard navigation screens, real-time traffic updates, and wireless hotspot.',
      ar: 'حلول إنترنت متصلة للمقصورة الذكية تتيح تحديثات الخرائط اللحظية وبث الموسيقى والشاشات دون انقطاع.',
    },
    brandColor: 'from-rose-600/20 to-rose-900/10 border-rose-500/30 text-rose-500',
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25',
    iconSvg: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    id: 'misr-insurance',
    slug: 'misr-insurance',
    name: { en: 'Misr Insurance Auto Cover', ar: 'مصر للتأمين - التأمين الشامل' },
    category: { en: 'Comprehensive Motor Insurance', ar: 'التأمين الشامل للسيارات' },
    badge: { en: 'Authorized Agency Repair | Roadside', ar: 'إصلاح بالتوكيل المعتمد | مساعدة على الطريق' },
    tagline: { en: 'Egypt’s largest insurer since 1900', ar: 'حماية كاملة لاستثمارك وشبكة إصلاح معتمدة' },
    description: {
      en: 'Complete coverage against traffic accidents, theft, fire, and roadside emergencies with fast track repairs at official agency centers.',
      ar: 'وثيقة تأمين شاملة توفر راحة البال وحماية ضد الحوادث والسرقة مع إمكانية الإصلاح المباشر بمراكز الوكيل الرسمية.',
    },
    brandColor: 'from-blue-600/20 to-blue-900/10 border-blue-500/30 text-blue-500',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25',
    iconSvg: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function ModelEcosystemDock({
  carName,
  locale,
}: {
  carName: string;
  locale: SiteLocale;
}) {
  const isAr = locale === 'ar';

  return (
    <section className="panel mt-12 border-t border-[var(--line)] pt-8">
      {/* Header and Advisory Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--gold-glass)] text-[var(--gold)] border border-[var(--gold-border)] mb-2">
            <span>✨</span>
            <span>{isAr ? 'منظومة شركاء التجربة الاسترشادية (Silent Demo)' : 'Curated Ecosystem Partners (Advisory Demo)'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--ink)]">
            {isAr
              ? `خدمات وشركاء موصى بهم لسيارة ${carName}`
              : `Recommended Ecosystem Services for ${carName}`}
          </h2>
          <p className="text-xs md:text-sm text-[var(--ink-soft)] mt-1 max-w-2xl">
            {isAr
              ? 'دليل استرشادي لتيسير رحلة الشراء وخدمات ما بعد البيع عبر نخبة من الشركاء المعتمدين، اضغط على أي شريك لاستعراض ملفه الموثق.'
              : 'A curated advisory guide to streamline your purchase and ownership experience. Click any partner to view their certified profile.'}
          </p>
        </div>

        <div className="text-[11px] text-[var(--ink-soft)] bg-[var(--page-sunk)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start md:self-auto">
          {isAr ? '🔒 تصفح آمن داخل منصة أوتوفيون' : '🔒 Seamless in-platform browsing'}
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PARTNERS.map((partner) => {
          const name = isAr ? partner.name.ar : partner.name.en;
          const category = isAr ? partner.category.ar : partner.category.en;
          const badge = isAr ? partner.badge.ar : partner.badge.en;
          const tagline = isAr ? partner.tagline.ar : partner.tagline.en;
          const desc = isAr ? partner.description.ar : partner.description.en;

          return (
            <a
              key={partner.id}
              href={`/${partner.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-white/70 to-white/40 dark:from-neutral-900/70 dark:to-neutral-950/40 border border-[var(--line)] hover:border-[var(--signal)] hover:shadow-lg transition duration-200"
            >
              <div>
                {/* Sector & Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl border ${partner.brandColor} bg-white dark:bg-neutral-800`}>
                    {partner.iconSvg}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${partner.badgeBg}`}>
                    {badge}
                  </span>
                </div>

                <div className="text-[11px] font-semibold tracking-wider text-[var(--ink-soft)] uppercase mb-1">
                  {category}
                </div>
                <h3 className="text-base font-bold text-[var(--ink)] group-hover:text-[var(--signal)] transition">
                  {name}
                </h3>
                <p className="text-xs font-medium text-[var(--gold)] mt-0.5 mb-2">
                  {tagline}
                </p>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed line-clamp-3">
                  {desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-semibold text-[var(--signal)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{isAr ? 'استعراض التفاصيل والعروض' : 'Explore Offer Details'}</span>
                <span>{isAr ? '←' : '→'}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
