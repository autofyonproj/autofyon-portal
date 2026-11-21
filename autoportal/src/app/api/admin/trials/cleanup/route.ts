import { NextRequest, NextResponse } from 'next/server';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { execute, query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requirePlatformAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const nowIso = new Date().toISOString();

    // Find all trial showrooms where expires_at has passed
    const expiredTrials = await query<{ id: string; custom_data: string; slug: string }>(
      `SELECT id, custom_data, slug FROM businesses
        WHERE id LIKE 'biz_trial_%' AND status <> 'deleted'`,
    );

    const toDeleteIds: string[] = [];
    for (const b of expiredTrials) {
      try {
        const cd = JSON.parse(b.custom_data || '{}');
        const expiresAt = cd?._trial?.expires_at;
        if (expiresAt && new Date(expiresAt) <= new Date(nowIso)) {
          toDeleteIds.push(b.id);
        }
      } catch {}
    }

    if (toDeleteIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'لا توجد معارض تجريبية منتهية الصلاحية حالياً.',
        deletedCount: 0,
      });
    }

    for (const bizId of toDeleteIds) {
      // 1. Delete associated trial units
      await execute('DELETE FROM units WHERE seller_business_id = ?', [bizId]);
      // 2. Delete trial application licenses
      await execute('DELETE FROM business_app_licenses WHERE business_id = ?', [bizId]);
      // 3. Delete trial standalone client copies
      await execute('DELETE FROM standalone_client_copies WHERE business_id = ?', [bizId]);
      // 4. Delete the trial business node
      await execute('DELETE FROM businesses WHERE id = ?', [bizId]);
    }

    return NextResponse.json({
      ok: true,
      message: `تم تنظيف وحذف ${toDeleteIds.length} معرض تجريبي منتهي الصلاحية تلقائياً.`,
      deletedCount: toDeleteIds.length,
      deletedBusinessIds: toDeleteIds,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل تنظيف المعارض التجريبية';
    return NextResponse.json({ error }, { status: 500 });
  }
}
