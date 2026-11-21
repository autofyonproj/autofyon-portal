import type { VendorTierId } from '@/lib/tiers';

export const STANDALONE_FEATURES = {
  accounting: 'المحاسبة والأستاذ العام',
  inventory: 'مخزون المركبات',
  purchasing: 'المشتريات ومستنداتها',
  crm: 'إدارة علاقات العملاء',
  advanced_reports: 'التقارير المتقدمة',
  cloud_sync: 'المزامنة والنسخ السحابي',
  marketplace: 'تكامل السوق',
} as const;

export type StandaloneFeature = keyof typeof STANDALONE_FEATURES;
export type StandaloneFeatureMap = Record<StandaloneFeature, boolean>;
export type StandaloneFeatureOverrides = Partial<StandaloneFeatureMap>;
export type StandaloneCrmTierId = Extract<VendorTierId, 'growth' | 'pro' | 'enterprise'>;

export function isStandaloneCrmTierId(value: unknown): value is StandaloneCrmTierId {
  return value === 'growth' || value === 'pro' || value === 'enterprise';
}

export const DEFAULT_STANDALONE_FEATURES: StandaloneFeatureMap = {
  accounting: true,
  inventory: true,
  purchasing: true,
  crm: true,
  advanced_reports: true,
  cloud_sync: true,
  marketplace: true,
};

export function parseStandaloneFeatures(value: unknown): StandaloneFeatureMap | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(STANDALONE_FEATURES);
  if (Object.keys(record).some((key) => !keys.includes(key))) return null;
  const result = { ...DEFAULT_STANDALONE_FEATURES };
  for (const key of keys as StandaloneFeature[]) {
    if (typeof record[key] !== 'boolean') return null;
    result[key] = record[key] as boolean;
  }
  return result;
}

export function parseStandaloneFeatureOverrides(value: unknown): StandaloneFeatureOverrides | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(STANDALONE_FEATURES);
  if (Object.keys(record).some((key) => !keys.includes(key))) return null;
  const overrides: StandaloneFeatureOverrides = {};
  for (const [key, enabled] of Object.entries(record)) {
    if (typeof enabled !== 'boolean') return null;
    overrides[key as StandaloneFeature] = enabled;
  }
  return overrides;
}

export function effectiveStandaloneFeatures(
  base: StandaloneFeatureMap,
  overrides: StandaloneFeatureOverrides,
): StandaloneFeatureMap {
  return { ...base, ...overrides };
}
