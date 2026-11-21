import { NextRequest, NextResponse } from 'next/server';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { execute, parseJson, queryOne } from '@/lib/db';
import {
  DEFAULT_UNIT_PAGE_COMPONENTS,
  validateUnitPageComponents,
  type UnitPageComponent,
  type UnitPageLayoutState,
} from '@/lib/site-pages';

async function loadUnit(id: string) {
  return queryOne<{ id: string; seller_business_id: string; overrides: string | null }>(
    'SELECT id, seller_business_id, overrides FROM units WHERE id = ?',
    [id],
  );
}

function readState(raw: string | null): UnitPageLayoutState {
  const overrides = parseJson<Record<string, unknown>>(raw, {});
  const layout = overrides._site_layout && typeof overrides._site_layout === 'object'
    ? overrides._site_layout as Record<string, unknown>
    : {};
  let draft = DEFAULT_UNIT_PAGE_COMPONENTS;
  let published: UnitPageComponent[] | null = null;
  try {
    if (Array.isArray(layout.draft)) draft = validateUnitPageComponents(layout.draft);
    if (Array.isArray(layout.published)) published = validateUnitPageComponents(layout.published);
  } catch {
    return { draft: DEFAULT_UNIT_PAGE_COMPONENTS, published: null };
  }
  return { draft, published };
}

async function authorizedUnit(request: NextRequest, id: string) {
  const user = await getAdminUser(request);
  if (!user) return { response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const unit = await loadUnit(id);
  if (!unit) return { response: NextResponse.json({ error: 'vehicle not found' }, { status: 404 }) };
  if (!canAccessBusiness(user, unit.seller_business_id)) {
    return { response: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  }
  return { user, unit };
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await authorizedUnit(request, id);
  if ('response' in auth) return auth.response;
  return NextResponse.json(readState(auth.unit.overrides));
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await authorizedUnit(request, id);
  if ('response' in auth) return auth.response;
  let body: { action?: string; components?: unknown };
  try {
    body = await request.json() as { action?: string; components?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (body.action !== 'save' && body.action !== 'publish') {
    return NextResponse.json({ error: 'action must be save or publish.' }, { status: 400 });
  }
  let components: UnitPageComponent[];
  try {
    components = validateUnitPageComponents(body.components);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid vehicle layout.' }, { status: 400 });
  }
  const overrides = parseJson<Record<string, unknown>>(auth.unit.overrides, {});
  const current = readState(auth.unit.overrides);
  const state: UnitPageLayoutState = {
    draft: components,
    published: body.action === 'publish' ? components : current.published,
  };
  await execute(
    'UPDATE units SET overrides = ?, updated_at = ? WHERE id = ?',
    [
      JSON.stringify({ ...overrides, _site_layout: state }),
      new Date().toISOString(),
      id,
    ],
  );
  return NextResponse.json(state);
}
