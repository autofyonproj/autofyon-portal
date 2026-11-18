export interface CategoryDefinition {
  key: string;
  label_ar: string;
  label_en: string;
  icon: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  { key: 'all', label_ar: 'كل الأنشطة', label_en: 'All Sectors', icon: '🏢' },
  { key: 'showroom', label_ar: 'معارض وتجار السيارات', label_en: 'Showrooms & Dealers', icon: '🚗' },
  { key: 'authorized_agent', label_ar: 'وكلاء وموزعون معتمدون', label_en: 'Authorized Agents & Distributors', icon: '🛡️' },
  { key: 'service_center', label_ar: 'مراكز صيانة وخدمة', label_en: 'Service & Maintenance Centers', icon: '🔧' },
  { key: 'parts_supplier', label_ar: 'قطع غيار واكسسوارات', label_en: 'Auto Spare Parts & Accessories', icon: '⚙️' },
  { key: 'rental_company', label_ar: 'تأجير وليموزين', label_en: 'Car Rental & Limousine', icon: '🔑' },
  { key: 'finance_company', label_ar: 'بنوك وتمويل وتقسيط', label_en: 'Auto Finance & Banks', icon: '💳' },
  { key: 'insurer', label_ar: 'شركات تأمين سيارات', label_en: 'Auto Insurance Companies', icon: '📋' },
];

export interface GovernorateDefinition {
  ar: string;
  en: string;
}

export const GOVERNORATES: GovernorateDefinition[] = [
  { ar: 'كل المحافظات', en: 'All Governorates' },
  { ar: 'القاهرة', en: 'Cairo' },
  { ar: 'الجيزة', en: 'Giza' },
  { ar: 'الإسكندرية', en: 'Alexandria' },
  { ar: 'الشرقية', en: 'Sharqia' },
  { ar: 'الغربية', en: 'Gharbia' },
  { ar: 'الدقهلية', en: 'Dakahlia' },
  { ar: 'القليوبية', en: 'Qalyubia' },
  { ar: 'المنوفية', en: 'Monufia' },
  { ar: 'البحيرة', en: 'Beheira' },
  { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  { ar: 'دمياط', en: 'Damietta' },
  { ar: 'بورسعيد', en: 'Port Said' },
  { ar: 'الإسماعيلية', en: 'Ismailia' },
  { ar: 'السويس', en: 'Suez' },
  { ar: 'بني سويف', en: 'Beni Suef' },
  { ar: 'المنيا', en: 'Minya' },
  { ar: 'أسيوط', en: 'Asyut' },
  { ar: 'سوهاج', en: 'Sohag' },
  { ar: 'قنا', en: 'Qena' },
  { ar: 'الأقصر', en: 'Luxor' },
  { ar: 'أسوان', en: 'Aswan' },
  { ar: 'البحر الأحمر', en: 'Red Sea' },
  { ar: 'مطروح', en: 'Matrouh' },
];

export function translateGov(govAr: string, locale: 'ar' | 'en'): string {
  if (locale === 'ar') return govAr;
  const match = GOVERNORATES.find((g) => g.ar === govAr);
  return match ? match.en : govAr;
}

export function translateCategory(key: string, locale: 'ar' | 'en'): { label: string; icon: string } {
  const match = CATEGORIES.find((c) => c.key === key);
  if (!match) return { label: key, icon: '🏢' };
  return {
    label: locale === 'ar' ? match.label_ar : match.label_en,
    icon: match.icon,
  };
}

export const DICTIONARY = {
  ar: {
    brandName: 'أوتوفاي أون',
    brandNameEn: 'AutoFy On',
    domain: 'autofyon.com',
    pageTitle: 'دليل معارض وتوكيلات السيارات في مصر | أوتوفاي أون AutoFy On',
    metaDesc: 'دليل قطاع السيارات الأكبر في مصر من منصة أوتوفاي أون: أكثر من 2,800 معرض سيارات، وكيل معتمد، ومراكز صيانة وتمويل مع أرقام الواتساب والاتصال.',
    headerBadge: '🏛️ الدليل الموحد لقطاع تجارة وصناعة السيارات في مصر',
    headerTitle: 'دليل معارض ووكلاء ومراكز السيارات',
    headerSubtitle: 'قاعدة بيانات معتمدة تضم أكثر من 2,800 كِيان سيارات في مصر تشمل المعارض، الوكلاء الرسميين، مراكز الصيانة، وشركات قطع الغيار والتمويل برعاية منصة أوتوفاي أون.',
    vcfBadge: '📲 ميزة الموبايل والواتساب • حفظ فوري',
    vcfTitle: 'حفظ جميع جهات الاتصال (2,800+ رقم واتساب وهاتف) في هاتفك بضغطة واحدة',
    vcfDesc: 'قم بتحميل ملف جهات الاتصال الموحد (VCF) وافتحه من هاتفك، سيتم إضافة جميع أرقام المعارض والوكلاء لدفتر الهاتف والواتساب باسم "AutoFy On".',
    vcfButton: 'تحميل ملف جهات الاتصال (VCF)',
    searchPlaceholder: 'ابحث باسم المعرض، الماركة، المدينة، أو رقم الهاتف...',
    allGovs: 'كل المحافظات',
    verifiedBadge: 'معتمد لدى أوتوفاي أون',
    prospectBadge: 'مؤهل للباقة المجانية',
    claimButton: 'تفعيل الباقة المجانية',
    viewPage: 'الموقع التسويقي',
    viewStudio: 'استوديو ميديا مانجر',
    whatsapp: 'واتساب',
    call: 'اتصال',
    specializedIn: 'متخصص في',
    contactPerson: 'مسؤول الاتصال',
    loadMore: 'عرض المزيد',
    remaining: 'كيان متبقي',
    noResults: 'لا توجد نتائج مطابقة لبحثك',
    noResultsHint: 'جرّب تعديل كلمات البحث أو اختيار محافظة أو نشاط آخر.',
    resetFilters: 'إعادة ضبط التصفية',
    switchLang: 'English 🇬🇧',
    switchLangHref: '/en/dealers',
    showingCount: 'عرض',
    of: 'من أصل',
    entities: 'كيان سيارات',
    freeOfferNotice: 'هل تملك هذا المعرض؟ انقر لتفعيل موقعك واستوديو الميديا مجاناً',
  },
  en: {
    brandName: 'AutoFy On',
    brandNameEn: 'AutoFy On',
    domain: 'autofyon.com',
    pageTitle: 'Egypt Car Dealerships & Agencies Directory | AutoFy On',
    metaDesc: 'Egypt’s premier automotive directory powered by AutoFy On: Explore 2,800+ verified showrooms, official distributors, service centers, and auto lenders.',
    headerBadge: '🏛️ Unified Egyptian Automotive Directory & Dealership Network',
    headerTitle: 'Car Showrooms, Agencies & Auto Service Directory',
    headerSubtitle: 'Verified database of over 2,800 automotive businesses across Egypt: car dealerships, official distributors, service centers, auto parts suppliers, and auto lenders on AutoFy On.',
    vcfBadge: '📲 Mobile & WhatsApp Sync • 1-Tap Save',
    vcfTitle: 'Save All 2,800+ Dealership WhatsApp & Phone Numbers in One Tap',
    vcfDesc: 'Download the unified contact file (VCF) to import all Egyptian showrooms, official agencies, and finance providers directly into your phone book under "AutoFy On".',
    vcfButton: 'Download Contacts File (VCF)',
    searchPlaceholder: 'Search by showroom name, car brand, city, or phone...',
    allGovs: 'All Governorates',
    verifiedBadge: 'AutoFy On Verified Partner',
    prospectBadge: 'Free Package Eligible',
    claimButton: 'Claim Free Package',
    viewPage: 'Landing Page',
    viewStudio: 'Media Manager',
    whatsapp: 'WhatsApp',
    call: 'Call',
    specializedIn: 'Specialized in',
    contactPerson: 'Contact Person',
    loadMore: 'Load More',
    remaining: 'remaining entities',
    noResults: 'No dealerships match your query',
    noResultsHint: 'Try adjusting your search query, or select another governorate or sector.',
    resetFilters: 'Reset Filters',
    switchLang: 'العربية 🇪🇬',
    switchLangHref: '/dealers',
    showingCount: 'Showing',
    of: 'of',
    entities: 'automotive entities',
    freeOfferNotice: 'Do you own this business? Click to activate your free landing page & media studio.',
  },
} as const;
