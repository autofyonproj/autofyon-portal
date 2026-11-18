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
  // 1. Try autofyon_media_landings
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
      tagline: landing.tagline || 'عضو شبكة أوتوفاي أون للسيارات في مصر',
      description: landing.description || '',
      phone: cleanPhone,
      whatsapp: landing.whatsapp || cleanPhone,
      city: 'مصر',
      youtubeVideoId: videos[0] || 'L_LUpnjgPso', // High quality automotive video fallback
      socials,
      claimUrl: `/join?claim=${encodeURIComponent(landing.business_id)}&name=${encodeURIComponent(
        landing.display_name,
      )}&phone=${encodeURIComponent(cleanPhone)}&slug=${encodeURIComponent(landing.slug)}&ref=landing-hook`,
      mediaManagerUrl: `/media-manager/index.html?business=${encodeURIComponent(landing.slug)}`,
    };
  }

  // 2. Try vendor_prospects in D1
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
      tagline: 'عضو شبكة أوتوفاي أون للسيارات في مصر',
      description: `معرض ${prospect.name} في ${prospect.city || 'مصر'} — عضو مميز في شبكة أوتوفاي أون لتجارة السيارات.`,
      phone,
      whatsapp: phone,
      city: prospect.city || 'مصر',
      youtubeVideoId: 'L_LUpnjgPso',
      socials: {},
      claimUrl: `/join?claim=${encodeURIComponent(prospect.id)}&name=${encodeURIComponent(
        prospect.name,
      )}&phone=${encodeURIComponent(phone)}&slug=${encodeURIComponent(slug)}&ref=landing-hook`,
      mediaManagerUrl: `/media-manager/index.html?business=${encodeURIComponent(slug)}`,
    };
  }

  // 3. Try Static Dealers JSON as fallback
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
      tagline: 'عضو شبكة أوتوفاي أون للسيارات في مصر',
      description: `معرض ${staticMatch.name} في ${staticMatch.city} — متخصص في ${staticMatch.brand || 'السيارات الزيرو والمستعملة'}.`,
      phone,
      whatsapp: staticMatch.whatsapp || phone,
      city: staticMatch.city || 'مصر',
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
  if (!data) return { title: 'AutoFy On | أوتوفاي أون' };

  return {
    title: `${data.displayName} | معرض معتمد على أوتوفاي أون AutoFy On`,
    description: `صفحة معرض ${data.displayName} على منصة أوتوفاي أون (autofyon.com) — استعرض أحدث عروض السيارات وأرقام التواصل المباشرة واستوديو الميديا مانجر.`,
    alternates: {
      canonical: `/p/${slug}`,
      languages: {
        ar: `/p/${slug}`,
        en: `/en/p/${slug}`,
      },
    },
  };
}

export default async function StarterLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await resolveLandingData(slug);
  if (!data) notFound();

  return <StarterLandingClient data={data} locale="ar" />;
}
