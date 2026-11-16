'use client';

import { useState } from 'react';

interface InstallmentCalculatorProps {
  showroomName: string;
  whatsappNumber?: string;
  defaultPrice?: number;
}

export default function InstallmentCalculatorClient({
  showroomName,
  whatsappNumber,
  defaultPrice = 1200000,
}: InstallmentCalculatorProps) {
  const [carPrice, setCarPrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(36);
  const [planType, setPlanType] = useState<'bank' | 'direct'>('bank');

  // Annual interest rate: Bank ~17% flat/yr approx, Direct ~22%
  const annualRate = planType === 'bank' ? 0.17 : 0.22;
  const downPaymentAmount = Math.round(carPrice * (downPaymentPercent / 100));
  const loanAmount = Math.max(0, carPrice - downPaymentAmount);
  const totalInterest = Math.round(loanAmount * annualRate * (months / 12));
  const totalPayable = loanAmount + totalInterest;
  const monthlyInstallment = months > 0 ? Math.round(totalPayable / months) : 0;

  const rawWhatsapp = (whatsappNumber || '').replace(/\D/g, '');
  const inquiryText = encodeURIComponent(
    `مرحباً، أود الاستفسار عن تفاصيل التقسيط لدى معرض ${showroomName}:\n` +
    `• سعر السيارة التقريبي: ${carPrice.toLocaleString('ar-EG')} ج.م\n` +
    `• المقدم المقترح: ${downPaymentAmount.toLocaleString('ar-EG')} ج.م (${downPaymentPercent}%)\n` +
    `• مدة التقسيط: ${months} شهر (${planType === 'bank' ? 'تقسيط بنكي' : 'تقسيط مباشر'})\n` +
    `• القسط الشهري المتوقع: ${monthlyInstallment.toLocaleString('ar-EG')} ج.م\n` +
    `يرجى إفادتي بالأوراق والمستندات المطلوبة وتأكيد موعد المعاينة.`
  );
  const whatsappUrl = rawWhatsapp.length >= 7 ? `https://wa.me/${rawWhatsapp}?text=${inquiryText}` : '';

  const pricePresets = [500000, 850000, 1200000, 1800000, 2500000, 3500000];
  const downPaymentPresets = [20, 25, 30, 40, 50];
  const monthPresets = [12, 24, 36, 48, 60];

  return (
    <section id="calculator" className="mt-14 scroll-mt-20 rounded-3xl border border-white/10 bg-gradient-to-b from-[#111622]/90 via-[#0c1017]/95 to-[#07090c] p-5 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold mb-2">
            <span className="animate-pulse">⚡</span>
            <span>حاسبة التمويل والتقسيط الذكية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            احسب قسط سيارتك لدى {showroomName}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            عدل السعر والمقدم والمدة لمعاينة خطة التقسيط المباشرة أو البنكية فوراً
          </p>
        </div>

        {/* Plan Type Selector */}
        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setPlanType('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              planType === 'bank'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏦 تقسيط بنكي (فائدة مخفضة)
          </button>
          <button
            type="button"
            onClick={() => setPlanType('direct')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              planType === 'direct'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🤝 مباشر من المعرض (بدون بنك)
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Price Input & Presets */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-300">سعر السيارة التقديري:</label>
              <span className="font-extrabold text-lg text-white font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10" dir="ltr">
                {carPrice.toLocaleString('ar-EG')} ج.م
              </span>
            </div>

            <input
              type="range"
              min={300000}
              max={6000000}
              step={25000}
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {pricePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCarPrice(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                    carPrice === preset
                      ? 'bg-white/15 border-red-500/50 text-white font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {(preset / 1000).toLocaleString('ar-EG')} ألف
                </button>
              ))}
            </div>
          </div>

          {/* Down Payment % & Presets */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-300">نسبة المقدم الدفعة الأولى:</label>
              <div className="text-right">
                <span className="font-extrabold text-base text-emerald-400">
                  {downPaymentPercent}%
                </span>
                <span className="text-[11px] text-neutral-400 mr-2">
                  ({downPaymentAmount.toLocaleString('ar-EG')} ج.م)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={10}
              max={70}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {downPaymentPresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                    downPaymentPercent === pct
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pct}% مقدم
                </button>
              ))}
            </div>
          </div>

          {/* Months & Presets */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-300">فترة السداد والتقسيط:</label>
              <span className="font-extrabold text-base text-amber-400">
                {months} شهر ({months / 12} {months === 12 ? 'سنة' : months <= 24 ? 'سنتين' : 'سنوات'})
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {monthPresets.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                    months === m
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{m} شهر</span>
                  <span className="text-[9px] opacity-70">{m / 12} {m === 12 ? 'سنة' : 'سنين'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              تفاصيل الخطة التقديرية
            </span>

            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-black/60 border border-red-500/30 text-center">
              <span className="text-[11px] font-semibold text-neutral-300 block mb-1">
                القسط الشهري التقريبي
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight" dir="ltr">
                {monthlyInstallment.toLocaleString('ar-EG')}{' '}
                <span className="text-xs text-red-400 font-sans font-bold">ج.م / شهر</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-neutral-400">سعر السيارة الإجمالي:</span>
                <span className="font-bold text-white">{carPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-neutral-400">الدفعة الأولى ({downPaymentPercent}%):</span>
                <span className="font-bold text-emerald-400">{downPaymentAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-neutral-400">المبلغ المتبقي للتمويل:</span>
                <span className="font-bold text-white">{loanAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-neutral-400">مدة التقسيط:</span>
                <span className="font-bold text-amber-300">{months} شهر ({planType === 'bank' ? 'بنكي' : 'مباشر'})</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 font-black text-sm text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <span>💬</span>
                <span>اطلب تفاصيل وحجز هذا القسط عبر واتساب</span>
              </a>
            ) : (
              <div className="text-center text-xs text-neutral-400 py-2">
                تواصل مع إدارة المعرض لتأكيد الحسبة والأوراق
              </div>
            )}
            <p className="text-[10px] text-center text-neutral-500">
              * الأرقام المذكورة استرشادية وتخضع للموافقة الائتمانية والبنكية ولوائح المعرض
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
