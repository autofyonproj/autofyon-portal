'use client';

import { useEffect, useState } from 'react';
import type { PlatformAd, PlatformNewsItem } from '@/lib/portal-site';
import type { SiteLocale } from '@/lib/site-locale';

function portalLink(link: string): string {
  return link.startsWith('/') ? `https://autofyon.com${link}` : link;
}

export function PlatformNewsRibbon({
  items,
  locale,
}: {
  items: PlatformNewsItem[];
  locale: SiteLocale;
}) {
  if (!items.length) return null;
  const isArabic = locale === 'ar';

  return (
    <nav
      aria-label={isArabic ? 'أخبار وإعلانات AutoFyon' : 'AutoFyon news and announcements'}
      className="mx-auto flex w-full max-w-[1480px] items-center gap-3 overflow-hidden border-y border-red-800/15 bg-red-50 px-4 py-2 text-sm text-red-950"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <strong className="shrink-0 rounded bg-red-700 px-2 py-1 text-xs text-white">
        {isArabic ? 'أخبار AutoFyon' : 'AutoFyon News'}
      </strong>
      <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap">
        {items.map((item) => {
          const text = isArabic ? item.textAr || item.textEn : item.textEn || item.textAr;
          return (
            <a key={item.id} href={portalLink(item.linkUrl)} className="shrink-0 font-semibold underline decoration-red-700/30 underline-offset-4 hover:text-red-700">
              {text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function PlatformAdRail({
  ads,
  locale,
}: {
  ads: PlatformAd[];
  locale: SiteLocale;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isArabic = locale === 'ar';
  const activeAd = ads[activeIndex];

  useEffect(() => {
    if (ads.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % ads.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [ads.length]);

  if (!activeAd) return null;
  const title = isArabic ? activeAd.titleAr || activeAd.titleEn : activeAd.titleEn || activeAd.titleAr;

  return (
    <aside
      aria-label={isArabic ? 'إعلانات AutoFyon العامة' : 'AutoFyon general advertisements'}
      className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-2 border-b border-black/10 px-3 py-2">
        <h2 className="text-xs font-black text-red-800">{isArabic ? 'إعلانات AutoFyon' : 'AutoFyon Ads'}</h2>
        {ads.length > 1 ? (
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={isArabic ? 'الإعلان السابق' : 'Previous advertisement'}
              onClick={() => setActiveIndex((index) => (index - 1 + ads.length) % ads.length)}
              className="rounded border border-black/10 px-2 py-1 text-xs hover:bg-black/5"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={isArabic ? 'الإعلان التالي' : 'Next advertisement'}
              onClick={() => setActiveIndex((index) => (index + 1) % ads.length)}
              className="rounded border border-black/10 px-2 py-1 text-xs hover:bg-black/5"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
      <a href={portalLink(activeAd.linkUrl)} className="block" aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={activeAd.imageUrl} alt="" className="aspect-[16/6] w-full object-cover lg:aspect-[4/5]" loading="lazy" />
        <span className="block p-3 text-sm font-bold leading-6 text-slate-900">{title}</span>
      </a>
      {ads.length > 1 ? (
        <div className="flex justify-center gap-1.5 px-3 pb-3" aria-label={`${activeIndex + 1} / ${ads.length}`}>
          {ads.map((ad, index) => (
            <button
              key={ad.id}
              type="button"
              aria-label={isArabic ? `عرض الإعلان ${index + 1}` : `Show advertisement ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-5 bg-red-700' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}
