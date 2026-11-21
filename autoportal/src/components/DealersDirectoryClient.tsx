'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  GOVERNORATES,
  DICTIONARY,
  translateGov,
  translateCategory,
} from '@/data/dealers_i18n';

export interface DealerItem {
  id: string;
  name: string;
  name_en?: string;
  category_key: string;
  original_category: string;
  brand: string;
  address: string;
  district: string;
  city: string;
  primary_phone: string;
  whatsapp: string;
  contact_name: string;
  email: string;
  slug: string;
  landing_slug?: string;
  is_verified?: boolean;
}

interface Props {
  dealers: DealerItem[];
  locale?: 'ar' | 'en';
}

export default function DealersDirectoryClient({ dealers, locale = 'ar' }: Props) {
  const dict = DICTIONARY[locale];
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGov, setSelectedGov] = useState(isAr ? 'كل المحافظات' : 'All Governorates');
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredDealers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dealers.filter((d) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'authorized_agent') {
          if (d.category_key !== 'authorized_agent' && d.category_key !== 'distributor') return false;
        } else if (d.category_key !== selectedCategory) {
          return false;
        }
      }

      // Governorate match
      if (selectedGov !== 'كل المحافظات' && selectedGov !== 'All Governorates') {
        const govEn = translateGov(d.city, 'en');
        if (d.city !== selectedGov && govEn !== selectedGov) {
          return false;
        }
      }

      // Search match
      if (q) {
        const text = `${d.name} ${d.name_en || ''} ${d.district} ${d.address} ${d.brand}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [dealers, search, selectedCategory, selectedGov]);

  const visibleItems = filteredDealers.slice(0, visibleCount);

  const getBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'showroom':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'authorized_agent':
      case 'distributor':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'service_center':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'parts_supplier':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rental_company':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'finance_company':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'insurer':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-white/5 text-neutral-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls Toolbar */}
      <div className="rounded-2xl border border-white/10 bg-[#0d1117]/80 backdrop-blur-xl p-4 sm:p-5 shadow-2xl space-y-4">
        {/* Top line: Search Bar + Language Switcher */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <span className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 text-sm ${isAr ? 'right-3.5' : 'left-3.5'}`}>
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict.searchPlaceholder}
              className={`w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all ${
                isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className={`absolute top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs ${
                  isAr ? 'left-3' : 'right-3'
                }`}
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Governorate Dropdown */}
            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition-all shrink-0 cursor-pointer"
            >
              {GOVERNORATES.map((gov) => (
                <option key={gov.ar} value={isAr ? gov.ar : gov.en} className="bg-[#0f141c] text-white">
                  📍 {isAr ? gov.ar : gov.en}
                </option>
              ))}
            </select>

            {/* Language Switch Button */}
            <Link
              href={dict.switchLangHref}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition-all shadow-sm shrink-0"
              title="Change Language / تغيير اللغة"
            >
              <span>🌐</span>
              <span>{dict.switchLang}</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key;
            const label = isAr ? cat.label_ar : cat.label_en;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  active
                    ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                    : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-400 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span>{dict.showingCount}:</span>
          <strong className="text-white font-black text-sm">{filteredDealers.length}</strong>
          <span>{dict.of} {dict.entities}</span>
          {selectedCategory !== 'all' && (
            <span className="text-red-400 font-semibold">• {translateCategory(selectedCategory, locale).label}</span>
          )}
          {selectedGov !== 'كل المحافظات' && selectedGov !== 'All Governorates' && (
            <span className="text-amber-400 font-semibold">• {selectedGov}</span>
          )}
        </div>

        {(search || selectedCategory !== 'all' || (selectedGov !== 'كل المحافظات' && selectedGov !== 'All Governorates')) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedGov(isAr ? 'كل المحافظات' : 'All Governorates');
            }}
            className="text-neutral-400 hover:text-red-400 underline transition text-xs"
          >
            {dict.resetFilters} ↺
          </button>
        )}
      </div>

      {/* Dealers Cards Grid */}
      {filteredDealers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-lg font-bold text-white">{dict.noResults}</h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">{dict.noResultsHint}</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedGov(isAr ? 'كل المحافظات' : 'All Governorates');
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
          >
            {dict.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => {
            const catInfo = translateCategory(item.category_key, locale);
            const waHref = item.whatsapp ? `https://wa.me/${item.whatsapp.replace(/\D/g, '')}` : null;
            const telHref = item.primary_phone ? `tel:${item.primary_phone}` : null;
            const govDisplay = translateGov(item.city, locale);
            const isVerified = Boolean(item.is_verified);

            // Registration claim URL with pre-filled parameters
            const claimUrl = `/join?claim=${encodeURIComponent(item.id)}&slug=${encodeURIComponent(
              item.slug,
            )}&name=${encodeURIComponent(item.name)}&city=${encodeURIComponent(
              item.city || '',
            )}`;

            return (
              <article
                key={item.id}
                className={`group relative rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-lg ${
                  isVerified
                    ? 'border-2 border-amber-500/50 bg-gradient-to-b from-[#141820] to-[#0d1017] shadow-amber-500/10'
                    : 'border border-white/10 bg-[#0d1017]/90 hover:border-red-500/30 hover:bg-[#12151e]'
                }`}
              >
                {/* Verified Golden Badge Top Banner */}
                {isVerified && (
                  <div className="absolute -top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md">
                      <span>⭐</span>
                      <span>{dict.verifiedBadge}</span>
                    </span>
                  </div>
                )}

                <div className={`space-y-3 ${isVerified ? 'pt-1.5' : ''}`}>
                  {/* Category & City Tags */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[11px] ${getBadgeStyle(
                        item.category_key,
                      )}`}
                    >
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.label}</span>
                    </span>

                    <span className="text-[11px] text-neutral-400 font-medium">📍 {govDisplay}</span>
                  </div>

                  {/* Dealer Name */}
                  <div>
                    <h3 className="font-black text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {isAr ? item.name : item.name_en || item.name}
                    </h3>
                    {item.brand && (
                      <p className="text-[11px] text-amber-400/90 font-semibold mt-0.5 flex items-center gap-1">
                        <span>🏷️</span>
                        <span>
                          {dict.specializedIn}: {item.brand}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  {item.address && (
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.district ? `${item.district} — ` : ''}
                      {item.address}
                    </p>
                  )}

                </div>

                {/* Free Package Claim Notice for Unregistered Prospects */}
                {!isVerified && (
                  <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-950/20 p-2.5 text-center space-y-1">
                    <p className="text-[10px] text-emerald-400 font-bold">🎁 {dict.freeOfferNotice}</p>
                    <Link
                      href={claimUrl}
                      className="inline-flex items-center justify-center gap-1 text-[11px] font-black text-emerald-300 hover:text-emerald-200 underline"
                    >
                      <span>{dict.claimButton}</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  {waHref && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition"
                      title={dict.whatsapp}
                    >
                      <span>💬</span>
                      <span>{dict.whatsapp}</span>
                    </a>
                  )}

                  {telHref && (
                    <a
                      href={telHref}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-200 hover:text-white transition"
                      title={dict.call}
                    >
                      <span>📞</span>
                      <span dir="ltr">{item.primary_phone}</span>
                    </a>
                  )}

                  {/* Showroom starter landing page link if available */}
                  <Link
                    href={`/p/${item.landing_slug || item.slug}`}
                    className={`inline-flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      isVerified
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                        : 'bg-red-600/10 hover:bg-red-600/20 border-red-500/20 text-red-300'
                    }`}
                    title={dict.viewPage}
                  >
                    <span>{dict.viewPage}</span>
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredDealers.length && (
        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="px-8 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs sm:text-sm font-bold text-white transition-all shadow-lg hover:scale-[1.02]"
          >
            {dict.loadMore} ({filteredDealers.length - visibleCount} {dict.remaining}) ↓
          </button>
        </div>
      )}
    </div>
  );
}
