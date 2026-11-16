import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser, canAccessBusiness } from '@/lib/admin-auth';
import { loadContentStudioData, attachPermissions, type StudioGalleryItem } from '@/lib/content-admin';
import { parseJson, query, queryOne } from '@/lib/db';
import VehicleContentStudio from '@/components/VehicleContentStudio';
import { loadSocialLinks } from '@/lib/social-links';

export default async function VehicleContentPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const user = await getAdminUser(request);
  if (!user || !canAccessBusiness(user, id)) notFound();

  const unit = await queryOne<{
    id: string; title: string; title_ar: string | null; slug: string;
    seller_business_id: string; seller_slug: string; model_business_id: string | null;
  }>(
    `SELECT u.id, u.title, u.title_ar, u.slug, u.seller_business_id, u.model_business_id, s.slug AS seller_slug
       FROM units u
       JOIN businesses s ON s.id = u.seller_business_id
      WHERE u.id = ?`,
    [unitId],
  );
  if (!unit || unit.seller_business_id !== id) notFound();

  const content = await loadContentStudioData(unit.model_business_id ?? id);
  if (!content) notFound();
  attachPermissions(content, user);
  const sections = content.sections.filter((section) => section.enable_gallery === 1);
  const galleryRows = await query<Omit<StudioGalleryItem, 'media_data'> & { section_id: string; media_data: string | null }>(
    `SELECT id, section_id, url, caption, caption_ar, media_data, group_key,
            field_key, field_section_id, display_order, placement, is_hero,
            show_on_minisite, approval_status, media_type, video_id
       FROM vendor_gallery
      WHERE business_id = ? AND unit_id = ?
      ORDER BY section_id, display_order`,
    [id, unitId],
  );
  const initialGallery: Record<string, StudioGalleryItem[]> = {};
  for (const row of galleryRows) {
    const { section_id, media_data, ...item } = row;
    (initialGallery[section_id] ??= []).push({
      ...item,
      media_data: parseJson<Record<string, unknown> | null>(media_data, null),
    });
  }
  const socialLinks = await loadSocialLinks(id, unitId);

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href={`/admin/showroom/${id}`} className="hover:underline">Vendor site</Link><span>/</span>
        <Link href={`/admin/showroom/${id}/inventory`} className="hover:underline">Inventory</Link><span>/</span>
        <span>Vehicle carousel and media</span>
      </nav>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold">Vehicle carousel and media</h1>
          <p className="mt-1 text-sm opacity-60">{unit.title_ar || unit.title}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-bold">
          <Link href={`/${unit.seller_slug}/u/${unit.slug}`} target="_blank" rel="noreferrer" className="hover:underline">Preview integrated mini-site ↗</Link>
          <Link href={`/u/${unit.slug}`} target="_blank" rel="noreferrer" className="hover:underline">Preview standalone mini-site ↗</Link>
          <Link href={`/admin/site-builder?targetType=unit&targetId=${encodeURIComponent(unit.id)}`} className="hover:underline">Customize mini-site design →</Link>
        </div>
      </header>
      <VehicleContentStudio
        sellerId={id}
        unitId={unitId}
        sections={sections}
        fields={content.fields}
        initialGallery={initialGallery}
        initialSocialLinks={socialLinks}
        permissions={content.permissions}
      />
      <p className="text-xs opacity-60">
        This standalone editor changes only this vehicle’s gallery and carousel. The vehicle mini-site design and supported make/model page builders are available in the{' '}
        <Link href="/admin/site-builder" className="font-bold underline">Site Builder</Link>.
      </p>
      <Link href={`/admin/showroom/${id}/inventory/${unitId}`} className="text-sm font-bold hover:underline">Edit vehicle price, condition, and specifications →</Link>
    </div>
  );
}
