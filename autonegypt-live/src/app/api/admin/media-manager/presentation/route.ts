import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import {
  DEFAULT_MEDIA_MANAGER_PRESENTATION,
  validateMediaManagerPresentation,
} from '@/lib/media-manager-presentation';


export async function GET(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  const row = await queryOne<{ content: string; updated_at: string }>(
    'SELECT content, updated_at FROM media_manager_presentation WHERE id = 1',
  );
  if (!row) {
    return NextResponse.json({ presentation: DEFAULT_MEDIA_MANAGER_PRESENTATION, updatedAt: null });
  }

  let content: unknown;
  try {
    content = JSON.parse(row.content) as unknown;
  } catch {
    return NextResponse.json({ error: 'Saved presentation content is invalid JSON.' }, { status: 500 });
  }
  try {
    return NextResponse.json({ presentation: validateMediaManagerPresentation(content), updatedAt: row.updated_at });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Saved presentation content is invalid.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  let body: { presentation?: unknown };
  try {
    body = await req.json() as { presentation?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  let presentation;
  try {
    presentation = validateMediaManagerPresentation(body.presentation);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid presentation content.' }, { status: 400 });
  }

  await execute(
    `INSERT INTO media_manager_presentation (id, content, updated_at)
     VALUES (1, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP`,
    [JSON.stringify(presentation)],
  );
  return NextResponse.json({ ok: true, presentation });
}
