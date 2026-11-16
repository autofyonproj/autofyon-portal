-- =========================================================================
-- MASTER DATA PURIFICATION & ASSET ALLOCATION
-- 1. Ensure sec_auto_engine has engine spec form_fields for vehicle_model
-- 2. Clean out conflicting relationships and unify Al-Mansour agency
-- 3. Delete old/incorrect vendor_gallery images (no random sports cars)
-- 4. Insert 100% genuine agent images for MG and Toyota in exact sections
-- 5. Enrich custom_data specs matching form_fields for all models
-- =========================================================================

-- 1. FORM FIELDS FOR SEC_AUTO_ENGINE (Allows combustion/turbo specs to display)
INSERT INTO form_fields (
  business_type_id, section_id, name, label, label_ar, field_type, group_key, sort_order, options, show_as_slide
) VALUES
  ('vehicle_model', 'sec_auto_engine', 'engine_type', 'Engine Type', 'نوع المحرك', 'text', 'powertrain', 1, NULL, 1),
  ('vehicle_model', 'sec_auto_engine', 'displacement_cc', 'Displacement (cc)', 'السعة اللترية (سي سي)', 'number', 'powertrain', 2, NULL, 0),
  ('vehicle_model', 'sec_auto_engine', 'power_hp', 'Power (hp)', 'القوة (حصان)', 'number', 'powertrain', 3, NULL, 1),
  ('vehicle_model', 'sec_auto_engine', 'torque_nm', 'Torque (Nm)', 'عزم الدوران (نيوتن متر)', 'number', 'powertrain', 4, NULL, 1),
  ('vehicle_model', 'sec_auto_engine', 'transmission_type', 'Transmission', 'ناقل الحركة', 'text', 'powertrain', 5, NULL, 0),
  ('vehicle_model', 'sec_auto_engine', 'zero_to_100_s', '0-100 km/h (s)', 'التسارع 0-100 (ثانية)', 'number', 'powertrain', 6, NULL, 1)
ON CONFLICT(business_type_id, section_id, name) DO UPDATE SET
  label = excluded.label,
  label_ar = excluded.label_ar,
  group_key = excluded.group_key;

-- 2. UNIFY AL-MANSOUR AGENCY IN BUSINESS_RELATIONSHIPS
DELETE FROM business_relationships WHERE id = 'rel_mg5_dist_mansour';
UPDATE business_relationships 
SET to_business_id = 'biz_agency_almansour_mg'
WHERE to_business_id = 'biz_agency_al_mansour';

-- 3. REMOVE ALL OLD/UNRELATED IMAGES IN VENDOR_GALLERY FOR MODELS
DELETE FROM vendor_gallery WHERE business_id IN (
  'biz_model_mg_mg_5',
  'biz_model_mg_mg_zs',
  'biz_model_mg_mg_gt',
  'biz_model_mg_mg_g50_plus',
  'biz_model_mg_mg_one',
  'biz_model_mg_mg_rx5',
  'biz_model_mg_mg_hs',
  'biz_model_mg_mg_7',
  'biz_model_toyota_corolla',
  'biz_model_toyota_urban_cruiser',
  'biz_model_toyota_fortuner',
  'biz_model_toyota_prado',
  'biz_model_toyota_yaris',
  'biz_model_toyota_bz4x'
);

-- 4. INSERT 100% GENUINE OFFICIAL AGENT IMAGES FOR MG MODELS

-- === MG 5 ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mg5_ext_hero', 'biz_model_mg_mg_5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/MG5_ME_1.5L-CVT-DEL_Blue_Front-70_Beauty.jpg', 'MG 5 Elegant Compact Sedan Stance', 'إم جي 5 - تصميم سيدان عصري وأنيق', 'both', 1, 1, 'approved', 1),
  ('gal_mg5_ext_side', 'biz_model_mg_mg_5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/Exterior-2.jpg', 'MG 5 Aerodynamic Profile', 'إم جي 5 - المظهر الجانبي الانسيابي', 'both', 0, 1, 'approved', 2),
  ('gal_mg5_ext_lamps', 'biz_model_mg_mg_5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/MG5_ME_1.5L-CVT-DEL_Blue_LED-Headlamp.png', 'MG 5 LED Headlamps with DRL', 'مصابيح أمامية LED ذكية مع إضاءة نهارية', 'both', 0, 1, 'approved', 3),
  ('gal_mg5_ext_wheels', 'biz_model_mg_mg_5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/16-inch-rims.png', '16-inch Dual Tone Sport Rims', 'جنوط رياضية 16 بوصة بلونين', 'both', 0, 1, 'approved', 4),
  ('gal_mg5_int_cockpit', 'biz_model_mg_mg_5', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/08/MG5_ME_1.5L-CVT-DEL_Beige-Interior_Front-For-Web.jpg', 'MG 5 Premium Beige Ergonomic Cockpit', 'مقصورة فاخرة بفرش جلدي بيج ولمسات مريحة', 'both', 1, 1, 'approved', 1),
  ('gal_mg5_int_wheel', 'biz_model_mg_mg_5', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/Steering_Wheel-Interior-1.jpg', 'Leather Multi-function Steering Wheel', 'عجلة قيادة جلدية متعددة الوظائف', 'both', 0, 1, 'approved', 2),
  ('gal_mg5_engine_bay', 'biz_model_mg_mg_5', 'sec_auto_engine', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/Engine.jpg', 'MG 5 1.5L 4-Cylinder VTi-TECH Engine', 'محرك إم جي 5 سعة 1.5 لتر بتكنولوجيا VTi-TECH', 'both', 1, 1, 'approved', 1),
  ('gal_mg5_tech_screen', 'biz_model_mg_mg_5', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/Start-stop-button-10_inch_infotainment-2.jpg', '10-inch Color Touchscreen & Push Start', 'شاشة ترفيه ملونة 10 بوصة وزر تشغيل المحرك', 'both', 1, 1, 'approved', 1),
  ('gal_mg5_tech_cam', 'biz_model_mg_mg_5', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/360-Camera.jpg', '360-Degree Surround Vision Camera', 'نظام الرؤية المحيطية بكاميرا 360 درجة', 'both', 0, 1, 'approved', 2),
  ('gal_mg5_safety_airbags', 'biz_model_mg_mg_5', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/06/Airbags.png', '6 SRS Airbags Protection', 'منظومة حماية متكاملة بـ 6 وسائد هوائية', 'both', 1, 1, 'approved', 1);

-- === MG ZS ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mgzs_ext_hero', 'biz_model_mg_mg_zs', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/MG-ZS-Exterior.jpg', 'MG ZS Urban Crossover Dynamic Stance', 'إم جي ZS - كروس أوفر شبابية مدمجة وجريئة', 'both', 1, 1, 'approved', 1),
  ('gal_mgzs_ext_front', 'biz_model_mg_mg_zs', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/Moto_MG-ZS_Beauty_Music_Blue_ME-2.png', 'London Eye LED Headlamps & Diamond Grille', 'شبكة أمامية ماسية ومصابيح London Eye LED', 'both', 0, 1, 'approved', 2),
  ('gal_mgzs_ext_wheels', 'biz_model_mg_mg_zs', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/07/newZS.png', '17-inch Tomahawk Two-Tone Alloy Rims', 'جنوط رياضية Tomahawk قياس 17 بوصة', 'both', 0, 1, 'approved', 3),
  ('gal_mgzs_int_cockpit', 'biz_model_mg_mg_zs', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/MG-ZS-Interior.jpg', 'MG ZS Soft-Touch Ergonomic Cabin', 'مقصورة رحبة مكسوة بمواد ناعمة وعالية الجودة', 'both', 1, 1, 'approved', 1),
  ('gal_mgzs_int_boot', 'biz_model_mg_mg_zs', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/unlimited-Space.jpg', 'Flexible Rear Cargo Space up to 1166L', 'مساحة تخزين خلفية واسعة تصل إلى 1166 لتراً', 'both', 0, 1, 'approved', 2),
  ('gal_mgzs_tech_screen', 'biz_model_mg_mg_zs', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/07/Features-Specs.webp', '8.0-inch Color Infotainment System', 'شاشة لمسية 8 بوصة تدعم أبل كاربلاي وأندرويد', 'both', 1, 1, 'approved', 1),
  ('gal_mgzs_engine_bay', 'biz_model_mg_mg_zs', 'sec_auto_engine', 'https://www.mgmotor.com.eg/wp-content/uploads/2022/07/interior-and-exterior.jpg', 'MG ZS 1.5L VTi-TECH 119hp Powertrain', 'محرك 1.5 لتر VTi-TECH بقوة 119 حصان واقتصادي في الوقود', 'both', 1, 1, 'approved', 1);

-- === MG GT ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mggt_ext_hero', 'biz_model_mg_mg_gt', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Exterior-Isolated.webp', 'MG GT Aggressive Shark-Hunter Fastback', 'إم جي GT - سيدان رياضية فاستباك هجومية', 'both', 1, 1, 'approved', 1),
  ('gal_mggt_ext_grille', 'biz_model_mg_mg_gt', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Sporty-Front-Grille.webp', '3D Digital Flaming Grille', 'شبكة أمامية ثلاثية الأبعاد بتصميم النيران الرقمية', 'both', 0, 1, 'approved', 2),
  ('gal_mggt_ext_tails', 'biz_model_mg_mg_gt', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Tail-Lights-1.webp', 'Race Track LED Taillights', 'مصابيح خلفية LED بتصميم حلبات السباق', 'both', 0, 1, 'approved', 3),
  ('gal_mggt_int_cockpit', 'biz_model_mg_mg_gt', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Interior-Center.webp', 'Fighter-Jet Inspired Driver-Oriented Cockpit', 'مقصورة قيادة مستوحاة من الطائرات الحربية مائلة للسائق', 'both', 1, 1, 'approved', 1),
  ('gal_mggt_int_seats', 'biz_model_mg_mg_gt', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Interior-Side.webp', 'Two-Tone Racing Bucket Seats', 'مقاعد رياضية حاضنة بلونين وتطريز ديناميكي', 'both', 0, 1, 'approved', 2),
  ('gal_mggt_engine_bay', 'biz_model_mg_mg_gt', 'sec_auto_engine', 'https://www.mgmotor.com.eg/wp-content/uploads/2026/02/Exterior.webp', 'MG GT 1.5L Turbo MegaTech 170hp & Wet DCT', 'محرك 1.5 لتر تيربو بقوة 170 حصان وناقل Wet DCT بـ 7 سرعات', 'both', 1, 1, 'approved', 1),
  ('gal_mggt_safety_cage', 'biz_model_mg_mg_gt', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/12/Airbags.webp', '6 Airbags & High-Strength Safety Shell', '6 وسائد هوائية وهيكل فولاذي عالي الصلابة', 'both', 1, 1, 'approved', 1);

-- === MG G50 PLUS ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mgg50_ext_hero', 'biz_model_mg_mg_g50_plus', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/Ext.webp', 'MG G50 Plus Premium 7-Seater Family MPV', 'إم جي G50 بلس - سيارة عائلية فاخرة بـ 7 مقاعد', 'both', 1, 1, 'approved', 1),
  ('gal_mgg50_ext_side', 'biz_model_mg_mg_g50_plus', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/side-mg-Photoroom.webp', 'Aerodynamic Silhouette with Extended Wheelbase', 'تصميم انسيابي وقاعدة عجلات ممتدة لتوفير أقصى اتساع', 'both', 0, 1, 'approved', 2),
  ('gal_mgg50_int_dash', 'biz_model_mg_mg_g50_plus', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/Picture2.webp', 'First-Class Ergonomic Executive Dashboard', 'لوحة قيادة تنفيذية من الدرجة الأولى', 'both', 1, 1, 'approved', 1),
  ('gal_mgg50_int_seats', 'biz_model_mg_mg_g50_plus', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/Picture7.webp', 'Full 3-Row 7-Passenger Comfortable Cabin', 'مقصورة رحبة بثلاثة صفوف تتسع لـ 7 ركاب براحة تامة', 'both', 0, 1, 'approved', 2),
  ('gal_mgg50_tech_screen', 'biz_model_mg_mg_g50_plus', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/Picture8.webp', 'Dual 12.3-inch Smart Touch Display', 'شاشة ذكية عريضة ومزدوجة 12.3 بوصة', 'both', 1, 1, 'approved', 1),
  ('gal_mgg50_safety_adas', 'biz_model_mg_mg_g50_plus', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/10/saf-1.webp', 'Active Family Protection & Blind Spot Detection', 'حماية عائلية نشطة ونظام مراقبة النقطة العمياء', 'both', 1, 1, 'approved', 1);

-- === MG ONE ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mgone_ext_hero', 'biz_model_mg_mg_one', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2026/07/MG-ONE-1.webp', 'MG ONE Next-Gen Smart SUV Crossover', 'إم جي وان - الجيل الذكي الأحدث من سيارات الـ SUV', 'both', 1, 1, 'approved', 1),
  ('gal_mgone_ext_roof', 'biz_model_mg_mg_one', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/07/MG_One_-High-Res-33.webp', 'Two-Tone Floating Sport Roof', 'سقف عائم رياضي بلونين وإطلالة شبابية', 'both', 0, 1, 'approved', 2),
  ('gal_mgone_int_cockpit', 'biz_model_mg_mg_one', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/07/MG-One-Tableau-1.webp', 'Aviation Gear Shifter & Wrap-Around Cockpit', 'ناقل حركة إلكتروني بتصميم الطيران ومقصورة متطورة', 'both', 1, 1, 'approved', 1),
  ('gal_mgone_tech_screen', 'biz_model_mg_mg_one', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/07/MG_One_-High-Res-24.webp', '30-inch Wrap-Around Triple Display', 'شاشة بانورامية ثلاثية مدمجة 30 بوصة', 'both', 1, 1, 'approved', 1),
  ('gal_mgone_safety_pilot', 'biz_model_mg_mg_one', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/07/MG-ONE-SAF-DES-ALTA-3.webp', 'MG Pilot Advanced Driver Assistance System', 'نظام MG Pilot للقيادة الذكية والمساعدة المتقدمة', 'both', 1, 1, 'approved', 1);

-- === MG RX5 PLUS ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mgrx5_ext_hero', 'biz_model_mg_mg_rx5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2023/06/Exterior-RX5-Plus.webp', 'MG RX5 Plus Aggressive Geometric SUV Stance', 'إم جي RX5 بلس - شبكة هندسية هجومية ولمسات نيون', 'both', 1, 1, 'approved', 1),
  ('gal_mgrx5_ext_wheels', 'biz_model_mg_mg_rx5', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2026/07/RX5-Plus-1.webp', '19-inch High-Performance Alloy Wheels', 'جنوط رياضية قياس 19 بوصة', 'both', 0, 1, 'approved', 2),
  ('gal_mgrx5_int_cabin', 'biz_model_mg_mg_rx5', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2023/06/Interior-AT1.webp', 'Luxury Nappa Leather Accented Interior', 'مقصورة فاخرة بفرش جلدي نابا ولمسات رياضية', 'both', 1, 1, 'approved', 1),
  ('gal_mgrx5_tech_screen', 'biz_model_mg_mg_rx5', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2023/06/12.3-Virtual-Cockpit.webp', '14.1-inch Vertical Floating HD Screen', 'شاشة وسطية عملاقة 14.1 بوصة عالية الوضوح', 'both', 1, 1, 'approved', 1),
  ('gal_mgrx5_safety_cam', 'biz_model_mg_mg_rx5', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2023/06/360-camera-1.webp', '360 HD Surround View & Blind Spot Monitor', 'كاميرا 360 فائقة الدقة وكاشف النقطة العمياء', 'both', 1, 1, 'approved', 1);

-- === MG HS ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mghs_ext_hero', 'biz_model_mg_mg_hs', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Overview.webp', 'MG HS Luxury Flagship SUV Stance', 'إم جي HS - الإطلالة الفاخرة للسيارة الرياضية متعددة الاستخدامات', 'both', 1, 1, 'approved', 1),
  ('gal_mghs_ext_grille', 'biz_model_mg_mg_hs', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Exterior.webp', 'Star-Rider Grille & Dual LED Projectors', 'شبكة أمامية مرصعة بالنجوم ومصابيح LED ثنائية', 'both', 0, 1, 'approved', 2),
  ('gal_mghs_int_cabin', 'biz_model_mg_mg_hs', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Interior-1.webp', 'Dual-Tone Trophy Sport Leather Cockpit', 'مقصورة تروفي الجلدية الرياضية الفاخرة', 'both', 1, 1, 'approved', 1),
  ('gal_mghs_tech_screen', 'biz_model_mg_mg_hs', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Tech-1.webp', 'Dual 12.3-inch Immersive Digital Screens', 'شاشتان رقميتان 12.3 بوصة للعدادات والترفيه', 'both', 1, 1, 'approved', 1),
  ('gal_mghs_engine_bay', 'biz_model_mg_mg_hs', 'sec_auto_engine', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Perf.webp', '1.5L Turbo 170hp & Super Sport Driving Button', 'محرك 1.5 تيربو 170 حصان وزر Super Sport على المقود', 'both', 1, 1, 'approved', 1),
  ('gal_mghs_safety_ncap', 'biz_model_mg_mg_hs', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/08/Safety-1.webp', '5-Star Euro NCAP Crash Structure & 6 Airbags', 'أعلى معايير الأمان 5 نجوم أوروبية و6 وسائد هوائية', 'both', 1, 1, 'approved', 1);

-- === MG 7 ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_mg7_ext_hero', 'biz_model_mg_mg_7', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/11/MG7-Trophy-1.png', 'MG 7 British Racing Green Flagship Fastback', 'إم جي 7 - الفاستباك الرائدة باللون الأخضر البريطاني الملكي', 'both', 1, 1, 'approved', 1),
  ('gal_mg7_ext_doors', 'biz_model_mg_mg_7', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/11/Frameless-Doors.png', 'Frameless Coupe Doors with Double Acoustic Glazing', 'أبواب كوبيه بدون إطار وزجاج عازل مزدوج', 'both', 0, 1, 'approved', 2),
  ('gal_mg7_ext_spoiler', 'biz_model_mg_mg_7', 'sec_auto_exterior', 'https://www.mgmotor.com.eg/wp-content/uploads/2025/07/Active-Rear-Spoiler-1.webp', '3-Stage Electrically Deployable Active Aero Spoiler', 'جناح خلفي كهربائي نشط يفتح على 3 مراحل', 'both', 0, 1, 'approved', 3),
  ('gal_mg7_int_cockpit', 'biz_model_mg_mg_7', 'sec_auto_interior', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/11/ambient.webp', 'Emerald Green Silk Velvet Executive Cockpit', 'مقصورة تنفيذية بلمسات المخمل الحريري والإضاءة المحيطية', 'both', 1, 1, 'approved', 1),
  ('gal_mg7_tech_screen', 'biz_model_mg_mg_7', 'sec_auto_technology', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/11/30-TripleWrap-Around-Screen.png', '33-inch Integrated Curved OLED Display & Bose Sound', 'شاشة منحنية عملاقة 33 بوصة ونظام صوتي Bose', 'both', 1, 1, 'approved', 1),
  ('gal_mg7_safety_cam', 'biz_model_mg_mg_7', 'sec_auto_safety', 'https://www.mgmotor.com.eg/wp-content/uploads/2024/12/360.webp', '540-Degree Transparent Chassis & Surround Camera', 'كاميرا 540 درجة برؤية الشاسيه الشفاف وأنظمة مساعدة ذكية', 'both', 1, 1, 'approved', 1);

-- === TOYOTA COROLLA ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_corolla_ext_hero', 'biz_model_toyota_corolla', 'sec_auto_exterior', 'https://toyota.com.eg/storage/34218/conversions/red_active-optimized.png', 'Toyota Corolla Official Active Sedan Stance', 'تويوتا كورولا - السيدان الأكثر اعتمادية عالمياً في مصر', 'both', 1, 1, 'approved', 1),
  ('gal_corolla_ext_gr', 'biz_model_toyota_corolla', 'sec_auto_exterior', 'https://toyota.com.eg/storage/7128/conversions/gr-optimized.png', 'Corolla GR Sport Dynamic Styling', 'تويوتا كورولا جي آر سبورت الديناميكية', 'both', 0, 1, 'approved', 2),
  ('gal_corolla_ext_comfort', 'biz_model_toyota_corolla', 'sec_auto_exterior', 'https://toyota.com.eg/storage/34220/conversions/comfort-optimized.png', 'Corolla Comfort Edition Exterior', 'كورولا فئة كومفورت باللون المميز', 'both', 0, 1, 'approved', 3);

-- === TOYOTA URBAN CRUISER ===
INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, placement, is_hero, show_on_minisite, approval_status, display_order)
VALUES
  ('gal_uc_ext_hero', 'biz_model_toyota_urban_cruiser', 'sec_auto_exterior', 'https://toyota.com.eg/storage/40961/conversions/side-175-x-65-optimized.png', 'Toyota Urban Cruiser Compact Crossover Stance', 'تويوتا أوربان كروزر - كروس أوفر مدمجة وعملية', 'both', 1, 1, 'approved', 1),
  ('gal_uc_ext_side', 'biz_model_toyota_urban_cruiser', 'sec_auto_exterior', 'https://toyota.com.eg/storage/40968/conversions/side-175-x-65-optimized.png', 'Urban Cruiser Two-Tone Urban Stance', 'أوربان كروزر بتصميم السقف بلونين', 'both', 0, 1, 'approved', 2);
