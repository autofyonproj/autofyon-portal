'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface DealerItem {
  id: string;
  name: string;
  category_key: string;
  original_category: string;
  brand: string;
  address: string;
  district: string;
  city: string;
  primary_phone: string;
  whatsapp: string;
  contact_name: string;
  email: string;
  slug: string;
}

interface Props {
  dealers: DealerItem[];
}

const CATEGORIES = [
  { key: 'all', label: 'كل الأنشطة', icon: '🏢' },
  { key: 'showroom', label: 'معارض وتجار السيارات', icon: '🚗' },
  { key: 'authorized_agent', label: 'وكلاء وموزعون', icon: '🛡️' },
  { key: 'service_center', label: 'مراكز صيانة وخدمة', icon: '🔧' },
  { key: 'parts_supplier', label: 'قطع غيار واكسسوارات', icon: '⚙️' },
  { key: 'rental_company', label: 'تأجير وليموزين', icon: '🔑' },
  { key: 'finance_company', label: 'بنوك وتمويل', icon: '💳' },
  { key: 'insurer', label: 'شركات تأمين', icon: '📋' },
];

const GOVERNORATES = [
  'كل المحافظات',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشرقية',
  'الغربية',
  'الدقهلية',
  'القليوبية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'مطروح',
];

export default function DealersDirectoryClient({ dealers }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGov, setSelectedGov] = useState('كل المحافظات');
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredDealers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dealers.filter((d) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'authorized_agent') {
          if (d.category_key !== 'authorized_agent' && d.category_key !== 'distributor') return false;
        } else if (d.category_key !== selectedCategory) {
          return false;
        }
      }

      // Governorate match
      if (selectedGov !== 'كل المحافظات' && d.city !== selectedGov) {
        return false;
      }

      // Search match
      if (q) {
        const text = `${d.name} ${d.district} ${d.address} ${d.brand} ${d.contact_name} ${d.primary_phone}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [dealers, search, selectedCategory, selectedGov]);

  const visibleItems = filteredDealers.slice(0, visibleCount);

  const getBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'showroom':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'authorized_agent':
      case 'distributor':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'service_center':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'parts_supplier':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rental_company':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'finance_company':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'insurer':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-white/5 text-neutral-300 border-white/10';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'showroom':
        return 'معرض سيارات';
      case 'authorized_agent':
        return 'وكيل معتمد';
      case 'distributor':
        return 'موزع معتمد';
      case 'service_center':
        return 'مركز خدمة وصيانة';
      case 'parts_supplier':
        return 'قطع غيار واكسسوارات';
      case 'rental_company':
        return 'تأجير سيارات وليموزين';
      case 'finance_company':
        return 'تمويل وتقسيط';
      case 'insurer':
        return 'تأمين سيارات';
      default:
        return 'نشاط معتمد';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Search & Filter Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#111622]/90 to-[#07090c]/95 backdrop-blur-2xl shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute right-3.5 top-3.5 text-neutral-400 text-base">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="ابحث باسم المعرض، الماركة، المنطقة، أو التليفون (مثال: أوتو ون، تويوتا، مدينة نصر)..."
              className="w-full pr-10 pl-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/60 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-3 top-3 text-neutral-400 hover:text-white text-xs bg-white/5 px-2 py-1 rounded-md"
              >
                مسح
              </button>
            )}
          </div>

          {/* Governorate Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedGov}
              onChange={(e) => {
                setSelectedGov(e.target.value);
                setVisibleCount(24);
              }}
              className="w-full py-3 px-3.5 bg-black/50 border border-white/10 rounded-2xl text-white text-xs sm:text-sm focus:outline-none focus:border-red-500/60 transition cursor-pointer"
            >
              {GOVERNORATES.map((g) => (
                <option key={g} value={g} className="bg-neutral-900 text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.key);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Result counter */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <span>
            يتم عرض <strong className="text-white font-mono">{filteredDealers.length.toLocaleString('ar-EG')}</strong> كيان معتمد
            {selectedGov !== 'كل المحافظات' && ` في محافظة ${selectedGov}`}
          </span>
          {(search || selectedCategory !== 'all' || selectedGov !== 'كل المحافظات') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedGov('كل المحافظات');
                setVisibleCount(24);
              }}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              إعادة ضبط الفلاتر ↺
            </button>
          )}
        </div>
      </div>

      {/* Grid of Dealers */}
      {visibleItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-white/10 bg-white/[0.02] space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-lg font-bold text-white">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs text-neutral-400">جرب تعديل كلمات البحث أو اختيار كل المحافظات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visibleItems.map((item) => {
            const hasWhatsapp = item.whatsapp && item.whatsapp.length >= 7;
            const waHref = hasWhatsapp
              ? `https://wa.me/2${item.whatsapp}?text=${encodeURIComponent(
                  `مرحباً، أتواصل مع ${item.name} بخصوص عروض وخدمات السيارات المعروضة على منصة أوتوفيون.`
                )}`
              : null;
            const telHref = item.primary_phone ? `tel:${item.primary_phone}` : null;

            return (
              <article
                key={item.id}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 hover:border-red-500/40 hover:bg-white/[0.06] transition-all flex flex-col justify-between shadow-xl space-y-4"
              >
                <div className="space-y-3">
                  {/* Category and Location Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                        item.category_key
                      )}`}
                    >
                      {getCategoryLabel(item.category_key)}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                      <span>📍</span>
                      <span>{item.city}</span>
                      {item.district && item.district !== 'المركز الرئيسي' && (
                        <span>• {item.district}</span>
                      )}
                    </span>
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <h3 className="font-black text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    {item.brand && (
                      <p className="text-[11px] text-amber-400/90 font-semibold mt-0.5 flex items-center gap-1">
                        <span>🏷️</span>
                        <span>متخصص في: {item.brand}</span>
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  {item.address && (
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.address}
                    </p>
                  )}

                  {/* Contact Person */}
                  {item.contact_name && (
                    <p className="text-[11px] text-neutral-500">
                      مسؤول الاتصال: <span className="text-neutral-300 font-medium">{item.contact_name}</span>
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  {waHref && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition"
                      title="محادثة واتساب"
                    >
                      <span>💬</span>
                      <span>واتساب</span>
                    </a>
                  )}

                  {telHref && (
                    <a
                      href={telHref}
                      className="inline-flex items-center justify-center gap-1 py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-200 hover:text-white transition"
                      title="اتصال هاتفي"
                    >
                      <span>📞</span>
                      <span dir="ltr">{item.primary_phone}</span>
                    </a>
                  )}

                  {/* Showroom starter landing page link if available */}
                  <Link
                    href={`/p/${item.slug}`}
                    className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-xs font-bold text-red-300 transition"
                    title="معاينة الصفحة التسويقية"
                  >
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredDealers.length && (
        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="px-8 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs sm:text-sm font-bold text-white transition-all shadow-lg hover:scale-[1.02]"
          >
            عرض المزيد ({filteredDealers.length - visibleCount} كيان متبقي) ↓
          </button>
        </div>
      )}
    </div>
  );
}
