/**
 * Vendor Business Types Registry
 *
 * Single source of truth for all 15 automotive vendor kinds that are
 * vendor_claimable=1. Each entry carries:
 *  - Arabic/English labels for UI
 *  - Icon emoji
 *  - Which parent group it belongs to (auto_sales | auto_finance | auto_aftermarket)
 *  - Tailored WhatsApp CTA text for the public minisite landing page
 *  - Tailored form placeholder / helper text for the registration modal
 *  - Category key used in vendor_prospects records
 */

export interface VendorBusinessTypeConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  parentGroup: 'auto_sales' | 'auto_finance' | 'auto_aftermarket';
  icon: string;
  /** Short description shown in the registration type picker */
  descAr: string;
  descEn: string;
  /** Placeholder text for the business-name input in the request modal */
  namePlaceholderAr: string;
  /** Label override for the business-name field in the request modal */
  nameLabelAr: string;
  /** WhatsApp CTA button text shown on the vendor's public landing page */
  whatsappCtaAr: string;
  whatsappCtaEn: string;
  /** Pre-filled WhatsApp opening message template (use {name} for showroom name) */
  whatsappMsgAr: string;
  whatsappMsgEn: string;
  /** category_key stored in vendor_prospects */
  categoryKey: string;
  /** original_category stored in vendor_prospects */
  originalCategoryAr: string;
  /** Whether identity verification is required (free tier anti-squatting) */
  requiresOwnershipProof: boolean;
}

export const VENDOR_BUSINESS_TYPES: VendorBusinessTypeConfig[] = [
  // ── AUTO SALES ─────────────────────────────────────────────────────────────
  {
    id: 'showroom',
    nameAr: 'معرض سيارات',
    nameEn: 'Car Showroom',
    parentGroup: 'auto_sales',
    icon: '🚗',
    descAr: 'معرض بيع سيارات جديدة أو مستعملة',
    descEn: 'New or used car dealership',
    namePlaceholderAr: 'مثال: معرض الأهرام موتورز',
    nameLabelAr: 'اسم المعرض *',
    whatsappCtaAr: 'استفسر عن سيارة أو اطلب معاينة',
    whatsappCtaEn: 'Enquire About a Car',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن سيارة.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about a car.',
    categoryKey: 'showroom',
    originalCategoryAr: 'معرض سيارات',
    requiresOwnershipProof: true,
  },
  {
    id: 'main_agency',
    nameAr: 'وكيل رسمي / توكيل رئيسي',
    nameEn: 'Main Agency / Official Agent',
    parentGroup: 'auto_sales',
    icon: '🏢',
    descAr: 'التوكيلات الرسمية لماركة سيارة واحدة أو أكثر',
    descEn: 'Official franchise agent for one or more car brands',
    namePlaceholderAr: 'مثال: توكيلات الجميح لسيارات تويوتا',
    nameLabelAr: 'اسم التوكيل أو الوكالة *',
    whatsappCtaAr: 'استفسر عن سيارة جديدة أو عرض توكيل',
    whatsappCtaEn: 'Enquire About New Car / Agency Offer',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن سياراتكم وعروض الوكالة.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about your vehicles and agency offers.',
    categoryKey: 'main_agency',
    originalCategoryAr: 'وكيل رسمي',
    requiresOwnershipProof: true,
  },
  {
    id: 'distributor',
    nameAr: 'موزع / مستورد',
    nameEn: 'Distributor / Importer',
    parentGroup: 'auto_sales',
    icon: '🏭',
    descAr: 'موزعون ومستوردون رسميون للسيارات والمركبات',
    descEn: 'Official vehicle distributors and importers',
    namePlaceholderAr: 'مثال: شركة كونكورد للاستيراد والتوزيع',
    nameLabelAr: 'اسم الشركة الموزعة *',
    whatsappCtaAr: 'استفسر عن الأسعار والتوزيع',
    whatsappCtaEn: 'Enquire About Pricing & Distribution',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن أسعار ومتطلبات التوزيع.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about pricing and distribution.',
    categoryKey: 'distributor',
    originalCategoryAr: 'موزع سيارات',
    requiresOwnershipProof: true,
  },
  {
    id: 'agent_broker',
    nameAr: 'وسيط / سمسار سيارات',
    nameEn: 'Agent / Car Broker',
    parentGroup: 'auto_sales',
    icon: '🤝',
    descAr: 'وسطاء وسماسرة بيع وشراء السيارات',
    descEn: 'Licensed car brokers and agents',
    namePlaceholderAr: 'مثال: بيكس أوتو للوساطة',
    nameLabelAr: 'اسم مكتب الوساطة *',
    whatsappCtaAr: 'تواصل مع الوسيط للحجز والشراء',
    whatsappCtaEn: 'Contact Agent for Purchase',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في مساعدتي لإيجاد سيارة مناسبة.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like help finding a suitable car.',
    categoryKey: 'agent_broker',
    originalCategoryAr: 'وسيط سيارات',
    requiresOwnershipProof: false,
  },
  {
    id: 'used_car_dealer',
    nameAr: 'تاجر سيارات مستعملة',
    nameEn: 'Used-Car Dealer',
    parentGroup: 'auto_sales',
    icon: '🔄',
    descAr: 'تجار متخصصون في بيع وشراء السيارات المستعملة',
    descEn: 'Specialists in pre-owned vehicle sales',
    namePlaceholderAr: 'مثال: معرض النيل للسيارات المستعملة',
    nameLabelAr: 'اسم معرض المستعملة *',
    whatsappCtaAr: 'استفسر عن سيارة مستعملة أو عرض بيع سيارتك',
    whatsappCtaEn: 'Enquire or Sell Your Car',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن سيارة مستعملة.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about a used car.',
    categoryKey: 'used_car_dealer',
    originalCategoryAr: 'تاجر مستعملة',
    requiresOwnershipProof: true,
  },

  // ── AUTO FINANCE ───────────────────────────────────────────────────────────
  {
    id: 'finance_bank',
    nameAr: 'بنك / تمويل سيارات',
    nameEn: 'Bank / Auto Finance',
    parentGroup: 'auto_finance',
    icon: '🏦',
    descAr: 'بنوك وشركات متخصصة في تمويل واقتصاد السيارات',
    descEn: 'Banks and companies specialising in auto financing',
    namePlaceholderAr: 'مثال: بنك مصر — قطاع تمويل السيارات',
    nameLabelAr: 'اسم البنك أو جهة التمويل *',
    whatsappCtaAr: 'احسب قسطك الشهري واعرف شروط التمويل',
    whatsappCtaEn: 'Calculate Monthly Instalment',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن شروط وبرامج تمويل السيارات.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about your auto finance programmes.',
    categoryKey: 'finance_bank',
    originalCategoryAr: 'بنك تمويل سيارات',
    requiresOwnershipProof: true,
  },
  {
    id: 'leasing_company',
    nameAr: 'شركة تأجير تمويلي',
    nameEn: 'Leasing Company',
    parentGroup: 'auto_finance',
    icon: '📋',
    descAr: 'شركات التأجير التمويلي وخدمات الاشتراك بالسيارة',
    descEn: 'Vehicle leasing and subscription services',
    namePlaceholderAr: 'مثال: إيجار أوتو إيجيبت',
    nameLabelAr: 'اسم شركة التأجير *',
    whatsappCtaAr: 'استفسر عن شروط وعروض التأجير التمويلي',
    whatsappCtaEn: 'Enquire About Leasing Terms',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن شروط التأجير التمويلي للسيارات.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about vehicle leasing terms.',
    categoryKey: 'leasing_company',
    originalCategoryAr: 'تأجير تمويلي',
    requiresOwnershipProof: true,
  },
  {
    id: 'insurance_company',
    nameAr: 'شركة تأمين سيارات',
    nameEn: 'Car Insurance Company',
    parentGroup: 'auto_finance',
    icon: '🛡️',
    descAr: 'شركات التأمين الشامل والتكميلي على السيارات',
    descEn: 'Comprehensive and third-party vehicle insurance',
    namePlaceholderAr: 'مثال: مصر للتأمين — فرع السيارات',
    nameLabelAr: 'اسم شركة التأمين *',
    whatsappCtaAr: 'احصل على عرض سعر تأمين فوري',
    whatsappCtaEn: 'Get Instant Insurance Quote',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الحصول على عرض سعر تأمين شامل على سيارتي.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to get a comprehensive car insurance quote.',
    categoryKey: 'insurance_company',
    originalCategoryAr: 'تأمين سيارات',
    requiresOwnershipProof: true,
  },

  // ── AUTO AFTERMARKET ───────────────────────────────────────────────────────
  {
    id: 'service_center',
    nameAr: 'مركز صيانة وخدمة سيارات',
    nameEn: 'Car Service & Maintenance Center',
    parentGroup: 'auto_aftermarket',
    icon: '🔧',
    descAr: 'مراكز الصيانة الدورية، الكهرباء، المكيفات، والميكانيكا',
    descEn: 'Full service centres for maintenance, electrics and mechanical repairs',
    namePlaceholderAr: 'مثال: مركز الصيادي لصيانة السيارات',
    nameLabelAr: 'اسم مركز الصيانة *',
    whatsappCtaAr: 'احجز موعد صيانة وفحص كمبيوتر',
    whatsappCtaEn: 'Book a Service Appointment',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في حجز موعد لصيانة سيارتي.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to book a vehicle service appointment.',
    categoryKey: 'service_center',
    originalCategoryAr: 'مركز صيانة سيارات',
    requiresOwnershipProof: false,
  },
  {
    id: 'spare_parts',
    nameAr: 'تاجر / مستودع قطع غيار',
    nameEn: 'Spare Parts Shop / Warehouse',
    parentGroup: 'auto_aftermarket',
    icon: '⚙️',
    descAr: 'محلات ومستودعات قطع غيار أصلية وبديلة وكماليات',
    descEn: 'OEM and aftermarket spare parts retailers and wholesalers',
    namePlaceholderAr: 'مثال: مستودع الحرية لقطع الغيار',
    nameLabelAr: 'اسم المحل أو المستودع *',
    whatsappCtaAr: 'استعلم عن توافر وسعر قطعة الغيار',
    whatsappCtaEn: 'Ask About Part Availability & Price',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في الاستفسار عن توافر وسعر قطعة غيار لسيارتي.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to enquire about a spare part for my vehicle.',
    categoryKey: 'spare_parts',
    originalCategoryAr: 'قطع غيار سيارات',
    requiresOwnershipProof: false,
  },
  {
    id: 'accessories_detailing',
    nameAr: 'مركز كماليات وعناية بالسيارات',
    nameEn: 'Car Accessories & Detailing Center',
    parentGroup: 'auto_aftermarket',
    icon: '✨',
    descAr: 'مراكز الديتيلينج، النانو سيراميك، الكماليات، والتلميع الاحترافي',
    descEn: 'Professional detailing, ceramic coating, accessories and car care',
    namePlaceholderAr: 'مثال: بريستيج كار كير ديتيلينج',
    nameLabelAr: 'اسم مركز العناية بالسيارات *',
    whatsappCtaAr: 'احجز جلسة عناية وتلميع احترافية',
    whatsappCtaEn: 'Book a Detailing Session',
    whatsappMsgAr: 'السلام عليكم، زرت صفحة {name} على أوتوفيون وأرغب في حجز جلسة عناية وتلميع احترافية.',
    whatsappMsgEn: 'Hello, I visited {name} on AutoFyon and would like to book a professional detailing session.',
    categoryKey: 'accessories_detailing',
    originalCategoryAr: 'كماليات وعناية بالسيارات',
    requiresOwnershipProof: false,
  },
];

/** Grouped by parent sector for the registration UI */
export const VENDOR_TYPE_GROUPS = [
  {
    groupId: 'auto_sales',
    groupNameAr: '🚗 معارض وتوكيلات السيارات',
    groupNameEn: '🚗 Car Sales & Agencies',
    types: VENDOR_BUSINESS_TYPES.filter((t) => t.parentGroup === 'auto_sales'),
  },
  {
    groupId: 'auto_finance',
    groupNameAr: '🏦 التمويل والتأمين',
    groupNameEn: '🏦 Finance & Insurance',
    types: VENDOR_BUSINESS_TYPES.filter((t) => t.parentGroup === 'auto_finance'),
  },
  {
    groupId: 'auto_aftermarket',
    groupNameAr: '🔧 الصيانة والخدمات وقطع الغيار',
    groupNameEn: '🔧 Service, Parts & Aftermarket',
    types: VENDOR_BUSINESS_TYPES.filter((t) => t.parentGroup === 'auto_aftermarket'),
  },
];

export function getVendorTypeConfig(typeId: string): VendorBusinessTypeConfig | undefined {
  return VENDOR_BUSINESS_TYPES.find((t) => t.id === typeId);
}

/** Build the WhatsApp CTA URL for a vendor's public landing page */
export function buildWhatsAppCtaUrl(
  whatsappNumber: string,
  typeId: string,
  businessName: string,
  locale: 'ar' | 'en' = 'ar',
): string {
  const config = getVendorTypeConfig(typeId);
  if (!config || !whatsappNumber) return '';

  const msgTemplate = locale === 'ar' ? config.whatsappMsgAr : config.whatsappMsgEn;
  const msg = msgTemplate.replace(/\{name\}/g, businessName);
  const digits = whatsappNumber.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? `20${digits.slice(1)}` : digits;
  return `https://wa.me/${e164}?text=${encodeURIComponent(msg)}`;
}

/** CTA button label for the vendor's public landing page */
export function getWhatsAppCtaLabel(typeId: string, locale: 'ar' | 'en' = 'ar'): string {
  const config = getVendorTypeConfig(typeId);
  if (!config) return locale === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact via WhatsApp';
  return locale === 'ar' ? config.whatsappCtaAr : config.whatsappCtaEn;
}
