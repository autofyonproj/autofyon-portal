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
    // ── FREE PACKAGE: Arabic only ──────────────────────────────────────
    title: 'العضوية المجانية',
    badge: 'معرض مسجل ومعتمد مجاناً',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    price: '٠ ج.م / شهرياً',
    subtitle: 'انطلق رقمياً الآن بدون أي تكاليف وبدون بطاقة بنكية',
    targetAudience: 'التجار المستقلون، الوسطاء، والمعارض الناشئة الراغبة في تجربة آمنة بالكامل.',
    painPoint: 'عشوائية مشاركة الصور على واتساب، وفقدان بيانات العملاء المهتمين، وغياب صفحة عرض رقمية راقية.',
    sellingPoints: [
      'صفحة معرض رقمية معتمدة ورسمية باسمك فوراً على autofyon.com.',
      'عرض حتى ١٠ سيارات نشطة بكامل المواصفات الفنية والصور عالية الجودة.',
      'زر استفسار مباشر عبر واتساب من كل سيارة بدون أي وسيط أو عمولات.',
      'أرشفة فورية لاسم معرضك وسياراتك على محرك البحث.',
    ],
    playbook: [
      { step: '١. أضف سياراتك العشرة الأفضل', desc: 'ارفع أفضل ١٠ سيارات في معرضك بصور واضحة وسعر شفاف.' },
      { step: '٢. ضع رابط معرضك في بايو واتساب وفيسبوك', desc: 'استبدل إرسال الصور المشتتة برابط واحد منظم يفتح فوراً للعميل.' },
      { step: '٣. استقبل طلبات الشراء مباشرة', desc: 'كل نقرة زر من العميل تفتح محادثة واتساب جاهزة باسم ومواصفات السيارة.' },
    ],
    bonuses: [
      'شارة معرض مسجل ومعتمد مجاناً على المنصة.',
      '٤ نماذج منشورات تسويقية شهرياً جاهزة للنشر على فيسبوك.',
      'مجاني مدى الحياة بدون أي شروط خفية.',
    ],
    upgradeWhy: 'عندما يتجاوز مخزونك ١٠ سيارات أو تحتاج نظام محاسبي ومبيعات محلي يعمل أوفلاين بدون إنترنت على لابتوب المعرض.',
    upgradeTarget: 'باقة النمو',
    specs: {
      cars: 'حتى ١٠ سيارات',
      heroSlides: '٣ صور سلايدر',
      crm: 'خط مبيعات سحابي أساسي',
      domain: 'رابط فرعي رسمي أوتوفيون',
      support: 'دعم فني عبر مركز المساعدة',
      searchBoost: '١.٠x (ظهور قياسي)',
    },
  },
  {
    id: 'growth',
    // ── GROWTH PACKAGE: Bilingual ──────────────────────────────────────
    title: 'باقة النمو للمعارض النامية',
    badge: 'معرض نامٍ ومحترف · Growth',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    price: 'استثمار اقتصادي مرن · Flexible Investment',
    subtitle: 'الاستقرار الكامل: سيستم مبيعات ومحاسبة يعمل ١٠٠٪ أوفلاين · Full offline sales & accounting ERP on your PC',
    targetAudience: 'المعارض النشطة التي تمتلك من ١٥ إلى ٣٠ سيارة · Active showrooms managing 15–30 vehicles',
    painPoint: 'الخوف من انقطاع الإنترنت الذي يوقف البيع، والأخطاء اليدوية في حساب الأقساط والأرباح. / Fear of internet outages freezing sales and manual installment errors.',
    sellingPoints: [
      'نسخة سيستم المستشار أوتو المستقلة الكاملة — تثبيت محلي على جهاز المعرض · Standalone Almostashar ERP — locally installed on your showroom PC.',
      'عمل ١٠٠٪ بدون إنترنت: فواتير، عقود بيع، أقساط، وسجل عملاء آمن · 100% offline: invoices, contracts, installments & secure customer records.',
      'مزامنة ذكية: سحب استفسارات الموقع فور توفر الاتصال · Smart sync: pulls online buyer inquiries automatically when connected.',
      'معرض يتسع لـ ٢٥ سيارة مع ٦ صور سلايدر لكل سيارة · 25-car inventory with 6 high-res slides per vehicle.',
    ],
    playbook: [
      { step: '١. ثبّت البرنامج — Install the ERP', desc: 'شغل ملف التثبيت AutoFyon-Setup وابدأ إدارة المخزون فوراً. / Run AutoFyon-Setup installer and start managing inventory immediately.' },
      { step: '٢. سجّل عملاء المعرض اليوميين — Log Daily Customers', desc: 'سجل العميل واحتياجه واطبع عقد البيع في أقل من ٦٠ ثانية. / Record customer needs and print a sales contract in under 60 seconds.' },
      { step: '٣. زامن الاستفسارات الأونلاين — Sync Online Leads', desc: 'يدمج السيستم استفسارات الموقع داخل شاشة المبيعات بضغطة واحدة. / The system merges website inquiries into your sales screen with one tap.' },
    ],
    bonuses: [
      'ترخيص جهازين · 2-device license (desktop + manager mobile).',
      '٢٠ باقة محتوى تسويقي شهرياً · 20 monthly social media content packs.',
      'نسخ احتياطي تلقائي للبيانات · Automatic local data backup.',
    ],
    upgradeWhy: 'عندما ترغب في دومين .com مستقل وظهور مضاعف ٢.٥ ضعف. / When you need an independent custom domain and 2.5x search boost.',
    upgradeTarget: 'باقة المعارض الاحترافية · Pro Dealership',
    specs: {
      cars: 'حتى ٢٥ سيارة · Up to 25 vehicles',
      heroSlides: '٦ صور عالية الدقة · 6 HD slides',
      crm: 'ERP ومحاسبة كامل أوفلاين · Full offline ERP',
      domain: 'رابط فرعي مخصص · Custom subdomain',
      support: 'دعم مباشر واتساب · Direct WhatsApp support',
      searchBoost: '١.٠x (ظهور منظم · Organised ranking)',
    },
  },
  {
    id: 'pro',
    // ── PRO PACKAGE: Bilingual ─────────────────────────────────────────
    title: 'عضوية المعارض المتقدمة · Pro Dealership',
    badge: 'معرض معتمد وموثق ✓ · Verified Pro',
    badgeColor: 'bg-[#c4a265]/20 text-[#c4a265] border-[#c4a265]/40',
    price: '٢٬٥٠٠ ج.م / شهرياً · EGP 2,500 / month',
    subtitle: 'الهوية المستقلة الكاملة بموقعك الخاص وظهور متصدر · Full independent identity with 2.5x search priority',
    targetAudience: 'المعارض المرموقة، تجار السيارات الفارهة، والمعارض ذات طاقم المبيعات المتعدد · Premium showrooms with multi-rep sales teams',
    painPoint: 'فقدان العملاء VIP لصالح المنافسين الكبار وضعف التوثيق الرقمي. / Losing VIP clients to larger competitors and weak digital branding.',
    sellingPoints: [
      'دومين خاص مستقل باسم معرضك مع SSL مجاني · Independent custom domain (yourbrand.com) with free SSL.',
      'تصميم الأتيليه الأسود الفاخر وقوالب الألاباستر الملكية · Obsidian Night luxury design & alabaster premium templates.',
      'استعراض حتى ٥٠ سيارة مع فيديوهات يوتيوب والاستعراض البانورامي · Up to 50 cars with YouTube videos and 360° panoramic view.',
      'مضاعفة الظهور ٢.٥ ضعف في مقدمة محرك بحث أوتوفيون · 2.5x priority boost in AutoFyon search results.',
      'توزيع ذكي وتلقائي للعملاء المحتملين على موظفي المبيعات · Smart automatic lead distribution to your sales reps.',
    ],
    playbook: [
      { step: '١. ارفع اسم نطاقك المستقل — Set Up Your Domain', desc: 'اربط موقعك التجاري ليكون واجهتك في كروت العمل. / Link your business domain for use on business cards and signage.' },
      { step: '٢. صوّر فيديوهات شورتس لكل سيارة — Shoot Car Shorts', desc: 'أضف رابط فيديو المعاينة ليراه المشتري مباشرة. / Add preview video links so buyers can view before visiting.' },
      { step: '٣. قسّم المبيعات على موظفيك — Assign Your Team', desc: 'عيّن حتى ٥ موظفي مبيعات مع حجب الأرباح للمالك فقط. / Assign up to 5 sales reps with private profit visibility for owner only.' },
    ],
    bonuses: [
      'إعداد الدومين والشهادة الأمنية مجاناً · Free domain & SSL setup by our engineering team.',
      'حسابات منفصلة لـ ٥ موظفي مبيعات · 5 separate sales staff accounts with privacy protection.',
      'جدولة ١٠٠ منشور شهرياً على ٥ منصات · Schedule 100 posts/month across 5 social platforms.',
    ],
    upgradeWhy: 'عندما تدير عدة فروع أو تملك توكيلاً رسمياً. / When managing multiple branches or holding an official brand agency.',
    upgradeTarget: 'عضوية التوكيلات والمؤسسات · Enterprise Agency',
    specs: {
      cars: 'حتى ٥٠ سيارة · Up to 50 vehicles',
      heroSlides: '١٠ سلايدات (صور + يوتيوب) · 10 slides (photos + YouTube)',
      crm: 'خطوط مبيعات غير محدودة وأتمتة · Unlimited pipelines & automation',
      domain: 'دومين خاص بك · Your own .com domain',
      support: 'مدير حساب مخصص · Dedicated account manager',
      searchBoost: '٢.٥x في نتائج البحث · 2.5x search priority',
    },
  },
  {
    id: 'enterprise',
    // ── ENTERPRISE PACKAGE: Bilingual ──────────────────────────────────
    title: 'عضوية التوكيلات والمؤسسات · Enterprise Agency',
    badge: 'وكيل رسمي معتمد ★ · Official Agency',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    price: '٧٬٥٠٠ ج.م / شهرياً · EGP 7,500 / month',
    subtitle: 'السيادة المؤسسية: إدارة شبكة الفروع والكتالوجات الرسمية · Multi-branch network control & official distributor catalogues',
    targetAudience: 'التوكيلات الرسمية، الموزعون المعتمدون، وشبكات المعارض الكبرى · Official agencies, certified distributors & large multi-branch networks',
    painPoint: 'تشتت إدارة الفروع المنفصلة وضياع عمولات شبكة التوزيع. / Fragmented branch operations and lost distributor commission tracking.',
    sellingPoints: [
      'إدارة المركز الرئيسي مع الفروع ومراكز الصيانة في شاشة واحدة · Unified HQ dashboard linking all branches, showrooms & service centres.',
      'مخزون يصل إلى ٥٠٠ سيارة مع رفع فيديو مباشر وسلايدر يصل لـ ٥٠ شريحة · Up to 500 vehicles with live video upload & 50-slide carousel.',
      'أقصى مضاعفة ظهور: ٥.٠x في صدارة السوق المصري · Maximum visibility boost: 5.0x at the top of the Egyptian automotive market.',
      'شارة الوكيل الرسمي المعتمد (★) · Official Certified Distributor badge (★) for institutional trust.',
      'الكتالوج الرسمي للموديلات مع بروشورات PDF · Official model catalogue with PDF brochure links per category.',
      'شبكة تبادل السيارات مع الموزعين المعتمدين · Vehicle Exchange Network with authorised distributor partners.',
    ],
    playbook: [
      { step: '١. اربط المركز بالفروع الإقليمية — Connect HQ to Branches', desc: 'تحكم في صلاحيات كل فرع وأسعاره من المقر الرئيسي. / Control each branch\'s permissions and pricing from headquarters.' },
      { step: '٢. فعّل بروشورات PDF الرسمية — Activate Official PDFs', desc: 'ارفع مواصفات توكيلك لتتيح للعملاء تنزيل الكتالوج بضغطة زر. / Upload your agency specs so customers can download the catalogue instantly.' },
      { step: '٣. شارك المخزون مع الموزعين — Share Inventory with Partners', desc: 'استغل شبكة التبادل لعرض سياراتك في معارض شركائك. / Use the exchange network to showcase your cars across partner showrooms.' },
    ],
    bonuses: [
      'عدد لا نهائي من حسابات موظفي الفروع · Unlimited staff & branch accounts.',
      'تدريب ميداني لطاقم المبيعات والمحاسبين · On-site training for your sales team and accountants.',
      'ربط برمجي مخصص (API) مع أنظمة المؤسسة (SAP, Odoo, Oracle) · Custom API integration with your existing enterprise systems.',
    ],
    upgradeWhy: 'هذه هي أعلى درجات الخدمة المؤسسية المتاحة في السوق المصري للسيارات. / This is the highest tier of enterprise automotive service in the Egyptian market.',
    upgradeTarget: 'الخدمة المؤسسية الشاملة · Full Enterprise SLA',
    specs: {
      cars: 'حتى ٥٠٠ سيارة · Up to 500 vehicles',
      heroSlides: '٥٠ شريحة (صور + يوتيوب + فيديو مباشر) · 50 slides (photos + YouTube + live video)',
      crm: 'أتمتة متكاملة وربط فروع · Full automation & multi-branch CRM',
      domain: 'دومين مستقل وشبكة روابط فرعية · Independent domain & sub-domain network',
      support: 'فريق دعم هندسي واستشاري ٢٤/٧ · 24/7 engineering & advisory support',
      searchBoost: '٥.٠x (الصدارة التامة للمنصة) · 5.0x (Full platform authority)',
    },
  },
];

export default function PackagesShowcasePage() {
  const [selectedId, setSelectedId] = useState<PackageData['id']>('growth');
  const [modalOpen, setModalOpen] = useState(false);
  const [targetPackage, setTargetPackage] = useState<PackageData['id']>('growth');

  // ── Package Request Form States ──────────────────────────────────────────
  const [businessTypeId, setBusinessTypeId] = useState('showroom');
  const [showroomName, setShowroomName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [commercialReg, setCommercialReg] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passcode?: string; serial?: string; message?: string; requiresApproval?: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // ── 30-Day Trial Modal States ────────────────────────────────────────────
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialTypeId, setTrialTypeId] = useState('showroom');
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialCity, setTrialCity] = useState('القاهرة');
  const [trialSubmitting, setTrialSubmitting] = useState(false);
  const [trialResult, setTrialResult] = useState<{
    slug?: string; serial?: string; message?: string;
    businessTypeNameAr?: string; publicUrl?: string;
  } | null>(null);
  const [trialError, setTrialError] = useState('');

  const currentPkg = PACKAGES.find((p) => p.id === selectedId) || PACKAGES[1];
  const selectedTypeConfig = getVendorTypeConfig(businessTypeId);
  const selectedTrialTypeConfig = getVendorTypeConfig(trialTypeId);

  function openRequestModal(pkgId: PackageData['id']) {
    setTargetPackage(pkgId);
    setResult(null);
    setErrorMsg('');
    setModalOpen(true);
  }

  function openTrialModal() {
    setTrialResult(null);
    setTrialError('');
    setTrialName('');
    setTrialPhone('');
    setTrialTypeId('showroom');
    setTrialModalOpen(true);
  }

  async function handleTrialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTrialError('');
    setTrialSubmitting(true);
    try {
      const res = await fetch('/api/trials/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showroomName: trialName,
          phone: trialPhone,
          city: trialCity,
          businessTypeId: trialTypeId,
          tier: 'enterprise',
        }),
      });
      const data = await res.json() as {
        ok?: boolean; error?: string;
        trial?: { slug: string; serial: string; publicUrl: string; businessTypeNameAr: string; message?: string };
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setTrialError(data.error || 'حدث خطأ أثناء إنشاء التجربة. حاول مجدداً.');
        return;
      }
      setTrialResult({
        slug: data.trial?.slug,
        serial: data.trial?.serial,
        message: data.message,
        businessTypeNameAr: data.trial?.businessTypeNameAr,
        publicUrl: data.trial?.publicUrl,
      });
    } catch {
      setTrialError('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.');
    } finally {
      setTrialSubmitting(false);
    }
  }

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/packages/request-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showroomName,
          contactName,
          phone,
          city,
          packageId: targetPackage,
          businessTypeId,
          commercialReg,
          notes,
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; passcode?: string; serial?: string; message?: string; requiresApproval?: boolean };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'حدث خطأ أثناء إرسال الطلب. حاول مجدداً.');
        return;
      }
      setResult({
        passcode: data.passcode,
        serial: data.serial,
        message: data.message,
        requiresApproval: data.requiresApproval,
      });
    } catch {
      setErrorMsg('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07090c] dark:text-white selection:bg-[#c4a265] selection:text-black transition-colors duration-200" dir="rtl">
      
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 py-16 px-4 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 dark:from-[#c4a265]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-[#c4a265]/10 border border-amber-500/30 dark:border-[#c4a265]/30 text-xs font-bold text-amber-700 dark:text-[#c4a265] mb-6">
            <span>دليل الحلول والخدمات لمعارض وتجار السيارات في مصر</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            اختر الباقة المثالية التي تضاعف مبيعاتك وتدير معرضك باحترافية
          </h1>

          <p className="max-w-3xl mx-auto text-sm md:text-base text-slate-600 dark:text-neutral-400 mb-8 leading-relaxed">
            من المعارض الناشئة الراغبة في التواجد الرقمي المجاني، وحتى التوكيلات الكبرى ذات الفروع المتعددة.
            اكتشف مزايا كل باقة، وطريقة استغلالها عملياً في معرضك، وكيف ترقي بسلاسة مع نمو أرباحك.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#packages-explorer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#9e7d3b] text-black font-extrabold text-sm hover:from-[#d6b578] shadow-lg shadow-[#c4a265]/20 transition-all"
            >
              استعراض ومقارنة الباقات الأربعة ↓
            </a>
            <button
              onClick={openTrialModal}
              className="px-6 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-sm transition-all flex items-center gap-2"
            >
              <span>⭐ تجربة حقيقية شاملة لمدة 30 يوماً</span>
            </button>
            <a
              href="/brochure/autofyon-brochure-en.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-amber-600/30 dark:border-[#c4a265]/30 bg-amber-500/10 dark:bg-[#c4a265]/10 hover:bg-amber-500/20 text-amber-800 dark:text-[#c4a265] font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>⬇ تحميل البروشور الرسمي (PDF)</span>
            </a>
            <Link
              href="/download"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>معك كود تحميل من الإدارة؟ حمّل باقتك فوراً</span>
              <span className="text-[#c4a265]">←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Modern Sales Points Bento Grid (Arabic) ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-amber-600 dark:text-[#c4a265] uppercase tracking-widest block mb-1">
            مصممة خصيصاً لسوق السيارات المصري
          </span>
          <h2 className="text-2xl md:text-3xl font-black">
            أربعة ركائز تحول معرضك إلى منظومة مبيعات متكاملة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-none hover:border-amber-500/50 transition-all text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl mb-4">
              💻
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
              100% أوفلاين
            </span>
            <h3 className="text-base font-black mt-2 mb-1">سيستم المستشار ERP</h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              فواتيرك، عقودك، وأقساطك لا تتوقف إطلاقاً عند انقطاع الإنترنت. مثبت محلياً على جهاز المعرض.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-none hover:border-amber-500/50 transition-all text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl mb-4">
              💬
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
              0% عمولة
            </span>
            <h3 className="text-base font-black mt-2 mb-1">واتساب مباشر مع المشتري</h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              العميل يضغط نقرة واحدة فتفتح محادثة واتساب بمواصفات وسعر السيارة دون وسيط أو خصم عمولات.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-none hover:border-amber-500/50 transition-all text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl mb-4">
              📑
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
              صياغة قانونية
            </span>
            <h3 className="text-base font-black mt-2 mb-1">عقود وفواتير فورية</h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              طباعة فورية لعقود بيع السيارات، اتفاقيات الاستبدال، وإيصالات الأمانة وسندات القبض بضغطة زر.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1117] shadow-sm dark:shadow-none hover:border-amber-500/50 transition-all text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl mb-4">
              🔒
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase">
              حماية خماسية
            </span>
            <h3 className="text-base font-black mt-2 mb-1">تأمين هاردوير ضد النسخ</h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              ربط الترخيص ببصمة اللوحة الأم وكارت الشبكة، مع حارس زمني يمنع التلاعب بتاريخ الجهاز وسرقة النسخ.
            </p>
          </div>
        </div>

        {/* Before vs After comparison in Arabic */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none text-right">
          <div className="p-6 bg-red-500/5 border-b md:border-b-0 md:border-l border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 text-sm font-black text-red-600 dark:text-red-400 mb-3">
              <span>⚠️</span>
              <span>الوضع التقليدي العشوائي للمعارض</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>إرسال 50 صورة مشتتة للعميل على واتساب وضياع تفاصيل السيارات.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>عقود ورقية ضائعة في الأدراج وأخطاء في حساب الأقساط والأرباح يدوياً.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>انقطاع الإنترنت يعطل حركة المعرض وإصدار الفواتير وسندات القبض.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>غياب تام عن نتائج محرك البحث Google وفقدان ثقة المشتري الجديد.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-emerald-500/5">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400 mb-3">
              <span>✨</span>
              <span>المعيار الاحترافي مع أوتوفيون</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>رابط واحد راقٍ ومعتمد باسم معرضك (autofyon.com/اسم-معرضك).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>عقود بيع موثقة قانونياً وتنبيهات تلقائية للأقساط المتأخرة وهوامش الربح.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>سيستم ديسكتوب يعمل 100% بدون إنترنت مع حماية رقمية متطورة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>طلبات مشترين جادين مباشرة على واتساب وأرشفة فورية على Google.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Quick Sizing Profiler in Arabic ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-2">
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-[#c4a265]/5 text-right">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 dark:text-[#c4a265] uppercase tracking-wider block">
                محدد الحجم السريع لمعرضك
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                اختر عدد السيارات في معرضك لإبراز الباقة والمنظومة الأنسب لك فوراً:
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              اضغط على أي حجم لاستعراض مسار العمل وخطة الترقية
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <button
              onClick={() => setSelectedId('free')}
              className={`p-3 rounded-xl border text-right transition-all ${
                selectedId === 'free'
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-md text-emerald-800 dark:text-emerald-300 font-black'
                  : 'border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400 text-slate-700 dark:text-neutral-300'
              }`}
            >
              <div className="text-xs font-bold">1–10 سيارات</div>
              <div className="text-[11px] opacity-75">معرض ناشئ / وسيط حر</div>
            </button>

            <button
              onClick={() => setSelectedId('growth')}
              className={`p-3 rounded-xl border text-right transition-all ${
                selectedId === 'growth'
                  ? 'border-amber-500 bg-amber-500/15 shadow-md text-amber-800 dark:text-amber-300 font-black'
                  : 'border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400 text-slate-700 dark:text-neutral-300'
              }`}
            >
              <div className="text-xs font-bold">15–30 سيارة</div>
              <div className="text-[11px] opacity-75">معرض نشط (سيستم ERP)</div>
            </button>

            <button
              onClick={() => setSelectedId('pro')}
              className={`p-3 rounded-xl border text-right transition-all ${
                selectedId === 'pro'
                  ? 'border-red-500 bg-red-500/15 shadow-md text-red-800 dark:text-red-300 font-black'
                  : 'border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400 text-slate-700 dark:text-neutral-300'
              }`}
            >
              <div className="text-xs font-bold">30–100 سيارة</div>
              <div className="text-[11px] opacity-75">فريق مبيعات وتمويل بنكي</div>
            </button>

            <button
              onClick={() => setSelectedId('enterprise')}
              className={`p-3 rounded-xl border text-right transition-all ${
                selectedId === 'enterprise'
                  ? 'border-purple-500 bg-purple-500/15 shadow-md text-purple-800 dark:text-purple-300 font-black'
                  : 'border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400 text-slate-700 dark:text-neutral-300'
              }`}
            >
              <div className="text-xs font-bold">100+ فروع وتوكيلات</div>
              <div className="text-[11px] opacity-75">توكيل رسمي وشبكة موزعين</div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Package Navigation Tabs ───────────────────────────────────── */}
      <section id="packages-explorer" className="max-w-7xl mx-auto px-4 md:px-8 py-10 scroll-mt-24 md:scroll-mt-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PACKAGES.map((pkg) => {
            const isSelected = pkg.id === selectedId;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`text-right p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-gradient-to-b dark:from-[#c4a265]/15 dark:to-white/[0.03] border-amber-500 dark:border-[#c4a265] shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                    {pkg.badge}
                  </span>
                  {isSelected && <span className="text-amber-600 dark:text-[#c4a265] text-xs font-black">● نشط الآن</span>}
                </div>
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white mb-1">{pkg.title}</h3>
                <div className="text-xs font-bold text-amber-700 dark:text-[#c4a265]">{pkg.price}</div>
              </button>
            );
          })}
        </div>

        {/* ── Active Package Deep Dive ──────────────────────────────────── */}
        <div className="rounded-3xl border border-amber-500/30 dark:border-[#c4a265]/30 bg-white dark:bg-gradient-to-b dark:from-[#12151c] dark:to-[#07090c] p-6 md:p-10 shadow-xl dark:shadow-2xl relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${currentPkg.badgeColor}`}>
                  {currentPkg.badge}
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">الفئة المستهدفة: {currentPkg.targetAudience}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{currentPkg.title}</h2>
              <p className="text-sm text-slate-600 dark:text-neutral-300 mt-1">{currentPkg.subtitle}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-xl md:text-2xl font-black text-amber-700 dark:text-[#c4a265]">{currentPkg.price}</div>
              <button
                onClick={() => openRequestModal(currentPkg.id)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] shadow-lg shadow-[#c4a265]/20 transition-all"
              >
                طلب هذه الباقة وكود التحميل ✓
              </button>
            </div>
          </div>

          {/* Grid Layout: Selling Points & Sandbox Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
            
            {/* Left 7 Columns: Value & Selling Points */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Problem Solved */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                <strong className="text-red-500 dark:text-red-400 font-bold block mb-1">المشكلة التي تقضي عليها هذه الباقة تماماً:</strong>
                {currentPkg.painPoint}
              </div>

              {/* Core Selling Points */}
              <div>
                <h4 className="text-sm font-black text-amber-700 dark:text-[#c4a265] uppercase tracking-wider mb-3">
                  أبرز المزايا ونقاط القوة التي تزيد مبيعاتك:
                </h4>
                <div className="grid gap-2.5">
                  {currentPkg.sellingPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                      <span className="text-emerald-500 font-black text-base leading-none">✓</span>
                      <span className="text-xs md:text-sm text-slate-800 dark:text-neutral-200">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Playbook */}
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">
                  دليل تشغيل الباقة عملياً داخل معرضك:
                </h4>
                <div className="grid gap-3">
                  {currentPkg.playbook.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10">
                      <div className="text-xs font-bold text-amber-700 dark:text-[#c4a265] mb-1">{step.step}</div>
                      <div className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Bonuses */}
              <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-[#c4a265]/5 border border-amber-500/20 dark:border-[#c4a265]/20">
                <h4 className="text-xs font-extrabold text-amber-700 dark:text-[#c4a265] uppercase mb-2">
                  الهدايا والمزايا الإضافية المشمولة مجاناً مع الباقة:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-neutral-300">
                  {currentPkg.bonuses.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-600 dark:text-[#c4a265]">✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right 5 Columns: Interactive Sandbox & Live Simulation */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/60 p-5 shadow-sm dark:shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-neutral-400">
                  <span className="font-bold text-slate-900 dark:text-white">محاكاة تجربة العميل والمعرض</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px]">LIVE DEMO</span>
                </div>

                {/* Simulated Car Card Preview */}
                <div className="my-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-neutral-800 dark:to-neutral-700 relative flex items-center justify-center text-xs text-slate-700 dark:text-neutral-400">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white font-bold">
                      {currentPkg.specs.heroSlides}
                    </span>
                    {currentPkg.id === 'pro' || currentPkg.id === 'enterprise' ? (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-red-600 text-[10px] text-white font-bold">
                        ▶ فيديو يوتيوب متوفر
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">مرسيدس C200 موديل 2024</span>
                      <span className="text-xs font-extrabold text-amber-700 dark:text-[#c4a265]">3,450,000 ج.م</span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-600 dark:text-neutral-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">عداد: 12,000 كم</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">فابريكا بالكامل</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">ضمان وكيل</span>
                    </div>
                    <button className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                      <span>تواصل مع المعرض عبر واتساب</span>
                      <span>💬</span>
                    </button>
                  </div>
                </div>

                {/* Simulated CRM Lead Card */}
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 dark:text-neutral-400">شاشة مبيعات المعرض (CRM)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">عميل مهتم جديد ✓</span>
                  </div>
                  <div className="text-xs text-slate-900 dark:text-white font-bold">م/ طارق عبد العزيز — مهتم بسيارة C200</div>
                  <div className="text-[11px] text-slate-600 dark:text-neutral-400 flex justify-between">
                    <span>حالة المتابعة: تفاوض على التقسيط</span>
                    <span className="text-amber-700 dark:text-[#c4a265] font-semibold">{currentPkg.specs.crm}</span>
                  </div>
                </div>

                {/* Specs Matrix */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-neutral-500 block">سعة السيارات:</span>
                    <strong className="text-slate-900 dark:text-white">{currentPkg.specs.cars}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-500 block">النطاق والدومين:</span>
                    <strong className="text-slate-900 dark:text-white">{currentPkg.specs.domain}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-500 block">مضاعفة البحث:</span>
                    <strong className="text-slate-900 dark:text-white">{currentPkg.specs.searchBoost}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-neutral-500 block">مستوى الدعم:</span>
                    <strong className="text-slate-900 dark:text-white">{currentPkg.specs.support}</strong>
                  </div>
                </div>

              </div>

              {/* Upgrade Trigger Banner */}
              <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-gradient-to-br dark:from-white/[0.04] dark:to-[#c4a265]/10 border border-amber-500/30 dark:border-[#c4a265]/30">
                <div className="text-xs font-bold text-amber-700 dark:text-[#c4a265] mb-1">
                  مسار الترقية القادم ↗ ({currentPkg.upgradeTarget})
                </div>
                <div className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed mb-3">
                  <strong>متى ترقي؟</strong> {currentPkg.upgradeWhy}
                </div>
                <button
                  onClick={() => {
                    const idx = PACKAGES.findIndex((p) => p.id === currentPkg.id);
                    if (idx < PACKAGES.length - 1) setSelectedId(PACKAGES[idx + 1].id);
                  }}
                  className="text-xs font-bold text-amber-700 dark:text-[#c4a265] hover:underline flex items-center gap-1"
                >
                  <span>استعرض مميزات الترقية التالية</span>
                  <span>←</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
            <div className="text-xs text-neutral-400">
              جاهز للتجربة؟ اطلب باقتك وسيصلك كود التحميل والتثبيت فوراً عبر الواتساب.
            </div>
            <button
              onClick={() => openRequestModal(currentPkg.id)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] shadow-lg shadow-[#c4a265]/20 transition-all"
            >
              اطلب {currentPkg.title} وكود التفعيل الآن ✓
            </button>
          </div>

        </div>
      </section>

      {/* ── Request Modal ─────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e1117] border border-[#c4a265]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-right">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 left-5 text-neutral-400 hover:text-white text-lg"
            >
              ✕
            </button>

            {result ? (
              <div className="text-center py-6 space-y-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto border ${
                  result.requiresApproval
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                }`}>
                  {result.requiresApproval ? '⏳' : '✓'}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {result.requiresApproval ? 'تم تسجيل طلبك وقيد المراجعة الإدارية' : 'تم تفعيل باقتكم بنجاح!'}
                </h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  {result.message}
                </p>

                {result.requiresApproval ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 my-4 text-right text-xs space-y-2 text-neutral-300">
                    <div className="font-bold text-amber-300">خطوات التحقق واعتماد الملكية:</div>
                    <div>1. يقوم مسؤول المنصة بمطابقة رقم الهاتف مع هاتف المعرض الرسمي المسجل.</div>
                    <div>2. يتم التواصل معكم عبر الواتساب لتأكيد الهوية.</div>
                    <div>3. يتم تسليمكم كود التحميل (Passcode) لفتح صفحة المعرض فور الاعتماد.</div>
                  </div>
                ) : (
                  result.passcode && (
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-[#c4a265]/30 my-4 text-center">
                      <span className="text-[11px] text-neutral-400 block mb-1">كود التحميل السريع الخاص بكم:</span>
                      <span className="text-2xl font-black tracking-widest text-[#c4a265]">{result.passcode}</span>
                      <span className="text-[10px] text-neutral-500 block mt-1">صالح لمدة 48 ساعة</span>
                    </div>
                  )
                )}

                <div className="pt-4 flex flex-col gap-2">
                  {!result.requiresApproval ? (
                    <Link
                      href={`/download?phone=${encodeURIComponent(phone)}&code=${result.passcode || ''}`}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] text-center"
                    >
                      الانتقال لصفحة التحميل وتفعيل النسخة الآن ←
                    </Link>
                  ) : null}
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-neutral-400 hover:text-white"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#c4a265] block mb-1">طلب انضمام وتحميل باقة</span>
                  <h3 className="text-xl font-extrabold text-white">
                    {PACKAGES.find((p) => p.id === targetPackage)?.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    سجل بيانات نشاطك التجاري لنرسل لك كود التفعيل والتحميل عبر الواتساب.
                  </p>
                </div>

                {targetPackage === 'free' ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed">
                    🛡️ <strong>حماية وتوثيق هوية النشاط التجاري:</strong> تخضع الباقة المجانية لمراجعة واعتماد الإدارة للتأكد من ملكية الصفحة ومنع انتحال الهوية. سيتم التواصل معكم هاتفياً أو عبر الواتساب لتأكيد الملكية وتسليم كود التفعيل.
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed">
                    ⚡ <strong>تفعيل فوري مباشر:</strong> هذه الباقة تُفعّل وتُحمّل فوراً بدون أي تأخير أو انتظار لمراجعة إدارية.
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {errorMsg}
                  </div>
                )}

                {/* ── Business Type Selector ─────────────────────────── */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">نوع النشاط التجاري *</label>
                  <div className="space-y-2">
                    {VENDOR_TYPE_GROUPS.map((group) => (
                      <div key={group.groupId}>
                        <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5 px-1">
                          {group.groupNameAr}
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {group.types.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setBusinessTypeId(t.id)}
                              className={`w-full text-right px-3 py-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                                businessTypeId === t.id
                                  ? 'border-[#c4a265] bg-[#c4a265]/15 text-white font-bold'
                                  : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-neutral-200'
                              }`}
                            >
                              <span className="text-base flex-shrink-0">{t.icon}</span>
                              <span className="flex-1">{t.nameAr}</span>
                              {businessTypeId === t.id && (
                                <span className="text-[#c4a265] text-sm flex-shrink-0">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">{selectedTypeConfig?.nameLabelAr ?? 'اسم النشاط التجاري *'}</label>
                  <input
                    type="text"
                    required
                    value={showroomName}
                    onChange={(e) => setShowroomName(e.target.value)}
                    placeholder={selectedTypeConfig?.namePlaceholderAr ?? 'مثال: معرض الأهرام موتورز'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#c4a265]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">اسم المسؤول *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="مثال: أ/ محمد السيد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#c4a265]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">رقم الموبايل / واتساب *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#c4a265]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">المحافظة</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="القاهرة / الجيزة..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-[#c4a265]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">الباقة المختارة</label>
                    <select
                      value={targetPackage}
                      onChange={(e) => setTargetPackage(e.target.value as PackageData['id'])}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#141820] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c4a265]"
                    >
                      {PACKAGES.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {targetPackage === 'free' ? (
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">رقم السجل التجاري أو رابط صفحة المعرض الحالية (اختياري للتحقق السريع)</label>
                    <input
                      type="text"
                      value={commercialReg}
                      onChange={(e) => setCommercialReg(e.target.value)}
                      placeholder="سجل تجاري / رابط فيسبوك / رابط المعرض على الخرائط"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c4a265]"
                    />
                  </div>
                ) : null}

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">ملاحظات أو متطلبات خاصة (اختياري)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="عدد السيارات التقريبي، عدد الفروع..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-[#c4a265]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] disabled:opacity-50 transition-all shadow-md shadow-[#c4a265]/20"
                  >
                    {submitting
                      ? 'جاري إرسال الطلب...'
                      : targetPackage === 'free'
                      ? `إرسال طلب ${selectedTypeConfig?.nameAr || 'المعرض'} المجاني للمراجعة والاعتماد ✓`
                      : `تفعيل وتحميل الباقة لـ${selectedTypeConfig?.nameAr || 'المعرض'} فوراً ✓`}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ── 30-Day Trial Modal ─────────────────────────────────────────── */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e1117] border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setTrialModalOpen(false)}
              className="absolute top-5 left-5 text-neutral-400 hover:text-white text-lg"
            >
              ✕
            </button>

            {trialResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto border bg-emerald-500/10 border-emerald-500 text-emerald-400">
                  🚀
                </div>
                <h3 className="text-xl font-bold text-white">تم إطلاق نسختك التجريبية الحية!</h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  {trialResult.message}
                </p>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 my-4 text-right space-y-3">
                  {trialResult.businessTypeNameAr && (
                    <div className="text-xs text-neutral-400">
                      نوع النشاط: <span className="text-white font-bold">{trialResult.businessTypeNameAr}</span>
                    </div>
                  )}
                  {trialResult.publicUrl && (
                    <div className="text-xs text-neutral-400">
                      رابط صفحتك على المنصة:
                      <a
                        href={trialResult.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-amber-400 font-bold hover:underline break-all"
                      >
                        autofyon.com{trialResult.publicUrl}
                      </a>
                    </div>
                  )}
                  {trialResult.serial && (
                    <div className="text-xs text-neutral-400">
                      سيريال النسخة المحلية (ERP):
                      <span className="block font-black tracking-widest text-[#c4a265] text-sm mt-1">{trialResult.serial}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 text-right leading-relaxed">
                  <strong className="block mb-1">⭐ ملاحظات مهمة عن التجربة:</strong>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>مدة التجربة 30 يوماً كاملة بدون أي قيود على الموديولات.</li>
                    <li>يتم حذف بيانات التجربة تلقائياً فور انتهاء المدة.</li>
                    <li>للاستمرار بعد 30 يوماً، اطلب إحدى الباقات الرسمية.</li>
                    <li>التجربة واحدة لكل رقم هاتف.</li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  {trialResult.publicUrl && (
                    <a
                      href={trialResult.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-black font-extrabold text-sm hover:from-amber-400 text-center"
                    >
                      افتح صفحتك التجريبية الحية الآن ←
                    </a>
                  )}
                  <button
                    onClick={() => setTrialModalOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-neutral-400 hover:text-white"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 mb-3">
                    ⭐ تجربة حية شاملة — 30 يوماً بدون قيود
                  </div>
                  <h3 className="text-xl font-extrabold text-white">ابدأ تجربتك المجانية الآن</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    صفحة نشاطك الحية + نظام ERP كامل + جميع الموديولات — تجربة حقيقية لمدة 30 يوماً بدون أي تكلفة أو بطاقة بنكية.
                  </p>
                </div>

                {trialError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {trialError}
                  </div>
                )}

                {/* Business Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">نوع نشاطك التجاري *</label>
                  <div className="max-h-52 overflow-y-auto space-y-2 pl-1">
                    {VENDOR_TYPE_GROUPS.map((group) => (
                      <div key={group.groupId}>
                        <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5 px-1">
                          {group.groupNameAr}
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {group.types.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTrialTypeId(t.id)}
                              className={`w-full text-right px-3 py-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                                trialTypeId === t.id
                                  ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                                  : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-neutral-200'
                              }`}
                            >
                              <span className="text-base flex-shrink-0">{t.icon}</span>
                              <span className="flex-1">{t.nameAr}</span>
                              {trialTypeId === t.id && (
                                <span className="text-amber-400 text-sm flex-shrink-0">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">
                    {selectedTrialTypeConfig?.nameLabelAr ?? 'اسم النشاط التجاري *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trialName}
                    onChange={(e) => setTrialName(e.target.value)}
                    placeholder={selectedTrialTypeConfig?.namePlaceholderAr ?? 'مثال: معرض الأهرام موتورز'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">رقم الموبايل / واتساب *</label>
                  <input
                    type="tel"
                    required
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">تجربة واحدة لكل رقم هاتف — 30 يوماً كاملة</p>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={trialCity}
                    onChange={(e) => setTrialCity(e.target.value)}
                    placeholder="القاهرة / الجيزة..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* What's included */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="text-[11px] font-bold text-neutral-300 mb-2">ما يشمله التجربة المجانية:</div>
                  {[
                    '✅ صفحة نشاط حية على المنصة فوراً',
                    '✅ نظام ERP ومحاسبة كامل — أوفلاين',
                    '✅ نظام CRM وإدارة عملاء',
                    '✅ جميع الموديولات بدون أي قيود',
                    '✅ 30 يوماً كاملة بدون بطاقة بنكية',
                    '⏱️ يُحذف تلقائياً بعد انتهاء المدة',
                  ].map((item, i) => (
                    <div key={i} className="text-xs text-neutral-400">{item}</div>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={trialSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-black font-extrabold text-sm hover:from-amber-400 disabled:opacity-50 transition-all shadow-md shadow-amber-500/20"
                  >
                    {trialSubmitting
                      ? 'جاري إطلاق تجربتك...'
                      : `ابدأ تجربة ${selectedTrialTypeConfig?.nameAr || 'نشاطك'} المجانية الآن 🚀`}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ── Brochure Download Bar (Arabic) ─────────────── */}
      <section className="border-t border-white/10 bg-[#07090c] py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-6 rounded-2xl border border-[#c4a265]/20 bg-[#c4a265]/5 px-8 py-7" dir="rtl">
          <div className="text-right">
            <div className="text-xs font-bold text-[#c4a265] uppercase tracking-widest mb-2">وثائق رسمية</div>
            <h3 className="text-xl font-black text-white leading-tight">حمّل البروشور الرسمي الكامل</h3>
            <p className="text-sm text-neutral-400 mt-1.5 max-w-lg">
              بروشور احترافي من 8 صفحات — تفاصيل كل وحدة، مسارات الترقية، جدول المقارنة الكامل، وخارطة طريق المنصة. جاهز للطباعة كـ PDF.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="/brochure/autofyon-brochure-en.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#9e7d3b] text-black font-extrabold text-sm shadow-lg hover:from-[#d6b578] transition-all text-center"
            >
              ⬇ فتح البروشور (طباعة → PDF)
            </a>
            <a
              href="/brochure/ar"
              className="px-7 py-3 rounded-xl border border-[#c4a265]/30 bg-[#c4a265]/8 hover:bg-[#c4a265]/15 text-[#c4a265] font-bold text-sm transition-all text-center"
            >
              🇪🇬 النسخة العربية
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
