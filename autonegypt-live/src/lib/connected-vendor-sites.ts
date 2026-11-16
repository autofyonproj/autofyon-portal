export const CONNECTED_SITE_FEATURES = [
  'profile',
  'contact',
  'inventory',
  'shared_vehicle_offers',
] as const;

export type ConnectedSiteFeature = (typeof CONNECTED_SITE_FEATURES)[number];

export const CONNECTED_SITE_FEATURE_LABELS: Record<ConnectedSiteFeature, string> = {
  profile: 'Vendor name and site branding',
  contact: 'Vendor contact information',
  inventory: 'Vendor-owned vehicle inventory',
  shared_vehicle_offers: 'Vehicles distributed to this vendor',
};

export function parseConnectedSiteFeatures(value: string): ConnectedSiteFeature[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some((item) =>
    typeof item !== 'string' || !CONNECTED_SITE_FEATURES.includes(item as ConnectedSiteFeature),
  )) {
    throw new Error('Saved connected-site features are invalid.');
  }
  return [...new Set(parsed)] as ConnectedSiteFeature[];
}

export function normalizeSiteOrigin(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash ||
      url.origin === 'null'
    ) return null;
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) return null;
    return url.origin.toLowerCase();
  } catch {
    return null;
  }
}
