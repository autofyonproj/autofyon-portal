import { headers } from 'next/headers';
import { requirePlatformAdmin } from '@/lib/admin-auth';
import { listFeatured } from '@/lib/minisite';
import { loadPortalPageState, loadPublishedPortalContent } from '@/lib/portal-site';
import HomeListing from '@/components/HomeListing';

// Data comes from D1 at request time; nothing here is statically prerendered.
export const dynamic = 'force-dynamic';

export default async function ArabicHome({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const [items, search, requestHeaders] = await Promise.all([listFeatured(), searchParams, headers()]);
  const request = new Request('http://localhost/', { headers: Object.fromEntries(requestHeaders.entries()) });
  const isPreview = search.preview === '1' && !(await requirePlatformAdmin(request) instanceof Response);
  const content = isPreview ? (await loadPortalPageState()).draft : await loadPublishedPortalContent();
  return <HomeListing locale="ar" items={items} content={content} preview={isPreview} />;
}
