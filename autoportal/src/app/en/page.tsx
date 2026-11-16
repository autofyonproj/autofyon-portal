import { headers } from 'next/headers';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { listFeatured } from '@/lib/minisite';
import { loadPortalPageState, loadPublishedPortalContent } from '@/lib/portal-site';
import HomeListing from '@/components/HomeListing';

export const dynamic = 'force-dynamic';

export default async function EnglishHome({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const [items, search, requestHeaders] = await Promise.all([listFeatured(), searchParams, headers()]);
  const request = new Request('http://localhost/en', { headers: Object.fromEntries(requestHeaders.entries()) });
  const isPreview = search.preview === '1' && !(await requirePlatformAdmin(request) instanceof Response);
  const content = isPreview ? (await loadPortalPageState()).draft : await loadPublishedPortalContent();
  return <HomeListing locale="en" items={items} content={content} preview={isPreview} />;
}
