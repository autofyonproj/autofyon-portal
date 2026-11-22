-- ========================================================
-- Brand Ingestion: Mercedes-Benz (مرسيدس-بنز)
-- Generated: 2026-11-22 11:07:44
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_mercedes_benz',
  'Mercedes-Benz',
  'مرسيدس-بنز',
  'mercedes-benz',
  'vehicle_brand',
  'automotive',
  NULL,
  '/mercedes-benz',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":null,"official_website":"https://www.mercedes-benz.com.eg","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mercedes-benz.svg"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- 2. Register Official Agency / Distributor
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_dist_mercedes_benz_egypt',
  'Mercedes-Benz Egypt S.A.E.',
  'شركة مرسيدس-بنز مصر',
  'mercedes-benz-egypt',
  'main_agency',
  'automotive',
  NULL,
  '/mercedes-benz-egypt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Mercedes-Benz Egypt S.A.E.","company_name_ar":"شركة مرسيدس-بنز مصر","phone":"16666","website":"https://www.mercedes-benz.com.eg","official_brands":["Mercedes-Benz"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: Mercedes-Benz Mercedes-Benz C-Class W206 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'Mercedes-Benz C-Class W206',
  'مرسيدس-بنز الفئة C W206',
  'mercedes-benz-c-class-w206',
  'vehicle_model',
  'automotive',
  'biz_brand_mercedes_benz',
  '/mercedes-benz/mercedes-benz-c-class-w206',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Mercedes-Benz C-Class W206","model_name_ar":"مرسيدس-بنز الفئة C W206","official_specs":{},"year":2024,"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/pdf/c-class-brochure.pdf"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo (M254)","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":204,"torque_nm":300,"acceleration_0_100":7.3,"top_speed_kmh":240,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.1},"sec_listing_price":{"official_price_egp":3850000,"currency":"EGP","price_note":"Official agency price, subject to change","price_note_ar":"السعر الرسمي من الوكيل، قابل للتغيير","trim_range":{"min":3850000,"max":4450000,"count":2}},"sec_overview":{"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/pdf/c-class-brochure.pdf"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO business_relationships (
        id, from_business_id, to_business_id, relation_type, is_primary
) VALUES (
  'edge_biz_model_mercedes-benz_mercedes_benz_c_class_w206_sold_by_biz_dist_mercedes_benz_egypt',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'biz_dist_mercedes_benz_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-c-class-w206_mercedes_benz_c200_progressive',
  'C200 Progressive',
  'C200 بروجريسيف',
  'mercedes-benz-c200-progressive',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  '/mercedes-benz/mercedes-benz-c-class-w206/mercedes-benz-c200-progressive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3850000,"currency":"EGP"},"sec_1_identity":{"trim_name":"C200 Progressive","trim_name_ar":"C200 بروجريسيف"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo (M254)","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":204,"torque_nm":300,"acceleration_0_100":7.3,"top_speed_kmh":240,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.1}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-c-class-w206_mercedes_benz_c300_amg_line',
  'C300 AMG Line',
  'C300 AMG لاين',
  'mercedes-benz-c300-amg-line',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  '/mercedes-benz/mercedes-benz-c-class-w206/mercedes-benz-c300-amg-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4450000,"currency":"EGP"},"sec_1_identity":{"trim_name":"C300 AMG Line","trim_name_ar":"C300 AMG لاين"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo (M254)","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":258,"torque_nm":400,"acceleration_0_100":5.9,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.6}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mercedes-benz_mercedes_benz_c_class_w206 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mercedes-benz_mercedes_benz_c_class_w206';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_1',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_1_identity',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-modeloverview-696x392-01-2024.png',
  'C-Class W206 — Official Front View',
  'الفئة C W206 — المظهر الأمامي الرسمي',
  NULL,
  NULL,
  NULL,
  1,
  0,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_2',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_auto_exterior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-exterior-696x392-01-2024.png',
  'Exterior Design',
  'التصميم الخارجي',
  NULL,
  NULL,
  NULL,
  0,
  1,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_3',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_auto_interior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-interior-696x392-01-2024.png',
  'MBUX Interior',
  'المقصورة الداخلية MBUX',
  NULL,
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_4',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_auto_engine',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-engine-696x392-01-2024.png',
  '2.0L Turbo Engine',
  'محرك 2.0 توربو',
  NULL,
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_5',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_auto_safety',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-safety-696x392-01-2024.png',
  'Active Safety Systems',
  'أنظمة الأمان النشطة',
  NULL,
  NULL,
  NULL,
  0,
  4,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-c-class-w206_6',
  'biz_model_mercedes-benz_mercedes_benz_c_class_w206',
  'sec_auto_technology',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/c-class/c-class-saloon-w206-fl/modeloverview/01-2024/images/mercedes-benz-c-class-w206-fl-technology-696x392-01-2024.png',
  'MBUX Digital Cockpit',
  'قمرة القيادة الرقمية MBUX',
  NULL,
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Mercedes-Benz Mercedes-Benz E-Class W214 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'Mercedes-Benz E-Class W214',
  'مرسيدس-بنز الفئة E W214',
  'mercedes-benz-e-class-w214',
  'vehicle_model',
  'automotive',
  'biz_brand_mercedes_benz',
  '/mercedes-benz/mercedes-benz-e-class-w214',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Mercedes-Benz E-Class W214","model_name_ar":"مرسيدس-بنز الفئة E W214","official_specs":{},"year":2024,"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/pdf/e-class-brochure.pdf"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo + 48V Mild Hybrid","engine_ar":"4 سلندر توربو 2.0 لتر + هجين خفيف 48 فولت","power_hp":204,"torque_nm":320,"acceleration_0_100":7.3,"top_speed_kmh":240,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":6.7},"sec_listing_price":{"official_price_egp":5250000,"currency":"EGP","price_note":"Official agency price, subject to change","price_note_ar":"السعر الرسمي من الوكيل، قابل للتغيير","trim_range":{"min":5250000,"max":6150000,"count":2}},"sec_overview":{"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/pdf/e-class-brochure.pdf"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO business_relationships (
        id, from_business_id, to_business_id, relation_type, is_primary
) VALUES (
  'edge_biz_model_mercedes-benz_mercedes_benz_e_class_w214_sold_by_biz_dist_mercedes_benz_egypt',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'biz_dist_mercedes_benz_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-e-class-w214_mercedes_benz_e200_avantgarde',
  'E200 Avantgarde',
  'E200 أفانتجارد',
  'mercedes-benz-e200-avantgarde',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  '/mercedes-benz/mercedes-benz-e-class-w214/mercedes-benz-e200-avantgarde',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":5250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"E200 Avantgarde","trim_name_ar":"E200 أفانتجارد"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo + 48V Mild Hybrid","engine_ar":"4 سلندر توربو 2.0 لتر + هجين خفيف 48 فولت","power_hp":204,"torque_nm":320,"acceleration_0_100":7.3,"top_speed_kmh":240,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":6.7}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-e-class-w214_mercedes_benz_e300_exclusive',
  'E300 Exclusive',
  'E300 إكسكلوسيف',
  'mercedes-benz-e300-exclusive',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  '/mercedes-benz/mercedes-benz-e-class-w214/mercedes-benz-e300-exclusive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":6150000,"currency":"EGP"},"sec_1_identity":{"trim_name":"E300 Exclusive","trim_name_ar":"E300 إكسكلوسيف"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo + 48V Mild Hybrid","engine_ar":"4 سلندر توربو 2.0 لتر + هجين خفيف 48 فولت","power_hp":258,"torque_nm":400,"acceleration_0_100":6,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"RWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":7.1}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mercedes-benz_mercedes_benz_e_class_w214 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mercedes-benz_mercedes_benz_e_class_w214';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-e-class-w214_1',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'sec_1_identity',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/modeloverview/06-2023/images/mercedes-benz-e-class-w214-modeloverview-696x392-06-2023.png',
  'E-Class W214 — Official Front View',
  'الفئة E W214 — المظهر الأمامي الرسمي',
  NULL,
  NULL,
  NULL,
  1,
  0,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-e-class-w214_2',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'sec_auto_exterior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/modeloverview/06-2023/images/mercedes-benz-e-class-w214-exterior-696x392-06-2023.png',
  'Aerodynamic Exterior',
  'الهيكل الخارجي الانسيابي',
  NULL,
  NULL,
  NULL,
  0,
  1,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-e-class-w214_3',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'sec_auto_interior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/modeloverview/06-2023/images/mercedes-benz-e-class-w214-interior-696x392-06-2023.png',
  'Hyperscreen Interior',
  'المقصورة بالشاشة الفائقة',
  NULL,
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-e-class-w214_4',
  'biz_model_mercedes-benz_mercedes_benz_e_class_w214',
  'sec_auto_engine',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/e-class/e-class-saloon-w214/modeloverview/06-2023/images/mercedes-benz-e-class-w214-engine-696x392-06-2023.png',
  'Mild-Hybrid Engine',
  'المحرك الهجين الخفيف',
  NULL,
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Mercedes-Benz Mercedes-Benz GLC X254 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'Mercedes-Benz GLC X254',
  'مرسيدس-بنز GLC X254',
  'mercedes-benz-glc-x254',
  'vehicle_model',
  'automotive',
  'biz_brand_mercedes_benz',
  '/mercedes-benz/mercedes-benz-glc-x254',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Mercedes-Benz GLC X254","model_name_ar":"مرسيدس-بنز GLC X254","official_specs":{},"year":2024,"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/glc/glc-suv-x254/pdf/glc-brochure.pdf"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":204,"torque_nm":320,"acceleration_0_100":7.5,"top_speed_kmh":234,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol","fuel_economy_combined":8.2},"sec_listing_price":{"official_price_egp":5950000,"currency":"EGP","price_note":"Official agency price, subject to change","price_note_ar":"السعر الرسمي من الوكيل، قابل للتغيير","trim_range":{"min":5950000,"max":7250000,"count":2}},"sec_overview":{"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/glc/glc-suv-x254/pdf/glc-brochure.pdf"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO business_relationships (
        id, from_business_id, to_business_id, relation_type, is_primary
) VALUES (
  'edge_biz_model_mercedes-benz_mercedes_benz_glc_x254_sold_by_biz_dist_mercedes_benz_egypt',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'biz_dist_mercedes_benz_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-glc-x254_mercedes_benz_glc200_progressive',
  'GLC 200 Progressive',
  'GLC 200 بروجريسيف',
  'mercedes-benz-glc200-progressive',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  '/mercedes-benz/mercedes-benz-glc-x254/mercedes-benz-glc200-progressive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":5950000,"currency":"EGP"},"sec_1_identity":{"trim_name":"GLC 200 Progressive","trim_name_ar":"GLC 200 بروجريسيف"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":204,"torque_nm":320,"acceleration_0_100":7.5,"top_speed_kmh":234,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol","fuel_economy_combined":8.2}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-glc-x254_mercedes_benz_glc300_amg_line',
  'GLC 300 AMG Line',
  'GLC 300 AMG لاين',
  'mercedes-benz-glc300-amg-line',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  '/mercedes-benz/mercedes-benz-glc-x254/mercedes-benz-glc300-amg-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":7250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"GLC 300 AMG Line","trim_name_ar":"GLC 300 AMG لاين"},"sec_auto_specs":{"engine":"2.0L Inline-4 Turbo","engine_ar":"4 سلندر توربو 2.0 لتر","power_hp":258,"torque_nm":400,"acceleration_0_100":6.1,"top_speed_kmh":240,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol","fuel_economy_combined":8.5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mercedes-benz_mercedes_benz_glc_x254 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mercedes-benz_mercedes_benz_glc_x254';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-glc-x254_1',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'sec_1_identity',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/glc/glc-suv-x254/modeloverview/09-2022/images/mercedes-benz-glc-x254-modeloverview-696x392-09-2022.png',
  'GLC X254 — Official Front View',
  'GLC X254 — المظهر الأمامي الرسمي',
  NULL,
  NULL,
  NULL,
  1,
  0,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-glc-x254_2',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'sec_auto_exterior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/glc/glc-suv-x254/modeloverview/09-2022/images/mercedes-benz-glc-x254-exterior-696x392-09-2022.png',
  'SUV Exterior Design',
  'التصميم الخارجي الرياضي',
  NULL,
  NULL,
  NULL,
  0,
  1,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-glc-x254_3',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'sec_auto_interior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/glc/glc-suv-x254/modeloverview/09-2022/images/mercedes-benz-glc-x254-interior-696x392-09-2022.png',
  'Premium Interior',
  'المقصورة الداخلية الفاخرة',
  NULL,
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-glc-x254_4',
  'biz_model_mercedes-benz_mercedes_benz_glc_x254',
  'sec_auto_engine',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/glc/glc-suv-x254/modeloverview/09-2022/images/mercedes-benz-glc-x254-engine-696x392-09-2022.png',
  'Plug-in Hybrid Drivetrain',
  'نظام الدفع الهجين القابل للشحن',
  NULL,
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Mercedes-Benz Mercedes-Benz S-Class W223 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'Mercedes-Benz S-Class W223',
  'مرسيدس-بنز الفئة S W223',
  'mercedes-benz-s-class-w223',
  'vehicle_model',
  'automotive',
  'biz_brand_mercedes_benz',
  '/mercedes-benz/mercedes-benz-s-class-w223',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Mercedes-Benz S-Class W223","model_name_ar":"مرسيدس-بنز الفئة S W223","official_specs":{},"year":2024,"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/pdf/s-class-brochure.pdf"},"sec_auto_specs":{"engine":"3.0L V6 Turbo + 48V Mild Hybrid (M256)","engine_ar":"V6 توربو 3.0 لتر + هجين خفيف 48 فولت","power_hp":367,"torque_nm":500,"acceleration_0_100":4.9,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":9.1},"sec_listing_price":{"official_price_egp":12500000,"currency":"EGP","price_note":"Official agency price, subject to change","price_note_ar":"السعر الرسمي من الوكيل، قابل للتغيير","trim_range":{"min":12500000,"max":12500000,"count":1}},"sec_overview":{"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/pdf/s-class-brochure.pdf"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO business_relationships (
        id, from_business_id, to_business_id, relation_type, is_primary
) VALUES (
  'edge_biz_model_mercedes-benz_mercedes_benz_s_class_w223_sold_by_biz_dist_mercedes_benz_egypt',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'biz_dist_mercedes_benz_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-s-class-w223_mercedes_benz_s450_exclusive',
  'S 450 L Exclusive',
  'S 450 L إكسكلوسيف',
  'mercedes-benz-s450-exclusive',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  '/mercedes-benz/mercedes-benz-s-class-w223/mercedes-benz-s450-exclusive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":12500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"S 450 L Exclusive","trim_name_ar":"S 450 L إكسكلوسيف"},"sec_auto_specs":{"engine":"3.0L V6 Turbo + 48V Mild Hybrid (M256)","engine_ar":"V6 توربو 3.0 لتر + هجين خفيف 48 فولت","power_hp":367,"torque_nm":500,"acceleration_0_100":4.9,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":9.1}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mercedes-benz_mercedes_benz_s_class_w223 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mercedes-benz_mercedes_benz_s_class_w223';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-s-class-w223_1',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'sec_1_identity',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/modeloverview/09-2020/images/mercedes-benz-s-class-w223-modeloverview-696x392-09-2020.png',
  'S-Class W223 — The Pinnacle of Luxury',
  'الفئة S W223 — قمة الفخامة',
  NULL,
  NULL,
  NULL,
  1,
  0,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-s-class-w223_2',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'sec_auto_exterior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/modeloverview/09-2020/images/mercedes-benz-s-class-w223-exterior-696x392-09-2020.png',
  'Iconic Exterior Design',
  'التصميم الخارجي الأيقوني',
  NULL,
  NULL,
  NULL,
  0,
  1,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-s-class-w223_3',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'sec_auto_interior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/modeloverview/09-2020/images/mercedes-benz-s-class-w223-interior-696x392-09-2020.png',
  'Luxury Rear Suite',
  'الجناح الخلفي الفاخر',
  NULL,
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-s-class-w223_4',
  'biz_model_mercedes-benz_mercedes_benz_s_class_w223',
  'sec_auto_technology',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/s-class/s-class-saloon-w223/modeloverview/09-2020/images/mercedes-benz-s-class-w223-technology-696x392-09-2020.png',
  'MBUX Hyperscreen',
  'الشاشة الفائقة MBUX',
  NULL,
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Mercedes-Benz Mercedes-Benz GLE V167 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  'Mercedes-Benz GLE V167',
  'مرسيدس-بنز GLE V167',
  'mercedes-benz-gle-v167',
  'vehicle_model',
  'automotive',
  'biz_brand_mercedes_benz',
  '/mercedes-benz/mercedes-benz-gle-v167',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Mercedes-Benz GLE V167","model_name_ar":"مرسيدس-بنز GLE V167","official_specs":{},"year":2024,"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/gle/gle-suv-v167/pdf/gle-brochure.pdf"},"sec_auto_specs":{"engine":"3.0L Inline-6 Turbo + 48V Mild Hybrid","engine_ar":"6 سلندر توربو 3.0 لتر + هجين خفيف 48 فولت","power_hp":367,"torque_nm":500,"acceleration_0_100":5.7,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":9.5},"sec_listing_price":{"official_price_egp":9750000,"currency":"EGP","price_note":"Official agency price, subject to change","price_note_ar":"السعر الرسمي من الوكيل، قابل للتغيير","trim_range":{"min":9750000,"max":9750000,"count":1}},"sec_overview":{"brochure_url":"https://www.mercedes-benz.com.eg/content/dam/hq/passengercars/cars/gle/gle-suv-v167/pdf/gle-brochure.pdf"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO business_relationships (
        id, from_business_id, to_business_id, relation_type, is_primary
) VALUES (
  'edge_biz_model_mercedes-benz_mercedes_benz_gle_v167_sold_by_biz_dist_mercedes_benz_egypt',
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  'biz_dist_mercedes_benz_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mercedes-benz-gle-v167_mercedes_benz_gle450_amg',
  'GLE 450 AMG Line',
  'GLE 450 AMG لاين',
  'mercedes-benz-gle450-amg',
  'vehicle_trim',
  'automotive',
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  '/mercedes-benz/mercedes-benz-gle-v167/mercedes-benz-gle450-amg',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"GLE 450 AMG Line","trim_name_ar":"GLE 450 AMG لاين"},"sec_auto_specs":{"engine":"3.0L Inline-6 Turbo + 48V Mild Hybrid","engine_ar":"6 سلندر توربو 3.0 لتر + هجين خفيف 48 فولت","power_hp":367,"torque_nm":500,"acceleration_0_100":5.7,"top_speed_kmh":250,"transmission":"9G-Tronic Automatic","drive":"4MATIC AWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":9.5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mercedes-benz_mercedes_benz_gle_v167 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mercedes-benz_mercedes_benz_gle_v167';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-gle-v167_1',
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  'sec_1_identity',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/gle/gle-suv-v167/modeloverview/01-2023/images/mercedes-benz-gle-v167-fl-modeloverview-696x392-01-2023.png',
  'GLE V167 — Flagship SUV',
  'GLE V167 — سيارة الدفع الرباعي الرائدة',
  NULL,
  NULL,
  NULL,
  1,
  0,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-gle-v167_2',
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  'sec_auto_exterior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/gle/gle-suv-v167/modeloverview/01-2023/images/mercedes-benz-gle-v167-fl-exterior-696x392-01-2023.png',
  'Commanding Exterior',
  'الهيكل الخارجي الفارض',
  NULL,
  NULL,
  NULL,
  0,
  1,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mercedes-benz_mercedes-benz-gle-v167_3',
  'biz_model_mercedes-benz_mercedes_benz_gle_v167',
  'sec_auto_interior',
  'https://www.mercedes-benz.com/content/dam/hq/passengercars/cars/gle/gle-suv-v167/modeloverview/01-2023/images/mercedes-benz-gle-v167-fl-interior-696x392-01-2023.png',
  '7-Seat Luxury Interior',
  'المقصورة الفاخرة 7 مقاعد',
  NULL,
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
