-- 1. Enrich Toyota Yaris with complete specifications for the Egyptian market
UPDATE businesses
SET custom_data = '{
  "sec_1_identity": {
    "business_name": "Toyota Yaris",
    "business_name_ar": "تويوتا ياريس",
    "category": "Hatchback",
    "tagline": "Dynamic Hatchback with Japanese Reliability",
    "tagline_ar": "هاتشباك ديناميكية بكفاءة يابانية رائدة",
    "description": "The agile urban hatchback with 1.5L engine, class-leading fuel economy, and Toyota Safety Sense.",
    "description_ar": "سيارة المدينة اليابانية الأكثر كفاءة واعتمادية بمحرك 1.5 لتر واستهلاك وقود فائق التوفير وباقة تويوتا للأمان الذكي."
  },
  "sec_auto_specs": {
    "engine_type": "بنزين 3 أسطوانات 1.5 لتر Dual VVT-i",
    "displacement_cc": 1490,
    "power_hp": 123,
    "torque_nm": 153,
    "transmission_type": "Direct Shift-CVT",
    "drivetrain": "دفع أمامي FWD",
    "fuel_consumption_l_100km": 4.9,
    "fuel_tank_capacity_l": 42,
    "acceleration_0_100": 10.2,
    "top_speed_kmh": 180,
    "seats": 5
  },
  "sec_auto_exterior": {
    "length_mm": 3940,
    "width_mm": 1745,
    "height_mm": 1500,
    "wheelbase_mm": 2560,
    "trunk_capacity_l": 286,
    "paint_finish": "أبيض لؤلؤي كريستالي / أحمر قرمزي معدني",
    "paint_finish_ar": "أبيض لؤلؤي كريستالي / أحمر قرمزي معدني",
    "wheels": "جنوط رياضية ألومنيوم قياس 16 بوصة بلونين",
    "wheels_ar": "جنوط رياضية ألومنيوم قياس 16 بوصة بلونين",
    "headlights": "مصابيح أمامية LED مع إضاءة نهارية مدمجة DRL ومصابيح ضباب",
    "headlights_ar": "مصابيح أمامية LED مع إضاءة نهارية مدمجة DRL ومصابيح ضباب"
  },
  "sec_auto_interior": {
    "seating_material": "فرش قماش فاخر مع تطريز دقيق ومساند رأس قابلة للتعديل",
    "seating_material_ar": "فرش قماش فاخر مع تطريز دقيق ومساند رأس قابلة للتعديل",
    "steering_wheel": "عجلة قيادة جلدية متعددة الوظائف قابلة للإمالة والامتداد",
    "steering_wheel_ar": "عجلة قيادة جلدية متعددة الوظائف قابلة للإمالة والامتداد",
    "ambient_lighting": 1,
    "trunk_capacity_l": 286
  },
  "sec_auto_engine": {
    "engine_type": "محرك ديناميك فورس 1.5 لتر اقتصادي",
    "engine_type_ar": "محرك ديناميك فورس 1.5 لتر اقتصادي",
    "max_power_hp": 123,
    "max_torque_nm": 153,
    "displacement_cc": 1490,
    "cylinders": 3,
    "acceleration_0_100": 10.2
  },
  "sec_auto_technology": {
    "infotainment_size_in": 9.0,
    "connectivity": "Apple CarPlay & Android Auto لاسلكياً مع بلوتوث وUSB",
    "connectivity_ar": "Apple CarPlay & Android Auto لاسلكياً مع بلوتوث وUSB",
    "audio_system": "نظام صوتي محيطي عالي النقاء بـ 6 مكبرات صوت",
    "audio_system_ar": "نظام صوتي محيطي عالي النقاء بـ 6 مكبرات صوت",
    "digital_cluster": 1
  },
  "sec_auto_safety": {
    "airbags": 6,
    "adas_suite": "باقة Toyota Safety Sense تشمل فرامل الطوارئ الذكية ومساعد البقاء في المسار وتنبيه الخروج",
    "adas_suite_ar": "باقة Toyota Safety Sense تشمل فرامل الطوارئ الذكية ومساعد البقاء في المسار وتنبيه الخروج",
    "braking_system": "ABS + EBD + VSC ونظام المساعدة على صعود التلال HAC وكاميرا رؤية خلفية",
    "braking_system_ar": "ABS + EBD + VSC ونظام المساعدة على صعود التلال HAC وكاميرا رؤية خلفية"
  },
  "sec_auto_comfort": {
    "climate_zones": 1,
    "keyless_entry": 1,
    "seat_adjust": "تعديل يدوي بـ 6 اتجاهات لمقعد السائق",
    "seat_adjust_ar": "تعديل يدوي بـ 6 اتجاهات لمقعد السائق"
  }
}'
WHERE id = 'biz_model_toyota_yaris';

-- 2. Official Trims for Yaris
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, custom_data, published, status
) VALUES 
('biz_trim_toyota_yaris_active', 'Yaris Active', 'ياريس أكتيف', 'yaris-active', 'vehicle_trim', 'automotive', 'biz_model_toyota_yaris', '/toyota/yaris/active', 'embedded', '{
  "sec_listing_price": {"official_price_egp": 1150000},
  "sec_auto_specs": {"power_hp": 123, "transmission_type": "CVT", "seats": 5},
  "sec_auto_exterior": {"wheels": "جنوط حديد مع غطاء قياس 15 بوصة"}
}', 1, 'active'),
('biz_trim_toyota_yaris_smart', 'Yaris Smart', 'ياريس سمارت', 'yaris-smart', 'vehicle_trim', 'automotive', 'biz_model_toyota_yaris', '/toyota/yaris/smart', 'embedded', '{
  "sec_listing_price": {"official_price_egp": 1250000},
  "sec_auto_specs": {"power_hp": 123, "transmission_type": "CVT", "seats": 5},
  "sec_auto_exterior": {"wheels": "جنوط رياضية ألومنيوم قياس 16 بوصة", "headlights": "Full LED"}
}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  custom_data = excluded.custom_data,
  published = 1;

-- 3. Business Relationships for Yaris
INSERT INTO business_relationships (id, from_business_id, to_business_id, relation_type, is_primary, role_data)
VALUES 
('rel_yaris_dist_toyota_egypt', 'biz_model_toyota_yaris', 'biz_agency_toyota_egypt', 'distributed_by', 1, '{"role":"الوكيل الرسمي الحصري بمصر","role_ar":"الوكيل الرسمي الحصري بمصر"}'),
('rel_yaris_sold_alsabaa', 'biz_model_toyota_yaris', 'biz_dist_alsabaa', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_yaris_sold_elqersh', 'biz_model_toyota_yaris', 'biz_dist_elqersh', 'sold_by', 0, '{"role":"موزع معتمد","role_ar":"موزع معتمد"}'),
('rel_yaris_service_abbassia', 'biz_model_toyota_yaris', 'biz_service_toyota_abbassia', 'serviced_by', 1, '{"role":"مركز خدمة وصيانة معتمد","role_ar":"مركز خدمة وصيانة معتمد"}')
ON CONFLICT(id) DO NOTHING;

-- 4. Vendor Offers Registered directly on Toyota Yaris Car Database
INSERT INTO unit_offers (
  id, model_business_id, seller_business_id, trim, unit_kind, authority, price_from_egp, availability_note_ar, published
) VALUES 
('offer_yaris_sabaa_smart', 'biz_model_toyota_yaris', 'biz_dist_alsabaa', 'Smart', 'new', 'distributor', 1260000, 'تسليم فوري في فروع مدينة نصر والمعادي - يشمل الفرش المخصص وحماية نانو سيراميك', 1),
('offer_yaris_elqersh_active', 'biz_model_toyota_yaris', 'biz_dist_elqersh', 'Active', 'new', 'distributor', 1150000, 'استلام فوري بالفاتورة الرسمية مع أنظمة تقسيط بنكي حتى 7 سنوات', 1)
ON CONFLICT(id) DO UPDATE SET
  price_from_egp = excluded.price_from_egp,
  availability_note_ar = excluded.availability_note_ar,
  published = 1;

-- 5. Full Spec Pictures in vendor_gallery for Toyota Yaris
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_toyota_yaris';

INSERT INTO vendor_gallery (
  id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order
) VALUES 
-- Exterior Hero
('gal_yaris_ext_hero', 'biz_model_toyota_yaris', 'sec_auto_exterior', NULL, 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80', 
 'Toyota Yaris Exterior Design', 'التصميم الخارجي الأنيق لتويوتا ياريس',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- Exterior Headlights
('gal_yaris_ext_lights', 'biz_model_toyota_yaris', 'sec_auto_exterior', 'headlights', 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 
 'LED Headlights with DRL', 'مصابيح أمامية LED مع إضاءة نهارية مدمجة',
 '{"watermark":"autofyon.com","animation":"fade","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 2),

-- Exterior Wheels
('gal_yaris_ext_wheels', 'biz_model_toyota_yaris', 'sec_auto_exterior', 'wheels', 'sec_auto_exterior', 
 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 
 '16-inch Sport Alloy Wheels', 'جنوط ألومنيوم رياضية 16 بوصة بلونين',
 '{"watermark":"autofyon.com","animation":"zoom","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 3),

-- Interior Overview
('gal_yaris_int_hero', 'biz_model_toyota_yaris', 'sec_auto_interior', NULL, 'sec_auto_interior', 
 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80', 
 'Modern Cockpit & Upholstery', 'مقصورة قيادة عصرية ومقاعد مريحة',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.45}', 'carousel', 1, 1, 'approved', 1),

-- Interior Seating Material
('gal_yaris_int_seats', 'biz_model_toyota_yaris', 'sec_auto_interior', 'seating_material', 'sec_auto_interior', 
 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 
 'Premium Fabric Seating with Dual Stitching', 'فرش قماش فاخر مع تطريز دقيق ومساند رأس قابلة للتعديل',
 '{"watermark":"autofyon.com","animation":"fade","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 2),

-- Technology Infotainment Display
('gal_yaris_tech_screen', 'biz_model_toyota_yaris', 'sec_auto_technology', 'infotainment_size_in', 'sec_auto_technology', 
 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1400&q=80', 
 '9.0-inch Touchscreen with Wireless Apple CarPlay', 'شاشة لمس 9.0 بوصة تدعم Apple CarPlay و Android Auto',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1),

-- Engine Dynamic Force 1.5L
('gal_yaris_engine_bay', 'biz_model_toyota_yaris', 'sec_auto_engine', 'engine_type', 'sec_auto_engine', 
 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1400&q=80', 
 '1.5L 3-Cylinder Dynamic Force Engine 123hp', 'محرك ديناميك فورس 1.5 لتر اقتصادي بقوة 123 حصان',
 '{"watermark":"Toyota · autofyon.com","animation":"fade","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1),

-- Safety Toyota Safety Sense
('gal_yaris_safety_adas', 'biz_model_toyota_yaris', 'sec_auto_safety', 'adas_suite', 'sec_auto_safety', 
 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1400&q=80', 
 'Toyota Safety Sense Active Camera and Radar', 'باقة أنظمة الأمان الذكية والمساعدة على الطريق TSS',
 '{"watermark":"Toyota · autofyon.com","animation":"kenburns","overlayOpacity":0.5}', 'carousel', 1, 1, 'approved', 1);
