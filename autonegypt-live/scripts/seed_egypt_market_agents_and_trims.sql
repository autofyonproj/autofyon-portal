
INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_agency_toyota_egypt', 'automotive', 'main_agency', NULL, 'toyota-egypt', 'toyota-egypt',
  'Toyota Egypt', 'تويوتا إيجيبت', 'active', 1, '{"sec_1_identity":{"business_name":"Toyota Egypt","business_name_ar":"تويوتا إيجيبت","tagline":"Toyota Egypt","tagline_ar":"الوكيل الرسمي الحصري لسيارات تويوتا في جمهورية مصر العربية","phone":"16550","address":"القطامية، الطريق الدائري، القاهرة","city":"القاهرة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_agency_gb_auto', 'automotive', 'main_agency', NULL, 'gb-auto', 'gb-auto',
  'GB Auto (Ghabbour)', 'غبور أوتو', 'active', 1, '{"sec_1_identity":{"business_name":"GB Auto (Ghabbour)","business_name_ar":"غبور أوتو","tagline":"GB Auto (Ghabbour)","tagline_ar":"الوكيل الرسمي لسيارات هيونداي وشيري وشانجان ومازدا في مصر","phone":"16661","address":"طريق القاهرة الإسكندرية الزراعي، قليوب","city":"القاهرة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_agency_al_mansour', 'automotive', 'main_agency', NULL, 'al-mansour', 'al-mansour',
  'Al-Mansour Automotive', 'المنصور للسيارات', 'active', 1, '{"sec_1_identity":{"business_name":"Al-Mansour Automotive","business_name_ar":"المنصور للسيارات","tagline":"Al-Mansour Automotive","tagline_ar":"الوكيل الحصري لسيارات إم جي وشيفروليه وأوبل وبيجو في مصر","phone":"16424","address":"الكيلو 28 طريق مصر الإسكندرية الصحراوي، أبورواش، الجيزة","city":"الجيزة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_agency_nissan_egypt', 'automotive', 'main_agency', NULL, 'nissan-egypt', 'nissan-egypt',
  'Nissan Motor Egypt', 'نيسان مصر', 'active', 1, '{"sec_1_identity":{"business_name":"Nissan Motor Egypt","business_name_ar":"نيسان مصر","tagline":"Nissan Motor Egypt","tagline_ar":"شركة نيسان موتور إيجيبت والمصنع الرسمي في مصر","phone":"16855","address":"المنطقة الصناعية الأولى، مدينة السادس من أكتوبر","city":"الجيزة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_dist_alsabaa', 'automotive', 'distributor', NULL, 'al-sabaa', 'al-sabaa',
  'Al-Sabaa Automotive', 'السبع أوتوموتيف', 'active', 1, '{"sec_1_identity":{"business_name":"Al-Sabaa Automotive","business_name_ar":"السبع أوتوموتيف","phone":"19077","address":"طريق النصر، مصر الجديدة، القاهرة","city":"القاهرة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_dist_elqersh', 'automotive', 'distributor', NULL, 'el-qersh', 'el-qersh',
  'El-Qersh Cars', 'القرش للسيارات', 'active', 1, '{"sec_1_identity":{"business_name":"El-Qersh Cars","business_name_ar":"القرش للسيارات","phone":"19702","address":"شارع الطيران، مدينة نصر، القاهرة","city":"القاهرة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_service_toyota_abbassia', 'automotive', 'service_center', NULL, 'toyota-service-abbassia', 'toyota-service-abbassia',
  'Toyota Egypt Service Center - Abbassia', 'مركز صيانة تويوتا العباسية المعتمد', 'active', 1, '{"sec_1_identity":{"business_name":"Toyota Egypt Service Center - Abbassia","business_name_ar":"مركز صيانة تويوتا العباسية المعتمد","phone":"16550","address":"شارع السرايات، العباسية، القاهرة","city":"القاهرة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_service_gb_ghabbour_abu_rawash', 'automotive', 'service_center', NULL, 'gb-service-abu-rawash', 'gb-service-abu-rawash',
  'GB Auto Service Center - Abu Rawash', 'مركز صيانة غبور أبو رواش', 'active', 1, '{"sec_1_identity":{"business_name":"GB Auto Service Center - Abu Rawash","business_name_ar":"مركز صيانة غبور أبو رواش","phone":"16661","address":"المنطقة الصناعية، أبو رواش، الجيزة","city":"الجيزة"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_corolla_active', 'automotive', 'vehicle_trim', 'biz_model_toyota_corolla', 'corolla-active', 'corolla-active',
  'Active', 'أكتيف (مانيوال/أوتوماتيك)', 'active', 1, '{"sec_1_identity":{"business_name":"Active","business_name_ar":"أكتيف (مانيوال/أوتوماتيك)","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L Dual VVT-i","hp":120,"torque":154,"trans":"CVT / Manual","fuel":"بنزين 92+"},"sec_auto_exterior":{"wheels":"15-inch Steel","lights":"Halogen","roof":"Normal"},"sec_listing_price":{"official_price_egp":1300000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_corolla_comfort', 'automotive', 'vehicle_trim', 'biz_model_toyota_corolla', 'corolla-comfort', 'corolla-comfort',
  'Comfort', 'كومفورت (أوتوماتيك)', 'active', 1, '{"sec_1_identity":{"business_name":"Comfort","business_name_ar":"كومفورت (أوتوماتيك)","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L Dual VVT-i","hp":120,"torque":154,"trans":"Multidrive CVT","fuel":"بنزين 92+"},"sec_auto_exterior":{"wheels":"16-inch Alloy","lights":"LED Fog Lights","roof":"Normal"},"sec_listing_price":{"official_price_egp":1390000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_corolla_smart', 'automotive', 'vehicle_trim', 'biz_model_toyota_corolla', 'corolla-smart', 'corolla-smart',
  'Smart Sunroof', 'سمارت بفتحة سقف', 'active', 1, '{"sec_1_identity":{"business_name":"Smart Sunroof","business_name_ar":"سمارت بفتحة سقف","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L Dual VVT-i","hp":120,"torque":154,"trans":"Multidrive CVT","fuel":"بنزين 92+"},"sec_auto_exterior":{"wheels":"16-inch Dual Alloy","lights":"Bi-Beam LED","roof":"Electric Sunroof"},"sec_listing_price":{"official_price_egp":1500000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_corolla_gr_sport', 'automotive', 'vehicle_trim', 'biz_model_toyota_corolla', 'corolla-gr-sport', 'corolla-gr-sport',
  'GR Sport', 'جي آر سبورت الرياضية', 'active', 1, '{"sec_1_identity":{"business_name":"GR Sport","business_name_ar":"جي آر سبورت الرياضية","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L Dual VVT-i","hp":120,"torque":154,"trans":"Multidrive CVT","fuel":"بنزين 92+"},"sec_auto_exterior":{"wheels":"17-inch GR Sport Black Alloy","lights":"Full Matrix LED","roof":"Panoramic Sunroof"},"sec_listing_price":{"official_price_egp":1650000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_tucson_shadow', 'automotive', 'vehicle_trim', 'biz_model_hyundai_tucson', 'tucson-shadow', 'tucson-shadow',
  'Shadow', 'شادو (الفئة الأولى)', 'active', 1, '{"sec_1_identity":{"business_name":"Shadow","business_name_ar":"شادو (الفئة الأولى)","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L T-GDI Turbo","hp":180,"torque":265,"trans":"7-Speed DCT","fuel":"بنزين 95"},"sec_auto_exterior":{"wheels":"17-inch Alloy","lights":"LED DRL","roof":"Normal"},"sec_listing_price":{"official_price_egp":1750000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_tucson_blaze', 'automotive', 'vehicle_trim', 'biz_model_hyundai_tucson', 'tucson-blaze', 'tucson-blaze',
  'Blaze Plus', 'بليز بلس بفتحة سقف بانوراما', 'active', 1, '{"sec_1_identity":{"business_name":"Blaze Plus","business_name_ar":"بليز بلس بفتحة سقف بانوراما","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.6L T-GDI Turbo","hp":180,"torque":265,"trans":"7-Speed DCT","fuel":"بنزين 95"},"sec_auto_exterior":{"wheels":"18-inch Alloy","lights":"Full LED","roof":"Panoramic Sunroof"},"sec_listing_price":{"official_price_egp":1900000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_sunny_base', 'automotive', 'vehicle_trim', 'biz_model_nissan_sunny', 'sunny-base', 'sunny-base',
  'Base A/T', 'بيز أوتوماتيك', 'active', 1, '{"sec_1_identity":{"business_name":"Base A/T","business_name_ar":"بيز أوتوماتيك","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder","hp":108,"torque":134,"trans":"4-Speed Automatic","fuel":"بنزين 92"},"sec_auto_exterior":{"wheels":"15-inch Steel","lights":"Halogen","roof":"Normal"},"sec_listing_price":{"official_price_egp":695000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_sunny_super_saloon', 'automotive', 'vehicle_trim', 'biz_model_nissan_sunny', 'sunny-super-saloon', 'sunny-super-saloon',
  'Super Saloon', 'سوبر صالون (أعلى فئة)', 'active', 1, '{"sec_1_identity":{"business_name":"Super Saloon","business_name_ar":"سوبر صالون (أعلى فئة)","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder","hp":108,"torque":134,"trans":"4-Speed Automatic","fuel":"بنزين 92"},"sec_auto_exterior":{"wheels":"15-inch Two-Tone Alloy","lights":"Halogen with Fog","roof":"Normal"},"sec_listing_price":{"official_price_egp":765000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_mg5_comfort', 'automotive', 'vehicle_trim', 'biz_model_mg_mg_5', 'mg5-comfort', 'mg5-comfort',
  'Comfort', 'كومفورت', 'active', 1, '{"sec_1_identity":{"business_name":"Comfort","business_name_ar":"كومفورت","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder","hp":120,"torque":150,"trans":"CVT","fuel":"بنزين 92"},"sec_auto_exterior":{"wheels":"16-inch Alloy","lights":"LED","roof":"Normal"},"sec_listing_price":{"official_price_egp":830000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


INSERT INTO businesses (id, market_id, type_id, parent_business_id, slug, path, name, name_ar, status, published, custom_data, created_at)
VALUES (
  'biz_trim_mg5_luxury', 'automotive', 'vehicle_trim', 'biz_model_mg_mg_5', 'mg5-luxury', 'mg5-luxury',
  'Luxury Sunroof', 'لاكشري بفتحة سقف وكاميرا 360', 'active', 1, '{"sec_1_identity":{"business_name":"Luxury Sunroof","business_name_ar":"لاكشري بفتحة سقف وكاميرا 360","category":"Trim / Variant"},"sec_auto_specs":{"engine":"1.5L 4-Cylinder","hp":120,"torque":150,"trans":"CVT","fuel":"بنزين 92"},"sec_auto_exterior":{"wheels":"16-inch Diamond Cut Alloy","lights":"Full LED","roof":"Sunroof"},"sec_listing_price":{"official_price_egp":900000,"currency":"EGP"}}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data;


UPDATE businesses
   SET custom_data = json_set(
     json_set(COALESCE(custom_data, '{}'), '$.sec_auto_specs', json('{"engine_type":"بنزين 4 أسطوانات خطي Dual VVT-i","displacement_cc":1598,"power_hp":120,"torque_nm":154,"transmission_type":"CVT Multidrive","drivetrain":"دفع أمامي FWD","fuel_consumption_l_100km":6.8,"fuel_tank_capacity_l":50,"acceleration_0_100":10.8,"top_speed_kmh":195,"seats":5}')),
     '$.sec_auto_exterior', json('{"length_mm":4630,"width_mm":1780,"height_mm":1435,"trunk_capacity_l":471}')
   )
 WHERE id = 'biz_model_toyota_corolla';


UPDATE businesses
   SET custom_data = json_set(
     json_set(COALESCE(custom_data, '{}'), '$.sec_auto_specs', json('{"engine_type":"1.6 Turbo SmartStream GDI","displacement_cc":1598,"power_hp":180,"torque_nm":265,"transmission_type":"7-Speed DCT أوتوماتيك ثنائي التعشيق","drivetrain":"دفع أمامي FWD","fuel_consumption_l_100km":6.1,"fuel_tank_capacity_l":54,"acceleration_0_100":9,"top_speed_kmh":201,"seats":5}')),
     '$.sec_auto_exterior', json('{"length_mm":4500,"width_mm":1865,"height_mm":1650,"trunk_capacity_l":503}')
   )
 WHERE id = 'biz_model_hyundai_tucson';


UPDATE businesses
   SET custom_data = json_set(
     json_set(COALESCE(custom_data, '{}'), '$.sec_auto_specs', json('{"engine_type":"1.5L 4 أسطوانات خطي DOHC","displacement_cc":1498,"power_hp":108,"torque_nm":134,"transmission_type":"4 سرعات أوتوماتيك","drivetrain":"دفع أمامي FWD","fuel_consumption_l_100km":6.9,"fuel_tank_capacity_l":41,"acceleration_0_100":12.5,"top_speed_kmh":178,"seats":5}')),
     '$.sec_auto_exterior', json('{"length_mm":4425,"width_mm":1695,"height_mm":1500,"trunk_capacity_l":490}')
   )
 WHERE id = 'biz_model_nissan_sunny';


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_toyota_agency', 'biz_brand_toyota', 'biz_agency_toyota_egypt', 'represented_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_corolla_dist_agency', 'biz_model_toyota_corolla', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_corolla_sold_sabaa', 'biz_model_toyota_corolla', 'biz_dist_alsabaa', 'sold_by', 0, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_corolla_sold_elqersh', 'biz_model_toyota_corolla', 'biz_dist_elqersh', 'sold_by', 0, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_corolla_service_abbassia', 'biz_model_toyota_corolla', 'biz_service_toyota_abbassia', 'serviced_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_hyundai_agency', 'biz_brand_hyundai', 'biz_agency_gb_auto', 'represented_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_tucson_dist_gb', 'biz_model_hyundai_tucson', 'biz_agency_gb_auto', 'distributed_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_tucson_sold_sabaa', 'biz_model_hyundai_tucson', 'biz_dist_alsabaa', 'sold_by', 0, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_tucson_service_gb', 'biz_model_hyundai_tucson', 'biz_service_gb_ghabbour_abu_rawash', 'serviced_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_nissan_agency', 'biz_brand_nissan', 'biz_agency_nissan_egypt', 'represented_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_sunny_dist_nissan', 'biz_model_nissan_sunny', 'biz_agency_nissan_egypt', 'distributed_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_sunny_sold_elqersh', 'biz_model_nissan_sunny', 'biz_dist_elqersh', 'sold_by', 0, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_mg_agency', 'biz_brand_mg', 'biz_agency_al_mansour', 'represented_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;


INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data, created_at)
VALUES (
  'rel_mg5_dist_mansour', 'biz_model_mg_mg_5', 'biz_agency_al_mansour', 'distributed_by', 1, '{}', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  is_primary = excluded.is_primary;
