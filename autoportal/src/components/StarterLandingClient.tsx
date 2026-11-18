'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface StarterLandingData {
  businessId: string;
  slug: string;
  displayName: string;
  displayNameEn?: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  city: string;
  youtubeVideoId: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };
  claimUrl: string;
  mediaManagerUrl: string;
}

interface Props {
  data: StarterLandingData;
  locale?: 'ar' | 'en';
}

const SAMPLE_BRANDS = [
  {
    name: 'Toyota',
    nameAr: 'تويوتا',
    models: [
      {
        name: 'Corolla 2025',
        nameAr: 'كورولا 2025',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
        price: '1,450,000 EGP',
        specs: '1.6L • أوتوماتيك • زيرو',
      },
      {
        name: 'Fortuner 4x4',
        nameAr: 'فورتشنر دفع رباعي',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        price: '3,200,000 EGP',
        specs: '2.7L • دفع كلي • زيرو',
      },
    ],
  },
  {
    name: 'Mercedes-Benz',
    nameAr: 'مرسيدس بنز',
    models: [
      {
        name: 'C-Class 2025',
        nameAr: 'سي كلاس 2025',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        price: '3,850,000 EGP',
        specs: 'C200 AMG • فبريكا',
      },
      {
        name: 'E-Class Luxury',
        nameAr: 'إي كلاس فاخرة',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        price: '4,900,000 EGP',
        specs: 'E200 Exclusive • زيرو',
      },
    ],
  },
  {
    name: 'Hyundai',
    nameAr: 'هيونداي',
    models: [
      {
        name: 'Tucson NX4 Turbo',
        nameAr: 'توسان تيربو NX4',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        price: '1,790,000 EGP',
        specs: '1.6T 180HP • فئة أولى',
      },
      {
        name: 'Elantra CN7',
        nameAr: 'إلنترا CN7',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        price: '1,320,000 EGP',
        specs: '1.6L Smart • زيرو',
      },
    ],
  },
  {
    name: 'MG',
    nameAr: 'إم جي',
    models: [
      {
        name: 'MG GT Fastback',
        nameAr: 'إم جي جي تي فاست باك',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        price: '1,250,000 EGP',
        specs: '1.5T 173HP • سبورت',
      },
      {
        name: 'MG HS Trophy',
        nameAr: 'إم جي إتش إس تروفي',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
        price: '1,570,000 EGP',
        specs: 'بانوراما • جلد أحمر',
      },
    ],
  },
];

export default function StarterLandingClient({ data, locale = 'ar' }: Props) {
  const isAr = locale === 'ar';
  const [activeSlide, setActiveSlide] = useState(0);
  const [showGateModal, setShowGateModal] = useState(false);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);

  const cleanPhone = data.phone.replace(/[^\d+]/g, '');
  const digitsPhone = data.phone.replace(/\D/g, '');
  const cleanWa = (data.whatsapp || data.phone).replace(/\D/g, '');

  const waGreeting = encodeURIComponent(
    isAr
      ? `مرحباً ${data.displayName}، أتواصل معكم بخصوص السيارات المعروضة في صفحتكم على منصة أوتوفاي أون (autofyon.com).`
      : `Hello ${data.displayName}, I am contacting you regarding cars listed on your AutoFy On showroom page (autofyon.com).`,
  );
  const waUrl = cleanWa ? `https://wa.me/${cleanWa.startsWith('0') ? '20' + cleanWa.slice(1) : cleanWa}?text=${waGreeting}` : '';

  return (
    <div className="relative min-h-screen bg-[#07090c] text-white selection:bg-red-600 selection:text-white pb-32">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[170px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 border-b border-white/10 bg-[#07090c]/90 backdrop-blur-2xl sticky top-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-black text-white text-sm shadow-md shadow-red-600/40">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-wider text-xs uppercase text-white">
                أوتوفاي أون <span className="text-red-500 font-mono">AUTOFYON.com</span>
              </span>
              <span className="text-[9px] text-neutral-400">
                {isAr ? 'شبكة معارض السيارات المعتمدة في مصر' : 'Certified Egyptian Dealership Network'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <Link
              href={isAr ? `/en/p/${data.slug}` : `/p/${data.slug}`}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition"
            >
              {isAr ? 'English 🇬🇧' : 'العربية 🇪🇬'}
            </Link>

            {/* Quick Claim Button in Header */}
            <Link
              href={data.claimUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition"
            >
              <span>⚡</span>
              <span>{isAr ? 'تفعيل المعرض مجاناً' : 'Claim Free Showroom'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Showcase Container */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Verification & Teaser Notice Bar */}
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#161208] to-amber-950/40 p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⭐</span>
            <p className="text-xs sm:text-sm text-neutral-200">
              <strong className="text-amber-400 font-black">
                {isAr ? `معاينة خاصة وحصرية لـ [${data.displayName}]` : `Exclusive Preview for [${data.displayName}]`}
              </strong>{' '}
              —{' '}
              {isAr
                ? 'تم تجهيز هذا الموقع واستوديو الميديا مانجر خصيصاً لمعرضكم على شبكة أوتوفاي أون.'
                : 'This showroom landing page & Media Studio are prepared for your dealership on AutoFy On.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowGateModal(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
          >
            {isAr ? '🔍 فحص الجاهزية والربط' : '🔍 Run Live Checkup'}
          </button>
        </div>

        {/* HERO WRAPPER (Carousel + Left Action Dock) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT CONTACT DOCK (Prominent & Operational with the Dealer's Own Phone) */}
          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#0d1017]/95 backdrop-blur-xl p-5 flex flex-col justify-between gap-4 shadow-2xl order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isAr ? 'أرقام الاتصال الحية لمعرضك' : 'Live Showroom Contact Dock'}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{data.displayName}</h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                  <span>📍</span>
                  <span>{data.city || (isAr ? 'جمهورية مصر العربية' : 'Egypt')}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 block font-semibold">
                  {isAr ? 'الهاتف المسجل في النظام:' : 'Registered Phone Number:'}
                </span>
                <span className="font-mono text-sm font-bold text-white block dir-ltr" dir="ltr">
                  {cleanPhone || '+20 100 000 0000'}
                </span>
              </div>
            </div>

            {/* LIVE ACTION BUTTONS (Point to the Dealer's own phone) */}
            <div className="space-y-2.5">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <span className="text-base">💬</span>
                  <span>{isAr ? 'تجربة مراسلة واتساب الحية' : 'Live WhatsApp Direct Chat'}</span>
                </a>
              )}

              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all hover:scale-[1.02]"
                >
                  <span className="text-base">📞</span>
                  <span>{isAr ? 'تجربة الاتصال الهاتفي المباشر' : 'Live Direct Phone Call'}</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setShowGateModal(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-amber-500/40 text-amber-300 text-[11px] font-bold hover:bg-amber-500/10 transition"
              >
                <span>⚙️</span>
                <span>{isAr ? 'كيف تستلم اتصالات المشترين؟' : 'How Buyer Inquiries Work?'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT HERO CAROUSEL (3 Interactive Slides) */}
          <div className="lg:col-span-9 rounded-3xl border border-white/10 bg-[#0d1017] overflow-hidden shadow-2xl flex flex-col justify-between order-1 lg:order-2">
            {/* Slide Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setActiveSlide(0)}
                className={`flex-1 py-3 px-3 text-center text-xs font-bold transition-all border-b-2 ${
                  activeSlide === 0
                    ? 'border-red-500 text-white bg-red-600/10'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                ✨ {isAr ? '1. هوية المعرض' : '1. Showroom Identity'}
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide(1)}
                className={`flex-1 py-3 px-3 text-center text-xs font-bold transition-all border-b-2 ${
                  activeSlide === 1
                    ? 'border-red-500 text-white bg-red-600/10'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                🎬 {isAr ? '2. جولة الفيديو والمواصفات' : '2. Video Presentation'}
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide(2)}
                className={`flex-1 py-3 px-3 text-center text-xs font-bold transition-all border-b-2 ${
                  activeSlide === 2
                    ? 'border-red-500 text-white bg-red-600/10'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                🏆 {isAr ? '3. خدمات ومزايا شبكتنا' : '3. Network Privileges'}
              </button>
            </div>

            {/* SLIDE 0: Dealer Name & Motions */}
            {activeSlide === 0 && (
              <div className="relative p-6 sm:p-10 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-amber-950/20 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black tracking-wider uppercase">
                    <span>👑</span>
                    <span>{isAr ? 'عضو شبكة أوتوفاي أون الرسمية' : 'AutoFy On Certified Partner'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {data.displayName}
                  </h1>

                  <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                    {data.description ||
                      (isAr
                        ? `معرض ${data.displayName} — صرح معتمد لتجارة واستبدال السيارات في مصر، يقدم أفضل عروض الكاش والتقسيط لعملائه مع باقة أوتوفاي أون الرقمية المتكاملة.`
                        : `${data.displayName} — Premier Egyptian automotive dealership with digital showroom, verified inventory, and comprehensive auto financing options on AutoFy On.`)}
                  </p>
                </div>

                <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition hover:scale-105"
                  >
                    <span>▶️</span>
                    <span>{isAr ? 'مشاهدة فيديو المنصة' : 'Watch Network Video'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSlide(2)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-xs font-black text-white shadow-lg shadow-red-600/30 transition hover:scale-105"
                  >
                    <span>{isAr ? 'استعراض خدماتنا لمعرضكم' : 'Explore Dealership Benefits'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 1: YouTube Video Embed */}
            {activeSlide === 1 && (
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {data.youtubeVideoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${data.youtubeVideoId}?autoplay=1&mute=0&rel=0`}
                    title="AutoFy On Presentation"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <span className="text-5xl">🎬</span>
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? 'فيديو جولة المنصة واستوديو الميديا مانجر' : 'Platform & Media Studio Walkthrough'}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      {isAr
                        ? 'يمكن للأدمن ربط فيديو خاص بمعرضكم أو فيديو المنصة الترويجي هنا.'
                        : 'Custom video can be linked by the platform admin for this dealership.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SLIDE 2: Network Services & Benefits in Detail */}
            {activeSlide === 2 && (
              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isAr ? 'ماذا يجني معرضكم عند الانضمام لشبكة أوتوفاي أون؟' : 'Why Partner With AutoFy On?'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isAr
                      ? 'باقة متكاملة من الخدمات التسويقية والتكنولوجية المخصصة لمعارض وتجار السيارات في مصر'
                      : 'Comprehensive digital infrastructure engineered exclusively for Egyptian dealerships'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 hover:border-amber-500/40 transition">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <span>⚡</span>
                      <span>{isAr ? 'موقع إلكتروني وصفحة تسويقية مستقلة' : 'Branded Minisite & Landing Page'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {isAr
                        ? 'عنوان رقمي دائم باسم معرضكم يتيح للعملاء تصفح سياراتكم وعروض التقسيط مع زر واتساب مباشر.'
                        : 'Dedicated showroom URL with your cars, installment calculator, and 1-tap WhatsApp leads.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <span>🎨</span>
                      <span>{isAr ? 'استوديو ميديا مانجر مجاني للموبايل' : 'Free Mobile Media Manager'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {isAr
                        ? 'أداة ذكية لتوليد تصاميم وقوائم أسعار وفيديوهات ريلز لسياراتكم لنشرها على فيسبوك وتيك توك بضغطة واحدة.'
                        : 'Automated studio to generate reels, price sheets, and social media flyers in 1-click.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 hover:border-blue-500/40 transition">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <span>🛡️</span>
                      <span>{isAr ? 'شارة التوثيق الذهبية في دليل مصر' : 'Verified Gold Badge in Directory'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {isAr
                        ? 'تثبيت معرضكم في صدارة نتائج البحث في دليل معارض السيارات المصرية أمام آلاف المشترين يومياً.'
                        : 'Top placement in the Egyptian automotive directory with the official AutoFy On gold badge.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 hover:border-purple-500/40 transition">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <span>📲</span>
                      <span>{isAr ? 'عملاء مباشرون بدون وسيط أو عمولة' : 'Direct Leads With Zero Commission'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {isAr
                        ? 'كل مشتري يتواصل مباشرة مع رقم هاتف المعرض أو الواتساب، والبيع يتم بينكم وبين العميل بحرية تامة.'
                        : 'Zero commission or middleman fees. Inquiries reach your phone directly.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BODY SECTION: Brand Minicarousels & Inventory Preview */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 space-y-6">
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
              {isAr ? 'مخزون السيارات وعروض المعرض' : 'Showroom Fleet & Inventory Showcase'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'كيف ستظهر سياراتك لجمهور المشترين في مصر؟' : 'How Your Inventory Appears to Buyers'}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md">
            {isAr
              ? 'تتيح لك منصة أوتوفاي أون عرض سياراتك بكاروسيل صور عالي الدقة، حاسبة تقسيط، وزر استفسار مباشر.'
              : 'HD photo carousels, dynamic installment estimates, and direct buyer inquiries.'}
          </p>
        </div>

        {/* Brand Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SAMPLE_BRANDS.map((b, idx) => (
            <button
              key={b.name}
              type="button"
              onClick={() => setActiveBrandIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                activeBrandIndex === idx
                  ? 'bg-white text-neutral-950 border-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {isAr ? b.nameAr : b.name}
            </button>
          ))}
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SAMPLE_BRANDS[activeBrandIndex].models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-white/10 bg-[#0d1017] overflow-hidden group hover:border-red-500/40 transition-all shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-400">
                  {model.price}
                </div>
              </div>

              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-white">{isAr ? model.nameAr : model.name}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">{model.specs}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGateModal(true)}
                  className="shrink-0 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition"
                >
                  {isAr ? 'استفسار واتساب 💬' : 'WhatsApp Inquiry'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION: Social Media Links Tab */}
      <footer className="relative z-10 mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h3 className="text-lg font-black text-white">
                {isAr ? 'حسابات المعرض على منصات التواصل الاجتماعي' : 'Showroom Social Media Accounts'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {isAr
                  ? 'اربط حساباتك الرسمية على فيسبوك وتيك توك وإنستجرام لتظهر لجمهورك على autofyon.com'
                  : 'Connect your official Facebook, TikTok, and Instagram handles to your AutoFy On page.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowGateModal(true)}
              className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition"
            >
              {isAr ? '+ أضف أو عدّل روابط السوشيال ميديا' : '+ Link Social Handles'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {['Facebook', 'Instagram', 'TikTok', 'YouTube', 'WhatsApp'].map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setShowGateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-neutral-200 transition"
              >
                <span>🌐</span>
                <span>{platform}</span>
              </button>
            ))}
          </div>

          {/* Media Manager Phone App Download Teaser */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                📱 {isAr ? 'تطبيق الموبايل المجاني' : 'Free Mobile Tool'}
              </span>
              <h4 className="text-base font-bold text-white">
                {isAr ? 'استوديو ميديا مانجر أوتوفاي أون لهواتف أندرويد وآيفون' : 'AutoFy On Mobile Media Manager Studio'}
              </h4>
              <p className="text-xs text-neutral-300 max-w-xl">
                {isAr
                  ? 'صمم بوسترات سياراتك، فيديوهات ريلز، وعروض الأسعار في ثوانٍ ونزلها فوراً على هاتفك.'
                  : 'Design vehicle flyers, video reels, and instant price sheets directly on your smartphone.'}
              </p>
            </div>

            <a
              href={data.mediaManagerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-105"
            >
              <span>📲 {isAr ? 'تثبيت / فتح الاستوديو' : 'Launch Studio PWA'}</span>
            </a>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM ACTION BAR (The Gated Conversion Hook) */}
      <aside className="fixed bottom-0 inset-x-0 z-40 border-t border-amber-500/40 bg-[#07090c]/95 backdrop-blur-2xl p-3 sm:p-4 shadow-2xl">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4">
          <div className="flex items-center gap-3 text-center sm:text-start">
            <span className="text-2xl hidden sm:inline">🎁</span>
            <div>
              <p className="text-xs sm:text-sm font-black text-white">
                {isAr
                  ? `هذه المعاينة مجهزة مؤقتاً لـ [${data.displayName}]`
                  : `This showroom preview is temporarily reserved for [${data.displayName}]`}
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium">
                {isAr
                  ? 'فعّل باقتك المجانية الآن لاستلام لوحة التحكم واستقبال اتصالات ورسائل المشترين فوراً!'
                  : 'Activate your free package to take control and start receiving buyer inquiries!'}
              </p>
            </div>
          </div>

          <Link
            href={data.claimUrl}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs sm:text-sm font-black shadow-xl shadow-amber-500/25 transition-all hover:scale-105 text-center"
          >
            ⚡ {isAr ? 'تفعيل الباقة المجانية واستلام الموقع ←' : 'Claim Free Showroom Account →'}
          </Link>
        </div>
      </aside>

      {/* ACTIVATION GATE MODAL (Triggered when trying to use gated features) */}
      {showGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-[#0f141c] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-3xl">
              🔒
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isAr ? 'تفعيل حساب المعرض مطلوب' : 'Showroom Activation Required'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                {isAr
                  ? `لتفعيل استلام اتصالات المشترين، وتعديل روابط السوشيال ميديا، وإضافة سياراتك، قم بتأكيد ملكية معرض [${data.displayName}] عبر الواتساب في أقل من دقيقة مجاناً!`
                  : `To activate live customer calls, connect your social channels, and publish your inventory, verify ownership of [${data.displayName}] via WhatsApp in under 60 seconds!`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-start space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>✓</span>
                <span>{isAr ? 'مجاني بالكامل بدون أي رسوم خفية' : '100% Free with zero hidden charges'}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>✓</span>
                <span>{isAr ? 'موقع تسويقي دائم باسم معرضكم' : 'Permanent showroom landing page & link'}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>✓</span>
                <span>{isAr ? 'استوديو ميديا مانجر لصناعة إعلانات سياراتكم' : 'Full access to the Media Manager Studio'}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href={data.claimUrl}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:brightness-110 transition"
              >
                <span>⚡</span>
                <span>{isAr ? 'تأكيد الحساب وتفعيل المعرض فوراً' : 'Verify & Activate Showroom Now'}</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowGateModal(false)}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition font-medium"
              >
                {isAr ? 'العودة للمعاينة' : 'Return to Preview'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
