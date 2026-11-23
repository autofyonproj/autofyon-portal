import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoFyon — Official Product Brochure 2026 | Dealership Platform Egypt',
  description:
    'The official AutoFyon product brochure — platform overview, free package benefits, Media Manager studio, dealership directory, pricing tiers, and how to get started.',
};

export default function BrochureEn() {
  return (
    <>
      {/* Global styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            :root {
              --gold: #f59e0b;
              --gold-light: #fcd34d;
              --gold-dark: #d97706;
              --bg-dark: #07090c;
              --bg-card: #0d1017;
              --bg-card2: #111827;
              --text: #f8fafc;
              --muted: #94a3b8;
              --emerald: #10b981;
              --red: #ef4444;
              --border: rgba(255,255,255,0.08);
            }

            html.light {
              --gold: #b48c36;
              --gold-light: #c89f48;
              --gold-dark: #8c6a21;
              --bg-dark: #f8fafc;
              --bg-card: #ffffff;
              --bg-card2: #f1f5f9;
              --text: #0f172a;
              --muted: #475569;
              --emerald: #059669;
              --red: #dc2626;
              --border: rgba(180,140,54,0.22);
            }

            html { direction: ltr; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: var(--bg-dark); color: var(--text); font-size: 15px; transition: background 0.2s, color 0.2s; }

            body { margin: 0; padding: 0; background: var(--bg-dark); }

            .brochure-wrap { max-width: 900px; margin: 0 auto; padding: 32px 24px 60px; }

            /* ── COVER ── */
            .cover {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 28px;
              background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.18) 0%, transparent 70%),
                          linear-gradient(145deg, #07090c 0%, #0d1117 100%);
              border-radius: 24px;
              padding: 60px 40px;
              margin-bottom: 48px;
              border: 1px solid rgba(245,158,11,0.3);
              position: relative;
              overflow: hidden;
            }

            .cover::before {
              content: '';
              position: absolute;
              inset: 0;
              background: repeating-linear-gradient(45deg, rgba(245,158,11,0.03) 0px, transparent 2px, transparent 20px, rgba(245,158,11,0.03) 22px);
              pointer-events: none;
            }

            .cover-logo { font-size: 52px; font-weight: 900; color: var(--gold); letter-spacing: -1px; line-height: 1; position: relative; z-index: 1; }
            .cover-logo span { color: #fff; }
            .cover-sub { font-size: 18px; color: var(--muted); font-weight: 600; position: relative; z-index: 1; }
            .cover-title {
              font-size: clamp(26px, 5vw, 42px);
              font-weight: 900;
              line-height: 1.25;
              color: #fff;
              position: relative; z-index: 1;
              max-width: 640px;
            }
            .cover-title span { color: var(--gold); }
            .cover-badge {
              display: inline-flex; align-items: center; gap: 8px;
              padding: 8px 20px; border-radius: 999px;
              background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4);
              color: var(--gold-light); font-size: 13px; font-weight: 700;
              position: relative; z-index: 1;
            }
            .cover-year { font-size: 13px; color: var(--muted); position: relative; z-index: 1; }

            /* ── SECTION ── */
            .section {
              margin-bottom: 48px;
              page-break-inside: avoid;
            }
            .section-header {
              display: flex; align-items: center; gap: 12px;
              padding: 14px 20px;
              background: linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%);
              border: 1px solid rgba(245,158,11,0.25);
              border-radius: 14px;
              margin-bottom: 20px;
            }
            .section-icon { font-size: 28px; }
            .section-num { font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 1px; display: block; }
            .section-title { font-size: 20px; font-weight: 900; color: #fff; }

            /* ── CARDS GRID ── */
            .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

            .card {
              background: var(--bg-card);
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 20px;
              page-break-inside: avoid;
            }
            .card-icon { font-size: 32px; margin-bottom: 10px; }
            .card-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 6px; }
            .card-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }
            .card-highlight { border-color: rgba(245,158,11,0.35); background: linear-gradient(135deg, rgba(245,158,11,0.07) 0%, var(--bg-card) 100%); }
            .card-emerald { border-color: rgba(16,185,129,0.35); background: linear-gradient(135deg, rgba(16,185,129,0.07) 0%, var(--bg-card) 100%); }

            /* ── STEPS ── */
            .steps { display: flex; flex-direction: column; gap: 12px; }
            .step {
              display: flex; align-items: flex-start; gap: 14px;
              background: var(--bg-card); border: 1px solid var(--border);
              border-radius: 14px; padding: 16px 18px;
            }
            .step-num {
              min-width: 36px; height: 36px; border-radius: 50%;
              background: linear-gradient(135deg, var(--gold), var(--gold-dark));
              color: #07090c; font-weight: 900; font-size: 15px;
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            }
            .step-title { font-size: 15px; font-weight: 800; color: #fff; }
            .step-desc { font-size: 13px; color: var(--muted); margin-top: 2px; line-height: 1.6; }

            /* ── COMPARISON TABLE ── */
            .pricing-table { width: 100%; border-collapse: collapse; }
            .pricing-table th, .pricing-table td {
              text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 13px;
            }
            .pricing-table th { background: rgba(245,158,11,0.1); color: var(--gold); font-weight: 800; font-size: 12px; letter-spacing: .5px; }
            .pricing-table tr:last-child td { border-bottom: none; }
            .pricing-table td:first-child { font-weight: 700; color: #fff; }
            .pricing-table .yes { color: var(--emerald); font-weight: 700; }
            .pricing-table .no { color: var(--red); }
            .pricing-table .soon { color: var(--gold); font-size: 11px; font-weight: 700; }
            .table-wrap { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }

            /* ── BACK COVER ── */
            .back-cover {
              text-align: center; padding: 48px 32px;
              background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%);
              border: 1px solid rgba(245,158,11,0.3); border-radius: 24px;
              page-break-before: always;
            }
            .back-cover-logo { font-size: 36px; font-weight: 900; color: var(--gold); margin-bottom: 8px; }
            .back-cover-cta { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 8px; }
            .back-cover-url {
              display: inline-block; margin-top: 16px; padding: 10px 24px;
              border-radius: 10px; background: var(--gold); color: #07090c;
              font-size: 15px; font-weight: 900; text-decoration: none;
            }
            .qr-box {
              margin: 20px auto 0; width: 110px; height: 110px;
              border: 3px solid var(--gold); border-radius: 12px;
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; color: var(--muted); background: var(--bg-card);
            }

            /* ── PRINT BAR ── */
            .print-bar {
              position: fixed; top: 0; left: 0; right: 0; z-index: 100;
              background: rgba(7,9,12,0.9); backdrop-filter: blur(16px);
              border-bottom: 1px solid rgba(245,158,11,0.3);
              padding: 10px 24px; display: flex; align-items: center;
              gap: 12px;
            }
            .print-btn {
              margin-left: auto;
              padding: 8px 20px; border-radius: 10px;
              background: var(--gold); color: #07090c; font-weight: 900; font-size: 13px;
              border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;
              font-family: 'Inter', sans-serif;
            }
            .print-btn:hover { background: var(--gold-light); }
            .lang-link {
              padding: 7px 16px; border-radius: 10px; border: 1px solid rgba(245,158,11,0.4);
              color: var(--gold); font-size: 13px; font-weight: 700; text-decoration: none;
              background: rgba(245,158,11,0.08);
            }

            @media print {
              .print-bar { display: none !important; }
              body { background: #fff !important; color: #000 !important; }
              .brochure-wrap { padding: 0 !important; max-width: 100% !important; }
              .cover { background: #f8fafc !important; border-color: #d97706 !important; min-height: auto; padding: 40px 32px; }
              .cover-logo { color: #d97706 !important; }
              .card, .step { border-color: #e5e7eb !important; background: #f9fafb !important; }
              .card-title, .step-title, .section-title { color: #111 !important; }
              .card-desc, .step-desc { color: #555 !important; }
              .section-header { background: #fef3c7 !important; border-color: #d97706 !important; }
              .section-title { color: #111 !important; }
              .pricing-table th { background: #fef3c7 !important; color: #d97706 !important; }
              .pricing-table td { color: #111 !important; }
              .back-cover { background: #fef3c7 !important; border-color: #d97706 !important; }
              .back-cover-cta { color: #111 !important; }
              @page { margin: 20mm; size: A4; }
            }

            /* pad top for fixed bar */
            .content-pad { padding-top: 56px; }
          `,
        }}
      />

      {/* PRINT / LANG / THEME BAR */}
      <div className="print-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '15px', fontFamily: 'Inter,sans-serif' }}>
          📄 AutoFyon Official Brochure 2026
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="print-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text)', border: '1px solid var(--border)', marginLeft: 0 }}
            suppressHydrationWarning
            data-action="theme"
          >
            ☀️ Light Mode
          </button>
          <a href="/brochure/ar" className="lang-link">النسخة العربية</a>
          <button
            type="button"
            className="print-btn"
            suppressHydrationWarning
            data-action="print"
          >
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>

      {/* Client script for print and theme */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var printBtn = document.querySelector('[data-action="print"]');
              if (printBtn) {
                printBtn.addEventListener('click', function() {
                  window.print();
                });
              }
              var themeBtn = document.querySelector('[data-action="theme"]');
              if (themeBtn) {
                themeBtn.addEventListener('click', function() {
                  var isLight = document.documentElement.classList.toggle('light');
                  this.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
                });
              }
            });
          `,
        }}
      />

      <div className="content-pad">
        <div className="brochure-wrap">

          {/* ══ COVER ══ */}
          <section className="cover">
            <div className="cover-logo">AutoFy<span>On</span></div>
            <div className="cover-sub">Egypt&apos;s Official Car Dealership Platform</div>
            <h1 className="cover-title">
              Everything you need to market your dealership <span>digitally</span> — in one place
            </h1>
            <div className="cover-badge">🎁 Free Package | Professional Features | Instant Activation</div>
            <div className="cover-year">Official Services Guide — {new Date().getFullYear()}</div>
          </section>

          {/* ══ SECTION 1: What is AutoFyon ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🚀</div>
              <div>
                <span className="section-num">SECTION ONE</span>
                <div className="section-title">What is AutoFyon?</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card card-highlight">
                <div className="card-icon">🗂️</div>
                <div className="card-title">Egypt&apos;s Official Dealership Directory</div>
                <div className="card-desc">
                  autofyon.com is the golden directory for new and used car dealerships in Egypt.
                  Serious buyers search here — you need a professional presence.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🌐</div>
                <div className="card-title">Your Own Branded Marketing Page</div>
                <div className="card-desc">
                  Every dealership gets a page at <strong>autofyon.com/p/your-showroom</strong> — works
                  as a professional website you share on WhatsApp, social media, and business cards.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🤝</div>
                <div className="card-title">Supplier & Finance Network</div>
                <div className="card-desc">
                  Direct connections between dealerships, finance companies, insurance providers,
                  spare parts suppliers, and service networks in one trusted ecosystem.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">Smart Control Dashboard</div>
                <div className="card-desc">
                  Receive calls and messages from buyers, monitor page analytics, and manage your
                  inventory from a simple dashboard that works on mobile.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 2: Free Package Benefits ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🎁</div>
              <div>
                <span className="section-num">SECTION TWO</span>
                <div className="section-title">What do you get in the Free Package?</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card card-emerald">
                <div className="card-icon">🌟</div>
                <div className="card-title">Gold Verified Badge</div>
                <div className="card-desc">
                  Your dealership appears with a gold verified badge in the directory — distinguishing
                  you from unverified listings and building buyer trust.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">📱</div>
                <div className="card-title">Ready-to-Use Marketing Page</div>
                <div className="card-desc">
                  A professionally designed page with your dealership info, brand carousel, social
                  media links, and a direct contact button.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">📞</div>
                <div className="card-title">Direct Calls & WhatsApp Messages</div>
                <div className="card-desc">
                  Buyers call or message you on WhatsApp directly from your page with no middleman
                  — every inquiry lands straight on your phone.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🎬</div>
                <div className="card-title">Free Media Manager Studio</div>
                <div className="card-desc">
                  A free PWA app on your phone to design car posters, Reels ads, and price offers
                  in seconds.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🗺️</div>
                <div className="card-title">Listed in Cairo & Regional Directory</div>
                <div className="card-desc">
                  Your dealership appears in the directory classified by governorate and specialty
                  — reachable through organic search and the AutoFyon network.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🔗</div>
                <div className="card-title">Link Your Brands & Cars</div>
                <div className="card-desc">
                  Add the brands and vehicles you sell and they appear in an attractive carousel on
                  your page with updated specs and prices.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 3: Media Manager ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🎬</div>
              <div>
                <span className="section-num">SECTION THREE</span>
                <div className="section-title">Media Manager Studio — Create Your Ads in Minutes</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🖼️</div>
                <div className="card-title">Professional Car Posters</div>
                <div className="card-desc">
                  Ready-made templates with professional designs — pick the car photo, add price and
                  specs, and download the poster instantly for WhatsApp and Facebook.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🎥</div>
                <div className="card-title">Car Reels Videos</div>
                <div className="card-desc">
                  Create animated car video ads — perfect for Instagram Reels, TikTok, and YouTube
                  Shorts.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">💰</div>
                <div className="card-title">Instant Price Quotes</div>
                <div className="card-desc">
                  Build a full price list for all your cars in one minute and share it as a PDF or
                  image directly on WhatsApp with customers.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📲</div>
                <div className="card-title">PWA App on Your Phone</div>
                <div className="card-desc">
                  No app store download needed — open the link, tap &quot;Install&quot; and it runs as a
                  native app on Android and iPhone.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📤</div>
                <div className="card-title">Direct Share from Phone</div>
                <div className="card-desc">
                  Everything you design saves to your library instantly and can be shared on WhatsApp
                  or stored in your dealership studio.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🔒</div>
                <div className="card-title">Your Private Dealership Library</div>
                <div className="card-desc">
                  All your designs are stored in a private library — photos, videos, and posters ready
                  to publish anytime.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 4: Directory & Badge ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <div>
                <span className="section-num">SECTION FOUR</span>
                <div className="section-title">Dealership Directory & Gold Verified Badge</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🔍</div>
                <div className="card-title">Appear in Search Results</div>
                <div className="card-desc">
                  The directory is SEO-optimized — buyers searching for &quot;car dealerships in Cairo&quot; or
                  &quot;used cars in Alexandria&quot; find your dealership.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">⭐</div>
                <div className="card-title">Gold Verified Badge</div>
                <div className="card-desc">
                  Your dealership appears at the top of the directory with a gold verified badge after
                  ownership confirmation — it signals to buyers that you are real and trustworthy.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">Smart Classification by Specialty & Area</div>
                <div className="card-desc">
                  Your dealership appears in its category (Toyota, Mercedes, Used, etc.) and in your
                  district (New Cairo, Maadi, 6th of October) separately.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🏆</div>
                <div className="card-title">Priority Listing</div>
                <div className="card-desc">
                  Verified dealerships always appear before unverified ones and get a larger display
                  area with more detailed information.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 5: How to Activate ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">⚡</div>
              <div>
                <span className="section-num">SECTION FIVE</span>
                <div className="section-title">How to Activate Your Dealership in Under a Minute</div>
              </div>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <div>
                  <div className="step-title">Tap &quot;Activate Free Package&quot; from your dealership page</div>
                  <div className="step-desc">
                    Every dealership has a dedicated link on autofyon.com — open the link sent to you on
                    WhatsApp and you&apos;ll find the activation button clearly displayed.
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div>
                  <div className="step-title">Confirm ownership via WhatsApp OTP — takes seconds</div>
                  <div className="step-desc">
                    AutoFyon will send you a WhatsApp message with a verification code — enter it on
                    the page and your number is instantly linked to your dealership.
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div>
                  <div className="step-title">Receive your dashboard and start accepting customers</div>
                  <div className="step-desc">
                    Once verified, you get full dashboard access — add your cars, update your info, link
                    your social media, and start receiving inquiries immediately.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 6: Pricing ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">💎</div>
              <div>
                <span className="section-num">SECTION SIX</span>
                <div className="section-title">Packages & Pricing</div>
              </div>
            </div>

            <div className="table-wrap">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free 🎁</th>
                    <th>Gold ⭐</th>
                    <th>Platinum 👑</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Branded marketing page</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Gold Verified badge</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Direct WhatsApp contact</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Media Manager Studio</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Social media links</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Inventory display</td>
                    <td>Up to 5 cars</td>
                    <td>Up to 50 cars</td>
                    <td className="yes">Unlimited</td>
                  </tr>
                  <tr>
                    <td>Page analytics reports</td>
                    <td className="no">—</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>CRM — lead tracking</td>
                    <td className="no">—</td>
                    <td className="soon">Coming soon</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Paid ads within the network</td>
                    <td className="no">—</td>
                    <td className="no">—</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>Monthly price</td>
                    <td style={{ color: '#10b981', fontWeight: 900, fontSize: '15px' }}>Free</td>
                    <td className="soon">Coming soon</td>
                    <td className="soon">Coming soon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION 7: Free vs Paid — What you unlock ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">⬆️</div>
              <div>
                <span className="section-num">SECTION SEVEN</span>
                <div className="section-title">What do you unlock when you upgrade from Free?</div>
              </div>
            </div>

            {/* Free-only note */}
            <div style={{
              background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 20,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: 14 }}>
                  Free Package — Arabic Interface Only
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65, marginTop: 4 }}>
                  The Free package is designed exclusively for the Egyptian Arabic-speaking market.
                  It operates entirely in Arabic — labels, menus, features, and notifications are Arabic-only.
                  <br /><br />
                  <strong style={{ color: 'var(--gold)' }}>
                    Upgrading to Growth, Pro, or Enterprise unlocks the full bilingual English + Arabic software experience,
                    plus all the professional features listed below.
                  </strong>
                  <br />
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>
                    الباقة المجانية — واجهة عربية فقط. الترقية تفتح الإنجليزية الكاملة.
                  </span>
                </div>
              </div>
            </div>

            {/* Paid-exclusive feature grid */}
            <div className="cards-grid">
              {[
                { icon: '🌐', title: 'Full Bilingual Interface', desc: 'Complete English + Arabic software dashboard — menus, labels, notifications, and reports all in both languages.', badge: 'Growth+' },
                { icon: '📊', title: 'Page Analytics & Geo Reports', desc: 'Visitor counts, click-through rates, WhatsApp leads, and geographic location reports per vehicle.', badge: 'Growth+' },
                { icon: '💻', title: 'Offline Desktop ERP', desc: 'Almostashar ERP installed locally on your showroom PC — invoices, contracts, and installments run 100% without internet.', badge: 'Growth+' },
                { icon: '📋', title: 'Bilingual Legal Contracts', desc: 'Print Arabic & English vehicle purchase agreements, trade-in contracts, and deposit vouchers with one click.', badge: 'Growth+' },
                { icon: '🗂️', title: 'CRM Lead Tracking', desc: 'Full CRM sales pipeline: log buyer enquiries, set follow-up reminders, and track lead-to-sale conversion rates.', badge: 'Pro+' },
                { icon: '🚗', title: '25 – 500+ Vehicle Listings', desc: 'List up to 25 vehicles (Growth), 50 (Pro), or 500+ (Enterprise) — far beyond the 10-car free limit.', badge: 'Growth+' },
                { icon: '🎬', title: 'Video Reels & Poster Studio', desc: 'Create animated car video ads and professional promotional posters directly from your mobile phone.', badge: 'Pro+' },
                { icon: '🌍', title: 'Independent .com Domain', desc: 'Full custom domain (yourbrand.com) with free SSL certificate — your own professional web identity.', badge: 'Pro+' },
                { icon: '🔝', title: '1.5× – 5.0× Search Priority', desc: 'Boosted placement in AutoFyon search results — Growth (1.5×), Pro (2.5×), Enterprise (5.0×) maximum authority.', badge: 'Growth+' },
              ].map(({ icon, title, desc, badge }) => (
                <div key={title} className="card card-highlight">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
                      color: 'var(--gold-light)',
                    }}>{badge}</span>
                  </div>
                  <div className="card-title">{title}</div>
                  <div className="card-desc">{desc}</div>
                </div>
              ))}
            </div>

            {/* Comparison strip */}
            <div style={{
              marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.05)' }}>
                <div style={{ fontWeight: 800, color: '#ef4444', fontSize: 13, marginBottom: 10 }}>🆓 Free Package Only</div>
                {['Arabic-only interface', 'Up to 10 vehicles', 'Basic subdomain link', 'Standard search ranking', 'Help centre support only', 'No analytics or CRM'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>✕</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', background: 'rgba(16,185,129,0.05)' }}>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: 13, marginBottom: 10 }}>⭐ Growth, Pro &amp; Enterprise</div>
                {['Full English + Arabic bilingual app', '25 to 500+ vehicles', 'Custom .com domain (Pro+)', '1.5× to 5.0× search boost', 'Direct WhatsApp &amp; account manager', 'Analytics, CRM, ERP &amp; Reels studio'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}
                    dangerouslySetInnerHTML={{ __html: `<span style="color:#10b981;font-weight:700">✓</span> ${f}` }}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a
                href="/en/packages"
                style={{
                  display: 'inline-block', padding: '12px 32px', borderRadius: 12,
                  background: 'var(--gold)', color: '#07090c', fontWeight: 900, fontSize: 14, textDecoration: 'none',
                }}
              >
                🚀 View All Packages &amp; Pricing
              </a>
            </div>
          </section>

          {/* ══ BACK COVER ══ */}
          <section className="back-cover">
            <div className="back-cover-logo">AutoFyon | أوتوفيون</div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              Egypt&apos;s Official Dealership Platform
            </p>
            <div className="back-cover-cta">
              Start now — activate your dealership for free
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.7 }}>
              Join the AutoFyon network today and start receiving serious buyers from day one —
              completely free with no commitments.
            </p>
            <a href="https://autofyon.com/join" className="back-cover-url">
              🚀 autofyon.com/join
            </a>
            <div className="qr-box">QR → /join</div>
            <p style={{ color: '#475569', fontSize: '12px', marginTop: '20px' }}>
              © {new Date().getFullYear()} AutoFyon | autofyon.com | All rights reserved
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
