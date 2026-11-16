import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import { deleteImage, isAllowedImageType, mediaUrl, putImage } from '@/lib/media';


type LandingImage = { key: string; caption: string };
type LandingRow = {
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
  published: number;
};

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function safeUrl(value: unknown): string {
  const raw = text(value, 500);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

function safeSlug(value: unknown): string {
  return text(value, 70).toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function youtubeId(value: unknown): string {
  const raw = text(value, 500);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] || '';
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch {
    return '';
  }
}

function parseArray<T>(value: string | null | undefined): T[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function landingImages(value: string | null | undefined): LandingImage[] {
  return parseArray<unknown>(value).flatMap((image) => {
    if (!image || typeof image !== 'object') return [];
    const candidate = image as { key?: unknown; caption?: unknown };
    if (typeof candidate.key !== 'string' || !/^gallery\/[A-Za-z0-9._-]+$/.test(candidate.key)) return [];
    return [{
      key: candidate.key,
      caption: typeof candidate.caption === 'string' ? candidate.caption.slice(0, 120) : '',
    }];
  }).slice(0, 3);
}

function view(row: LandingRow | null, businessName: string) {
  let socialLinks: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(row?.social_links || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      socialLinks = parsed as Record<string, unknown>;
    }
  } catch {
    socialLinks = {};
  }

  return {
    exists: Boolean(row),
    businessId: row?.business_id || '',
    slug: row?.slug || safeSlug(businessName),
    displayName: row?.display_name || businessName,
    tagline: row?.tagline || '',
    description: row?.description || '',
    phone: row?.phone || '',
    whatsapp: row?.whatsapp || '',
    websiteUrl: row?.website_url || '',
    facebookUrl: typeof socialLinks.facebook === 'string' ? socialLinks.facebook : '',
    instagramUrl: typeof socialLinks.instagram === 'string' ? socialLinks.instagram : '',
    images: landingImages(row?.images).map((image) => ({
      ...image,
      url: mediaUrl(image.key),
    })),
    youtubeVideos: parseArray<string>(row?.youtube_videos)
      .filter((id) => /^[A-Za-z0-9_-]{11}$/.test(id))
      .slice(0, 3)
      .map((id) => `https://www.youtube.com/watch?v=${id}`),
    published: row?.published === 1,
  };
}

async function ownedBusiness(request: NextRequest, businessId: string) {
  const user = await getAdminUser(request);
  if (!user) {
    return { response: NextResponse.json({ error: 'Sign in to your AUTOFYON showroom account.' }, { status: 401 }) };
  }
  const membership = await queryOne<{ name: string; name_ar: string | null }>(
    `SELECT b.name, b.name_ar
       FROM business_memberships m
       JOIN businesses b ON b.id = m.business_id
      WHERE m.admin_user_id = ? AND m.business_id = ? AND m.status = 'active'
        AND m.role = 'owner' AND b.status = 'active'
      LIMIT 1`,
    [user.id, businessId],
  );
  if (!membership) {
    return { response: NextResponse.json({ error: 'Active showroom owner access is required.' }, { status: 403 }) };
  }
  return { businessName: membership.name_ar || membership.name };
}

export async function GET(request: NextRequest) {
  const businessId = text(request.nextUrl.searchParams.get('businessId'), 100);
  if (!businessId) return NextResponse.json({ error: 'Choose a showroom account.' }, { status: 400 });
  try {
    const owner = await ownedBusiness(request, businessId);
    if ('response' in owner) return owner.response;
    const row = await queryOne<LandingRow>(
      `SELECT business_id, slug, display_name, tagline, description, phone, whatsapp,
              website_url, social_links, images, youtube_videos, published
         FROM autofyon_media_landings WHERE business_id = ?`,
      [businessId],
    );
    return NextResponse.json({ landing: view(row, owner.businessName) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Could not load AUTOFYON starter landing:', error);
    return NextResponse.json({ error: 'Could not load the starter landing page.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 415 });
  }

  let payload: Record<string, unknown>;
  try {
    const raw = form.get('landing');
    if (typeof raw !== 'string') throw new Error('Missing landing page details.');
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid landing page details.');
    payload = parsed as Record<string, unknown>;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid landing page details.' }, { status: 400 });
  }

  const businessId = text(payload.businessId, 100);
  if (!businessId) return NextResponse.json({ error: 'Choose a showroom account.' }, { status: 400 });
  if (payload.published !== true) {
    return NextResponse.json({ error: 'Save private drafts on this device; this endpoint only publishes public landing pages.' }, { status: 400 });
  }

  const uploaded: LandingImage[] = [];
  try {
    const owner = await ownedBusiness(request, businessId);
    if ('response' in owner) return owner.response;

    const displayName = text(payload.displayName, 80);
    const slug = safeSlug(payload.slug || displayName);
    const tagline = text(payload.tagline, 120);
    const description = text(payload.description, 500);
    const phone = text(payload.phone, 40);
    const whatsapp = text(payload.whatsapp, 40);
    const websiteRaw = text(payload.websiteUrl, 500);
    const facebookRaw = text(payload.facebookUrl, 500);
    const instagramRaw = text(payload.instagramUrl, 500);
    const websiteUrl = safeUrl(websiteRaw);
    const facebookUrl = safeUrl(facebookRaw);
    const instagramUrl = safeUrl(instagramRaw);
    const youtubeInput = Array.isArray(payload.youtubeVideos) ? payload.youtubeVideos : [];
    if (youtubeInput.length > 3) {
      return NextResponse.json({ error: 'A starter landing page can use up to three YouTube videos.' }, { status: 400 });
    }
    const youtubeVideos = youtubeInput.map(youtubeId).filter(Boolean);

    if (!displayName || !slug || !/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug)) {
      return NextResponse.json({ error: 'Enter a business name and a valid page slug.' }, { status: 400 });
    }
    if ((websiteRaw && !websiteUrl) || (facebookRaw && !facebookUrl) || (instagramRaw && !instagramUrl)) {
      return NextResponse.json({ error: 'Website and social links must be valid HTTP or HTTPS URLs.' }, { status: 400 });
    }
    if (whatsapp) {
      const digits = whatsapp.replace(/\D/g, '');
      if (!/^\+?[\d\s()-]+$/.test(whatsapp) || digits.length < 7 || digits.length > 15) {
        return NextResponse.json({ error: 'Enter a valid WhatsApp number with country code.' }, { status: 400 });
      }
    }
    if (youtubeInput.some((url) => text(url, 500) && !youtubeId(url))) {
      return NextResponse.json({ error: 'Use a valid YouTube video link in each video field.' }, { status: 400 });
    }

    const occupiedSlug = await queryOne<{ business_id: string }>(
      'SELECT business_id FROM autofyon_media_landings WHERE slug = ? AND business_id != ?',
      [slug, businessId],
    );
    if (occupiedSlug) {
      return NextResponse.json({ error: 'That landing-page slug is already in use. Choose another.' }, { status: 409 });
    }

    const existing = await queryOne<LandingRow>(
      `SELECT business_id, slug, display_name, tagline, description, phone, whatsapp,
              website_url, social_links, images, youtube_videos, published
         FROM autofyon_media_landings WHERE business_id = ?`,
      [businessId],
    );
    const previousImages = landingImages(existing?.images);
    let requestedKeys: string[] = [];
    if (Array.isArray(payload.imageKeys)) {
      requestedKeys = payload.imageKeys.filter((key): key is string => typeof key === 'string');
    } else if (typeof payload.imageKeys === 'string') {
      try {
        const parsed: unknown = JSON.parse(payload.imageKeys);
        if (Array.isArray(parsed)) requestedKeys = parsed.filter((key): key is string => typeof key === 'string');
      } catch {
        return NextResponse.json({ error: 'Invalid selected landing photos.' }, { status: 400 });
      }
    } else if (payload.imageKeys !== undefined) {
      return NextResponse.json({ error: 'Invalid selected landing photos.' }, { status: 400 });
    }
    if (requestedKeys.length > 3) {
      return NextResponse.json({ error: 'A starter landing page can use up to three photos.' }, { status: 400 });
    }
    const selectedExisting = requestedKeys
      .filter((key, index) => requestedKeys.indexOf(key) === index)
      .flatMap((key) => previousImages.filter((image) => image.key === key));
    const newPhotos = form.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0);
    if (selectedExisting.length > 3 || newPhotos.length > 3 - selectedExisting.length) {
      return NextResponse.json({ error: 'A starter landing page can use up to three photos.' }, { status: 400 });
    }
    if (newPhotos.some((file) => !isAllowedImageType(file.type) || file.size > 10 * 1024 * 1024)
      || newPhotos.reduce((total, file) => total + file.size, 0) > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'Use supported images no larger than 10 MB each and 30 MB total.' }, { status: 413 });
    }

    for (const [index, file] of newPhotos.entries()) {
      const { key } = await putImage(await file.arrayBuffer(), file.type, `landing-${slug}-${index + 1}`);
      uploaded.push({ key, caption: '' });
    }
    const images = [...selectedExisting, ...uploaded];
    const published = 1;
    const now = new Date().toISOString();
    await execute(
      `INSERT INTO autofyon_media_landings
         (business_id, slug, display_name, tagline, description, phone, whatsapp, website_url,
          social_links, images, youtube_videos, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(business_id) DO UPDATE SET
         slug = excluded.slug, display_name = excluded.display_name, tagline = excluded.tagline,
         description = excluded.description, phone = excluded.phone, whatsapp = excluded.whatsapp,
         website_url = excluded.website_url, social_links = excluded.social_links,
         images = excluded.images, youtube_videos = excluded.youtube_videos,
         published = excluded.published, updated_at = excluded.updated_at`,
      [
        businessId, slug, displayName, tagline, description, phone, whatsapp, websiteUrl,
        JSON.stringify({ facebook: facebookUrl, instagram: instagramUrl }),
        JSON.stringify(images), JSON.stringify(youtubeVideos), published, now, now,
      ],
    );

    let cleanupWarning = false;
    const retainedKeys = new Set(images.map((image) => image.key));
    for (const image of previousImages) {
      if (retainedKeys.has(image.key)) continue;
      try {
        await deleteImage(image.key);
      } catch (error) {
        cleanupWarning = true;
        console.error('Could not remove a replaced starter landing image:', image.key, error);
      }
    }
    return NextResponse.json({
      landing: view({
        business_id: businessId, slug, display_name: displayName, tagline, description, phone, whatsapp,
        website_url: websiteUrl, social_links: JSON.stringify({ facebook: facebookUrl, instagram: instagramUrl }),
        images: JSON.stringify(images), youtube_videos: JSON.stringify(youtubeVideos), published,
      }, owner.businessName),
      cleanupWarning,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    await Promise.all(uploaded.map(async (image) => {
      try {
        await deleteImage(image.key);
      } catch (cleanupError) {
        console.error('Could not clean up an uncommitted starter landing image:', image.key, cleanupError);
      }
    }));
    if (error instanceof Error && /UNIQUE constraint failed: autofyon_media_landings\.slug/i.test(error.message)) {
      return NextResponse.json({ error: 'That landing-page slug is already in use. Choose another.' }, { status: 409 });
    }
    console.error('Could not save AUTOFYON starter landing:', error);
    return NextResponse.json({ error: 'Could not save the starter landing page.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const businessId = text(request.nextUrl.searchParams.get('businessId'), 100);
  const action = request.nextUrl.searchParams.get('action');
  if (!businessId || !['unpublish', 'delete'].includes(action || '')) {
    return NextResponse.json({ error: 'Choose a valid page action.' }, { status: 400 });
  }

  try {
    const owner = await ownedBusiness(request, businessId);
    if ('response' in owner) return owner.response;
    const row = await queryOne<{ images: string }>(
      'SELECT images FROM autofyon_media_landings WHERE business_id = ?',
      [businessId],
    );
    if (!row) return NextResponse.json({ error: 'No landing page exists for this business.' }, { status: 404 });

    if (action === 'unpublish') {
      await execute(
        'UPDATE autofyon_media_landings SET published = 0, updated_at = ? WHERE business_id = ?',
        [new Date().toISOString(), businessId],
      );
      return NextResponse.json({ published: false });
    }

    await execute('DELETE FROM autofyon_media_landings WHERE business_id = ?', [businessId]);
    let cleanupWarning = false;
    for (const image of landingImages(row.images)) {
      try {
        await deleteImage(image.key);
      } catch (error) {
        cleanupWarning = true;
        console.error('Could not delete a removed AUTOFYON landing image:', image.key, error);
      }
    }
    return NextResponse.json({ deleted: true, cleanupWarning });
  } catch (error) {
    console.error('Could not remove AUTOFYON starter landing:', error);
    return NextResponse.json({ error: 'Could not change the landing page.' }, { status: 500 });
  }
}
