/**
 * Template & Tier Permission Registry.
 *
 * Provides a matrix of templates (Visual Themes & Layouts)
 * and vendor subscription tiers (Quotas, Features, Privileges).
 */

export interface MinisiteTemplate {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  theme: 'classical_gold' | 'obsidian_dark' | 'monochrome_minimal' | 'sport_carbon';
  allowedShelves: string[];
  features: {
    heroKenBurns: boolean;
    videoWalkarounds: boolean;
    financeCalculator: boolean;
    customDomain: boolean;
    customColors: boolean;
  };
}

export type VendorTierId = 'free' | 'growth' | 'pro' | 'enterprise';

export interface VendorCrmEntitlements {
  pageConnected: true;
  standalone: boolean;
  maxPipelines: number | null;
  customFields: boolean;
  leadAssignment: boolean;
  workflowAutomation: boolean;
  multiBranch: boolean;
  advancedReporting: boolean;
}

export interface VendorSocialEntitlements {
  maxConnectedAccounts: number | null;
  draftPacksPerMonth: number | null;
  scheduledPostsPerMonth: number | null;
  contentCalendar: boolean;
  approvalWorkflow: boolean;
  multiBranch: boolean;
}

export interface VendorTier {
  id: VendorTierId;
  name: { en: string; ar: string };
  priceEgpMonthly: number | null;
  maxActiveCars: number;
  maxHeroSlides: number;
  allowedSlideMediaTypes: ('image' | 'youtube' | 'video')[];
  allowedTemplates: string[];
  badge: { en: string; ar: string };
  canUseCustomDomain: boolean;
  leadDirectWhatsApp: boolean;
  prioritySearchBoost: number; // multiplier for marketplace search
  crm: VendorCrmEntitlements;
  social: VendorSocialEntitlements;
}

export const MINISITE_TEMPLATES: Record<string, MinisiteTemplate> = {
  template_classical_luxury: {
    id: 'template_classical_luxury',
    name: { en: 'Classical Alabaster & Gold', ar: 'الألاباستر الملكي والذهب' },
    description: {
      en: 'High-contrast alabaster light theme tailored for luxury marques (Mercedes, Porsche, Bentley).',
      ar: 'تصميم ملكي فاتح متباين عالي الدقة للعلامات الفارهة.',
    },
    theme: 'classical_gold',
    allowedShelves: ['sec_1_identity', 'sec_auto_specs', 'sec_auto_inventory', 'sec_auto_showroom'],
    features: {
      heroKenBurns: true,
      videoWalkarounds: true,
      financeCalculator: true,
      customDomain: true,
      customColors: false,
    },
  },
  template_obsidian_night: {
    id: 'template_obsidian_night',
    name: { en: 'Obsidian Atelier Dark', ar: 'أتيليه الأوبسيديان الليلي الفاخر' },
    description: {
      en: 'Deep piano-black showroom aesthetic with specular gold accents.',
      ar: 'تصميم ليلي أسود بيانو عميق مع لمسات ذهبية متألقة.',
    },
    theme: 'obsidian_dark',
    allowedShelves: ['sec_1_identity', 'sec_auto_specs', 'sec_auto_inventory', 'sec_auto_showroom', 'sec_auto_exterior', 'sec_auto_interior'],
    features: {
      heroKenBurns: true,
      videoWalkarounds: true,
      financeCalculator: true,
      customDomain: true,
      customColors: true,
    },
  },
  template_standard_free: {
    id: 'template_standard_free',
    name: { en: 'Standard Starter Showroom', ar: 'قالب المعرض القياسي المجاني' },
    description: {
      en: 'Clean, fast-loading marketplace template for all registered dealers.',
      ar: 'قالب سريع ومنسق وواضح لكافة المعارض المسجلة مجاناً.',
    },
    theme: 'monochrome_minimal',
    allowedShelves: ['sec_1_identity', 'sec_auto_inventory'],
    features: {
      heroKenBurns: false,
      videoWalkarounds: false,
      financeCalculator: true,
      customDomain: false,
      customColors: false,
    },
  },
};

export const VENDOR_TIERS: Record<VendorTierId, VendorTier> = {
  free: {
    id: 'free',
    name: { en: 'Free Starter', ar: 'العضوية المجانية' },
    priceEgpMonthly: 0,
    maxActiveCars: 10,
    maxHeroSlides: 3,
    allowedSlideMediaTypes: ['image'],
    allowedTemplates: ['template_standard_free', 'template_classical_luxury'],
    badge: { en: 'Registered Dealer', ar: 'معرض مسجل' },
    canUseCustomDomain: false,
    leadDirectWhatsApp: true,
    prioritySearchBoost: 1.0,
    crm: {
      pageConnected: true,
      standalone: false,
      maxPipelines: 1,
      customFields: false,
      leadAssignment: false,
      workflowAutomation: false,
      multiBranch: false,
      advancedReporting: false,
    },
    social: {
      maxConnectedAccounts: 0,
      draftPacksPerMonth: 4,
      scheduledPostsPerMonth: 0,
      contentCalendar: false,
      approvalWorkflow: false,
      multiBranch: false,
    },
  },
  growth: {
    id: 'growth',
    name: { en: 'Growth', ar: 'النمو' },
    priceEgpMonthly: null,
    maxActiveCars: 25,
    maxHeroSlides: 6,
    allowedSlideMediaTypes: ['image'],
    allowedTemplates: ['template_standard_free', 'template_classical_luxury'],
    badge: { en: 'Growing Showroom', ar: 'معرض نامٍ' },
    canUseCustomDomain: false,
    leadDirectWhatsApp: true,
    prioritySearchBoost: 1.0,
    crm: {
      pageConnected: true,
      standalone: true,
      maxPipelines: 1,
      customFields: false,
      leadAssignment: false,
      workflowAutomation: false,
      multiBranch: false,
      advancedReporting: false,
    },
    social: {
      maxConnectedAccounts: 2,
      draftPacksPerMonth: 20,
      scheduledPostsPerMonth: 20,
      contentCalendar: true,
      approvalWorkflow: false,
      multiBranch: false,
    },
  },
  pro: {
    id: 'pro',
    name: { en: 'Pro Dealership', ar: 'عضوية المعارض المتقدمة (Pro)' },
    priceEgpMonthly: 2500,
    maxActiveCars: 50,
    maxHeroSlides: 10,
    allowedSlideMediaTypes: ['image', 'youtube'],
    allowedTemplates: ['template_standard_free', 'template_classical_luxury', 'template_obsidian_night'],
    badge: { en: 'Verified Showroom', ar: 'معرض معتمد وموثق ✓' },
    canUseCustomDomain: true,
    leadDirectWhatsApp: true,
    prioritySearchBoost: 2.5,
    crm: {
      pageConnected: true,
      standalone: true,
      maxPipelines: null,
      customFields: true,
      leadAssignment: true,
      workflowAutomation: true,
      multiBranch: false,
      advancedReporting: true,
    },
    social: {
      maxConnectedAccounts: 5,
      draftPacksPerMonth: null,
      scheduledPostsPerMonth: 100,
      contentCalendar: true,
      approvalWorkflow: true,
      multiBranch: false,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: { en: 'Official Agency / Enterprise', ar: 'عضوية التوكيلات والمؤسسات الكبرى' },
    priceEgpMonthly: 7500,
    maxActiveCars: 500,
    maxHeroSlides: 50,
    allowedSlideMediaTypes: ['image', 'youtube', 'video'],
    allowedTemplates: ['template_standard_free', 'template_classical_luxury', 'template_obsidian_night'],
    badge: { en: 'Official Agency', ar: 'وكيل رسمي معتمد ★' },
    canUseCustomDomain: true,
    leadDirectWhatsApp: true,
    prioritySearchBoost: 5.0,
    crm: {
      pageConnected: true,
      standalone: true,
      maxPipelines: null,
      customFields: true,
      leadAssignment: true,
      workflowAutomation: true,
      multiBranch: true,
      advancedReporting: true,
    },
    social: {
      maxConnectedAccounts: null,
      draftPacksPerMonth: null,
      scheduledPostsPerMonth: null,
      contentCalendar: true,
      approvalWorkflow: true,
      multiBranch: true,
    },
  },
};

export function isVendorTierId(value: unknown): value is VendorTierId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(VENDOR_TIERS, value);
}

export function getVendorTier(tierId: string | null | undefined): VendorTier {
  return tierId && isVendorTierId(tierId) ? VENDOR_TIERS[tierId] : VENDOR_TIERS.free;
}

/**
 * Checks whether a business with given tier has permission to use a specific template or feature.
 */
export function canVendorUseTemplate(tierId: string, templateId: string): boolean {
  const tier = getVendorTier(tierId);
  return tier.allowedTemplates.includes(templateId);
}

export function canVendorUseCustomDomain(tierId: string): boolean {
  const tier = getVendorTier(tierId);
  return tier.canUseCustomDomain;
}

export function getVendorSlideLimit(tierId: string): number {
  const tier = getVendorTier(tierId);
  return tier.maxHeroSlides;
}

export function canVendorUseSlideType(tierId: string, mediaType: 'image' | 'youtube' | 'video'): boolean {
  const tier = getVendorTier(tierId);
  return tier.allowedSlideMediaTypes.includes(mediaType);
}
