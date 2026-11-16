import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GalleryCarousel from '@/components/GalleryCarousel';
import InstallmentCalculatorClient from '@/components/InstallmentCalculatorClient';
import { mediaUrl } from '@/lib/media';
import { parseJson, query, queryOne } from '@/lib/db';
import type { Slide } from '@/lib/minisite';

export const dynamic = 'force-dynamic';

type LandingRow = {
  business_id: string;
  slug: string;
  display_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  website_url: string;
  social_links: string;
  images: string;
  youtube_videos: string;
  business_name?: string;
  business_name_ar?: string;
  business_type?: string;
};

type UnitPreview = {
  id: string;
  slug: string;
  title: string;
  title_ar: string | null;
  year: number | null;
  mileage_km: number | null;
  price_egp: number | null;
  media: string;
};

async function loadLanding(slug: string): Promise<LandingRow | null> {
  return queryOne<LandingRow>(
    `SELECT p.business_id, p.slug, p.display_name, p.tagline, p.description, p.phone,
            p.whatsapp, p.website_url, p.social_links, p.images, p.youtube_videos,
            COALESCE(b.name, p.display_name) AS business_name,
            COALESCE(b.name_ar, p.display_name) AS business_name_ar,
            b.type_id AS business_type
       FROM autofyon_media_landings p
  LEFT JOIN businesses b ON b.id = p.business_id
      WHERE (p.slug = ? OR lower(p.slug) = lower(?))
        AND (p.published = 1 OR p.business_id LIKE 'prospect_%')
      LIMIT 1`,
    [slug, slug],
  );
}

async function loadFeaturedUnits(businessId: string): Promise<UnitPreview[]> {
  try {
    return await query<UnitPreview>(
      `SELECT id, slug, title, title_ar, year, mileage_km, price_egp, media
         FROM units
        WHERE seller_business_id = ? AND status <> 'inactive'
        ORDER BY created_at DESC
        LIMIT 9`,
      [businessId],
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = await loadLanding(slug);
  if (!landing) return { title: 'AUTOFYON.com' };
  return {
    title: `${landing.display_name} | معرض معتمد على AUTOFYON.com`,
    description: landing.tagline || (landing.description ? landing.description.slice(0, 160) : 'معرض سيارات معتمد في مصر على منصة أوتوفيون'),
    alternates: { canonical: `/p/${encodeURIComponent(landing.slug)}` },
    openGraph: {
      title: `${landing.display_name} - AUTOFYON`,
      description: landing.tagline || 'اكتشف سيارات المعرض وتواصل مباشرة عبر واتساب',
      url: `https://autofyon.com/p/${encodeURIComponent(landing.slug)}`,
    },
  };
}

export default async function StarterLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = await loadLanding(slug);
  if (!landing) notFound();

  const units = await loadFeaturedUnits(landing.business_id);

  // Gallery Slides
  const storedImages = parseJson<Array<{ key?: unknown; caption?: unknown }>>(landing.images, []);
  const images = storedImages.slice(0, 8).filter((image) =>
    typeof image.key === 'string' && /^gallery\/[A-Za-z0-9._-]+$/.test(image.key),
  );
  const imageSlides: Slide[] = images.map((image, index) => ({
    id: `${landing.business_id}-starter-${index}`,
    mediaType: 'image',
    videoId: null,
    fieldKey: `starter-image-${index}`,
    fieldSectionId: 'starter-landing',
    eyebrow: `صورة ${index + 1}`,
    title: typeof image.caption === 'string' ? image.caption : '',
    note: null,
    url: mediaUrl(image.key as string),
    isHero: index === 0 ? 1 : 0,
    placeholder: false,
    imageFit: 'cover',
    animation: 'fade',
  }));

  const videos = parseJson<string[]>(landing.youtube_videos, [])
    .filter((id) => /^[A-Za-z0-9_-]{11}$/.test(id))
    .slice(0, 3);
  const videoSlides: Slide[] = videos.map((videoId, index) => ({
    id: `${landing.business_id}-starter-video-${index}`,
    mediaType: 'youtube',
    videoId,
    fieldKey: `starter-youtube-${index}`,
    fieldSectionId: 'starter-landing',
    eyebrow: `فيديو ${index + 1}`,
    title: '',
    note: null,
    url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    isHero: 0,
    placeholder: false,
    maxDuration: 120,
    animation: 'fade',
  }));
  const slides = [...imageSlides, ...videoSlides];

  // Contacts
  const socials = parseJson<Record<string, unknown>>(landing.social_links, {});
  const facebook = typeof socials.facebook === 'string' && /^https?:\/\//i.test(socials.facebook) ? socials.facebook : '';
  const instagram = typeof socials.instagram === 'string' && /^https?:\/\//i.test(socials.instagram) ? socials.instagram : '';
  const tiktok = typeof socials.tiktok === 'string' && /^https?:\/\//i.test(socials.tiktok) ? socials.tiktok : '';

  const rawWhatsapp = (landing.whatsapp || landing.phone || '').replace(/\D/g, '');
  const cleanPhone = (landing.phone || '').replace(/[^\d+]/g, '');
  const encodedGreeting = encodeURIComponent(`مرحباً، أتواصل معكم بخصوص المعرض المعروض على منصة أوتوفيون (${landing.display_name}).`);
  const whatsappHref = rawWhatsapp.length >= 7 ? `https://wa.me/${rawWhatsapp}?text=${encodedGreeting}` : '';

  return (
    <main lang="ar" dir="rtl" className="min-h-screen bg-[#07090c] text-white selection:bg-red-600 selection:text-white pb-28 md:pb-16 font-sans">
      {/* Ambient background glow & luxury automotive lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-amber-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-white/10 bg-[#07090c]/85 backdrop-blur-2xl sticky top-0 transition-all">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-600/40 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-xs uppercase text-white">
                AUTOFYON<span className="text-red-500">.com</span>
              </span>
              <span className="text-[9px] text-neutral-400">بوابة معارض السيارات المعتمدة</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/${landing.slug}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition"
            >
              زيارة الموقع الكامل ↗
            </Link>
            <a
              href={`/media-manager/index.html?business=${encodeURIComponent(landing.business_id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/40 text-xs font-bold text-red-300 hover:bg-red-600/30 transition shadow-sm"
              title="إدارة ونشر المحتوى والإعلانات التسويقية للمعرض"
            >
              <span>📱</span>
              <span className="hidden xs:inline">مدير التسويق الذكي</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-10">
        {/* Owner Welcome / Claim Combo Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/50 via-black/60 to-red-950/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-red-950/20">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-xl shrink-0 shadow-md shadow-red-600/30">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-400 tracking-wide uppercase">عرض كومبو الترحيب المجاني</span>
                <span className="text-[10px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 font-bold">خاص بصاحب المعرض</span>
              </div>
              <p className="text-xs text-neutral-200 mt-1 font-medium leading-relaxed">
                هذه الصفحة التسويقية واستوديو صناعة الإعلانات وفيديوهات السيارات محجوزة باسم <strong className="text-white font-bold">{landing.display_name}</strong> مجاناً.
              </p>
            </div>
          </div>
          <a
            href={`/media-manager/index.html?business=${encodeURIComponent(landing.business_id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-xs font-black text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] whitespace-nowrap self-stretch sm:self-auto"
          >
            <span>استلم استوديو المعرض وابدأ التسويق</span>
            <span>←</span>
          </a>
        </div>

        {/* Hero Card */}
        <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              {/* Verified Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                معرض معتمد وموثق على منصة AUTOFYON
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {landing.display_name}
              </h1>

              {landing.tagline && (
                <p className="text-base sm:text-xl text-neutral-300 font-semibold leading-relaxed">
                  {landing.tagline}
                </p>
              )}

              {landing.description && (
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap pt-1">
                  {landing.description}
                </p>
              )}

              {/* Trust Pillars */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-neutral-300">
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span>🛡️</span> فحص فني وضمان
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span>⚡</span> استلام فوري وترخيص
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span>💳</span> تقسيط مباشر وبنكي
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span>🔄</span> إمكانية الاستبدال
                </span>
              </div>
            </div>

            {/* Quick Action Buttons Header (Desktop & Tablet) */}
            <div className="flex flex-col gap-3 min-w-[220px] self-stretch md:self-auto pt-2">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 font-bold text-sm text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <span className="text-lg">💬</span>
                  <span>محادثة واتساب المعرض</span>
                </a>
              )}

              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 font-bold text-sm text-white transition-all hover:scale-[1.02]"
                >
                  <span className="text-base">📞</span>
                  <span dir="ltr">{landing.phone}</span>
                </a>
              )}

              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 font-bold text-xs text-amber-300 transition-all"
              >
                <span>🧮</span>
                <span>حاسبة التقسيط الفورية</span>
              </a>

              <Link
                href={`/${landing.slug}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 font-medium text-xs text-neutral-300 transition-all"
              >
                <span>🚗</span>
                <span>كتالوج المعرض الكامل ↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Media Gallery / Video Carousel */}
        {slides.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-2.5 shadow-2xl">
            <GalleryCarousel
              slides={slides}
              locale="ar"
              label="معرض الصور والفيديوهات"
              brand={landing.display_name}
            />
          </section>
        )}

        {/* Featured Units Grid */}
        {units.length > 0 && (
          <section id="inventory" className="mt-14 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold mb-1">
                  <span>🚗</span>
                  <span>المخزون المتوفر</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">سيارات متاحة فوراً بالمعرض</h2>
                <p className="text-xs text-neutral-400">تواصل لحجز موعد معاينة أو تجربة القيادة وحساب خطة التقسيط</p>
              </div>
              <Link
                href={`/${landing.slug}`}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
              >
                <span>شاهد الكل ({units.length})</span>
                <span>←</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {units.map((unit) => {
                const unitMedia = parseJson<{ photos?: string[] }>(unit.media, {});
                const firstPhoto = unitMedia.photos?.[0] ? mediaUrl(unitMedia.photos[0]) : null;
                const unitTitle = unit.title_ar || unit.title;
                const carInquiry = encodeURIComponent(`مرحباً، أستفسر عن سيارة ${unitTitle} المعروضة لدى معرض ${landing.display_name} على أوتوفيون.`);
                const carWhatsApp = rawWhatsapp ? `https://wa.me/${rawWhatsapp}?text=${carInquiry}` : whatsappHref;

                // Estimated monthly installment preview (assuming 30% down, 36 months)
                const estPrice = unit.price_egp || 0;
                const estMonthly = estPrice > 0 ? Math.round((estPrice * 0.7 * (1 + 0.17 * 3)) / 36) : null;

                return (
                  <article
                    key={unit.id}
                    className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden hover:border-red-500/40 hover:bg-white/[0.06] transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                        {firstPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={firstPhoto}
                            alt={unitTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-4xl opacity-30">🚗</span>
                        )}
                        {unit.year && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black text-white border border-white/15">
                            موديل {unit.year}
                          </span>
                        )}
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          جاهزة للاستلام
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-1">
                          {unitTitle}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                          {unit.mileage_km !== null ? (
                            <span>{unit.mileage_km.toLocaleString('ar-EG')} كم</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">زيرو / استلام فوري</span>
                          )}
                          {unit.price_egp ? (
                            <span className="font-black text-white text-base">
                              {unit.price_egp.toLocaleString('ar-EG')} <span className="text-[10px] text-neutral-400 font-normal">ج.م</span>
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-xs">اتصل للسعر</span>
                          )}
                        </div>

                        {estMonthly && (
                          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px]">
                            <span className="text-neutral-400">قسط تقديري يبدأ من:</span>
                            <span className="font-extrabold text-amber-400">
                              {estMonthly.toLocaleString('ar-EG')} ج.م/شهر
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-1 flex gap-2">
                      {carWhatsApp && (
                        <a
                          href={carWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition"
                        >
                          <span>💬</span>
                          <span>واتساب</span>
                        </a>
                      )}
                      <a
                        href="#calculator"
                        className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition"
                        title="حساب القسط"
                      >
                        <span>🧮</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Interactive Installment & Finance Calculator */}
        <InstallmentCalculatorClient
          showroomName={landing.display_name}
          whatsappNumber={landing.whatsapp || landing.phone}
          defaultPrice={units.length > 0 && units[0].price_egp ? units[0].price_egp : 1200000}
        />

        {/* Marketing Manager Integration Card (For Dealer Nurturing & Activation) */}
        <section className="mt-14 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-neutral-900/50 to-black/60 p-6 sm:p-9 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-[10px] font-bold">
                <span>⚡</span>
                <span>نظام المستشار الذكي لصناعة إعلانات المعارض</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                استوديو صناعة الإعلانات وإدارة المعرض
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                صمم بوسترات وفيديوهات احترافية لسياراتك، أرسل عروض واتساب جاهزة للعملاء بضغطة زر، وتحكم في موقع معرضك الإلكتروني الخاص المستقل بالكامل.
              </p>
            </div>
            <a
              href={`/media-manager/index.html?business=${encodeURIComponent(landing.business_id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-black text-xs text-white shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              فتح استوديو مدير التسويق ⚡
            </a>
          </div>
        </section>

        {/* Social Links & Channels */}
        {(facebook || instagram || tiktok || landing.website_url) && (
          <section className="mt-10 flex flex-wrap gap-2.5 items-center justify-center pt-4 text-xs text-neutral-400">
            <span className="font-semibold">قنوات المعرض الرسمية:</span>
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition border border-white/5">
                Facebook
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition border border-white/5">
                Instagram
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition border border-white/5">
                TikTok
              </a>
            )}
            {landing.website_url && (
              <a href={landing.website_url} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition border border-white/5">
                الموقع الرسمي
              </a>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-white/10 text-center text-xs text-neutral-500 space-y-3">
          <p className="leading-relaxed">
            هذه الصفحة برعاية شبكة <a href="https://autofyon.com" className="font-extrabold text-white hover:text-red-400 transition">AUTOFYON.com</a> — الدليل والشبكة الرسمية لمعارض وتجارة السيارات في مصر.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-neutral-400 pt-1">
            <Link href="/" className="hover:text-white transition">الرئيسية</Link>
            <Link href="/cars" className="hover:text-white transition">سوق السيارات</Link>
            <Link href="/brands" className="hover:text-white transition">العلامات التجارية</Link>
            <Link href="/almostashar" className="hover:text-white transition">المستشار</Link>
            <Link href="/join" className="hover:text-red-400 font-semibold transition">انضم كمعرض معتمد</Link>
          </div>
        </footer>
      </div>

      {/* Luxury Mobile Native Bottom Dock (Optimized for Mobile App Experience) */}
      <nav aria-label="شريط الوصول السريع" className="fixed bottom-0 inset-x-0 z-50 p-2.5 bg-[#07090c]/90 border-t border-white/10 backdrop-blur-2xl md:hidden shadow-2xl">
        <div className="flex items-center justify-around gap-1.5 max-w-md mx-auto">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 font-black text-xs text-white text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <span>💬</span>
              <span>واتساب المعرض</span>
            </a>
          )}
          {cleanPhone && (
            <a
              href={`tel:${cleanPhone}`}
              className="py-2.5 px-3 rounded-xl bg-white/[0.08] border border-white/15 font-bold text-xs text-white text-center flex items-center justify-center gap-1"
            >
              <span>📞</span>
              <span>اتصال</span>
            </a>
          )}
          <a
            href="#calculator"
            className="py-2.5 px-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 font-bold text-xs text-center flex items-center justify-center gap-1"
            title="حاسبة التقسيط"
          >
            <span>🧮</span>
            <span className="hidden xs:inline">التقسيط</span>
          </a>
          <a
            href={`/media-manager/index.html?business=${encodeURIComponent(landing.business_id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 font-bold text-xs text-center flex items-center justify-center gap-1"
            title="استوديو التسويق"
          >
            <span>📱</span>
            <span className="hidden xs:inline">الاستوديو</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
