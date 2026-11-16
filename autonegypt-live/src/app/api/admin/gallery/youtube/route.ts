/**
 * POST /api/admin/gallery/youtube
 *
 * Embed a YouTube review or walkaround video directly into the car's carousel.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { batch, queryOne, parseJson, type Statement } from '@/lib/db';
import { extractYouTubeVideoId } from '@/lib/youtube';


export async function POST(req: NextRequest) {
  let body: {
    business_id?: string;
    unit_id?: string;
    section_id?: string;
    field_key?: string;
    youtube_url?: string;
    title_ar?: string;
    title_en?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { business_id, unit_id, section_id = 'sec_auto_exterior', field_key, youtube_url, title_ar, title_en } = body;

  if (!business_id || !section_id || !field_key || !youtube_url) {
    return NextResponse.json({ error: 'business_id, section_id, field_key and youtube_url are required' }, { status: 400 });
  }

  const auth = await requireBusinessAccess(req, business_id);
  if (auth instanceof Response) return auth;

  if (unit_id) {
    const unit = await queryOne<{ seller_business_id: string }>(
      'SELECT seller_business_id FROM units WHERE id = ?',
      [unit_id],
    );
    if (!unit || unit.seller_business_id !== business_id) {
      return NextResponse.json({ error: 'vehicle does not belong to this business' }, { status: 400 });
    }
  }

  const videoId = extractYouTubeVideoId(youtube_url);
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.' }, { status: 400 });
  }
  const field = await queryOne<{ name: string }>(
    'SELECT name FROM form_fields WHERE section_id = ? AND name = ? LIMIT 1',
    [section_id, field_key],
  );
  if (!field) return NextResponse.json({ error: 'field_key is not configured for this section' }, { status: 400 });

  const id = `gal_yt_${globalThis.crypto.randomUUID().slice(0, 8)}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const section = await queryOne<{ options: string | null }>(
    'SELECT options FROM sections WHERE id = ?',
    [section_id],
  );
  if (!section) return NextResponse.json({ error: 'section not found' }, { status: 404 });
  const maxRow = await queryOne<{ n: number }>(
    `SELECT COALESCE(MAX(display_order), 0) AS n FROM vendor_gallery
      WHERE business_id = ? AND section_id = ? AND ${unit_id ? 'unit_id = ?' : 'unit_id IS NULL'}`,
    unit_id ? [business_id, section_id, unit_id] : [business_id, section_id],
  );
  const displayOrder = (maxRow?.n ?? 0) + 1;
  const sectionOptions = parseJson<Record<string, unknown>>(section.options, {});
  const approvalStatus = auth.user.role === 'platform_admin' || sectionOptions.curation_policy !== 'review_required'
    ? 'approved'
    : 'pending';

  const statements: Statement[] = [{
    sql: `UPDATE vendor_gallery SET is_hero = 0
            WHERE business_id = ? AND section_id = ? AND ${unit_id ? 'unit_id = ?' : 'unit_id IS NULL'}`,
    params: unit_id ? [business_id, section_id, unit_id] : [business_id, section_id],
  }, {
    sql: `INSERT INTO vendor_gallery
       (id, business_id, unit_id, section_id, url, caption, caption_ar, media_type, video_id,
        field_key, field_section_id, display_order, placement, is_hero, show_on_minisite, approval_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'youtube', ?, ?, ?, ?, 'carousel', 1, 1, ?)`,
    params: [
      id,
      business_id,
      unit_id ?? null,
      section_id,
      thumbnailUrl,
      title_en || 'YouTube Video Review',
      title_ar || 'فيديو مراجعة وتجربة حية',
      videoId,
      field_key,
      section_id,
      displayOrder,
      approvalStatus,
    ],
  }];
  await batch(statements);

  return NextResponse.json({
    ok: true,
    id,
    videoId,
    thumbnailUrl,
    approval_status: approvalStatus,
    display_order: displayOrder,
  }, { status: 201 });
}
