/**
 * POST /api/admin/gallery/youtube
 *
 * Embed a YouTube review or walkaround video directly into the car's carousel.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { execute } from '@/lib/db';
import { extractYouTubeVideoId } from '@/lib/youtube';


export async function POST(req: NextRequest) {
  let body: {
    business_id?: string;
    section_id?: string;
    youtube_url?: string;
    title_ar?: string;
    title_en?: string;
    start_seconds?: number | string;
    end_seconds?: number | string;
    max_duration?: number | string;
    is_hero?: boolean | number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { business_id, section_id = 'sec_auto_exterior', youtube_url, title_ar, title_en, is_hero = 1 } = body;

  if (!business_id || !youtube_url) {
    return NextResponse.json({ error: 'business_id and youtube_url are required' }, { status: 400 });
  }

  const auth = await requireBusinessAccess(req, business_id);
  if (auth instanceof Response) return auth;

  const videoId = extractYouTubeVideoId(youtube_url);
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.' }, { status: 400 });
  }

  function parseSeconds(val: unknown): number | undefined {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return undefined;
      if (trimmed.includes(':')) {
        const parts = trimmed.split(':').map((p) => Number(p));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return parts[0] * 60 + parts[1];
        }
      }
      const num = Number(trimmed);
      if (!isNaN(num) && num >= 0) return num;
    }
    return undefined;
  }

  const startSec = parseSeconds(body.start_seconds);
  const endSec = parseSeconds(body.end_seconds);
  const maxDur = parseSeconds(body.max_duration);

  const mediaData = JSON.stringify({
    ...(startSec !== undefined ? { startTime: startSec, start: startSec, start_seconds: startSec } : {}),
    ...(endSec !== undefined ? { endTime: endSec, end: endSec, end_seconds: endSec } : {}),
    ...(maxDur !== undefined ? { maxDuration: maxDur } : {}),
  });

  const id = `gal_yt_${globalThis.crypto.randomUUID().slice(0, 8)}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  await execute(
    `INSERT INTO vendor_gallery
       (id, business_id, section_id, url, caption, caption_ar, media_type, video_id, media_data, display_order, placement, is_hero, show_on_minisite, approval_status)
     VALUES (?, ?, ?, ?, ?, ?, 'youtube', ?, ?, 0, 'carousel', ?, 1, 'approved')`,
    [
      id,
      business_id,
      section_id,
      thumbnailUrl,
      title_en || 'YouTube Video Review',
      title_ar || 'فيديو مراجعة وتجربة حية',
      videoId,
      mediaData,
      is_hero ? 1 : 0,
    ]
  );

  return NextResponse.json({ ok: true, id, videoId, thumbnailUrl, startTime: startSec, endTime: endSec }, { status: 201 });
}
