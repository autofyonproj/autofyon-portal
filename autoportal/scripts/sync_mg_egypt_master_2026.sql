-- =========================================================================
-- MG EGYPT 2026/2027 COMPREHENSIVE MASTER SYNC
-- Snapshot Date: 2026-11-14
-- Exclusive Official Distributor: Al-Mansour Automotive (المنصور للسيارات)
-- Models (8): MG 5, MG ZS, MG GT, MG G50 Plus, MG One, MG RX5 Plus, MG HS & HEV, MG 7
-- Trims (13): Official verified trims with official dealer list prices
-- Hotline: 16424 | Official Source: mgmotor.com.eg
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. BRAND: MG (إم جي)
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{"sec_1_identity": {"business_name": "MG", "business_name_ar": "إم جي", "brand_origin": "بريطانيا / سايك موتورز (المملكة المتحدة والصين)", "founded": 1924, "tagline_ar": "الروح الرياضية البريطانية بتقنيات المستقبل", "official_agent_ar": "المنصور للسيارات", "hotline": "16424"}}',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 2. OFFICIAL EXCLUSIVE AGENCY & BRANCHES (المنصور للسيارات)
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES 
(
  'biz_agency_almansour_mg',
  'Al-Mansour Automotive - MG Egypt',
  'المنصور للسيارات - وكيل إم جي',
  'almansour-mg',
  'main_agency',
  'automotive',
  NULL,
  '/almansour-mg',
  'standalone',
  '{"sec_1_identity": {"agency_name_ar": "المنصور للسيارات - الوكيل الحصري لـ MG في مصر", "hotline": "16424", "website": "https://www.mgmotor.com.eg/", "headquarters_ar": "الطريق الدائري، منطقة المعارض، القاهرة الجديدة", "city": "Cairo", "verified": 1}}',
  1,
  'active'
),
(
  'biz_branch_almansour_cairo',
  'Al-Mansour MG New Cairo Ring Road',
  'المنصور إم جي - القاهرة الجديدة (الدائري)',
  'almansour-mg-cairo',
  'showroom',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/cairo',
  'standalone',
  '{"sec_1_identity": {"city_ar": "القاهرة الجديدة", "address_ar": "الطريق الدائري، منطقة المعارض", "phone": "16424", "branch_type_ar": "معرض رئيسي ومركز تسليم"}}',
  1,
  'active'
),
(
  'biz_branch_almansour_dokki',
  'Al-Mansour MG Dokki',
  'المنصور إم جي - فرع الدقي',
  'almansour-mg-dokki',
  'showroom',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/dokki',
  'standalone',
  '{"sec_1_identity": {"city_ar": "الجيزة", "address_ar": "شارع التحرير، الدقي", "phone": "16424", "branch_type_ar": "معرض بيع معتمد"}}',
  1,
  'active'
),
(
  'biz_branch_almansour_smouha',
  'Al-Mansour MG Smouha Alexandria',
  'المنصور إم جي - سموحة الإسكندرية',
  'almansour-mg-smouha',
  'service_center',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/smouha',
  'standalone',
  '{"sec_1_identity": {"city_ar": "الإسكندرية", "address_ar": "90 شارع فوزي معاذ، سموحة", "phone": "16424", "branch_type_ar": "معرض متكامل ومركز صيانة معتمد"}}',
  1,
  'active'
),
(
  'biz_branch_almansour_mansoura',
  'Al-Mansour MG Mansoura',
  'المنصور إم جي - فرع المنصورة',
  'almansour-mg-mansoura',
  'showroom',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/mansoura',
  'standalone',
  '{"sec_1_identity": {"city_ar": "الدقهلية", "address_ar": "44 شارع عبد السلام عارف، طريق المجزر، المنصورة", "phone": "16424", "branch_type_ar": "معرض بيع معتمد"}}',
  1,
  'active'
),
(
  'biz_branch_almansour_assiut',
  'Al-Mansour MG Assiut',
  'المنصور إم جي - أسيوط بني غالب',
  'almansour-mg-assiut',
  'service_center',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/assiut',
  'standalone',
  '{"sec_1_identity": {"city_ar": "أسيوط", "address_ar": "طريق أسيوط المطار، منطقة الخدمات، بني غالب", "phone": "16424", "branch_type_ar": "معرض بيع ومركز خدمة معتمد"}}',
  1,
  'active'
),
(
  'biz_branch_almansour_sohag',
  'Al-Mansour MG Sohag',
  'المنصور إم جي - فرع سوهاج',
  'almansour-mg-sohag',
  'showroom',
  'automotive',
  'biz_agency_almansour_mg',
  '/almansour-mg/sohag',
  'standalone',
  '{"sec_1_identity": {"city_ar": "سوهاج", "address_ar": "3 شارع الجمهورية، بجوار فندق الصفا، سوهاج", "phone": "16424", "branch_type_ar": "معرض بيع معتمد"}}',
  1,
  'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 3. THE 8 MG MODELS (VEHICLE_MODEL)
-- -------------------------------------------------------------------------

-- 3.1 MG 5 (UPDATE EXISTING)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG 5 2027",
      "business_name_ar": "إم جي 5 2027",
      "category": "Sedan",
      "tagline_ar": "السيدان الاقتصادية الأكثر رحابة وتجهيزاً في فئتها",
      "description_ar": "سيدان مدمجة بمحرك 1.5 لتر اقتصادي بقوة 120 حصان وناقل CVT، مع مساحة شنطة رائدة 512 لتر وتجهيزات متطورة تشمل كاميرا 360 و6 وسائد هوائية."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L 4-Cylinder Naturally Aspirated",
      "displacement_cc": 1498,
      "power_hp": 120,
      "torque_nm": 150,
      "transmission_type": "أوتوماتيك CVT",
      "drivetrain": "دفع أمامي FWD",
      "fuel_consumption_l_100km": 5.8,
      "fuel_tank_capacity_l": 45,
      "trunk_capacity_l": 512,
      "seats": 5
    },
    "sec_auto_exterior": {
      "length_mm": 4601,
      "width_mm": 1818,
      "height_mm": 1489,
      "wheelbase_mm": 2680,
      "trunk_capacity_l": 512,
      "wheels_ar": "جنوط رياضية ألومنيوم 16 بوصة",
      "headlights_ar": "مصابيح أمامية LED نهارية"
    },
    "sec_auto_technology": {
      "infotainment_size_in": 10.0,
      "connectivity_ar": "Apple CarPlay & Android Auto مع بلوتوث ومنافذ USB",
      "camera_ar": "كاميرا رؤية محيطية 360 درجة عالية الوضوح في فئة Luxury"
    },
    "sec_auto_safety": {
      "airbags": 6,
      "adas_suite_ar": "أنظمة فرامل متكاملة ABS + EBD + ESP ومساعد صعود المرتفعات ونظام مراقبة ضغط الإطارات TPMS"
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

-- 3.2 MG ZS (UPDATE EXISTING)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG ZS 2026/2027",
      "business_name_ar": "إم جي ZS 2026/2027",
      "category": "SUV",
      "tagline_ar": "الكروس أوفر الرياضية الأكثر انتشاراً في مصر",
      "description_ar": "سيارة SUV مدمجة بمحرك 1.5 لتر بقوة 119 حصان مع ارتفاع ممتاز عن الأرض ومقصورة عملية مجهزة بشاشة 8 بوصة وتجهيزات أمان متكاملة."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L 4-Cylinder DOHC",
      "displacement_cc": 1498,
      "power_hp": 119,
      "torque_nm": 150,
      "transmission_type": "أوتوماتيك 4 سرعات",
      "drivetrain": "دفع أمامي FWD",
      "fuel_consumption_l_100km": 5.8,
      "seats": 5
    },
    "sec_auto_exterior": {
      "length_mm": 4314,
      "width_mm": 1809,
      "height_mm": 1624,
      "wheels_ar": "جنوط رياضية ألومنيوم قياس 17 بوصة بلونين",
      "roof_rails": 1
    },
    "sec_auto_safety": {
      "airbags": 6,
      "braking_system": "ABS + EBD + ESP + CBC + TPMS"
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

-- 3.3 MG GT (NEW)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG GT 2027",
      "business_name_ar": "إم جي GT 2027",
      "category": "Sports Fastback",
      "tagline_ar": "الفاستباك الرياضية بمحرك 1.5 تيربو وقوة 170 حصان",
      "description_ar": "تصميم هجومي مستوحى من طرازات الكوبيه مع محرك تيربو 1.5 لتر بقوة 170 حصان وتسارع من 0 إلى 100 كم/س في 8.5 ثوان وناقل حركة مزدوج القابض Wet DCT بـ 7 سرعات."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbocharged 4-Cylinder",
      "displacement_cc": 1490,
      "power_hp": 170,
      "torque_nm": 275,
      "transmission_type": "ناقل حركة مزدوج القابض Wet DCT بـ 7 سرعات",
      "drivetrain": "دفع أمامي FWD",
      "acceleration_0_100": 8.5,
      "top_speed_kmh": 215,
      "seats": 5
    },
    "sec_auto_technology": {
      "digital_cluster_size_in": 12.3,
      "infotainment_size_in": 10.25,
      "connectivity_ar": "شاشة رقمية مزدوجة مع كاميرا محيطية 360 ونظام ملاحة"
    },
    "sec_auto_safety": {
      "airbags": 6,
      "adas_suite_ar": "نظام التحذير من مغادرة المسار وتحذير الاصطدام الأمامي مع كاميرا 360"
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

-- 3.4 MG G50 Plus (NEW)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG G50 Plus 2027",
      "business_name_ar": "إم جي G50 بلس 2027",
      "category": "MPV 7-Seats",
      "tagline_ar": "السيارة العائلية المتكاملة بـ 7 مقاعد ومحرك تيربو",
      "description_ar": "سيارة عائلية رحبة تتسع لـ 7 ركاب مع تكييف هواء مستقل لجميع الصفوف، محرك 1.5 تيربو بقوة 170 حصان وعزم 285 نيوتن.متر مع ناقل DCT 7 سرعات."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbo 4-Cylinder",
      "power_hp": 170,
      "torque_nm": 285,
      "transmission_type": "أوتوماتيك DCT 7 سرعات",
      "seats": 7
    },
    "sec_auto_comfort": {
      "climate_zones": 2,
      "rear_ac_vents": 1,
      "seating_rows": 3
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

-- 3.5 MG One (UPDATE EXISTING)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_model_mg_mg_one',
  'MG One',
  'إم جي وان',
  'mg-one',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-one',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "MG One 2027",
      "business_name_ar": "إم جي وان 2027",
      "category": "Crossover SUV",
      "tagline_ar": "الكروس أوفر المستقبلية بشاشة بانورامية ثلاثية 30 بوصة",
      "description_ar": "كروس أوفر تعتمد على منصة SIGMA المعمارية المتطورة، محرك 1.5 تيربو بقوة 181 حصان وناقل CVT مطور، مقصورة رقمية فائقة التطور بشاشة ثلاثية مدمجة 30 بوصة."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbo MEGA Tech",
      "power_hp": 181,
      "torque_nm": 285,
      "transmission_type": "CVT إلكتروني متطور",
      "seats": 5
    },
    "sec_auto_technology": {
      "infotainment_size_in": 30.0,
      "connectivity_ar": "شاشة بانورامية ثلاثية مدمجة 30 بوصة مع شاحن لاسلكي وسقف بانوراما"
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

-- 3.6 MG RX5 Plus (UPDATE EXISTING)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG RX5 Plus 2027",
      "business_name_ar": "إم جي RX5 بلس 2027",
      "category": "Midsize SUV",
      "tagline_ar": "الأناقة الرياضية مع شاشة عمودية عملاقة 14.1 بوصة",
      "description_ar": "سيارة SUV عائلية مدمجة بتصميم خارجي ديناميكي، محرك 1.5 تيربو بقوة 171 حصان وعزم 275 نيوتن.متر، مقصورة فاخرة بشاشة لمس عمودية 14.1 بوصة وشنطة كهربائية."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbo 4-Cylinder",
      "power_hp": 171,
      "torque_nm": 275,
      "transmission_type": "أوتوماتيك 7 سرعات Wet DCT",
      "seats": 5
    },
    "sec_auto_technology": {
      "infotainment_size_in": 14.1,
      "digital_cluster_size_in": 12.3,
      "connectivity_ar": "شاشة وسطية عمودية 14.1 بوصة وشاشة عدادات 12.3 بوصة وباب شنطة كهربائي"
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

-- 3.7 MG HS & HEV (UPDATE EXISTING)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES (
  'biz_model_mg_mg_hs',
  'MG HS',
  'إم جي HS',
  'mg-hs',
  'vehicle_model',
  'automotive',
  'biz_brand_mg',
  '/mg/mg-hs',
  'standalone',
  '{
    "sec_1_identity": {
      "business_name": "MG HS & HEV 2027",
      "business_name_ar": "إم جي HS وهايبرد 2027",
      "category": "Midsize SUV",
      "tagline_ar": "قمة الفخامة والرياضية وزر Super Sport ومنظومة هجينة 221 حصان",
      "description_ar": "سيارة SUV فاخرة بمقاعد رياضية جلدية من قطعة واحدة، زر القيادة الخارقة Super Sport، وتتوفر بنسخة تيربو 1.5 لتر أو نسخة هجينة HEV بقوة إجمالية 221 حصان."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbo Petrol / HEV Hybrid",
      "power_hp": 221,
      "torque_nm": 340,
      "transmission_type": "أوتوماتيك 7 DCT / ناقل هجين ذكي",
      "seats": 5
    },
    "sec_auto_interior": {
      "seating_material_ar": "مقاعد رياضية متصلة جلدية فاخرة مع تطعيمات كانتارا",
      "super_sport_button": 1,
      "ambient_lighting": 1
    },
    "sec_auto_safety": {
      "airbags": 6,
      "adas_suite_ar": "باقة أمان متكاملة تضم رصد النقطة العمياء وتنبيه حركة المرور الخلفية وحساسات محيطية"
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

-- 3.8 MG 7 (NEW)
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
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
  '{
    "sec_1_identity": {
      "business_name": "MG 7 2027",
      "business_name_ar": "إم جي 7 2027",
      "category": "Luxury Fastback",
      "tagline_ar": "أيقونة الفخامة الرياضية بجناح هوائي نشط وأبواب بلا إطار",
      "description_ar": "السيدان الرياضية الفاخرة الرائدة من إم جي، أبواب بدون إطار Frameless Doors، جناح خلفي هوائي نشط ثلاثي المراحل، نظام صوتي فاخر من Bose بـ 14 سماعة، وشاشة عملاقة 33 بوصة."
    },
    "sec_auto_specs": {
      "engine_type": "1.5L Turbo 4-Cylinder (Egypt Spec)",
      "displacement_cc": 1496,
      "power_hp": 185,
      "torque_nm": 300,
      "transmission_type": "أوتوماتيك 7 سرعات DCT",
      "drivetrain": "دفع أمامي FWD",
      "acceleration_0_100": 7.9,
      "top_speed_kmh": 210,
      "seats": 5
    },
    "sec_auto_exterior": {
      "length_mm": 4884,
      "width_mm": 1889,
      "height_mm": 1447,
      "wheelbase_mm": 2778,
      "wheels_ar": "جنوط رياضية ألومنيوم قياس 19 بوصة",
      "spoiler_ar": "جناح خلفي كهربائي نشط ثلاثي المراحل يفتح تلقائياً",
      "frameless_doors": 1
    },
    "sec_auto_technology": {
      "infotainment_size_in": 33.0,
      "audio_system_ar": "نظام صوتي محيطي فاخر Bose بـ 14 سماعة مع مضخم صوت"
    },
    "sec_auto_safety": {
      "airbags": 6,
      "adas_suite_ar": "نظام ADAS كامل للقيادة شبه الذاتية والمحافظة على المسار ونقاط عمياء وكاميرا 360 فائقة النقاء"
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
-- 4. THE 13 OFFICIAL TRIMS WITH VERIFIED EGYPTIAN MARKET PRICES
-- -------------------------------------------------------------------------
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES 
-- MG 5 Trims
(
  'biz_trim_mg_5_std', 'MG 5 Standard AT', 'إم جي 5 - Standard', 'mg-5-standard',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_5', '/mg/mg-5/standard',
  'embedded', '{"price_egp": 889990, "year": 2027, "status": "official_list", "specs_ar": "محرك 1.5 لتر، 2 وسائد هوائية، شاشة 8 بوصة، ناقل CVT"}', 1, 'active'
),
(
  'biz_trim_mg_5_lux', 'MG 5 Luxury AT', 'إم جي 5 - Luxury', 'mg-5-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_5', '/mg/mg-5/luxury',
  'embedded', '{"price_egp": 989990, "year": 2027, "status": "official_list", "specs_ar": "6 وسائد هوائية، كاميرا 360، فتحة سقف، شاشة 10 بوصة، مقاعد جلد كهربائية"}', 1, 'active'
),

-- MG ZS Trims
(
  'biz_trim_mg_zs_comf', 'MG ZS Comfort AT', 'إم جي ZS - Comfort', 'mg-zs-comfort',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_zs', '/mg/mg-zs/comfort',
  'embedded', '{"price_egp": 1075000, "year": 2026, "status": "official_list", "specs_ar": "محرك 1.5L، 4 وسائد هوائية، شاشة 8 بوصة، جنوط 17"}', 1, 'active'
),
(
  'biz_trim_mg_zs_lux', 'MG ZS Luxury Facelift', 'إم جي ZS - Luxury Facelift', 'mg-zs-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_zs', '/mg/mg-zs/luxury',
  'embedded', '{"price_egp": 1165000, "year": 2027, "status": "official_list", "specs_ar": "6 وسائد هوائية، كاميرا خلفية، تكييف أوتوماتيك، مقاعد جلد"}', 1, 'active'
),

-- MG GT Trims
(
  'biz_trim_mg_gt_comf', 'MG GT Comfort AT', 'إم جي GT - Comfort', 'mg-gt-comfort',
  'vehicle_trim', 'automotive', 'biz_model_mg_gt', '/mg/mg-gt/comfort',
  'embedded', '{"price_egp": 1110000, "year": 2027, "status": "official_list", "specs_ar": "محرك 1.5 تيربو 170 حصان، شاشة مزدوجة، فتحة سقف، 4 وسائد"}', 1, 'active'
),
(
  'biz_trim_mg_gt_lux', 'MG GT Luxury AT', 'إم جي GT - Luxury', 'mg-gt-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_gt', '/mg/mg-gt/luxury',
  'embedded', '{"price_egp": 1175000, "year": 2027, "status": "official_list", "specs_ar": "محرك 1.5 تيربو، 6 وسائد هوائية، كاميرا 360، مقاعد رياضية جلد، ADAS"}', 1, 'active'
),

-- MG G50 Plus Trim
(
  'biz_trim_mg_g50_lux', 'MG G50 Plus Luxury 7-Seats', 'إم جي G50 بلس - Luxury (7 مقاعد)', 'mg-g50-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_g50_plus', '/mg/mg-g50-plus/luxury',
  'embedded', '{"price_egp": 1325000, "year": 2027, "status": "official_list", "specs_ar": "7 مقاعد عائلية، تكييف خلفي مستقل، محرك 1.5 تيربو 170 حصان، شاشة 12.3 بوصة"}', 1, 'active'
),

-- MG One Trim
(
  'biz_trim_mg_one_lux', 'MG One Luxury AT', 'إم جي وان - Luxury', 'mg-one-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_one', '/mg/mg-one/luxury',
  'embedded', '{"price_egp": 1425000, "year": 2027, "status": "official_list", "specs_ar": "شاشة ثلاثية 30 بوصة، سقف بانوراما، كاميرا 360، محرك 1.5 تيربو 181 حصان"}', 1, 'active'
),

-- MG RX5 Plus Trim
(
  'biz_trim_mg_rx5_lux', 'MG RX5 Plus Luxury AT', 'إم جي RX5 بلس - Luxury', 'mg-rx5-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_rx5', '/mg/mg-rx5/luxury',
  'embedded', '{"price_egp": 1475000, "year": 2027, "status": "official_list", "specs_ar": "شاشة عمودية 14.1 بوصة، شنطة كهربائية، بانوراما، 6 وسائد، محرك 171 حصان"}', 1, 'active'
),

-- MG HS Trims
(
  'biz_trim_mg_hs_lux', 'MG HS Luxury 1.5T', 'إم جي HS - Luxury تيربو', 'mg-hs-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_hs', '/mg/mg-hs/luxury',
  'embedded', '{"price_egp": 1550000, "year": 2027, "status": "official_list", "specs_ar": "محرك 1.5 تيربو 170 حصان، زر Super Sport، مقاعد رياضية، 6 وسائد"}', 1, 'active'
),
(
  'biz_trim_mg_hs_hev', 'MG HS HEV Hybrid', 'إم جي HS - هايبرد HEV', 'mg-hs-hev',
  'vehicle_trim', 'automotive', 'biz_model_mg_mg_hs', '/mg/mg-hs/hev',
  'embedded', '{"price_egp": 1650000, "year": 2027, "status": "official_list", "specs_ar": "منظومة هجينة متطورة بقوة 221 حصان، عزم 340 نيوتن، استهلاك وقود فائق التوفير"}', 1, 'active'
),

-- MG 7 Trims
(
  'biz_trim_mg_7_lux', 'MG 7 Luxury 1.5T', 'إم جي 7 - Luxury', 'mg-7-luxury',
  'vehicle_trim', 'automotive', 'biz_model_mg_7', '/mg/mg-7/luxury',
  'embedded', '{"price_egp": 1625000, "year": 2027, "status": "official_list", "specs_ar": "محرك 1.5 تيربو 185 حصان، أبواب بدون إطار، شاشة 33 بوصة، فتحة سقف"}', 1, 'active'
),
(
  'biz_trim_mg_7_trophy', 'MG 7 Trophy 1.5T', 'إم جي 7 - Trophy الرائدة', 'mg-7-trophy',
  'vehicle_trim', 'automotive', 'biz_model_mg_7', '/mg/mg-7/trophy',
  'embedded', '{"price_egp": 1750000, "year": 2027, "status": "official_list", "specs_ar": "جناح هوائي نشط كهربائي، نظام صوتي Bose 14 سماعة، باقة ADAS كاملة، جنوط 19"}', 1, 'active'
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- -------------------------------------------------------------------------
-- 5. BUSINESS RELATIONSHIPS GRAPH EDGES
-- -------------------------------------------------------------------------
INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, role_data)
VALUES
-- Distributed by Al-Mansour
('rel_mg_dist_5', 'biz_model_mg_mg_5', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_zs', 'biz_model_mg_mg_zs', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_gt', 'biz_model_mg_gt', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_g50', 'biz_model_mg_g50_plus', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_one', 'biz_model_mg_mg_one', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_rx5', 'biz_model_mg_mg_rx5', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_hs', 'biz_model_mg_mg_hs', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),
('rel_mg_dist_7', 'biz_model_mg_7', 'biz_agency_almansour_mg', 'distributed_by', '{"official": true, "exclusive": true}'),

-- Sold by Showrooms
('rel_mg_sold_cairo', 'biz_model_mg_7', 'biz_branch_almansour_cairo', 'sold_by', '{"official_dealer": true}'),
('rel_mg_sold_dokki', 'biz_model_mg_mg_5', 'biz_branch_almansour_dokki', 'sold_by', '{"official_dealer": true}'),
('rel_mg_sold_smouha', 'biz_model_mg_gt', 'biz_branch_almansour_smouha', 'sold_by', '{"official_dealer": true}'),

-- Serviced by
('rel_mg_serv_smouha', 'biz_model_mg_7', 'biz_branch_almansour_smouha', 'serviced_by', '{"authorized_service": true}'),
('rel_mg_serv_assiut', 'biz_model_mg_mg_hs', 'biz_branch_almansour_assiut', 'serviced_by', '{"authorized_service": true}')
ON CONFLICT(id) DO UPDATE SET
  relation_type = excluded.relation_type,
  role_data = excluded.role_data;

-- -------------------------------------------------------------------------
-- 6. CINEMATIC LUXURY GALLERY MEDIA BINDINGS (vendor_gallery)
-- -------------------------------------------------------------------------
INSERT INTO vendor_gallery (id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES 
-- MG 7 (Hero & Active Spoiler)
('gal_mg7_ext_hero', 'biz_model_mg_7', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85', 
 'MG 7 British Racing Green Fastback', 'الأناقة الرياضية الفاخرة لإم جي 7 باللون الأخضر الملكي',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.4}', 'carousel', 1, 1, 'approved', 1),
('gal_mg7_ext_spoiler', 'biz_model_mg_7', 'sec_auto_exterior', 'spoiler', 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85', 
 'Active Aero Rear Wing', 'الجناح الخلفي النشط ثلاثي المراحل للأداء الرياضي العالي',
 '{"watermark":"autofyon.com","animation":"zoom","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 0, 1, 'approved', 2),
('gal_mg7_int_cockpit', 'biz_model_mg_7', 'sec_auto_technology', 'infotainment_size_in', 'sec_auto_technology', 
 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=85', 
 '33-inch Integrated Dual Screen & Bose Sound', 'شاشة عملاقة مدمجة 33 بوصة ونظام صوتي فاخر Bose بـ 14 سماعة',
 '{"watermark":"autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1),

-- MG 5 (Exterior & Interior)
('gal_mg5_ext_hero', 'biz_model_mg_mg_5', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85', 
 'MG 5 Modern Front Stance', 'الواجهة الأمامية العصرية لإم جي 5 - موديل 2027',
 '{"watermark":"MG · autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG GT (Cockpit & Fastback)
('gal_mggt_ext_hero', 'biz_model_mg_gt', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85', 
 'MG GT Aggressive Shark-Hunter Design', 'التصميم الهجومي لفاستباك إم جي GT الرياضية',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.4}', 'carousel', 1, 1, 'approved', 1),

-- MG HS (Super Sport Cockpit)
('gal_mghs_int_hero', 'biz_model_mg_mg_hs', 'sec_auto_interior', 'super_sport_button', 'sec_auto_interior', 
 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85', 
 'Super Sport Drive Mode & Racing Bucket Seats', 'زر Super Sport في عجلة القيادة والمقاعد الرياضية المدمجة',
 '{"watermark":"autofyon.com","animation":"zoom","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1)
ON CONFLICT(id) DO UPDATE SET
  url = excluded.url,
  media_data = excluded.media_data,
  caption_ar = excluded.caption_ar;
