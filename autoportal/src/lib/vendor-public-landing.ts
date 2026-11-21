import { parseJson, queryOne } from '@/lib/db';

export interface VendorPublicLanding {
  businessId: string;
  slug: string;
  displayName: string;
  displayNameEn: string;
  typeId: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  websiteUrl: string;
  email: string;
  city: string;
  address: string;
  socials: Record<string, string>;
}

interface LandingRow {
  business_id: string;
  slug: string;
  display_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  website_url: string;
  social_links: string;
  custom_data: string | null;
  business_name: string;
  business_name_ar: string;
  type_id: string;
}

export async function getPublishedVendorLanding(slug: string): Promise<VendorPublicLanding | null> {
  const landing = await queryOne<LandingRow>(
    `SELECT p.business_id, p.slug, p.display_name, p.tagline, p.description, p.phone,
            p.whatsapp, p.website_url, p.social_links, b.custom_data,
            COALESCE(b.name, p.display_name) AS business_name,
            COALESCE(b.name_ar, p.display_name) AS business_name_ar,
            b.type_id
       FROM autofyon_media_landings p
       JOIN businesses b ON b.id = p.business_id
      WHERE lower(p.slug) = lower(?)
        AND p.published = 1
        AND b.status = 'active'
        AND b.published = 1
      LIMIT 1`,
    [slug],
  );
  if (!landing) return null;

  const customData = parseJson<Record<string, Record<string, string>>>(landing.custom_data, {});
  return {
    businessId: landing.business_id,
    slug: landing.slug,
    displayName: landing.business_name_ar || landing.display_name,
    displayNameEn: landing.business_name || landing.display_name,
    typeId: landing.type_id,
    tagline: landing.tagline,
    description: landing.description,
    phone: landing.phone,
    whatsapp: landing.whatsapp,
    websiteUrl: landing.website_url,
    email: customData.sec_1_identity?.email || '',
    city: customData.sec_1_identity?.city || '',
    address: customData.sec_1_identity?.address || '',
    socials: parseJson<Record<string, string>>(landing.social_links, {}),
  };
}
