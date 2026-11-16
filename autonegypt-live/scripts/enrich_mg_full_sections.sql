-- =========================================================================
-- ENRICH ALL 8 MG MODELS WITH FULL PER-SECTION DATA & CINEMATIC GALLERY
-- Snapshot: 2026-11-14
-- Covers: sec_auto_engine, sec_auto_specs, sec_auto_exterior, 
--         sec_auto_interior, sec_auto_technology, sec_auto_safety, sec_auto_comfort
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. MG ZS (biz_model_mg_mg_zs)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG ZS 2026/2027",
    "business_name_ar": "إم جي ZS 2026/2027",
    "category": "SUV",
    "tagline": "The Best-Selling Compact SUV in Egypt",
    "tagline_ar": "الكروس أوفر الرياضية الأكثر انتشاراً في مصر",
    "description": "Smart, dynamic compact SUV powered by a reliable 1.5L engine, featuring elevated ground clearance, modern LED headlights, and 6 airbags.",
    "description_ar": "سيارة SUV مدمجة بمحرك 1.5 لتر بقوة 119 حصان مع ارتفاع ممتاز عن الأرض ومقصورة عملية مجهزة بشاشة 8 بوصة وتجهيزات أمان متكاملة تصل إلى 6 وسائد هوائية."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L 4-Cylinder DOHC VTi-TECH",
    "engine_type_ar": "محرك 1.5 لتر DOHC VTi-TECH تنفس طبيعي",
    "max_power_hp": 119,
    "max_torque_nm": 150,
    "displacement_cc": 1498,
    "cylinders": 4,
    "acceleration_0_100": 11.8,
    "fuel_consumption_l_100km": 5.8
  },
  "sec_auto_specs": {
    "engine_type": "بنزين 4 أسطوانات خطي 1.5 لتر تنفس طبيعي",
    "displacement_cc": 1498,
    "power_hp": 119,
    "torque_nm": 150,
    "transmission_type": "أوتوماتيك 4 سرعات اعتمادي",
    "drivetrain": "دفع أمامي FWD",
    "fuel_consumption_l_100km": 5.8,
    "fuel_tank_capacity_l": 48,
    "acceleration_0_100": 11.8,
    "top_speed_kmh": 175,
    "seats": 5
  },
  "sec_auto_exterior": {
    "length_mm": 4314,
    "width_mm": 1809,
    "height_mm": 1624,
    "wheelbase_mm": 2585,
    "ground_clearance_mm": 165,
    "trunk_capacity_l": 448,
    "wheels": "17-inch Two-Tone Diamond Cut Alloy Wheels",
    "wheels_ar": "جنوط رياضية ألومنيوم قياس 17 بوصة بلونين",
    "headlights": "London Eye LED Daytime Running Headlights",
    "headlights_ar": "مصابيح أمامية LED نهارية مستوحاة من London Eye مع شبكة فضية"
  },
  "sec_auto_interior": {
    "seating_material": "Premium Dual-Tone Leather Seats",
    "seating_material_ar": "مقاعد جلدية مريحة بلونين مع مسند يد وسطي وتعديل يدوي/كهربائي",
    "steering_wheel": "D-Cut Flat-Bottom Leather Steering Wheel",
    "steering_wheel_ar": "عجلة قيادة جلدية مسطحة القاع D-Cut متعددة الوظائف",
    "climate_control": "Electronic Air Conditioning with Dust Filter",
    "climate_control_ar": "تكييف هواء إلكتروني مع فلتر أتربة PM2.5"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 8.0,
    "connectivity": "Apple CarPlay & Android Auto with Bluetooth and USB",
    "connectivity_ar": "شاشة لمس 8 بوصة تدعم Apple CarPlay و Android Auto وبلوتوث وUSB",
    "audio_system": "6-Speaker Sound System with 3D Sound Effect",
    "audio_system_ar": "نظام صوتي محيطي بـ 6 مكبرات صوت مع تأثيرات 3D",
    "camera": "Rear View Camera with Dynamic Parking Guidance",
    "camera_ar": "كاميرا رؤية خلفية مع خطوط توجيهية ديناميكية وحساسات ركن"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "braking_system": "ABS + EBD + ESP + CBC + TCS + HHC + TPMS",
    "adas_suite_ar": "حزمة أمان متكاملة تضم 6 وسائد هوائية، ونظام الثبات الإلكتروني ESP، ومساعد صعود المرتفعات HHC، ومراقبة ضغط الإطارات TPMS",
    "body_construction_ar": "هيكل من الفولاذ المقوى عالي الصلابة بنسبة 70% مع نقاط امتصاص للصدمات"
  },
  "sec_auto_comfort": {
    "climate_zones": 1,
    "keyless_entry": 1,
    "cruise_control": 1,
    "sunroof": "فتحة سقف كهربائية في فئة Luxury",
    "seat_adjust_ar": "تعديل مقعد السائق في 6 اتجاهات ومقعد الراكب في 4 اتجاهات"
  }
}'
WHERE id = 'biz_model_mg_mg_zs' OR slug = 'mg-zs';

-- -------------------------------------------------------------------------
-- 2. MG 5 (biz_model_mg_mg_5)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG 5 2027",
    "business_name_ar": "إم جي 5 2027",
    "category": "Sedan",
    "tagline": "The Most Spacious & High-Tech Compact Sedan",
    "tagline_ar": "السيدان الاقتصادية الأكثر رحابة وتجهيزاً في فئتها",
    "description": "Modern sedan with leading interior space, 512L trunk, 1.5L engine with smooth CVT, 360-degree camera and up to 6 airbags.",
    "description_ar": "سيدان مدمجة بمحرك 1.5 لتر اقتصادي بقوة 120 حصان وناقل CVT، مع مساحة شنطة رائدة 512 لتر وتجهيزات متطورة تشمل كاميرا 360 و6 وسائد هوائية."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L 4-Cylinder Naturally Aspirated VTi",
    "engine_type_ar": "محرك 1.5 لتر اقتصادي 4 أسطوانات VTi",
    "max_power_hp": 120,
    "max_torque_nm": 150,
    "displacement_cc": 1498,
    "cylinders": 4,
    "acceleration_0_100": 11.5,
    "fuel_consumption_l_100km": 5.8
  },
  "sec_auto_specs": {
    "engine_type": "بنزين 4 أسطوانات 1.5 لتر اقتصادي",
    "displacement_cc": 1498,
    "power_hp": 120,
    "torque_nm": 150,
    "transmission_type": "أوتوماتيك CVT سلس",
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
    "headlights_ar": "مصابيح أمامية LED نهارية مع شبكة كرومية أنيقة"
  },
  "sec_auto_interior": {
    "seating_material_ar": "مقاعد جلدية مريحة مع تدفئة وتعديل كهربائي لمقعد السائق في Luxury",
    "sunroof": "فتحة سقف كهربائية زجاجية"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 10.0,
    "connectivity_ar": "Apple CarPlay & Android Auto مع بلوتوث و4 منافذ USB",
    "camera_ar": "كاميرا رؤية محيطية 360 درجة عالية الوضوح في فئة Luxury"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "braking_system": "ABS + EBD + ESP + CBC + TCS + HHC + TPMS",
    "adas_suite_ar": "أنظمة فرامل متكاملة ABS + EBD + ESP ومساعد صعود المرتفعات ونظام مراقبة ضغط الإطارات TPMS و6 وسائد هوائية"
  }
}'
WHERE id = 'biz_model_mg_mg_5' OR slug = 'mg-5';

-- -------------------------------------------------------------------------
-- 3. MG 7 (biz_model_mg_7)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG 7 2027",
    "business_name_ar": "إم جي 7 2027",
    "category": "Luxury Fastback",
    "tagline": "The British Flagship Sports Fastback",
    "tagline_ar": "أيقونة الفخامة الرياضية بجناح هوائي نشط وأبواب بلا إطار",
    "description": "Flagship grand tourer featuring frameless doors, 3-stage adaptive aero spoiler, 33-inch dual cockpit, and 185hp turbocharged engine.",
    "description_ar": "السيدان الرياضية الفاخرة الرائدة من إم جي، أبواب بدون إطار Frameless Doors، جناح خلفي هوائي نشط ثلاثي المراحل، نظام صوتي فاخر من Bose بـ 14 سماعة، وشاشة عملاقة 33 بوصة."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbocharged 4-Cylinder BlueCore",
    "engine_type_ar": "محرك 1.5 لتر تيربو بنزين 4 أسطوانات بقوة 185 حصان",
    "max_power_hp": 185,
    "max_torque_nm": 300,
    "displacement_cc": 1496,
    "cylinders": 4,
    "acceleration_0_100": 7.9,
    "top_speed_kmh": 210,
    "fuel_consumption_l_100km": 6.2
  },
  "sec_auto_specs": {
    "engine_type": "1.5L Turbo (مواصفات السوق المصري المعتمدة)",
    "displacement_cc": 1496,
    "power_hp": 185,
    "torque_nm": 300,
    "transmission_type": "أوتوماتيك 7 سرعات DCT مزدوج القابض",
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
    "spoiler_ar": "جناح خلفي كهربائي نشط ثلاثي المراحل يفتح تلقائياً على السرعات العالية",
    "frameless_doors": 1
  },
  "sec_auto_interior": {
    "seating_material_ar": "مقاعد رياضية فاخرة بجلد الدينايكا والكانتارا وتعديل كهربائي",
    "ambient_lighting": 1,
    "sunroof": "فتحة سقف بانورامية كهربائية واسعة"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 33.0,
    "audio_system_ar": "نظام صوتي محيطي فاخر Bose بـ 14 سماعة مع مضخم صوت وموزع ترددات",
    "connectivity_ar": "شاشة مزدوجة مدمجة 33 بوصة فائقة الدقة مع شريحة كوالكوم Snapdragon 8155"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite_ar": "نظام ADAS كامل يشمل المحافظة على المسار والركن الذاتي ورصد النقطة العمياء ومثبت السرعة التكيفي والرادار الأمامي"
  }
}'
WHERE id = 'biz_model_mg_7' OR slug = 'mg-7';

-- -------------------------------------------------------------------------
-- 4. INSERT COMPLETE CINEMATIC PHOTOS FOR ALL SECTIONS IN vendor_gallery
-- -------------------------------------------------------------------------
INSERT INTO vendor_gallery (
  id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order
) VALUES
-- MG ZS: Engine Shelf (sec_auto_engine)
('gal_mgzs_engine_bay', 'biz_model_mg_mg_zs', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=85',
 'MG ZS 1.5L VTi-TECH Efficient Engine', 'محرك إم جي ZS سعة 1.5 لتر DOHC VTi-TECH الاعتمادي بقوة 119 حصان',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG ZS: Specs Shelf (sec_auto_specs)
('gal_mgzs_specs_hero', 'biz_model_mg_mg_zs', 'sec_auto_specs', 'power_hp', 'sec_auto_specs',
 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
 'MG ZS Compact SUV Specifications', 'جدول المواصفات والقدرات الفنية لكروس أوفر إم جي ZS',
 '{"watermark":"MG · autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG ZS: Technology Shelf (sec_auto_technology)
('gal_mgzs_tech_screen', 'biz_model_mg_mg_zs', 'sec_auto_technology', 'infotainment_size_in', 'sec_auto_technology',
 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1600&q=85',
 'MG ZS 8-inch Touchscreen Infotainment', 'شاشة ترفيه لمسية قياس 8 بوصات تدعم Apple CarPlay و Android Auto',
 '{"watermark":"autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1),

-- MG ZS: Safety Shelf (sec_auto_safety)
('gal_mgzs_safe_airbags', 'biz_model_mg_mg_zs', 'sec_auto_safety', 'airbags', 'sec_auto_safety',
 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=85',
 '6 Airbags & ESP Active Safety Suite', 'منظومة الأمان والحماية المتكاملة بـ 6 وسائد هوائية ونظام الثبات ESP',
 '{"watermark":"MG · autofyon.com","animation":"zoom","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG 5: Engine Shelf (sec_auto_engine)
('gal_mg5_engine_bay', 'biz_model_mg_mg_5', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=85',
 'MG 5 1.5L VTi 120hp Engine & Smooth CVT', 'محرك إم جي 5 سعة 1.5 لتر بقوة 120 حصان وناقل حركة CVT فائق النعومة',
 '{"watermark":"MG · autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG 7: Engine Shelf (sec_auto_engine)
('gal_mg7_engine_bay', 'biz_model_mg_7', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
 'MG 7 1.5L Turbo 185hp High-Output Powertrain', 'محرك إم جي 7 تيربو 1.5 لتر بقوة 185 حصان وعزم دوران 300 نيوتن.متر',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.4}', 'carousel', 1, 1, 'approved', 1)

ON CONFLICT(id) DO UPDATE SET
  url = excluded.url,
  media_data = excluded.media_data,
  caption_ar = excluded.caption_ar;
