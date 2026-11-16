/**
 * /api/admin/media — CRUD for vendor_gallery rows.
 *
 * POST   { business_id, section_id, url, ...fields }  → insert gallery item
 * PATCH  { id, ...updates }                           → update a single item
 * DELETE { id }                                       → remove an item
 * PUT    { business_id, section_id, order: [ids] }    → bulk reorder
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { execute, queryOne } from '@/lib/db';
import { extractYouTubeVideoId } from '@/lib/youtube';


export async function POST(req: NextRequest) {
  let body: {
    business_id?: string;
    section_id?: string;
    url?: string;
    caption?: string;
    caption_ar?: string;
    media_data?: Record<string, unknown>;
    group_key?: string;
    field_key?: string;
    field_section_id?: string;
    placement?: string;
    is_hero?: number;
    media_type?: string;
    video_id?: string;
    unit_id?: string;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { business_id, section_id, url } = body;
  if (!business_id || !section_id || !url) {
    return NextResponse.json({ error: 'business_id, section_id and url are required' }, { status: 400 });
  }
  const mediaType = body.media_type ?? 'image';
  if (!['image', 'video', 'youtube'].includes(mediaType)) {
    return NextResponse.json({ error: 'unsupported media_type' }, { status: 400 });
  }
  const videoId = mediaType === 'youtube' ? extractYouTubeVideoId(url) : body.video_id ?? null;
  if (mediaType === 'youtube' && !videoId) {
    return NextResponse.json({ error: 'Please provide a valid YouTube video URL.' }, { status: 400 });
  }
  const mediaUrl = mediaType === 'youtube'
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : url;

  const auth = await requireBusinessAccess(req, business_id);
  if (auth instanceof Response) return auth;

  if (body.unit_id) {
    const unit = await queryOne<{ seller_business_id: string }>(
      'SELECT seller_business_id FROM units WHERE id = ?',
      [body.unit_id],
    );
    if (!unit || unit.seller_business_id !== business_id) {
      return NextResponse.json({ error: 'vehicle does not belong to this business' }, { status: 400 });
    }
  }

  const id = `gal_${globalThis.crypto.randomUUID().slice(0, 12)}`;

  // Determine display_order: append to end
  const maxRow = await queryOne<{ n: number }>(
    'SELECT COALESCE(MAX(display_order), 0) AS n FROM vendor_gallery WHERE business_id = ? AND section_id = ?',
    [business_id, section_id],
  );
  const nextOrder = (maxRow?.n ?? 0) + 1;

  // If setting hero, un-hero others in same section
  if (body.is_hero === 1) {
    await execute(
      `UPDATE vendor_gallery SET is_hero = 0
        WHERE business_id = ? AND section_id = ? AND ${body.unit_id ? 'unit_id = ?' : 'unit_id IS NULL'}`,
      body.unit_id ? [business_id, section_id, body.unit_id] : [business_id, section_id],
    );
  }

  const approvalStatus = auth.user.role === 'platform_admin' ? 'approved' : 'pending';

  await execute(
    `INSERT INTO vendor_gallery
       (id, business_id, section_id, url, caption, caption_ar, media_data,
        group_key, field_key, field_section_id, display_order, placement,
        is_hero, show_on_minisite, approval_status, media_type, video_id, unit_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
    [
      id, business_id, section_id, mediaUrl,
      body.caption ?? null,
      body.caption_ar ?? null,
      body.media_data ? JSON.stringify(body.media_data) : null,
      body.group_key ?? null,
      body.field_key ?? null,
      body.field_section_id ?? null,
      nextOrder,
      body.placement ?? (mediaType === 'youtube' ? 'carousel' : 'body'),
      body.is_hero ?? 0,
      approvalStatus,
      mediaType,
      videoId,
      body.unit_id ?? null,
    ],
  );

  return NextResponse.json({
    ok: true,
    id,
    url: mediaUrl,
    video_id: videoId,
    approval_status: approvalStatus,
  }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  let body: {
    id?: string;
    url?: string;
    caption?: string;
    caption_ar?: string;
    media_data?: Record<string, unknown>;
    placement?: string;
    is_hero?: number;
    show_on_minisite?: number;
    approval_status?: string;
    field_key?: string;
    field_section_id?: string;
    group_key?: string;
    display_order?: number;
    business_id?: string;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  // Look up business_id from the gallery row for auth check
  const row = await queryOne<{ business_id: string }>(
    'SELECT business_id FROM vendor_gallery WHERE id = ?', [id],
  );
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const auth = await requireBusinessAccess(req, row.business_id);
  if (auth instanceof Response) return auth;

  // Build SET clause dynamically
  const fields: string[] = [];
  const vals: unknown[] = [];
  const map: Record<string, unknown> = body;
  const allowed = [
    'url', 'caption', 'caption_ar', 'placement', 'is_hero',
    'show_on_minisite', 'field_key', 'field_section_id', 'group_key', 'display_order',
  ];
  for (const key of allowed) {
    if (key in map && map[key] !== undefined) {
      fields.push(`${key} = ?`);
      vals.push(map[key]);
    }
  }
  // JSON columns
  if (map.media_data !== undefined) {
    fields.push('media_data = ?');
    vals.push(JSON.stringify(map.media_data));
  }
  // Admin-only: approval status
  if (map.approval_status && auth.user.role === 'platform_admin') {
    fields.push('approval_status = ?');
    vals.push(map.approval_status);
  }

  if (!fields.length) return NextResponse.json({ error: 'no fields to update' }, { status: 400 });

  vals.push(id);
  await execute(`UPDATE vendor_gallery SET ${fields.join(', ')} WHERE id = ?`, vals);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: { id?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { id } = body;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const row = await queryOne<{ business_id: string }>(
    'SELECT business_id FROM vendor_gallery WHERE id = ?', [id],
  );
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const auth = await requireBusinessAccess(req, row.business_id);
  if (auth instanceof Response) return auth;

  // Vendors can only delete their own pending items; admins can delete anything
  if (auth.user.role !== 'platform_admin') {
    const media = await queryOne<{ approval_status: string }>(
      'SELECT approval_status FROM vendor_gallery WHERE id = ?', [id],
    );
    if (media?.approval_status === 'approved') {
      return NextResponse.json({ error: 'forbidden: cannot delete approved media' }, { status: 403 });
    }
  }

  await execute('DELETE FROM vendor_gallery WHERE id = ?', [id]);
  return NextResponse.json({ ok: true });
}

/** Bulk reorder: PUT { business_id, section_id, order: [id1, id2, ...] } */
export async function PUT(req: NextRequest) {
  let body: { business_id?: string; section_id?: string; order?: string[] };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { business_id, section_id, order } = body;
  if (!business_id || !section_id || !order?.length) {
    return NextResponse.json({ error: 'business_id, section_id and order are required' }, { status: 400 });
  }

  const auth = await requireBusinessAccess(req, business_id);
  if (auth instanceof Response) return auth;

  for (let i = 0; i < order.length; i++) {
    await execute(
      'UPDATE vendor_gallery SET display_order = ? WHERE id = ? AND business_id = ? AND section_id = ?',
      [i + 1, order[i], business_id, section_id],
    );
  }

  return NextResponse.json({ ok: true });
}
