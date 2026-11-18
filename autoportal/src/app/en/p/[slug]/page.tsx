import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StarterLandingClient, { type StarterLandingData } from '@/components/StarterLandingClient';
import { queryOne, parseJson } from '@/lib/db';
import dealersJson from '@/data/egypt_dealers_directory.json';

export const dynamic = 'force-dynamic';

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
  images: string;
  youtube_videos: string;
  business_name?: string;
  business_name_ar?: string;
}

interface ProspectRow {
  id: string;
  name: string;
  city: string;
  phones: string;
  email: string;
  brand: string;
  address: string;
}

function extractFirstPhone(phonesStr: string): string {
  try {
    const obj = JSON.parse(phonesStr) as Record<string, string>;
    return obj.whatsapp || obj.phone1 || obj.mobile1 || Object.values(obj)[0] || '';
  } catch {
    return phonesStr || '';
  }
}

async function resolveLandingData(slug: string): Promise<StarterLandingData | null> {
  const landing = await queryOne<LandingRow>(
    `SELECT p.business_id, p.slug, p.display_name, p.tagline, p.description, p.phone,
            p.whatsapp, p.website_url, p.social_links, p.images, p.youtube_videos,
            COALESCE(b.name, p.display_name) AS business_name,
            COALESCE(b.name_ar, p.display_name) AS business_name_ar
       FROM autofyon_media_landings p
  LEFT JOIN businesses b ON b.id = p.business_id
      WHERE (p.slug = ? OR lower(p.slug) = lower(?))
      LIMIT 1`,
    [slug, slug],
  );

  if (landing) {
    const videos = parseJson<string[]>(landing.youtube_videos, []);
    const socials = parseJson<Record<string, string>>(landing.social_links, {});
    const cleanPhone = landing.phone || landing.whatsapp || '';

    return {
      businessId: landing.business_id,
      slug: landing.slug,
      displayName: landing.business_name_ar || landing.business_name || landing.display_name,
      displayNameEn: landing.business_name || landing.display_name,
      tagline: landing.tagline || 'AutoFy On Certified Partner in Egypt',
      description: landing.description || '',
      phone: cleanPhone,
      whatsapp: landing.whatsapp || cleanPhone,
      city: 'Egypt',
      youtubeVideoId: videos[0] || 'L_LUpnjgPso',
      socials,
      claimUrl: `/join?claim=${encodeURIComponent(landing.business_id)}&name=${encodeURIComponent(
        landing.display_name,
      )}&phone=${encodeURIComponent(cleanPhone)}&slug=${encodeURIComponent(landing.slug)}&ref=landing-hook`,
      mediaManagerUrl: `/media-manager/index.html?business=${encodeURIComponent(landing.slug)}`,
    };
  }

  const prospect = await queryOne<ProspectRow>(
    `SELECT id, name, city, phones, email, brand, address
       FROM vendor_prospects
      WHERE id = ? OR duplicate_key = ? OR lower(name) = lower(?)
      LIMIT 1`,
    [slug, `slug_${slug}`, slug],
  );

  if (prospect) {
    const phone = extractFirstPhone(prospect.phones);
    return {
      businessId: `prospect_${prospect.id}`,
      slug,
      displayName: prospect.name,
      displayNameEn: prospect.name,
      tagline: 'AutoFy On Certified Partner in Egypt',
      description: `${prospect.name} in ${prospect.city || 'Egypt'} — Certified member of AutoFy On Dealership Network.`,
      phone,
      whatsapp: phone,
      city: prospect.city || 'Egypt',
      youtubeVideoId: 'L_LUpnjgPso',
      socials: {},
      claimUrl: `/join?claim=${encodeURIComponent(prospect.id)}&name=${encodeURIComponent(
        prospect.name,
      )}&phone=${encodeURIComponent(phone)}&slug=${encodeURIComponent(slug)}&ref=landing-hook`,
      mediaManagerUrl: `/media-manager/index.html?business=${encodeURIComponent(slug)}`,
    };
  }

  const staticMatch = (dealersJson as Array<{
    id: string;
    name: string;
    city: string;
    primary_phone: string;
    whatsapp: string;
    slug: string;
    brand: string;
  }>).find((d) => d.slug.toLowerCase() === slug.toLowerCase() || d.id === slug);

  if (staticMatch) {
    const phone = staticMatch.whatsapp || staticMatch.primary_phone || '';
    return {
      businessId: `prospect_${staticMatch.id}`,
      slug: staticMatch.slug,
      displayName: staticMatch.name,
      displayNameEn: staticMatch.name,
      tagline: 'AutoFy On Certified Partner in Egypt',
      description: `${staticMatch.name} in ${staticMatch.city} — Specialists in ${staticMatch.brand || 'new and pre-owned vehicles'}.`,
      phone,
      whatsapp: staticMatch.whatsapp || phone,
      city: staticMatch.city || 'Egypt',
      youtubeVideoId: 'L_LUpnjgPso',
      socials: {},
      claimUrl: `/join?claim=${encodeURIComponent(staticMatch.id)}&name=${encodeURIComponent(
        staticMatch.name,
      )}&phone=${encodeURIComponent(phone)}&slug=${encodeURIComponent(staticMatch.slug)}&ref=landing-hook`,
      mediaManagerUrl: `/media-manager/index.html?business=${encodeURIComponent(staticMatch.slug)}`,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await resolveLandingData(slug);
  if (!data) return { title: 'AutoFy On' };

  return {
    title: `${data.displayNameEn || data.displayName} | AutoFy On Certified Dealership`,
    description: `Official showroom page of ${data.displayNameEn || data.displayName} on AutoFy On (autofyon.com).`,
    alternates: {
      canonical: `/en/p/${slug}`,
      languages: {
        ar: `/p/${slug}`,
        en: `/en/p/${slug}`,
      },
    },
  };
}

export default async function EnglishStarterLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await resolveLandingData(slug);
  if (!data) notFound();

  return <StarterLandingClient data={data} locale="en" />;
}
