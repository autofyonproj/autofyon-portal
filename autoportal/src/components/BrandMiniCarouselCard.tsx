'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface BrandModelSlide {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  photoUrl: string | null;
  minPrice: number | null;
  href: string;
}

export interface BrandCardData {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  logoUrl?: string | null;
  origin?: string | null;
  models: BrandModelSlide[];
  href: string;
}

interface Props {
  brand: BrandCardData;
  locale: string;
}

export default function BrandMiniCarouselCard({ brand, locale }: Props) {
  const isAr = locale === 'ar';
  // Slide 0: Brand Sign & Identity
  // Slide 1..N: Models of this Brand
  const totalSlides = 1 + brand.models.length;
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const currentModel = currentSlide > 0 ? brand.models[currentSlide - 1] : null;
  const brandTitle = isAr ? (brand.nameAr?.trim() || brand.name) : brand.name;
  const targetHref = currentModel ? currentModel.href : brand.href;

  return (
    <div className="brand-mini-carousel-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-white dark:bg-[#121518] hover:border-[#c4a265]/50 transition-all duration-300 shadow-sm hover:shadow-xl">
      {/* Media & Slide Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#181c22] dark:to-[#121518]">
        {currentSlide === 0 ? (
          // Slide 0: Brand Identity & Logo
          <Link href={brand.href} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none no-underline">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="font-mono text-4xl font-black tracking-widest uppercase text-gray-800 dark:text-white rotate-[-12deg]">
                {brand.slug}
              </span>
            </div>

            {/* Official Logo Badge */}
            <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-white/95 dark:bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logoUrl || `https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/${brand.slug}.png`}
                alt={brandTitle}
                className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fb = document.createElement('span');
                    fb.className = 'logo-fallback';
                    fb.textContent = brand.slug[0].toUpperCase();
                    fb.style.cssText = 'font-size:1.5rem;font-weight:900;color:#2d3140;font-style:italic;';
                    parent.appendChild(fb);
                  }
                }}
              />
            </div>

            <div className="relative z-10 mt-3 text-lg font-black text-gray-900 dark:text-gray-100">
              {brandTitle}
            </div>

            <div className="relative z-10 mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#c4a265]/15 text-[#8b7340] dark:text-[#e6cb97] border border-[#c4a265]/30">
              <span>{brand.models.length} {isAr ? 'موديلات متاحة' : 'Models'}</span>
            </div>
          </Link>
        ) : (
          // Slide 1..N: Model Image & Specs
          <Link href={currentModel ? currentModel.href : brand.href} className="relative w-full h-full block no-underline">
            {currentModel?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentModel.photoUrl}
                alt={currentModel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <span className="text-2xl font-black text-gray-400 dark:text-gray-600">
                  {currentModel?.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">{brandTitle}</span>
              </div>
            )}

            {/* Model Badge Overlay */}
            <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-white border border-white/10 text-xs font-bold">
              <span>{currentModel?.name}</span>
            </div>

            {/* Model Price Overlay */}
            {currentModel?.minPrice && (
              <div className="absolute bottom-2.5 end-2.5 z-10 bg-[#c4a265]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-gray-950 font-black text-xs shadow-md">
                {isAr ? `يبدأ من ${currentModel.minPrice.toLocaleString('ar-EG')} ج.م` : `From ${currentModel.minPrice.toLocaleString()} EGP`}
              </div>
            )}
          </Link>
        )}

        {/* Carousel Navigation Buttons (if multiple slides exist) */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute start-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute end-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <span
                  key={idx}
                  className={`block rounded-full transition-all ${
                    idx === currentSlide
                      ? 'w-3.5 h-1.5 bg-[#c4a265]'
                      : 'w-1.5 h-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {currentModel ? (
              <span className="flex items-center gap-1">
                <span className="text-gray-400">{brandTitle}</span>
                <span className="text-[#8b7340] dark:text-[#e6cb97]">{currentModel.name}</span>
              </span>
            ) : (
              <span>{brandTitle}</span>
            )}
          </div>
          <Link
            href={targetHref}
            className="text-xs font-semibold text-[#8b7340] dark:text-[#e6cb97] hover:underline"
          >
            {isAr ? 'عرض التفاصيل ←' : 'View details →'}
          </Link>
        </div>

        {/* Quick Model Pills Selector */}
        {brand.models.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                currentSlide === 0
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {isAr ? 'الشعار' : 'Brand'}
            </button>
            {brand.models.slice(0, 5).map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  currentSlide === idx + 1
                    ? 'bg-[#c4a265] text-gray-950 font-bold'
                    : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {m.name}
              </button>
            ))}
            {brand.models.length > 5 && (
              <Link href={brand.href} className="text-gray-400 hover:text-gray-600 text-[10px] px-1 whitespace-nowrap">
                +{brand.models.length - 5}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
