const australCustomData = {
  sec_1_identity: {
    business_name: "Renault Austral",
    business_name_ar: "رينو أوسترال",
    category: "SUV",
    tagline: "Athletic High-Tech SUV - 2026 Edition",
    tagline_ar: "الـ SUV الرياضية الأكثر تطوراً وتقنية - موديل 2026",
    description: "The all-new high-tech SUV by Renault powered by 1.3L Turbocharged engine producing 150hp, 7-speed automatic transmission, OpenR dual screens up to 21.3 inches, and comprehensive ADAS safety suite.",
    description_ar: "الـ SUV الرياضية العصرية الأحدث من رينو بمحرك 1.3 لتر تيربو بقوة 150 حصان وناقل حركة أوتوماتيكي متطور وشاشات OpenR المزدوجة بمساحة 21.3 بوصة ونظام ملاحة Google المدمج وباقة أمان متكاملة."
  },
  sec_auto_specs: {
    engine_type: "بنزين 4 أسطوانات 1.3 لتر تيربو TCe",
    displacement_cc: 1332,
    power_hp: 150,
    torque_nm: 250,
    transmission_type: "أوتوماتيك X-Tronic بـ 7 سرعات وهمية",
    drivetrain: "دفع أمامي FWD",
    fuel_consumption_l_100km: 6.2,
    acceleration_0_100: 9.7,
    top_speed_kmh: 195,
    seats: 5
  },
  sec_auto_exterior: {
    length_mm: 4510,
    width_mm: 1825,
    height_mm: 1621,
    wheelbase_mm: 2667,
    ground_clearance_mm: 170,
    trunk_capacity_l: 575,
    wheels: "جنوط رياضية ألومنيوم قياس 19 و 20 بوصة (Esprit Alpine)",
    wheels_ar: "جنوط رياضية ألومنيوم قياس 19 و 20 بوصة (Esprit Alpine)",
    headlights: "مصابيح أمامية كاملة LED Matrix Vision مع إضاءة نهارية C-Shape",
    headlights_ar: "مصابيح أمامية كاملة LED Matrix Vision مع إضاءة نهارية C-Shape",
    roof_type: "سقف بانوراما زجاجي ثابت عازل للحرارة",
    roof_type_ar: "سقف بانوراما زجاجي ثابت عازل للحرارة"
  },
  sec_auto_interior: {
    seating_material: "فرش جلد ألكانتارا فاخر مع خياطة زرقاء Alpine حصرية",
    seating_material_ar: "فرش جلد ألكانتارا فاخر مع خياطة زرقاء Alpine حصرية",
    steering_wheel: "عجلة قيادة رياضية مكسوة بالجلد والألكانتارا مع بدالات سرعة",
    steering_wheel_ar: "عجلة قيادة رياضية مكسوة بالجلد والألكانتارا مع بدالات سرعة",
    ambient_lighting: 1,
    sunroof: "سقف بانورامي عريض"
  },
  sec_auto_engine: {
    engine_type: "1.3L Turbocharged TCe 4-Cylinder",
    engine_type_ar: "محرك 1.3 لتر تيربو TCe رباعي الأسطوانات",
    power_hp: 150,
    torque_nm: 250,
    displacement_cc: 1332,
    cylinders: 4,
    zero_to_100_s: 9.7,
    top_speed_kmh: 195,
    transmission_type: "X-Tronic CVT Automatic"
  },
  sec_auto_technology: {
    infotainment_size_in: 9.0,
    digital_cluster_size_in: 12.3,
    connectivity: "OpenR Link مع نظام Google المدمج وApple CarPlay وAndroid Auto لاسلكي",
    connectivity_ar: "OpenR Link مع نظام Google المدمج وApple CarPlay وAndroid Auto لاسلكي",
    audio_system: "نظام صوتي Harman Kardon فائق النقاء بـ 12 مكبر صوت",
    audio_system_ar: "نظام صوتي Harman Kardon فائق النقاء بـ 12 مكبر صوت",
    digital_cluster: 1
  },
  sec_auto_safety: {
    airbags: 7,
    adas_suite: "باقة مساعدة السائق النشطة Active Driver Assist والفرملة التلقائية ورادار النقطة العمياء وكاميرات 360 درجة",
    adas_suite_ar: "باقة مساعدة السائق النشطة Active Driver Assist والفرملة التلقائية ورادار النقطة العمياء وكاميرات 360 درجة",
    braking_system: "ABS + EBD + AFU + ESP + HSA"
  }
};

const jsonStr = JSON.stringify(australCustomData).replace(/'/g, "''");

console.log(`UPDATE businesses SET custom_data = '${jsonStr}', published = 1 WHERE id = 'biz_model_renault_austral';`);

// 1. Exterior Hero
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status) VALUES ('gal_austral_ext_hero', 'biz_model_renault_austral', 'sec_auto_exterior', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/beautyshot/austral-xhn-oo-beautyshot-desktop_ig_w1500_h903.jpg', 'Renault Austral Athletic Exterior & Stance', 'رينو أوسترال التصميم الرياضي الخارجي والحضور العصري', 1, 1, 'both', 1, 'approved');`);

// 2. Exterior Headlights & Grille
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_ext_lights', 'biz_model_renault_austral', 'sec_auto_exterior', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/overview/austral-xhn-oo-006_ig_w600_h337.jpg', 'Renault Austral LED Matrix Vision Headlights', 'مصابيح LED Matrix Vision المتطورة', 2, 0, 'both', 1, 'approved', 'headlights', 'sec_auto_exterior');`);

// 3. Exterior Wheels
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_ext_wheels', 'biz_model_renault_austral', 'sec_auto_exterior', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/overview/austral-xhn-oo-029_ig_w600_h337.jpg', 'Renault Austral 20-inch Daytona Alloy Wheels', 'جنوط دايتونا الرياضية ألومنيوم قياس 20 بوصة', 3, 0, 'both', 1, 'approved', 'wheels', 'sec_auto_exterior');`);

// 4. Interior Hero & Seats
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_int_hero', 'biz_model_renault_austral', 'sec_auto_interior', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/overview/austral-xhn-oo-007_ig_w600_h337.jpg', 'Renault Austral Esprit Alpine Sport Seats', 'مقاعد رياضية بفرش ألكانتارا وخياطة ألبين الزرقاء', 1, 1, 'both', 1, 'approved', 'seating_material', 'sec_auto_interior');`);

// 5. Interior Sunroof / Cabin
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_int_cabin', 'biz_model_renault_austral', 'sec_auto_interior', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/overview/austral-xhn-oo-008_ig_w1500_h843.jpg', 'Renault Austral Premium Panoramic Cabin', 'مقصورة قيادة فاخرة مع سقف بانوراما عريض', 2, 0, 'both', 1, 'approved', 'sunroof', 'sec_auto_interior');`);

// 6. Technology Open-R Screen
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_tech_screen', 'biz_model_renault_austral', 'sec_auto_technology', 'https://www.renault.com.eg/CountriesData/Egypt/images/NewAustral/Open-R_ig_w600_h337.png', 'Renault Austral OpenR 21.3-inch Digital Screens', 'شاشات OpenR الرقمية المزدوجة بمساحة 21.3 بوصة ونظام Google', 1, 1, 'both', 1, 'approved', 'infotainment_size_in', 'sec_auto_technology');`);

// 7. Safety Active Driver Assist
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_safe_adas', 'biz_model_renault_austral', 'sec_auto_safety', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/safetyequipment/austral-xhn-safety-004_ig_w600_h337.jpg', 'Renault Austral Active Driver Assist & Radar', 'باقة مساعدة السائق النشطة والرادار التفاعلي', 1, 1, 'both', 1, 'approved', 'braking_system', 'sec_auto_safety');`);

// 8. Engine Bay / Powertrain (reusing official high-res shot with field binding)
console.log(`INSERT OR REPLACE INTO vendor_gallery (id, business_id, section_id, url, caption, caption_ar, display_order, is_hero, placement, show_on_minisite, approval_status, field_key, field_section_id) VALUES ('gal_austral_engine_hero', 'biz_model_renault_austral', 'sec_auto_engine', 'https://www.renault.com.eg/CountriesData/Egypt/images/cars/HELIOS/2025/AustralMY25/ProductPlan/overview/austral-xhn-oo-024_ig_w1500_h843.jpg', 'Renault Austral 1.3L Turbo TCe 150hp Engine', 'محرك 1.3 لتر تيربو TCe بقوة 150 حصان وناقل X-Tronic', 1, 1, 'both', 1, 'approved', 'engine_type', 'sec_auto_engine');`);

// 9. Vendor autonegypt.com relationship simulation
console.log(`INSERT OR REPLACE INTO businesses (id, slug, name, name_ar, type_id, parent_business_id, published, status, minisite_mode) VALUES ('biz_dist_autonegypt', 'autonegypt', 'AutoNEgypt Automotive', 'أوتون إيجيبت لتجارة السيارات', 'distributor', NULL, 1, 'active', 'standalone');`);
console.log(`INSERT OR REPLACE INTO business_relationships (from_business_id, to_business_id, relation_type, is_primary) VALUES ('biz_model_renault_austral', 'biz_dist_autonegypt', 'sold_by', 1);`);
