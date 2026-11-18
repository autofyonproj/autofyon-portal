import dealersJson from '@/data/egypt_dealers_directory.json';
import { query } from '@/lib/db';
import type { DealerItem } from '@/components/DealersDirectoryClient';

interface D1DealerRow {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  type_id: string;
  custom_data: string | null;
  landing_slug: string | null;
  landing_published: number | null;
  landing_phone: string | null;
  landing_whatsapp: string | null;
}

export async function getDealersWithVerified(): Promise<DealerItem[]> {
  const staticDealers = (dealersJson as DealerItem[]).map((d) => ({
    ...d,
    is_verified: false,
    landing_slug: d.slug,
  }));

  try {
    const registeredRows = await query<D1DealerRow>(
      `SELECT b.id, b.name, b.name_ar, b.slug, b.type_id, b.custom_data,
              l.slug AS landing_slug, l.published AS landing_published,
              l.phone AS landing_phone, l.whatsapp AS landing_whatsapp
         FROM businesses b
    LEFT JOIN autofyon_media_landings l ON l.business_id = b.id
        WHERE b.status = 'active'
          AND b.type_id IN (
            'showroom', 'distributor', 'main_agency', 'used_car_dealer',
            'service_center', 'spare_parts', 'finance_bank', 'leasing_company', 'insurance_company'
          )
        ORDER BY b.updated_at DESC
        LIMIT 100`,
    );

    if (!registeredRows || registeredRows.length === 0) {
      return staticDealers;
    }

    const verifiedItems: DealerItem[] = registeredRows.map((r) => {
      let custom: Record<string, Record<string, string>> = {};
      try {
        if (r.custom_data) custom = JSON.parse(r.custom_data);
      } catch {
        /* ok */
      }

      const phone = r.landing_phone || custom.sec_auto_showroom?.phone || custom.sec_1_identity?.phone || '';
      const whatsapp = r.landing_whatsapp || custom.sec_auto_showroom?.whatsapp || custom.sec_1_identity?.whatsapp || phone;
      const city = custom.sec_1_identity?.city || 'القاهرة';
      const address = custom.sec_1_identity?.address || custom.sec_auto_showroom?.address || '';

      return {
        id: r.id,
        name: r.name_ar || r.name,
        name_en: r.name || r.name_ar,
        category_key: r.type_id === 'main_agency' || r.type_id === 'distributor' ? 'authorized_agent' : r.type_id,
        original_category: 'معرض معتمد على أوتوفاي أون',
        brand: custom.sec_1_identity?.brand || '',
        address,
        district: custom.sec_1_identity?.district || '',
        city,
        primary_phone: phone,
        whatsapp,
        contact_name: custom.sec_1_identity?.contact_name || '',
        email: custom.sec_1_identity?.email || '',
        slug: r.slug,
        landing_slug: r.landing_slug || r.slug,
        is_verified: true,
      };
    });

    // Remove any static dealer with same slug to avoid duplicate
    const verifiedSlugs = new Set(verifiedItems.map((v) => v.slug.toLowerCase()));
    const nonDuplicatedStatic = staticDealers.filter((s) => !verifiedSlugs.has(s.slug.toLowerCase()));

    // Verified dealers pinned first, followed by the rest
    return [...verifiedItems, ...nonDuplicatedStatic];
  } catch (err) {
    console.error('Failed to query registered dealers from D1, falling back to static:', err);
    return staticDealers;
  }
}
