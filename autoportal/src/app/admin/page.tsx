import { headers } from 'next/headers';
import { getAdminUser } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminHome() {
  const hdrs = await headers();
  const fakeReq = new Request('http://localhost/admin', {
    headers: Object.fromEntries(hdrs.entries()),
  });
  const user = await getAdminUser(fakeReq);
  if (!user) redirect('/');

  // Fetch scoped businesses
  let businesses: { id: string; name: string; name_ar: string | null; slug: string; type_id: string }[] = [];

  if (user.role === 'platform_admin' || user.scope_ids.includes('*')) {
    businesses = await query(
      `SELECT id, name, name_ar, slug, type_id FROM businesses
        WHERE parent_business_id IS NULL AND status = 'active' ORDER BY name`,
    );
  } else if (user.scope_ids.length) {
    const ph = user.scope_ids.map(() => '?').join(',');
    businesses = await query(
      `SELECT id, name, name_ar, slug, type_id FROM businesses
        WHERE id IN (${ph}) AND status = 'active' ORDER BY name`,
      user.scope_ids,
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <div className="text-[11px] font-extrabold bg-red-600/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full inline-block mb-1">
            AutoFyon Control Panel
          </div>
          <h1 className="text-2xl font-bold">لوحة تحكم منصة أوتوفاي أون (AutoFyon C-Panel)</h1>
          <p className="opacity-60 text-xs mt-1">مرحباً بك: {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.role === 'platform_admin' && (
            <a
              href="/admin/platform/carousel"
              className="text-xs px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-sm flex items-center gap-1.5"
            >
              <span>🎬</span>
              <span>سلايدر العروض الرئيسي</span>
            </a>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="text-xs px-3 py-2 rounded-xl border border-black/15 dark:border-white/20 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            معاينة الموقع ↗
          </a>
        </div>
      </div>

      {/* ── Quick Administrative Control Suite ── */}
      {user.role === 'platform_admin' && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            أدوات التحكم السريع في المنصة (Quick Platform Controls)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="/admin/platform/carousel"
              className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-2xl mb-2">🎬</div>
                <div className="font-bold text-sm text-red-600 dark:text-red-400 group-hover:underline">
                  سلايدر الهيرو الرئيسي
                </div>
                <div className="text-xs opacity-70 mt-1">
                  التحكم في أنماط العرض السينمائية 21:9، 3D Cards، وفيديوهات اليوتيوب والعروض الترويجية.
                </div>
              </div>
              <div className="text-xs font-bold text-red-500 mt-3 flex items-center gap-1">
                <span>تعديل السلايدر الآن</span>
                <span>←</span>
              </div>
            </a>

            <a
              href="/admin/platform/media-manager"
              className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-2xl mb-2">📸</div>
                <div className="font-bold text-sm text-purple-600 dark:text-purple-400 group-hover:underline">
                  مكتبة الوسائط والصور
                </div>
                <div className="text-xs opacity-70 mt-1">
                  إدارة كافة صور سيارات المعارض والأستوديو مع التحميل السريع والمعاينة الفورية.
                </div>
              </div>
              <div className="text-xs font-bold text-purple-500 mt-3 flex items-center gap-1">
                <span>فتح مدير الوسائط</span>
                <span>←</span>
              </div>
            </a>

            <a
              href="/admin/site-builder"
              className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-bold text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                  مُنشئ المواقع والميني سايت
                </div>
                <div className="text-xs opacity-70 mt-1">
                  تعديل صفحات الماركات والمعارض، القوالب، والأقسام المستقلة بمرونة تامة.
                </div>
              </div>
              <div className="text-xs font-bold text-blue-500 mt-3 flex items-center gap-1">
                <span>Site Builder</span>
                <span>←</span>
              </div>
            </a>

            <a
              href="/admin/platform"
              className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-bold text-sm text-amber-600 dark:text-amber-400 group-hover:underline">
                  إدارة المنصة الشاملة
                </div>
                <div className="text-xs opacity-70 mt-1">
                  شجرة الهيكلية (Topology)، علاقات الوكلاء والموزعين، وإعدادات الأسواق.
                </div>
              </div>
              <div className="text-xs font-bold text-amber-500 mt-3 flex items-center gap-1">
                <span>Platform Master</span>
                <span>←</span>
              </div>
            </a>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-bold opacity-75">المعارض والشركات المتاحة</h2>
        {businesses.length === 0 ? (
          <p className="opacity-60 text-sm">لا توجد معارض مسجلة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.map((b) => (
              <a
                key={b.id}
                href={`/admin/showroom/${b.id}`}
                className="block rounded-xl border border-black/10 dark:border-white/15 p-5 hover:bg-black/[.03] dark:hover:bg-white/[.05] transition shadow-sm"
              >
                <div className="text-[11px] font-bold text-blue-600 mb-1">
                  {b.type_id === 'showroom' ? 'معرض سيارات' : b.type_id}
                </div>
                <div className="text-lg font-bold">{b.name_ar || b.name}</div>
                {b.name_ar && <div className="text-xs opacity-50 mt-0.5">{b.name}</div>}
                <div className="text-xs text-blue-500 mt-3 font-semibold flex items-center gap-1">
                  <span>إدارة المعرض والسيارات</span>
                  <span>←</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
