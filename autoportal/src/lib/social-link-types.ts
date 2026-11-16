import type { SiteLocale } from '@/lib/site-locale';

export interface SocialLink {
  platformKey: string;
  label: string;
  url: string;
  visible: boolean;
  displayOrder: number;
}

export const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'x', label: 'X' },
  { key: 'snapchat', label: 'Snapchat' },
  { key: 'threads', label: 'Threads' },
  { key: 'pinterest', label: 'Pinterest' },
] as const;

export function safeSocialUrl(value: string): string | null {
  if (value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function socialLinksLabel(locale: SiteLocale, scope: 'business' | 'unit'): string {
  if (locale === 'ar') return scope === 'business' ? 'تابعونا' : 'روابط السيارة';
  return scope === 'business' ? 'Follow us' : 'Vehicle links';
}
