import { query } from '@/lib/db';
import { safeSocialUrl, type SocialLink } from '@/lib/social-link-types';
export { type SocialLink, socialLinksLabel } from '@/lib/social-link-types';

export async function loadSocialLinks(
  businessId: string,
  unitId?: string | null,
  visibleOnly = false,
): Promise<SocialLink[]> {
  const visibility = visibleOnly ? ' AND is_visible = 1' : '';
  const rows = await query<{
    platform_key: string;
    label: string;
    url: string;
    is_visible: number;
    display_order: number;
  }>(
    `SELECT platform_key, label, url, is_visible, display_order
       FROM site_social_links
      WHERE business_id = ? AND ${unitId ? 'unit_id = ?' : 'unit_id IS NULL'}${visibility}
      ORDER BY display_order, platform_key`,
    unitId ? [businessId, unitId] : [businessId],
  );
  return rows.flatMap((row) => {
    const url = safeSocialUrl(row.url);
    return url ? [{
      platformKey: row.platform_key,
      label: row.label,
      url,
      visible: row.is_visible === 1,
      displayOrder: row.display_order,
    }] : [];
  });
}

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
