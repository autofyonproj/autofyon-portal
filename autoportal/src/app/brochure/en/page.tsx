'use client';

import { useEffect } from 'react';

/** Redirect to the static HTML brochure served from /public */
export default function BrochureEnRedirect() {
  useEffect(() => {
    window.location.replace('/brochure/autofyon-brochure-en.html');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07090c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: '#c4a265' }}>AutoFyon</div>
      <div style={{ color: '#8b93a4', fontSize: 14 }}>Loading official brochure…</div>
      <a
        href="/brochure/autofyon-brochure-en.html"
        style={{
          marginTop: 8,
          background: '#c4a265',
          color: '#000',
          fontWeight: 700,
          padding: '10px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 14,
        }}
      >
        Open Brochure →
      </a>
    </div>
  );
}
