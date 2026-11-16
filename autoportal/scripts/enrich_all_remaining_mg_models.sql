-- =========================================================================
-- COMPLETE ENGINE & SECTIONS ENRICHMENT FOR ALL REMAINING MG MODELS
-- Models: MG GT, MG G50 Plus, MG One, MG RX5 Plus, MG HS
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. MG GT (biz_model_mg_gt)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG GT 2027",
    "business_name_ar": "إم جي GT 2027",
    "category": "Sports Fastback",
    "tagline": "The 170hp Turbocharged Sports Fastback",
    "tagline_ar": "الفاستباك الرياضية بمحرك 1.5 تيربو وقوة 170 حصان",
    "description": "Aggressive coupe-like fastback powered by a 1.5L Turbo engine delivering 170hp, 275Nm torque, 7-speed Wet DCT, 0-100 in 8.5s.",
    "description_ar": "تصميم هجومي مستوحى من طرازات الكوبيه مع محرك تيربو 1.5 لتر بقوة 170 حصان وتسارع من 0 إلى 100 كم/س في 8.5 ثوان وناقل حركة مزدوج القابض Wet DCT بـ 7 سرعات."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbocharged 4-Cylinder MegaTech",
    "engine_type_ar": "محرك 1.5 لتر تيربو بنزين 4 أسطوانات MegaTech عالي الأداء",
    "max_power_hp": 170,
    "max_torque_nm": 275,
    "displacement_cc": 1490,
    "cylinders": 4,
    "acceleration_0_100": 8.5,
    "top_speed_kmh": 215,
    "fuel_consumption_l_100km": 5.9
  },
  "sec_auto_specs": {
    "engine_type": "1.5L Turbo MegaTech 4 أسطوانات",
    "displacement_cc": 1490,
    "power_hp": 170,
    "torque_nm": 275,
    "transmission_type": "أوتوماتيك Wet DCT 7 سرعات ثنائي القابض",
    "drivetrain": "دفع أمامي FWD",
    "acceleration_0_100": 8.5,
    "top_speed_kmh": 215,
    "fuel_consumption_l_100km": 5.9,
    "fuel_tank_capacity_l": 50,
    "seats": 5
  },
  "sec_auto_exterior": {
    "length_mm": 4675,
    "width_mm": 1842,
    "height_mm": 1480,
    "wheelbase_mm": 2680,
    "wheels_ar": "جنوط رياضية توماهوك قياس 17 بوصة بلونين",
    "headlights_ar": "مصابيح أمامية LED هجومية وفتحة سقف كهربائية"
  },
  "sec_auto_interior": {
    "seating_material_ar": "مقاعد رياضية مكسوة بالجلد بلونين مع تدعيم جانبي فائق",
    "steering_wheel_ar": "عجلة قيادة رياضية جلدية متعددة الوظائف مع بدالات سرعة F1",
    "sunroof": "Electric"
  },
  "sec_auto_technology": {
    "digital_cluster_size_in": 12.3,
    "infotainment_size_in": 10.25,
    "connectivity_ar": "شاشة عدادات رقمية 12.3 بوصة وشاشة ترفيه 10.25 بوصة مع كاميرا 360 محيطية"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite_ar": "نظام التحذير من الاصطدام الأمامي، والتحذير من مغادرة المسار، وفرامل ABS و ESP"
  }
}'
WHERE id = 'biz_model_mg_gt' OR slug = 'mg-gt';

-- -------------------------------------------------------------------------
-- 2. MG G50 Plus (biz_model_mg_g50_plus)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG G50 Plus 2027",
    "business_name_ar": "إم جي G50 بلس 2027",
    "category": "MPV 7-Seats",
    "tagline": "The Ultimate 7-Seater Family Cruiser",
    "tagline_ar": "السيارة العائلية المتكاملة بـ 7 مقاعد ومحرك تيربو",
    "description": "Full-size 7-seat family vehicle powered by a 1.5L Turbo 170hp engine, independent rear climate control, and 12.3-inch screen.",
    "description_ar": "سيارة عائلية رحبة تتسع لـ 7 ركاب مع تكييف هواء مستقل لجميع الصفوف، محرك 1.5 تيربو بقوة 170 حصان وعزم 285 نيوتن.متر مع ناقل DCT 7 سرعات."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbocharged 4-Cylinder",
    "engine_type_ar": "محرك 1.5 لتر تيربو بنزين 4 أسطوانات بقوة 170 حصان",
    "max_power_hp": 170,
    "max_torque_nm": 285,
    "displacement_cc": 1490,
    "cylinders": 4,
    "transmission_type": "أوتوماتيك DCT 7 سرعات"
  },
  "sec_auto_specs": {
    "engine_type": "1.5L Turbo 4-Cylinder",
    "power_hp": 170,
    "torque_nm": 285,
    "transmission_type": "أوتوماتيك DCT 7 سرعات",
    "seats": 7
  },
  "sec_auto_interior": {
    "seating_rows": 3,
    "seating_material_ar": "فرش جلد فاخر لجميع المقاعد الـ 7 مع إمكانية طي الصف الثالث",
    "climate_control_ar": "تكييف هواء أوتوماتيكي مع مخارج وتحكم مستقل للصفين الثاني والثالث"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 12.3,
    "connectivity_ar": "شاشة ترفيه لمسية 12.3 بوصة مع شاحن لاسلكي وكاميرا خلفية"
  },
  "sec_auto_safety": {
    "airbags": 4,
    "braking_system": "ABS + EBD + ESP + TCS + HHC"
  }
}'
WHERE id = 'biz_model_mg_g50_plus' OR slug = 'mg-g50-plus';

-- -------------------------------------------------------------------------
-- 3. MG One (biz_model_mg_mg_one)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG One 2027",
    "business_name_ar": "إم جي وان 2027",
    "category": "Crossover SUV",
    "tagline": "The Future Crossover with 30-inch Triple Screen",
    "tagline_ar": "الكروس أوفر المستقبلية بشاشة بانورامية ثلاثية 30 بوصة",
    "description": "Built on the SIGMA architecture, powered by a 1.5L Turbo MEGA Tech 181hp engine with an immersive 30-inch continuous screen.",
    "description_ar": "كروس أوفر تعتمد على منصة SIGMA المعمارية المتطورة، محرك 1.5 تيربو بقوة 181 حصان وناقل CVT مطور، مقصورة رقمية فائقة التطور بشاشة ثلاثية مدمجة 30 بوصة."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbo MEGA Tech 4-Cylinder",
    "engine_type_ar": "محرك 1.5 لتر تيربو MEGA Tech بقوة 181 حصان",
    "max_power_hp": 181,
    "max_torque_nm": 285,
    "displacement_cc": 1490,
    "cylinders": 4,
    "transmission_type": "CVT إلكتروني متطور"
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
    "connectivity_ar": "شاشة بانورامية ثلاثية مدمجة 30 بوصة مع شاحن لاسلكي وسقف بانوراما وكاميرا 360"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite_ar": "باقة أمان متكاملة تشمل نظام الثبات الإلكتروني ومساعد الركن وكاميرا 360 درجة"
  }
}'
WHERE id = 'biz_model_mg_mg_one' OR slug = 'mg-one';

-- -------------------------------------------------------------------------
-- 4. MG RX5 Plus (biz_model_mg_mg_rx5)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG RX5 Plus 2027",
    "business_name_ar": "إم جي RX5 بلس 2027",
    "category": "Midsize SUV",
    "tagline": "Dynamic Sporty SUV with 14.1-inch Portrait Screen",
    "tagline_ar": "الأناقة الرياضية مع شاشة عمودية عملاقة 14.1 بوصة",
    "description": "Sporty family SUV with 1.5L Turbo 171hp engine, 275Nm torque, vertical 14.1-inch touchscreen, electric tailgate and panoramic roof.",
    "description_ar": "سيارة SUV عائلية مدمجة بتصميم خارجي ديناميكي، محرك 1.5 تيربو بقوة 171 حصان وعزم 275 نيوتن.متر، مقصورة فاخرة بشاشة لمس عمودية 14.1 بوصة وشنطة كهربائية."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbo 4-Cylinder NetBlue",
    "engine_type_ar": "محرك 1.5 لتر تيربو 4 أسطوانات NetBlue بقوة 171 حصان",
    "max_power_hp": 171,
    "max_torque_nm": 275,
    "displacement_cc": 1490,
    "cylinders": 4,
    "transmission_type": "أوتوماتيك 7 سرعات Wet DCT"
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
    "connectivity_ar": "شاشة وسطية عمودية 14.1 بوصة وشاشة عدادات 12.3 بوصة وباب شنطة كهربائي وسقف بانوراما"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "braking_system": "ABS + EBD + ESP + TCS + HHC + TPMS"
  }
}'
WHERE id = 'biz_model_mg_mg_rx5' OR slug = 'mg-rx5';

-- -------------------------------------------------------------------------
-- 5. MG HS & HEV (biz_model_mg_mg_hs)
-- -------------------------------------------------------------------------
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "MG HS & HEV 2027",
    "business_name_ar": "إم جي HS وهايبرد 2027",
    "category": "Midsize SUV",
    "tagline": "Flagship Luxury SUV with Super Sport Mode and 221hp HEV",
    "tagline_ar": "قمة الفخامة والرياضية وزر Super Sport ومنظومة هجينة 221 حصان",
    "description": "Luxurious SUV featuring one-piece bucket racing seats, steering-mounted Super Sport button, available in 1.5T or 221hp full hybrid powertrain.",
    "description_ar": "سيارة SUV فاخرة بمقاعد رياضية جلدية من قطعة واحدة، زر القيادة الخارقة Super Sport، وتتوفر بنسخة تيربو 1.5 لتر أو نسخة هجينة HEV بقوة إجمالية 221 حصان."
  },
  "sec_auto_engine": {
    "engine_type": "1.5L Turbo Petrol / HEV Hybrid System",
    "engine_type_ar": "محرك 1.5 لتر تيربو بنزين / منظومة هجينة HEV بقوة 221 حصان",
    "max_power_hp": 221,
    "max_torque_nm": 340,
    "displacement_cc": 1490,
    "cylinders": 4,
    "transmission_type": "أوتوماتيك 7 DCT / ناقل هجين ذكي"
  },
  "sec_auto_specs": {
    "engine_type": "1.5L Turbo Petrol / HEV Hybrid",
    "power_hp": 221,
    "torque_nm": 340,
    "transmission_type": "أوتوماتيك 7 DCT / ناقل هجين ذكي",
    "seats": 5
  },
  "sec_auto_interior": {
    "seating_material_ar": "مقاعد رياضية متصلة جلدية فاخرة مع تطعيمات كانتارا وزر Super Sport أحمر",
    "super_sport_button": 1,
    "ambient_lighting": 1,
    "sunroof": "Panoramic"
  },
  "sec_auto_technology": {
    "infotainment_size_in": 12.3,
    "digital_cluster_size_in": 12.3,
    "connectivity_ar": "شاشة رقمية مزدوجة 12.3 بوصة مع شاحن لاسلكي ونظام ملاحة ذكي"
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite_ar": "باقة أمان متكاملة تضم رصد النقطة العمياء وتنبيه حركة المرور الخلفية وحساسات محيطية"
  }
}'
WHERE id = 'biz_model_mg_mg_hs' OR slug = 'mg-hs';

-- -------------------------------------------------------------------------
-- 6. GALLERY CINEMATIC PHOTOS FOR MG GT & MG ALL MODELS
-- -------------------------------------------------------------------------
INSERT INTO vendor_gallery (
  id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order
) VALUES
-- MG GT: Engine Shelf (sec_auto_engine)
('gal_mggt_engine_bay', 'biz_model_mg_gt', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85',
 'MG GT 1.5L Turbo MegaTech 170hp Engine', 'محرك إم جي GT تيربو سعة 1.5 لتر بقوة 170 حصان وناقل حركة Wet DCT بـ 7 سرعات',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG GT: Interior Shelf (sec_auto_interior)
('gal_mggt_int_cockpit', 'biz_model_mg_gt', 'sec_auto_interior', 'seating_material', 'sec_auto_interior',
 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
 'F1 Style Sport Cockpit & Paddle Shifters', 'المقصورة الرياضية بمقاعد التدعيم الجانبي وبدالات سرعة F1',
 '{"watermark":"MG · autofyon.com","animation":"zoom","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG G50 Plus: Engine Shelf (sec_auto_engine)
('gal_mgg50_engine_bay', 'biz_model_mg_g50_plus', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=85',
 'MG G50 Plus 1.5L Turbo 170hp Family Powertrain', 'محرك إم جي G50 بلس تيربو سعة 1.5 لتر بقوة 170 حصان وعزم 285 نيوتن.متر',
 '{"watermark":"MG · autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG One: Engine Shelf (sec_auto_engine)
('gal_mgone_engine_bay', 'biz_model_mg_mg_one', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
 'MG One 1.5L Turbo MEGA Tech 181hp Engine', 'محرك إم جي وان تيربو MEGA Tech بقوة 181 حصان وناقل CVT مطور',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG RX5 Plus: Engine Shelf (sec_auto_engine)
('gal_mgrx5_engine_bay', 'biz_model_mg_mg_rx5', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85',
 'MG RX5 Plus NetBlue 1.5T 171hp Engine', 'محرك إم جي RX5 بلس NetBlue تيربو بقوة 171 حصان وعزم 275 نيوتن.متر',
 '{"watermark":"MG · autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- MG HS: Engine Shelf (sec_auto_engine)
('gal_mghs_engine_bay', 'biz_model_mg_mg_hs', 'sec_auto_engine', 'engine_type', 'sec_auto_engine',
 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=85',
 'MG HS 221hp High-Performance Hybrid Powertrain', 'منظومة إم جي HS الهجينة المتطورة بقوة إجمالية 221 حصان وعزم 340 نيوتن.متر',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1)

ON CONFLICT(id) DO UPDATE SET
  url = excluded.url,
  media_data = excluded.media_data,
  caption_ar = excluded.caption_ar;
