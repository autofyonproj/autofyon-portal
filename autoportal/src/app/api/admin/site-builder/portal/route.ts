import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { loadPortalPageState, savePortalPage } from '@/lib/portal-site';

const COPY_KEYS = [
  'badge', 'title', 'description', 'productsTitle', 'productsDescription',
  'featuredTitle', 'ctaTitle', 'ctaDescription', 'ctaButton',
] as const;
const SECTIONS = ['products', 'featured', 'cta'];

function validateContent(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'content must be an object.';
  const content = value as Record<string, unknown>;
  if (typeof content.accentColor !== 'string' || !/^#[\da-f]{6}$/i.test(content.accentColor)
      || typeof content.backgroundColor !== 'string' || !/^#[\da-f]{6}$/i.test(content.backgroundColor)) {
    return 'Theme colors must be six-digit hex values.';
  }
  if (!Array.isArray(content.enabledSections)
      || content.enabledSections.some((item) => typeof item !== 'string' || !SECTIONS.includes(item))) {
    return 'enabledSections contains an unsupported section.';
  }
  for (const locale of ['en', 'ar'] as const) {
    const copy = content[locale];
    if (!copy || typeof copy !== 'object' || Array.isArray(copy)) return `The ${locale} copy is required.`;
    for (const key of COPY_KEYS) {
      const text = (copy as Record<string, unknown>)[key];
      if (typeof text !== 'string' || text.length > 1000) return `${locale}.${key} must be text under 1,000 characters.`;
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;
  return NextResponse.json(await loadPortalPageState());
}

export async function PUT(request: NextRequest) {
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) return auth;
  let body: { action?: string; content?: unknown };
  try {
    body = await request.json() as { action?: string; content?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (body.action !== 'save' && body.action !== 'publish') {
    return NextResponse.json({ error: 'action must be save or publish.' }, { status: 400 });
  }
  const validationError = validateContent(body.content);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  try {
    return NextResponse.json(await savePortalPage(body.action, body.content));
  } catch (error) {
    console.error('Could not save portal page:', error);
    return NextResponse.json({ error: 'Could not save portal page.' }, { status: 500 });
  }
}
