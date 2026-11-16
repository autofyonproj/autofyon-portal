import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminUser, canAccessBusiness } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import { SITE_TEMPLATES } from '@/lib/site-builder';
import SiteBuilderClient, { type SiteBuilderTarget } from '@/components/SiteBuilderClient';

export default async function SiteBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ targetType?: string; targetId?: string }>;
}) {
  const { targetType, targetId } = await searchParams;
  const requestHeaders = await headers();
  const request = new Request('http://localhost/admin/site-builder', {
    headers: Object.fromEntries(requestHeaders.entries()),
  });
  const user = await getAdminUser(request);
  if (!user) notFound();

  const [businesses, units, profiles] = await Promise.all([
    query<{
      id: string; name: string; name_ar: string | null; slug: string; type_id: string;
      parent_business_id: string | null; parent_name: string | null; parent_name_ar: string | null;
      type_name: string; market_id: string; market_name: string; market_name_ar: string | null;
      parent_name_type: string | null; parent_name_ar_type: string | null;
      vendor_claimable: number; published: number;
    }>(
      `SELECT b.id, b.name, b.name_ar, b.slug, b.type_id,
              b.parent_business_id, parent_business.name AS parent_name, parent_business.name_ar AS parent_name_ar,
              bt.name AS type_name,
              bt.market_id, COALESCE(m.name_en, 'Other') AS market_name, m.name_ar AS market_name_ar,
              parent_type.name AS parent_name_type, parent_type.name_ar AS parent_name_ar_type,
              bt.vendor_claimable, b.published
         FROM businesses b
         JOIN business_types bt ON bt.id = b.type_id AND bt.is_parent = 0
         LEFT JOIN businesses parent_business ON parent_business.id = b.parent_business_id
         LEFT JOIN business_types parent_type ON parent_type.id = bt.parent_id
         LEFT JOIN markets m ON m.id = bt.market_id
        WHERE b.status = 'active' AND COALESCE(m.active, 1) = 1
        ORDER BY bt.market_id, parent_type.sort_order, bt.sort_order, b.name`,
    ),
    query<{
      id: string; title: string; title_ar: string | null; slug: string; published: number;
      seller_business_id: string; seller_slug: string; vehicle_category: string;
    }>(
      `SELECT u.id, u.title, u.title_ar, u.slug, u.published, u.vehicle_category,
              u.seller_business_id, s.slug AS seller_slug
         FROM units u
         JOIN businesses s ON s.id = u.seller_business_id
        WHERE u.status <> 'inactive'
        ORDER BY u.updated_at DESC`,
    ),
    query<{
      target_type: string; target_id: string; template_id: string;
      logo_url: string | null; accent_color: string | null; background_color: string | null;
      social_links: string | null;
    }>('SELECT target_type, target_id, template_id, logo_url, accent_color, background_color, social_links FROM site_profiles'),
  ]);
  const profileMap = new Map(profiles.map((profile) => [`${profile.target_type}:${profile.target_id}`, profile]));

  const targets: SiteBuilderTarget[] = [];
  for (const business of businesses) {
    if (!canAccessBusiness(user, business.id)) continue;
    const profile = profileMap.get(`business:${business.id}`);
    targets.push({
      id: business.id,
      targetType: 'business',
      name: business.name_ar || business.name,
      typeId: business.type_id,
      kind: business.type_name,
      parentId: business.parent_business_id,
      parentName: business.parent_name_ar || business.parent_name,
      siteGroup: business.vendor_claimable === 1 ? 'vendors' : 'automotive',
      market: business.market_name_ar || business.market_name,
      category: business.vendor_claimable === 1
        ? business.parent_name_ar_type || business.parent_name_type || business.type_name
        : business.parent_name_ar_type || business.parent_name_type || business.market_name,
      previewUrl: business.published ? `/${business.slug}` : null,
      isPublished: business.published === 1,
      contentUrl: `/admin/showroom/${business.id}/content`,
      pageBuilderUrl: `/admin/site-builder/${business.id}`,
      editUrl: `/admin/showroom/${business.id}`,
      templateId: profile?.template_id ?? null,
      logoUrl: profile?.logo_url ?? null,
      accentColor: profile?.accent_color ?? null,
      backgroundColor: profile?.background_color ?? null,
      socialLinks: profile?.social_links ?? '{}',
    });
  }
  for (const unit of units) {
    if (!canAccessBusiness(user, unit.seller_business_id)) continue;
    const profile = profileMap.get(`unit:${unit.id}`);
    targets.push({
      id: unit.id,
      targetType: 'unit',
      name: unit.title_ar || unit.title,
      typeId: 'vehicle_listing',
      kind: unit.vehicle_category === 'motorcycle' ? 'Motorcycle'
        : unit.vehicle_category === 'scooter' ? 'Scooter'
          : unit.vehicle_category === 'commercial' ? 'Commercial vehicle' : 'Car',
      siteGroup: 'automotive',
      market: 'Vehicles',
      parentId: null,
      parentName: null,
      category: unit.vehicle_category === 'motorcycle' ? 'Motorcycles'
        : unit.vehicle_category === 'scooter' ? 'Scooters'
          : unit.vehicle_category === 'commercial' ? 'Commercial vehicles' : 'Cars',
      previewUrl: unit.published ? `/${unit.seller_slug}/u/${unit.slug}` : null,
      isPublished: unit.published === 1,
      contentUrl: `/admin/showroom/${unit.seller_business_id}/inventory/${unit.id}/content`,
      pageBuilderUrl: `/admin/showroom/${unit.seller_business_id}/inventory/${unit.id}/page-builder`,
      sharedContentUrl: `/admin/showroom/${unit.seller_business_id}/content`,
      editUrl: `/admin/showroom/${unit.seller_business_id}/inventory/${unit.id}`,
      templateId: profile?.template_id ?? null,
      logoUrl: profile?.logo_url ?? null,
      accentColor: profile?.accent_color ?? null,
      backgroundColor: profile?.background_color ?? null,
      socialLinks: profile?.social_links ?? '{}',
    });
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 text-xs opacity-60">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span>/</span>
        <span>Site Builder</span>
      </nav>
      <header className="border-b border-black/10 pb-4">
        <h1 className="text-2xl font-bold">Site Builder</h1>
        <p className="mt-1 text-sm opacity-60">Prepare vendor, model, and vehicle pages with reusable visual presets. Manage published content, carousels, and blogs from each page’s studio.</p>
      </header>
      {user.role === 'platform_admin' ? (
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/site-builder/portal" className="inline-flex rounded-lg border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/[.03]">
            Edit the main portal ↗
          </Link>
          <Link href="/admin/platform/blog" className="inline-flex rounded-lg border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/[.03]">
            Manage the global blog ↗
          </Link>
        </div>
      ) : null}
      <SiteBuilderClient
        targets={targets}
        templates={SITE_TEMPLATES}
        initialTargetKey={targetType && targetId ? `${targetType}:${targetId}` : undefined}
      />
    </div>
  );
}
