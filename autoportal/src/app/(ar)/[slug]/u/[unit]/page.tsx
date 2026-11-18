/**
 * Arabic unit detail: /[sellerSlug]/u/[unitSlug]
 *
 * Thin locale wrapper around <UnitView />. Kept as its own route file so the
 * App Router can statically see the (ar) group and pick the right layout tree.
 */
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { loadUnit } from '@/lib/units';
import UnitView from '@/components/UnitView';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string; unit: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, unit: unitSlug } = await params;
  const page = await loadUnit(unitSlug, 'ar', { sellerSlug: slug });
  if (!page) return { title: 'غير موجود | AutoOne Egypt' };
  const title = page.unit.title_ar || page.unit.title;
  return {
    title: `${title} — ${page.seller.name_ar || page.seller.name}`,
    description: page.model
      ? `${page.model.name_ar || page.model.name} ${page.unit.year ?? ''} ${page.unit.color_ar || ''}`
      : `${title} من ${page.seller.name_ar || page.seller.name}`,
  };
}

export default async function ArabicUnitPage({
  params, searchParams,
}: Props & { searchParams: Promise<{ preview?: string }> }) {
  const { slug, unit: unitSlug } = await params;
  const search = await searchParams;
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost', { headers: Object.fromEntries(requestHeaders.entries()) });
    const user = await getAdminUser(request);
    if (user) {
      const draftPage = await loadUnit(unitSlug, 'ar', { drafts: true, sellerSlug: slug });
      if (draftPage && canAccessBusiness(user, draftPage.unit.seller_business_id)) {
        return <UnitView page={draftPage} locale="ar" preview />;
      }
    }
  }
  const page = await loadUnit(unitSlug, 'ar', { sellerSlug: slug });
  if (!page) notFound();
  return <UnitView page={page} locale="ar" />;
}
