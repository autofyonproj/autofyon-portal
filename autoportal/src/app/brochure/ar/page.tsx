import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'بروشور خدمات أوتوفيون | AutoFyon',
  description: 'دليل شامل لخدمات ومزايا أوتوفيون لمعارض السيارات في مصر — تحميل مجاني',
};

export default function BrochureAr() {
  return (
    <>
      {/* Global print styles injected via dangerouslySetInnerHTML */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

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

            html { direction: rtl; font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; background: var(--bg-dark); color: var(--text); font-size: 15px; transition: background 0.2s, color 0.2s; }

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
              text-align: right; padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 13px;
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

            /* ── PRINT BUTTON ── */
            .print-bar {
              position: fixed; top: 0; left: 0; right: 0; z-index: 100;
              background: rgba(7,9,12,0.9); backdrop-filter: blur(16px);
              border-bottom: 1px solid rgba(245,158,11,0.3);
              padding: 10px 24px; display: flex; align-items: center; justify-between;
              gap: 12px;
            }
            .print-btn {
              margin-right: auto;
              padding: 8px 20px; border-radius: 10px;
              background: var(--gold); color: #07090c; font-weight: 900; font-size: 13px;
              border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;
              font-family: 'Cairo', sans-serif;
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
        <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo,sans-serif' }}>
          📄 بروشور أوتوفيون الرسمي 2026
        </span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="print-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text)', border: '1px solid var(--border)' }}
            suppressHydrationWarning
            data-action="theme"
          >
            ☀️ الوضع الفاتح
          </button>
          <a href="/brochure/en" className="lang-link">English Version</a>
          <button
            type="button"
            className="print-btn"
            onClick={undefined}
            suppressHydrationWarning
            data-action="print"
          >
            🖨️ طباعة / تحميل PDF
          </button>
        </div>
      </div>

      {/* Client script for print and theme buttons */}
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
                  this.textContent = isLight ? '🌙 الوضع الداكن' : '☀️ الوضع الفاتح';
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
            <div className="cover-logo">AutoFy<span> On</span></div>
            <div className="cover-sub">أوتوفيون — منصة معارض السيارات في مصر</div>
            <h1 className="cover-title">
              كل ما تحتاجه لتسويق معرضك <span>رقمياً</span> في مكان واحد
            </h1>
            <div className="cover-badge">🎁 الباقة المجانية | مزايا احترافية | تفعيل فوري</div>
            <div className="cover-year">دليل الخدمات الرسمي — {new Date().getFullYear()}</div>
          </section>

          {/* ══ SECTION 1: What is AutoFyon ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🚀</div>
              <div>
                <span className="section-num">القسم الأول</span>
                <div className="section-title">ما هو أوتوفيون؟</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card card-highlight">
                <div className="card-icon">🗂️</div>
                <div className="card-title">دليل المعارض الرسمي</div>
                <div className="card-desc">
                  autofyon.com هو الدليل الذهبي لمعارض السيارات الجديدة والمستعملة في مصر. المشترون يبحثون
                  عن معرضك هنا — وأنت تحتاج أن تكون موجوداً باحترافية.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🌐</div>
                <div className="card-title">صفحة تسويقية كاملة باسمك</div>
                <div className="card-desc">
                  كل معرض يحصل على صفحة رابطها <strong>autofyon.com/p/اسم-المعرض</strong> — تعمل كموقع
                  احترافي تشاركه على واتساب وسوشيال ميديا وكارت بيزنس.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🤝</div>
                <div className="card-title">شبكة موردين وتمويل</div>
                <div className="card-desc">
                  ربط مباشر بين المعارض وشركات التمويل والتأمين وموردي قطع الغيار والخدمات في شبكة واحدة
                  موثوقة.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">لوحة تحكم ذكية</div>
                <div className="card-desc">
                  استقبل اتصالات ورسائل المشترين، راقب إحصائيات الصفحة، وأدر مخزونك من لوحة تحكم بسيطة
                  تعمل على الموبايل.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 2: Free Package Benefits ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🎁</div>
              <div>
                <span className="section-num">القسم الثاني</span>
                <div className="section-title">ماذا تحصل في الباقة المجانية؟</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card card-emerald">
                <div className="card-icon">🌟</div>
                <div className="card-title">الشارة الذهبية (Verified)</div>
                <div className="card-desc">
                  معرضك يظهر بشارة ذهبية موثقة في الدليل — تميزك عن المعارض غير الموثقة وتزيد ثقة
                  المشترين فيك.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">📱</div>
                <div className="card-title">صفحة تسويقية جاهزة</div>
                <div className="card-desc">
                  صفحة بتصميم احترافي تحتوي على معلومات معرضك، كروسيل الماركات، روابط السوشيال ميديا،
                  وزر اتصال مباشر.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">📞</div>
                <div className="card-title">اتصالات ورسائل مباشرة</div>
                <div className="card-desc">
                  المشترون يتصلون بك أو يراسلوك على واتساب مباشرة من صفحتك بدون وسيط — كل استفسار يصلك
                  مباشرة على هاتفك.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🎬</div>
                <div className="card-title">ميديا مانجر ستوديو مجاني</div>
                <div className="card-desc">
                  تطبيق PWA مجاني على هاتفك لتصميم بوسترات السيارات، إعلانات ريلز، وعروض الأسعار في
                  ثوانٍ.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🗺️</div>
                <div className="card-title">ظهور في دليل القاهرة والأقاليم</div>
                <div className="card-desc">
                  معرضك يظهر في الدليل المصنف بالمحافظة والتخصص — يوصله البحث العضوي وشبكة أوتوفيون.
                </div>
              </div>
              <div className="card card-emerald">
                <div className="card-icon">🔗</div>
                <div className="card-title">ربط ماركاتك وسياراتك</div>
                <div className="card-desc">
                  أضف الماركات والسيارات التي تبيعها وتظهر في كروسيل جذاب على صفحتك مع مواصفات وأسعار
                  محدثة.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 3: Media Manager ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">🎬</div>
              <div>
                <span className="section-num">القسم الثالث</span>
                <div className="section-title">استوديو ميديا مانجر — اصنع إعلاناتك في دقيقة</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🖼️</div>
                <div className="card-title">بوسترات احترافية للسيارات</div>
                <div className="card-desc">
                  قوالب جاهزة بتصميمات احترافية — اختر صورة السيارة، أضف السعر والمواصفات وحمّل البوستر
                  فوراً لنشره على واتساب وفيسبوك.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🎥</div>
                <div className="card-title">فيديوهات ريلز للسيارات</div>
                <div className="card-desc">
                  أنشئ إعلانات فيديو للسيارات بانيميشن احترافي — مناسبة للنشر على إنستجرام ريلز وتيك توك
                  ويوتيوب شورتس.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">💰</div>
                <div className="card-title">عروض أسعار فورية</div>
                <div className="card-desc">
                  أنشئ قائمة أسعار كاملة بكل سياراتك في دقيقة وشاركها PDF أو صورة مباشرة على واتساب
                  مع العملاء.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📲</div>
                <div className="card-title">تطبيق PWA على موبايلك</div>
                <div className="card-desc">
                  لا تحتاج لتنزيل من متجر التطبيقات — افتح الرابط، اضغط "تثبيت" وسيعمل كتطبيق أصلي
                  على أندرويد وآيفون.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📤</div>
                <div className="card-title">مشاركة مباشرة من الهاتف</div>
                <div className="card-desc">
                  كل محتوى تصممه يُحفظ مباشرة في مكتبتك ويمكن مشاركته فوراً على واتساب أو حفظه في
                  استوديو المعرض.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🔒</div>
                <div className="card-title">مكتبة المعرض الخاصة</div>
                <div className="card-desc">
                  كل محتوى تصممه محفوظ في مكتبة خاصة بمعرضك — صور، فيديوهات، وبوسترات جاهزة للنشر
                  في أي وقت.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 4: Directory & Badge ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <div>
                <span className="section-num">القسم الرابع</span>
                <div className="section-title">دليل المعارض والشارة الذهبية الموثقة</div>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🔍</div>
                <div className="card-title">ظهور في نتائج البحث</div>
                <div className="card-desc">
                  الدليل مهيأ لمحركات البحث — المشترون الذين يبحثون عن &quot;معارض سيارات في القاهرة&quot; أو
                  &quot;سيارات مستعملة في الإسكندرية&quot; يصلون إلى معرضك.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">⭐</div>
                <div className="card-title">الشارة الذهبية (Gold Verified)</div>
                <div className="card-desc">
                  معرضك يظهر في مقدمة الدليل بشارة ذهبية موثقة بعد تأكيد الملكية — شارة تعني للمشتري
                  أن المعرض حقيقي وموثوق.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">تصنيف ذكي بالتخصص والمنطقة</div>
                <div className="card-desc">
                  معرضك يظهر في فئته (تويوتا، مرسيدس، مستعمل، إلخ) وفي منطقتك (التجمع، المعادي، السادس
                  من أكتوبر) بشكل منفصل.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">🏆</div>
                <div className="card-title">أولوية في الظهور</div>
                <div className="card-desc">
                  المعارض الموثقة تظهر دائماً قبل المعارض غير الموثقة وتحصل على مساحة عرض أكبر وبيانات
                  أكثر تفصيلاً.
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 5: How to Claim ══ */}
          <section className="section">
            <div className="section-header">
              <div className="section-icon">⚡</div>
              <div>
                <span className="section-num">القسم الخامس</span>
                <div className="section-title">كيف تفعّل معرضك في أقل من دقيقة؟</div>
              </div>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">١</div>
                <div>
                  <div className="step-title">اضغط &quot;تفعيل الباقة المجانية&quot; من صفحة معرضك</div>
                  <div className="step-desc">
                    كل معرض لديه رابط مخصص على autofyon.com — افتح الرابط المرسل إليك على واتساب وستجد
                    زر التفعيل واضحاً.
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">٢</div>
                <div>
                  <div className="step-title">أكد ملكيتك بالواتساب — OTP لثوانٍ</div>
                  <div className="step-desc">
                    سيرسل إليك أوتوفيون رسالة واتساب برمز تحقق — أدخله في الصفحة وسيتم ربط رقمك
                    بالمعرض فوراً.
                  </div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">٣</div>
                <div>
                  <div className="step-title">استلام لوحة التحكم وبدء استقبال العملاء</div>
                  <div className="step-desc">
                    فور التحقق تحصل على لوحة التحكم الكاملة — أضف سياراتك، عدّل بياناتك، واربط
                    سوشيال ميديا معرضك وابدأ استقبال الاستفسارات فوراً.
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
                <span className="section-num">القسم السادس</span>
                <div className="section-title">الباقات والأسعار</div>
              </div>
            </div>

            <div className="table-wrap">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th>الميزة</th>
                    <th>المجانية 🎁</th>
                    <th>الذهبية ⭐</th>
                    <th>البلاتينية 👑</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>صفحة تسويقية بالاسم</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>الشارة الذهبية (Verified)</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>اتصال واتساب مباشر</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>ميديا مانجر ستوديو</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>ربط سوشيال ميديا</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>عرض سيارات مخزن المعرض</td>
                    <td>حتى ٥ سيارات</td>
                    <td>حتى ٥٠ سيارة</td>
                    <td className="yes">غير محدود</td>
                  </tr>
                  <tr>
                    <td>تقارير إحصائيات الصفحة</td>
                    <td className="no">—</td>
                    <td className="yes">✓</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>CRM متابعة العملاء المحتملين</td>
                    <td className="no">—</td>
                    <td className="soon">قريباً</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>إعلانات مدفوعة داخل الشبكة</td>
                    <td className="no">—</td>
                    <td className="no">—</td>
                    <td className="yes">✓</td>
                  </tr>
                  <tr>
                    <td>السعر الشهري</td>
                    <td style={{ color: '#10b981', fontWeight: 900, fontSize: '15px' }}>مجاني</td>
                    <td className="soon">قريباً</td>
                    <td className="soon">قريباً</td>
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
                <span className="section-num">القسم السابع</span>
                <div className="section-title">ماذا تكسب بالترقية من المجاني؟</div>
              </div>
            </div>

            {/* Free-only note */}
            <div style={{
              background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>🎁</span>
              <div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: 14 }}>الباقة المجانية — عربي فقط</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginTop: 4 }}>
                  الباقة المجانية مصممة بالكامل للسوق المصري باللغة العربية فقط.
                  باقات النمو والاحترافية والمؤسسية تفتح الواجهة الإنجليزية الكاملة والأدوات الاحترافية التالية:
                  <br />
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    Free package is Arabic-only · Growth, Pro &amp; Enterprise unlock full English + Arabic bilingual software.
                  </span>
                </div>
              </div>
            </div>

            {/* Paid-exclusive feature grid */}
            <div className="cards-grid">
              {[
                { icon: '🌐', ar: 'واجهة إنجليزية كاملة للتطبيق', en: 'Full English-language app & dashboard interface' },
                { icon: '📊', ar: 'تقارير إحصائيات الصفحة والزوار', en: 'Page analytics, visitor stats & geo reports' },
                { icon: '💻', ar: 'سيستم ERP محاسبة أوفلاين', en: 'Offline desktop ERP accounting system' },
                { icon: '📋', ar: 'عقود بيع ثنائية اللغة (عربي + إنجليزي)', en: 'Bilingual legal sales contracts (Arabic + English)' },
                { icon: '🗂️', ar: 'CRM متابعة العملاء المحتملين', en: 'Full CRM lead tracking & sales pipeline' },
                { icon: '🚗', ar: 'عرض أكثر من ١٠ سيارات', en: 'List 25–500+ vehicles (beyond the 10-car free limit)' },
                { icon: '🎬', ar: 'استوديو فيديو ريلز وبوسترات', en: 'Video Reels creator & professional poster studio' },
                { icon: '🌍', ar: 'دومين .com مستقل', en: 'Your own independent .com domain (Pro+)' },
                { icon: '🔝', ar: 'أولوية ظهور مضاعفة في البحث', en: '1.5× – 5.0× search priority boost' },
              ].map(({ icon, ar, en }) => (
                <div key={ar} className="card">
                  <div className="card-icon">{icon}</div>
                  <div className="card-title">{ar}</div>
                  <div className="card-desc" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 11, marginBottom: 4 }}>{en}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a
                href="/packages"
                style={{
                  display: 'inline-block', padding: '12px 32px', borderRadius: 12,
                  background: 'var(--gold)', color: '#07090c', fontWeight: 900, fontSize: 14, textDecoration: 'none',
                }}
              >
                🚀 استعرض جميع الباقات والأسعار · View All Packages
              </a>
            </div>
          </section>

          {/* ══ BACK COVER ══ */}
          <section className="back-cover">
            <div className="back-cover-logo">AutoFyon | أوتوفيون</div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              منصة المعارض الرسمية في مصر
            </p>
            <div className="back-cover-cta">
              ابدأ الآن وفعّل معرضك مجاناً
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.7 }}>
              انضم إلى شبكة أوتوفيون اليوم وابدأ استقبال مشترين جادين من أول يوم — مجانياً وبدون أي التزامات.
            </p>
            <a href="https://autofyon.com/join" className="back-cover-url">
              🚀 autofyon.com/join
            </a>
            <div className="qr-box">QR → /join</div>
            <p style={{ color: '#475569', fontSize: '12px', marginTop: '20px' }}>
              © {new Date().getFullYear()} AutoFyon | autofyon.com | جميع الحقوق محفوظة
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
