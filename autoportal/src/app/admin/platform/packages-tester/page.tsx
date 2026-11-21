'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VENDOR_TIERS, type VendorTierId, type VendorTier } from '@/lib/tiers';

interface BusinessItem {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  subscription_tier: string;
}

interface FeatureModule {
  id: string;
  category: 'minisite' | 'crm' | 'social' | 'accounting' | 'branding';
  categoryTitle: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  tiers: {
    free: { status: 'available' | 'limited' | 'locked'; label: string; details: string };
    growth: { status: 'available' | 'limited' | 'locked'; label: string; details: string };
    pro: { status: 'available' | 'limited' | 'locked'; label: string; details: string };
    enterprise: { status: 'available' | 'limited' | 'locked'; label: string; details: string };
  };
}

const MODULES_MATRIX: FeatureModule[] = [
  // ── 1. Minisite & Public Marketplace ──────────────────────────────
  {
    id: 'max_active_cars',
    category: 'minisite',
    categoryTitle: 'معرض الويب والماركت بليس (Public Showroom)',
    name: 'Active Car Listings Quota',
    nameAr: 'الحد الأقصى للسيارات المعروضة بالمخزون',
    description: 'Number of simultaneous active car listings on the showroom page and public marketplace.',
    descriptionAr: 'عدد السيارات النشطة المسموح بعرضها في نفس الوقت على صفحة المعرض وسوق السيارات.',
    tiers: {
      free: { status: 'limited', label: '10 سيارات', details: 'مناسب للمعارض الناشئة والتجار المستقلين' },
      growth: { status: 'limited', label: '25 سيارة', details: 'سعة ممتازة للمعارض النامية متوسطة المخزون' },
      pro: { status: 'limited', label: '50 سيارة', details: 'سعة واسعة لكبرى معارض السيارات المستعملة والجديدة' },
      enterprise: { status: 'available', label: '500 سيارة', details: 'سعة استيعابية ضخمة للمؤسسات والتوكيلات وشبكات الفروع' },
    },
  },
  {
    id: 'hero_slides',
    category: 'minisite',
    categoryTitle: 'معرض الويب والماركت بليس (Public Showroom)',
    name: 'Hero Slider & Media Types',
    nameAr: 'سلايدر الهيرو ونوعية الوسائط المدعومة',
    description: 'Number of carousel slides and whether YouTube videos and direct video walkarounds are allowed.',
    descriptionAr: 'عدد شرائح العرض وأنواع الوسائط: صور فقط، يوتيوب، أو فيديو سينمائي مباشر.',
    tiers: {
      free: { status: 'limited', label: '3 شرائح (صور فقط)', details: 'صور ثابتة عالية الجودة فقط' },
      growth: { status: 'limited', label: '6 شرائح (صور فقط)', details: '6 صور سلايدر لعرض واجهة وتفاصيل المعرض' },
      pro: { status: 'available', label: '10 شرائح (صور + يوتيوب)', details: 'دعم كامل لتضمين فيديوهات يوتيوب ومعاينات شورتس' },
      enterprise: { status: 'available', label: '50 شريحة (صور + يوتيوب + فيديو مباشر)', details: 'أقصى درجات العرض السينمائي البانورامي مع رفع فيديو مباشر' },
    },
  },
  {
    id: 'custom_domain',
    category: 'minisite',
    categoryTitle: 'معرض الويب والماركت بليس (Public Showroom)',
    name: 'Custom Domain (.com)',
    nameAr: 'الدومين المستقل المخصص (.com)',
    description: 'Ability to link a dedicated standalone website domain name (e.g. showroom.com) with free SSL.',
    descriptionAr: 'ربط نطاق خاص ومستقل بالكامل باسم المعرض مع حماية وشهادة أمان مجانية.',
    tiers: {
      free: { status: 'locked', label: 'غير متاح (رابط فرعي فقط)', details: 'الرابط يكون autofyon.com/showroom' },
      growth: { status: 'locked', label: 'غير متاح (رابط فرعي فقط)', details: 'الرابط يكون autofyon.com/showroom' },
      pro: { status: 'available', label: 'متاح بالكامل (Custom Domain)', details: 'ربط دومين مستقل تماماً مثال: elhelw-motors.com' },
      enterprise: { status: 'available', label: 'متاح بالكامل + شبكة دومينات', details: 'دومين مستقل رئيسي وروابط فرعية لكافة الفروع' },
    },
  },
  {
    id: 'search_boost',
    category: 'minisite',
    categoryTitle: 'معرض الويب والماركت بليس (Public Showroom)',
    name: 'Marketplace Search Priority Boost',
    nameAr: 'مضاعف أولوية الظهور في محرك بحث المنصة',
    description: 'Search ranking algorithm multiplier for sorting showroom cars on the central AutoFyon marketplace.',
    descriptionAr: 'أولوية وترتيب ظهور سيارات المعرض في صدارة نتائج البحث العامة للمشترين.',
    tiers: {
      free: { status: 'limited', label: '1.0x (ظهور قياسي)', details: 'ظهور طبيعي وفق معايير التاريخ والحداثة' },
      growth: { status: 'limited', label: '1.0x (ظهور قياسي)', details: 'ظهور منتظم بالسوق' },
      pro: { status: 'available', label: '2.5x (أولوية متقدمة)', details: 'مضاعفة الظهور 2.5 ضعف في صدارة النتائج' },
      enterprise: { status: 'available', label: '5.0x (الصدارة التامة ★)', details: 'أعلى أولوية ظهور في المنصة لجميع الفروع' },
    },
  },

  // ── 2. CRM & Sales Pipeline ───────────────────────────────────────
  {
    id: 'standalone_offline_erp',
    category: 'crm',
    categoryTitle: 'إدارة العملاء والمبيعات (CRM & Sales Pipeline)',
    name: 'Standalone Desktop Offline ERP / CRM',
    nameAr: 'برنامج الكمبيوتر المستقل (يعمل 100% أوفلاين بدون إنترنت)',
    description: 'Desktop installation package running on local PC with zero cloud dependency and local SQLite/IndexedDB.',
    descriptionAr: 'نسخة المستشار أوتو الكاملة للكمبيوتر واللابتوب، تعمل محلياً بدون أي توقف أثناء انقطاع الإنترنت.',
    tiers: {
      free: { status: 'locked', label: 'غير متاح (سحابي فقط)', details: 'النسخة المجانية تعمل عبر متصفح الويب فقط' },
      growth: { status: 'available', label: 'متاح بالكامل (ترخيص جهازين)', details: '1 كمبيوتر رئيسي للإدارة + 1 موبايل لمدير المعرض' },
      pro: { status: 'available', label: 'متاح بالكامل (حتى 5 أجهزة)', details: 'تثبيت محلي مع صلاحيات متعددة لموظفي المبيعات' },
      enterprise: { status: 'available', label: 'متاح بالكامل (غير محدود)', details: 'تراخيص غير محدودة لجميع الفروع وأجهزة المبيعات' },
    },
  },
  {
    id: 'crm_pipelines',
    category: 'crm',
    categoryTitle: 'إدارة العملاء والمبيعات (CRM & Sales Pipeline)',
    name: 'Sales Pipelines & Workflows',
    nameAr: 'خطوط مسارات المبيعات والمتابعة',
    description: 'Customizable sales pipelines for new cars, used trade-ins, installments, and corporate deals.',
    descriptionAr: 'تخصيص مسارات البيع ومراحل التفاوض: كاش، تقسيط، استبدال، وشركات.',
    tiers: {
      free: { status: 'limited', label: 'خط مبيعات واحد أساسي', details: 'متابعة مسار مبيعات تقليدي واحد فقط' },
      growth: { status: 'limited', label: 'خط مبيعات واحد محلي', details: 'متابعة خط مبيعات محلي منظم' },
      pro: { status: 'available', label: 'خطوط مبيعات غير محدودة', details: 'تخصيص خطوط مبيعات متعددة لمختلف الفئات' },
      enterprise: { status: 'available', label: 'غير محدودة + أتمتة كاملة', details: 'أتمتة خطوط المبيعات بين المقر الرئيسي والفروع' },
    },
  },
  {
    id: 'lead_automation',
    category: 'crm',
    categoryTitle: 'إدارة العملاء والمبيعات (CRM & Sales Pipeline)',
    name: 'Automated Lead Assignment & Custom Fields',
    nameAr: 'التوزيع التلقائي للعملاء والحقول المخصصة',
    description: 'Round-robin lead distribution to sales reps and custom data fields for customer preferences.',
    descriptionAr: 'توزيع استفسارات العملاء تلقائياً على موظفي المبيعات وإضافة حقول بيانات مخصصة.',
    tiers: {
      free: { status: 'locked', label: 'غير متاح', details: 'الاستفسارات تصل إلى رقم واتساب واحد' },
      growth: { status: 'locked', label: 'غير متاح', details: 'إدارة يدوية للمتابعات' },
      pro: { status: 'available', label: 'متاح بالكامل', details: 'توزيع عادل على موظفي المبيعات وتقارير إغلاق الصفقات' },
      enterprise: { status: 'available', label: 'متاح بالكامل + ربط فروع', details: 'توزيع ذكي حسب المحافظة والفرع ونوع السيارة' },
    },
  },
  {
    id: 'multi_branch',
    category: 'crm',
    categoryTitle: 'إدارة العملاء والمبيعات (CRM & Sales Pipeline)',
    name: 'Multi-Branch Management',
    nameAr: 'إدارة الفروع الإقليمية المتعددة',
    description: 'Centralized headquarters view governing regional branches, inventories, and local staff.',
    descriptionAr: 'شاشة مركزية لإدارة عدة فروع ومراكز خدمة وقطع غيار تحت مظلة تجارية واحدة.',
    tiers: {
      free: { status: 'locked', label: 'غير متاح (فرع واحد فقط)', details: 'مخصص لمعرض مستقل منفرد' },
      growth: { status: 'locked', label: 'غير متاح (فرع واحد فقط)', details: 'مخصص لمعرض مستقل منفرد' },
      pro: { status: 'locked', label: 'غير متاح (فرع رئيسي فقط)', details: 'مخصص للمعارض ذات الفرع الواحد' },
      enterprise: { status: 'available', label: 'متاح بالكامل (شبكة فروع)', details: 'ربط الفروع وشبكات الموزعين في شاشة واحدة' },
    },
  },

  // ── 3. Social Media & Broadcast Hub ───────────────────────────────
  {
    id: 'social_accounts',
    category: 'social',
    categoryTitle: 'إدارة المحتوى والتسويق (Social Media Hub)',
    name: 'Connected Social Accounts',
    nameAr: 'الحسابات والقنوات المتصلة',
    description: 'Direct publishing to Facebook pages, Instagram, TikTok, and WhatsApp business channels.',
    descriptionAr: 'قنوات التواصل المسموح بربطها للنشر وجدولة العروض.',
    tiers: {
      free: { status: 'locked', label: '0 حسابات متصلة', details: 'مشاركة يدوية فقط' },
      growth: { status: 'limited', label: '2 حسابات متصلة', details: 'ربط صفحة فيسبوك وإنستغرام' },
      pro: { status: 'available', label: '5 حسابات متصلة', details: 'ربط فيسبوك، إنستغرام، تيك توك، ولينكد إن' },
      enterprise: { status: 'available', label: 'غير محدود', details: 'ربط كافة صفحات وحسابات الفروع المختلفة' },
    },
  },
  {
    id: 'draft_packs',
    category: 'social',
    categoryTitle: 'إدارة المحتوى والتسويق (Social Media Hub)',
    name: 'Social Content Packs & Scheduling',
    nameAr: 'باقات المحتوى التسويقي وجدولة النشر',
    description: 'Ready-to-post car marketing copy, hashtags, and automated posting schedules per month.',
    descriptionAr: 'نماذج منشورات جاهزة وإعلانات مبوبة وجدولة منشورات شهرية.',
    tiers: {
      free: { status: 'limited', label: '4 نماذج شهرياً (بدون جدولة)', details: 'نماذج نصوص تسويقية جاهزة للنسخ اليدوي' },
      growth: { status: 'limited', label: '20 باقة محتوى + 20 منشور مجدول', details: 'جدولة حتى 20 منشوراً شهرياً' },
      pro: { status: 'available', label: 'باقات غير محدودة + 100 منشور مجدول', details: 'جدولة حتى 100 منشور مع مسار موافقة إداري' },
      enterprise: { status: 'available', label: 'غير محدود بالكامل', details: 'جدولة ونشر غير محدود مع إدارة أذونات متعددة' },
    },
  },

  // ── 4. Accounting & Financial Books ───────────────────────────────
  {
    id: 'accounting_books',
    category: 'accounting',
    categoryTitle: 'المحاسبة والمخزون المالي (Accounting & Financial Books)',
    name: 'General Ledger, Installments & Cashflow',
    nameAr: 'دفتر الأستاذ، الأقساط، وعقود البيع',
    description: 'Financial ledger, journal entries, down-payment tracking, and installment contracts.',
    descriptionAr: 'شجرة الحسابات، قيود اليومية، جداول سداد الأقساط، وطباعة عقود البيع القانونية.',
    tiers: {
      free: { status: 'locked', label: 'غير متاح', details: 'الباقة المجانية مخصصة للتواجد الرقمي والواتساب فقط' },
      growth: { status: 'available', label: 'متاح بالكامل أوفلاين', details: 'نظام محاسبي متكامل يعمل أوفلاين بالمعرض' },
      pro: { status: 'available', label: 'متاح بالكامل + صلاحيات محاسب', details: 'فصل صلاحيات المحاسب عن موظفي المبيعات' },
      enterprise: { status: 'available', label: 'متاح بالكامل + مراكز تكلفة', details: 'محاسبة متقدمة مع مراكز تكلفة لكل فرع' },
    },
  },

  // ── 5. Trust, Badges & Verification ───────────────────────────────
  {
    id: 'badge_verification',
    category: 'branding',
    categoryTitle: 'التوثيق والهوية الرسمية (Trust & Badges)',
    name: 'Verified Trust Badge',
    nameAr: 'شارة التوثيق والاعتماد الرسمي',
    description: 'Visual trust badge displayed on showroom cards, listings, and Google search snippets.',
    descriptionAr: 'شارة رسمية تظهر بجوار اسم المعرض وسياراته لترسيخ ثقة المشترين والبنوك.',
    tiers: {
      free: { status: 'available', label: 'معرض مسجل (Registered Dealer)', details: 'شارة خضراء تفيد التسجيل والوجود الحقيقي' },
      growth: { status: 'available', label: 'معرض نامٍ وموثق (Growing Showroom)', details: 'شارة تميز للمعارض النشطة' },
      pro: { status: 'available', label: 'معرض معتمد وموثق ✓ (Verified Showroom)', details: 'شارة ذهبية معتمدة ✓ ترفع ثقة المشترين بنسبة 70%' },
      enterprise: { status: 'available', label: 'وكيل رسمي معتمد ★ (Official Agency)', details: 'شارة النجمة الماسية ★ للتوكيلات والموزعين الرسميين' },
    },
  },
];

export default function AdminPackagesTester() {
  const [selectedTier, setSelectedTier] = useState<VendorTierId>('growth');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [targetBusinessId, setTargetBusinessId] = useState<string>('');
  const [updatingBiz, setUpdatingBiz] = useState(false);
  const [creatingTrial, setCreatingTrial] = useState(false);
  const [cleaningTrials, setCleaningTrials] = useState(false);
  const [trialResult, setTrialResult] = useState<Record<string, any> | null>(null);
  const [notice, setNotice] = useState<string>('');

  // Fetch registered businesses so admin can test switching live showrooms
  useEffect(() => {
    fetch('/api/admin/platform/clients')
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d)) {
          setBusinesses(d);
          if (d.length > 0) setTargetBusinessId(d[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const activeTierConfig: VendorTier = VENDOR_TIERS[selectedTier];

  const filteredModules = filterCategory === 'all'
    ? MODULES_MATRIX
    : MODULES_MATRIX.filter((m) => m.category === filterCategory);

  async function handleApplyTierToShowroom() {
    if (!targetBusinessId) return;
    setUpdatingBiz(true);
    setNotice('');
    try {
      const res = await fetch('/api/admin/tiers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: targetBusinessId,
          tier: selectedTier,
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !data.ok) {
        setNotice(data.error || 'فشل تحديث باقة المعرض');
      } else {
        setNotice(`✓ تم تطبيق باقة (${activeTierConfig.name.ar}) على المعرض بنجاح! يمكنك الآن معاينة موقعه.`);
        // Refresh local list
        setBusinesses((prev) =>
          prev.map((b) => (b.id === targetBusinessId ? { ...b, subscription_tier: selectedTier } : b))
        );
      }
    } catch {
      setNotice('فشل الاتصال بالخادم.');
    } finally {
      setUpdatingBiz(false);
    }
  }

  async function handleCreateTrial() {
    setCreatingTrial(true);
    setTrialResult(null);
    setNotice('');
    try {
      const res = await fetch('/api/trials/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showroomName: `معرض تجربة ${activeTierConfig.name.ar}`,
          tier: selectedTier,
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; trial?: Record<string, any> };
      if (!res.ok || !data.ok || !data.trial) {
        setNotice(data.error || 'فشل إنشاء النسخة التجريبية.');
      } else {
        setTrialResult(data.trial);
        setNotice(`✓ تم إنشاء معرض تجريبي حقيقي بكامل الصلاحيات لمدة 30 يوماً بنجاح!`);
      }
    } catch {
      setNotice('فشل الاتصال بالخادم.');
    } finally {
      setCreatingTrial(false);
    }
  }

  async function handleCleanupTrials() {
    setCleaningTrials(true);
    setNotice('');
    try {
      const res = await fetch('/api/admin/trials/cleanup', { method: 'POST' });
      const data = await res.json() as { ok?: boolean; error?: string; message?: string };
      setNotice(data.message || 'تم تنظيف النسخ التجريبية.');
    } catch {
      setNotice('فشل الاتصال بالخادم.');
    } finally {
      setCleaningTrials(false);
    }
  }

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* ── Breadcrumb & Title ────────────────────────────────────────── */}
      <div>
        <nav className="flex flex-wrap gap-2 text-xs opacity-60 mb-2">
          <Link href="/admin" className="hover:underline">لوحة الإدارة (Admin)</Link>
          <span>/</span>
          <Link href="/admin/platform" className="hover:underline">إدارة المنصة (Platform)</Link>
          <span>/</span>
          <span>مختبر الباقات والموديولات</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/10 dark:border-white/10 pb-5">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
              Platform Admin Inspector & Tier Simulator
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              مختبر الباقات والموديولات (Packages & Modules Inspector)
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-3xl">
              أداة إدارية شاملة للمعاينة الفحص والاختبار المباشر: تتيح لك فحص كل باقة، ومعرفة ما هو متاح ومقيد ومغلق في كل موديول، ومحاكاة تجربة المعارض الحية فوراً على جهازك أو أونلاين.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/packages"
              target="_blank"
              className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/20 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <span>معاينة صفحة الباقات العامة للزوار ↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 1. Interactive Tier Selector ─────────────────────────────── */}
      <section className="bg-white dark:bg-[#11141c] border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
          اختر الباقة للمحاكاة والفحص المباشر (Select Tier to Inspect):
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Free Tier */}
          <button
            onClick={() => setSelectedTier('free')}
            className={`p-5 rounded-2xl border text-right transition-all relative ${
              selectedTier === 'free'
                ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.02]'
                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              {selectedTier === 'free' && <span className="text-[11px] font-bold text-emerald-500">● قيد الفحص الآن</span>}
            </div>
            <h3 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white">1. العضوية المجانية (Free)</h3>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">0 ج.م / شهر</div>
            <div className="text-[11px] text-neutral-500 mt-2">10 سيارات • 3 صور • سحابي فقط • واتساب مباشر</div>
          </button>

          {/* Growth Tier */}
          <button
            onClick={() => setSelectedTier('growth')}
            className={`p-5 rounded-2xl border text-right transition-all relative ${
              selectedTier === 'growth'
                ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 scale-[1.02]'
                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              {selectedTier === 'growth' && <span className="text-[11px] font-bold text-amber-500">● قيد الفحص الآن</span>}
            </div>
            <h3 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white">2. باقة النمو (Growth)</h3>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">اقتصادي مرن</div>
            <div className="text-[11px] text-neutral-500 mt-2">25 سيارة • برنامج كمبيوتر أوفلاين • 2 حساب سوشيال</div>
          </button>

          {/* Pro Tier */}
          <button
            onClick={() => setSelectedTier('pro')}
            className={`p-5 rounded-2xl border text-right transition-all relative ${
              selectedTier === 'pro'
                ? 'bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/10 scale-[1.02]'
                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 hover:border-blue-500/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              {selectedTier === 'pro' && <span className="text-[11px] font-bold text-blue-500">● قيد الفحص الآن</span>}
            </div>
            <h3 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white">3. باقة المعارض المتقدمة (Pro)</h3>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">2,500 ج.م / شهر</div>
            <div className="text-[11px] text-neutral-500 mt-2">50 سيارة • دومين .com مستقل • يوتيوب • 2.5x ظهور</div>
          </button>

          {/* Enterprise Tier */}
          <button
            onClick={() => setSelectedTier('enterprise')}
            className={`p-5 rounded-2xl border text-right transition-all relative ${
              selectedTier === 'enterprise'
                ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10 scale-[1.02]'
                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 hover:border-purple-500/40'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              {selectedTier === 'enterprise' && <span className="text-[11px] font-bold text-purple-500">● قيد الفحص الآن</span>}
            </div>
            <h3 className="font-bold text-sm md:text-base text-neutral-900 dark:text-white">4. باقة التوكيلات (Enterprise)</h3>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">7,500 ج.م / شهر</div>
            <div className="text-[11px] text-neutral-500 mt-2">500 سيارة • شبكة فروع • فيديو مباشر • 5.0x صدارة السوق</div>
          </button>

        </div>
      </section>

      {/* ── 2. Live Showroom Simulation & Quick Override ─────────────── */}
      <section className="bg-gradient-to-r from-red-600/5 via-amber-500/5 to-transparent border border-red-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 block mb-1">
              أداة تطبيق الباقة على معرض حقيقي للمعاينة الفورية:
            </span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              اختبر تأثير باقة ({activeTierConfig.name.ar}) على أي معرض تجريبي مسجل
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              اختر أي معرض من قاعدة البيانات واضغط "تطبيق الباقة فوراً" لتغيير صلاحياته وتجربة شاشاته الحية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {businesses.length > 0 ? (
              <select
                value={targetBusinessId}
                onChange={(e) => setTargetBusinessId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/20 bg-white dark:bg-black text-xs font-bold focus:outline-none focus:border-red-500"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name_ar || b.name} (الباقة الحالية: {b.subscription_tier || 'free'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-neutral-500">جاري تحميل قائمة المعارض...</span>
            )}

            <button
              onClick={handleApplyTierToShowroom}
              disabled={updatingBiz || !targetBusinessId}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {updatingBiz ? 'جاري التطبيق...' : `تطبيق باقة ${activeTierConfig.name.ar} فوراً ✓`}
            </button>

            {targetBusinessId && (
              <a
                href={`/admin/showroom/${targetBusinessId}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/20 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                فتح لوحة المعرض ↗
              </a>
            )}
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            {notice}
          </div>
        )}

        {/* ── 30-Day Real Trial Generator ────────────────────────────── */}
        <div className="mt-6 pt-6 border-t border-red-500/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold text-amber-500 block mb-1">
              ميزة النسخة التجريبية الحقيقية (Real 30-Day Trial Sandbox):
            </span>
            <div className="text-sm font-bold text-neutral-900 dark:text-white">
              توليد معرض تجريبي حقيقي متكامل لمدة 30 يوماً بدون قيود
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              ينشئ معرضاً حقيقياً فوراً مُزوّداً بـ 3 سيارات حقيقية وجميع التراخيص مفعلة، ويتم حذفه تلقائياً بعد 30 يوماً.
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleCreateTrial}
              disabled={creatingTrial}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>🚀</span>
              <span>{creatingTrial ? 'جاري توليد المعرض...' : `توليد نسخة 30 يوماً لباقة ${activeTierConfig.name.ar}`}</span>
            </button>

            <button
              onClick={handleCleanupTrials}
              disabled={cleaningTrials}
              className="px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/20 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1"
            >
              <span>🧹</span>
              <span>{cleaningTrials ? 'جاري التنظيف...' : 'تنظيف وحذف المعارض المنتهية'}</span>
            </button>
          </div>
        </div>

        {/* Trial Created Details Banner */}
        {trialResult && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-black text-sm">
              <span>✓ تم تجهيز النسخة التجريبية الشاملة بنجاح!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold">30 يوماً</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300">
              <div>اسم المعرض: <strong className="text-white">{trialResult.showroomName}</strong></div>
              <div>الباقة المفعلة: <strong className="text-amber-400">{trialResult.tierNameAr}</strong></div>
              <div>تاريخ الانتهاء التلقائي: <strong className="text-white">{trialResult.expiresAt.slice(0, 10)}</strong></div>
              <div>سيريال الأوفلاين: <strong className="text-mono text-white">{trialResult.serial}</strong></div>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={trialResult.publicUrl}
                target="_blank"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                معاينة موقع المعرض للجمهور ↗
              </a>
              <a
                href={trialResult.adminUrl}
                target="_blank"
                className="px-3.5 py-1.5 rounded-lg border border-white/20 text-white font-bold text-xs hover:bg-white/10"
              >
                فتح لوحة إدارة المعرض التجريبي ↗
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ── 3. Modules & Features Notification Grid ─────────────────── */}
      <section className="space-y-4">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'جميع الموديولات (All Modules)' },
              { id: 'minisite', label: 'معرض الويب والماركت بليس' },
              { id: 'crm', label: 'المبيعات والـ CRM' },
              { id: 'social', label: 'التسويق والسوشيال ميديا' },
              { id: 'accounting', label: 'المحاسبة ودفاتر الـ ERP' },
              { id: 'branding', label: 'التوثيق والشارات' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterCategory === tab.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500">
            فحص <strong>{filteredModules.length}</strong> خاصية وموديول تحت باقة: <strong className="text-red-500">{activeTierConfig.name.ar}</strong>
          </div>
        </div>

        {/* Feature Cards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((module) => {
            const tierState = module.tiers[selectedTier];
            const isAvailable = tierState.status === 'available';
            const isLimited = tierState.status === 'limited';
            const isLocked = tierState.status === 'locked';

            return (
              <article
                key={module.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isAvailable
                    ? 'bg-white dark:bg-[#11141c] border-emerald-500/30'
                    : isLimited
                    ? 'bg-white dark:bg-[#11141c] border-amber-500/30'
                    : 'bg-neutral-50 dark:bg-[#0c0e14] border-black/5 dark:border-white/5 opacity-70'
                }`}
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-neutral-500">
                    {module.categoryTitle}
                  </span>

                  {/* Status Indicator Badge */}
                  {isAvailable && (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ✓ متاح بالكامل (Full Access)
                    </span>
                  )}
                  {isLimited && (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      ⚠️ محدد بحصة (Quota Limited)
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      🔒 غير متاح (يتطلب ترقية)
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white mb-1">
                  {module.nameAr}
                </h4>
                <div className="text-xs text-neutral-500 mb-3">{module.descriptionAr}</div>

                {/* Current Tier Allowance Box */}
                <div className={`p-3 rounded-xl border text-xs ${
                  isAvailable
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : isLimited
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300'
                    : 'bg-red-500/5 border-red-500/20 text-red-800 dark:text-red-400'
                }`}>
                  <div className="font-bold mb-0.5">{tierState.label}</div>
                  <div className="opacity-80 text-[11px]">{tierState.details}</div>
                </div>

                {/* Compare all 4 tiers micro-bar */}
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 grid grid-cols-4 gap-1 text-[10px] text-center">
                  <div className={`p-1 rounded ${selectedTier === 'free' ? 'font-bold bg-black/10 dark:bg-white/10' : 'opacity-60'}`}>
                    <div>مجانية</div>
                    <div className="font-mono mt-0.5">{module.tiers.free.label.split(' ')[0]}</div>
                  </div>
                  <div className={`p-1 rounded ${selectedTier === 'growth' ? 'font-bold bg-black/10 dark:bg-white/10' : 'opacity-60'}`}>
                    <div>نمو</div>
                    <div className="font-mono mt-0.5">{module.tiers.growth.label.split(' ')[0]}</div>
                  </div>
                  <div className={`p-1 rounded ${selectedTier === 'pro' ? 'font-bold bg-black/10 dark:bg-white/10' : 'opacity-60'}`}>
                    <div>Pro</div>
                    <div className="font-mono mt-0.5">{module.tiers.pro.label.split(' ')[0]}</div>
                  </div>
                  <div className={`p-1 rounded ${selectedTier === 'enterprise' ? 'font-bold bg-black/10 dark:bg-white/10' : 'opacity-60'}`}>
                    <div>مؤسسات</div>
                    <div className="font-mono mt-0.5">{module.tiers.enterprise.label.split(' ')[0]}</div>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

      </section>

    </div>
  );
}
