import { notFound } from 'next/navigation';
import { loadMinisiteForRequest } from '@/lib/minisite';
import MinisiteView from '@/components/MinisiteView';

export const dynamic = 'force-dynamic';

export default async function ArabicMinisiteSubSection({
  params,
}: {
  params: Promise<{ slug: string; section: string; subSection: string }>;
}) {
  const { slug, section, subSection } = await params;
  // Handles /toyota/yaris/sec_auto_technology or /vendor/model/section
  const view = await loadMinisiteForRequest(section, 'ar', subSection);
  if (!view) {
    // Fallback try with first slug if section wasn't a model
    const fallbackView = await loadMinisiteForRequest(slug, 'ar', subSection);
    if (!fallbackView) notFound();
    return <MinisiteView view={fallbackView} />;
  }
  return <MinisiteView view={view} />;
}
