-- ========================================================
-- Brand Ingestion: Toyota (تويوتا)
-- Generated: 2026-11-22 15:39:37
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_toyota',
  'Toyota',
  'تويوتا',
  'toyota',
  'vehicle_brand',
  'automotive',
  NULL,
  '/toyota',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":null,"official_website":"https://www.toyota.com.eg","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/toyota.svg"}}'
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
  'biz_agency_toyota_egypt',
  'Toyota Egypt (Exclusive Distributor)',
  'تويوتا إيجيبت (الوكيل الحصري)',
  'toyota-egypt',
  'main_agency',
  'automotive',
  NULL,
  '/toyota-egypt',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Toyota Egypt (Exclusive Distributor)","company_name_ar":"تويوتا إيجيبت (الوكيل الحصري)","phone":"16550","website":"https://www.toyota.com.eg","official_brands":["Toyota"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_branch_toyota_aburawash',
  'Toyota Egypt Abu Rawash (Main Center)',
  'تويوتا إيجيبت أبو رواش (المركز الرئيسي)',
  'toyota-aburawash',
  'showroom',
  'automotive',
  'biz_agency_toyota_egypt',
  '/toyota-aburawash',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Toyota Egypt Abu Rawash (Main Center)","company_name_ar":"تويوتا إيجيبت أبو رواش (المركز الرئيسي)","phone":"16550","address":"طريق مصر إسكندرية الصحراوي، أبو رواش، الجيزة","city":"أبو رواش","governorate":"الجيزة"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_branch_toyota_cairo_festival',
  'Toyota Cairo Festival City (New Cairo)',
  'تويوتا كايرو فيستيفال سيتي (التجمع الخامس)',
  'toyota-cfc',
  'showroom',
  'automotive',
  'biz_agency_toyota_egypt',
  '/toyota-cfc',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Toyota Cairo Festival City (New Cairo)","company_name_ar":"تويوتا كايرو فيستيفال سيتي (التجمع الخامس)","phone":"16550","address":"كايرو فيستيفال سيتي، التجمع الخامس، القاهرة الجديدة","city":"القاهرة الجديدة","governorate":"القاهرة"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: Toyota Toyota Corolla ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_toyota_corolla',
  'Toyota Corolla',
  'تويوتا كورولا',
  'corolla',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/corolla',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Toyota Corolla","model_name_ar":"تويوتا كورولا","official_specs":{},"year":2026,"brochure_url":"https://www.toyota.com.eg/vehicles/corolla"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر Dual VVT-i","power_hp":120,"torque_nm":154,"torque_rpm":"5200 RPM","acceleration_0_100":11,"top_speed_kmh":190,"transmission":"CVT (10-Speed Simulated)","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4630L x 1780W x 1435H | WB: 2700 | Clearance: 135mm","wheels":"15-inch Steel Wheels 195/65 R15","airbags":2},"sec_listing_price":{"official_price_egp":1280000,"currency":"EGP","price_note":"Official Toyota Egypt agency price","price_note_ar":"السعر الرسمي من تويوتا إيجيبت","trim_range":{"min":1280000,"max":1630000,"count":5}},"sec_overview":{"brochure_url":"https://www.toyota.com.eg/vehicles/corolla"}}'
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
  'edge_biz_model_toyota_corolla_sold_by_biz_agency_toyota_egypt',
  'biz_model_toyota_corolla',
  'biz_agency_toyota_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_corolla_active',
  'Active AT',
  'أكتيف أوتوماتيك',
  'corolla-active',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_corolla',
  '/toyota/corolla/corolla-active',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1280000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Active AT","trim_name_ar":"أكتيف أوتوماتيك"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر Dual VVT-i","power_hp":120,"torque_nm":154,"torque_rpm":"5200 RPM","acceleration_0_100":11,"top_speed_kmh":190,"transmission":"CVT (10-Speed Simulated)","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4630L x 1780W x 1435H | WB: 2700 | Clearance: 135mm","wheels":"15-inch Steel Wheels 195/65 R15","airbags":2}}'
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
  'biz_trim_corolla_comfort',
  'Comfort AT',
  'كومفورت أوتوماتيك',
  'corolla-comfort',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_corolla',
  '/toyota/corolla/corolla-comfort',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1380000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Comfort AT","trim_name_ar":"كومفورت أوتوماتيك"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر","power_hp":120,"torque_nm":154,"transmission":"CVT","drive":"FWD","fuel_type":"Petrol","wheels":"16-inch Alloy Wheels 205/55 R16","ac":"Dual-zone Automatic Air Conditioning","airbags":2}}'
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
  'biz_trim_corolla_smart',
  'Smart AT',
  'سمارت أوتوماتيك',
  'corolla-smart',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_corolla',
  '/toyota/corolla/corolla-smart',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1480000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Smart AT","trim_name_ar":"سمارت أوتوماتيك"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر","power_hp":120,"torque_nm":154,"transmission":"CVT","drive":"FWD","fuel_type":"Petrol","airbags":6,"features":"12.3-inch Digital Meter Cluster + Keyless Smart Entry & Push Start"}}'
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
  'biz_trim_corolla_smart_sunroof',
  'Smart with Sunroof',
  'سمارت مع فتحة سقف',
  'corolla-smart-sunroof-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_corolla',
  '/toyota/corolla/corolla-smart-sunroof-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1580000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Smart with Sunroof","trim_name_ar":"سمارت مع فتحة سقف"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر","power_hp":120,"torque_nm":154,"transmission":"CVT","drive":"FWD","fuel_type":"Petrol","features":"Electric Sunroof + 6 Airbags"}}'
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
  'biz_trim_corolla_elegance',
  'Elegance AT',
  'إليجانس أوتوماتيك',
  'corolla-elegance-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_corolla',
  '/toyota/corolla/corolla-elegance-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1630000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Elegance AT","trim_name_ar":"إليجانس أوتوماتيك"},"sec_auto_specs":{"engine":"1.6L 4-Cylinder Dual VVT-i (1598 cc)","engine_ar":"4 سلندر 1.6 لتر","power_hp":120,"torque_nm":154,"transmission":"CVT","drive":"FWD","fuel_type":"Petrol","wheels":"17-inch Alloy Wheels 225/45 R17","features":"Full Leather Upholstery + Bi-LED Headlights + Wireless Smartphone Charger + 6 Airbags"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_toyota_corolla to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_corolla';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_toyota_corolla_1',
  'biz_model_toyota_corolla',
  'sec_1_identity',
  'https://www.toyota.com.eg/media/corolla_ext_front.png',
  'Toyota Corolla — Legendary Reliability',
  'تويوتا كورولا — الاعتمادية الأسطورية',
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
  'gal_toyota_corolla_2',
  'biz_model_toyota_corolla',
  'sec_auto_exterior',
  'https://www.toyota.com.eg/media/corolla_ext_profile.png',
  'Exterior Aerodynamic Design',
  'التصميم الخارجي الانسيابي',
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
  'gal_toyota_corolla_3',
  'biz_model_toyota_corolla',
  'sec_auto_interior',
  'https://www.toyota.com.eg/media/corolla_int_dash.png',
  '12.3-inch Digital Cluster & Infotainment',
  'شاشة عدادات 12.3 بوصة وشاشة ترفيه 8 بوصة',
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

-- ── Model: Toyota Toyota Urban Cruiser ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_toyota_urban_cruiser',
  'Toyota Urban Cruiser',
  'تويوتا أوربان كروزر',
  'urban-cruiser',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/urban-cruiser',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Toyota Urban Cruiser","model_name_ar":"تويوتا أوربان كروزر","official_specs":{},"year":2026,"brochure_url":"https://www.toyota.com.eg/vehicles/urban-cruiser"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder Dual Jet","engine_ar":"4 سلندر 1.5 لتر Dual Jet","power_hp":103,"torque_nm":138,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4365L x 1795W x 1645H | Ground Clearance: 210mm","airbags":2},"sec_listing_price":{"official_price_egp":1430000,"currency":"EGP","price_note":"Official Toyota Egypt agency price","price_note_ar":"السعر الرسمي من تويوتا إيجيبت","trim_range":{"min":1430000,"max":1530000,"count":2}},"sec_overview":{"brochure_url":"https://www.toyota.com.eg/vehicles/urban-cruiser"}}'
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
  'edge_biz_model_toyota_urban_cruiser_sold_by_biz_agency_toyota_egypt',
  'biz_model_toyota_urban_cruiser',
  'biz_agency_toyota_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_urban-cruiser_urban_cruiser_active',
  'Active AT',
  'أكتيف أوتوماتيك',
  'urban-cruiser-active',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_urban_cruiser',
  '/toyota/urban-cruiser/urban-cruiser-active',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1430000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Active AT","trim_name_ar":"أكتيف أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder Dual Jet","engine_ar":"4 سلندر 1.5 لتر Dual Jet","power_hp":103,"torque_nm":138,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","dimensions_mm":"4365L x 1795W x 1645H | Ground Clearance: 210mm","airbags":2}}'
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
  'biz_trim_urban-cruiser_urban_cruiser_comfort',
  'Comfort AT',
  'كومفورت أوتوماتيك',
  'urban-cruiser-comfort',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_urban_cruiser',
  '/toyota/urban-cruiser/urban-cruiser-comfort',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":1530000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Comfort AT","trim_name_ar":"كومفورت أوتوماتيك"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder Dual Jet","engine_ar":"4 سلندر 1.5 لتر","power_hp":103,"torque_nm":138,"transmission":"6-Speed Automatic","drive":"FWD","fuel_type":"Petrol","airbags":6,"features":"Panoramic Sunroof + 360 Camera + Head-Up Display HUD + 17-inch Alloys"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_toyota_urban_cruiser to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_urban_cruiser';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_toyota_urban-cruiser_1',
  'biz_model_toyota_urban_cruiser',
  'sec_1_identity',
  'https://www.toyota.com.eg/media/urban_cruiser_ext.png',
  'Toyota Urban Cruiser — High Ground Clearance SUV',
  'تويوتا أوربان كروزر — كروس أوفر بخلوص أرضي 210 مم',
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

-- ── Model: Toyota Toyota Fortuner ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_toyota_fortuner',
  'Toyota Fortuner',
  'تويوتا فورتشنر (تجميع محلي الهيئة العربية للتصنيع)',
  'fortuner',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/fortuner',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Toyota Fortuner","model_name_ar":"تويوتا فورتشنر (تجميع محلي الهيئة العربية للتصنيع)","official_specs":{},"year":2026,"brochure_url":"https://www.toyota.com.eg/vehicles/fortuner"},"sec_auto_specs":{"engine":"2.7L 4-Cylinder DOHC (2TR-FE)","engine_ar":"4 سلندر 2.7 لتر (2TR-FE)","power_hp":163,"torque_nm":245,"transmission":"6-Speed Automatic","drive":"RWD","fuel_type":"Petrol","seats":7,"dimensions_mm":"4795L x 1855W x 1835H","airbags":3,"assembly":"Local Assembly — Arab American Vehicles (AAV)","assembly_ar":"تجميع محلي — الشركة العربية الأمريكية للسيارات AAV"},"sec_listing_price":{"official_price_egp":3250000,"currency":"EGP","price_note":"Official Toyota Egypt price — Locally assembled (AAV)","price_note_ar":"السعر الرسمي من تويوتا إيجيبت — تجميع محلي","trim_range":{"min":3250000,"max":3700000,"count":3}},"sec_overview":{"brochure_url":"https://www.toyota.com.eg/vehicles/fortuner"}}'
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
  'edge_biz_model_toyota_fortuner_sold_by_biz_agency_toyota_egypt',
  'biz_model_toyota_fortuner',
  'biz_agency_toyota_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_fort_smart_27',
  'Smart 2.7L 2WD',
  'سمارت 2.7 لتر دفع خلفي',
  'fortuner-smart-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_fortuner',
  '/toyota/fortuner/fortuner-smart-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3250000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Smart 2.7L 2WD","trim_name_ar":"سمارت 2.7 لتر دفع خلفي"},"sec_auto_specs":{"engine":"2.7L 4-Cylinder DOHC (2TR-FE)","engine_ar":"4 سلندر 2.7 لتر (2TR-FE)","power_hp":163,"torque_nm":245,"transmission":"6-Speed Automatic","drive":"RWD","fuel_type":"Petrol","seats":7,"dimensions_mm":"4795L x 1855W x 1835H","airbags":3,"assembly":"Local Assembly — Arab American Vehicles (AAV)","assembly_ar":"تجميع محلي — الشركة العربية الأمريكية للسيارات AAV"}}'
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
  'biz_trim_fort_elegance_40',
  'Elegance 4.0L 4WD',
  'إليجانس 4.0 لتر V6 دفع رباعي',
  'fortuner-elegance-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_fortuner',
  '/toyota/fortuner/fortuner-elegance-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3550000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Elegance 4.0L 4WD","trim_name_ar":"إليجانس 4.0 لتر V6 دفع رباعي"},"sec_auto_specs":{"engine":"4.0L V6 DOHC (1GR-FE)","engine_ar":"V6 سعة 4.0 لتر (1GR-FE)","power_hp":234,"torque_nm":376,"transmission":"6-Speed Automatic","drive":"Part-Time 4WD with Diff-Lock","fuel_type":"Petrol","seats":7,"airbags":3,"features":"Electric Tailgate + Power Leather Seats","assembly":"Local Assembly — Arab American Vehicles (AAV)","assembly_ar":"تجميع محلي — الشركة العربية الأمريكية للسيارات AAV"}}'
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
  'biz_trim_fort_sport_40',
  'Sport 4.0L 4WD',
  'سبورت 4.0 لتر V6 دفع رباعي كامل',
  'fortuner-sport-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_fortuner',
  '/toyota/fortuner/fortuner-sport-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":3700000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Sport 4.0L 4WD","trim_name_ar":"سبورت 4.0 لتر V6 دفع رباعي كامل"},"sec_auto_specs":{"engine":"4.0L V6 DOHC (1GR-FE)","engine_ar":"V6 سعة 4.0 لتر (1GR-FE)","power_hp":234,"torque_nm":376,"transmission":"6-Speed Automatic","drive":"4WD with Diff-Lock","fuel_type":"Petrol","seats":7,"airbags":7,"features":"JBL Premium Sound System + R-Sport Aero Kit + 7 Airbags","assembly":"Local Assembly — Arab American Vehicles (AAV)","assembly_ar":"تجميع محلي — الشركة العربية الأمريكية للسيارات AAV"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_toyota_fortuner to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_fortuner';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_toyota_fortuner_1',
  'biz_model_toyota_fortuner',
  'sec_1_identity',
  'https://www.toyota.com.eg/media/fortuner_ext_front.png',
  'Toyota Fortuner — Locally Assembled in Egypt',
  'تويوتا فورتشنر — تجميع محلي بمصانع الهيئة العربية للتصنيع AAV',
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

-- ── Model: Toyota Toyota Land Cruiser Prado (J250) ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_toyota_prado',
  'Toyota Land Cruiser Prado (J250)',
  'تويوتا لاند كروزر برادو (الجيل الجديد J250)',
  'prado',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/prado',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Toyota Land Cruiser Prado (J250)","model_name_ar":"تويوتا لاند كروزر برادو (الجيل الجديد J250)","official_specs":{},"year":2026,"brochure_url":"https://www.toyota.com.eg/vehicles/prado"},"sec_auto_specs":{"engine":"2.4L Turbocharged Petrol (T24A-FTS)","engine_ar":"4 سلندر توربو 2.4 لتر (T24A-FTS)","power_hp":267,"torque_nm":430,"transmission":"Direct Shift 8-Speed Automatic","drive":"Full-Time 4WD with Multi-Terrain Select & Crawl Control","fuel_type":"Petrol","seats":7,"dimensions_mm":"4925L x 1980W x 1935H | WB: 2850mm","airbags":8,"safety":"Toyota Safety Sense (TSS) 3.0 Full Suite","features":"12.3-inch Center Display + Heated & Ventilated Seats + Crawl Control"},"sec_listing_price":{"official_price_egp":9000000,"currency":"EGP","price_note":"Official Toyota Egypt agency price — All-New J250 generation","price_note_ar":"السعر الرسمي من تويوتا إيجيبت — الجيل الجديد J250","trim_range":{"min":9000000,"max":9000000,"count":1}},"sec_overview":{"brochure_url":"https://www.toyota.com.eg/vehicles/prado"}}'
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
  'edge_biz_model_toyota_prado_sold_by_biz_agency_toyota_egypt',
  'biz_model_toyota_prado',
  'biz_agency_toyota_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_prado_highline',
  'Highline 2.4L Turbo',
  'هاي لاين 2.4 لتر تيربو',
  'prado-highline-2026',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_prado',
  '/toyota/prado/prado-highline-2026',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":9000000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Highline 2.4L Turbo","trim_name_ar":"هاي لاين 2.4 لتر تيربو"},"sec_auto_specs":{"engine":"2.4L Turbocharged Petrol (T24A-FTS)","engine_ar":"4 سلندر توربو 2.4 لتر (T24A-FTS)","power_hp":267,"torque_nm":430,"transmission":"Direct Shift 8-Speed Automatic","drive":"Full-Time 4WD with Multi-Terrain Select & Crawl Control","fuel_type":"Petrol","seats":7,"dimensions_mm":"4925L x 1980W x 1935H | WB: 2850mm","airbags":8,"safety":"Toyota Safety Sense (TSS) 3.0 Full Suite","features":"12.3-inch Center Display + Heated & Ventilated Seats + Crawl Control"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_toyota_prado to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_prado';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_toyota_prado_1',
  'biz_model_toyota_prado',
  'sec_1_identity',
  'https://www.toyota.com.eg/media/prado_j250_ext.png',
  'Land Cruiser Prado J250 — All-New Retro Design',
  'لاند كروزر برادو J250 — التصميم الريترو الجديد كلياً',
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

-- ── Model: Toyota Toyota bZ4X Electric ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_toyota_bz4x',
  'Toyota bZ4X Electric',
  'تويوتا bZ4X (كهربائي بالكامل)',
  'bz4x',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/bz4x',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"Toyota bZ4X Electric","model_name_ar":"تويوتا bZ4X (كهربائي بالكامل)","official_specs":{},"year":2026,"brochure_url":"https://www.toyota.com.eg/vehicles/bz4x"},"sec_auto_specs":{"engine":"Electric Motor (e-Axle)","engine_ar":"محرك كهربائي (e-Axle)","power_hp":204,"torque_nm":266,"acceleration_0_100":7.5,"top_speed_kmh":160,"battery_kwh":71.4,"range_km":"Up to 500 km (WLTP)","transmission":"Single-Speed Automatic","drive":"FWD","fuel_type":"Electric (BEV)","features":"Toyota Safety Sense 3.0 + Panoramic Sunroof + 360 Camera"},"sec_listing_price":{"official_price_egp":2380000,"currency":"EGP","price_note":"Official Toyota Egypt agency price — Up to 500km range","price_note_ar":"السعر الرسمي من تويوتا إيجيبت — مدى حتى 500 كم","trim_range":{"min":2380000,"max":2380000,"count":1}},"sec_overview":{"brochure_url":"https://www.toyota.com.eg/vehicles/bz4x"}}'
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
  'edge_biz_model_toyota_bz4x_sold_by_biz_agency_toyota_egypt',
  'biz_model_toyota_bz4x',
  'biz_agency_toyota_egypt',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_bz4x_bz4x_premier_electric',
  'Premier Electric',
  'بريمير إلكتريك',
  'bz4x-premier-electric',
  'vehicle_trim',
  'automotive',
  'biz_model_toyota_bz4x',
  '/toyota/bz4x/bz4x-premier-electric',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":2380000,"currency":"EGP"},"sec_1_identity":{"trim_name":"Premier Electric","trim_name_ar":"بريمير إلكتريك"},"sec_auto_specs":{"engine":"Electric Motor (e-Axle)","engine_ar":"محرك كهربائي (e-Axle)","power_hp":204,"torque_nm":266,"acceleration_0_100":7.5,"top_speed_kmh":160,"battery_kwh":71.4,"range_km":"Up to 500 km (WLTP)","transmission":"Single-Speed Automatic","drive":"FWD","fuel_type":"Electric (BEV)","features":"Toyota Safety Sense 3.0 + Panoramic Sunroof + 360 Camera"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_toyota_bz4x to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_bz4x';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_toyota_bz4x_1',
  'biz_model_toyota_bz4x',
  'sec_1_identity',
  'https://www.toyota.com.eg/media/bz4x_ext.png',
  'Toyota bZ4X — Beyond Zero Electric SUV',
  'تويوتا bZ4X — سيارة الدفع الرباعي الكهربائية بالكامل',
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
