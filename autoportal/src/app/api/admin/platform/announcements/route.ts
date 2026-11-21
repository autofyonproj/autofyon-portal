import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { loadPortalPageState, savePortalPage, type PlatformAd, type PlatformNewsItem } from '@/lib/portal-site';

function validPortalLink(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  const state = await loadPortalPageState();
  return NextResponse.json({
    draft: {
      platformAds: state.draft.platformAds,
      newsRibbon: state.draft.newsRibbon,
    },
    published: {
      platformAds: state.published?.platformAds ?? [],
      newsRibbon: state.published?.newsRibbon ?? [],
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;

  let body: {
    action?: 'save' | 'publish';
    platformAds?: PlatformAd[];
    newsRibbon?: PlatformNewsItem[];
  };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: 'Request must be valid JSON' }, { status: 400 });
  }
  if (body.action !== 'save' && body.action !== 'publish') {
    return NextResponse.json({ error: 'Action must be save or publish' }, { status: 400 });
  }
  if (!Array.isArray(body.platformAds) || !Array.isArray(body.newsRibbon)) {
    return NextResponse.json({ error: 'Advertisement and news lists are required' }, { status: 400 });
  }
  if (body.platformAds.length > 12 || body.newsRibbon.length > 20) {
    return NextResponse.json({ error: 'Maximum 12 advertisements and 20 news items are allowed' }, { status: 400 });
  }
  const adIds = new Set<string>();
  for (const ad of body.platformAds) {
    if (
      !ad || typeof ad.id !== 'string' || !ad.id || adIds.has(ad.id) ||
      typeof ad.imageUrl !== 'string' || !ad.imageUrl.startsWith('https://') ||
      typeof ad.linkUrl !== 'string' || !validPortalLink(ad.linkUrl) ||
      typeof ad.titleAr !== 'string' || !ad.titleAr.trim() ||
      typeof ad.titleEn !== 'string' ||
      ad.imageUrl.length > 1000 || ad.linkUrl.length > 1000 ||
      ad.titleAr.length > 160 || ad.titleEn.length > 160
    ) {
      return NextResponse.json({ error: 'Each advertisement needs a unique id, HTTPS image, safe link, and Arabic title' }, { status: 400 });
    }
    adIds.add(ad.id);
  }
  const newsIds = new Set<string>();
  for (const item of body.newsRibbon) {
    if (
      !item || typeof item.id !== 'string' || !item.id || newsIds.has(item.id) ||
      typeof item.linkUrl !== 'string' || !validPortalLink(item.linkUrl) ||
      typeof item.textAr !== 'string' || !item.textAr.trim() ||
      typeof item.textEn !== 'string' ||
      item.linkUrl.length > 1000 || item.textAr.length > 240 || item.textEn.length > 240
    ) {
      return NextResponse.json({ error: 'Each news item needs a unique id, safe link, and Arabic text' }, { status: 400 });
    }
    newsIds.add(item.id);
  }

  const current = await loadPortalPageState();
  const state = await savePortalPage(body.action, {
    ...current.draft,
    platformAds: body.platformAds,
    newsRibbon: body.newsRibbon,
  });
  return NextResponse.json({
    ok: true,
    action: body.action,
    draft: {
      platformAds: state.draft.platformAds,
      newsRibbon: state.draft.newsRibbon,
    },
    published: {
      platformAds: state.published?.platformAds ?? [],
      newsRibbon: state.published?.newsRibbon ?? [],
    },
  });
}
