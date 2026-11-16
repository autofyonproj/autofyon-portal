import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { execute, queryOne, parseJson } from '@/lib/db';
import { BLOG_WIDGETS, type BlogWidget } from '@/lib/global-blog';


export async function PATCH(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;
  let body: { widgets?: unknown };
  try { body = await req.json() as { widgets?: unknown }; } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!Array.isArray(body.widgets)) {
    return NextResponse.json({ error: 'widgets must be an array.' }, { status: 400 });
  }
  const widgets = [...new Set(body.widgets.filter(
    (value): value is BlogWidget => typeof value === 'string' && BLOG_WIDGETS.includes(value as BlogWidget),
  ))];
  const row = await queryOne<{ widgets: string }>('SELECT widgets FROM global_blog_settings WHERE id = 1');
  const stored = parseJson<unknown>(row?.widgets ?? '[]', []);
  const envelope = typeof stored === 'object' && stored !== null && !Array.isArray(stored)
    ? stored as Record<string, unknown>
    : {};
  await execute(
    `INSERT INTO global_blog_settings (id, widgets, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET widgets = excluded.widgets, updated_at = CURRENT_TIMESTAMP`,
    [JSON.stringify({ ...envelope, widgets })],
  );
  return NextResponse.json({ ok: true, widgets });
}
