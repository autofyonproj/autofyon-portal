'use client';

import { useState, useCallback } from 'react';
import type { StudioBlog, ContentPermissions } from '@/lib/content-admin';

/** Section-aware article starters — engine, exterior, interior, comfort, tech, safety */
const ARTICLE_TEMPLATES: Record<string, { en: string; ar: string; titleEn: string; titleAr: string }> = {
  sec_auto_engine: {
    titleEn: 'Engine & Performance Deep Dive',
    titleAr: 'المحرك والأداء — تفصيل كامل',
    en: `The engine powering this model delivers exceptional performance for the Egyptian market.\n\nKey highlights:\n- Displacement and configuration\n- Peak power output and RPM band\n- Torque figure and delivery characteristics\n- Fuel system and injection technology\n\nIn everyday driving conditions on Cairo roads, the engine manages...\n\n(Edit this article with the official agency brochure specs for 100% accuracy.)`,
    ar: `يقدم المحرك الذي يشغّل هذا الطراز أداءً استثنائياً مناسباً لمتطلبات السوق المصري.\n\nأبرز الخصائص:\n- سعة الأسطوانات والتوليفة الميكانيكية\n- القوة القصوى ونطاق دورات المحرك\n- العزم وخصائص التوصيل\n- منظومة الوقود وتقنية الحقن\n\nفي ظروف القيادة اليومية على طرق القاهرة، يُدير المحرك...\n\n(يُرجى تعديل هذا المقال بالمواصفات الرسمية من كتيب الوكيل.)`,
  },
  sec_auto_exterior: {
    titleEn: 'Exterior Design & Styling',
    titleAr: 'التصميم الخارجي والأناقة',
    en: `The exterior design language combines bold proportions with refined details.\n\nDesign pillars:\n- Front fascia and grille identity\n- Side profile and character lines\n- Rear design and lighting signature\n- Available colour palette and finish options\n\nMeasured dimensions: ...\n\n(Replace with figures from the official agency brochure.)`,
    ar: `يجمع تصميم الهيكل الخارجي بين النسب الجريئة والتفاصيل الأنيقة.\n\nمحاور التصميم:\n- الواجهة الأمامية وهوية الشبكة\n- الملف الجانبي وخطوط الطابع المميز\n- التصميم الخلفي وبصمة الإضاءة\n- لوحة الألوان المتاحة وخيارات الطلاء\n\nالأبعاد المقاسة: ...\n\n(استبدل بالأرقام من كتيب الوكيل الرسمي.)`,
  },
  sec_auto_interior: {
    titleEn: 'Interior Comfort & Cabin Quality',
    titleAr: 'الراحة الداخلية وجودة المقصورة',
    en: `The cabin is designed around driver wellbeing and passenger comfort.\n\nNotable features:\n- Dashboard layout and driver ergonomics\n- Seating material and adjustment range\n- Infotainment system and connectivity\n- Storage solutions and practicality\n\n(Edit with official agency interior specification details.)`,
    ar: `صُمّمت المقصورة بمحورية راحة السائق ومسافري المركبة.\n\nأبرز الميزات:\n- تخطيط لوحة القيادة وبيئة العمل\n- مادة المقاعد ونطاق التعديل\n- نظام المعلومات والترفيه والاتصال\n- حلول التخزين والعملية\n\n(يُرجى التعديل بمواصفات المقصورة الرسمية من الوكيل.)`,
  },
  sec_auto_safety: {
    titleEn: 'Safety Systems & NCAP Rating',
    titleAr: 'منظومة الأمان وتقييم NCAP',
    en: `Safety is built into every driving situation with active and passive systems.\n\nSafety equipment:\n- Number and position of airbags\n- ABS + EBD + ESC electronic aids\n- Advanced driver assistance (ADAS) features\n- NCAP crash-test rating (year/region)\n\n(Confirm with official agency safety sheet.)`,
    ar: `السلامة مدمجة في كل موقف قيادة من خلال منظومات نشطة وسلبية.\n\nمعدات السلامة:\n- عدد الوسائد الهوائية ومواضعها\n- ABS + EBD + ESC مساعدات إلكترونية\n- مزايا مساعدة السائق المتقدمة (ADAS)\n- تقييم اختبار الاصطدام NCAP (العام/المنطقة)\n\n(تأكيد من الورقة الرسمية للأمان من الوكيل.)`,
  },
  sec_auto_technology: {
    titleEn: 'Technology & Connectivity',
    titleAr: 'التقنية والاتصال',
    en: `Modern tech features keep driver and passengers connected and in control.\n\nTechnology highlights:\n- Infotainment screen size and operating system\n- Apple CarPlay / Android Auto\n- Over-the-air (OTA) update capability\n- Digital instrument cluster\n- Driver assistance tech\n\n(Verify features with official agency tech sheet.)`,
    ar: `تبقي الميزات التقنية الحديثة السائق والركاب في تواصل دائم وسيطرة كاملة.\n\nأبرز التقنيات:\n- حجم شاشة المعلومات والترفيه ونظام التشغيل\n- Apple CarPlay / Android Auto\n- إمكانية التحديث عبر الهواء (OTA)\n- لوحة قيادة رقمية\n- تقنيات مساعدة السائق\n\n(تحقق من الميزات من الورقة التقنية الرسمية للوكيل.)`,
  },
  sec_auto_specs: {
    titleEn: 'Full Technical Specifications',
    titleAr: 'المواصفات الفنية الكاملة',
    en: `Complete specification overview for buyers comparing this model.\n\nCategories covered:\n- Engine & drivetrain\n- Dimensions & weights\n- Chassis & suspension\n- Infotainment & comfort\n- Safety\n\nAll specs sourced from official Global Auto / Mercedes / Hyundai Egypt brochures.\n\n(Paste the specs here from the official brochure.)`,
    ar: `نظرة شاملة على المواصفات للمشترين الذين يقارنون هذا الطراز.\n\nالفئات المشمولة:\n- المحرك والدفع\n- الأبعاد والأوزان\n- الهيكل والتعليق\n- المعلومات والترفيه والراحة\n- السلامة\n\nجميع المواصفات مصدرها كتيبات الوكيل الرسمي.\n\n(الصق المواصفات هنا من الكتيب الرسمي.)`,
  },
};

interface Props {
  businessId: string;
  sectionId: string;
  blogs: StudioBlog[];
  permissions: ContentPermissions;
  onUpdate: (blogs: StudioBlog[]) => void;
}

export default function BlogEditor({
  businessId, sectionId, blogs, permissions, onUpdate,
}: Props) {
  const [editing, setEditing] = useState<StudioBlog | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [content, setContent] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [status, setStatus] = useState('draft');
  const [showOnMinisite, setShowOnMinisite] = useState(1);
  const [saving, setSaving] = useState(false);

  const template = ARTICLE_TEMPLATES[sectionId];

  const reset = useCallback(() => {
    setEditing(null);
    setCreating(false);
    setTitle(''); setTitleAr('');
    setContent(''); setContentAr('');
    setStatus('draft'); setShowOnMinisite(1);
  }, []);

  const startCreate = () => {
    reset();
    setCreating(true);
    if (template) {
      setTitle(template.titleEn);
      setTitleAr(template.titleAr);
      setContent(template.en);
      setContentAr(template.ar);
    }
  };

  const startEdit = (blog: StudioBlog) => {
    setEditing(blog);
    setTitle(blog.title ?? '');
    setTitleAr(blog.title_ar ?? '');
    setContent(blog.content ?? '');
    setContentAr(blog.content_ar ?? '');
    setStatus(blog.status);
    setShowOnMinisite(blog.show_on_minisite);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch('/api/admin/blogs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editing.id,
            title, title_ar: titleAr,
            content, content_ar: contentAr,
            status, show_on_minisite: showOnMinisite,
          }),
        });
        if (res.ok) {
          onUpdate(blogs.map((b) =>
            b.id === editing.id
              ? { ...b, title, title_ar: titleAr, content, content_ar: contentAr, status, show_on_minisite: showOnMinisite }
              : b,
          ));
        }
      } else if (creating) {
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId, section_id: sectionId,
            title, title_ar: titleAr,
            content, content_ar: contentAr,
            status, show_on_minisite: showOnMinisite,
          }),
        });
        if (res.ok) {
          const data = await res.json() as { id: string; status: string };
          onUpdate([
            { id: data.id, section_id: sectionId, title, title_ar: titleAr, content, content_ar: contentAr, status: data.status, show_on_minisite: showOnMinisite },
            ...blogs,
          ]);
        }
      }
      reset();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog entry?')) return;
    const res = await fetch('/api/admin/blogs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) onUpdate(blogs.filter((b) => b.id !== id));
  };

  const statusColors: Record<string, string> = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const sectionLabel = sectionId.replace('sec_auto_', '').replace('sec_1_', '').replace(/_/g, ' ');

  return (
    <div className="space-y-4">
      {/* Header & tip */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-sm capitalize">📰 Blog & Articles — {sectionLabel}</h3>
          <p className="text-xs opacity-55 mt-0.5">
            Write detailed articles for this section. They appear below the specs on the car minisite.
            {template ? ' A starter template is pre-loaded when you create a new entry.' : ''}
          </p>
        </div>
        {permissions.canWriteBlog && !creating && !editing && (
          <button
            onClick={startCreate}
            className="shrink-0 px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Article
          </button>
        )}
      </div>

      {/* Template hint banner */}
      {template && !creating && !editing && blogs.length === 0 && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/10 p-3 text-xs text-blue-800 dark:text-blue-300">
          <span className="font-bold">💡 Starter template available</span> — Click "New Article" to get a pre-filled article for the{' '}
          <span className="font-semibold capitalize">{sectionLabel}</span> section in both English and Arabic.
        </div>
      )}

      {/* Editor form */}
      {(creating || editing) && (
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">
              {editing ? '✏️ Editing Article' : `✨ New Article — ${sectionLabel}`}
            </h3>
            {template && creating && (
              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 rounded-full font-bold">
                Template pre-loaded ↓
              </span>
            )}
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold opacity-60 block mb-1">Title — English</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-black/15 dark:border-white/20 bg-transparent"
                placeholder="English title..."
              />
            </div>
            <div>
              <label className="text-[11px] font-bold opacity-60 block mb-1">العنوان — عربي</label>
              <input
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-black/15 dark:border-white/20 bg-transparent"
                placeholder="العنوان بالعربية..."
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold opacity-60 block mb-1">Content — English</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-black/15 dark:border-white/20 bg-transparent resize-y font-mono text-xs leading-relaxed"
                placeholder="English article text..."
              />
            </div>
            <div>
              <label className="text-[11px] font-bold opacity-60 block mb-1">المحتوى — عربي</label>
              <textarea
                dir="rtl"
                rows={10}
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-black/15 dark:border-white/20 bg-transparent resize-y font-mono text-xs leading-relaxed"
                placeholder="نص المقال بالعربية..."
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-4 flex-wrap border-t border-black/10 dark:border-white/10 pt-3">
            <div>
              <label className="text-[11px] font-bold opacity-60 me-2">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/20 bg-transparent"
              >
                <option value="draft">Draft (غير منشور)</option>
                <option value="pending">Pending Review (في انتظار المراجعة)</option>
                {permissions.canApprove && <option value="published">Published ✅ (منشور)</option>}
              </select>
            </div>
            <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showOnMinisite === 1}
                onChange={(e) => setShowOnMinisite(e.target.checked ? 1 : 0)}
                className="w-3.5 h-3.5 accent-blue-600"
              />
              Show on minisite
            </label>
            <div className="flex gap-2 justify-end flex-1">
              <button onClick={reset} className="text-xs px-3 py-1.5 opacity-60 hover:opacity-100">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || (!title && !titleAr)}
                className="text-xs px-5 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-40"
              >
                {saving ? 'Saving...' : '💾 Save Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog list */}
      {blogs.length === 0 && !creating ? (
        <p className="text-sm opacity-50 text-center py-8">
          No articles for this section yet.{' '}
          {permissions.canWriteBlog && (
            <button onClick={startCreate} className="text-blue-600 underline font-semibold">Create the first one →</button>
          )}
        </p>
      ) : (
        <div className="space-y-2">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className={`group relative p-3 rounded-lg border transition cursor-pointer hover:bg-black/[.02] dark:hover:bg-white/[.03] ${
                editing?.id === blog.id
                  ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-black/10 dark:border-white/10'
              }`}
              onClick={() => startEdit(blog)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColors[blog.status] ?? statusColors.draft}`}>
                  {blog.status}
                </span>
                {blog.show_on_minisite === 1 && (
                  <span className="text-[10px] opacity-50">visible on minisite</span>
                )}
              </div>
              <div className="text-sm font-medium truncate">{blog.title || blog.title_ar || '(untitled)'}</div>
              {blog.title_ar && blog.title && (
                <div className="text-xs opacity-50 truncate" dir="rtl">{blog.title_ar}</div>
              )}
              {blog.content && (
                <div className="text-xs opacity-40 truncate mt-1">{blog.content.slice(0, 100)}...</div>
              )}
              {permissions.canApprove && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(blog.id); }}
                  className="absolute top-2 end-2 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
