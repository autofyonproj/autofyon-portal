'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TaxonomyNode = { id: string; name: string; name_ar: string | null; parent_business_id?: string };

export default function NewCarListingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const showroomId = resolvedParams.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [condition, setCondition] = useState('New');
  const [vehicleCategory, setVehicleCategory] = useState('car');
  const [priceEgp, setPriceEgp] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [year, setYear] = useState('2025');
  const [mileageKm, setMileageKm] = useState('0');
  const [engineType, setEngineType] = useState('Petrol');
  const [colorAr, setColorAr] = useState('');
  const [colorEn, setColorEn] = useState('');
  const [powerHp, setPowerHp] = useState('');
  const [displacementCc, setDisplacementCc] = useState('');
  const [transmission, setTransmission] = useState('Automatic');
  const [drivetrain, setDrivetrain] = useState('AWD');
  const [brands, setBrands] = useState<TaxonomyNode[]>([]);
  const [models, setModels] = useState<TaxonomyNode[]>([]);
  const [trims, setTrims] = useState<TaxonomyNode[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  const [taxonomyLoading, setTaxonomyLoading] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/taxonomy/catalog', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json() as { brands?: TaxonomyNode[]; models?: TaxonomyNode[]; trims?: TaxonomyNode[]; error?: string };
        if (!response.ok || !Array.isArray(data.brands) || !Array.isArray(data.models) || !Array.isArray(data.trims)) {
          throw new Error(data.error || 'تعذر تحميل تصنيفات المركبات المعتمدة.');
        }
        if (!active) return;
        setBrands(data.brands);
        setModels(data.models);
        setTrims(data.trims);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'تعذر تحميل تصنيفات المركبات.');
      })
      .finally(() => { if (active) setTaxonomyLoading(false); });
    return () => { active = false; };
  }, []);

  const availableModels = models.filter((model) => model.parent_business_id === selectedBrand);
  const availableTrims = trims.filter((trim) => trim.parent_business_id === selectedModel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!selectedBrand || !selectedModel) {
      setError('اختر الماركة والطراز من تصنيفات AUTOFYON المعتمدة.');
      setLoading(false);
      return;
    }
    if (!photos.length) {
      setError('أضف صورة واحدة على الأقل للسيارة.');
      setLoading(false);
      return;
    }

    const customData = {
      sec_1_identity: {
        business_name: titleEn || titleAr,
        business_name_ar: titleAr,
        tagline: condition === 'New' ? 'In-stock, ready for delivery' : 'Certified pre-owned',
        tagline_ar: condition === 'New' ? 'متوفرة بالمعرض للتسليم الفوري' : 'مستعملة معتمدة بحالة ممتازة',
      },
      sec_listing_price: {
        price_egp: Number(priceEgp) || 0,
        condition,
        vehicle_category: vehicleCategory,
        negotiable,
        year: Number(year) || 2025,
        mileage_km: Number(mileageKm) || 0,
        color: colorEn,
        color_ar: colorAr,
      },
      sec_auto_specs: {
        engine_type: engineType,
        displacement_cc: engineType === 'Electric' ? 0 : Number(displacementCc) || 0,
        power_hp: Number(powerHp) || 0,
        transmission_type: transmission,
        drivetrain: drivetrain,
      },
    };

    try {
      const body = new FormData();
      body.append('listing', JSON.stringify({
        businessId: showroomId,
        brandId: selectedBrand,
        modelId: selectedModel,
        trimId: selectedTrim || null,
        title: titleEn || titleAr,
        titleAr,
        unitKind: condition === 'New' ? 'new' : 'used',
        vehicleCategory,
        year: Number(year),
        mileageKm: Number(mileageKm),
        priceEgp: Number(priceEgp),
        negotiable,
        color: colorEn,
        colorAr,
        specs: customData.sec_auto_specs,
      }));
      photos.forEach((photo) => body.append('photos', photo));
      const res = await fetch('/api/media-manager/listings', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create car listing');
      }

      const listing = await res.json() as { slug: string; publicPath: string };
      const brand = brands.find((item) => item.id === selectedBrand);
      const model = models.find((item) => item.id === selectedModel);
      const trim = trims.find((item) => item.id === selectedTrim);
      const socialDraft = new URLSearchParams({
        vehicleTitle: titleAr,
        vehicleTitleEn: titleEn || titleAr,
        vehicleBrand: brand?.name_ar || brand?.name || '',
        vehicleModel: model?.name_ar || model?.name || '',
        vehicleTrim: trim?.name_ar || trim?.name || '',
        vehicleYear: year,
        vehicleMileage: mileageKm,
        vehiclePrice: priceEgp,
        vehicleUrl: listing.publicPath,
      });
      router.push(new URL(`/media-manager/?${socialDraft.toString()}#workspace`, window.location.origin).href);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create the vehicle listing.');
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold">إضافة سيارة جديدة للمعرض</h1>
          <p className="text-xs opacity-60 mt-1">
            أدخل مواصفات السيارة والأسعار وسيتم تفعيل حاسبة التقسيط وعرضها فورياً على موقعك
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs px-3 py-1.5 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5"
        >
          إلغاء وعودة
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[.01] dark:bg-white/[.01] space-y-4">
          <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400">1. تصنيف السيارة وبياناتها</h3>
          <p className="text-xs opacity-70">اختر الماركة والطراز والفئة من تصنيفات AUTOFYON الرسمية حتى يظهر الإعلان في القسم الصحيح على البوابة.</p>
          {taxonomyLoading ? <p className="text-xs text-neutral-500">جارٍ تحميل تصنيفات المركبات…</p> : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block text-xs font-semibold">الماركة *
              <select required value={selectedBrand} onChange={(event) => { setSelectedBrand(event.target.value); setSelectedModel(''); setSelectedTrim(''); }} disabled={taxonomyLoading} className="mt-1 w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent">
                <option value="">اختر الماركة</option>
                {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name_ar || brand.name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold">الطراز *
              <select required value={selectedModel} onChange={(event) => { setSelectedModel(event.target.value); setSelectedTrim(''); }} disabled={!selectedBrand || taxonomyLoading} className="mt-1 w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent">
                <option value="">اختر الطراز</option>
                {availableModels.map((model) => <option key={model.id} value={model.id}>{model.name_ar || model.name}</option>)}
              </select>
              {selectedBrand && availableModels.length === 0 ? <small className="mt-1 block text-amber-700">لا يوجد طراز مسجل لهذه الماركة. تواصل مع إدارة AUTOFYON لإضافته.</small> : null}
            </label>
            <label className="block text-xs font-semibold">الفئة / التجهيز (اختياري)
              <select value={selectedTrim} onChange={(event) => setSelectedTrim(event.target.value)} disabled={!selectedModel || taxonomyLoading} className="mt-1 w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent">
                <option value="">اختر الفئة</option>
                {availableTrims.map((trim) => <option key={trim.id} value={trim.id}>{trim.name_ar || trim.name}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">اسم الطراز بالعربية *</label>
              <input
                type="text"
                placeholder="مثال: بي إم دابليو X5 xDrive40i"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                required
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">اسم الطراز بالإنجليزية (اختياري)</label>
              <input
                type="text"
                placeholder="e.g. BMW X5 xDrive40i 2025"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-dashed border-black/20 p-4">
              <label htmlFor="vehiclePhotos" className="block text-xs font-semibold mb-2">صور السيارة *</label>
              <input id="vehiclePhotos" type="file" accept="image/*" capture="environment" multiple required
                onChange={(event) => setPhotos(Array.from(event.target.files || []).slice(0, 8))}
                className="w-full text-sm" />
              <p className="mt-2 text-xs opacity-70">
                اختر صورًا من هاتفك أو التقطها بالكاميرا. ستُرفع صور السيارة إلى صفحة الإعلان على AUTOFYON؛ الحد 8 صور، 10 ميجابايت للصورة.
              </p>
              {photos.length ? <p className="mt-2 text-xs font-semibold text-emerald-700">تم اختيار {photos.length} صورة.</p> : null}
            </div>
          </div>
        </div>

        {/* Pricing & Condition */}
        <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[.01] dark:bg-white/[.01] space-y-4">
          <h3 className="font-bold text-sm text-green-600 dark:text-green-400">2. السعر وحالة السيارة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">نوع المركبة</label>
              <select
                value={vehicleCategory}
                onChange={(e) => setVehicleCategory(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              >
                <option value="car">سيارة</option>
                <option value="motorcycle">دراجة نارية</option>
                <option value="scooter">سكوتر</option>
                <option value="commercial">مركبة تجارية</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">السعر المطلوب (جنيه مصري) *</label>
              <input
                type="number"
                placeholder="3250000"
                value={priceEgp}
                onChange={(e) => setPriceEgp(e.target.value)}
                required
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">حالة السيارة</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              >
                <option value="New">جديد كلياً (زيرو)</option>
                <option value="Used">مستعمل</option>
                <option value="Certified Pre-Owned">مستعمل معتمد بالضمان</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">سنة الصنع</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold mb-1">الكيلومترات المقطوعة</label>
              <input
                type="number"
                value={mileageKm}
                onChange={(e) => setMileageKm(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">اللون بالعربية</label>
              <input
                type="text"
                placeholder="مثال: أبيض لؤلؤي"
                value={colorAr}
                onChange={(e) => setColorAr(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Color in English</label>
              <input
                type="text"
                value={colorEn}
                onChange={(e) => setColorEn(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="neg"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="size-4 rounded"
              />
              <label htmlFor="neg" className="text-xs font-medium cursor-pointer">
                السعر قابل للتفاوض البسيط
              </label>
            </div>
          </div>
        </div>

        {/* Engine & Technical Specs */}
        <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[.01] dark:bg-white/[.01] space-y-4">
          <h3 className="font-bold text-sm text-purple-600 dark:text-purple-400">3. المواصفات الفنية والمحرك</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">نوع منظومة الحركة</label>
              <select
                value={engineType}
                onChange={(e) => setEngineType(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent font-medium"
              >
                <option value="Petrol">بنزين (Petrol)</option>
                <option value="Electric">كهرباء بالكامل (EV)</option>
                <option value="Hybrid">هايبرد (Hybrid)</option>
                <option value="PHEV">هايبرد قابل للشحن (PHEV)</option>
                <option value="Diesel">ديزل (Diesel)</option>
              </select>
            </div>

            {engineType !== 'Electric' && (
              <div>
                <label className="block text-xs font-semibold mb-1">السعة اللترية (CC)</label>
                <input
                  type="number"
                  placeholder="مثال: 2000"
                  value={displacementCc}
                  onChange={(e) => setDisplacementCc(e.target.value)}
                  className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">القوة بالحصان (HP)</label>
              <input
                type="number"
                placeholder="مثال: 381"
                value={powerHp}
                onChange={(e) => setPowerHp(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold mb-1">ناقل الحركة</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              >
                <option value="Automatic">أوتوماتيك</option>
                <option value="Manual">يدوي (مانيوال)</option>
                <option value="CVT">CVT</option>
                <option value="DCT">دوال كلاتش (DCT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">نظام الدفع</label>
              <select
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                className="w-full text-sm rounded-lg border border-black/15 dark:border-white/20 p-2.5 bg-transparent"
              >
                <option value="AWD">دفع كلي مستمر (AWD)</option>
                <option value="4WD">دفع رباعي (4WD)</option>
                <option value="FWD">جر أمامي (FWD)</option>
                <option value="RWD">دفع خلفي (RWD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg active:scale-95 transition"
          >
            {loading ? 'جاري نشر السيارة...' : '✓ نشر السيارة وتفعيل الحاسبة فورياً'}
          </button>
        </div>
      </form>
    </div>
  );
}
