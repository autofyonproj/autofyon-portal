/**
 * /api/cron/cleanup-trials
 *
 * Called daily at 03:00 UTC by the Cloudflare Cron Trigger configured in wrangler.jsonc.
 * Protected by a CRON_SECRET env variable — set it in the Cloudflare dashboard as a secret.
 *
 * Also callable manually by a platform admin via POST with the same secret in the header.
 *
 * Header:  x-cron-secret: <value of CRON_SECRET env variable>
 */

import { NextRequest, NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

export async function POST(req: NextRequest) {
  // --- Auth: accept either a valid CRON_SECRET header or a platform-admin session ---
  const cronSecret = process.env.CRON_SECRET;
  const headerSecret = req.headers.get('x-cron-secret');

  const isValidCronSecret = cronSecret && headerSecret && headerSecret === cronSecret;

  if (!isValidCronSecret) {
    // Fall back to platform-admin cookie check for manual admin-panel calls
    const { requirePlatformAdmin } = await import('@/lib/admin-auth');
    const auth = await requirePlatformAdmin(req);
    if (auth instanceof Response) {
      return NextResponse.json({ error: 'غير مصرح لك بتنفيذ هذه العملية.' }, { status: 401 });
    }
  }

  try {
    const nowIso = new Date().toISOString();

    // Find all trial showrooms (not yet deleted) for expiry check
    const trialShowrooms = await query<{ id: string; custom_data: string; slug: string }>(
      `SELECT id, custom_data, slug FROM businesses
        WHERE id LIKE 'biz_trial_%' AND status <> 'deleted'`,
    );

    const toDeleteIds: string[] = [];

    for (const b of trialShowrooms) {
      try {
        const cd = JSON.parse(b.custom_data || '{}');
        const expiresAt: string | undefined = cd?._trial?.expires_at;
        if (expiresAt && new Date(expiresAt) <= new Date(nowIso)) {
          toDeleteIds.push(b.id);
        }
      } catch {
        // Malformed custom_data — skip safely
      }
    }

    if (toDeleteIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'لا توجد معارض تجريبية منتهية الصلاحية حالياً.',
        deletedCount: 0,
        checkedCount: trialShowrooms.length,
      });
    }

    for (const bizId of toDeleteIds) {
      // Delete in dependency order: children first, parent last
      await execute('DELETE FROM units WHERE seller_business_id = ?', [bizId]);
      await execute('DELETE FROM business_app_licenses WHERE business_id = ?', [bizId]);
      await execute('DELETE FROM standalone_client_copies WHERE business_id = ?', [bizId]);
      await execute('DELETE FROM businesses WHERE id = ?', [bizId]);
    }

    return NextResponse.json({
      ok: true,
      message: `تم تنظيف وحذف ${toDeleteIds.length} معرض تجريبي منتهي الصلاحية تلقائياً.`,
      deletedCount: toDeleteIds.length,
      checkedCount: trialShowrooms.length,
      deletedBusinessIds: toDeleteIds,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'فشل تنظيف المعارض التجريبية';
    return NextResponse.json({ error }, { status: 500 });
  }
}
