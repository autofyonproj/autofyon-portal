import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function EnglishMinisite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = await loadMinisiteForRequest(slug, 'en');
  if (!view) notFound();
  return <MinisiteView view={view} />;
}
