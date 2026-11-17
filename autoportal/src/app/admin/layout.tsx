/**
 * Admin layout — English, LTR, gated by Cloudflare Access.
 *
 * Cloudflare Access is enforced at the edge and passes
 * `Cf-Access-Authenticated-User-Email` on every authenticated request.
 * This layout double-checks that the email exists in admin_users; if not,
 * it renders an access-denied page rather than the dashboard.
 *
 * All admin pages are English-only (operator-facing).
 */
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser, AUTOFYON_MASTER_EMAIL, SUPER_ADMIN_EMAIL } from '@/lib/admin-auth';
import HtmlShell from '@/components/HtmlShell';

export const metadata = { title: 'AutoPortal Admin' };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Build a minimal Request-like object from Next.js headers for getAdminUser.
  const hdrs = await headers();
  const fakeReq = new Request('http://localhost/admin', {
    headers: Object.fromEntries(hdrs.entries()),
  });

  const user = await getAdminUser(fakeReq);

  // If user is not logged in, redirect directly to the administrative login page
  if (!user) {
    redirect('/login');
  }

  return (
    <HtmlShell locale="en">
      <div className="admin-shell min-h-screen flex flex-col">
        {/* Top nav bar */}
        <header className="px-6 py-3 flex items-center gap-3 bg-neutral-900 border-b border-white/10 text-white flex-wrap">
          <Link href="/admin" className="flex items-center gap-2 me-2">
            <img
              src="/brand/autofyon-logo-dark.png"
              alt="AutoFyon Admin"
              className="h-7 w-auto object-contain select-none"
              width={180}
              height={50}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">C-Panel</span>
          </Link>
          <span className="opacity-20 text-sm hidden md:inline">|</span>
          <Link href="/admin" className="text-xs font-semibold opacity-80 hover:opacity-100 hover:text-white transition">
            Dashboard
          </Link>
          {user.role === 'platform_admin' ? (
            <>
              <Link href="/admin/platform/carousel" className="text-xs font-bold px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition flex items-center gap-1">
                <span>🎬</span>
                <span>Hero Carousel</span>
              </Link>
              <Link href="/admin/platform/media-manager" className="text-xs font-semibold opacity-80 hover:opacity-100 hover:text-white transition flex items-center gap-1">
                <span>📸</span>
                <span>Media Manager</span>
              </Link>
              <Link href="/admin/site-builder" className="text-xs font-semibold opacity-80 hover:opacity-100 hover:text-white transition">
                Site Builder
              </Link>
              <Link href="/admin/platform/clients" className="text-xs opacity-70 hover:opacity-100 hover:text-white transition">
                Clients
              </Link>
              <Link href="/admin/platform/activity" className="text-xs opacity-70 hover:opacity-100 hover:text-white transition">
                Activity
              </Link>
              <Link href="/admin/vehicle-exchange" className="text-xs opacity-70 hover:opacity-100 hover:text-white transition">
                Exchange
              </Link>
            </>
          ) : (
            <Link href="/admin/site-builder" className="text-xs opacity-70 hover:opacity-100 hover:underline">
              Site Builder
            </Link>
          )}
          {(user.email.toLowerCase() === AUTOFYON_MASTER_EMAIL ||
            process.env.NODE_ENV !== 'production' && user.email.toLowerCase() === SUPER_ADMIN_EMAIL) && (
            <Link href="/admin/master-copies" className="text-xs opacity-70 hover:opacity-100 hover:underline">
              Master Licenses
            </Link>
          )}
          <span className="ms-auto flex items-center gap-2 text-xs opacity-70">
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px]">{user.role === 'platform_admin' ? '⚙️ Super Admin' : '🏢 Vendor'}</span>
            <span className="hidden sm:inline text-white/50">{user.email}</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </HtmlShell>
  );
}
