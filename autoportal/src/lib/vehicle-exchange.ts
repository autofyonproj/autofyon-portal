import { validateUnitSocialLinks, type UnitSocialLinks } from '@/lib/social-links';

export interface ExchangeMediaItem {
  section_id: string;
  url: string;
  caption: string | null;
  caption_ar: string | null;
  media_data: Record<string, unknown> | null;
  group_key: string | null;
  field_key: string | null;
  field_section_id: string | null;
  display_order: number;
  placement: 'body' | 'carousel' | 'both';
  is_hero: 0 | 1;
  show_on_minisite: 0 | 1;
  media_type: 'image' | 'video' | 'youtube';
  video_id: string | null;
}

export interface ExchangeVehiclePayload {
  schemaVersion: 1;
  vehicle: {
    externalId: string;
    title: string;
    title_ar: string | null;
    unit_kind: 'new' | 'used' | 'demo' | 'lease_return';
    vehicle_category: 'car' | 'motorcycle' | 'scooter' | 'commercial';
    status: 'available' | 'reserved' | 'sold' | 'rented' | 'inactive';
    year: number | null;
    mileage_km: number | null;
    color: string | null;
    color_ar: string | null;
    price_egp: number | null;
    price_currency: string;
    negotiable: 0 | 1;
    availability_note: string | null;
    availability_note_ar: string | null;
    overrides: Record<string, Record<string, unknown>>;
  };
  socialLinks: UnitSocialLinks;
  design: {
    template_id: 'editorial' | 'showroom' | 'minimal';
    logo_url: string | null;
    accent_color: string;
    background_color: string;
  };
  media: ExchangeMediaItem[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function nullableText(value: unknown, maxLength: number): value is string | null {
  return value === null || typeof value === 'string' && value.length <= maxLength;
}

function safeMediaUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function safeLogoUrl(value: unknown): value is string | null {
  if (value === null) return true;
  if (typeof value !== 'string' || value.length > 500) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateExchangePayload(value: unknown): ExchangeVehiclePayload | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.vehicle) || !isRecord(value.design)) return null;
  const vehicle = value.vehicle;
  const design = value.design;
  const socialLinks = validateUnitSocialLinks(value.socialLinks);
  if (
    !socialLinks ||
    typeof vehicle.externalId !== 'string' || !vehicle.externalId.trim() || vehicle.externalId.length > 160 ||
    typeof vehicle.title !== 'string' || !vehicle.title.trim() || vehicle.title.length > 180 ||
    !nullableText(vehicle.title_ar, 180) ||
    !['new', 'used', 'demo', 'lease_return'].includes(String(vehicle.unit_kind)) ||
    !['car', 'motorcycle', 'scooter', 'commercial'].includes(String(vehicle.vehicle_category)) ||
    !['available', 'reserved', 'sold', 'rented', 'inactive'].includes(String(vehicle.status)) ||
    vehicle.year !== null && (!Number.isInteger(vehicle.year) || Number(vehicle.year) < 1886 || Number(vehicle.year) > 2200) ||
    vehicle.mileage_km !== null && (!Number.isInteger(vehicle.mileage_km) || Number(vehicle.mileage_km) < 0) ||
    !nullableText(vehicle.color, 100) || !nullableText(vehicle.color_ar, 100) ||
    vehicle.price_egp !== null && (!Number.isInteger(vehicle.price_egp) || Number(vehicle.price_egp) <= 0) ||
    typeof vehicle.price_currency !== 'string' || !/^[A-Z]{3}$/.test(vehicle.price_currency) ||
    ![0, 1].includes(Number(vehicle.negotiable)) ||
    !nullableText(vehicle.availability_note, 500) ||
    !nullableText(vehicle.availability_note_ar, 500) ||
    !isRecord(vehicle.overrides) ||
    !['editorial', 'showroom', 'minimal'].includes(String(design.template_id)) ||
    !safeLogoUrl(design.logo_url) ||
    !/^#[0-9a-f]{6}$/i.test(String(design.accent_color)) ||
    !/^#[0-9a-f]{6}$/i.test(String(design.background_color)) ||
    !Array.isArray(value.media) || value.media.length > 100
  ) return null;

  const media: ExchangeMediaItem[] = [];
  for (const rawItem of value.media) {
    if (!isRecord(rawItem)) return null;
    if (
      typeof rawItem.section_id !== 'string' || rawItem.section_id.length > 100 ||
      !safeMediaUrl(rawItem.url) ||
      !nullableText(rawItem.caption, 1000) || !nullableText(rawItem.caption_ar, 1000) ||
      rawItem.media_data !== null && !isRecord(rawItem.media_data) ||
      !nullableText(rawItem.group_key, 120) || !nullableText(rawItem.field_key, 120) ||
      !nullableText(rawItem.field_section_id, 100) ||
      !Number.isInteger(rawItem.display_order) || Number(rawItem.display_order) < 0 ||
      !['body', 'carousel', 'both'].includes(String(rawItem.placement)) ||
      ![0, 1].includes(Number(rawItem.is_hero)) ||
      ![0, 1].includes(Number(rawItem.show_on_minisite)) ||
      !['image', 'video', 'youtube'].includes(String(rawItem.media_type)) ||
      !nullableText(rawItem.video_id, 100)
    ) return null;
    media.push({
      section_id: rawItem.section_id,
      url: rawItem.url,
      caption: rawItem.caption,
      caption_ar: rawItem.caption_ar,
      media_data: rawItem.media_data as Record<string, unknown> | null,
      group_key: rawItem.group_key,
      field_key: rawItem.field_key,
      field_section_id: rawItem.field_section_id,
      display_order: Number(rawItem.display_order),
      placement: rawItem.placement as ExchangeMediaItem['placement'],
      is_hero: Number(rawItem.is_hero) as 0 | 1,
      show_on_minisite: Number(rawItem.show_on_minisite) as 0 | 1,
      media_type: rawItem.media_type as ExchangeMediaItem['media_type'],
      video_id: rawItem.video_id,
    });
  }

  if (JSON.stringify(value).length > 500_000) return null;
  return {
    schemaVersion: 1,
    vehicle: {
      externalId: vehicle.externalId,
      title: vehicle.title,
      title_ar: vehicle.title_ar,
      unit_kind: vehicle.unit_kind as ExchangeVehiclePayload['vehicle']['unit_kind'],
      vehicle_category: vehicle.vehicle_category as ExchangeVehiclePayload['vehicle']['vehicle_category'],
      status: vehicle.status as ExchangeVehiclePayload['vehicle']['status'],
      year: vehicle.year as number | null,
      mileage_km: vehicle.mileage_km as number | null,
      color: vehicle.color,
      color_ar: vehicle.color_ar,
      price_egp: vehicle.price_egp as number | null,
      price_currency: vehicle.price_currency,
      negotiable: Number(vehicle.negotiable) as 0 | 1,
      availability_note: vehicle.availability_note,
      availability_note_ar: vehicle.availability_note_ar,
      overrides: vehicle.overrides as Record<string, Record<string, unknown>>,
    },
    socialLinks,
    design: {
      template_id: design.template_id as ExchangeVehiclePayload['design']['template_id'],
      logo_url: design.logo_url,
      accent_color: design.accent_color as string,
      background_color: design.background_color as string,
    },
    media,
  };
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
