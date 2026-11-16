import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function ArabicMinisiteSection({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;

  // If section is not a section ID (does not start with sec_),
  // it is likely a model under a brand/vendor (e.g. /toyota/yaris)
  if (!section.startsWith('sec_')) {
    const modelView = await loadMinisiteForRequest(section, 'ar');
    if (modelView) {
      return <MinisiteView view={modelView} />;
    }
  }

  const view = await loadMinisiteForRequest(slug, 'ar', section);
  if (!view) notFound();
  return <MinisiteView view={view} />;
}
