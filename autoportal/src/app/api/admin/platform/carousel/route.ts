import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import {
  loadPortalPageState,
  savePortalPage,
  type CarouselPresentationType,
  type PortalCarouselSlide,
} from '@/lib/portal-site';

export async function GET(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  const state = await loadPortalPageState();
  return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  let body: {
    action?: 'save' | 'publish';
    carouselType?: CarouselPresentationType;
    carouselSlides?: PortalCarouselSlide[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const action = body.action === 'publish' ? 'publish' : 'save';
  const currentState = await loadPortalPageState();
  const currentContent = currentState.draft;

  const updatedContent = {
    ...currentContent,
    carouselType: body.carouselType || currentContent.carouselType,
    carouselSlides: body.carouselSlides || currentContent.carouselSlides,
  };

  const newState = await savePortalPage(action, updatedContent);

  return NextResponse.json({
    ok: true,
    action,
    state: newState,
  });
}
