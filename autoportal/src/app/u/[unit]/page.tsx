import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import UnitView from '@/components/UnitView';
import { loadUnit } from '@/lib/units';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ unit: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unit: unitSlug } = await params;
  const page = await loadUnit(unitSlug, 'ar');
  if (!page) return { title: 'غير موجود | AutoOne Egypt' };
  return {
    title: `${page.unit.title_ar || page.unit.title} — ${page.seller.name_ar || page.seller.name}`,
    description: page.model
      ? `${page.model.name_ar || page.model.name} ${page.unit.year ?? ''} ${page.unit.color_ar || ''}`.trim()
      : `${page.unit.title_ar || page.unit.title} من ${page.seller.name_ar || page.seller.name}`,
    alternates: { canonical: page.canonicalPath },
  };
}

export default async function StandaloneArabicUnitPage({ params }: Props) {
  const { unit: unitSlug } = await params;
  const page = await loadUnit(unitSlug, 'ar');
  if (!page) notFound();
  return <UnitView page={page} locale="ar" />;
}
