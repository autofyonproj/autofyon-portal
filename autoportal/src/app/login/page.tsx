'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Detect if this looks like a vendor (has email, not platform admin)
  const isVendorLogin = email.trim() && email.trim() !== 'platformadmin@autofyon.com';

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = isVendorLogin
        ? { email: email.trim(), password }
        : { email: '', password }; // platform admin: master password check

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { ok?: boolean; error?: string; redirect?: string };

      if (!res.ok || !data.ok) {
        setError(data.error || 'فشل تسجيل الدخول: تحقق من البريد أو كلمة المرور');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = data.redirect || '/admin';
      }, 700);
    } catch {
      setError('تعذر الاتصال بالخادم، يرجى المحاولة ثانية');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-white flex flex-col justify-between p-6" dir="rtl">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-4xl w-full mx-auto py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-600/30">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-sm uppercase text-white">
              AUTOFYON<span className="text-red-500">.com</span>
            </span>
            <span className="text-[10px] text-neutral-400">بوابة الإدارة المركزية وحماية البيانات</span>
          </div>
        </div>
        <Link href="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
          العودة للمنصة الرئيسية ←
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] font-semibold text-red-400 mb-3">
            بوابة الإدارة المعتمدة المشفرة
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            تسجيل الدخول إلى <span className="text-red-500">AUTOFYON</span>
          </h1>
          <p className="text-xs text-neutral-400">
            يجب إدخال البريد الإلكتروني وكلمة المرور المشفرة للوصول للبيانات ولوحة التحكم
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-300 mb-1.5 font-medium">
              البريد الإلكتروني (الإدارة أو المعرض)
            </label>
            <input
              type="email"
              placeholder="platformadmin@autofyon.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-300 mb-1.5 font-medium">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              autoFocus
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-red-500/50"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs text-center font-medium">
              تم التحقق من بيانات الدخول بنجاح ✓ جاري توجيهك…
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition disabled:opacity-50"
          >
            {loading ? 'جاري التحقق…' : 'تسجيل الدخول الآمن ←'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[11px] text-neutral-500">
            🔒 كافة الجلسات محمية بتشفير HMAC SHA-256 ومسجلة في سجل تدقيق العمليات.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center py-4 text-xs text-neutral-500">
        AUTOFYON Platform Central Management &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
