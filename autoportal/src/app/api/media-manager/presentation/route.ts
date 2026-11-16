import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import {
  DEFAULT_MEDIA_MANAGER_PRESENTATION,
  validateMediaManagerPresentation,
} from '@/lib/media-manager-presentation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const row = await queryOne<{ content: string; updated_at: string }>(
    'SELECT content, updated_at FROM media_manager_presentation WHERE id = 1',
  );
  if (!row) {
    return NextResponse.json(
      { presentation: DEFAULT_MEDIA_MANAGER_PRESENTATION, updatedAt: null },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let content: unknown;
  try {
    content = JSON.parse(row.content) as unknown;
  } catch {
    return NextResponse.json({ error: 'Saved presentation content is invalid JSON.' }, { status: 500 });
  }

  try {
    const presentation = validateMediaManagerPresentation(content);
    return NextResponse.json(
      { presentation, updatedAt: row.updated_at },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Saved presentation content is invalid.' },
      { status: 500 },
    );
  }
}
