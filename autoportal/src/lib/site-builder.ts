import { query, queryOne } from '@/lib/db';
import { validateUnitSocialLinks, type UnitSocialLinks } from '@/lib/social-links';

export type SiteTemplateId = 'editorial' | 'showroom' | 'minimal';
export type SiteTargetType = 'business' | 'unit';

export interface SiteTemplate {
  id: SiteTemplateId;
  name: string;
  description: string;
  audience: 'both';
  accentColor: string;
  backgroundColor: string;
}

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: 'editorial',
    name: 'Editorial Gold',
    description: 'Premium editorial layout with a gold accent.',
    audience: 'both',
    accentColor: '#b28a45',
    backgroundColor: '#f7f4ed',
  },
  {
    id: 'showroom',
    name: 'Showroom Spotlight',
    description: 'A bold, media-led layout for vendor and vehicle pages.',
    audience: 'both',
    accentColor: '#9b7131',
    backgroundColor: '#f1eadb',
  },
  {
    id: 'minimal',
    name: 'Modern Minimal',
    description: 'A quiet, clean layout that puts the published content first.',
    audience: 'both',
    accentColor: '#45413a',
    backgroundColor: '#fbfaf7',
  },
];

export interface SiteProfile {
  templateId: SiteTemplateId;
  layout: SiteTemplateId;
  logoUrl: string | null;
  accentColor: string;
  backgroundColor: string;
  socialLinks: UnitSocialLinks;
}

export interface CustomSiteInventoryOptions {
  showYear: boolean;
  showPrice: boolean;
  showAvailability: boolean;
  showMileage: boolean;
  showAutofyonDetailsLink: boolean;
}

export interface CustomSiteProfile {
  templateId: SiteTemplateId;
  inventoryOptions: CustomSiteInventoryOptions;
  overrideOptions: CustomSiteOverrideField[];
}

export const CUSTOM_SITE_OVERRIDE_FIELDS = [
  'price',
  'availability',
  'promotionalCopy',
  'specifications',
  'media',
] as const;

export type CustomSiteOverrideField = typeof CUSTOM_SITE_OVERRIDE_FIELDS[number];

export interface CustomSiteVehicleOverride {
  priceEgp?: number;
  availability?: 'available' | 'reserved' | 'sold' | 'rented';
  promotionalCopy?: string;
  specificationsNote?: string;
  mediaUrl?: string;
}

export function parseCustomSiteVehicleOverride(value: unknown): CustomSiteVehicleOverride {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Saved custom-site vehicle override must be an object.');
  }
  const raw = value as Record<string, unknown>;
  const parsed: CustomSiteVehicleOverride = {};
  if (raw.priceEgp !== undefined) {
    if (typeof raw.priceEgp !== 'number' || !Number.isFinite(raw.priceEgp) || raw.priceEgp <= 0 || raw.priceEgp > 500_000_000) {
      throw new Error('Saved custom-site vehicle price override is invalid.');
    }
    parsed.priceEgp = raw.priceEgp;
  }
  if (raw.availability !== undefined) {
    if (typeof raw.availability !== 'string' || !['available', 'reserved', 'sold', 'rented'].includes(raw.availability)) {
      throw new Error('Saved custom-site vehicle availability override is invalid.');
    }
    parsed.availability = raw.availability as CustomSiteVehicleOverride['availability'];
  }
  for (const key of ['promotionalCopy', 'specificationsNote'] as const) {
    if (raw[key] === undefined) continue;
    const maxLength = key === 'promotionalCopy' ? 500 : 1000;
    if (typeof raw[key] !== 'string' || raw[key].length > maxLength) {
      throw new Error(`Saved custom-site ${key} override is invalid.`);
    }
    parsed[key] = raw[key].trim();
  }
  if (raw.mediaUrl !== undefined) {
    if (typeof raw.mediaUrl !== 'string' || raw.mediaUrl.length > 2000) {
      throw new Error('Saved custom-site vehicle media override is invalid.');
    }
    let mediaUrl: URL;
    try {
      mediaUrl = new URL(raw.mediaUrl);
    } catch {
      throw new Error('Saved custom-site vehicle media override is invalid.');
    }
    if (mediaUrl.protocol !== 'https:') throw new Error('Saved custom-site vehicle media override is invalid.');
    parsed.mediaUrl = mediaUrl.toString();
  }
  return parsed;
}

export const DEFAULT_CUSTOM_SITE_PROFILE: CustomSiteProfile = {
  templateId: 'editorial',
  inventoryOptions: {
    showYear: true,
    showPrice: true,
    showAvailability: true,
    showMileage: false,
    showAutofyonDetailsLink: true,
  },
  overrideOptions: [],
};

export function parseCustomSiteProfile(
  templateId: string | null | undefined,
  inventoryOptions: string | null | undefined,
  overrideOptions: string | null | undefined,
): CustomSiteProfile {
  const template = SITE_TEMPLATES.find((item) => item.id === templateId);
  let parsed: Partial<CustomSiteInventoryOptions> = {};
  try {
    const value: unknown = JSON.parse(inventoryOptions ?? '{}');
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      parsed = value as Partial<CustomSiteInventoryOptions>;
    }
  } catch {
    parsed = {};
  }
  let overrideFields: unknown;
  try {
    overrideFields = JSON.parse(overrideOptions ?? '[]');
  } catch {
    overrideFields = [];
  }
  return {
    templateId: template?.id ?? DEFAULT_CUSTOM_SITE_PROFILE.templateId,
    inventoryOptions: {
      showYear: typeof parsed.showYear === 'boolean' ? parsed.showYear : DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions.showYear,
      showPrice: typeof parsed.showPrice === 'boolean' ? parsed.showPrice : DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions.showPrice,
      showAvailability: typeof parsed.showAvailability === 'boolean' ? parsed.showAvailability : DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions.showAvailability,
      showMileage: typeof parsed.showMileage === 'boolean' ? parsed.showMileage : DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions.showMileage,
      showAutofyonDetailsLink: typeof parsed.showAutofyonDetailsLink === 'boolean'
        ? parsed.showAutofyonDetailsLink
        : DEFAULT_CUSTOM_SITE_PROFILE.inventoryOptions.showAutofyonDetailsLink,
    },
    overrideOptions: Array.isArray(overrideFields)
      ? [...new Set(overrideFields.filter((field): field is CustomSiteOverrideField =>
          typeof field === 'string' && CUSTOM_SITE_OVERRIDE_FIELDS.includes(field as CustomSiteOverrideField),
        ))]
      : [],
  };
}

export async function loadCustomSiteProfile(businessId: string): Promise<CustomSiteProfile> {
  const row = await queryOne<{ template_id: string; inventory_options: string; override_options: string }>(
    `SELECT template_id, inventory_options, override_options
       FROM custom_site_profiles WHERE business_id = ?`,
    [businessId],
  );
  return parseCustomSiteProfile(row?.template_id, row?.inventory_options, row?.override_options);
}

export async function loadCustomSiteVehicleOverrides(
  businessId: string,
  unitIds: string[],
): Promise<Record<string, CustomSiteVehicleOverride>> {
  if (!unitIds.length) return {};
  const placeholders = unitIds.map(() => '?').join(', ');
  const rows = await query<{ unit_id: string; overrides: string }>(
    `SELECT unit_id, overrides
       FROM custom_site_vehicle_overrides
      WHERE business_id = ? AND unit_id IN (${placeholders})`,
    [businessId, ...unitIds],
  );
  const result: Record<string, CustomSiteVehicleOverride> = {};
  for (const row of rows) {
    try {
      const parsed: unknown = JSON.parse(row.overrides);
      result[row.unit_id] = parseCustomSiteVehicleOverride(parsed);
    } catch {
      throw new Error(`Saved custom-site vehicle overrides for "${row.unit_id}" are invalid.`);
    }
  }
  return result;
}

export async function loadSiteProfile(
  targetType: SiteTargetType,
  targetId: string,
): Promise<SiteProfile> {
  const row = await queryOne<{
    template_id: string;
    logo_url: string | null;
    accent_color: string | null;
    background_color: string | null;
    social_links: string | null;
  }>(
    `SELECT template_id, logo_url, accent_color, background_color, social_links
       FROM site_profiles WHERE target_type = ? AND target_id = ?`,
    [targetType, targetId],
  );
  const savedTemplateId = targetType === 'business' ? 'editorial' : row?.template_id;
  const template = SITE_TEMPLATES.find((item) => item.id === savedTemplateId) ?? SITE_TEMPLATES[0];
  let socialLinks: UnitSocialLinks = {};
  try {
    const parsed: unknown = JSON.parse(row?.social_links ?? '{}');
    const validated = validateUnitSocialLinks(parsed);
    if (!validated) throw new Error('Unsupported or invalid social link URL.');
    socialLinks = validated;
  } catch {
    throw new Error(`Saved social links for ${targetType} "${targetId}" are invalid.`);
  }
  return {
    templateId: template.id,
    layout: template.id,
    logoUrl: row?.logo_url ?? null,
    accentColor: row?.accent_color || template.accentColor,
    backgroundColor: row?.background_color || template.backgroundColor,
    socialLinks,
  };
}
