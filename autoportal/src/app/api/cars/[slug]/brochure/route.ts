import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Direct In-Platform Brochure Download Proxy.
 *
 * Keeps the visitor on autofyon.com: fetches the official brochure PDF from the
 * agent's repository in the background, attaches branded headers, and streams it
 * directly to the client's download manager.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const car = await queryOne<{ id: string; name: string; name_ar: string | null; custom_data: string }>(
    `SELECT id, name, name_ar, custom_data FROM businesses
      WHERE (slug = ? OR id = ?) AND type_id = 'vehicle_model'
      LIMIT 1`,
    [slug, `biz_model_${slug.replace(/-/g, '_')}`]
  );

  if (!car) {
    return NextResponse.json({ error: 'Car model not found' }, { status: 404 });
  }

  let brochureUrl: string | null = null;
  try {
    const data = JSON.parse(car.custom_data || '{}') as Record<string, Record<string, unknown>>;
    brochureUrl = (data.sec_1_identity?.brochure_url as string) || null;
  } catch {
    // skip
  }

  // If no explicit brochure URL is authored yet, return informational message
  if (!brochureUrl) {
    return NextResponse.json(
      {
        error: 'لم يتوفر الكتالوج الرسمي بصيغة PDF لهذا الموديل بعد. يمكنك مراجعة المواصفات الكاملة على الصفحة مباشرة.',
        model: car.name,
      },
      { status: 404 }
    );
  }

  try {
    const upstreamRes = await fetch(brochureUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AutoFyon/1.0',
        'Accept': 'application/pdf,*/*',
      },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return NextResponse.json({ error: 'تعذر تحميل الملف من خادم الوكيل' }, { status: 502 });
    }

    const safeName = (car.name || 'Vehicle').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `AutoFyon-${safeName}-Official-Brochure.pdf`;

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Brochure proxy failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
