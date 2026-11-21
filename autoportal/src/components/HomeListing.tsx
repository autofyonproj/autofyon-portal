'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { localePath, localeDir, type SiteLocale } from '@/lib/site-locale';
import type { FeaturedItem } from '@/lib/minisite';
import type { PortalPageContent } from '@/lib/portal-site';
import {
  IconDiamond, IconStar, IconDownload, IconBuilding, IconTag,
  IconCar, IconLock, IconCheck, IconSearch, IconGlobe, IconUsers,
  IconRefresh, IconChart, ArrowStep
} from '@/components/icons';

export default function HomeListing({
  locale,
  items,
  content,
  preview = false,
}: {
  locale: SiteLocale;
  items: FeaturedItem[];
  content: PortalPageContent;
  preview?: boolean;
}) {
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'all' | 'showrooms' | 'brands'>('all');

  const brands = items.filter((item) => item.type_id === 'vehicle_brand');
  const showrooms = items.filter((item) => item.type_id !== 'vehicle_brand');
  const copy = content[locale];

  return (
    <main dir={localeDir(locale)} lang={locale} style={{ backgroundColor: content.backgroundColor, '--portal-accent': content.accentColor } as React.CSSProperties} className="min-h-screen bg-[#07090c] text-[#f0f4f8] selection:bg-[#c4a265] selection:text-black font-['Cairo',sans-serif]">
      {preview ? <div className="sticky top-0 z-50 bg-amber-300 px-4 py-2 text-center text-sm font-bold text-black">Admin draft preview — this version is not live</div> : null}
      {/* ════════════════════════════════════════════════════════════
          1. LUXURY HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-white/5 bg-[radial-gradient(circle_at_50%_0%,#1a2430_0%,#07090c_75%)]">
        {/* Subtle Gold Glow Ornaments */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#c4a265]/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-[#c4a265]/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c4a265]/10 border border-[#c4a265]/30 text-[#dfbe7e] text-xs font-bold tracking-wider mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#dfbe7e] animate-pulse" />
            {copy.badge}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-snug">
            {copy.title}
          </h1>

          <p className="mt-6 text-base md:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            {copy.description}
          </p>

          {/* Unified Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form action={localePath(locale, ['cars'])} method="get" className="flex items-center bg-white/[0.04] border border-[#c4a265]/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl focus-within:border-[#dfbe7e] focus-within:ring-2 focus-within:ring-[#dfbe7e]/20 transition-all">
              <span className="ps-3 text-[#dfbe7e]/70 flex items-center justify-center">
                <IconSearch size={18} />
              </span>
              <input
                type="search"
                name="q"
                placeholder={isAr ? 'ابحث عن ماركة، موديل، أو اسم المعرض...' : 'Search brand, model, or showroom...'}
                className="w-full bg-transparent px-3 py-3 text-white placeholder-white/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>{isAr ? 'بحث فوري' : 'Search'}</span>
                <ArrowStep direction="forward" size={14} />
              </button>
            </form>
          </div>

          {/* Quick Direct Links */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-xs">
            <Link
              href={localePath(locale, ['packages'])}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dfbe7e]/20 to-[#c4a265]/30 border border-[#dfbe7e]/50 text-[#fcedc7] hover:brightness-125 transition-all font-black shadow-md shadow-[#c4a265]/20 flex items-center gap-2"
            >
              <IconDiamond size={15} className="text-[#dfbe7e]" />
              <span>{isAr ? 'الباقات والحلول (4 باقات)' : 'Packages & Solutions'}</span>
            </Link>
            <Link
              href={localePath(locale, ['packages'])}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all font-bold flex items-center gap-2 shadow-sm"
            >
              <IconStar size={15} className="text-emerald-400" />
              <span>{isAr ? 'تجربة حية 30 يوماً' : '30-Day Free Trial'}</span>
            </Link>
            <Link
              href="/download"
              className="px-4 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-300 hover:bg-blue-500/25 transition-all font-bold flex items-center gap-2"
            >
              <IconDownload size={15} className="text-blue-400" />
              <span>{isAr ? 'مركز التحميل والتثبيت' : 'Download Portal'}</span>
            </Link>
            <Link
              href="/dealers"
              className="px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 transition-all font-black shadow-md shadow-red-600/20 flex items-center gap-2"
            >
              <IconBuilding size={15} className="text-red-400" />
              <span>{isAr ? 'دليل المعارض والوكلاء (2,800+)' : 'Dealers & Agencies (2,800+)'}</span>
            </Link>
            <Link
              href={localePath(locale, ['brands'])}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 hover:border-[#c4a265]/50 text-white hover:text-amber-300 transition-all font-bold flex items-center gap-2"
            >
              <IconTag size={15} className="text-amber-400" />
              <span>{isAr ? 'دليل الماركات واللوجو (30+)' : 'Car Makes & Logos'}</span>
            </Link>
            <Link
              href={localePath(locale, ['almostashar'])}
              className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#c4a265]/50 text-white/80 hover:text-white transition-all flex items-center gap-2"
            >
              <IconCar size={15} className="text-[#dfbe7e]" />
              <span>{isAr ? 'معرض المستشار أوتو' : 'Almostashar Auto'}</span>
            </Link>
            <Link
              href="/admin/platform"
              className="px-4 py-2 rounded-xl bg-[#c4a265]/10 border border-[#c4a265]/30 text-[#dfbe7e] hover:bg-[#c4a265]/20 transition-all font-semibold flex items-center gap-2"
            >
              <IconLock size={15} className="text-[#dfbe7e]" />
              <span>{isAr ? 'لوحة تحكم المنصة المركزية' : 'Platform Central Admin'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. THE 4 CORE VENDOR PRODUCTS SECTION
      ════════════════════════════════════════════════════════════ */}
      {content.enabledSections.includes('products') ? <section className="py-20 border-b border-white/5 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-widest text-[#dfbe7e] font-bold mb-2">
              {isAr ? 'منظومة المعارض الذكية' : 'INTEGRATED SHOWROOM SUITE'}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              {copy.productsTitle}
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#94a3b8] max-w-2xl mx-auto">
              {copy.productsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Solution 1: Dynamic Website & Dashboard */}
            <div className="bg-white/[0.02] border border-white/10 hover:border-[#c4a265] rounded-2xl p-6 transition-all group hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfbe7e]/20 to-[#c4a265]/5 border border-[#c4a265]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconGlobe size={24} className="text-[#dfbe7e]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#dfbe7e] transition-colors">
                {isAr ? 'موقع المعرض ولوحة التحكم' : 'Showroom Minisite & Dashboard'}
              </h3>
              <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                {isAr
                  ? 'موقع فاخر مستقل مخصص لمعرضك بدومين خاص أو سلاج مباشر، مع سلايدر سينمائي لكل سيارة، وحاسبة تقسيط، ولوحة تحكم ديناميكية.'
                  : 'Autonomous branded luxury website with custom domain support, dynamic inventory dashboard, and per-car cinematic carousel.'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-semibold text-[#dfbe7e]">
                {isAr ? '✓ دومين خاص + حاسبة التقسيط' : 'Custom domain + installment engine'}
              </div>
            </div>

            {/* Solution 2: Al Mostashar CRM */}
            <div className="bg-white/[0.02] border border-white/10 hover:border-[#c4a265] rounded-2xl p-6 transition-all group hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfbe7e]/20 to-[#c4a265]/5 border border-[#c4a265]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconUsers size={24} className="text-[#dfbe7e]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#dfbe7e] transition-colors">
                {isAr ? 'نظام علاقات العملاء (CRM)' : 'Al Mostashar Auto CRM'}
              </h3>
              <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                {isAr
                  ? 'إدارة العملاء المهتمين بالمشاهدة والطلب، متابعة استفسارات الواتساب لكل سيارة، وتسجيل مواعيد المعاينة وتفضيلات المشترين المستعدين.'
                  : 'Customer relationship tracking, per-car inquiry tracking, test-drive schedules, and automated WhatsApp follow-ups.'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-semibold text-[#dfbe7e]">
                {isAr ? '✓ تتبع استفسارات الواتساب والطلبات' : 'WhatsApp lead capture'}
              </div>
            </div>

            {/* Solution 3: Auto Market B2B Network (Free) */}
            <div className="bg-white/[0.02] border border-[#c4a265]/40 hover:border-[#dfbe7e] rounded-2xl p-6 transition-all group hover:-translate-y-1.5 duration-300 relative overflow-hidden bg-gradient-to-b from-[#c4a265]/5 to-transparent">
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-[10px] font-bold">
                {isAr ? 'مجاني لجميع المعارض' : 'FREE FOR ALL VENDORS'}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfbe7e]/20 to-[#c4a265]/5 border border-[#c4a265]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconRefresh size={24} className="text-[#dfbe7e]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#dfbe7e] transition-colors">
                {isAr ? 'سوق المعارض وشبكة التبادل' : 'Auto Market B2B Network'}
              </h3>
              <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                {isAr
                  ? 'شبكة حرة لربط كافة معارض وتجار السيارات في مصر مجاناً. يمكنك إرسال واستقبال طلبات وتوافر السيارات بين المعارض لخدمة زبونك دون تفويت أي بيعة.'
                  : 'Open B2B inter-dealer exchange network. Connect with every Egyptian showroom for free to trade inventory and fulfill buyer demands.'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-semibold text-[#10b981]">
                {isAr ? '✓ ربط حر وتبادل سيارات بين المعارض' : 'Free inventory sharing'}
              </div>
            </div>

            {/* Solution 4: Accounting & Contracts ERP */}
            <div className="bg-white/[0.02] border border-white/10 hover:border-[#c4a265] rounded-2xl p-6 transition-all group hover:-translate-y-1.5 duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfbe7e]/20 to-[#c4a265]/5 border border-[#c4a265]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconChart size={24} className="text-[#dfbe7e]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#dfbe7e] transition-colors">
                {isAr ? 'برنامج المحاسبة وإدارة المخزون (ERP)' : 'Al Mostashar Accounting ERP'}
              </h3>
              <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                {isAr
                  ? 'برنامج محاسبي متكامل لحسابات المعارض، رأس المال، الأرباح، الشاسيهات، طباعة عقود البيع، سندات القبض، وجدولة الأقساط الشهرية.'
                  : 'Financial ledger, inventory tracking, purchase & cost sheets, chassis management, installment schedules, and contract generation.'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] font-semibold text-[#dfbe7e]">
                {isAr ? '✓ جدار حماية 100% للخصوصية والتكاليف' : 'Zero-leak privacy firewall'}
              </div>
            </div>
          </div>

          {/* Quick link bar to packages and download */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#c4a265]/10 via-[#dfbe7e]/5 to-transparent border border-[#c4a265]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <span className="text-xs font-bold text-[#dfbe7e] uppercase tracking-wider block mb-1">
                {isAr ? '🚀 منظومة العمل المتكاملة' : 'ALL-IN-ONE AUTOMOTIVE OS'}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white">
                {isAr ? 'جميع هذه الموديولات متوفرة ومجهزة للعمل الفوري السحابي والمكتبي' : 'Cloud and desktop ready modules for all automotive dealers'}
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1">
                {isAr ? 'اكتشف كيف توفر الباقات مئات الساعات وتضاعف مبيعات معرضك مع إمكانية تجربة كافة الموديولات 30 يوماً.' : 'Explore tier packages, operational playbooks, and start a 30-day unrestricted trial.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={localePath(locale, ['packages'])}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black font-extrabold text-xs md:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#c4a265]/20 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <IconDiamond size={15} />
                <span>{isAr ? 'استعراض الباقات والأسعار' : 'Explore Packages'}</span>
                <ArrowStep direction="forward" size={13} />
              </Link>
              <Link
                href="/download"
                className="px-5 py-3 rounded-xl bg-white/[0.05] border border-white/15 hover:border-[#dfbe7e] text-white font-bold text-xs md:text-sm hover:bg-white/[0.08] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <IconDownload size={15} className="text-blue-400" />
                <span>{isAr ? 'مركز التحميل والتثبيت' : 'Download Portal'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section> : null}

      {/* ════════════════════════════════════════════════════════════
          2.5. FOUR SUBSCRIPTION PACKAGES & 30-DAY TRIAL SHOWCASE
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 border-b border-white/5 bg-gradient-to-b from-[#0a0e14] via-[#0d121a] to-[#07090c] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dfbe7e]/10 border border-[#dfbe7e]/30 text-[#dfbe7e] text-xs font-bold mb-3">
              <IconDiamond size={14} />
              <span>{isAr ? 'باقات وحلول المعارض والتوكيلات' : 'SUBSCRIPTION TIERS & LICENSES'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              {isAr ? 'اختر الباقة المثالية لحجم ونمو معرضك' : 'Choose The Right Tier For Your Showroom'}
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#94a3b8] max-w-3xl mx-auto">
              {isAr
                ? 'حلول شاملة تبدأ من العضوية المجانية المعتمدة، وصولاً إلى منظومات التوكيلات والمؤسسات الكبرى متعددة الفروع، مع إمكانية التحميل والربط الفوري.'
                : 'Complete solutions scaling from free starter up to enterprise multi-branch dealer networks.'}
            </p>
          </div>

          {/* 4 Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Tier 1: Free Starter */}
            <div className="bg-white/[0.02] border border-white/10 hover:border-[#dfbe7e]/50 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isAr ? 'العضوية المجانية' : 'Free Starter'}
                  </span>
                  <span className="text-xs text-white/50">{isAr ? 'دائم مجاني' : 'Lifetime'}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">0</span>
                  <span className="text-xs text-white/60 mr-1.5">{isAr ? 'ج.م / شهرياً' : 'EGP/mo'}</span>
                </div>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  {isAr ? 'موقع معرض معتمد وموثق لجميع المعارض المرخصة في مصر دون أي تكاليف.' : 'Verified starter presence for all Egyptian licensed dealers.'}
                </p>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/5 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{isAr ? 'حتى 10 سيارات بالمخزون' : 'Up to 10 cars'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{isAr ? 'موقع ميني سايت وسلايدر 3 صور' : 'Minisite + 3 hero slides'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{isAr ? 'ربط مباشر بواتساب المبيعات' : 'Direct WhatsApp leads'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{isAr ? 'شبكة سوق المعارض B2B' : 'Inter-dealer B2B network'}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 text-center block text-xs font-bold transition-all"
                >
                  {isAr ? 'طلب اعتماد المعرض المجاني' : 'Request Free Access'}
                </Link>
              </div>
            </div>

            {/* Tier 2: Growth */}
            <div className="bg-white/[0.02] border border-[#dfbe7e]/40 hover:border-[#dfbe7e] rounded-2xl p-6 flex flex-col justify-between transition-all group hover:-translate-y-1 relative bg-gradient-to-b from-[#dfbe7e]/5 to-transparent shadow-lg shadow-[#dfbe7e]/5">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black text-[10px] font-black uppercase tracking-wider">
                {isAr ? 'الأكثر طلباً' : 'POPULAR'}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#dfbe7e]/15 text-[#dfbe7e] border border-[#dfbe7e]/30">
                    {isAr ? 'باقة النمو (Growth)' : 'Growth'}
                  </span>
                  <span className="text-xs text-white/50">{isAr ? 'تفعيل فوري' : 'Instant'}</span>
                </div>
                <div className="mb-4">
                  <span className="text-xl font-bold text-white/90">{isAr ? 'باقة اقتصادية مرنة' : 'Flexible Value'}</span>
                </div>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  {isAr ? 'المثالية للمعارض السريعة الراغبة في مضاعفة المبيعات وإدارة حركة العملاء.' : 'Built for ambitious dealers scaling inventory and closing leads fast.'}
                </p>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/5 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#dfbe7e]">✓</span>
                    <span>{isAr ? 'حتى 25 سيارة بالمخزون' : 'Up to 25 cars'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#dfbe7e]">✓</span>
                    <span>{isAr ? 'نظام CRM المستشار المكتبي والسحابي' : 'Al Mostashar CRM (offline/cloud)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#dfbe7e]">✓</span>
                    <span>{isAr ? '20 منشور وتصميم سوشيال ميديا شهرياً' : '20 social draft packs/mo'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#dfbe7e]">✓</span>
                    <span>{isAr ? 'تفعيل وكود تحميل فوري دون انتظار' : 'Instant passcode & download'}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black text-center block text-xs font-black hover:brightness-110 transition-all shadow-md"
                >
                  {isAr ? 'تفعيل باقة النمو فوراً' : 'Activate Growth Tier'}
                </Link>
              </div>
            </div>

            {/* Tier 3: Pro */}
            <div className="bg-white/[0.02] border border-white/10 hover:border-[#dfbe7e]/50 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {isAr ? 'المعارض المتقدمة (Pro)' : 'Pro Dealership'}
                  </span>
                  <span className="text-xs text-white/50">{isAr ? 'شهري' : 'Monthly'}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">2,500</span>
                  <span className="text-xs text-white/60 mr-1.5">{isAr ? 'ج.م / شهرياً' : 'EGP/mo'}</span>
                </div>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  {isAr ? 'للمعارض ذات الأسطول الكبير التي تحتاج نطاقاً مخصصاً وهوية رقمية مستقلة.' : 'Full power for high-volume showrooms needing custom domains and video.'}
                </p>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/5 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>{isAr ? 'حتى 50 سيارة وسلايدر فيديو' : 'Up to 50 cars & video slides'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>{isAr ? 'ربط دومين ونطاق مخصص للمعرض' : 'Custom domain supported'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>{isAr ? 'مضاعفة الظهور 2.5x في نتائج البحث' : '2.5x search boost multiplier'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>{isAr ? 'أتمتة المبيعات وتوزيع المشترين' : 'Automated lead distribution'}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 text-center block text-xs font-bold transition-all"
                >
                  {isAr ? 'اختيار باقة Pro المتقدمة' : 'Choose Pro Tier'}
                </Link>
              </div>
            </div>

            {/* Tier 4: Enterprise */}
            <div className="bg-white/[0.02] border border-amber-500/20 hover:border-amber-400 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {isAr ? 'التوكيلات والمؤسسات' : 'Official Agency'}
                  </span>
                  <span className="text-xs text-white/50">{isAr ? 'شامل VIP' : 'Enterprise'}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">7,500</span>
                  <span className="text-xs text-white/60 mr-1.5">{isAr ? 'ج.م / شهرياً' : 'EGP/mo'}</span>
                </div>
                <p className="text-xs text-white/70 mb-5 leading-relaxed">
                  {isAr ? 'للتوكيلات الرسمية وكبرى صالات العرض متعددة الفروع ومستوردي السيارات.' : 'Official agents, multi-branch dealerships, and enterprise auto groups.'}
                </p>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/5 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-300">✓</span>
                    <span>{isAr ? 'حتى 500 سيارة متعدد الفروع' : '500 cars & multi-branch'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-300">✓</span>
                    <span>{isAr ? 'ERP كامل: حسابات، شاسيهات، عقود' : 'Full ERP ledger & contracts'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-300">✓</span>
                    <span>{isAr ? 'سوشيال ميديا ونشر غير محدود' : 'Unlimited social studio'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-300">✓</span>
                    <span>{isAr ? 'أقصى ظهور 5.0x + دعم VIP مخصص' : '5.0x boost + VIP manager'}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 text-center block text-xs font-bold transition-all"
                >
                  {isAr ? 'اختيار باقة التوكيلات' : 'Choose Enterprise'}
                </Link>
              </div>
            </div>
          </div>

          {/* 30-Day Unrestricted Sandbox Trial Banner */}
          <div className="rounded-3xl p-8 md:p-10 border border-[#dfbe7e]/40 bg-gradient-to-r from-[#dfbe7e]/15 via-[#0e141e] to-[#07090c] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#dfbe7e]/10 blur-[90px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-right max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black mb-3">
                  <span>⭐</span>
                  <span>{isAr ? 'تجربة حية حقيقية لمدة 30 يوماً — بدون أي التزام مالي' : '30-Day Real Live Trial — Zero Commitments'}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
                  {isAr ? 'جرب جميع موديولات التوكيلات الكبرى في معرضك مجاناً لمدة شهر كامل' : 'Test All Enterprise Modules For 30 Days Free'}
                </h3>
                <p className="text-xs md:text-sm text-[#94a3b8] mt-2 leading-relaxed">
                  {isAr
                    ? 'أنشئ معرضاً حقيقياً بكامل المزايا: موقع متكامل، 3 سيارات ديمو جاهزة، نظام علاقات العملاء CRM، برنامج المحاسبة والشاسيهات، وتصاميم السوشيال ميديا، مع إمكانية التحميل المكتبي الفوري.'
                    : 'Spin up a live showroom with pre-seeded cars, CRM, ERP, and social studio. Zero risk, auto-cleaned after 30 days.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#c4a265]/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>🚀</span>
                  <span>{isAr ? 'ابدأ نسختك التجريبية 30 يوماً الآن' : 'Start 30-Day Live Trial'}</span>
                </Link>
                <Link
                  href={localePath(locale, ['packages'])}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.05] border border-white/20 hover:border-[#dfbe7e] text-white font-bold text-sm hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>📋</span>
                  <span>{isAr ? 'مقارنة الباقات والكتالوج' : 'Full Tier Playbook'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. FEATURED SHOWROOMS & BRANDS
      ════════════════════════════════════════════════════════════ */}
      {content.enabledSections.includes('featured') ? <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#dfbe7e] tracking-wider uppercase mb-1 block">
              {isAr ? 'شبكة الشركاء المعتمدين' : 'CERTIFIED DEALER NETWORK'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {copy.featuredTitle}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-[#c4a265] text-black font-bold' : 'text-white/70 hover:text-white'}`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('showrooms')}
              className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'showrooms' ? 'bg-[#c4a265] text-black font-bold' : 'text-white/70 hover:text-white'}`}
            >
              {isAr ? 'المعارض' : 'Showrooms'}
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'brands' ? 'bg-[#c4a265] text-black font-bold' : 'text-white/70 hover:text-white'}`}
            >
              {isAr ? 'العلامات التجارية' : 'Brands'}
            </button>
          </div>
        </div>

        {/* Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'all' || activeTab === 'showrooms' ? showrooms : []).map((item) => (
            <Link
              key={item.id}
              href={localePath(locale, [item.slug])}
              className="bg-white/[0.02] border border-white/10 hover:border-[#c4a265] rounded-2xl p-6 transition-all group hover:-translate-y-1 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#c4a265]/10 border border-[#c4a265]/20 flex items-center justify-center font-bold text-[#dfbe7e]">
                  {item.name ? item.name[0] : 'S'}
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white/60 group-hover:text-[#dfbe7e] transition-colors border border-white/5">
                  {isAr ? 'معرض معتمد' : 'Verified Showroom'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#dfbe7e] transition-colors mb-2">
                {isAr ? (item.name_ar || item.name) : item.name}
              </h3>
              <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                {isAr
                  ? 'معرض سيارات معتمد يقدم خيارات جديدة ومستعملة مع تسهيلات بنكية وتقسيط مباشر.'
                  : 'Certified automotive showroom offering certified pre-owned & new vehicles.'}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#dfbe7e]">
                <span>{isAr ? 'استعراض سيارات المعرض' : 'View Showroom'}</span>
                <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
              </div>
            </Link>
          ))}

          {(activeTab === 'all' || activeTab === 'brands' ? brands : []).map((item) => (
            <Link
              key={item.id}
              href={localePath(locale, [item.slug])}
              className="bg-white/[0.02] border border-white/10 hover:border-[#c4a265] rounded-2xl p-6 transition-all group hover:-translate-y-1 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-bold text-white">
                  {item.name ? item.name[0] : 'B'}
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white/60">
                  {isAr ? 'ماركة سيارات' : 'Automotive Brand'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#dfbe7e] transition-colors mb-2">
                {isAr ? (item.name_ar || item.name) : item.name}
              </h3>
              <p className="text-xs text-[#94a3b8] line-clamp-2">
                {isAr ? 'تصفح كافة موديلات وفئات وتفاصيل أسعار هذه العلامة التجارية.' : 'Explore models and trims.'}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#dfbe7e]">
                <span>{isAr ? 'تصفح الموديلات' : 'Explore Models'}</span>
                <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
              </div>
            </Link>
          ))}
        </div>
      </section> : null}

      {/* ════════════════════════════════════════════════════════════
          4. CENTRAL VENDOR PARTNERSHIP CALL-TO-ACTION BANNER
             (Where "انضم كمعرض شريك الآن" and "المشترين المستعدين" belong)
      ════════════════════════════════════════════════════════════ */}
      {content.enabledSections.includes('cta') ? <section className="py-20 border-t border-b border-white/5 bg-gradient-to-b from-[#0e141d] to-[#07090c] relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#c4a265]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c4a265]/10 border border-[#c4a265]/30 text-[#dfbe7e] text-xs font-bold mb-4">
            💼 {isAr ? 'لأصحاب المعارض وتجار السيارات' : 'FOR SHOWROOM OWNERS & DEALERS'}
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {copy.ctaTitle}
          </h2>

          <p className="text-base text-[#94a3b8] leading-relaxed max-w-2xl mx-auto mb-8">
            {copy.ctaDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/201222597304?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%85%D8%AA%D9%84%D9%83%20%D9%85%D8%B9%D8%B1%D8%B6%D8%A7%D9%8B%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%83%D9%85%D8%B9%D8%B1%D8%B6%20%D8%B4%D8%B1%D9%8A%D9%83%20%D8%B9%D9%84%D9%89%20AutoFyon"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#dfbe7e] to-[#c4a265] text-black font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#c4a265]/20 flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>{copy.ctaButton}</span>
            </a>

            <Link
              href={localePath(locale, ['packages'])}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] border border-white/20 hover:border-[#c4a265] text-white font-bold text-sm hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            >
              <span>💎</span>
              <span>{isAr ? 'استعراض الباقات والاشتراكات كاملة' : 'Full Plans & Pricing'}</span>
            </Link>
          </div>
        </div>
      </section> : null}

      {/* ════════════════════════════════════════════════════════════
          5. FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-white/5 bg-[#05070a] text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dfbe7e] to-[#c4a265] flex items-center justify-center font-bold text-black text-sm">
              A
            </div>
            <div>
              <span className="font-bold text-white text-sm">AutoFyon Platform</span>
              <p className="text-[11px] text-white/40">{isAr ? 'البوابة المركزية الأولى لسوق ومعارض السيارات في مصر' : 'The Automotive Operating System'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href={localePath(locale, ['cars'])} className="hover:text-white transition-colors">{isAr ? 'السيارات' : 'Cars'}</Link>
            <Link href={localePath(locale, ['brands'])} className="hover:text-white transition-colors">{isAr ? 'الماركات' : 'Brands'}</Link>
            <Link href={localePath(locale, ['dealers'])} className="hover:text-white transition-colors">{isAr ? 'دليل المعارض' : 'Dealers'}</Link>
            <Link href={localePath(locale, ['packages'])} className="hover:text-[#dfbe7e] text-[#dfbe7e] font-semibold transition-colors">{isAr ? 'الباقات والحلول' : 'Packages'}</Link>
            <Link href="/download" className="hover:text-white transition-colors">{isAr ? 'مركز التحميل' : 'Download'}</Link>
            <Link href={localePath(locale, ['almostashar'])} className="hover:text-white transition-colors">{isAr ? 'المستشار أوتو' : 'Almostashar'}</Link>
            <Link href="/admin/platform" className="hover:text-[#dfbe7e] transition-colors font-semibold">{isAr ? 'دخول الإدارة' : 'Admin Login'}</Link>
          </div>

          <div className="text-center md:text-left">
            <span>© 2026 AutoFyon.com • جميع الحقوق محفوظة</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
