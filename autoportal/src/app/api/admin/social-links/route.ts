import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { batch, queryOne, type Statement } from '@/lib/db';
import { safeSocialUrl } from '@/lib/social-link-types';

interface LinkInput {
  platformKey?: unknown;
  label?: unknown;
  url?: unknown;
  visible?: unknown;
}

interface SaveBody {
  business_id?: unknown;
  unit_id?: unknown;
  links?: unknown;
}

export async function PUT(req: NextRequest) {
  let body: SaveBody;
  try {
    body = await req.json() as SaveBody;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const businessId = typeof body.business_id === 'string' ? body.business_id.trim() : '';
  if (body.unit_id !== undefined && body.unit_id !== null && typeof body.unit_id !== 'string') {
    return NextResponse.json({ error: 'unit_id must be a string' }, { status: 400 });
  }
  const unitId = typeof body.unit_id === 'string' ? body.unit_id.trim() : '';
  if (!businessId || !Array.isArray(body.links) || body.links.length > 25) {
    return NextResponse.json({ error: 'business_id and up to 25 links are required' }, { status: 400 });
  }

  const auth = await requireBusinessAccess(req, businessId);
  if (auth instanceof Response) return auth;

  if (unitId) {
    const unit = await queryOne<{ seller_business_id: string }>(
      'SELECT seller_business_id FROM units WHERE id = ?',
      [unitId],
    );
    if (!unit || unit.seller_business_id !== businessId) {
      return NextResponse.json({ error: 'vehicle does not belong to this business' }, { status: 400 });
    }
  }

  const links: Array<{
    platformKey: string;
    label: string;
    url: string;
    visible: number;
    displayOrder: number;
  }> = [];
  const keys = new Set<string>();

  for (const raw of body.links) {
    if (typeof raw !== 'object' || raw === null) {
      return NextResponse.json({ error: 'each link must be an object' }, { status: 400 });
    }
    const link = raw as LinkInput;
    const platformKey = typeof link.platformKey === 'string'
      ? link.platformKey.trim().toLowerCase()
      : '';
    const label = typeof link.label === 'string' ? link.label.trim() : '';
    const url = typeof link.url === 'string' ? safeSocialUrl(link.url.trim()) : null;

    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(platformKey)) {
      return NextResponse.json({ error: 'platform keys may contain only letters, numbers, dashes, and underscores' }, { status: 400 });
    }
    if (keys.has(platformKey)) {
      return NextResponse.json({ error: `duplicate platform: ${platformKey}` }, { status: 400 });
    }
    if (!label || label.length > 60 || !url) {
      return NextResponse.json({ error: `a label and valid HTTP(S) URL are required for ${platformKey}` }, { status: 400 });
    }
    if (link.visible !== undefined && typeof link.visible !== 'boolean' && link.visible !== 0 && link.visible !== 1) {
      return NextResponse.json({ error: `visible must be a boolean for ${platformKey}` }, { status: 400 });
    }

    keys.add(platformKey);
    links.push({
      platformKey,
      label,
      url,
      visible: link.visible === true || link.visible === 1 ? 1 : 0,
      displayOrder: links.length,
    });
  }

  const statements: Statement[] = [{
    sql: unitId
      ? 'DELETE FROM site_social_links WHERE business_id = ? AND unit_id = ?'
      : 'DELETE FROM site_social_links WHERE business_id = ? AND unit_id IS NULL',
    params: unitId ? [businessId, unitId] : [businessId],
  }];
  for (const link of links) {
    statements.push({
      sql: `INSERT INTO site_social_links
              (id, business_id, unit_id, platform_key, label, url, is_visible, display_order, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      params: [
        `social_${globalThis.crypto.randomUUID()}`,
        businessId,
        unitId || null,
        link.platformKey,
        link.label,
        link.url,
        link.visible,
        link.displayOrder,
      ],
    });
  }

  await batch(statements);
  return NextResponse.json({ ok: true, count: links.length });
}
