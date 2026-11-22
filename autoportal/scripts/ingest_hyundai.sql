-- ========================================================
-- Brand Ingestion: Hyundai (هيونداي)
-- Generated: 2026-11-22 11:07:44
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_hyundai',
  'Hyundai',
  'هيونداي',
  'hyundai',
  'vehicle_brand',
  'automotive',
  NULL,
  '/hyundai',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":null,"official_website":"https://www.hyundai.com.eg","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/hyundai.svg"}}'
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
  'biz_dist_gb_auto_hyundai_egypt',
  'GB Auto — Hyundai Egypt',
  'غبور أوتو — هيونداي مصر',
  'gb-auto-hyundai-egypt',
  'main_agency',
  'automotive',
  NULL,
  '/gb-auto-hyundai-egypt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"GB Auto — Hyundai Egypt","company_name_ar":"غبور أوتو — هيونداي مصر","phone":"19900","website":"https://www.hyundai.com.eg","official_brands":["Hyundai"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: Hyundai Hyundai Elantra CN7 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_hyundai_hyundai_elantra_cn7',
  'Hyundai Elantra CN7',
  'هيونداي إيلانترا CN7',
  'hyundai-elantra-cn7',
  'vehicle_model',
  'automotive',
  'biz_brand_hyundai',
  '/hyundai/hyundai-elantra-cn7',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Hyundai Elantra CN7","model_name_ar":"هيونداي إيلانترا CN7","official_specs":{},"year":2024,"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/elantra/brochures/elantra-brochure-2024.pdf"},"sec_auto_specs":{"engine":"1.6L Smartstream G (MPI)","engine_ar":"1.6 لتر Smartstream G (MPI)","power_hp":123,"torque_nm":151,"acceleration_0_100":10.9,"top_speed_kmh":185,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.6,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"},"sec_listing_price":{"official_price_egp":1095000,"currency":"EGP","price_note":"Official GB Auto agency price, locally assembled in Abu Rawash","price_note_ar":"السعر الرسمي من غبور أوتو، تجميع محلي بأبو رواش","trim_range":{"min":1095000,"max":1485000,"count":3}},"sec_overview":{"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/elantra/brochures/elantra-brochure-2024.pdf"}}'
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
  'edge_biz_model_hyundai_hyundai_elantra_cn7_sold_by_biz_dist_gb_auto_hyundai_egypt',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'biz_dist_gb_auto_hyundai_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_hyundai-elantra-cn7_hyundai_elantra_smart',
  'Elantra Smart',
  'إيلانترا سمارت',
  'hyundai-elantra-smart',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_elantra_cn7',
  '/hyundai/hyundai-elantra-cn7/hyundai-elantra-smart',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1095000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Elantra Smart","trim_name_ar":"إيلانترا سمارت"},"sec_auto_specs":{"engine":"1.6L Smartstream G (MPI)","engine_ar":"1.6 لتر Smartstream G (MPI)","power_hp":123,"torque_nm":151,"acceleration_0_100":10.9,"top_speed_kmh":185,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.6,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"}}'
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
  'biz_trim_hyundai-elantra-cn7_hyundai_elantra_gls',
  'Elantra GLS',
  'إيلانترا GLS',
  'hyundai-elantra-gls',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_elantra_cn7',
  '/hyundai/hyundai-elantra-cn7/hyundai-elantra-gls',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1245000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Elantra GLS","trim_name_ar":"إيلانترا GLS"},"sec_auto_specs":{"engine":"1.6L Smartstream G (MPI)","engine_ar":"1.6 لتر Smartstream G (MPI)","power_hp":123,"torque_nm":151,"acceleration_0_100":10.9,"top_speed_kmh":185,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.9,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"}}'
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
  'biz_trim_hyundai-elantra-cn7_hyundai_elantra_ultra',
  'Elantra Ultra',
  'إيلانترا ألترا',
  'hyundai-elantra-ultra',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_elantra_cn7',
  '/hyundai/hyundai-elantra-cn7/hyundai-elantra-ultra',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1485000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Elantra Ultra","trim_name_ar":"إيلانترا ألترا"},"sec_auto_specs":{"engine":"1.6L Smartstream G (MPI) + 48V Mild Hybrid","engine_ar":"1.6 لتر Smartstream G + هجين خفيف 48 فولت","power_hp":123,"torque_nm":151,"acceleration_0_100":10.9,"top_speed_kmh":185,"transmission":"7-DCT Automatic","drive":"FWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":5.8,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_hyundai_hyundai_elantra_cn7 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_hyundai_hyundai_elantra_cn7';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_hyundai_hyundai-elantra-cn7_1',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'sec_1_identity',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/elantra-cn7/highlights/pc/202404/elantra-cn7-01-exterior-en.jpg',
  'Elantra CN7 — Parametric Design',
  'إيلانترا CN7 — التصميم البارامتري',
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
  'gal_hyundai_hyundai-elantra-cn7_2',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'sec_auto_exterior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/elantra-cn7/highlights/pc/202404/elantra-cn7-02-exterior-en.jpg',
  'Aerodynamic Body',
  'الهيكل الانسيابي',
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
  'gal_hyundai_hyundai-elantra-cn7_3',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'sec_auto_interior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/elantra-cn7/highlights/pc/202404/elantra-cn7-04-interior-en.jpg',
  '10.25" Dual Screen Cockpit',
  'قمرة قيادة بشاشتين 10.25 بوصة',
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
  'gal_hyundai_hyundai-elantra-cn7_4',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'sec_auto_safety',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/elantra-cn7/highlights/pc/202404/elantra-cn7-05-safety-en.jpg',
  'SmartSense Safety Suite',
  'منظومة الأمان SmartSense',
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
  'gal_hyundai_hyundai-elantra-cn7_5',
  'biz_model_hyundai_hyundai_elantra_cn7',
  'sec_auto_engine',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/elantra-cn7/highlights/pc/202404/elantra-cn7-06-engine-en.jpg',
  'Smartstream Engine',
  'محرك Smartstream',
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

-- ── Model: Hyundai Hyundai Accent RB ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_hyundai_hyundai_accent_rb',
  'Hyundai Accent RB',
  'هيونداي أكسنت RB',
  'hyundai-accent-rb',
  'vehicle_model',
  'automotive',
  'biz_brand_hyundai',
  '/hyundai/hyundai-accent-rb',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Hyundai Accent RB","model_name_ar":"هيونداي أكسنت RB","official_specs":{},"year":2024,"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/accent/brochures/accent-brochure-2024.pdf"},"sec_auto_specs":{"engine":"1.4L Gamma MPI","engine_ar":"1.4 لتر Gamma MPI","power_hp":100,"torque_nm":132,"acceleration_0_100":12.5,"top_speed_kmh":170,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"},"sec_listing_price":{"official_price_egp":745000,"currency":"EGP","price_note":"Official GB Auto agency price, locally assembled in Abu Rawash","price_note_ar":"السعر الرسمي من غبور أوتو، تجميع محلي بأبو رواش","trim_range":{"min":745000,"max":865000,"count":2}},"sec_overview":{"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/accent/brochures/accent-brochure-2024.pdf"}}'
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
  'edge_biz_model_hyundai_hyundai_accent_rb_sold_by_biz_dist_gb_auto_hyundai_egypt',
  'biz_model_hyundai_hyundai_accent_rb',
  'biz_dist_gb_auto_hyundai_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_hyundai-accent-rb_hyundai_accent_manual',
  'Accent 1.4 Manual',
  'أكسنت 1.4 يدوي',
  'hyundai-accent-manual',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_accent_rb',
  '/hyundai/hyundai-accent-rb/hyundai-accent-manual',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":745000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Accent 1.4 Manual","trim_name_ar":"أكسنت 1.4 يدوي"},"sec_auto_specs":{"engine":"1.4L Gamma MPI","engine_ar":"1.4 لتر Gamma MPI","power_hp":100,"torque_nm":132,"acceleration_0_100":12.5,"top_speed_kmh":170,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"}}'
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
  'biz_trim_hyundai-accent-rb_hyundai_accent_automatic',
  'Accent 1.4 Automatic',
  'أكسنت 1.4 أوتوماتيك',
  'hyundai-accent-automatic',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_accent_rb',
  '/hyundai/hyundai-accent-rb/hyundai-accent-automatic',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":865000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Accent 1.4 Automatic","trim_name_ar":"أكسنت 1.4 أوتوماتيك"},"sec_auto_specs":{"engine":"1.4L Gamma MPI","engine_ar":"1.4 لتر Gamma MPI","power_hp":100,"torque_nm":132,"acceleration_0_100":12.8,"top_speed_kmh":170,"transmission":"6-Speed Automatic (DCT)","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.3,"assembly":"Local — Abu Rawash Plant","assembly_ar":"تجميع محلي — مصنع أبو رواش"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_hyundai_hyundai_accent_rb to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_hyundai_hyundai_accent_rb';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_hyundai_hyundai-accent-rb_1',
  'biz_model_hyundai_hyundai_accent_rb',
  'sec_1_identity',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/accent-rb/highlights/pc/202305/accent-rb-01-exterior.jpg',
  'Accent RB — Economical Excellence',
  'أكسنت RB — التميز الاقتصادي',
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
  'gal_hyundai_hyundai-accent-rb_2',
  'biz_model_hyundai_hyundai_accent_rb',
  'sec_auto_exterior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/accent-rb/highlights/pc/202305/accent-rb-02-exterior.jpg',
  'Sporty Exterior Lines',
  'الخطوط الخارجية الرياضية',
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
  'gal_hyundai_hyundai-accent-rb_3',
  'biz_model_hyundai_hyundai_accent_rb',
  'sec_auto_interior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/accent-rb/highlights/pc/202305/accent-rb-03-interior.jpg',
  'Comfort Interior',
  'المقصورة الداخلية المريحة',
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

-- ── Model: Hyundai Hyundai Tucson NX4 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_hyundai_hyundai_tucson_nx4',
  'Hyundai Tucson NX4',
  'هيونداي توسان NX4',
  'hyundai-tucson-nx4',
  'vehicle_model',
  'automotive',
  'biz_brand_hyundai',
  '/hyundai/hyundai-tucson-nx4',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Hyundai Tucson NX4","model_name_ar":"هيونداي توسان NX4","official_specs":{},"year":2024,"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/tucson/brochures/tucson-brochure-2024.pdf"},"sec_auto_specs":{"engine":"2.0L Smartstream G (MPI)","engine_ar":"2.0 لتر Smartstream G (MPI)","power_hp":155,"torque_nm":192,"acceleration_0_100":10,"top_speed_kmh":195,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":8.2},"sec_listing_price":{"official_price_egp":1795000,"currency":"EGP","price_note":"Official GB Auto agency price","price_note_ar":"السعر الرسمي من غبور أوتو","trim_range":{"min":1795000,"max":2150000,"count":2}},"sec_overview":{"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/tucson/brochures/tucson-brochure-2024.pdf"}}'
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
  'edge_biz_model_hyundai_hyundai_tucson_nx4_sold_by_biz_dist_gb_auto_hyundai_egypt',
  'biz_model_hyundai_hyundai_tucson_nx4',
  'biz_dist_gb_auto_hyundai_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_hyundai-tucson-nx4_hyundai_tucson_smart',
  'Tucson Smart',
  'توسان سمارت',
  'hyundai-tucson-smart',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_tucson_nx4',
  '/hyundai/hyundai-tucson-nx4/hyundai-tucson-smart',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1795000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Tucson Smart","trim_name_ar":"توسان سمارت"},"sec_auto_specs":{"engine":"2.0L Smartstream G (MPI)","engine_ar":"2.0 لتر Smartstream G (MPI)","power_hp":155,"torque_nm":192,"acceleration_0_100":10,"top_speed_kmh":195,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":8.2}}'
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
  'biz_trim_hyundai-tucson-nx4_hyundai_tucson_ultra',
  'Tucson Ultra AWD',
  'توسان ألترا دفع رباعي',
  'hyundai-tucson-ultra',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_tucson_nx4',
  '/hyundai/hyundai-tucson-nx4/hyundai-tucson-ultra',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":2150000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Tucson Ultra AWD","trim_name_ar":"توسان ألترا دفع رباعي"},"sec_auto_specs":{"engine":"1.6L T-GDi Turbo","engine_ar":"1.6 لتر توربو T-GDi","power_hp":180,"torque_nm":265,"acceleration_0_100":8.5,"top_speed_kmh":210,"transmission":"7-DCT Automatic","drive":"HTRAC AWD","fuel_type":"Petrol","fuel_economy_combined":8.8}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_hyundai_hyundai_tucson_nx4 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_hyundai_hyundai_tucson_nx4';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_hyundai_hyundai-tucson-nx4_1',
  'biz_model_hyundai_hyundai_tucson_nx4',
  'sec_1_identity',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/tucson-nx4/highlights/pc/202208/tucson-nx4-01-exterior.jpg',
  'Tucson NX4 — Bold Parametric Design',
  'توسان NX4 — التصميم البارامتري الجريء',
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
  'gal_hyundai_hyundai-tucson-nx4_2',
  'biz_model_hyundai_hyundai_tucson_nx4',
  'sec_auto_exterior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/tucson-nx4/highlights/pc/202208/tucson-nx4-02-exterior.jpg',
  'Diamond-Cut Geometric Exterior',
  'الهيكل الخارجي الهندسي المقطوع بالماس',
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
  'gal_hyundai_hyundai-tucson-nx4_3',
  'biz_model_hyundai_hyundai_tucson_nx4',
  'sec_auto_interior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/tucson-nx4/highlights/pc/202208/tucson-nx4-04-interior.jpg',
  '10.25" Wide Screen Interior',
  'المقصورة الداخلية بشاشة 10.25 بوصة عريضة',
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
  'gal_hyundai_hyundai-tucson-nx4_4',
  'biz_model_hyundai_hyundai_tucson_nx4',
  'sec_auto_safety',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/tucson-nx4/highlights/pc/202208/tucson-nx4-05-safety.jpg',
  'Full SmartSense Package',
  'حزمة SmartSense الكاملة',
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

-- ── Model: Hyundai Hyundai Creta SU2i ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_hyundai_hyundai_creta_su2i',
  'Hyundai Creta SU2i',
  'هيونداي كريتا SU2i',
  'hyundai-creta-su2i',
  'vehicle_model',
  'automotive',
  'biz_brand_hyundai',
  '/hyundai/hyundai-creta-su2i',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Hyundai Creta SU2i","model_name_ar":"هيونداي كريتا SU2i","official_specs":{},"year":2024,"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/creta/brochures/creta-brochure-2024.pdf"},"sec_auto_specs":{"engine":"1.5L Smartstream G","engine_ar":"1.5 لتر Smartstream G","power_hp":115,"torque_nm":144,"acceleration_0_100":11.2,"top_speed_kmh":175,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.4},"sec_listing_price":{"official_price_egp":1395000,"currency":"EGP","price_note":"Official GB Auto agency price","price_note_ar":"السعر الرسمي من غبور أوتو","trim_range":{"min":1395000,"max":1895000,"count":3}},"sec_overview":{"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/creta/brochures/creta-brochure-2024.pdf"}}'
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
  'edge_biz_model_hyundai_hyundai_creta_su2i_sold_by_biz_dist_gb_auto_hyundai_egypt',
  'biz_model_hyundai_hyundai_creta_su2i',
  'biz_dist_gb_auto_hyundai_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_hyundai-creta-su2i_hyundai_creta_smart',
  'Creta Smart',
  'كريتا سمارت',
  'hyundai-creta-smart',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_creta_su2i',
  '/hyundai/hyundai-creta-su2i/hyundai-creta-smart',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1395000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Creta Smart","trim_name_ar":"كريتا سمارت"},"sec_auto_specs":{"engine":"1.5L Smartstream G","engine_ar":"1.5 لتر Smartstream G","power_hp":115,"torque_nm":144,"acceleration_0_100":11.2,"top_speed_kmh":175,"transmission":"6-Speed Manual","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.4}}'
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
  'biz_trim_hyundai-creta-su2i_hyundai_creta_ultra',
  'Creta Ultra',
  'كريتا ألترا',
  'hyundai-creta-ultra',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_creta_su2i',
  '/hyundai/hyundai-creta-su2i/hyundai-creta-ultra',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1685000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Creta Ultra","trim_name_ar":"كريتا ألترا"},"sec_auto_specs":{"engine":"1.5L Smartstream G (IVT)","engine_ar":"1.5 لتر Smartstream G (IVT)","power_hp":115,"torque_nm":144,"acceleration_0_100":11,"top_speed_kmh":175,"transmission":"IVT Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":6.1}}'
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
  'biz_trim_hyundai-creta-su2i_hyundai_creta_turbo',
  'Creta 1.5T Turbo',
  'كريتا 1.5 توربو',
  'hyundai-creta-turbo',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_creta_su2i',
  '/hyundai/hyundai-creta-su2i/hyundai-creta-turbo',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1895000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Creta 1.5T Turbo","trim_name_ar":"كريتا 1.5 توربو"},"sec_auto_specs":{"engine":"1.5L T-GDi Turbo","engine_ar":"1.5 لتر توربو T-GDi","power_hp":160,"torque_nm":253,"acceleration_0_100":7.9,"top_speed_kmh":195,"transmission":"7-DCT Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":7.1}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_hyundai_hyundai_creta_su2i to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_hyundai_hyundai_creta_su2i';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_hyundai_hyundai-creta-su2i_1',
  'biz_model_hyundai_hyundai_creta_su2i',
  'sec_1_identity',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/creta-su2i/highlights/pc/202401/creta-su2i-01-exterior.jpg',
  'Creta SU2i — Urban Crossover',
  'كريتا SU2i — الكروس أوفر الحضري',
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
  'gal_hyundai_hyundai-creta-su2i_2',
  'biz_model_hyundai_hyundai_creta_su2i',
  'sec_auto_exterior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/creta-su2i/highlights/pc/202401/creta-su2i-02-exterior.jpg',
  'Geometric Parametric Grille',
  'الشبكة الأمامية الهندسية البارامترية',
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
  'gal_hyundai_hyundai-creta-su2i_3',
  'biz_model_hyundai_hyundai_creta_su2i',
  'sec_auto_interior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/creta-su2i/highlights/pc/202401/creta-su2i-03-interior.jpg',
  'Panoramic Dual Screen',
  'الشاشة المزدوجة البانورامية',
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

-- ── Model: Hyundai Hyundai IONIQ 5 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_hyundai_hyundai_ioniq_5',
  'Hyundai IONIQ 5',
  'هيونداي أيونيك 5',
  'hyundai-ioniq-5',
  'vehicle_model',
  'automotive',
  'biz_brand_hyundai',
  '/hyundai/hyundai-ioniq-5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Hyundai IONIQ 5","model_name_ar":"هيونداي أيونيك 5","official_specs":{},"year":2024,"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/ioniq-5/brochures/ioniq5-brochure-2024.pdf"},"sec_auto_specs":{"engine":"Electric Motor (Rear)","engine_ar":"محرك كهربائي (خلفي)","power_hp":170,"torque_nm":350,"acceleration_0_100":8.5,"top_speed_kmh":185,"transmission":"Single-Speed Automatic","drive":"RWD","fuel_type":"Electric","battery_kwh":58,"range_km":384},"sec_listing_price":{"official_price_egp":3250000,"currency":"EGP","price_note":"Official GB Auto agency price","price_note_ar":"السعر الرسمي من غبور أوتو","trim_range":{"min":3250000,"max":3950000,"count":2}},"sec_overview":{"brochure_url":"https://www.hyundai.com.eg/content/dam/hyundai/eg/en/data/find-a-car/ioniq-5/brochures/ioniq5-brochure-2024.pdf"}}'
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
  'edge_biz_model_hyundai_hyundai_ioniq_5_sold_by_biz_dist_gb_auto_hyundai_egypt',
  'biz_model_hyundai_hyundai_ioniq_5',
  'biz_dist_gb_auto_hyundai_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_hyundai-ioniq-5_hyundai_ioniq5_standard_rwd',
  'IONIQ 5 Standard RWD',
  'أيونيك 5 ستاندرد دفع خلفي',
  'hyundai-ioniq5-standard-rwd',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_ioniq_5',
  '/hyundai/hyundai-ioniq-5/hyundai-ioniq5-standard-rwd',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"IONIQ 5 Standard RWD","trim_name_ar":"أيونيك 5 ستاندرد دفع خلفي"},"sec_auto_specs":{"engine":"Electric Motor (Rear)","engine_ar":"محرك كهربائي (خلفي)","power_hp":170,"torque_nm":350,"acceleration_0_100":8.5,"top_speed_kmh":185,"transmission":"Single-Speed Automatic","drive":"RWD","fuel_type":"Electric","battery_kwh":58,"range_km":384}}'
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
  'biz_trim_hyundai-ioniq-5_hyundai_ioniq5_long_range_awd',
  'IONIQ 5 Long Range AWD',
  'أيونيك 5 لونج رينج دفع رباعي',
  'hyundai-ioniq5-long-range-awd',
  'vehicle_trim',
  'automotive',
  'biz_model_hyundai_hyundai_ioniq_5',
  '/hyundai/hyundai-ioniq-5/hyundai-ioniq5-long-range-awd',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3950000,"currency":"EGP"},"sec_1_identity":{"trim_name":"IONIQ 5 Long Range AWD","trim_name_ar":"أيونيك 5 لونج رينج دفع رباعي"},"sec_auto_specs":{"engine":"Dual Electric Motors (AWD)","engine_ar":"محركان كهربائيان (دفع رباعي)","power_hp":325,"torque_nm":605,"acceleration_0_100":5.1,"top_speed_kmh":185,"transmission":"Single-Speed Automatic","drive":"AWD","fuel_type":"Electric","battery_kwh":77.4,"range_km":507}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_hyundai_hyundai_ioniq_5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_hyundai_hyundai_ioniq_5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_hyundai_hyundai-ioniq-5_1',
  'biz_model_hyundai_hyundai_ioniq_5',
  'sec_1_identity',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/ioniq5/highlights/pc/202205/ioniq5-01-exterior.jpg',
  'IONIQ 5 — Retro Futuristic Design',
  'أيونيك 5 — التصميم الرجعي المستقبلي',
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
  'gal_hyundai_hyundai-ioniq-5_2',
  'biz_model_hyundai_hyundai_ioniq_5',
  'sec_auto_exterior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/ioniq5/highlights/pc/202205/ioniq5-02-exterior.jpg',
  'Parametric Pixel Design',
  'التصميم البكسلي البارامتري',
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
  'gal_hyundai_hyundai-ioniq-5_3',
  'biz_model_hyundai_hyundai_ioniq_5',
  'sec_auto_interior',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/ioniq5/highlights/pc/202205/ioniq5-03-interior.jpg',
  'Eco-Process Relaxation Living Space',
  'مساحة المعيشة بالمواد الصديقة للبيئة',
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
  'gal_hyundai_hyundai-ioniq-5_4',
  'biz_model_hyundai_hyundai_ioniq_5',
  'sec_auto_technology',
  'https://www.hyundai.com/content/dam/hyundai/ww/en/data/find-a-car/ioniq5/highlights/pc/202205/ioniq5-05-tech.jpg',
  'Vehicle-to-Load V2L Technology',
  'تقنية V2L للشحن من السيارة',
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
