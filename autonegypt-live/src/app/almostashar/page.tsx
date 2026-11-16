'use client';

import { useState } from 'react';
import Link from 'next/link';

type Step = 'phone' | 'otp' | 'done';

export default function AlmostasharLoginPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/vendor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', phone }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; demoOtp?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'حدث خطأ. حاول مرة أخرى.');
        return;
      }
      if (data.demoOtp) setDemoOtp(data.demoOtp); // dev mode only
      setStep('otp');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/vendor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', phone, code: otp }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; role?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'كود غير صحيح. حاول مرة أخرى.');
        return;
      }
      setStep('done');
      // Brief pause so the user sees the success message, then redirect
      setTimeout(() => { window.location.href = '/admin'; }, 1200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-white flex flex-col justify-between p-6" dir="rtl">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-4xl w-full mx-auto py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c4a265] to-[#8b7340] flex items-center justify-center font-bold text-black text-sm">
            م
          </div>
          <span className="font-semibold tracking-wider text-sm uppercase text-[#c4a265]">
            AUTOFYON central administration
          </span>
        </div>
        <Link href="/" className="text-xs text-white/50 hover:text-white transition-colors">
          العودة للرئيسية ←
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-white/[0.03] border border-[#c4a265]/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-[#c4a265]/10 border border-[#c4a265]/20 rounded-full text-[11px] font-medium text-[#c4a265] mb-3">
            لوحة الإدارة المركزية
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white mb-2">
            Sign in to <span className="font-normal text-[#c4a265]">AUTOFYON</span>
          </h1>
          <p className="text-xs text-neutral-400">
            {step === 'phone' && 'ادخل رقم موبايلك المرتبط بحسابك على المنصة'}
            {step === 'otp'   && 'ادخل كود التحقق المُرسل إليك'}
            {step === 'done'  && 'تم تسجيل الدخول بنجاح ✓ جاري التحويل…'}
          </p>
        </div>

        {/* Step: phone */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">
                رقم الموبايل (واتساب)
              </label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="01222597304"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#c4a265]/50"
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#c4a265] to-[#a3834a] px-4 py-3.5 text-sm font-semibold text-black shadow-lg shadow-[#c4a265]/20 transition hover:from-[#d1b072] hover:to-[#b09054] disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال…' : 'أرسل كود التحقق'}
            </button>
            <div className="border-t border-white/5 pt-4">
              <Link
                href="/admin"
                className="block w-full rounded-xl border border-[#c4a265]/20 px-4 py-3 text-center text-xs font-medium text-[#c4a265]/70 hover:text-[#c4a265] hover:border-[#c4a265]/40 transition"
              >
                الدخول عبر Cloudflare Access
              </Link>
            </div>
          </form>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {demoOtp && (
              <div className="bg-[#c4a265]/10 border border-[#c4a265]/30 rounded-xl px-4 py-3 text-center">
                <p className="text-[10px] text-[#c4a265]/70 uppercase tracking-widest mb-1">وضع التطوير — كود التحقق</p>
                <p className="text-2xl font-mono font-bold text-[#c4a265] tracking-widest">{demoOtp}</p>
              </div>
            )}
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">
                كود التحقق المُرسل
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm text-center tracking-[0.4em] placeholder:text-neutral-600 focus:outline-none focus:border-[#c4a265]/50"
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#c4a265] to-[#a3834a] px-4 py-3.5 text-sm font-semibold text-black shadow-lg shadow-[#c4a265]/20 transition hover:from-[#d1b072] hover:to-[#b09054] disabled:opacity-50"
            >
              {loading ? 'جاري التحقق…' : 'تحقق وادخل'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('phone'); setOtp(''); setDemoOtp(null); setError(''); }}
              className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition py-1"
            >
              ← تغيير الرقم
            </button>
          </form>
        )}

        {/* Step: success */}
        {step === 'done' && (
          <div className="text-center space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-sm text-neutral-300">تم تسجيل الدخول بنجاح</p>
            <p className="text-xs text-neutral-500">جاري تحويلك للوحة الإدارة…</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center py-4 text-xs text-neutral-500">
        AUTOFYON platform administration &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
