'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { localePath, type SiteLocale } from '@/lib/site-locale';
import PublicLanguageSwitch from '@/components/PublicLanguageSwitch';

/* ─── Brand Logo ───────────────────────────────────────────────────────────
   Authentic AutoFyon brand logo:
   Sports car silhouette + tachometer gauge + stylized 'A' + split-color
   AUTOFY[charcoal/white] ON[crimson red] .com + tagline DRIVE • EXPLORE • CONNECT.
   Seamless CSS dark/light mode switching with zero flicker.
─────────────────────────────────────────────────────────────────────────── */
function AutoFyonBrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const hClass = size === 'sm' ? 'h-7' : size === 'lg' ? 'h-12' : 'h-9 md:h-10';
  return (
    <span className={`inline-flex items-center relative ${hClass} max-w-[210px] md:max-w-[260px]`}>
      {/* Light mode */}
      <img
        src="/brand/autofyon-logo-light.png"
        alt="AutoFyon.com — Drive • Explore • Connect"
        className={`${hClass} w-auto object-contain dark:hidden select-none`}
        width={340}
        height={95}
      />
      {/* Dark mode */}
      <img
        src="/brand/autofyon-logo-dark.png"
        alt="AutoFyon.com — Drive • Explore • Connect"
        className={`${hClass} w-auto object-contain hidden dark:block select-none`}
        width={340}
        height={95}
      />
    </span>
  );
}

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function ChevronIcon({ dir = 'right' }: { dir?: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function PublicSiteChrome({
  locale,
  children,
}: {
  locale: SiteLocale;
  children: ReactNode;
}) {
  const isAr = locale === 'ar';
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Persist dark mode preference */
  useEffect(() => {
    const stored = localStorage.getItem('af-dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored !== null ? stored === '1' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('af-dark', next ? '1' : '0');
      return next;
    });
  }, []);

  /* Scroll-aware shadow intensification */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile nav on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 767) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { href: localePath(locale, ['cars']),    label: isAr ? 'السيارات'  : 'Vehicles' },
    { href: localePath(locale, ['brands']),  label: isAr ? 'الماركات'  : 'Brands'   },
    { href: localePath(locale, ['dealers']), label: isAr ? 'المعارض'   : 'Dealers'  },
    { href: localePath(locale, ['blog']),    label: isAr ? 'المقالات'  : 'Journal'  },
  ];

  return (
    <div className="public-shell">

      {/* ════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════ */}
      <header
        className="public-header"
        style={scrolled ? { boxShadow: '0 1px 0 var(--af-red, #e01f26), 0 4px 32px rgba(0,0,0,0.12)' } : undefined}
      >
        <div className="public-header-inner">

          {/* ── Brand Wordmark ─────────────────────────────────────── */}
          <Link
            className="public-brand"
            href={localePath(locale, [])}
            aria-label={isAr ? 'أوتوفاي أون — قُدْ، اكتشف، تواصل' : 'AutoFyon — Drive, Explore, Connect'}
          >
            <AutoFyonBrandLogo size="md" />
          </Link>

          {/* ── Desktop Navigation ──────────────────────────────────── */}
          <nav className="public-nav" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>

          {/* ── Header Actions ──────────────────────────────────────── */}
          <div className="public-header-actions">

            {/* Dark / Light toggle */}
            <button
              className="theme-toggle"
              onClick={toggleDark}
              aria-label={isDark
                ? (isAr ? 'الوضع الفاتح' : 'Switch to light mode')
                : (isAr ? 'الوضع الداكن' : 'Switch to dark mode')}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Language switch */}
            <PublicLanguageSwitch locale={locale} />

            {/* Primary CTA */}
            <Link className="public-join-link" href="/join">
              {isAr ? 'للمعارض' : 'For Dealers'}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="public-menu-btn"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={isAr ? 'القائمة' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ──────────────────────────────── */}
        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
            style={{
              borderTop: '1px solid var(--line)',
              background: 'var(--page)',
              padding: '0.5rem clamp(16px,4vw,48px) 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '0.85rem 0',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'color 140ms ease',
                }}
              >
                {l.label}
                <ChevronIcon dir={isAr ? 'left' : 'right'} />
              </Link>
            ))}
            <Link
              href="/join"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: '1rem',
                padding: '0.85rem',
                borderRadius: 8,
                background: 'var(--af-red, #e01f26)',
                color: 'white',
                fontWeight: 700,
                fontSize: 13,
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(224,31,38,0.3)',
              }}
            >
              {isAr ? 'سجّل معرضك مجاناً' : 'List Your Dealership Free'}
            </Link>
          </nav>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════
          PAGE CONTENT
      ════════════════════════════════════════════════════════════ */}
      <div className="public-content">{children}</div>

      {/* ════════════════════════════════════════════════════════════
          FOOTER — dark charcoal, red top border, DRIVE•EXPLORE•CONNECT
      ════════════════════════════════════════════════════════════ */}
      <footer className="public-footer">
        <div className="public-footer-inner">

          {/* Col 1 — Brand */}
          <div className="space-y-3">
            <Link href={localePath(locale, [])} className="inline-block" aria-label="AutoFyon">
              <img
                src="/brand/autofyon-logo-dark.png"
                alt="AutoFyon.com — Drive • Explore • Connect"
                className="h-10 w-auto object-contain select-none"
                width={340}
                height={95}
              />
            </Link>
            <p className="text-xs opacity-70 leading-relaxed max-w-sm">{isAr
              ? 'مساحة واحدة لاكتشاف السيارات والمعارض في مصر.'
              : 'The automotive operating system for Egypt\'s car market.'}
            </p>
          </div>

          {/* Col 2 — Links */}
          <nav aria-label={isAr ? 'روابط إضافية' : 'Footer links'}>
            <Link href={localePath(locale, ['cars'])}>{isAr ? 'السيارات' : 'Vehicles'}</Link>
            <Link href={localePath(locale, ['brands'])}>{isAr ? 'الماركات' : 'Brands'}</Link>
            <Link href={localePath(locale, ['dealers'])}>{isAr ? 'المعارض' : 'Dealers'}</Link>
            <Link href={localePath(locale, ['blog'])}>{isAr ? 'المقالات' : 'Journal'}</Link>
            <Link href="/join">{isAr ? 'انضم كمعرض' : 'List Your Showroom'}</Link>
            <Link href="/admin" prefetch={false}>{isAr ? 'دخول الإدارة' : 'Admin'}</Link>
          </nav>

          {/* Col 3 — Copyright */}
          <div>
            <span className="public-footer-note">
              © {new Date().getFullYear()} AutoFyon.com<br />
              {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}<br />
              <span style={{ color: 'rgba(224,31,38,0.6)', letterSpacing: '0.15em', fontSize: 10 }}>
                {isAr ? 'قُدْ • اكتشف • تواصل' : 'DRIVE • EXPLORE • CONNECT'}
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
