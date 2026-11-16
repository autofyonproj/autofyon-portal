import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function EnglishMinisiteSection({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;

  if (!section.startsWith('sec_')) {
    const modelView = await loadMinisiteForRequest(section, 'en');
    if (modelView) {
      return <MinisiteView view={modelView} />;
    }
  }

  const view = await loadMinisiteForRequest(slug, 'en', section);
  if (!view) notFound();
  return <MinisiteView view={view} />;
}
