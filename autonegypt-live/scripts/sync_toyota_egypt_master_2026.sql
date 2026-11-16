-- =========================================================================
-- TOYOTA EGYPT 2026 COMPREHENSIVE MASTER SYNC
-- Snapshot Date: 2026-11-14
-- Models: Corolla, Urban Cruiser, Fortuner, Prado, bZ4X
-- Trims: 12 Official Trims with verified prices
-- Network: Toyota Egypt (Abu Rawash & CFC), Al-Sabaa, El-Qersh, Abbassia
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. TOYOTA COROLLA 2026 (UPDATE EXISTING)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "Toyota Corolla",
    "business_name_ar": "تويوتا كورولا",
    "category": "Sedan",
    "tagline": "The World Most Trusted Sedan - 2026 Edition",
    "tagline_ar": "سيدان الاعتمادية الأولى في العالم - موديل 2026",
    "description": "The benchmark compact sedan with 1.6L Dual VVT-i engine, 10-speed CVT, and up to 6 airbags.",
    "description_ar": "سيدان الاعتمادية الأولى بمحرك 1.6 لتر Dual VVT-i وناقل حركة CVT بـ 10 سرعات وتجهيزات أمان متكاملة تصل إلى 6 وسائد هوائية."
  },
  "sec_auto_specs": {
    "engine_type": "بنزين 4 أسطوانات خطي 1.6 لتر Dual VVT-i",
    "displacement_cc": 1598,
    "power_hp": 120,
    "torque_nm": 154,
    "transmission_type": "أوتوماتيك CVT (10 سرعات وهمية)",
    "drivetrain": "دفع أمامي FWD",
    "fuel_consumption_l_100km": 6.8,
    "fuel_tank_capacity_l": 50,
    "acceleration_0_100": 11.0,
    "top_speed_kmh": 190,
    "seats": 5
  },
  "sec_auto_exterior": {
    "length_mm": 4630,
    "width_mm": 1780,
    "height_mm": 1435,
    "wheelbase_mm": 2700,
    "ground_clearance_mm": 135,
    "trunk_capacity_l": 471,
    "paint_finish": "أبيض لؤلؤي / فضي معدني / رمادي سيليست / أسود ملكي",
    "paint_finish_ar": "أبيض لؤلؤي / فضي معدني / رمادي سيليست / أسود ملكي",
    "wheels": "جنوط رياضية ألومنيوم قياس 17 بوصة بلونين (Elegance)",
    "wheels_ar": "جنوط رياضية ألومنيوم قياس 17 بوصة بلونين (Elegance)",
    "headlights": "مصابيح أمامية Bi-LED مع إضاءة نهارية وشبكة سوداء بيانو",
    "headlights_ar": "مصابيح أمامية Bi-LED مع إضاءة نهارية وشبكة سوداء بيانو"
  },
  "sec_auto_interior": {
    "seating_material": "فرش جلد فاخر بلونين مع مسند يد وسطي وتعديل كهربائي",
    "seating_material_ar": "فرش جلد فاخر بلونين مع مسند يد وسطي وتعديل كهربائي",
    "steering_wheel": "عجلة قيادة جلدية متعددة الوظائف مع بدالات سرعة",
    "steering_wheel_ar": "عجلة قيادة جلدية متعددة الوظائف مع بدالات سرعة",
    "ambient_lighting": 1,
    "sunroof": "فتحة سقف كهربائية زجاجية"
  },
  "sec_auto_engine": {
    "engine_type": "1.6L Dual VVT-i 4-Cylinder",
    "engine_type_ar": "محرك 1.6 لتر Dual VVT-i اقتصادي",
    "max_power_hp": 120,
    "max_torque_nm": 154,
    "displacement_cc": 1598,
    "cylinders": 4,
    "acceleration_0_100": 11.0
  },
  "sec_auto_technology": {
    "infotainment_size_in": 8.0,
    "digital_cluster_size_in": 12.3,
    "connectivity": "Apple CarPlay & Android Auto مع شاحن لاسلكي وUSB",
    "connectivity_ar": "Apple CarPlay & Android Auto مع شاحن لاسلكي وUSB",
    "audio_system": "نظام صوتي بـ 6 مكبرات صوت عالي الوضوح",
    "audio_system_ar": "نظام صوتي بـ 6 مكبرات صوت عالي الوضوح",
    "digital_cluster": 1
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite": "باقة أمان متكاملة تشمل فرامل مانعة للانغلاق ونظام الثبات الإلكتروني VSC ومساعد صعود التلال HAC وكاميرا خلفية وحساسات ركن",
    "adas_suite_ar": "باقة أمان متكاملة تشمل فرامل مانعة للانغلاق ونظام الثبات الإلكتروني VSC ومساعد صعود التلال HAC وكاميرا خلفية وحساسات ركن",
    "braking_system": "ABS + EBD + BA + VSC + HAC"
  },
  "sec_auto_comfort": {
    "climate_zones": 2,
    "keyless_entry": 1,
    "seat_adjust": "تعديل كهربائي لمقعد السائق في فئة Elegance",
    "seat_adjust_ar": "تعديل كهربائي لمقعد السائق في فئة Elegance"
  }
}'
WHERE id = 'biz_model_toyota_corolla';

-- -------------------------------------------------------------------------
-- 2. TOYOTA URBAN CRUISER 2026 (CREATE NEW / UPSERT)
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_model_toyota_urban_cruiser',
  'Urban Cruiser',
  'أوربان كروزر',
  'urban-cruiser',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/urban-cruiser',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Toyota Urban Cruiser",
      "business_name_ar": "تويوتا أوربان كروزر",
      "category": "SUV",
      "tagline": "Modern Compact SUV with High Ground Clearance",
      "tagline_ar": "سيارة SUV مدمجة عصرية بخلوص أرضي مرتفع وفتحة سقف بانوراما",
      "description": "Compact and elevated SUV powered by 1.5L engine with 6-speed automatic transmission, 210mm clearance, and 360 camera.",
      "description_ar": "سيارة SUV مدمجة مرتفعة بمحرك 1.5 لتر اقتصادي وناقل حركة أوتوماتيك 6 سرعات وخلوص أرضي 210 مم وسقف بانوراما وكاميرا 360 درجة."
    },
    "sec_auto_specs": {
      "engine_type": "بنزين 4 أسطوانات 1.5 لتر اقتصادي",
      "displacement_cc": 1462,
      "power_hp": 103,
      "torque_nm": 138,
      "transmission_type": "أوتوماتيك 6 سرعات اعتيادي",
      "drivetrain": "دفع أمامي FWD",
      "fuel_consumption_l_100km": 5.6,
      "seats": 5
    },
    "sec_auto_exterior": {
      "length_mm": 4365,
      "width_mm": 1795,
      "height_mm": 1645,
      "wheelbase_mm": 2600,
      "ground_clearance_mm": 210,
      "wheels": "جنوط رياضية ألومنيوم قياس 17 بوصة (Comfort)",
      "wheels_ar": "جنوط رياضية ألومنيوم قياس 17 بوصة (Comfort)",
      "roof_type": "فتحة سقف بانوراما كهربائية كاملة",
      "roof_type_ar": "فتحة سقف بانوراما كهربائية كاملة"
    },
    "sec_auto_technology": {
      "infotainment_size_in": 7.0,
      "connectivity": "Apple CarPlay & Android Auto",
      "camera": "كاميرا رؤية محيطية 360 درجة + شاشة عرض على الزجاج HUD"
    },
    "sec_auto_safety": {
      "airbags": 6,
      "braking_system": "ABS + EBD + VSC + HAC"
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 3. TOYOTA FORTUNER 2026 (UPDATE EXISTING)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "Toyota Fortuner",
    "business_name_ar": "تويوتا فورتشنر",
    "category": "SUV",
    "tagline": "True 7-Seater Body-on-Frame 4WD SUV",
    "tagline_ar": "سيارة SUV عائلية حقيقية بـ 7 مقاعد ودفع رباعي مع محركات حتى 4.0L V6",
    "description": "The dominant 7-passenger SUV in Egypt available with 2.7L RWD or potent 4.0L V6 4WD with locking differential and JBL audio.",
    "description_ar": "السيارة العائلية الأكثر سيطرة في مصر بـ 7 مقاعد حقيقية وشاسيه منفصل، متاحة بمحرك 2.7 لتر أو محرك جبار 4.0 لتر V6 بدفع رباعي وديفلوك ونظام صوتي JBL."
  },
  "sec_auto_specs": {
    "engine_type": "2.7L 4-Cylinder (163hp) / 4.0L V6 (234hp)",
    "displacement_cc": 3956,
    "power_hp": 234,
    "torque_nm": 376,
    "transmission_type": "أوتوماتيك 6 سرعات",
    "drivetrain": "دفع رباعي 4WD مع ديفلوك خلفي (أو دفع خلفي 2WD)",
    "seats": 7
  },
  "sec_auto_exterior": {
    "length_mm": 4795,
    "width_mm": 1855,
    "height_mm": 1835,
    "wheels": "جنوط رياضية ألومنيوم قياس 18 بوصة R-Sport",
    "wheels_ar": "جنوط رياضية ألومنيوم قياس 18 بوصة R-Sport",
    "body_kit": "حزمة رياضية حصرية R-Sport مع صدادات أمامية وخلفية مميزة"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 8.0,
    "audio_system": "نظام صوتي فاخر JBL مع 11 مكبر صوت ومضخم",
    "power_tailgate": 1
  },
  "sec_auto_safety": {
    "airbags": 7,
    "braking_system": "ABS + VSC + TRC + HAC + DAC"
  }
}'
WHERE id = 'biz_model_toyota_fortuner';

-- -------------------------------------------------------------------------
-- 4. TOYOTA LAND CRUISER PRADO 2026 (J250 - CREATE NEW / UPSERT)
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_model_toyota_prado',
  'Land Cruiser Prado',
  'لاند كروزر برادو',
  'prado',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/prado',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Toyota Land Cruiser Prado",
      "business_name_ar": "تويوتا لاند كروزر برادو",
      "category": "SUV",
      "tagline": "All-New J250 Luxury Off-Road Legend",
      "tagline_ar": "أسطورة الطرق الوعرة الجديدة كلياً J250 بمحرك تيربو 2.4L بنزين بقوة 267 حصان",
      "description": "The brand-new J250 Prado with retro design, 2.4L Turbo 267hp, 8-speed automatic, full-time 4WD, Crawl Control, and 12.3\" displays.",
      "description_ar": "الجيل الجديد كلياً J250 من برادو بتصميم ريترو فخم، ومحرك 2.4 تيربو بقوة 267 حصان وعزم 430 نيوتن.متر، وناقل 8 سرعات، ودفع رباعي مستمر مع شاشة 12.3 بوصة."
    },
    "sec_auto_specs": {
      "engine_type": "بنزين 4 أسطوانات 2.4 لتر تيربو Dual VVT-i",
      "displacement_cc": 2393,
      "power_hp": 267,
      "torque_nm": 430,
      "transmission_type": "أوتوماتيك 8 سرعات Direct Shift",
      "drivetrain": "دفع رباعي مستمر Full-Time 4WD مع Crawl Control و Multi-Terrain",
      "seats": 7
    },
    "sec_auto_exterior": {
      "length_mm": 4925,
      "width_mm": 1980,
      "height_mm": 1935,
      "wheelbase_mm": 2850,
      "wheels": "جنوط رياضية فاخرة قياس 20 بوصة"
    },
    "sec_auto_technology": {
      "infotainment_size_in": 12.3,
      "digital_cluster_size_in": 12.3,
      "climate_zones": 3,
      "ventilated_seats": 1
    },
    "sec_auto_safety": {
      "airbags": 8,
      "adas_suite": "باقة Toyota Safety Sense 3.0 المتطورة مع كاميرات محيطية ورادار تفاعلي"
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 5. TOYOTA bZ4X ELECTRIC 2026 (CREATE NEW / UPSERT)
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_model_toyota_bz4x',
  'bZ4X Electric',
  'تويوتا بي زد 4 إكس',
  'bz4x',
  'vehicle_model',
  'automotive',
  'biz_brand_toyota',
  '/toyota/bz4x',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "Toyota bZ4X",
      "business_name_ar": "تويوتا بي زد 4 إكس كهربائية",
      "category": "SUV",
      "tagline": "100% Electric SUV Beyond Zero - Up to 500km Range",
      "tagline_ar": "سيارة SUV كهربائية بالكامل 100% بمدى سير يصل إلى 500 كم وبطارية 71.4 kWh",
      "description": "Toyota all-electric future is here: 204hp electric motor, 71.4 kWh battery with DC fast charging, TSS 3.0, and futuristic cockpit.",
      "description_ar": "مستقبل تويوتا الكهربائي بالكامل في مصر: محرك كهربائي بقوة 204 حصان، بطارية 71.4 كيلووات تدعم الشحن السريع، وباقة أمان TSS 3.0 وسقف بانوراما."
    },
    "sec_auto_specs": {
      "engine_type": "محرك كهربائي متزامن فائق الكفاءة",
      "power_hp": 204,
      "torque_nm": 266,
      "battery_capacity_kwh": 71.4,
      "electric_range_km": 500,
      "transmission_type": "ناقل حركة مباشر أحادي السرعة للسيارات الكهربائية",
      "acceleration_0_100": 7.5,
      "top_speed_kmh": 160,
      "seats": 5
    },
    "sec_auto_exterior": {
      "roof_type": "سقف بانورامي كهربائي بالكامل",
      "wheels": "جنوط رياضية ديناميكية قياس 18 بوصة"
    },
    "sec_auto_technology": {
      "infotainment_size_in": 12.3,
      "connectivity": "Apple CarPlay لاسلكياً مع شاحن هاتف سريع"
    },
    "sec_auto_safety": {
      "airbags": 8,
      "adas_suite": "Toyota Safety Sense 3.0 مع رادار أمامي وخلفي ومساعد الركن الذكي"
    }
  }',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 6. OFFICIAL TRIMS (12 TRIMS WITH 2026 VERIFIED PRICES)
-- -------------------------------------------------------------------------
-- Corolla Trims (5)
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_trim_corolla_active', 'Corolla Active AT', 'كورولا أكتيف أوتوماتيك', 'corolla-active-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_corolla', '/toyota/corolla/active', 'embedded', '{"sec_listing_price":{"official_price_egp":1280000},"sec_auto_specs":{"airbags":2,"wheels":"15-inch steel"}}', 1, 'active'),
('biz_trim_corolla_comfort', 'Corolla Comfort AT', 'كورولا كومفورت أوتوماتيك', 'corolla-comfort-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_corolla', '/toyota/corolla/comfort', 'embedded', '{"sec_listing_price":{"official_price_egp":1380000},"sec_auto_specs":{"airbags":2,"wheels":"16-inch alloy","climate_zones":2}}', 1, 'active'),
('biz_trim_corolla_smart', 'Corolla Smart AT', 'كورولا سمارت أوتوماتيك', 'corolla-smart-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_corolla', '/toyota/corolla/smart', 'embedded', '{"sec_listing_price":{"official_price_egp":1480000},"sec_auto_specs":{"airbags":6,"digital_cluster":1}}', 1, 'active'),
('biz_trim_corolla_smart_sunroof', 'Corolla Smart Sunroof', 'كورولا سمارت فتحة سقف', 'corolla-smart-sunroof-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_corolla', '/toyota/corolla/smart-sunroof', 'embedded', '{"sec_listing_price":{"official_price_egp":1580000},"sec_auto_specs":{"airbags":6,"sunroof":1}}', 1, 'active'),
('biz_trim_corolla_elegance', 'Corolla Elegance AT', 'كورولا إليجانس أوتوماتيك', 'corolla-elegance-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_corolla', '/toyota/corolla/elegance', 'embedded', '{"sec_listing_price":{"official_price_egp":1630000},"sec_auto_specs":{"airbags":6,"wheels":"17-inch alloy","leather_seats":1,"bi_led":1}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET custom_data = excluded.custom_data, published = 1;

-- Urban Cruiser Trims (2)
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_trim_uc_active', 'Urban Cruiser Active AT', 'أوربان كروزر أكتيف', 'uc-active-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_urban_cruiser', '/toyota/urban-cruiser/active', 'embedded', '{"sec_listing_price":{"official_price_egp":1430000},"sec_auto_specs":{"power_hp":103}}', 1, 'active'),
('biz_trim_uc_comfort', 'Urban Cruiser Comfort AT', 'أوربان كروزر كومفورت', 'uc-comfort-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_urban_cruiser', '/toyota/urban-cruiser/comfort', 'embedded', '{"sec_listing_price":{"official_price_egp":1530000},"sec_auto_specs":{"power_hp":103,"panoramic_roof":1,"camera_360":1}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET custom_data = excluded.custom_data, published = 1;

-- Fortuner Trims (3)
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_trim_fort_smart_27', 'Fortuner Smart 2.7L 2WD', 'فورتشنر سمارت 2.7 لتر دفع خلفي', 'fortuner-smart-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_fortuner', '/toyota/fortuner/smart', 'embedded', '{"sec_listing_price":{"official_price_egp":3250000},"sec_auto_specs":{"engine":"2.7L","power_hp":163,"drivetrain":"RWD"}}', 1, 'active'),
('biz_trim_fort_elegance_40', 'Fortuner Elegance 4.0L 4WD', 'فورتشنر إليجانس 4.0 لتر دفع رباعي', 'fortuner-elegance-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_fortuner', '/toyota/fortuner/elegance', 'embedded', '{"sec_listing_price":{"official_price_egp":3550000},"sec_auto_specs":{"engine":"4.0L V6","power_hp":234,"drivetrain":"4WD"}}', 1, 'active'),
('biz_trim_fort_sport_40', 'Fortuner Sport 4.0L 4WD', 'فورتشنر سبورت 4.0 لتر دفع رباعي كامل', 'fortuner-sport-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_fortuner', '/toyota/fortuner/sport', 'embedded', '{"sec_listing_price":{"official_price_egp":3700000},"sec_auto_specs":{"engine":"4.0L V6","power_hp":234,"drivetrain":"4WD","jbl_audio":1,"rsport_kit":1}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET custom_data = excluded.custom_data, published = 1;

-- Prado Trim (1)
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_trim_prado_highline', 'Prado Highline 2.4L Turbo', 'برادو هاي لاين 2.4 لتر تيربو J250', 'prado-highline-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_prado', '/toyota/prado/highline', 'embedded', '{"sec_listing_price":{"official_price_egp":9000000},"sec_auto_specs":{"power_hp":267,"torque_nm":430,"crawl_control":1}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET custom_data = excluded.custom_data, published = 1;

-- bZ4X Trim (1)
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_trim_bz4x_premier', 'bZ4X Premier Electric', 'بي زد 4 إكس بريميير كهربائية', 'bz4x-premier-2026', 'vehicle_trim', 'automotive', 'biz_model_toyota_bz4x', '/toyota/bz4x/premier', 'embedded', '{"sec_listing_price":{"official_price_egp":2380000},"sec_auto_specs":{"power_hp":204,"range_km":500,"battery_kwh":71.4}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET custom_data = excluded.custom_data, published = 1;

-- -------------------------------------------------------------------------
-- 7. TOYOTA EGYPT BRANCHES & SERVICE HUBS
-- -------------------------------------------------------------------------
INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES 
('biz_branch_toyota_aburawash', 'Toyota Egypt - Abu Rawash HQ', 'تويوتا إيجيبت - المركز الرئيسي أبو رواش', 'toyota-aburawash', 'showroom', 'automotive', 'biz_agency_toyota_egypt', '/toyota-egypt/aburawash', 'standalone', '{"sec_1_identity":{"phone":"16550","city":"الجيزة","address":"طريق مصر إسكندرية الصحراوي، الكيلو 28"}}', 1, 'active'),
('biz_branch_toyota_cairo_festival', 'Toyota Egypt - Cairo Festival City', 'تويوتا إيجيبت - فرع كايرو فيستيفال سيتي', 'toyota-cfc', 'showroom', 'automotive', 'biz_agency_toyota_egypt', '/toyota-egypt/cfc', 'standalone', '{"sec_1_identity":{"phone":"16550","city":"القاهرة","address":"كايرو فيستيفال سيتي، التجمع الخامس"}}', 1, 'active')
ON CONFLICT(id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 8. BUSINESS RELATIONSHIPS (GRAPH EDGES)
-- -------------------------------------------------------------------------
INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data)
VALUES 
-- Urban Cruiser
('rel_uc_dist_agency', 'biz_model_toyota_urban_cruiser', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{"role":"الوكيل الرسمي الحصري بمصر","role_ar":"الوكيل الرسمي الحصري بمصر"}'),
('rel_uc_sold_sabaa', 'biz_model_toyota_urban_cruiser', 'biz_dist_alsabaa', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_uc_sold_elqersh', 'biz_model_toyota_urban_cruiser', 'biz_dist_elqersh', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_uc_service_aburawash', 'biz_model_toyota_urban_cruiser', 'biz_branch_toyota_aburawash', 'serviced_by', 1, '{"role":"المركز الرئيسي للصيانة","role_ar":"المركز الرئيسي للصيانة"}'),

-- Fortuner
('rel_fort_dist_agency', 'biz_model_toyota_fortuner', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{"role":"الوكيل الرسمي الحصري بمصر","role_ar":"الوكيل الرسمي الحصري بمصر"}'),
('rel_fort_sold_sabaa', 'biz_model_toyota_fortuner', 'biz_dist_alsabaa', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_fort_sold_elqersh', 'biz_model_toyota_fortuner', 'biz_dist_elqersh', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_fort_service_cfc', 'biz_model_toyota_fortuner', 'biz_branch_toyota_cairo_festival', 'serviced_by', 1, '{"role":"مركز خدمة وصيانة معتمد","role_ar":"مركز خدمة وصيانة معتمد"}'),

-- Prado J250
('rel_prado_dist_agency', 'biz_model_toyota_prado', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{"role":"الوكيل الرسمي الحصري بمصر","role_ar":"الوكيل الرسمي الحصري بمصر"}'),
('rel_prado_sold_sabaa', 'biz_model_toyota_prado', 'biz_dist_alsabaa', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_prado_service_aburawash', 'biz_model_toyota_prado', 'biz_branch_toyota_aburawash', 'serviced_by', 1, '{"role":"المركز الرئيسي للصيانة","role_ar":"المركز الرئيسي للصيانة"}'),

-- bZ4X Electric
('rel_bz4x_dist_agency', 'biz_model_toyota_bz4x', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{"role":"الوكيل الرسمي الحصري بمصر","role_ar":"الوكيل الرسمي الحصري بمصر"}'),
('rel_bz4x_sold_elqersh', 'biz_model_toyota_bz4x', 'biz_dist_elqersh', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_bz4x_service_cfc', 'biz_model_toyota_bz4x', 'biz_branch_toyota_cairo_festival', 'serviced_by', 1, '{"role":"مركز صيانة السيارات الكهربائية المعتمد","role_ar":"مركز صيانة السيارات الكهربائية المعتمد"}')
ON CONFLICT(id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 9. ASSET INDEXING: VENDOR GALLERY BINDINGS (PHOTOS PER SPEC)
-- -------------------------------------------------------------------------
-- Urban Cruiser Photos
INSERT INTO vendor_gallery (id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES 
('gal_uc_ext_hero', 'biz_model_toyota_urban_cruiser', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80', 
 'Toyota Urban Cruiser Modern Exterior', 'التصميم الخارجي العصري لتويوتا أوربان كروزر 2026',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),
('gal_uc_ext_roof', 'biz_model_toyota_urban_cruiser', 'sec_auto_exterior', 'roof_type', 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80', 
 'Panoramic Sunroof', 'فتحة سقف بانوراما كهربائية كاملة',
 '{"watermark":"autofyon.com","animation":"fade","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 2),
('gal_uc_int_cam', 'biz_model_toyota_urban_cruiser', 'sec_auto_technology', 'camera', 'sec_auto_technology', 
 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1400&q=80', 
 '360 Surround View Camera', 'كاميرا رؤية محيطية 360 درجة مع شاشة عرض HUD',
 '{"watermark":"autofyon.com","animation":"kenburns","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1)
ON CONFLICT(id) DO UPDATE SET url = excluded.url, media_data = excluded.media_data;

-- Fortuner Photos
INSERT INTO vendor_gallery (id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES 
('gal_fort_ext_hero', 'biz_model_toyota_fortuner', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80', 
 'Toyota Fortuner R-Sport Powerful Stance', 'الهيبة الرياضية لتويوتا فورتشنر بحزمة R-Sport',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),
('gal_fort_ext_kit', 'biz_model_toyota_fortuner', 'sec_auto_exterior', 'body_kit', 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80', 
 'R-Sport Dynamic Body Kit', 'حزمة رياضية حصرية R-Sport مع عجلات 18 بوصة',
 '{"watermark":"autofyon.com","animation":"zoom","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 2)
ON CONFLICT(id) DO UPDATE SET url = excluded.url, media_data = excluded.media_data;

-- Prado J250 Photos
INSERT INTO vendor_gallery (id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES 
('gal_prado_ext_hero', 'biz_model_toyota_prado', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80', 
 'All-New Prado J250 Retro Offroader', 'الجيل الجديد كلياً J250 لأسطورة برادو 2026',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1)
ON CONFLICT(id) DO UPDATE SET url = excluded.url, media_data = excluded.media_data;

-- bZ4X Electric Photos
INSERT INTO vendor_gallery (id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES 
('gal_bz4x_ext_hero', 'biz_model_toyota_bz4x', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80', 
 'Toyota bZ4X Beyond Zero Cockpit', 'مقصورة القيادة المستقبلية لـ تويوتا bZ4X الكهربائية',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1)
ON CONFLICT(id) DO UPDATE SET url = excluded.url, media_data = excluded.media_data;
