/**
 * English unit detail: /en/[sellerSlug]/u/[unitSlug]
 *
 * Mirrors the AR route so a bilingual visitor can move between locales without
 * the URL breaking. Same <UnitView />; only the locale flag and the /en prefix
 * differ.
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
  const page = await loadUnit(unitSlug, 'en', { sellerSlug: slug });
  if (!page) return { title: 'Not found | AutoOne Egypt' };
  return {
    title: `${page.unit.title} — ${page.seller.name}`,
    description: page.model
      ? `${page.model.name} ${page.unit.year ?? ''} ${page.unit.color ?? ''}`
      : `${page.unit.title} from ${page.seller.name}`,
  };
}

export default async function EnglishUnitPage({
  params, searchParams,
}: Props & { searchParams: Promise<{ preview?: string }> }) {
  const { slug, unit: unitSlug } = await params;
  const search = await searchParams;
  if (search.preview === '1') {
    const requestHeaders = await headers();
    const request = new Request('http://localhost', { headers: Object.fromEntries(requestHeaders.entries()) });
    const user = await getAdminUser(request);
    if (user) {
      const draftPage = await loadUnit(unitSlug, 'en', { drafts: true, sellerSlug: slug });
      if (draftPage && canAccessBusiness(user, draftPage.unit.seller_business_id)) {
        return <UnitView page={draftPage} locale="en" preview />;
      }
    }
  }
  const page = await loadUnit(unitSlug, 'en', { sellerSlug: slug });
  if (!page) notFound();
  return <UnitView page={page} locale="en" />;
}
