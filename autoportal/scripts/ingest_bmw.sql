-- ========================================================
-- Brand Ingestion: BMW (بي إم دبليو)
-- Generated: 2026-11-22 11:07:44
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
  '{"sec_1_identity":{"brand_origin":null,"official_website":"https://www.bmw-egypt.com","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/bmw.svg"}}'
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
  'biz_dist_global_auto_bmw_egypt',
  'Global Auto — BMW Egypt (Exclusive Importer)',
  'جلوبال أوتو — بي إم دبليو مصر (المستورد الحصري)',
  'global-auto-bmw-egypt',
  'main_agency',
  'automotive',
  NULL,
  '/global-auto-bmw-egypt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Global Auto — BMW Egypt (Exclusive Importer)","company_name_ar":"جلوبال أوتو — بي إم دبليو مصر (المستورد الحصري)","phone":"19269","website":"https://www.bmw-egypt.com","official_brands":["BMW"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: BMW BMW 3 Series (G20) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_3_series',
  'BMW 3 Series (G20)',
  'بي إم دبليو الفئة الثالثة (G20)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW 3 Series (G20)","model_name_ar":"بي إم دبليو الفئة الثالثة (G20)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo (B48)","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"cylinders":"4/4 صمام","power_hp":170,"torque_nm":250,"torque_rpm":"2000-4700","acceleration_0_100":8.1,"top_speed_kmh":228,"transmission":"8-Speed Steptronic Automatic","transmission_ar":"أوتوماتيك ستيبترونيك 8 سرعات","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":6.9,"trunk_liters":480,"fuel_tank_liters":59,"weight_kg":1515,"wheels":"17-inch V-spoke 775 Run-flat","wheels_ar":"جنوط 17 بوصة V-spoke 775 Run-flat","seats":5,"dimensions_mm":"4713L x 1827W x 1440H | WB: 2851"},"sec_listing_price":{"official_price_egp":3500000,"currency":"EGP","price_note":"Official Global Auto agency price (Hatla2ee, Jun 2026)","price_note_ar":"السعر الرسمي من جلوبال أوتو (هتلعي، يونيو 2026)","trim_range":{"min":3500000,"max":6750000,"count":5}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan2025/The%203%20Series%20Brochure%202025%20v2.pdf.asset.1737358373695.pdf"}}'
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
  'edge_biz_model_bmw_bmw_3_series_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_3_series',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-3-series_bmw_320i_advantage',
  '320i Advantage',
  '320i أدفانتاج',
  'bmw-320i-advantage',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-320i-advantage',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i Advantage","trim_name_ar":"320i أدفانتاج"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo (B48)","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"cylinders":"4/4 صمام","power_hp":170,"torque_nm":250,"torque_rpm":"2000-4700","acceleration_0_100":8.1,"top_speed_kmh":228,"transmission":"8-Speed Steptronic Automatic","transmission_ar":"أوتوماتيك ستيبترونيك 8 سرعات","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":6.9,"trunk_liters":480,"fuel_tank_liters":59,"weight_kg":1515,"wheels":"17-inch V-spoke 775 Run-flat","wheels_ar":"جنوط 17 بوصة V-spoke 775 Run-flat","seats":5,"dimensions_mm":"4713L x 1827W x 1440H | WB: 2851"}}'
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
  'biz_trim_bmw-3-series_bmw_320i_luxury_line',
  '320i Luxury Line',
  '320i لاكشري لاين',
  'bmw-320i-luxury-line',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-320i-luxury-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i Luxury Line","trim_name_ar":"320i لاكشري لاين"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"power_hp":170,"torque_nm":250,"acceleration_0_100":8.1,"top_speed_kmh":228,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":6.9,"trunk_liters":480,"seats":5,"wheels":"18-inch Double-spoke 782 Run-flat","wheels_ar":"جنوط 18 بوصة Double-spoke 782 Run-flat"}}'
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
  'biz_trim_bmw-3-series_bmw_320i_m_sport',
  '320i M Sport',
  '320i M سبورت',
  'bmw-320i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-320i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"320i M Sport","trim_name_ar":"320i M سبورت"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"power_hp":170,"torque_nm":250,"acceleration_0_100":8.1,"top_speed_kmh":228,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":6.9,"trunk_liters":480,"seats":5,"wheels":"18-inch M Double-spoke 848","wheels_ar":"جنوط 18 بوصة M Double-spoke 848"}}'
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
  'biz_trim_bmw-3-series_bmw_330i_m_sport',
  '330i M Sport',
  '330i M سبورت',
  'bmw-330i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-330i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"330i M Sport","trim_name_ar":"330i M سبورت"},"sec_auto_specs":{"engine":"2.0L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 2.0 لتر","engine_cc":1998,"power_hp":258,"torque_nm":400,"torque_rpm":"1550-4400","acceleration_0_100":5.9,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":6.5,"trunk_liters":480,"seats":5,"wheels":"18-inch M Double-spoke 848","wheels_ar":"جنوط 18 بوصة M Double-spoke 848"}}'
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
  'biz_trim_bmw-3-series_bmw_m340i_xdrive',
  'M340i xDrive',
  'M340i xDrive دفع رباعي',
  'bmw-m340i-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_3_series',
  '/bmw/bmw-3-series/bmw-m340i-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":6750000,"currency":"EGP"},"sec_1_identity":{"trim_name":"M340i xDrive","trim_name_ar":"M340i xDrive دفع رباعي"},"sec_auto_specs":{"engine":"3.0L 6-Cyl TwinPower Turbo (B58)","engine_ar":"6 سلندر توربو مزدوج 3.0 لتر","engine_cc":2998,"power_hp":387,"torque_nm":500,"torque_rpm":"1900-5000","acceleration_0_100":4.4,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Sport Automatic","drive":"xDrive AWD","fuel_type":"Petrol","fuel_economy_combined":8,"trunk_liters":480,"weight_kg":1695,"seats":5,"wheels":"19-inch M Double-spoke 792","wheels_ar":"جنوط 19 بوصة M Double-spoke 792"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/3-series/3-series-sedan/PI_32754726_G20_BMW_3series_01.jpg',
  'BMW 3 Series — The Ultimate Sports Sedan',
  'بي إم دبليو الفئة الثالثة — سيدان الأداء الأمثل',
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
  'gal_bmw_bmw-3-series_2',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_exterior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/3-series/3-series-sedan/PI_32754726_G20_BMW_3series_02.jpg',
  'Iconic Kidney Grille Design',
  'الشبكة الأمامية الكلوية الأيقونية',
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
  'gal_bmw_bmw-3-series_3',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_interior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/3-series/3-series-sedan/PI_32754726_G20_BMW_3series_03.jpg',
  'Curved Display & BMW iDrive 8',
  'الشاشة المنحنية ونظام BMW iDrive 8',
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
  'gal_bmw_bmw-3-series_4',
  'biz_model_bmw_bmw_3_series',
  'sec_auto_engine',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/3-series/3-series-sedan/PI_32754726_G20_BMW_3series_04.jpg',
  'TwinPower Turbo Engine',
  'محرك TwinPower Turbo',
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

-- ── Model: BMW BMW 5 Series (G60) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_5_series',
  'BMW 5 Series (G60)',
  'بي إم دبليو الفئة الخامسة (G60)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW 5 Series (G60)","model_name_ar":"بي إم دبليو الفئة الخامسة (G60)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-5.pdf.asset.1681294407006.pdf"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"power_hp":170,"torque_nm":250,"acceleration_0_100":8.3,"top_speed_kmh":226,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.1,"trunk_liters":530,"fuel_tank_liters":68,"weight_kg":1580,"seats":5,"wheels":"18-inch Double-spoke 844 Run-flat","wheels_ar":"جنوط 18 بوصة Double-spoke 844 Run-flat"},"sec_listing_price":{"official_price_egp":4500000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026 from 4,250,000)","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026 من 4,250,000)","trim_range":{"min":4500000,"max":4900000,"count":2}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The-5.pdf.asset.1681294407006.pdf"}}'
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
  'edge_biz_model_bmw_bmw_5_series_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_5_series',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-5-series_bmw_520i_luxury',
  '520i Luxury Line',
  '520i لاكشري لاين',
  'bmw-520i-luxury',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-520i-luxury',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"520i Luxury Line","trim_name_ar":"520i لاكشري لاين"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"power_hp":170,"torque_nm":250,"acceleration_0_100":8.3,"top_speed_kmh":226,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.1,"trunk_liters":530,"fuel_tank_liters":68,"weight_kg":1580,"seats":5,"wheels":"18-inch Double-spoke 844 Run-flat","wheels_ar":"جنوط 18 بوصة Double-spoke 844 Run-flat"}}'
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
  'biz_trim_bmw-5-series_bmw_520i_m_sport',
  '520i M Sport',
  '520i M سبورت',
  'bmw-520i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_5_series',
  '/bmw/bmw-5-series/bmw-520i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4900000,"currency":"EGP"},"sec_1_identity":{"trim_name":"520i M Sport","trim_name_ar":"520i M سبورت"},"sec_auto_specs":{"engine":"1.6L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 1.6 لتر","engine_cc":1597,"power_hp":170,"torque_nm":250,"acceleration_0_100":8.3,"top_speed_kmh":226,"transmission":"8-Speed Steptronic Automatic","drive":"RWD","fuel_type":"Petrol","fuel_economy_combined":7.1,"trunk_liters":530,"seats":5,"wheels":"18-inch W-spoke 632 Run-flat","wheels_ar":"جنوط 18 بوصة W-spoke 632 Run-flat"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/5-series/5-series-sedan/bmw-5-series-01.jpg',
  'BMW 5 Series — Executive Luxury',
  'بي إم دبليو الفئة الخامسة — الفخامة التنفيذية',
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
  'gal_bmw_bmw-5-series_2',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_exterior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/5-series/5-series-sedan/bmw-5-series-02.jpg',
  'Elegant Executive Exterior',
  'الهيكل الخارجي التنفيذي الأنيق',
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
  'gal_bmw_bmw-5-series_3',
  'biz_model_bmw_bmw_5_series',
  'sec_auto_interior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/5-series/5-series-sedan/bmw-5-series-03.jpg',
  'Panoramic Curved Display',
  'الشاشة البانورامية المنحنية',
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

-- ── Model: BMW BMW X1 (U11) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x1',
  'BMW X1 (U11)',
  'بي إم دبليو X1 (U11)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW X1 (U11)","model_name_ar":"بي إم دبليو X1 (U11)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"},"sec_auto_specs":{"engine":"1.5L 3-Cyl TwinPower Turbo","engine_ar":"3 سلندر توربو مزدوج 1.5 لتر","engine_cc":1499,"power_hp":156,"torque_nm":230,"torque_rpm":"1500-4600","acceleration_0_100":9,"top_speed_kmh":215,"transmission":"7-Speed Steptronic DCT","drive":"sDrive (FWD)","fuel_type":"Petrol","fuel_economy_combined":6.5,"trunk_liters":540,"seats":5,"wheels":"19-inch V-spoke 867","wheels_ar":"جنوط 19 بوصة V-spoke 867"},"sec_listing_price":{"official_price_egp":3200000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026 from 2,950,000)","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026 من 2,950,000)","trim_range":{"min":3200000,"max":3500000,"count":2}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x1_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_x1',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x1_bmw_x1_xline',
  'X1 xLine',
  'X1 xLine',
  'bmw-x1-xline',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x1',
  '/bmw/bmw-x1/bmw-x1-xline',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3200000,"currency":"EGP"},"sec_1_identity":{"trim_name":"X1 xLine","trim_name_ar":"X1 xLine"},"sec_auto_specs":{"engine":"1.5L 3-Cyl TwinPower Turbo","engine_ar":"3 سلندر توربو مزدوج 1.5 لتر","engine_cc":1499,"power_hp":156,"torque_nm":230,"torque_rpm":"1500-4600","acceleration_0_100":9,"top_speed_kmh":215,"transmission":"7-Speed Steptronic DCT","drive":"sDrive (FWD)","fuel_type":"Petrol","fuel_economy_combined":6.5,"trunk_liters":540,"seats":5,"wheels":"19-inch V-spoke 867","wheels_ar":"جنوط 19 بوصة V-spoke 867"}}'
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
  'biz_trim_bmw-x1_bmw_x1_m_sport',
  'X1 M Sport',
  'X1 M سبورت',
  'bmw-x1-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x1',
  '/bmw/bmw-x1/bmw-x1-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3500000,"currency":"EGP"},"sec_1_identity":{"trim_name":"X1 M Sport","trim_name_ar":"X1 M سبورت"},"sec_auto_specs":{"engine":"1.5L 3-Cyl TwinPower Turbo","engine_ar":"3 سلندر توربو مزدوج 1.5 لتر","engine_cc":1499,"power_hp":156,"torque_nm":230,"acceleration_0_100":9,"top_speed_kmh":215,"transmission":"7-Speed Steptronic DCT","drive":"sDrive (FWD)","fuel_type":"Petrol","fuel_economy_combined":6.5,"trunk_liters":540,"seats":5,"wheels":"19-inch M Double-spoke 871","wheels_ar":"جنوط 19 بوصة M Double-spoke 871"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x1/bmw-x1-01.jpg',
  'BMW X1 — The Urban SAV',
  'بي إم دبليو X1 — سيارة الدفع الرباعي الحضرية',
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
  'gal_bmw_bmw-x1_2',
  'biz_model_bmw_bmw_x1',
  'sec_auto_exterior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x1/bmw-x1-02.jpg',
  'Bold Kidney Grille SUV Stance',
  'الهيكل SUV بالشبكة الكلوية الجريئة',
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
  'gal_bmw_bmw-x1_3',
  'biz_model_bmw_bmw_x1',
  'sec_auto_interior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x1/bmw-x1-03.jpg',
  'Spacious Panoramic Interior',
  'المقصورة الداخلية البانورامية الواسعة',
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

-- ── Model: BMW BMW X3 (G01/G45) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x3',
  'BMW X3 (G01/G45)',
  'بي إم دبليو X3 (G01/G45)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW X3 (G01/G45)","model_name_ar":"بي إم دبليو X3 (G01/G45)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august-2026/The_ALL_New_X3_Brochure.pdf.asset.1786973207120.pdf"},"sec_auto_specs":{"engine":"2.0L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 2.0 لتر","engine_cc":1998,"power_hp":252,"torque_nm":350,"acceleration_0_100":6.6,"top_speed_kmh":240,"transmission":"8-Speed Steptronic Automatic","drive":"xDrive AWD","fuel_type":"Petrol","fuel_economy_combined":7.9,"ground_clearance_mm":204,"trunk_liters":"550-1600","fuel_tank_liters":65,"weight_kg":1810,"wheels":"19-inch Y-spoke","wheels_ar":"جنوط 19 بوصة Y-spoke"},"sec_listing_price":{"official_price_egp":4350000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026 from 4,100,000)","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026 من 4,100,000)","trim_range":{"min":4350000,"max":5300000,"count":2}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august-2026/The_ALL_New_X3_Brochure.pdf.asset.1786973207120.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x3_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_x3',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x3_bmw_x3_xdrive30i_xline',
  'xDrive30i xLine',
  'xDrive30i xLine',
  'bmw-x3-xdrive30i-xline',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x3',
  '/bmw/bmw-x3/bmw-x3-xdrive30i-xline',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":4350000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive30i xLine","trim_name_ar":"xDrive30i xLine"},"sec_auto_specs":{"engine":"2.0L 4-Cyl TwinPower Turbo","engine_ar":"4 سلندر توربو مزدوج 2.0 لتر","engine_cc":1998,"power_hp":252,"torque_nm":350,"acceleration_0_100":6.6,"top_speed_kmh":240,"transmission":"8-Speed Steptronic Automatic","drive":"xDrive AWD","fuel_type":"Petrol","fuel_economy_combined":7.9,"ground_clearance_mm":204,"trunk_liters":"550-1600","fuel_tank_liters":65,"weight_kg":1810,"wheels":"19-inch Y-spoke","wheels_ar":"جنوط 19 بوصة Y-spoke"}}'
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
  'biz_trim_bmw-x3_bmw_x3_30_xdrive_m_sport',
  '30 xDrive M Sport (New Gen 2027)',
  '30 xDrive M سبورت (الجيل الجديد 2027)',
  'bmw-x3-30-xdrive-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x3',
  '/bmw/bmw-x3/bmw-x3-30-xdrive-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":5300000,"currency":"EGP"},"sec_1_identity":{"trim_name":"30 xDrive M Sport (New Gen 2027)","trim_name_ar":"30 xDrive M سبورت (الجيل الجديد 2027)"},"sec_auto_specs":{"engine":"New Gen Engine — Full specs pending brochure","engine_ar":"محرك الجيل الجديد — المواصفات الكاملة في انتظار البروشور","drive":"xDrive AWD","trunk_liters":"570-1700","display":"14.9-inch Curved Panoramic + 12.3-inch instruments","display_ar":"شاشة منحنية بانورامية 14.9 بوصة + عدادات 12.3 بوصة"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x3/bmw-x3-01.jpg',
  'BMW X3 — The All-New Generation',
  'بي إم دبليو X3 — الجيل الجديد الكلي',
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
  'gal_bmw_bmw-x3_2',
  'biz_model_bmw_bmw_x3',
  'sec_auto_exterior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x3/bmw-x3-02.jpg',
  'Curved Panoramic Display & BMW iDrive',
  'شاشة 14.9 بوصة منحنية ونظام BMW iDrive',
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

-- ── Model: BMW BMW X5 (G05) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x5',
  'BMW X5 (G05)',
  'بي إم دبليو X5 (G05)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW X5 (G05)","model_name_ar":"بي إم دبليو X5 (G05)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/oct2024/The%20X5%20-%20MY2024.pdf.asset.1729094407795.pdf"},"sec_auto_specs":{"engine":"3.0L 6-Cyl TwinPower Turbo (B58)","engine_ar":"6 سلندر توربو مزدوج 3.0 لتر","engine_cc":2998,"power_hp":381,"torque_nm":540,"acceleration_0_100":5.4,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Automatic","drive":"xDrive AWD","fuel_type":"Petrol","fuel_economy_combined":9.2,"trunk_liters":"650-1870","dimensions_mm":"4935L x 2004W x 1765H","assembly":"Local — Global Auto Plant, 6 October City","assembly_ar":"تجميع محلي — مصنع جلوبال أوتو، السادس من أكتوبر"},"sec_listing_price":{"official_price_egp":7300000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026 from 7,100,000) — Locally assembled","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026 من 7,100,000) — تجميع محلي","trim_range":{"min":7300000,"max":9250000,"count":2}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/oct2024/The%20X5%20-%20MY2024.pdf.asset.1729094407795.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x5_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_x5',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-x5_bmw_x5_xdrive40i_xline',
  'xDrive40i xLine',
  'xDrive40i xLine',
  'bmw-x5-xdrive40i-xline',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x5',
  '/bmw/bmw-x5/bmw-x5-xdrive40i-xline',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":7300000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive40i xLine","trim_name_ar":"xDrive40i xLine"},"sec_auto_specs":{"engine":"3.0L 6-Cyl TwinPower Turbo (B58)","engine_ar":"6 سلندر توربو مزدوج 3.0 لتر","engine_cc":2998,"power_hp":381,"torque_nm":540,"acceleration_0_100":5.4,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Automatic","drive":"xDrive AWD","fuel_type":"Petrol","fuel_economy_combined":9.2,"trunk_liters":"650-1870","dimensions_mm":"4935L x 2004W x 1765H","assembly":"Local — Global Auto Plant, 6 October City","assembly_ar":"تجميع محلي — مصنع جلوبال أوتو، السادس من أكتوبر"}}'
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
  'biz_trim_bmw-x5_bmw_x5_m60i',
  'X5 M60i xDrive',
  'X5 M60i xDrive',
  'bmw-x5-m60i',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x5',
  '/bmw/bmw-x5/bmw-x5-m60i',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"X5 M60i xDrive","trim_name_ar":"X5 M60i xDrive"},"sec_auto_specs":{"engine":"4.4L V8 TwinPower Turbo + 48V Mild Hybrid","engine_ar":"V8 توربو مزدوج 4.4 لتر + هجين خفيف 48 فولت","engine_cc":4395,"power_hp":530,"torque_nm":750,"torque_rpm":"1800-4600","acceleration_0_100":4.3,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Sport Automatic","drive":"xDrive AWD","fuel_type":"Petrol Mild Hybrid","fuel_economy_combined":11.5,"trunk_liters":"650-1870","dimensions_mm":"4935L x 2004W x 1765H"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x5/bmw-x5-01.jpg',
  'BMW X5 — Locally Assembled in Egypt',
  'بي إم دبليو X5 — مجمّعة محليًا في مصر',
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
  'gal_bmw_bmw-x5_2',
  'biz_model_bmw_bmw_x5',
  'sec_auto_exterior',
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x5/bmw-x5-02.jpg',
  'Commanding SUV Presence',
  'الحضور الفارض لسيارة SUV',
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

-- ── Model: BMW BMW X6 (G06) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_x6',
  'BMW X6 (G06)',
  'بي إم دبليو X6 (G06)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW X6 (G06)","model_name_ar":"بي إم دبليو X6 (G06)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The_new_X6_Brochure.pdf.asset.1701147693683.pdf"},"sec_auto_specs":{"engine":"3.0L 6-Cyl TwinPower Turbo","engine_ar":"6 سلندر توربو مزدوج 3.0 لتر","drive":"xDrive AWD","fuel_type":"Petrol"},"sec_listing_price":{"official_price_egp":7950000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026)","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026)","trim_range":{"min":7950000,"max":9250000,"count":2}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/The_new_X6_Brochure.pdf.asset.1701147693683.pdf"}}'
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
  'edge_biz_model_bmw_bmw_x6_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_x6',
  'biz_dist_global_auto_bmw_egypt',
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
  '{"sec_listing_price":{"official_price_egp":7950000,"currency":"EGP"},"sec_1_identity":{"trim_name":"xDrive40i","trim_name_ar":"xDrive40i"},"sec_auto_specs":{"engine":"3.0L 6-Cyl TwinPower Turbo","engine_ar":"6 سلندر توربو مزدوج 3.0 لتر","drive":"xDrive AWD","fuel_type":"Petrol"}}'
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
  'biz_trim_bmw-x6_bmw_x6_m60i',
  'X6 M60i xDrive',
  'X6 M60i xDrive',
  'bmw-x6-m60i',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_x6',
  '/bmw/bmw-x6/bmw-x6-m60i',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"X6 M60i xDrive","trim_name_ar":"X6 M60i xDrive"},"sec_auto_specs":{"engine":"4.4L V8 TwinPower Turbo + 48V Mild Hybrid","engine_ar":"V8 توربو مزدوج 4.4 لتر + هجين خفيف 48 فولت","engine_cc":4395,"power_hp":530,"torque_nm":750,"torque_rpm":"1800-4600","acceleration_0_100":4.3,"top_speed_kmh":250,"transmission":"8-Speed Steptronic Sport Automatic","drive":"xDrive AWD","fuel_type":"Petrol Mild Hybrid 48V","fuel_economy_combined":11.5,"trunk_liters":"580-1530","ground_clearance_mm":216,"weight_kg":2315,"wheels":"21-inch M Y-spoke 741","wheels_ar":"جنوط 21 بوصة M Y-spoke 741"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/x6/bmw-x6-01.jpg',
  'BMW X6 — The Sports Activity Coupe',
  'بي إم دبليو X6 — سيارة الكوبيه الرياضية',
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

-- ── Model: BMW BMW 7 Series (G70) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_7_series',
  'BMW 7 Series (G70)',
  'بي إم دبليو الفئة السابعة (G70)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW 7 Series (G70)","model_name_ar":"بي إم دبليو الفئة السابعة (G70)","official_specs":{},"year":2026,"brochure_url":"https://eg.hatla2ee.com/en/new-car/bmw/7-series/48223"},"sec_auto_specs":{"engine":"3.0L 6-Cyl Mild Hybrid (MHEV)","engine_ar":"6 سلندر هجين خفيف 3.0 لتر","drive":"xDrive AWD","fuel_type":"Petrol Mild Hybrid"},"sec_listing_price":{"official_price_egp":9900000,"currency":"EGP","price_note":"Market price (Yallamotor)","price_note_ar":"سعر منصة (يلا موتور)","trim_range":{"min":9900000,"max":13400000,"count":2}},"sec_overview":{"brochure_url":"https://eg.hatla2ee.com/en/new-car/bmw/7-series/48223"}}'
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
  'edge_biz_model_bmw_bmw_7_series_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_7_series',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-7-series_bmw_740li_xdrive',
  '740Li xDrive',
  '740Li xDrive',
  'bmw-740li-xdrive',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_7_series',
  '/bmw/bmw-7-series/bmw-740li-xdrive',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9900000,"currency":"EGP"},"sec_1_identity":{"trim_name":"740Li xDrive","trim_name_ar":"740Li xDrive"},"sec_auto_specs":{"engine":"3.0L 6-Cyl Mild Hybrid (MHEV)","engine_ar":"6 سلندر هجين خفيف 3.0 لتر","drive":"xDrive AWD","fuel_type":"Petrol Mild Hybrid"}}'
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
  'biz_trim_bmw-7-series_bmw_760li_mhev',
  '760Li xDrive MHEV',
  '760Li xDrive هجين خفيف',
  'bmw-760li-mhev',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_7_series',
  '/bmw/bmw-7-series/bmw-760li-mhev',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":13400000,"currency":"EGP"},"sec_1_identity":{"trim_name":"760Li xDrive MHEV","trim_name_ar":"760Li xDrive هجين خفيف"},"sec_auto_specs":{"engine":"4.4L V8 Mild Hybrid (MHEV) 48V","engine_ar":"V8 هجين خفيف 4.4 لتر 48 فولت","engine_cc":4400,"cylinders":"8","power_hp":544,"torque_nm":750,"acceleration_0_100":4.2,"top_speed_kmh":250,"transmission":"8-Speed Automatic","drive":"xDrive AWD","fuel_type":"Petrol Mild Hybrid 48V","dimensions_mm":"5391L x 1950W x 1544H | WB: 3215"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/7-series/bmw-7-series-01.jpg',
  'BMW 7 Series — Pinnacle of Luxury',
  'بي إم دبليو الفئة السابعة — قمة الفخامة',
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

-- ── Model: BMW BMW i4 (G26 BEV) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_i4',
  'BMW i4 (G26 BEV)',
  'بي إم دبليو i4 (كهربائي)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW i4 (G26 BEV)","model_name_ar":"بي إم دبليو i4 (كهربائي)","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"},"sec_auto_specs":{"engine":"Electric Motor (Rear Axle)","engine_ar":"محرك كهربائي (المحور الخلفي)","power_hp":340,"torque_nm":430,"acceleration_0_100":5.6,"top_speed_kmh":190,"transmission":"Single-Speed Automatic","drive":"RWD","fuel_type":"Electric","battery_kwh":83.9,"range_km":"491-600 km (WLTP)","charging_ac":"11kW AC: 8h 30min","charging_dc":"50kW DC: 1h 13min","trunk_liters":"470-1290","weight_kg":2050,"seats":5,"wheels":"18-inch M 858","wheels_ar":"جنوط 18 بوصة M 858"},"sec_listing_price":{"official_price_egp":5100000,"currency":"EGP","price_note":"Official Global Auto agency price (ContactCars)","price_note_ar":"السعر الرسمي من جلوبال أوتو (ContactCars)","trim_range":{"min":5100000,"max":5100000,"count":1}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/august2024/The_New_4_Series_Brochure_August2024.pdf.asset.1723800538554.pdf"}}'
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
  'edge_biz_model_bmw_bmw_i4_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_i4',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-i4_bmw_i4_edrive40_m_sport',
  'i4 eDrive40 M Sport',
  'i4 eDrive40 M سبورت',
  'bmw-i4-edrive40-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_i4',
  '/bmw/bmw-i4/bmw-i4-edrive40-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":5100000,"currency":"EGP"},"sec_1_identity":{"trim_name":"i4 eDrive40 M Sport","trim_name_ar":"i4 eDrive40 M سبورت"},"sec_auto_specs":{"engine":"Electric Motor (Rear Axle)","engine_ar":"محرك كهربائي (المحور الخلفي)","power_hp":340,"torque_nm":430,"acceleration_0_100":5.6,"top_speed_kmh":190,"transmission":"Single-Speed Automatic","drive":"RWD","fuel_type":"Electric","battery_kwh":83.9,"range_km":"491-600 km (WLTP)","charging_ac":"11kW AC: 8h 30min","charging_dc":"50kW DC: 1h 13min","trunk_liters":"470-1290","weight_kg":2050,"seats":5,"wheels":"18-inch M 858","wheels_ar":"جنوط 18 بوصة M 858"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/i4/bmw-i4-01.jpg',
  'BMW i4 — Electric Gran Coupe',
  'بي إم دبليو i4 — جران كوبيه كهربائي',
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

-- ── Model: BMW BMW iX1 (U11 BEV) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_ix1',
  'BMW iX1 (U11 BEV)',
  'بي إم دبليو iX1 (كهربائي)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW iX1 (U11 BEV)","model_name_ar":"بي إم دبليو iX1 (كهربائي)","official_specs":{},"year":2026,"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"},"sec_auto_specs":{"engine":"Electric Motor (Front Axle)","engine_ar":"محرك كهربائي (المحور الأمامي)","power_hp":204,"torque_nm":250,"acceleration_0_100":8.6,"top_speed_kmh":170,"transmission":"Single-Speed Automatic","drive":"FWD (eDrive)","fuel_type":"Electric","battery_kwh":66.5,"range_km":"430-474 km (WLTP)","charging_ac_11kw":"6h 30min","charging_dc_50kw":"1h 14min (10-80%)","trunk_liters":"490-1495","weight_kg":1865,"wheels":"19-inch M Double-spoke 871","wheels_ar":"جنوط 19 بوصة M Double-spoke 871"},"sec_listing_price":{"official_price_egp":3800000,"currency":"EGP","price_note":"Official Global Auto agency price (ContactCars)","price_note_ar":"السعر الرسمي من جلوبال أوتو (ContactCars)","trim_range":{"min":3800000,"max":3800000,"count":1}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/brochure-pool/jan-2026/X1%20Brochure%20Brochure%202025.pdf"}}'
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
  'edge_biz_model_bmw_bmw_ix1_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_ix1',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-ix1_bmw_ix1_edrive20_m_sport',
  'iX1 eDrive20 M Sport',
  'iX1 eDrive20 M سبورت',
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
  '{"sec_listing_price":{"official_price_egp":3800000,"currency":"EGP"},"sec_1_identity":{"trim_name":"iX1 eDrive20 M Sport","trim_name_ar":"iX1 eDrive20 M سبورت"},"sec_auto_specs":{"engine":"Electric Motor (Front Axle)","engine_ar":"محرك كهربائي (المحور الأمامي)","power_hp":204,"torque_nm":250,"acceleration_0_100":8.6,"top_speed_kmh":170,"transmission":"Single-Speed Automatic","drive":"FWD (eDrive)","fuel_type":"Electric","battery_kwh":66.5,"range_km":"430-474 km (WLTP)","charging_ac_11kw":"6h 30min","charging_dc_50kw":"1h 14min (10-80%)","trunk_liters":"490-1495","weight_kg":1865,"wheels":"19-inch M Double-spoke 871","wheels_ar":"جنوط 19 بوصة M Double-spoke 871"}}'
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
  'https://www.bmw-egypt.com/content/dam/bmw/marketEG/bmw-eg_com/models/ix1/bmw-ix1-01.jpg',
  'BMW iX1 — Electric SAV',
  'بي إم دبليو iX1 — سيارة الدفع الرباعي الكهربائية',
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

-- ── Model: BMW BMW 1 Series (F70) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_bmw_bmw_1_series',
  'BMW 1 Series (F70)',
  'بي إم دبليو الفئة الأولى (F70)',
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
  '{"sec_1_identity":{"category":"Sedan","model_name":"BMW 1 Series (F70)","model_name_ar":"بي إم دبليو الفئة الأولى (F70)","official_specs":{},"year":2027,"brochure_url":"https://www.bmw-egypt.com"},"sec_auto_specs":{"engine":"Specs pending official brochure","engine_ar":"في انتظار البروشور الرسمي","fuel_type":"Petrol"},"sec_listing_price":{"official_price_egp":2550000,"currency":"EGP","price_note":"Official Global Auto agency price (changed Jun 2026 from 2,450,000)","price_note_ar":"السعر الرسمي من جلوبال أوتو (تغيّر يونيو 2026 من 2,450,000)","trim_range":{"min":2550000,"max":2550000,"count":1}},"sec_overview":{"brochure_url":"https://www.bmw-egypt.com"}}'
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
  'edge_biz_model_bmw_bmw_1_series_sold_by_biz_dist_global_auto_bmw_egypt',
  'biz_model_bmw_bmw_1_series',
  'biz_dist_global_auto_bmw_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bmw-1-series_bmw_118i_m_sport',
  '118 M Sport',
  '118 M سبورت',
  'bmw-118i-m-sport',
  'vehicle_trim',
  'automotive',
  'biz_model_bmw_bmw_1_series',
  '/bmw/bmw-1-series/bmw-118i-m-sport',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":2550000,"currency":"EGP"},"sec_1_identity":{"trim_name":"118 M Sport","trim_name_ar":"118 M سبورت"},"sec_auto_specs":{"engine":"Specs pending official brochure","engine_ar":"في انتظار البروشور الرسمي","fuel_type":"Petrol"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);
