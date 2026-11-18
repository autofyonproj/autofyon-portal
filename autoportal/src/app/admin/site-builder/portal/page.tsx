import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { loadPortalPageState } from '@/lib/portal-site';
import PortalBuilderClient from '@/components/PortalBuilderClient';

export default async function PortalBuilderPage() {
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin/site-builder/portal', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const auth = await requirePlatformAdmin(request);
  if (auth instanceof Response) notFound();
  const state = await loadPortalPageState();
  return (
    <div className="space-y-6">
      <nav className="flex gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/site-builder" className="hover:underline">Site Builder</Link><span>/</span>
        <span>Main portal</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">Main portal editor</h1>
        <p className="mt-1 text-sm opacity-60">Edit the central portal’s bilingual homepage, theme, and section visibility. Preview drafts before publishing.</p>
      </header>
      <PortalBuilderClient initialDraft={state.draft} hasPublished={Boolean(state.published)} />
    </div>
  );
}
