'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VENDOR_TYPE_GROUPS, getVendorTypeConfig } from '@/lib/vendor-business-types';

interface PackageData {
  id: 'free' | 'growth' | 'pro' | 'enterprise';
  title: string;
  badge: string;
  badgeColor: string;
  price: string;
  subtitle: string;
  targetAudience: string;
  painPoint: string;
  sellingPoints: string[];
  playbook: { step: string; desc: string }[];
  bonuses: string[];
  upgradeWhy: string;
  upgradeTarget: string;
  specs: {
    cars: string;
    heroSlides: string;
    crm: string;
    domain: string;
    support: string;
    searchBoost: string;
  };
}

const PACKAGES: PackageData[] = [
  {
    id: 'free',
    title: 'Free Starter Membership',
    badge: 'Verified Free Dealership',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    price: '0 EGP / Month',
    subtitle: 'Launch your digital showroom with zero upfront cost and no credit card required',
    targetAudience: 'Independent dealers, brokers, and new showrooms seeking a risk-free digital presence.',
    painPoint: 'Scattered photo sharing on WhatsApp, lost buyer leads, and lack of a verified web profile.',
    sellingPoints: [
      'Official verified digital showroom at (autofyon.com/your-name).',
      'List up to 10 active vehicles with complete technical specs and high-res photos.',
      'Direct WhatsApp inquiry button on every car with zero commission or middleman.',
      'Instant Google Search indexing for your dealership brand and inventory.',
    ],
    playbook: [
      { step: '1. Add your top 10 cars', desc: 'List your best 10 vehicles with transparent pricing and clean photos.' },
      { step: '2. Place your link in social bios', desc: 'Replace sending 50 scattered images with one professional link.' },
      { step: '3. Receive buyer chats directly', desc: 'Every click opens a WhatsApp chat pre-filled with the vehicle details.' },
    ],
    bonuses: [
      'Official AutoFyon verified dealer badge.',
      '4 ready-to-publish social marketing templates every month.',
      '100% free forever with no hidden fees.',
    ],
    upgradeWhy: 'When your inventory exceeds 10 cars or you need a local offline accounting and sales system.',
    upgradeTarget: 'Growth Package',
    specs: {
      cars: 'Up to 10 vehicles',
      heroSlides: '3 hero slides',
      crm: 'Basic cloud sales pipeline',
      domain: 'Official AutoFyon subdomain',
      support: 'Help center & ticketing',
      searchBoost: '1.0x (Standard ranking)',
    },
  },
  {
    id: 'growth',
    title: 'Growth Dealership Package',
    badge: 'Growing & Professional',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    price: 'Flexible Economical Investment',
    subtitle: 'Rock-solid stability: 100% offline sales & accounting system installed locally on your PC',
    targetAudience: 'Active showrooms managing 15 to 30 cars demanding exact accounting, installments, and profit tracking.',
    painPoint: 'Fear of internet outages freezing sales, and manual calculation errors in profits and installments.',
    sellingPoints: [
      'Standalone Almostashar Auto ERP installed on your dealership laptop or desktop.',
      '100% offline operation: invoices, sales contracts, installments, and secure local records.',
      'Smart cloud synchronization: pulls buyer inquiries automatically when connected.',
      'Inventory capacity up to 30 cars with complete installment and trade-in workflows.',
    ],
    playbook: [
      { step: '1. Install on your office PC', desc: 'Runs instantly without complex server configurations.' },
      { step: '2. Issue instant sales contracts', desc: 'Print professional bilingual contracts and receipt vouchers with one click.' },
      { step: '3. Track monthly installments', desc: 'Automatic alert table for overdue installments and profit margins.' },
    ],
    bonuses: [
      'Free 30-day comprehensive trial before any financial commitment.',
      'Ready vehicle exchange agreements reviewed by automotive attorneys.',
      '2 licensed devices per showroom (Laptop + Manager PC).',
    ],
    upgradeWhy: 'When you need multi-device staff access, customer financing requests, and advanced CRM pipelines.',
    upgradeTarget: 'Pro Dealership Package',
    specs: {
      cars: 'Up to 30 vehicles',
      heroSlides: '5 hero slides',
      crm: 'Offline CRM + cloud sync',
      domain: 'AutoFyon verified portal',
      support: 'Direct WhatsApp support',
      searchBoost: '1.5x priority ranking',
    },
  },
  {
    id: 'pro',
    title: 'Pro Dealership Package',
    badge: 'Top-Tier Showroom Network',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    price: 'High-ROI Solution',
    subtitle: 'The comprehensive ecosystem: unlimited fleet, staff multi-screens, and financing integration',
    targetAudience: 'Established dealerships with multiple sales reps, high inventory turnover, and bank financing services.',
    painPoint: 'Sales reps conflicting on customer follow-ups and uncoordinated vehicle reservation deposits.',
    sellingPoints: [
      'Unlimited vehicle inventory with instant social media distribution.',
      'Interactive Media Studio: create video reels and vehicle flyers directly on mobile.',
      'Direct integration with auto banks and leasing companies for instant installment approvals.',
      'Multi-device local network: up to 5 screens synchronized live inside the showroom.',
    ],
    playbook: [
      { step: '1. Distribute roles to your team', desc: 'Each sales rep manages their leads and reservations independently.' },
      { step: '2. Connect bank financing', desc: 'Receive financing buyer applications directly from your online page.' },
      { step: '3. Launch sponsored campaigns', desc: 'Top 2.5x priority placement across all search results.' },
    ],
    bonuses: [
      'Free 30-day all-inclusive trial with priority onboarding.',
      'Dedicated automotive business consultant for setup and migration.',
      'Top placement banner in the Egyptian dealerships directory.',
    ],
    upgradeWhy: 'When expanding into multiple commercial branches or holding official regional brand agencies.',
    upgradeTarget: 'Enterprise Agency Membership',
    specs: {
      cars: 'Unlimited fleet',
      heroSlides: '10 custom slides',
      crm: 'Multi-agent CRM & pipeline',
      domain: 'Custom domain support',
      support: 'Dedicated account manager',
      searchBoost: '2.5x top placement',
    },
  },
  {
    id: 'enterprise',
    title: 'Enterprise Agency Membership',
    badge: 'Official Distributor & Multi-Branch',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    price: 'Tailored Enterprise Contract',
    subtitle: 'Tailor-made infrastructure for official agencies, distributors, and large dealership groups',
    targetAudience: 'Official car agencies, certified distributors, and large multi-governorate automotive networks.',
    painPoint: 'Fragmented branch operations, complex distributor hierarchies, and strict brand compliance.',
    sellingPoints: [
      'Unified centralized dashboard linking all branches, showrooms, and warehouses in Egypt.',
      'Comprehensive fleet exchange network between partner agencies with custom clearance tiers.',
      'Dedicated Cloudflare Edge infrastructure with automated daily backups.',
      'Full API integrations with banking, insurance, and automotive registry systems.',
    ],
    playbook: [
      { step: '1. Centralize all branches', desc: 'Unified view of inventory, stock transfers, and overall revenue.' },
      { step: '2. Authorize sub-dealers', desc: 'Distribute wholesale vehicle quotas to authorized dealers seamlessly.' },
      { step: '3. Execute enterprise analytics', desc: 'Real-time reporting on vehicle turnover, popular models, and branch performance.' },
    ],
    bonuses: [
      'Full custom branding tailored to international automotive standards.',
      '24/7 dedicated enterprise response SLA.',
      'Automated nightly cloud archiving and disaster recovery.',
    ],
    upgradeWhy: 'The apex of Egyptian automotive dealership and agency infrastructure.',
    upgradeTarget: 'Enterprise Custom SLA',
    specs: {
      cars: 'Unlimited multi-branch fleet',
      heroSlides: 'Unlimited custom media',
      crm: 'Enterprise ERP + CRM',
      domain: 'Independent dedicated domain',
      support: '24/7 VIP hotline',
      searchBoost: '5.0x Maximum authority',
    },
  },
];

export default function EnglishPackagesPage() {
  const [selectedId, setSelectedId] = useState<'free' | 'growth' | 'pro' | 'enterprise'>('growth');
  const selectedPkg = PACKAGES.find((p) => p.id === selectedId) || PACKAGES[1];

  const [modalOpen, setModalOpen] = useState(false);
  const [targetPackage, setTargetPackage] = useState<string>('growth');
  const [showroomName, setShowroomName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Cairo');
  const [businessTypeId, setBusinessTypeId] = useState('showroom');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ passcode?: string; phone?: string; downloadUrl?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  function openTrialModal(pkgId?: string) {
    setTargetPackage(pkgId || selectedId);
    setSuccessData(null);
    setErrorMsg('');
    setModalOpen(true);
  }

  async function handleTrialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    if (!showroomName.trim()) {
      setErrorMsg('Please enter your business or showroom name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/trials/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showroomName: showroomName.trim(),
          phone: cleanPhone,
          city,
          businessTypeId,
          packageId: targetPackage,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Failed to register trial. Please contact support.');
      } else {
        setSuccessData({
          passcode: data.passcode,
          phone: cleanPhone,
          downloadUrl: `/download?phone=${cleanPhone}&code=${data.passcode}`,
        });
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-white selection:bg-[#c4a265] selection:text-black" dir="ltr">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 px-4 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#c4a265]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c4a265]/10 border border-[#c4a265]/30 text-xs font-bold text-[#c4a265] mb-6">
            <span>Automotive Solutions & Dealership Infrastructure in Egypt</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Select the Ideal Package to Scale Your Dealership & Inventory
          </h1>

          <p className="max-w-3xl mx-auto text-sm md:text-base text-neutral-400 mb-8 leading-relaxed">
            From emerging dealers seeking a free verified digital presence to multi-branch agencies.
            Explore package capabilities, practical dealership workflows, and seamless upgrade paths.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#packages-explorer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#9e7d3b] text-black font-extrabold text-sm hover:from-[#d6b578] shadow-lg shadow-[#c4a265]/20 transition-all"
            >
              Compare the 4 Packages ↓
            </a>
            <button
              onClick={() => openTrialModal('growth')}
              className="px-6 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-extrabold text-sm transition-all flex items-center gap-2"
            >
              <span>⭐ Start 30-Day All-Inclusive Trial</span>
            </button>
            <Link
              href="/download"
              className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>Have an admin download code? Download now</span>
              <span className="text-[#c4a265]">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Package Navigation Tabs ───────────────────────────────────── */}
      <section id="packages-explorer" className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-24 md:scroll-mt-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {PACKAGES.map((pkg) => {
            const isSelected = pkg.id === selectedId;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#c4a265]/15 to-white/[0.03] border-[#c4a265] shadow-xl shadow-[#c4a265]/10 scale-[1.02]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                  {isSelected && <span className="text-xs text-[#c4a265] font-black">● Selected</span>}
                </div>
                <h3 className="font-extrabold text-sm md:text-base text-white mb-1">{pkg.title}</h3>
                <p className="font-mono text-xs text-[#c4a265] font-bold">{pkg.price}</p>
              </button>
            );
          })}
        </div>

        {/* ── Selected Package Deep Dive Card ────────────────────────── */}
        <div className="rounded-3xl border border-[#c4a265]/30 bg-gradient-to-b from-[#12151c] to-[#07090c] p-6 md:p-10 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-3 ${selectedPkg.badgeColor}`}>
                {selectedPkg.badge}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-2">{selectedPkg.title}</h2>
              <p className="text-sm md:text-base text-neutral-300 font-semibold">{selectedPkg.subtitle}</p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openTrialModal(selectedPkg.id)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#9e7d3b] text-black font-extrabold text-sm hover:brightness-110 shadow-xl shadow-[#c4a265]/20 transition-all text-center"
              >
                Request This Package & Trial Code ✓
              </button>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 py-6 border-b border-white/10">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">Active Fleet</span>
              <strong className="text-xs md:text-sm text-white font-bold">{selectedPkg.specs.cars}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">Showcase Slides</span>
              <strong className="text-xs md:text-sm text-white font-bold">{selectedPkg.specs.heroSlides}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">CRM System</span>
              <strong className="text-xs md:text-sm text-white font-bold">{selectedPkg.specs.crm}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">Domain Identity</span>
              <strong className="text-xs md:text-sm text-white font-bold">{selectedPkg.specs.domain}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">Technical Support</span>
              <strong className="text-xs md:text-sm text-white font-bold">{selectedPkg.specs.support}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-semibold">Search Ranking</span>
              <strong className="text-xs md:text-sm text-amber-400 font-bold">{selectedPkg.specs.searchBoost}</strong>
            </div>
          </div>

          {/* Selling points */}
          <div className="py-6 border-b border-white/10">
            <h4 className="text-sm font-bold text-[#c4a265] uppercase tracking-wider mb-4">Core Deliverables & Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPkg.sellingPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-xs md:text-sm text-neutral-200 leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 30-Day Free Trial Modal ────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#c4a265]/40 bg-[#0d1017] p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {!successData ? (
              <>
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#c4a265] uppercase tracking-widest block mb-1">
                    Free Instant Activation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Start Your 30-Day Free Trial
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    No credit card or payment required. Immediate activation code issued.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-bold text-red-300">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Business / Showroom Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={showroomName}
                      onChange={(e) => setShowroomName(e.target.value)}
                      placeholder="e.g. Cairo Star Motors"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#c4a265] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Business Type *
                    </label>
                    <select
                      value={businessTypeId}
                      onChange={(e) => setBusinessTypeId(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#0f141c] px-4 py-2.5 text-sm text-white focus:border-[#c4a265] focus:outline-none"
                    >
                      {VENDOR_TYPE_GROUPS.flatMap((g) => g.types).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        dir="ltr"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#c4a265] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Governorate
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-[#0f141c] px-4 py-2.5 text-sm text-white focus:border-[#c4a265] focus:outline-none"
                      >
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Sharqia">Sharqia</option>
                        <option value="Dakahlia">Dakahlia</option>
                        <option value="Gharbia">Gharbia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-gradient-to-r from-[#c4a265] to-[#9e7d3b] py-3 text-sm font-black text-neutral-950 shadow-lg hover:brightness-110 disabled:opacity-50 transition"
                  >
                    {submitting ? 'Activating Trial...' : 'Confirm & Generate Activation Code →'}
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-5 text-center py-4">
                <span className="text-4xl block">🎉</span>
                <h3 className="text-2xl font-black text-white">Your 30-Day Trial is Active!</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Your dealership has been registered. Use the passcode below to download your offline ERP suite:
                </p>
                <div className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4">
                  <span className="text-xs text-amber-400 font-bold block mb-1">Your Download Code</span>
                  <span className="font-mono text-3xl font-black tracking-widest text-amber-300">
                    {successData.passcode}
                  </span>
                </div>
                <Link
                  href={successData.downloadUrl || '/download'}
                  className="block w-full rounded-xl bg-emerald-500 py-3 text-sm font-black text-neutral-950 shadow-lg hover:bg-emerald-400 transition"
                >
                  Download Your Showroom ERP Suite Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
