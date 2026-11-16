-- ========================================================
-- Brand Ingestion: BMW (بي إم دبليو)
-- Generated: 2026-11-16 20:57:35
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_bmw',
  'BMW',
  'بي إم دبليو',
  'bmw',
  'vehicle_brand',
  'automotive',
  NULL,
  '/bmw',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":"Germany","official_website":"https://www.bmw-egypt.com","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset/logos/optimized/bmw.svg"}}'
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
  'biz_dist_global_auto_egypt',
  'Global Auto Group - BMW Egypt',
  'مجموعة جلوبال أوتو - وكيل بي إم دبليو في مصر',
  'global-auto-egypt',
  'main_agency',
  'automotive',
  NULL,
  '/global-auto-egypt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Global Auto Group - BMW Egypt","company_name_ar":"مجموعة جلوبال أوتو - وكيل بي إم دبليو في مصر","phone":"19269","website":"https://www.bmw-egypt.com","official_brands":["BMW"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: BMW 1 Series ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_1_series',
  '1 Series',
  'الفئة الأولى',
  'bmw-1-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-1-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Hatchback","model_name":"1 Series","model_name_ar":"الفئة الأولى","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"}}'
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
  'edge_biz_model_bmw_bmw_1_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_1_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-1-series_bmw_1_series_118_m_sport',
  '118 M Sport',
  '118 M Sport',
  'bmw-1-series-118-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_1_series',
  '/bmw/bmw-1-series/bmw-1-series-118-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":2550000,"currency":"EGP"},"sec_1_identity":{"trim_name":"118 M Sport","trim_name_ar":"118 M Sport"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_1_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_1_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-1-series_1',
  'biz_model_bmw_bmw_1_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Official Agency Stage View',
  'بي إم دبليو الفئة الأولى - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
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
  'gal_bmw_bmw-1-series_2',
  'biz_model_bmw_bmw_1_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_exterior_rear-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Exterior Design & Styling',
  'بي إم دبليو الفئة الأولى - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
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
  'gal_bmw_bmw-1-series_3',
  'biz_model_bmw_bmw_1_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_exterior_kidney_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Alloy Wheels & Details',
  'بي إم دبليو الفئة الأولى - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
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
  'gal_bmw_bmw-1-series_4',
  'biz_model_bmw_bmw_1_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_interior-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Cockpit & Curved Display',
  'بي إم دبليو الفئة الأولى - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
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
  'gal_bmw_bmw-1-series_5',
  'biz_model_bmw_bmw_1_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_interior_curved-display_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Luxury Interior & Seating',
  'بي إم دبليو الفئة الأولى - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
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
  'gal_bmw_bmw-1-series_6',
  'biz_model_bmw_bmw_1_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/f70_ice_exterior_driving-dynamics_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 1 Series - Engine & Performance Dynamics',
  'بي إم دبليو الفئة الأولى - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW 2 Series Gran Coupe ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_2_series',
  '2 Series Gran Coupe',
  'الفئة الثانية جران كوبيه',
  'bmw-2-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-2-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Coupe","model_name":"2 Series Gran Coupe","model_name_ar":"الفئة الثانية جران كوبيه","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-2_dec2022.pdf.asset.1670234093111.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-2_dec2022.pdf.asset.1670234093111.pdf"}}'
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
  'edge_biz_model_bmw_bmw_2_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_2_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-2-series_bmw_2_series_218i_m_sport',
  '218i M Sport',
  '218i M Sport',
  'bmw-2-series-218i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_2_series',
  '/bmw/bmw-2-series/bmw-2-series-218i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":2750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"218i M Sport","trim_name_ar":"218i M Sport"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":140,"torque_nm":"220 @ 1480–4200","transmission":"DCT 7 سرعات (دفع أمامي)","fuel_type":"بنزين","acceleration_0_100_s":8.7,"top_speed_kmh":213,"fuel_tank_l":50,"trunk_capacity_l":430,"wheels":"18 بوصة M Y-spoke 553","seats":5}}'
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
  'biz_trim_bmw-2-series_bmw_2_series_218i_advantage',
  '218i Advantage',
  '218i Advantage',
  'bmw-2-series-218i-advantage',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_2_series',
  '/bmw/bmw-2-series/bmw-2-series-218i-advantage',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"218i Advantage","trim_name_ar":"218i Advantage"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":140,"torque_nm":"220 @ 1480–4200","transmission":"DCT 7 سرعات (دفع أمامي)","fuel_type":"بنزين","acceleration_0_100_s":8.7,"top_speed_kmh":213,"fuel_tank_l":50,"trunk_capacity_l":430,"wheels":"17 بوصة 548","seats":5}}'
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
  'biz_trim_bmw-2-series_bmw_2_series_218i_sport_line',
  '218i Sport Line',
  '218i Sport Line',
  'bmw-2-series-218i-sport-line',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_2_series',
  '/bmw/bmw-2-series/bmw-2-series-218i-sport-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"218i Sport Line","trim_name_ar":"218i Sport Line"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":140,"torque_nm":"220 @ 1480–4200","transmission":"DCT 7 سرعات (دفع أمامي)","fuel_type":"بنزين","acceleration_0_100_s":8.7,"top_speed_kmh":213,"fuel_tank_l":50,"trunk_capacity_l":430,"wheels":"17 بوصة 549","seats":5}}'
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
  'biz_trim_bmw-2-series_bmw_2_series_m235i_xdrive',
  'M235i xDrive',
  'M235i xDrive',
  'bmw-2-series-m235i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_2_series',
  '/bmw/bmw-2-series/bmw-2-series-m235i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M235i xDrive","trim_name_ar":"M235i xDrive"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":306,"torque_nm":"450 @ 1750–4500","transmission":"Sport Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":4.9,"top_speed_kmh":250,"fuel_tank_l":50,"trunk_capacity_l":430,"wheels":"18 بوصة M","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_2_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_2_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-2-series_1',
  'biz_model_bmw_bmw_2_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 2 Series Gran Coupe - Official Agency Stage View',
  'بي إم دبليو الفئة الثانية جران كوبيه - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
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
  'gal_bmw_bmw-2-series_2',
  'biz_model_bmw_bmw_2_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_exterior_positioning-new-front-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 2 Series Gran Coupe - Exterior Design & Styling',
  'بي إم دبليو الفئة الثانية جران كوبيه - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
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
  'gal_bmw_bmw-2-series_3',
  'biz_model_bmw_bmw_2_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_exterior_m-kidney-iconic-glow_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 2 Series Gran Coupe - Alloy Wheels & Details',
  'بي إم دبليو الفئة الثانية جران كوبيه - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
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
  'gal_bmw_bmw-2-series_4',
  'biz_model_bmw_bmw_2_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_interior_positioning-loop_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 2 Series Gran Coupe - Cockpit & Curved Display',
  'بي إم دبليو الفئة الثانية جران كوبيه - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
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
  'gal_bmw_bmw-2-series_5',
  'biz_model_bmw_bmw_2_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_interior_illuminated-metal-trims-1:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 2 Series Gran Coupe - Luxury Interior & Seating',
  'بي إم دبليو الفئة الثانية جران كوبيه - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
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
  'gal_bmw_bmw-2-series_6',
  'biz_model_bmw_bmw_2_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/f74_ice_driving-dynamics_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 2 Series Gran Coupe - Engine & Performance Dynamics',
  'بي إم دبليو الفئة الثانية جران كوبيه - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW 3 Series Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_3_series',
  '3 Series Sedan',
  'الفئة الثالثة سيدان',
  'bmw-3-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-3-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"3 Series Sedan","model_name_ar":"الفئة الثالثة سيدان","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"}}'
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
  'edge_biz_model_bmw_bmw_3_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_3_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-3-series_bmw_3_series_320i_advantage',
  '320i Advantage',
  '320i Advantage',
  'bmw-3-series-320i-advantage',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-320i-advantage',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i Advantage","trim_name_ar":"320i Advantage"},"sec_auto_specs":{"displacement_cc":1597,"power_hp":170,"torque_nm":"250 @ 2000–4700","transmission":"أوتوماتيك Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.1,"top_speed_kmh":228,"fuel_tank_l":59,"trunk_capacity_l":480,"kerb_weight_kg":1515,"wheels":"17 بوصة V-spoke 775 مع إطارات Run-flat","seats":5}}'
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
  'biz_trim_bmw-3-series_bmw_3_series_320i_luxury_line',
  '320i Luxury Line',
  '320i Luxury Line',
  'bmw-3-series-320i-luxury-line',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-320i-luxury-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i Luxury Line","trim_name_ar":"320i Luxury Line"},"sec_auto_specs":{"displacement_cc":1597,"power_hp":170,"torque_nm":"250 @ 2000–4700","transmission":"أوتوماتيك Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.1,"top_speed_kmh":228,"fuel_tank_l":59,"trunk_capacity_l":480,"kerb_weight_kg":1515,"wheels":"18 بوصة Double-spoke 782 Run-flat","seats":5}}'
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
  'biz_trim_bmw-3-series_bmw_3_series_320i_m_sport',
  '320i M Sport',
  '320i M Sport',
  'bmw-3-series-320i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-320i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i M Sport","trim_name_ar":"320i M Sport"},"sec_auto_specs":{"displacement_cc":1597,"power_hp":170,"torque_nm":"250 @ 2000–4700","transmission":"أوتوماتيك Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.1,"top_speed_kmh":228,"fuel_tank_l":59,"trunk_capacity_l":480,"kerb_weight_kg":1515,"wheels":"18 بوصة M Double-spoke 848","seats":5}}'
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
  'biz_trim_bmw-3-series_bmw_3_series_330i_m_sport',
  '330i M Sport',
  '330i M Sport',
  'bmw-3-series-330i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-330i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"330i M Sport","trim_name_ar":"330i M Sport"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":258,"torque_nm":"400 @ 1550–4400","transmission":"أوتوماتيك Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":5.9,"top_speed_kmh":250,"fuel_tank_l":59,"trunk_capacity_l":480,"kerb_weight_kg":1525,"wheels":"18 بوصة M Double-spoke 848","seats":5}}'
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
  'biz_trim_bmw-3-series_bmw_3_series_m340i_xdrive',
  'M340i xDrive',
  'M340i xDrive',
  'bmw-3-series-m340i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-m340i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":6750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"M340i xDrive","trim_name_ar":"M340i xDrive"},"sec_auto_specs":{"displacement_cc":2998,"power_hp":387,"torque_nm":"500 @ 1900–5000","transmission":"Steptronic Sport 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":4.4,"top_speed_kmh":250,"fuel_tank_l":59,"trunk_capacity_l":480,"kerb_weight_kg":1695,"wheels":"19 بوصة M Double-spoke 792","seats":5}}'
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
  'biz_trim_bmw-3-series_bmw_3_series_320_sport_320i_m_sport',
  '320 Sport (يطابق 320i M Sport؟)',
  '320 Sport (يطابق 320i M Sport؟)',
  'bmw-3-series-320-sport-320i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-3-series-320-sport-320i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"320 Sport (يطابق 320i M Sport؟)","trim_name_ar":"320 Sport (يطابق 320i M Sport؟)"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_3_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_3_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-3-series_1',
  'biz_model_bmw_bmw_3_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g20_ice_stage-50-years:3to4?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 3 Series Sedan - Official Agency Stage View',
  'بي إم دبليو الفئة الثالثة سيدان - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
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
  'gal_bmw_bmw-3-series_2',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g20_ice_ext_kidney:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 3 Series Sedan - Exterior Design & Styling',
  'بي إم دبليو الفئة الثالثة سيدان - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
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
  'gal_bmw_bmw-3-series_3',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g20_ice_ext_kidney:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW 3 Series Sedan - Alloy Wheels & Details',
  'بي إم دبليو الفئة الثالثة سيدان - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
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
  'gal_bmw_bmw-3-series_4',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g20_ice_int_dashboard:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 3 Series Sedan - Cockpit & Curved Display',
  'بي إم دبليو الفئة الثالثة سيدان - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
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
  'gal_bmw_bmw-3-series_5',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g20_ice_int_dashboard:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW 3 Series Sedan - Luxury Interior & Seating',
  'بي إم دبليو الفئة الثالثة سيدان - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
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
  'gal_bmw_bmw-3-series_6',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_reversing-assistant_dsk_ta?qlt=80&wid=1024&fmt=webp',
  'BMW 3 Series Sedan - Engine & Performance Dynamics',
  'بي إم دبليو الفئة الثالثة سيدان - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW 4 Series Gran Coupe & Cabrio ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_4_series',
  '4 Series Gran Coupe & Cabrio',
  'الفئة الرابعة',
  'bmw-4-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-4-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Coupe","model_name":"4 Series Gran Coupe & Cabrio","model_name_ar":"الفئة الرابعة","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"}}'
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
  'edge_biz_model_bmw_bmw_4_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_4_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-4-series_bmw_4_series_420i_m_sport_gran_coupe',
  '420i M Sport (Gran Coupe في البروشور)',
  '420i M Sport (Gran Coupe في البروشور)',
  'bmw-4-series-420i-m-sport-gran-coupe',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_4_series',
  '/bmw/bmw-4-series/bmw-4-series-420i-m-sport-gran-coupe',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"420i M Sport (Gran Coupe في البروشور)","trim_name_ar":"420i M Sport (Gran Coupe في البروشور)"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":184,"torque_nm":"300 @ 1350–4000","transmission":"Sport Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":7.9,"top_speed_kmh":235,"fuel_tank_l":59,"trunk_capacity_l":470,"kerb_weight_kg":1620,"wheels":"18 بوصة M 848","seats":5}}'
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
  'biz_trim_bmw-4-series_bmw_4_series_420i_convertible_m_sport',
  '420i Convertible M Sport',
  '420i Convertible M Sport',
  'bmw-4-series-420i-convertible-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_4_series',
  '/bmw/bmw-4-series/bmw-4-series-420i-convertible-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"420i Convertible M Sport","trim_name_ar":"420i Convertible M Sport"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":184,"torque_nm":"300 @ 1350–4000","transmission":"Sport Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.2,"top_speed_kmh":236,"fuel_tank_l":59,"trunk_capacity_l":300,"kerb_weight_kg":1690,"wheels":"18 بوصة M 848","seats":5}}'
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
  'biz_trim_bmw-4-series_bmw_4_series_m440i_xdrive_coupe',
  'M440i xDrive Coupe',
  'M440i xDrive Coupe',
  'bmw-4-series-m440i-xdrive-coupe',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_4_series',
  '/bmw/bmw-4-series/bmw-4-series-m440i-xdrive-coupe',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M440i xDrive Coupe","trim_name_ar":"M440i xDrive Coupe"},"sec_auto_specs":{"displacement_cc":2998,"power_hp":387,"torque_nm":"500 @ 1800–5000","transmission":"Sport Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":4.5,"top_speed_kmh":250,"fuel_tank_l":59,"trunk_capacity_l":440,"kerb_weight_kg":1735,"wheels":"19 بوصة M 792","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_4_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_4_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-4-series_1',
  'biz_model_bmw_bmw_4_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g23_stage:2to3?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 4 Series Gran Coupe & Cabrio - Official Agency Stage View',
  'بي إم دبليو الفئة الرابعة - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
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
  'gal_bmw_bmw-4-series_2',
  'biz_model_bmw_bmw_4_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/bmw-driving-assistant-professional-3-1?qlt=80&wid=1024&fmt=webp',
  'BMW 4 Series Gran Coupe & Cabrio - Exterior Design & Styling',
  'بي إم دبليو الفئة الرابعة - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
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
  'gal_bmw_bmw-4-series_3',
  'biz_model_bmw_bmw_4_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_360-surround-view_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 4 Series Gran Coupe & Cabrio - Alloy Wheels & Details',
  'بي إم دبليو الفئة الرابعة - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
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
  'gal_bmw_bmw-4-series_4',
  'biz_model_bmw_bmw_4_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g23_stage:2to3?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW 4 Series Gran Coupe & Cabrio - Cockpit & Curved Display',
  'بي إم دبليو الفئة الرابعة - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
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
  'gal_bmw_bmw-4-series_5',
  'biz_model_bmw_bmw_4_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g23_stage:16to7?fmt=webp-alpha&wid=1279&fit=constrain%2C1',
  'BMW 4 Series Gran Coupe & Cabrio - Luxury Interior & Seating',
  'بي إم دبليو الفئة الرابعة - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
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
  'gal_bmw_bmw-4-series_6',
  'biz_model_bmw_bmw_4_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/g23_technology_intelligent-personal-assistant:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 4 Series Gran Coupe & Cabrio - Engine & Performance Dynamics',
  'بي إم دبليو الفئة الرابعة - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW 5 Series Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_5_series',
  '5 Series Sedan',
  'الفئة الخامسة سيدان',
  'bmw-5-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-5-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"5 Series Sedan","model_name_ar":"الفئة الخامسة سيدان","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-5.pdf.asset.1681294407006.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-5.pdf.asset.1681294407006.pdf"}}'
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
  'edge_biz_model_bmw_bmw_5_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_5_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-5-series_bmw_5_series_520i_advantage',
  '520i Advantage',
  '520i Advantage',
  'bmw-5-series-520i-advantage',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-5-series-520i-advantage',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"520i Advantage","trim_name_ar":"520i Advantage"},"sec_auto_specs":{"displacement_cc":1597,"power_hp":170,"torque_nm":"250 @ 2000–4700","transmission":"Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.3,"top_speed_kmh":226,"fuel_tank_l":68,"trunk_capacity_l":530,"kerb_weight_kg":1580,"wheels":"18 بوصة Double-spoke 844 Run-flat","seats":5}}'
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
  'biz_trim_bmw-5-series_bmw_5_series_520i_luxury_line',
  '520i Luxury Line',
  '520i Luxury Line',
  'bmw-5-series-520i-luxury-line',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-5-series-520i-luxury-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"520i Luxury Line","trim_name_ar":"520i Luxury Line"},"sec_auto_specs":{"displacement_cc":1597,"power_hp":170,"torque_nm":"250 @ 2000–4700","transmission":"Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":8.3,"top_speed_kmh":226,"fuel_tank_l":68,"trunk_capacity_l":530,"kerb_weight_kg":1580,"wheels":"18 بوصة W-spoke 632 Run-flat","seats":5}}'
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
  'biz_trim_bmw-5-series_bmw_5_series_530i_luxury_line',
  '530i Luxury Line',
  '530i Luxury Line',
  'bmw-5-series-530i-luxury-line',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-5-series-530i-luxury-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"530i Luxury Line","trim_name_ar":"530i Luxury Line"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":252,"torque_nm":"350 @ 1450–4800","transmission":"Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":6.5,"top_speed_kmh":250,"fuel_tank_l":68,"trunk_capacity_l":530,"kerb_weight_kg":1625,"wheels":"18 بوصة V-spoke 684 Run-flat","seats":5}}'
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
  'biz_trim_bmw-5-series_bmw_5_series_520_m_sport_2027',
  '520 M Sport (2027)',
  '520 M Sport (2027)',
  'bmw-5-series-520-m-sport-2027',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-5-series-520-m-sport-2027',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4900000,"currency":"EGP"},"sec_1_identity":{"trim_name":"520 M Sport (2027)","trim_name_ar":"520 M Sport (2027)"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_5_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_5_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-5-series_1',
  'biz_model_bmw_bmw_5_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g60-phev-stage-ext-dsk-fb?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Official Agency Stage View',
  'بي إم دبليو الفئة الخامسة سيدان - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
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
  'gal_bmw_bmw-5-series_2',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g60_ice_ext-design-highlights_1_illuminated-kidney-c1-titan-bronze_dsk_fb-2_de?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Exterior Design & Styling',
  'بي إم دبليو الفئة الخامسة سيدان - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
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
  'gal_bmw_bmw-5-series_3',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g60_ice_driving-dynamics_dsk_psf_en?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Alloy Wheels & Details',
  'بي إم دبليو الفئة الخامسة سيدان - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
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
  'gal_bmw_bmw-5-series_4',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g60_ice_ext-design-highlights_2_dynamic-light-carpet-titan-bronze_dsk_shfv_de?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Cockpit & Curved Display',
  'بي إم دبليو الفئة الخامسة سيدان - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
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
  'gal_bmw_bmw-5-series_5',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g60_ice_ext-design-highlights_3_skyroof_dsk_shfv_de?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Luxury Interior & Seating',
  'بي إم دبليو الفئة الخامسة سيدان - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
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
  'gal_bmw_bmw-5-series_6',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/g60_ice_int-design-video-loop_dsk_fb-1_en?qlt=80&wid=1024&fmt=webp',
  'BMW 5 Series Sedan - Engine & Performance Dynamics',
  'بي إم دبليو الفئة الخامسة سيدان - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW 7 Series Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_7_series',
  '7 Series Sedan',
  'الفئة السابعة سيدان',
  'bmw-7-series',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-7-series',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"7 Series Sedan","model_name_ar":"الفئة السابعة سيدان","official_specs":{},"year":2026,"brochure_url":"https://eg.hatla2ee.com/en/new-car/bmw/7-series/48223"},"sec_overview":{"brochure_url":"https://eg.hatla2ee.com/en/new-car/bmw/7-series/48223"}}'
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
  'edge_biz_model_bmw_bmw_7_series_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_7_series',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-7-series_bmw_7_series_735li_740li_xdrive_740li_mhev_760li',
  '735Li / 740Li xDrive / 740Li MHEV / 760Li',
  '735Li / 740Li xDrive / 740Li MHEV / 760Li',
  'bmw-7-series-735li-740li-xdrive-740li-mhev-760li',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_7_series',
  '/bmw/bmw-7-series/bmw-7-series-735li-740li-xdrive-740li-mhev-760li',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9900000,"currency":"EGP"},"sec_1_identity":{"trim_name":"735Li / 740Li xDrive / 740Li MHEV / 760Li","trim_name_ar":"735Li / 740Li xDrive / 740Li MHEV / 760Li"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
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
  'biz_trim_bmw-7-series_bmw_7_series_760i_xdrive_yallamotor_760li_xdrive_mhev',
  '760i xDrive (يسميها Yallamotor 760Li xDrive MHEV)',
  '760i xDrive (يسميها Yallamotor 760Li xDrive MHEV)',
  'bmw-7-series-760i-xdrive-yallamotor-760li-xdrive-mhev',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_7_series',
  '/bmw/bmw-7-series/bmw-7-series-760i-xdrive-yallamotor-760li-xdrive-mhev',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":12500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"760i xDrive (يسميها Yallamotor 760Li xDrive MHEV)","trim_name_ar":"760i xDrive (يسميها Yallamotor 760Li xDrive MHEV)"},"sec_auto_specs":{"displacement_cc":4400,"power_hp":544,"torque_nm":"750","transmission":"أوتوماتيك 8 سرعات","fuel_type":"بنزين (48 فولت مايلد هايبرد)","acceleration_0_100_s":4.2,"top_speed_kmh":250,"fuel_tank_l":75,"trunk_capacity_l":540,"wheels":"غير متوفر","seats":4}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_7_series to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_7_series';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-7-series_1',
  'biz_model_bmw_bmw_7_series',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g70-ice-phev_stage:3to4?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 7 Series Sedan - Official Agency Stage View',
  'بي إم دبليو الفئة السابعة سيدان - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
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
  'gal_bmw_bmw-7-series_2',
  'biz_model_bmw_bmw_7_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g70-ice-phev_exterior_highlight_side-view-chrome:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 7 Series Sedan - Exterior Design & Styling',
  'بي إم دبليو الفئة السابعة سيدان - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
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
  'gal_bmw_bmw-7-series_3',
  'biz_model_bmw_bmw_7_series',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g70-ice-phev_exterior_highlight_side-view-chrome:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW 7 Series Sedan - Alloy Wheels & Details',
  'بي إم دبليو الفئة السابعة سيدان - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
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
  'gal_bmw_bmw-7-series_4',
  'biz_model_bmw_bmw_7_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g70-ice-phev_interior-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 7 Series Sedan - Cockpit & Curved Display',
  'بي إم دبليو الفئة السابعة سيدان - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
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
  'gal_bmw_bmw-7-series_5',
  'biz_model_bmw_bmw_7_series',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g70-ice-phev_interior_fond-entertainment:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW 7 Series Sedan - Luxury Interior & Seating',
  'بي إم دبليو الفئة السابعة سيدان - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
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
  'gal_bmw_bmw-7-series_6',
  'biz_model_bmw_bmw_7_series',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_360-surround-view_mob_fb?qlt=80&wid=1024&fmt=webp',
  'BMW 7 Series Sedan - Engine & Performance Dynamics',
  'بي إم دبليو الفئة السابعة سيدان - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X1 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x1',
  'X1',
  'إكس 1',
  'bmw-x1',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x1',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X1","model_name_ar":"إكس 1","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x1_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x1',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x1_bmw_x1_sdrive18i_xline',
  'sDrive18i xLine',
  'sDrive18i xLine',
  'bmw-x1-sdrive18i-xline',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x1',
  '/bmw/bmw-x1/bmw-x1-sdrive18i-xline',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3200000,"currency":"EGP"},"sec_1_identity":{"trim_name":"sDrive18i xLine","trim_name_ar":"sDrive18i xLine"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":156,"torque_nm":"230 @ 1500–4600","transmission":"Steptronic ثنائي القابض 7 سرعات","fuel_type":"بنزين","acceleration_0_100_s":9,"top_speed_kmh":215,"fuel_tank_l":54,"trunk_capacity_l":540,"kerb_weight_kg":1500,"wheels":"19 بوصة V-spoke 867","seats":5}}'
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
  'biz_trim_bmw-x1_bmw_x1_sdrive18i_m_sport',
  'sDrive18i M Sport',
  'sDrive18i M Sport',
  'bmw-x1-sdrive18i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x1',
  '/bmw/bmw-x1/bmw-x1-sdrive18i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"sDrive18i M Sport","trim_name_ar":"sDrive18i M Sport"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":156,"torque_nm":"230 @ 1500–4600","transmission":"Steptronic ثنائي القابض 7 سرعات","fuel_type":"بنزين","acceleration_0_100_s":9,"top_speed_kmh":215,"fuel_tank_l":54,"trunk_capacity_l":540,"kerb_weight_kg":1500,"wheels":"19 بوصة M Double-spoke 871","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x1 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x1';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x1_1',
  'biz_model_bmw_bmw_x1',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/u11-ice_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X1 - Official Agency Stage View',
  'بي إم دبليو إكس 1 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
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
  'gal_bmw_bmw-x1_2',
  'biz_model_bmw_bmw_x1',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u11-ice_exterior_rear-lights:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X1 - Exterior Design & Styling',
  'بي إم دبليو إكس 1 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
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
  'gal_bmw_bmw-x1_3',
  'biz_model_bmw_bmw_x1',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u11-ice_exterior_rear-lights:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X1 - Alloy Wheels & Details',
  'بي إم دبليو إكس 1 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
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
  'gal_bmw_bmw-x1_4',
  'biz_model_bmw_bmw_x1',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u11-ice_interior_bmw-curved-display:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X1 - Cockpit & Curved Display',
  'بي إم دبليو إكس 1 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
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
  'gal_bmw_bmw-x1_5',
  'biz_model_bmw_bmw_x1',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u11-ice_interior_bmw-curved-display:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X1 - Luxury Interior & Seating',
  'بي إم دبليو إكس 1 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
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
  'gal_bmw_bmw-x1_6',
  'biz_model_bmw_bmw_x1',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_selective-beam_dsk_fb-2?qlt=80&wid=1024&fmt=webp',
  'BMW X1 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 1 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X2 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x2',
  'X2',
  'إكس 2',
  'bmw-x2',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x2',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X2","model_name_ar":"إكس 2","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/all-models/x-series/THE-X2-iX2-Brochure.pdf.asset.1714058021077.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/all-models/x-series/THE-X2-iX2-Brochure.pdf.asset.1714058021077.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x2_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x2',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x2_bmw_x2_sdrive18i_m_sport',
  'sDrive18i M Sport',
  'sDrive18i M Sport',
  'bmw-x2-sdrive18i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x2',
  '/bmw/bmw-x2/bmw-x2-sdrive18i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3600000,"currency":"EGP"},"sec_1_identity":{"trim_name":"sDrive18i M Sport","trim_name_ar":"sDrive18i M Sport"},"sec_auto_specs":{"displacement_cc":1499,"power_hp":156,"torque_nm":"230 @ 1500–4600","transmission":"Steptronic ثنائي القابض 7 سرعات","fuel_type":"بنزين","acceleration_0_100_s":9,"top_speed_kmh":213,"fuel_tank_l":45,"trunk_capacity_l":560,"kerb_weight_kg":1525,"wheels":"19 بوصة M 871 أو 20 بوصة M 873","seats":5}}'
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
  'biz_trim_bmw-x2_bmw_x2_m35i_xdrive',
  'M35i xDrive',
  'M35i xDrive',
  'bmw-x2-m35i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x2',
  '/bmw/bmw-x2/bmw-x2-m35i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M35i xDrive","trim_name_ar":"M35i xDrive"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":300,"torque_nm":"400 @ 2000–4500","transmission":"غير متوفر","fuel_type":"بنزين","acceleration_0_100_s":5.4,"top_speed_kmh":250,"fuel_tank_l":54,"trunk_capacity_l":560,"kerb_weight_kg":1695,"wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x2 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x2';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x2_1',
  'biz_model_bmw_bmw_x2',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Official Agency Stage View',
  'بي إم دبليو إكس 2 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
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
  'gal_bmw_bmw-x2_2',
  'biz_model_bmw_bmw_x2',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_ext_led-headlights_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Exterior Design & Styling',
  'بي إم دبليو إكس 2 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
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
  'gal_bmw_bmw-x2_3',
  'biz_model_bmw_bmw_x2',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_ext_led-rear-lights_shfv?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Alloy Wheels & Details',
  'بي إم دبليو إكس 2 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
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
  'gal_bmw_bmw-x2_4',
  'biz_model_bmw_bmw_x2',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_interior-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Cockpit & Curved Display',
  'بي إم دبليو إكس 2 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
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
  'gal_bmw_bmw-x2_5',
  'biz_model_bmw_bmw_x2',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_int_panorama-glass-roof_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Luxury Interior & Seating',
  'بي إم دبليو إكس 2 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
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
  'gal_bmw_bmw-x2_6',
  'biz_model_bmw_bmw_x2',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/u10_ice_driving-dynamics_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X2 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 2 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X3 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x3',
  'X3',
  'إكس 3',
  'bmw-x3',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x3',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X3","model_name_ar":"إكس 3","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/Home/Models/x3/BMW_X3_Brochure.pdf.asset.1693561775509.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/Home/Models/x3/BMW_X3_Brochure.pdf.asset.1693561775509.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x3_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x3',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x3_bmw_x3_xdrive30i_xline_g01_2025',
  'xDrive30i xLine (الجيل الحالي G01 – بروشور 2025)',
  'xDrive30i xLine (الجيل الحالي G01 – بروشور 2025)',
  'bmw-x3-xdrive30i-xline-g01-2025',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x3',
  '/bmw/bmw-x3/bmw-x3-xdrive30i-xline-g01-2025',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4350000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive30i xLine (الجيل الحالي G01 – بروشور 2025)","trim_name_ar":"xDrive30i xLine (الجيل الحالي G01 – بروشور 2025)"},"sec_auto_specs":{"displacement_cc":1998,"power_hp":252,"torque_nm":"350 @ 1450–4800","transmission":"Steptronic 8 سرعات","fuel_type":"بنزين","acceleration_0_100_s":6.6,"top_speed_kmh":240,"fuel_tank_l":65,"trunk_capacity_l":550,"kerb_weight_kg":1810,"wheels":"19 بوصة Y-spoke","seats":5}}'
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
  'biz_trim_bmw-x3_bmw_x3_30_xdrive_m_sport_2027',
  '30 xDrive M Sport (الجيل الجديد 2027)',
  '30 xDrive M Sport (الجيل الجديد 2027)',
  'bmw-x3-30-xdrive-m-sport-2027',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x3',
  '/bmw/bmw-x3/bmw-x3-30-xdrive-m-sport-2027',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":5300000,"currency":"EGP"},"sec_1_identity":{"trim_name":"30 xDrive M Sport (الجيل الجديد 2027)","trim_name_ar":"30 xDrive M Sport (الجيل الجديد 2027)"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","trunk_capacity_l":570,"wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x3 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x3';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x3_1',
  'biz_model_bmw_bmw_x3',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X3 - Official Agency Stage View',
  'بي إم دبليو إكس 3 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
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
  'gal_bmw_bmw-x3_2',
  'biz_model_bmw_bmw_x3',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_ext-design_kidney-iconic-glow_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X3 - Exterior Design & Styling',
  'بي إم دبليو إكس 3 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
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
  'gal_bmw_bmw-x3_3',
  'biz_model_bmw_bmw_x3',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_ext-design_m-light-alloy-wheels?qlt=80&wid=1024&fmt=webp',
  'BMW X3 - Alloy Wheels & Details',
  'بي إم دبليو إكس 3 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
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
  'gal_bmw_bmw-x3_4',
  'biz_model_bmw_bmw_x3',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_interior_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X3 - Cockpit & Curved Display',
  'بي إم دبليو إكس 3 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
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
  'gal_bmw_bmw-x3_5',
  'biz_model_bmw_bmw_x3',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_int-design_sport-seats_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X3 - Luxury Interior & Seating',
  'بي إم دبليو إكس 3 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
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
  'gal_bmw_bmw-x3_6',
  'biz_model_bmw_bmw_x3',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/g45_ice_digital_intelligent-personal-assistant:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X3 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 3 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X5 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x5',
  'X5',
  'إكس 5',
  'bmw-x5',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X5","model_name_ar":"إكس 5","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/oct2024/The%20X5%20-%20MY2024.pdf.asset.1729094407795.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/oct2024/The%20X5%20-%20MY2024.pdf.asset.1729094407795.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x5_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x5',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x5_bmw_x5_xdrive40i_xline_2024',
  'xDrive40i xLine (2024)',
  'xDrive40i xLine (2024)',
  'bmw-x5-xdrive40i-xline-2024',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x5',
  '/bmw/bmw-x5/bmw-x5-xdrive40i-xline-2024',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":7300000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive40i xLine (2024)","trim_name_ar":"xDrive40i xLine (2024)"},"sec_auto_specs":{"displacement_cc":2998,"power_hp":381,"torque_nm":"540","transmission":"غير متوفر","fuel_type":"بنزين","acceleration_0_100_s":5.4,"top_speed_kmh":250,"trunk_capacity_l":650,"wheels":"غير متوفر","seats":5}}'
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
  'biz_trim_bmw-x5_bmw_x5_m60i_xdrive',
  'M60i xDrive',
  'M60i xDrive',
  'bmw-x5-m60i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x5',
  '/bmw/bmw-x5/bmw-x5-m60i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M60i xDrive","trim_name_ar":"M60i xDrive"},"sec_auto_specs":{"power_hp":530,"torque_nm":"750","transmission":"غير متوفر","fuel_type":"غير متوفر","acceleration_0_100_s":4.3,"top_speed_kmh":250,"trunk_capacity_l":650,"wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x5_1',
  'biz_model_bmw_bmw_x5',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g05_exterior_video_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X5 - Official Agency Stage View',
  'بي إم دبليو إكس 5 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
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
  'gal_bmw_bmw-x5_2',
  'biz_model_bmw_bmw_x5',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g05_spaciousness_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X5 - Exterior Design & Styling',
  'بي إم دبليو إكس 5 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
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
  'gal_bmw_bmw-x5_3',
  'biz_model_bmw_bmw_x5',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/bmw-parking-assistant-professional-3-1?qlt=80&wid=1024&fmt=webp',
  'BMW X5 - Alloy Wheels & Details',
  'بي إم دبليو إكس 5 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
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
  'gal_bmw_bmw-x5_4',
  'biz_model_bmw_bmw_x5',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g05_interior_highlights_curveddisplay:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X5 - Cockpit & Curved Display',
  'بي إم دبليو إكس 5 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
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
  'gal_bmw_bmw-x5_5',
  'biz_model_bmw_bmw_x5',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g05_interior_highlights_curveddisplay:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X5 - Luxury Interior & Seating',
  'بي إم دبليو إكس 5 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
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
  'gal_bmw_bmw-x5_6',
  'biz_model_bmw_bmw_x5',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_live-cockpit-pro_dsk_us-discl_fb?qlt=80&wid=1024&fmt=webp',
  'BMW X5 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 5 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X6 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x6',
  'X6',
  'إكس 6',
  'bmw-x6',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x6',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X6","model_name_ar":"إكس 6","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The_new_X6_Brochure.pdf.asset.1701147693683.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The_new_X6_Brochure.pdf.asset.1701147693683.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x6_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x6',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x6_bmw_x6_xdrive40i',
  'xDrive40i',
  'xDrive40i',
  'bmw-x6-xdrive40i',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x6',
  '/bmw/bmw-x6/bmw-x6-xdrive40i',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":7950000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive40i","trim_name_ar":"xDrive40i"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
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
  'biz_trim_bmw-x6_bmw_x6_m60i_xdrive',
  'M60i xDrive',
  'M60i xDrive',
  'bmw-x6-m60i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x6',
  '/bmw/bmw-x6/bmw-x6-m60i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M60i xDrive","trim_name_ar":"M60i xDrive"},"sec_auto_specs":{"displacement_cc":4395,"power_hp":530,"torque_nm":"750 @ 1800–4600","transmission":"Sport Steptronic 8 سرعات","fuel_type":"بنزين (48 فولت مايلد هايبرد)","acceleration_0_100_s":4.3,"top_speed_kmh":250,"fuel_tank_l":83,"trunk_capacity_l":580,"kerb_weight_kg":2315,"wheels":"21 بوصة M Y-spoke 741","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x6 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x6';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x6_1',
  'biz_model_bmw_bmw_x6',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g06_stage:3to4?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X6 - Official Agency Stage View',
  'بي إم دبليو إكس 6 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
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
  'gal_bmw_bmw-x6_2',
  'biz_model_bmw_bmw_x6',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g06_exterior_22-inch-m-light-alloy-wheels:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X6 - Exterior Design & Styling',
  'بي إم دبليو إكس 6 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
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
  'gal_bmw_bmw-x6_3',
  'biz_model_bmw_bmw_x6',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g06_exterior_22-inch-m-light-alloy-wheels:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X6 - Alloy Wheels & Details',
  'بي إم دبليو إكس 6 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
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
  'gal_bmw_bmw-x6_4',
  'biz_model_bmw_bmw_x6',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g06_interior_highlight_fb-1?qlt=80&wid=1024&fmt=webp',
  'BMW X6 - Cockpit & Curved Display',
  'بي إم دبليو إكس 6 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
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
  'gal_bmw_bmw-x6_5',
  'biz_model_bmw_bmw_x6',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g06_interior_m-leather-steering-wheel:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X6 - Luxury Interior & Seating',
  'بي إم دبليو إكس 6 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
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
  'gal_bmw_bmw-x6_6',
  'biz_model_bmw_bmw_x6',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/bmw-driving-assistant-professional-1-1?qlt=80&wid=1024&fmt=webp',
  'BMW X6 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 6 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW X7 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x7',
  'X7',
  'إكس 7',
  'bmw-x7',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-x7',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"X7","model_name_ar":"إكس 7","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-New-X7-2024-Brochure.pdf.asset.1695205436128.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-New-X7-2024-Brochure.pdf.asset.1695205436128.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x7_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_x7',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x7_bmw_x7_m60i_xdrive',
  'M60i xDrive',
  'M60i xDrive',
  'bmw-x7-m60i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x7',
  '/bmw/bmw-x7/bmw-x7-m60i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"M60i xDrive","trim_name_ar":"M60i xDrive"},"sec_auto_specs":{"displacement_cc":4395,"power_hp":530,"torque_nm":"750 @ 1800–4600","transmission":"غير متوفر","fuel_type":"بنزين","acceleration_0_100_s":4.7,"top_speed_kmh":250,"fuel_tank_l":83,"trunk_capacity_l":750,"kerb_weight_kg":2600,"wheels":"غير متوفر","seats":6}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_x7 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_x7';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-x7_1',
  'biz_model_bmw_bmw_x7',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g07_mpa_stage:3to4?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X7 - Official Agency Stage View',
  'بي إم دبليو إكس 7 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
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
  'gal_bmw_bmw-x7_2',
  'biz_model_bmw_bmw_x7',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g07_mpa_exterior_front:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X7 - Exterior Design & Styling',
  'بي إم دبليو إكس 7 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
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
  'gal_bmw_bmw-x7_3',
  'biz_model_bmw_bmw_x7',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g07_mpa_exterior_front:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X7 - Alloy Wheels & Details',
  'بي إم دبليو إكس 7 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
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
  'gal_bmw_bmw-x7_4',
  'biz_model_bmw_bmw_x7',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g07_mpa_interieur_steeringwheel:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW X7 - Cockpit & Curved Display',
  'بي إم دبليو إكس 7 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
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
  'gal_bmw_bmw-x7_5',
  'biz_model_bmw_bmw_x7',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g07_mpa_interieur_steeringwheel:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW X7 - Luxury Interior & Seating',
  'بي إم دبليو إكس 7 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
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
  'gal_bmw_bmw-x7_6',
  'biz_model_bmw_bmw_x7',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/bmw-parking-assistant-professional-3-1-1?qlt=80&wid=1024&fmt=webp',
  'BMW X7 - Engine & Performance Dynamics',
  'بي إم دبليو إكس 7 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW i4 Gran Coupe ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_i4',
  'i4 Gran Coupe',
  'آي 4 جران كوبيه',
  'bmw-i4',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-i4',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Coupe","model_name":"i4 Gran Coupe","model_name_ar":"آي 4 جران كوبيه","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"}}'
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
  'edge_biz_model_bmw_bmw_i4_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_i4',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-i4_bmw_i4_edrive40_gran_coupe_m_sport',
  'eDrive40 Gran Coupe M Sport',
  'eDrive40 Gran Coupe M Sport',
  'bmw-i4-edrive40-gran-coupe-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_i4',
  '/bmw/bmw-i4/bmw-i4-edrive40-gran-coupe-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"eDrive40 Gran Coupe M Sport","trim_name_ar":"eDrive40 Gran Coupe M Sport"},"sec_auto_specs":{"power_hp":340,"torque_nm":"430","transmission":"محرك كهربائي على المحور الخلفي","fuel_type":"كهربائي","acceleration_0_100_s":5.6,"top_speed_kmh":190,"trunk_capacity_l":470,"kerb_weight_kg":2050,"wheels":"18 بوصة M 858","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_i4 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_i4';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-i4_1',
  'biz_model_bmw_bmw_i4',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g26_bev_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW i4 Gran Coupe - Official Agency Stage View',
  'بي إم دبليو آي 4 جران كوبيه - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
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
  'gal_bmw_bmw-i4_2',
  'biz_model_bmw_bmw_i4',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g26_bev_rear-lights_fb?qlt=80&wid=1024&fmt=webp',
  'BMW i4 Gran Coupe - Exterior Design & Styling',
  'بي إم دبليو آي 4 جران كوبيه - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
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
  'gal_bmw_bmw-i4_3',
  'biz_model_bmw_bmw_i4',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g26_bev_new-kidney_fb?qlt=80&wid=1024&fmt=webp',
  'BMW i4 Gran Coupe - Alloy Wheels & Details',
  'بي إم دبليو آي 4 جران كوبيه - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
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
  'gal_bmw_bmw-i4_4',
  'biz_model_bmw_bmw_i4',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g26_bev_instrument-panel-luxury_fb?qlt=80&wid=1024&fmt=webp',
  'BMW i4 Gran Coupe - Cockpit & Curved Display',
  'بي إم دبليو آي 4 جران كوبيه - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
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
  'gal_bmw_bmw-i4_5',
  'biz_model_bmw_bmw_i4',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g26_bev_new-steering-wheel-design-1:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW i4 Gran Coupe - Luxury Interior & Seating',
  'بي إم دبليو آي 4 جران كوبيه - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
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
  'gal_bmw_bmw-i4_6',
  'biz_model_bmw_bmw_i4',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_selective-beam_dsk_fb-1?qlt=80&wid=1024&fmt=webp',
  'BMW i4 Gran Coupe - Engine & Performance Dynamics',
  'بي إم دبليو آي 4 جران كوبيه - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW i5 Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_i5',
  'i5 Sedan',
  'آي 5 سيدان',
  'bmw-i5',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-i5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"i5 Sedan","model_name_ar":"آي 5 سيدان","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}}'
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
  'edge_biz_model_bmw_bmw_i5_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_i5',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-i5_bmw_i5_edrive40_m_sport',
  'eDrive40 M Sport',
  'eDrive40 M Sport',
  'bmw-i5-edrive40-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_i5',
  '/bmw/bmw-i5/bmw-i5-edrive40-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":6250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"eDrive40 M Sport","trim_name_ar":"eDrive40 M Sport"},"sec_auto_specs":{"power_hp":340,"torque_nm":"400","transmission":"غير متوفر","fuel_type":"كهربائي","acceleration_0_100_s":6,"top_speed_kmh":193,"wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_i5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_i5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-i5_1',
  'biz_model_bmw_bmw_i5',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g60_bev_stage_ext-loop_dsk_fb_de?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Official Agency Stage View',
  'بي إم دبليو آي 5 سيدان - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
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
  'gal_bmw_bmw-i5_2',
  'biz_model_bmw_bmw_i5',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g60_bev_ext-design-highlights_1_illuminated-kidney_dsk_fb-2_de?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Exterior Design & Styling',
  'بي إم دبليو آي 5 سيدان - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
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
  'gal_bmw_bmw-i5_3',
  'biz_model_bmw_bmw_i5',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g60_bev_sustainability_dsk_fb_en?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Alloy Wheels & Details',
  'بي إم دبليو آي 5 سيدان - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
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
  'gal_bmw_bmw-i5_4',
  'biz_model_bmw_bmw_i5',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g60-bev-light-carpet-ext-dsk-fb?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Cockpit & Curved Display',
  'بي إم دبليو آي 5 سيدان - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
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
  'gal_bmw_bmw-i5_5',
  'biz_model_bmw_bmw_i5',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g60-bev-panorama-skyroof-ext-dsk-fb?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Luxury Interior & Seating',
  'بي إم دبليو آي 5 سيدان - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
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
  'gal_bmw_bmw-i5_6',
  'biz_model_bmw_bmw_i5',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/bmw-maneuvre-assistant-3-1?qlt=80&wid=1024&fmt=webp',
  'BMW i5 Sedan - Engine & Performance Dynamics',
  'بي إم دبليو آي 5 سيدان - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW i7 Luxury Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_i7',
  'i7 Luxury Sedan',
  'آي 7 سيدان فاخرة',
  'bmw-i7',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-i7',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"i7 Luxury Sedan","model_name_ar":"آي 7 سيدان فاخرة","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html"}}'
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
  'edge_biz_model_bmw_bmw_i7_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_i7',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-i7_bmw_i7_xdrive60',
  'xDrive60',
  'xDrive60',
  'bmw-i7-xdrive60',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_i7',
  '/bmw/bmw-i7/bmw-i7-xdrive60',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":11000000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive60","trim_name_ar":"xDrive60"},"sec_auto_specs":{"power_hp":544,"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"كهربائي","acceleration_0_100_s":4.7,"top_speed_kmh":240,"wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_i7 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_i7';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-i7_1',
  'biz_model_bmw_bmw_i7',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_stage:3to4?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW i7 Luxury Sedan - Official Agency Stage View',
  'بي إم دبليو آي 7 سيدان فاخرة - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
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
  'gal_bmw_bmw-i7_2',
  'biz_model_bmw_bmw_i7',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_exterior_highlight_side-view:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW i7 Luxury Sedan - Exterior Design & Styling',
  'بي إم دبليو آي 7 سيدان فاخرة - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
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
  'gal_bmw_bmw-i7_3',
  'biz_model_bmw_bmw_i7',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_exterior_highlight_side-view:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW i7 Luxury Sedan - Alloy Wheels & Details',
  'بي إم دبليو آي 7 سيدان فاخرة - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
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
  'gal_bmw_bmw-i7_4',
  'biz_model_bmw_bmw_i7',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_interior-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW i7 Luxury Sedan - Cockpit & Curved Display',
  'بي إم دبليو آي 7 سيدان فاخرة - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
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
  'gal_bmw_bmw-i7_5',
  'biz_model_bmw_bmw_i7',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_interior_fond-entertainment:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW i7 Luxury Sedan - Luxury Interior & Seating',
  'بي إم دبليو آي 7 سيدان فاخرة - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
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
  'gal_bmw_bmw-i7_6',
  'biz_model_bmw_bmw_i7',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/g70-bev_digital_my-modes-iconic-sounds:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW i7 Luxury Sedan - Engine & Performance Dynamics',
  'بي إم دبليو آي 7 سيدان فاخرة - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW iX1 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_ix1',
  'iX1',
  'آي إكس 1',
  'bmw-ix1',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-ix1',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"iX1","model_name_ar":"آي إكس 1","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"}}'
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
  'edge_biz_model_bmw_bmw_ix1_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_ix1',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-ix1_bmw_ix1_edrive20_m_sport',
  'eDrive20 M Sport',
  'eDrive20 M Sport',
  'bmw-ix1-edrive20-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_ix1',
  '/bmw/bmw-ix1/bmw-ix1-edrive20-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3800000,"currency":"EGP"},"sec_1_identity":{"trim_name":"eDrive20 M Sport","trim_name_ar":"eDrive20 M Sport"},"sec_auto_specs":{"power_hp":204,"torque_nm":"250","transmission":"محرك كهربائي على المحور الأمامي","fuel_type":"كهربائي","acceleration_0_100_s":8.6,"top_speed_kmh":170,"trunk_capacity_l":490,"kerb_weight_kg":1865,"wheels":"19 بوصة M Double-spoke 871","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_ix1 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_ix1';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-ix1_1',
  'biz_model_bmw_bmw_ix1',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/u11-bev_stage_dsk_fb?qlt=80&wid=1024&fmt=webp',
  'BMW iX1 - Official Agency Stage View',
  'بي إم دبليو آي إكس 1 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
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
  'gal_bmw_bmw-ix1_2',
  'biz_model_bmw_bmw_ix1',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u11-bev_interior_curved-display_fb?qlt=80&wid=1024&fmt=webp',
  'BMW iX1 - Exterior Design & Styling',
  'بي إم دبليو آي إكس 1 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
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
  'gal_bmw_bmw-ix1_3',
  'biz_model_bmw_bmw_ix1',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u11-bev_stage1:2to3?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW iX1 - Alloy Wheels & Details',
  'بي إم دبليو آي إكس 1 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
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
  'gal_bmw_bmw-ix1_4',
  'biz_model_bmw_bmw_ix1',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u11-bev_interior_centre-console:3to2?fmt=webp-alpha&wid=767&fit=constrain%2C1',
  'BMW iX1 - Cockpit & Curved Display',
  'بي إم دبليو آي إكس 1 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
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
  'gal_bmw_bmw-ix1_5',
  'biz_model_bmw_bmw_ix1',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u11-bev_interior_centre-console:3to2?fmt=webp-alpha&wid=1023&fit=constrain%2C1',
  'BMW iX1 - Luxury Interior & Seating',
  'بي إم دبليو آي إكس 1 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
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
  'gal_bmw_bmw-ix1_6',
  'biz_model_bmw_bmw_ix1',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_selective-beam_mob_fb-2?qlt=80&wid=1024&fmt=webp',
  'BMW iX1 - Engine & Performance Dynamics',
  'بي إم دبليو آي إكس 1 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW iX2 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_ix2',
  'iX2',
  'آي إكس 2',
  'bmw-ix2',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-ix2',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"iX2","model_name_ar":"آي إكس 2","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/all-models/x-series/THE-X2-iX2-Brochure.pdf.asset.1714058021077.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/all-models/x-series/THE-X2-iX2-Brochure.pdf.asset.1714058021077.pdf"}}'
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
  'edge_biz_model_bmw_bmw_ix2_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_ix2',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-ix2_bmw_ix2_edrive20_m_sport',
  'eDrive20 M Sport',
  'eDrive20 M Sport',
  'bmw-ix2-edrive20-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_ix2',
  '/bmw/bmw-ix2/bmw-ix2-edrive20-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"eDrive20 M Sport","trim_name_ar":"eDrive20 M Sport"},"sec_auto_specs":{"power_hp":204,"torque_nm":"250","transmission":"محرك كهربائي على المحور الأمامي","fuel_type":"كهربائي","acceleration_0_100_s":8.6,"top_speed_kmh":170,"trunk_capacity_l":525,"kerb_weight_kg":1885,"wheels":"19 بوصة M 871 أو 20 بوصة M 873","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_ix2 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_ix2';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-ix2_1',
  'biz_model_bmw_bmw_ix2',
  'sec_1_identity',
  'https://bmw.scene7.com/is/image/BMW/u10_bev_stage_dsk_sl-2?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Official Agency Stage View',
  'بي إم دبليو آي إكس 2 - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
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
  'gal_bmw_bmw-ix2_2',
  'biz_model_bmw_bmw_ix2',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u10_bev_ext_m-sport-package_fb?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Exterior Design & Styling',
  'بي إم دبليو آي إكس 2 - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
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
  'gal_bmw_bmw-ix2_3',
  'biz_model_bmw_bmw_ix2',
  'sec_auto_exterior',
  'https://bmw.scene7.com/is/image/BMW/u10_bev_ext_light-alloy-wheels_fb?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Alloy Wheels & Details',
  'بي إم دبليو آي إكس 2 - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
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
  'gal_bmw_bmw-ix2_4',
  'biz_model_bmw_bmw_ix2',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u10_bev_interior-design_fb?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Cockpit & Curved Display',
  'بي إم دبليو آي إكس 2 - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
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
  'gal_bmw_bmw-ix2_5',
  'biz_model_bmw_bmw_ix2',
  'sec_auto_interior',
  'https://bmw.scene7.com/is/image/BMW/u10_bev_int_panorama-glass-roof_fb-1?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Luxury Interior & Seating',
  'بي إم دبليو آي إكس 2 - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
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
  'gal_bmw_bmw-ix2_6',
  'biz_model_bmw_bmw_ix2',
  'sec_auto_specs',
  'https://bmw.scene7.com/is/image/BMW/global_tec-ani_selective-beam_dsk_ta-2?qlt=80&wid=1024&fmt=webp',
  'BMW iX2 - Engine & Performance Dynamics',
  'بي إم دبليو آي إكس 2 - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: BMW iX ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_ix',
  'iX',
  'آي إكس',
  'bmw-ix',
  'vehicle_model',
  'automotive',
  'biz_brand_bmw',
  '/bmw/bmw-ix',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"iX","model_name_ar":"آي إكس","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"}}'
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
  'edge_biz_model_bmw_bmw_ix_sold_by_biz_dist_global_auto_egypt',
  'biz_model_bmw_bmw_ix',
  'biz_dist_global_auto_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-ix_bmw_ix_xdrive50',
  'xDrive50',
  'xDrive50',
  'bmw-ix-xdrive50',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_ix',
  '/bmw/bmw-ix/bmw-ix-xdrive50',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":7550000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive50","trim_name_ar":"xDrive50"},"sec_auto_specs":{"torque_nm":"غير متوفر","transmission":"غير متوفر","fuel_type":"غير متوفر","wheels":"غير متوفر","seats":5}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_bmw_bmw_ix to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_bmw_bmw_ix';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_bmw_bmw-ix_1',
  'biz_model_bmw_bmw_ix',
  'sec_1_identity',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy,w_360,h_270/auto-client/6c1b54502dc954151207081443f9bc27/2023_06_21_bmw_mena_ix_banner_english_mobile.jpg',
  'BMW iX - Official Agency Stage View',
  'بي إم دبليو آي إكس - الصورة الرسمية من الوكيل',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
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
  'gal_bmw_bmw-ix_2',
  'biz_model_bmw_bmw_ix',
  'sec_auto_exterior',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy,w_480,h_360/auto-client/6c1b54502dc954151207081443f9bc27/2023_06_21_bmw_mena_ix_banner_english_mobile.jpg',
  'BMW iX - Exterior Design & Styling',
  'بي إم دبليو آي إكس - التصميم الخارجي والديناميكي',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
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
  'gal_bmw_bmw-ix_3',
  'biz_model_bmw_bmw_ix',
  'sec_auto_exterior',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy,w_720,h_540/auto-client/6c1b54502dc954151207081443f9bc27/2023_06_21_bmw_mena_ix_banner_english_mobile.jpg',
  'BMW iX - Alloy Wheels & Details',
  'بي إم دبليو آي إكس - الجنوط الرياضية والتفاصيل الخارجية',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
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
  'gal_bmw_bmw-ix_4',
  'biz_model_bmw_bmw_ix',
  'sec_auto_interior',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy/auto-client/418e0c8556bd4ced6646ce78efcc845f/interior_1_.jpg',
  'BMW iX - Cockpit & Curved Display',
  'بي إم دبليو آي إكس - مقصورة القيادة والشاشة المنحنية',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
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
  'gal_bmw_bmw-ix_5',
  'biz_model_bmw_bmw_ix',
  'sec_auto_interior',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy,w_767,h_575/auto-client/6c1b54502dc954151207081443f9bc27/2023_06_21_bmw_mena_ix_banner_english_mobile.jpg',
  'BMW iX - Luxury Interior & Seating',
  'بي إم دبليو آي إكس - المقاعد الجلدية والفرش الفاخر',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
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
  'gal_bmw_bmw-ix_6',
  'biz_model_bmw_bmw_ix',
  'sec_auto_specs',
  'https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_fill,f_auto,fl_lossy,w_800,h_364/auto-client/1429992d12c297ac33838aff2988a222/2023_06_21_bmw_mena_ix_banner_english_desktop.jpg',
  'BMW iX - Engine & Performance Dynamics',
  'بي إم دبليو آي إكس - الأداء وهندسة المحرك',
  '{"source_url":"https://www.bmw-saudiarabia.com/models/theix/"}',
  NULL,
  NULL,
  0,
  5,
  'body',
  1,
  'approved',
  'image'
);
