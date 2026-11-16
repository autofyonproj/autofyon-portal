import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canAccessBusiness, getAdminUser } from '@/lib/admin-auth';
import { parseJson, queryOne } from '@/lib/db';
import {
  DEFAULT_UNIT_PAGE_COMPONENTS,
  validateUnitPageComponents,
  type UnitPageComponent,
} from '@/lib/site-pages';
import VehiclePageBuilderClient from '@/components/VehiclePageBuilderClient';

export default async function VehiclePageBuilderPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin', { headers: Object.fromEntries(requestHeaders.entries()) });
  const user = await getAdminUser(request);
  if (!user || !canAccessBusiness(user, id)) notFound();
  const unit = await queryOne<{
    id: string; title: string; title_ar: string | null; slug: string;
    seller_business_id: string; seller_slug: string; overrides: string | null;
  }>(
    `SELECT u.id, u.title, u.title_ar, u.slug, u.seller_business_id, u.overrides,
            b.slug AS seller_slug
       FROM units u JOIN businesses b ON b.id = u.seller_business_id
      WHERE u.id = ?`,
    [unitId],
  );
  if (!unit || unit.seller_business_id !== id) notFound();
  const overrides = parseJson<Record<string, unknown>>(unit.overrides, {});
  const layout = overrides._site_layout && typeof overrides._site_layout === 'object'
    ? overrides._site_layout as Record<string, unknown>
    : {};
  let components: UnitPageComponent[] = DEFAULT_UNIT_PAGE_COMPONENTS;
  if (Array.isArray(layout.draft)) {
    try {
      components = validateUnitPageComponents(layout.draft);
    } catch (error) {
      console.warn(`Ignoring invalid draft vehicle layout for ${unit.id}:`, error);
    }
  }
  const previewUrl = `/${unit.seller_slug}/u/${unit.slug}`;
  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link><span>/</span>
        <Link href="/admin/site-builder" className="hover:underline">Site Builder</Link><span>/</span>
        <Link href={`/admin/showroom/${id}/inventory`} className="hover:underline">Inventory</Link><span>/</span>
        <span>Vehicle page layout</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">Vehicle page layout</h1>
        <p className="mt-1 text-sm opacity-60">{unit.title_ar || unit.title} · edits affect only this vehicle page.</p>
      </header>
      <VehiclePageBuilderClient unitId={unit.id} initialComponents={components} previewUrl={previewUrl} />
    </div>
  );
}
