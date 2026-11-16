import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function EnglishMinisiteSubSection({
  params,
}: {
  params: Promise<{ slug: string; section: string; subSection: string }>;
}) {
  const { slug, section, subSection } = await params;
  const view = await loadMinisiteForRequest(section, 'en', subSection);
  if (!view) {
    const fallbackView = await loadMinisiteForRequest(slug, 'en', subSection);
    if (!fallbackView) notFound();
    return <MinisiteView view={fallbackView} />;
  }
  return <MinisiteView view={view} />;
}
