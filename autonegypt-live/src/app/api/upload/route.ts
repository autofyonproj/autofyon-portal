/**
 * POST /api/upload — authenticated image upload into R2.
 *
 * Admins upload to the business scope they are authorized to manage. The
 * session/Cloudflare Access identity is checked before any file is written.
 *
 * Body: multipart/form-data with a "file", "business_id", and optional "unit_id".
 * Returns: { key, url } — store `url` as vendor_gallery.url.
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAccess } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';
import { putImage, isAllowedImageType, mediaUrl } from '@/lib/media';


export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('business_id')?.trim();
  const unitId = searchParams.get('unit_id')?.trim() ?? '';
  if (!businessId) {
    return NextResponse.json({ error: 'business_id is required' }, { status: 400 });
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

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'expected multipart/form-data' }, { status: 415 });
  }
  if (form.get('business_id') !== businessId || (form.get('unit_id') || '') !== unitId) {
    return NextResponse.json({ error: 'upload scope does not match the authorized business or vehicle' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing "file" field' }, { status: 400 });
  }
  if (!isAllowedImageType(file.type)) {
    return NextResponse.json({ error: `unsupported type: ${file.type || 'unknown'}` }, { status: 415 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'file too large (max 10MB)' }, { status: 413 });
  }

  const data = await file.arrayBuffer();
  const { key } = await putImage(data, file.type || 'application/octet-stream', file.name || 'image');
  return NextResponse.json({ key, url: mediaUrl(key) }, { status: 201 });
}
