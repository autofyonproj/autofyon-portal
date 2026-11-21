'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DownloadInfo {
  companyName: string;
  phone: string;
  serial: string;
  tier: string;
  tierNameAr: string;
  version: string;
  installerFileName: string;
  installerContent: string;
  licenseConfig: Record<string, unknown>;
}

export default function DownloadPage() {
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [info, setInfo] = useState<DownloadInfo | null>(null);

  // Check query params if passed from WhatsApp or confirmation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPhone = params.get('phone');
      const qCode = params.get('code');
      if (qPhone) setPhone(qPhone);
      if (qCode) setPasscode(qCode);
    }
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/packages/verify-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, passcode }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; downloadInfo?: DownloadInfo };
      if (!res.ok || !data.ok || !data.downloadInfo) {
        setErrorMsg(data.error || 'كود التحميل غير صحيح أو انتهت صلاحيته.');
        return;
      }
      setInfo(data.downloadInfo);
    } catch {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  }

  function downloadInstaller() {
    if (!info) return;
    const blob = new Blob([info.installerContent], { type: 'application/x-bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = info.installerFileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  function downloadLicenseJson() {
    if (!info) return;
    const blob = new Blob([JSON.stringify(info.licenseConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${info.serial}-license.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-white flex flex-col justify-between p-6" dir="rtl">
      
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-4xl w-full mx-auto py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a265] to-[#8b7340] flex items-center justify-center font-bold text-black text-sm">
            أ
          </div>
          <span className="font-semibold tracking-wider text-sm uppercase text-[#c4a265]">
            AUTOFYON package download center
          </span>
        </div>
        <Link href="/packages" className="text-xs text-white/60 hover:text-white transition-colors">
          استعراض الباقات والحلول ←
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-12 bg-white/[0.03] border border-[#c4a265]/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        
        {!info ? (
          <div>
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 bg-[#c4a265]/10 border border-[#c4a265]/20 rounded-full text-[11px] font-bold text-[#c4a265] mb-3">
                مركز تحميل وتفعيل باقات المعارض
              </div>
              <h1 className="text-2xl font-black text-white mb-2">
                أدخل كود التحميل (Passcode) لفتح باقتك
              </h1>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                ادخل رقم هاتفك المسجل وكود التحميل المكون من 6 أرقام (أو السيريال) الذي وصلك عبر الواتساب من إدارة المنصة.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 mb-6 text-center leading-relaxed">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 mb-1.5 font-bold">
                  رقم الموبايل المسجل (واتساب) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-[#c4a265]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 mb-1.5 font-bold">
                  كود التحميل السري (Passcode) *
                </label>
                <input
                  type="text"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="مثال: 842190 أو AFY-2026-..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm tracking-widest text-[#c4a265] font-black focus:outline-none focus:border-[#c4a265]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] disabled:opacity-50 transition-all shadow-lg shadow-[#c4a265]/20"
                >
                  {loading ? 'جاري التحقق من الكود...' : 'التحقق وفتح ملفات التحميل ✓'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <span className="text-xs text-neutral-400">ليس لديك كود تحميل بعد؟</span>{' '}
              <Link href="/packages" className="text-xs font-bold text-[#c4a265] hover:underline">
                اختر باقتك وسجل طلبك مجاناً الآن
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center text-xl mx-auto mb-3">
                ✓
              </div>
              <span className="text-[11px] font-bold text-[#c4a265] block mb-1">
                تم تفعيل وترخيص النسخة بنجاح
              </span>
              <h2 className="text-2xl font-black text-white">{info.companyName}</h2>
              <div className="flex justify-center gap-2 mt-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c4a265]/20 text-[#c4a265] border border-[#c4a265]/30">
                  {info.tierNameAr}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  سيريال: {info.serial}
                </span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadInstaller}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c4a265] to-[#8b7340] text-black font-extrabold text-sm hover:from-[#d1b072] shadow-xl shadow-[#c4a265]/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>تحميل ملف التثبيت السريع للكمبيوتر (.bat)</span>
                <span>⬇</span>
              </button>

              <button
                onClick={downloadLicenseJson}
                className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>تحميل ملف الترخيص والبيانات (license.json)</span>
                <span>📄</span>
              </button>
            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <h4 className="font-extrabold text-white text-sm">
                تعليمات التثبيت السريع على جهاز المعرض:
              </h4>
              <div className="flex items-start gap-2.5 text-neutral-300">
                <span className="w-5 h-5 rounded-full bg-[#c4a265] text-black font-black flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>احفظ ملف التثبيت <strong>{info.installerFileName}</strong> في مجلد خاص على لابتوب أو كمبيوتر المعرض.</span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-300">
                <span className="w-5 h-5 rounded-full bg-[#c4a265] text-black font-black flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>اضغط كليك يمين على الملف واختر <strong>Run as administrator (تشغيل كمسؤول)</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 text-neutral-300">
                <span className="w-5 h-5 rounded-full bg-[#c4a265] text-black font-black flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>سيفتح البرنامج تلقائياً على متصفحك ويبدأ العمل أوفلاين بدون أي تعقيد.</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link href="/packages" className="text-xs text-neutral-400 hover:text-white">
                ← العودة إلى صفحة الباقات والخدمات
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto py-4 text-center text-xs text-neutral-500 border-t border-white/10">
        جميع الحقوق محفوظة لمنصة أوتوفيون © {new Date().getFullYear()} — بوابتك المتكاملة لتجارة السيارات في مصر
      </div>

    </div>
  );
}
