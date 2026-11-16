'use client';

import { useCallback, useEffect, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AppAccess {
  crm: boolean;
  marketplace: boolean;
  accounting: boolean;
}

interface BusinessMember {
  membershipId: string;
  userId: string;
  email: string;
  name: string | null;
  role: 'owner' | 'sales';
  status: 'active' | 'suspended' | 'revoked';
  createdAt: string;
  hasPassword: boolean;
  appAccess: AppAccess;
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchMembers(businessId: string): Promise<BusinessMember[]> {
  const res = await fetch(`/api/admin/businesses/${encodeURIComponent(businessId)}/members`, { cache: 'no-store' });
  const data = await res.json() as { members?: BusinessMember[]; error?: string };
  if (!res.ok) throw new Error(data.error || 'تعذر تحميل قائمة الأعضاء');
  return data.members ?? [];
}

// ── App badge ─────────────────────────────────────────────────────────────────

function AppBadge({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold
      ${allowed ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-400 line-through'}`}>
      {allowed ? '✓' : '✗'} {label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BusinessTeamManager({
  businessId,
  isPlatformAdmin = false,
}: {
  businessId: string;
  isPlatformAdmin?: boolean;
}) {
  const [members, setMembers] = useState<BusinessMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Add member form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'sales' | 'owner'>('sales');

  // Password reset panel
  const [resetTarget, setResetTarget] = useState<string | null>(null); // membershipId
  const [resetPassword, setResetPassword] = useState('');

  const activeSales = members.filter((m) => m.role === 'sales' && m.status !== 'revoked');
  const owner = members.find((m) => m.role === 'owner');
  const salesCount = activeSales.length;
  const totalSeats = 5; // 1 owner + 4 sales
  const usedSeats = (owner ? 1 : 0) + salesCount;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setMembers(await fetchMembers(businessId)); }
    catch (e) { setError(e instanceof Error ? e.message : 'خطأ'); }
    finally { setLoading(false); }
  }, [businessId]);

  useEffect(() => { void load(); }, [load]);

  // ── Add member ──────────────────────────────────────────────────────────────
  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      const res = await fetch(`/api/admin/businesses/${encodeURIComponent(businessId)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password: password || undefined }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'فشل إضافة العضو');
      setName(''); setEmail(''); setPassword(''); setRole('sales');
      setMessage(data.message || 'تم إضافة الحساب بنجاح ✓');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'خطأ'); }
    finally { setSaving(false); }
  }

  // ── Status change ───────────────────────────────────────────────────────────
  async function changeStatus(member: BusinessMember, status: BusinessMember['status']) {
    if (!window.confirm(`${status === 'revoked' ? 'إلغاء' : status === 'suspended' ? 'تعليق' : 'تفعيل'} صلاحيات ${member.name || member.email}؟`)) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const res = await fetch(`/api/admin/businesses/${encodeURIComponent(businessId)}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId: member.membershipId, status }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'فشل تحديث الحالة');
      setMessage('تم تحديث حالة الحساب ✓');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'خطأ'); }
    finally { setSaving(false); }
  }

  // ── Reset password ──────────────────────────────────────────────────────────
  async function resetPw(membershipId: string) {
    if (!resetPassword || resetPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return;
    }
    setSaving(true); setError(''); setMessage('');
    try {
      const res = await fetch(`/api/admin/businesses/${encodeURIComponent(businessId)}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId, newPassword: resetPassword }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'فشل تحديث كلمة المرور');
      setMessage(data.message || 'تم تحديث كلمة المرور ✓');
      setResetTarget(null); setResetPassword('');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'خطأ'); }
    finally { setSaving(false); }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-5 rounded-2xl border border-black/10 bg-white p-5">
      {/* Header + seats overview */}
      <header className="border-b border-black/8 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {isPlatformAdmin ? 'إدارة فريق العمل والصلاحيات' : 'فريق العمل والوصول للتطبيقات'}
            </h2>
            <p className="mt-1 text-xs text-neutral-500 max-w-xl">
              كل معرض يتضمن <strong>5 مقاعد</strong>: مالك واحد (admin) + 4 موظفي مبيعات (sales).
              المالك: وصول كامل للـ CRM والسوق والمحاسبة.
              موظفو المبيعات: وصول للـ CRM والسوق فقط. المحاسبة للمالك فقط.
            </p>
          </div>
          {/* Seat counter */}
          <div className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm">
            <span className="text-xs text-neutral-500">المقاعد المستخدمة</span>
            <span className={`text-lg font-extrabold ${usedSeats >= totalSeats ? 'text-red-600' : 'text-emerald-600'}`}>
              {usedSeats}/{totalSeats}
            </span>
          </div>
        </div>

        {/* App access legend */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
          <span className="font-semibold">صلاحيات التطبيقات:</span>
          <AppBadge label="CRM" allowed={true} /> <span className="opacity-50">المالك + المبيعات</span>
          <AppBadge label="السوق الإلكتروني" allowed={true} /> <span className="opacity-50">المالك + المبيعات</span>
          <AppBadge label="المحاسبة" allowed={true} /> <span className="opacity-50 font-semibold text-amber-700">المالك فقط ⚠️</span>
        </div>
      </header>

      {/* Member list */}
      {loading ? (
        <p className="text-sm opacity-60">جاري تحميل الفريق…</p>
      ) : (
        <div className="divide-y divide-black/8 rounded-xl border border-black/10">
          {members.filter((m) => m.status !== 'revoked').map((member) => (
            <div key={member.membershipId} className="space-y-2 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-sm">{member.name || member.email}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold
                      ${member.role === 'owner' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {member.role === 'owner' ? '👑 مالك' : '👤 مبيعات'}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold
                      ${member.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {member.status === 'active' ? '● نشط' : '● موقف'}
                    </span>
                    {member.hasPassword
                      ? <span className="text-[10px] text-emerald-600 font-semibold">🔑 لديه كلمة مرور</span>
                      : <span className="text-[10px] text-red-500 font-semibold">⚠️ بدون كلمة مرور</span>}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{member.email}</p>
                  {/* App access badges */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <AppBadge label="CRM" allowed={member.appAccess.crm} />
                    <AppBadge label="السوق" allowed={member.appAccess.marketplace} />
                    <AppBadge label="المحاسبة" allowed={member.appAccess.accounting} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5">
                  {/* Password reset */}
                  {(isPlatformAdmin || member.role === 'sales') && (
                    <button
                      type="button"
                      onClick={() => { setResetTarget(member.membershipId); setResetPassword(''); }}
                      className="rounded border border-black/15 px-3 py-1.5 text-xs font-bold hover:bg-black/5"
                    >
                      🔑 كلمة مرور
                    </button>
                  )}
                  {/* Status management */}
                  {(member.role === 'sales' || (isPlatformAdmin && member.role === 'owner')) && (
                    <>
                      {member.status === 'active' ? (
                        <button type="button" disabled={saving}
                          onClick={() => void changeStatus(member, 'suspended')}
                          className="rounded border border-black/15 px-3 py-1.5 text-xs font-bold disabled:opacity-50">
                          تعليق
                        </button>
                      ) : (
                        <button type="button" disabled={saving}
                          onClick={() => void changeStatus(member, 'active')}
                          className="rounded border border-emerald-600/30 px-3 py-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50">
                          تفعيل
                        </button>
                      )}
                      <button type="button" disabled={saving}
                        onClick={() => void changeStatus(member, 'revoked')}
                        className="rounded border border-red-600/25 px-3 py-1.5 text-xs font-bold text-red-700 disabled:opacity-50">
                        إلغاء
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Password reset inline form */}
              {resetTarget === member.membershipId && (
                <div className="mt-2 flex flex-wrap gap-2 items-end rounded-lg bg-neutral-50 border border-black/10 p-3">
                  <label className="text-xs font-bold flex-1">
                    كلمة مرور جديدة
                    <input
                      type="password" minLength={8} value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder="8 أحرف على الأقل"
                      className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button type="button" disabled={saving}
                      onClick={() => void resetPw(member.membershipId)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                      حفظ
                    </button>
                    <button type="button" onClick={() => { setResetTarget(null); setResetPassword(''); }}
                      className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {members.filter((m) => m.status !== 'revoked').length === 0 && (
            <p className="p-4 text-sm opacity-60">لا يوجد أعضاء نشطون في هذا المعرض بعد.</p>
          )}
        </div>
      )}

      {/* Add member form */}
      {(isPlatformAdmin || salesCount < 4) && (
        <div className="rounded-xl border border-dashed border-black/15 p-4 space-y-3">
          <h3 className="text-sm font-bold">
            {isPlatformAdmin ? '+ إضافة عضو جديد' : `+ إضافة موظف مبيعات (${salesCount}/4)`}
          </h3>
          <form onSubmit={(e) => void addMember(e)} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-bold">
              الاسم
              <input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)}
                placeholder="اسم الموظف"
                className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold">
              البريد الإلكتروني
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                dir="ltr"
                className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold">
              كلمة المرور (اختياري)
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="يمكن تعيينها لاحقاً"
                className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal" />
            </label>
            <div className="flex items-end gap-2">
              {isPlatformAdmin && (
                <label className="text-xs font-bold flex-1">
                  الدور
                  <select value={role} onChange={(e) => setRole(e.target.value as 'sales' | 'owner')}
                    className="mt-1 w-full rounded border px-3 py-2 text-sm font-normal">
                    <option value="sales">موظف مبيعات</option>
                    <option value="owner">مالك / أدمن</option>
                  </select>
                </label>
              )}
              <button type="submit" disabled={saving || (!isPlatformAdmin && salesCount >= 4)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 whitespace-nowrap">
                {saving ? '…' : 'إضافة'}
              </button>
            </div>
          </form>
          <p className="text-[10px] text-neutral-400">
            {role === 'sales'
              ? '⚡ موظفو المبيعات: وصول CRM + السوق الإلكتروني. بدون وصول للمحاسبة.'
              : '👑 المالك: وصول كامل لجميع التطبيقات المفعّلة بما في ذلك المحاسبة.'}
          </p>
        </div>
      )}

      {/* Feedback */}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    </section>
  );
}
