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
  const page = await loadUnit(unitSlug, 'en');
  if (!page) return { title: 'Not found | AutoOne Egypt' };
  return {
    title: `${page.unit.title} — ${page.seller.name}`,
    description: page.model
      ? `${page.model.name} ${page.unit.year ?? ''} ${page.unit.color ?? ''}`.trim()
      : `${page.unit.title} from ${page.seller.name}`,
    alternates: { canonical: page.canonicalPath },
  };
}

export default async function StandaloneEnglishUnitPage({ params }: Props) {
  const { unit: unitSlug } = await params;
  const page = await loadUnit(unitSlug, 'en');
  if (!page) notFound();
  return <UnitView page={page} locale="en" />;
}
