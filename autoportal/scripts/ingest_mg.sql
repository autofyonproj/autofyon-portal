-- ========================================================
-- Brand Ingestion: MG (إم جي)
-- Generated: 2026-11-22 11:34:22
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_mg',
  'MG',
  'إم جي',
  'mg',
  'vehicle_brand',
  'automotive',
  NULL,
  '/mg',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":null,"official_website":"https://www.mgmotor.com.eg","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mg.svg"},"_data_provenance":{"sources":[{"id":"src_mg_egypt","name":"MG Motor Egypt (Al Mansour)","url":"https://www.mgmotor.com.eg"},{"id":"src_mg_gcc","name":"MG Motor Middle East (GCC)","url":"https://www.mg-me.com"}]}}'
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
  'biz_dist_mansour_automotive_mg',
  'Mansour Automotive — MG Egypt (Exclusive Importer)',
  'المنصور للسيارات — إم جي مصر (الوكيل الحصري)',
  'mansour-automotive-mg',
  'main_agency',
  'automotive',
  NULL,
  '/mansour-automotive-mg',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Mansour Automotive — MG Egypt (Exclusive Importer)","company_name_ar":"المنصور للسيارات — إم جي مصر (الوكيل الحصري)","phone":"16424","website":"https://www.mgmotor.com.eg","official_brands":["MG"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: MG MG 5 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_mg_5',
  'MG 5',
  'إم جي 5',
  'mg-5',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG 5","model_name_ar":"إم جي 5","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/mg5/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Engine & Displacement","egypt_value":"1.5L 4-Cylinder (120 hp / 150 Nm) CVT","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/mg5/","gcc_country":"Saudi Arabia / UAE","gcc_trim_name":"Standard / Luxury","gcc_value":"1.5L 4-Cylinder (118-120 hp / 150 Nm) CVT","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg5/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"سعة المحرك والقوة","explanation_ar":"تطابق تام في المحرك والهيكل مع أسواق الخليج"}]},"sec_listing_price":{"official_price_egp":889990,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":889990,"max":989990,"count":2}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/mg5/"}}'
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
  'edge_biz_model_mg_mg_5_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_mg_5',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_5_std',
  'Standard AT',
  'ستاندرد أوتوماتيك',
  'mg-5-standard',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_5',
  '/mg/mg-5/mg-5-standard',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":889990,"currency":"EGP"},"sec_1_identity":{"trim_name":"Standard AT","trim_name_ar":"ستاندرد أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder DOHC","engine_ar":"4 سلندر 1.5 لتر DOHC","power_hp":120,"torque_nm":150,"transmission":"Automatic CVT","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4601L x 1818W x 1489H","trunk_liters":512,"fuel_tank_liters":45,"airbags":2,"screen":"8-inch Touchscreen with Apple CarPlay & Android Auto"}}'
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
  'biz_trim_mg_5_lux',
  'Luxury AT',
  'لاكشري أوتوماتيك',
  'mg-5-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_5',
  '/mg/mg-5/mg-5-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":989990,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury AT","trim_name_ar":"لاكشري أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder DOHC","engine_ar":"4 سلندر 1.5 لتر DOHC","power_hp":120,"torque_nm":150,"transmission":"Automatic CVT","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4601L x 1818W x 1489H","trunk_liters":512,"airbags":6,"screen":"10-inch HD Screen with 360-degree camera & Sunroof"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_mg_5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_mg_5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-5_1',
  'biz_model_mg_mg_5',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1879/mg5_ext_front.jpg',
  'MG 5 — Exterior Front View',
  'إم جي 5 — الواجهة الخارجية والشبكة الأمامية',
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
  'gal_mg_mg-5_2',
  'biz_model_mg_mg_5',
  'sec_auto_interior',
  'https://www.mgmotor.com.eg/media/1880/mg5_int_360.jpg',
  '10-inch HD Screen & 360 Camera',
  'كاميرا 360 درجة وشاشة 10 بوصة HD',
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

-- ── Model: MG MG ZS ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_mg_zs',
  'MG ZS',
  'إم جي ZS',
  'mg-zs',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-zs',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG ZS","model_name_ar":"إم جي ZS","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/zs/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Generation & Transmission","egypt_value":"Proven Generation: 1.5L (119 hp) + 4-Speed Auto","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/zs/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"New Gen ZS","gcc_value":"All-New Generation: 1.5L (110 hp) + CVT + 12.3-inch screen","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg-zs/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"الجيل وناقل الحركة","explanation_ar":"طرح الجيل الجديد في أسواق الخليج مبكراً بينما يستمر الجيل المجرّب بمصر"}]},"sec_listing_price":{"official_price_egp":1075000,"currency":"EGP","price_note":"Official Mansour Automotive price (MY 2026)","price_note_ar":"السعر الرسمي من المنصور للسيارات (موديل 2026)","trim_range":{"min":1075000,"max":1165000,"count":2}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/zs/"}}'
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
  'edge_biz_model_mg_mg_zs_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_mg_zs',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_zs_comf',
  'Comfort AT',
  'كومفورت أوتوماتيك',
  'mg-zs-comfort',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_zs',
  '/mg/mg-zs/mg-zs-comfort',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1075000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Comfort AT","trim_name_ar":"كومفورت أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder DOHC","engine_ar":"4 سلندر 1.5 لتر","power_hp":119,"torque_nm":150,"transmission":"4-Speed Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":5.8,"dimensions_mm":"4314L x 1809W x 1624H","airbags":4,"wheels":"17-inch Alloy Wheels"}}'
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
  'biz_trim_mg_zs_lux',
  'Luxury Facelift',
  'لاكشري فيس ليفت',
  'mg-zs-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_zs',
  '/mg/mg-zs/mg-zs-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1165000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury Facelift","trim_name_ar":"لاكشري فيس ليفت"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder DOHC","engine_ar":"4 سلندر 1.5 لتر","power_hp":119,"torque_nm":150,"transmission":"4-Speed Automatic","drive":"FWD","fuel_type":"Petrol","fuel_economy_combined":5.8,"airbags":6,"screen":"8-inch Screen with Rear Camera"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_mg_zs to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_mg_zs';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-zs_1',
  'biz_model_mg_mg_zs',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1881/mgzs_ext_front.jpg',
  'MG ZS — Compact SUV Exterior',
  'إم جي ZS — التصميم الخارجي والمصابيح النهارية LED',
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

-- ── Model: MG MG GT ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_gt',
  'MG GT',
  'إم جي GT',
  'mg-gt',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-gt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG GT","model_name_ar":"إم جي GT","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/mg-gt/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Engine Performance","egypt_value":"1.5L Turbo (170 hp / 275 Nm) 7-Speed Wet DCT","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/mg-gt/","gcc_country":"Saudi Arabia / UAE","gcc_trim_name":"DEL / LUX 1.5T","gcc_value":"1.5L Turbo (173 hp / 275 Nm) 7-Speed DCT","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg-gt/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"المحرك والأداء","explanation_ar":"الأداء الرياضي متطابق والتسارع 8.5 ثانية إلى 100 كم/س"}]},"sec_listing_price":{"official_price_egp":1110000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1110000,"max":1175000,"count":2}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/mg-gt/"}}'
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
  'edge_biz_model_mg_gt_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_gt',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_gt_comf',
  'Comfort AT',
  'كومفورت أوتوماتيك',
  'mg-gt-comfort',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_gt',
  '/mg/mg-gt/mg-gt-comfort',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1110000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Comfort AT","trim_name_ar":"كومفورت أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (170 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":170,"torque_nm":275,"acceleration_0_100":8.5,"top_speed_kmh":215,"transmission":"7-Speed Wet DCT Automatic","drive":"FWD","fuel_type":"Petrol","screen":"12.3-inch Digital Cockpit + 10.25-inch Touchscreen + Sunroof"}}'
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
  'biz_trim_mg_gt_lux',
  'Luxury AT',
  'لاكشري أوتوماتيك',
  'mg-gt-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_gt',
  '/mg/mg-gt/mg-gt-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1175000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury AT","trim_name_ar":"لاكشري أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (170 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":170,"torque_nm":275,"acceleration_0_100":8.5,"top_speed_kmh":215,"transmission":"7-Speed Wet DCT Automatic","drive":"FWD","fuel_type":"Petrol","safety":"360-degree camera + Lane Departure Warning"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_gt to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_gt';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-gt_1',
  'biz_model_mg_gt',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1882/mggt_int_cockpit.jpg',
  'MG GT — 12.3-inch Digital Cockpit',
  'شاشة العدادات الرقمية 12.3 بوصة',
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

-- ── Model: MG MG G50 Plus ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_g50_plus',
  'MG G50 Plus',
  'إم جي G50 بلس',
  'mg-g50-plus',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-g50-plus',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG G50 Plus","model_name_ar":"إم جي G50 بلس","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/g50-plus/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Engine & Seating","egypt_value":"1.5L Turbo (170 hp / 285 Nm) 7-DCT, 7-Seats","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/g50-plus/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"Maxus / MG G50","gcc_value":"1.5L Turbo (169-170 hp) 7-DCT, 7-Seats","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com","gcc_model_year":2027,"review_status":"approved","attribute_ar":"التسمية والمحرك","explanation_ar":"مطابقة كاملة في الهيكل العائلي 7 مقاعد ومنظومة التكييف الثلاثي"}]},"sec_listing_price":{"official_price_egp":1325000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1325000,"max":1325000,"count":1}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/g50-plus/"}}'
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
  'edge_biz_model_mg_g50_plus_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_g50_plus',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_g50_lux',
  'Luxury 7-Seats',
  'لاكشري 7 مقاعد',
  'mg-g50-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_g50_plus',
  '/mg/mg-g50-plus/mg-g50-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1325000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury 7-Seats","trim_name_ar":"لاكشري 7 مقاعد"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (170 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":170,"torque_nm":285,"transmission":"7-Speed DCT Automatic","drive":"FWD","fuel_type":"Petrol","seats":7,"airbags":4,"ac":"Independent Rear Air Conditioning for all 3 rows","screen":"12.3-inch HD Display"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_g50_plus to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_g50_plus';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-g50-plus_1',
  'biz_model_mg_g50_plus',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1883/mgg50_int_cabin.jpg',
  'MG G50 Plus — 7-Seat Family Cabin',
  'المقصورة العائلية 7 مقاعد وتكييف خلفي مستقل',
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

-- ── Model: MG MG ONE ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_mg_one',
  'MG ONE',
  'إم جي وان',
  'mg-one',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-one',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG ONE","model_name_ar":"إم جي وان","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/mg-one/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Drivetrain & Cabin Tech","egypt_value":"1.5L Turbo (181 hp / 285 Nm) CVT, 30-inch Triple Screen","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/mg-one/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"LUX","gcc_value":"1.5L Turbo (181 hp / 285 Nm) CVT, 30-inch Triple Screen","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg-one/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"الفئات والتجهيزات","explanation_ar":"تطابق تام في المحرك والشاشة البانورامية الثلاثية 30 بوصة"}]},"sec_listing_price":{"official_price_egp":1425000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1425000,"max":1425000,"count":1}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/mg-one/"}}'
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
  'edge_biz_model_mg_mg_one_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_mg_one',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_one_lux',
  'Luxury AT',
  'لاكشري أوتوماتيك',
  'mg-one-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_one',
  '/mg/mg-one/mg-one-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1425000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury AT","trim_name_ar":"لاكشري أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (181 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":181,"torque_nm":285,"transmission":"Advanced CVT","drive":"FWD","fuel_type":"Petrol","screen":"30-inch Integrated Triple Panoramic Screen","features":"Panoramic Sunroof + 360-degree camera + 6 airbags"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_mg_one to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_mg_one';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-one_1',
  'biz_model_mg_mg_one',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1884/mgone_int_screen.jpg',
  'MG ONE — 30-inch Triple Panoramic Screen',
  'الشاشة البانورامية المزدوجة 30 بوصة',
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

-- ── Model: MG MG RX5 Plus ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_mg_rx5',
  'MG RX5 Plus',
  'إم جي RX5 بلس',
  'mg-rx5',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-rx5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG RX5 Plus","model_name_ar":"إم جي RX5 بلس","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/rx5-plus/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Drivetrain & Body","egypt_value":"1.5L Turbo (171 hp / 275 Nm) 7-Speed Wet DCT","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/rx5-plus/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"LUX","gcc_value":"1.5L Turbo (171 hp / 275 Nm) 7-Speed DCT","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg-rx5-plus/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"المحرك والهيكل","explanation_ar":"تطابق تام في المحرك والهيكل مع أسواق الخليج"}]},"sec_listing_price":{"official_price_egp":1475000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1475000,"max":1475000,"count":1}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/rx5-plus/"}}'
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
  'edge_biz_model_mg_mg_rx5_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_mg_rx5',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_rx5_lux',
  'Luxury AT',
  'لاكشري أوتوماتيك',
  'mg-rx5-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_rx5',
  '/mg/mg-rx5/mg-rx5-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1475000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury AT","trim_name_ar":"لاكشري أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (171 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":171,"torque_nm":275,"transmission":"7-Speed Wet DCT Automatic","drive":"FWD","fuel_type":"Petrol","screen":"14.1-inch Vertical Infotainment + 12.3-inch Digital Cockpit","features":"Electric Tailgate + Panoramic Sunroof + 360 Camera + 6 Airbags"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_mg_rx5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_mg_rx5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-rx5_1',
  'biz_model_mg_mg_rx5',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1885/mgrx5_int_disp.jpg',
  'MG RX5 Plus — 14.1-inch Vertical Screen',
  'الشاشة الوسطية العمودية 14.1 بوصة',
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

-- ── Model: MG MG HS ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_mg_hs',
  'MG HS',
  'إم جي HS والنسخة الهايبرد',
  'mg-hs',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-hs',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG HS","model_name_ar":"إم جي HS والنسخة الهايبرد","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/hs/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Drivetrain Options","egypt_value":"1.5T (170 hp) FWD + HEV Hybrid (221 hp)","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/hs/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"Trophy AWD / Hybrid+","gcc_value":"2.0T (231 hp) AWD + Hybrid+ (221 hp)","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg-hs/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"خيارات المحرك والدفع","explanation_ar":"تفضيل محركات 2.0L والدفع الكلي AWD في الخليج بينما يوفر وكيل مصر 1.5T وHEV لتوفير استهلاك الوقود والجمارك"}]},"sec_listing_price":{"official_price_egp":1550000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1550000,"max":1650000,"count":2}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/hs/"}}'
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
  'edge_biz_model_mg_mg_hs_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_mg_hs',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_hs_lux',
  'Luxury 1.5T',
  'لاكشري 1.5 تيربو',
  'mg-hs-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_hs',
  '/mg/mg-hs/mg-hs-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1550000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury 1.5T","trim_name_ar":"لاكشري 1.5 تيربو"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (170 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":170,"torque_nm":275,"transmission":"7-Speed DCT Automatic","drive":"FWD","fuel_type":"Petrol","safety":"6 Airbags + ADAS Safety Package (Blind Spot, Forward Collision Warning)","features":"Panoramic Sunroof + Sport Leather Seats + Super Sport Mode"}}'
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
  'biz_trim_mg_hs_hev',
  'HEV Hybrid',
  'هايبرد HEV',
  'mg-hs-hev',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_mg_hs',
  '/mg/mg-hs/mg-hs-hev',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1650000,"currency":"EGP"},"sec_1_identity":{"trim_name":"HEV Hybrid","trim_name_ar":"هايبرد HEV"},"sec_auto_specs":{"engine":"1.5L Turbo + Electric Hybrid Motor","engine_ar":"1.5 لتر تيربو + محرك كهربائي هجين","power_hp":221,"torque_nm":340,"transmission":"Dedicated Hybrid Transmission (DHT)","drive":"FWD","fuel_type":"Petrol Hybrid (HEV)","safety":"Extended ADAS Package"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_mg_hs to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_mg_hs';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-hs_1',
  'biz_model_mg_mg_hs',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1886/mghs_int_sport.jpg',
  'MG HS — Sport Cabin & Super Sport Button',
  'المقصورة الرياضية وزر Super Sport',
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

-- ── Model: MG MG 7 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_mg_7',
  'MG 7',
  'إم جي 7',
  'mg-7',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-7',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"MG 7","model_name_ar":"إم جي 7","official_specs":{},"year":2027,"brochure_url":"https://www.mgmotor.com.eg/model/mg7/"},"sec_auto_specs":{"market_comparisons":[{"attribute_en":"Engine, Power & Transmission","egypt_value":"1.5L Turbo (185 hp / 300 Nm) 7-Speed DCT","egypt_source_id":"src_mg_egypt","egypt_source_url":"https://www.mgmotor.com.eg/model/mg7/","gcc_country":"UAE / Saudi Arabia","gcc_trim_name":"Trophy 2.0T","gcc_value":"2.0L Turbo (261 hp / 405 Nm) ZF 9-Speed Automatic","gcc_source_id":"src_mg_gcc","gcc_source_url":"https://www.mg-me.com/new-cars/mg7/","gcc_model_year":2027,"review_status":"approved","attribute_ar":"المحرك والقوة وناقل الحركة","explanation_ar":"مصر تعتمد محرك 1.5T لتجنب الشريحة الجمركية المرتفعة لما فوق 1600 سي سي، بينما تتوفر نسخة 2.0T الأقوى في الخليج"}]},"sec_listing_price":{"official_price_egp":1625000,"currency":"EGP","price_note":"Official Mansour Automotive price","price_note_ar":"السعر الرسمي من المنصور للسيارات","trim_range":{"min":1625000,"max":1750000,"count":2}},"sec_overview":{"brochure_url":"https://www.mgmotor.com.eg/model/mg7/"}}'
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
  'edge_biz_model_mg_7_sold_by_biz_dist_mansour_automotive_mg',
  'biz_model_mg_7',
  'biz_dist_mansour_automotive_mg',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_mg_7_lux',
  'Luxury 1.5T',
  'لاكشري 1.5 تيربو',
  'mg-7-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_7',
  '/mg/mg-7/mg-7-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1625000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Luxury 1.5T","trim_name_ar":"لاكشري 1.5 تيربو"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (185 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":185,"torque_nm":300,"transmission":"7-Speed DCT Automatic","drive":"FWD","fuel_type":"Petrol","features":"33-inch Dual Screen + Frameless Doors"}}'
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
  'biz_trim_mg_7_trophy',
  'Trophy 1.5T',
  'تروفي 1.5 تيربو',
  'mg-7-trophy',
  'vehicle_trim',
  'automotive',
  'biz_model_mg_7',
  '/mg/mg-7/mg-7-trophy',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Trophy 1.5T","trim_name_ar":"تروفي 1.5 تيربو"},"sec_auto_specs":{"engine":"1.5L 4-Cyl Turbo (185 hp)","engine_ar":"4 سلندر توربو 1.5 لتر","power_hp":185,"torque_nm":300,"transmission":"7-Speed DCT Automatic","drive":"FWD with E-LSD","fuel_type":"Petrol","features":"Active Aero Spoiler + 14-Speaker Bose Premium Audio + E-LSD Electronic Limited Slip Differential + Full ADAS"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_mg_7 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_mg_7';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_mg_mg-7_1',
  'biz_model_mg_7',
  'sec_1_identity',
  'https://www.mgmotor.com.eg/media/1887/mg7_ext_spoiler.jpg',
  'MG 7 — Active Aero Spoiler & Frameless Doors',
  'الجناح الخلفي النشط والأبواب بدون إطار',
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
