import { headers } from 'next/headers';
import { getAdminUser, canAccessBusiness } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';
import { getBusinessMembership } from '@/lib/business-apps';
import BusinessTeamManager from '@/components/BusinessTeamManager';
import { notFound } from 'next/navigation';
import { isVendorLeadBusinessType } from '@/lib/vendor-leads';

type Params = { params: Promise<{ id: string }> };

export default async function ShowroomDashboard({ params }: Params) {
  const { id } = await params;

  const hdrs = await headers();
  const fakeReq = new Request('http://localhost/admin', {
    headers: Object.fromEntries(hdrs.entries()),
  });
  const user = await getAdminUser(fakeReq);
  if (!user || !canAccessBusiness(user, id)) notFound();
  const membership = user.role === 'platform_admin'
    ? null
    : await getBusinessMembership(user.id, id);

  const showroom = await queryOne<{
    id: string; name: string; name_ar: string | null; slug: string;
    type_id: string; custom_data: string; published: number;
  }>(
    'SELECT id, name, name_ar, slug, type_id, custom_data, published FROM businesses WHERE id = ? AND status = \'active\'',
    [id],
  );
  if (!showroom) notFound();

  // Count units in stock (since 0009, a car is a row in `units`)
  const listingCount = await queryOne<{ n: number }>(
    'SELECT COUNT(*) AS n FROM units WHERE seller_business_id = ? AND status <> \'inactive\'',
    [id],
  );

  // Count gallery images
  const galleryCount = await queryOne<{ n: number }>(
    'SELECT COUNT(*) AS n FROM vendor_gallery WHERE business_id = ?',
    [id],
  );

  return (
    <div dir="rtl" className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <div className="text-xs font-bold text-blue-600 mb-1">لوحة تحكم المعرض</div>
          <h1 className="text-2xl font-bold">{showroom.name_ar || showroom.name}</h1>
          {showroom.name_ar && <div className="text-xs opacity-50 mt-0.5">{showroom.name}</div>}
        </div>
        <a
          href={`/${showroom.slug}`}
          target="_blank"
          rel="noopener"
          className="text-xs px-3 py-2 rounded-lg border border-black/15 font-bold hover:bg-black/5"
        >
          معاينة موقع المعرض للجمهور ↗
        </a>
      </div>

      {/* ── Upgrade Banner: English-only features not in Free ─────────── */}
      <div
        dir="rtl"
        className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-amber-500/3 p-5 space-y-4"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-0.5">
              ترقية الباقة · Upgrade Your Package
            </span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              مزايا حصرية في باقات النمو والاحترافية والمؤسسية
              <span className="text-amber-600 dark:text-amber-400 mx-1">·</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">Exclusive in Growth, Pro &amp; Enterprise</span>
            </h3>
          </div>
          <a
            href="/packages"
            className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow hover:brightness-110 transition"
          >
            ترقية الآن · Upgrade Now ↗
          </a>
        </div>

        {/* Feature grid — bilingual for paid tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {[
            { icon: '🌐', ar: 'واجهة إنجليزية كاملة للتطبيق', en: 'Full English-language app interface' },
            { icon: '📊', ar: 'تقارير إحصائيات الصفحة', en: 'Page analytics & visitor reports' },
            { icon: '💻', ar: 'سيستم ERP أوفلاين للمحاسبة', en: 'Offline desktop ERP & accounting' },
            { icon: '📋', ar: 'عقود البيع والفواتير الثنائية اللغة', en: 'Bilingual legal sales contracts' },
            { icon: '🗂️', ar: 'CRM متابعة العملاء المحتملين', en: 'CRM lead tracking & follow-up pipeline' },
            { icon: '🚗', ar: 'عرض أكثر من ١٠ سيارات', en: 'List more than 10 vehicles' },
            { icon: '🎬', ar: 'استوديو فيديو ريلز وبوسترات', en: 'Video Reels & poster studio' },
            { icon: '🌍', ar: 'دومين .com مستقل باسم معرضك', en: 'Your own independent .com domain' },
            { icon: '🔝', ar: 'أولوية ظهور ×٢.٥ في نتائج البحث', en: '2.5× search priority placement' },
          ].map(({ icon, ar, en }) => (
            <div
              key={ar}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-amber-500/15"
            >
              <span className="text-base leading-none shrink-0 mt-0.5">{icon}</span>
              <div>
                <div className="font-bold text-slate-800 dark:text-white leading-tight">{ar}</div>
                <div className="text-slate-500 dark:text-neutral-400 leading-snug mt-0.5">{en}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-neutral-500 text-center pt-1">
          الباقة المجانية — واجهة عربية فقط · Free package is Arabic-only. Paid tiers unlock the full bilingual English + Arabic experience.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <a
          href={`/admin/showroom/${id}/inventory`}
          className="rounded-xl border border-black/10 p-5 text-center hover:bg-black/[.02] transition shadow-sm"
        >
          <div className="text-4xl font-extrabold text-blue-600">{listingCount?.n ?? 0}</div>
          <div className="text-xs font-bold opacity-70 mt-1">سيارات معروضة بالمخزون</div>
        </a>
        <a
          href={`/admin/showroom/${id}/gallery`}
          className="rounded-xl border border-black/10 p-5 text-center hover:bg-black/[.02] transition shadow-sm"
        >
          <div className="text-4xl font-extrabold text-purple-600">{galleryCount?.n ?? 0}</div>
          <div className="text-xs font-bold opacity-70 mt-1">صور في الأستوديو</div>
        </a>
      </div>

      {/* Main Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold opacity-70">إدارة المعرض</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href={`/admin/showroom/${id}/content`}
            className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition"
          >
            <span className="text-2xl">🎨</span>
            <div>
              <div className="font-bold text-sm text-emerald-600">Content Studio</div>
              <div className="text-xs opacity-60">أقسام، صور، كاروسيل، بلوج</div>
            </div>
          </a>

          <a
            href={`/admin/showroom/${id}/inventory/new`}
            className="flex items-center gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition"
          >
            <span className="text-2xl">🚗</span>
            <div>
              <div className="font-bold text-sm text-blue-600">+ إضافة سيارة جديدة</div>
              <div className="text-xs opacity-60">تحديد السعر والمواصفات وحاسبة التقسيط</div>
            </div>
          </a>

          <a
            href={`/admin/showroom/${id}/gallery`}
            className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition"
          >
            <span className="text-2xl">📸</span>
            <div>
              <div className="font-bold text-sm text-purple-600">رفع صور من الموبايل</div>
              <div className="text-xs opacity-60">فتح الكاميرا وضغط الصور تلقائياً</div>
            </div>
          </a>

          <a
            href={`/admin/showroom/${id}/applications`}
            className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition"
          >
            <span className="text-2xl">🔐</span>
            <div>
              <div className="font-bold text-sm text-amber-700">تراخيص التطبيقات</div>
              <div className="text-xs opacity-60">CRM، السوق، والمحاسبة اختيارية</div>
            </div>
          </a>
          <a
            href={`/admin/showroom/${id}/activity`}
            className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition"
          >
            <span className="text-2xl">📈</span>
            <div>
              <div className="font-bold text-sm text-cyan-700">Website activity</div>
              <div className="text-xs opacity-60">Views, vehicle clicks, and contact-link clicks</div>
            </div>
          </a>
          {showroom.published === 1
            && isVendorLeadBusinessType(showroom.type_id)
            && (user.role === 'platform_admin' || (membership?.status === 'active' && ['owner', 'sales'].includes(membership.role))) ? (
            <a
              href={`/admin/showroom/${id}/leads`}
              className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition"
            >
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-bold text-sm text-emerald-700">Landing-page CRM</div>
                <div className="text-xs opacity-60">استفسارات الصفحة ومهام المتابعة</div>
              </div>
            </a>
          ) : null}
          {user.role === 'platform_admin'
            || (membership?.status === 'active' && ['owner', 'accountant'].includes(membership.role)) ? (
            <a
              href={`/admin/showroom/${id}/accounting-drafts`}
              className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition hover:bg-amber-500/10"
            >
              <span className="text-2xl">🧾</span>
              <div>
                <div className="text-sm font-bold text-amber-700">مسودات المحاسبة</div>
                <div className="text-xs opacity-60">مراجعة واعتماد عمليات ERP المرتبطة</div>
              </div>
            </a>
          ) : null}
          {showroom.published === 1
            && (user.role === 'platform_admin'
              || (membership?.status === 'active' && ['owner', 'sales'].includes(membership.role))) ? (
            <a
              href={`/admin/showroom/${id}/social`}
              className="flex items-center gap-3 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4 transition hover:bg-fuchsia-500/10"
            >
              <span className="text-2xl">📣</span>
              <div>
                <div className="text-sm font-bold text-fuchsia-700">إدارة المحتوى الاجتماعي</div>
                <div className="text-xs opacity-60">مسودات، مشاركة يدوية، وتقويم حسب الباقة</div>
              </div>
            </a>
          ) : null}
        </div>
      </div>
      {user.role === 'platform_admin' || (membership?.status === 'active' && membership.role === 'owner')
        ? <BusinessTeamManager businessId={id} isPlatformAdmin={user.role === 'platform_admin'} />
        : null}
    </div>
  );
}
