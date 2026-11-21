import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUser } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // ── Security Gate: ONLY Platform Admin can export contact database ─────────
    const user = await getAdminUser(req);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Platform admin authentication required to access contacts database' },
        { status: 403 },
      );
    }

    const rows = await query<{
      name: string;
      category_key: string;
      original_category: string | null;
      city: string | null;
      district: string | null;
      phones: string;
    }>(
      `SELECT name, category_key, original_category, city, district, phones
         FROM vendor_prospects
        WHERE has_phone = 1
        ORDER BY name ASC`,
    );

    const lines: string[] = [];

    for (const dealer of rows) {
      let phoneList: string[] = [];
      try {
        const parsed = JSON.parse(dealer.phones || '{}');
        if (typeof parsed === 'object' && parsed !== null) {
          phoneList = Object.values(parsed).map((v) => String(v)).filter(Boolean);
        }
      } catch {
        // skip malformed
      }

      if (!phoneList.length) continue;

      lines.push('BEGIN:VCARD');
      lines.push('VERSION:3.0');
      const safeName = (dealer.name || 'جهة اتصال').replace(/[,:;\n\r]/g, ' ').trim();
      lines.push(`FN:AutoFyon - ${safeName}`);
      lines.push(`N:AutoFyon;${safeName};;;`);
      lines.push(`ORG:${safeName}`);
      const cat = dealer.original_category || dealer.category_key || 'سيارات';
      const loc = [dealer.city, dealer.district].filter(Boolean).join(' - ');
      lines.push(`NOTE:AutoFyon | ${cat}${loc ? ' | ' + loc : ''}`);

      const seenNumbers = new Set<string>();
      for (const phone of phoneList) {
        const cleanPhone = String(phone).replace(/[^\d+]/g, '');
        if (cleanPhone.length >= 7 && !seenNumbers.has(cleanPhone)) {
          seenNumbers.add(cleanPhone);
          lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
        }
      }
      lines.push('END:VCARD');
      lines.push('');
    }

    const vcfContent = lines.join('\r\n');

    return new NextResponse(vcfContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': 'attachment; filename="autofyon-dealers-egypt.vcf"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('VCF export error:', error);
    return NextResponse.json({ error: 'Failed to generate contacts file' }, { status: 500 });
  }
}
