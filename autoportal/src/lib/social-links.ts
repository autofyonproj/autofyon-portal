export const UNIT_SOCIAL_PLATFORMS = [
  'website',
  'facebook',
  'instagram',
  'youtube',
  'tiktok',
  'x',
  'whatsapp',
] as const;

export type UnitSocialPlatform = (typeof UNIT_SOCIAL_PLATFORMS)[number];
export type UnitSocialLinks = Partial<Record<UnitSocialPlatform, string>>;

export const UNIT_SOCIAL_LABELS: Record<UnitSocialPlatform, string> = {
  website: 'Website',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
  whatsapp: 'WhatsApp',
};

export function validateUnitSocialLinks(value: unknown): UnitSocialLinks | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > UNIT_SOCIAL_PLATFORMS.length) return null;
  const links: UnitSocialLinks = {};
  for (const [platform, rawUrl] of entries) {
    if (!UNIT_SOCIAL_PLATFORMS.includes(platform as UnitSocialPlatform)) return null;
    if (typeof rawUrl !== 'string' || rawUrl.length > 500) return null;
    if (!rawUrl.trim()) continue;
    try {
      const url = new URL(rawUrl);
      if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    } catch {
      return null;
    }
    links[platform as UnitSocialPlatform] = rawUrl;
  }
  return links;
}
