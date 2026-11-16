import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminUser } from '@/lib/admin-auth';
import { queryOne } from '@/lib/db';
import {
  DEFAULT_MEDIA_MANAGER_PRESENTATION,
  validateMediaManagerPresentation,
} from '@/lib/media-manager-presentation';
import MediaManagerPresentationEditor from '@/components/MediaManagerPresentationEditor';

export const dynamic = 'force-dynamic';

export default async function MediaManagerPresentationPage() {
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin/platform/media-manager', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const user = await getAdminUser(request);
  if (!user || user.role !== 'platform_admin') notFound();

  const row = await queryOne<{ content: string; updated_at: string }>(
    'SELECT content, updated_at FROM media_manager_presentation WHERE id = 1',
  );
  let initialPresentation = DEFAULT_MEDIA_MANAGER_PRESENTATION;
  if (row) {
    let content: unknown;
    try {
      content = JSON.parse(row.content) as unknown;
    } catch {
      throw new Error('Saved Media Manager presentation is invalid JSON.');
    }
    initialPresentation = validateMediaManagerPresentation(content);
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span>/</span>
        <Link href="/admin/platform" className="hover:underline">Platform</Link>
        <span>/</span>
        <span>Media Manager presentation</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <p className="text-sm text-neutral-500">Platform admin · shared public content</p>
        <h1 className="mt-1 text-2xl font-bold">Almostashar Media Manager presentation</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Update every presentation block in Arabic and English, choose which cards are visible, and reorder them.
          Saving publishes the new presentation for all visitors. This editor does not change the working composer or connected-channel capabilities.
        </p>
      </header>
      <Link
        href="/admin/platform/media-manager/customers"
        className="inline-flex rounded-lg border border-amber-700/25 bg-amber-700/5 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-700/10"
      >
        Manage free and paid customers ↗
      </Link>
      <MediaManagerPresentationEditor initialPresentation={initialPresentation} updatedAt={row?.updated_at ?? null} />
    </div>
  );
}
