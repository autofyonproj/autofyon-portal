-- =========================================================================
-- MG ZS: COMPLETE INTERIOR & EXTERIOR ENRICHMENT WITH CAROUSEL BINDINGS
-- =========================================================================

-- 1. Ensure sec_auto_interior in custom_data has all schema fields (seating_material, ambient_lighting, sunroof)
UPDATE businesses
SET custom_data = json_set(
  custom_data,
  '$.sec_auto_interior.seating_material', 'Leather',
  '$.sec_auto_interior.seating_material_ar', 'فرش جلد فاخر بلونين مع تطريز رياضي وتعديل كهربائي',
  '$.sec_auto_interior.ambient_lighting', 1,
  '$.sec_auto_interior.sunroof', 'Electric',
  '$.sec_auto_interior.sunroof_ar', 'فتحة سقف بانوراما كهربائية كاملة'
)
WHERE id = 'biz_model_mg_mg_zs' OR slug = 'mg-zs';

-- 2. Insert Interior & Exterior slides into vendor_gallery
INSERT INTO vendor_gallery (
  id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order
) VALUES
-- Interior Hero (Cockpit & Dashboard)
('gal_mgzs_int_hero', 'biz_model_mg_mg_zs', 'sec_auto_interior', NULL, 'sec_auto_interior',
 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
 'MG ZS Driver-Centric Smart Cabin', 'مقصورة قيادة إم جي ZS العصرية مع عجلة قيادة رياضية وشاشة متطورة',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.4}', 'carousel', 1, 1, 'approved', 1),

-- Interior Seating Binding (seating_material)
('gal_mgzs_int_seats', 'biz_model_mg_mg_zs', 'sec_auto_interior', 'seating_material', 'sec_auto_interior',
 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
 'Two-Tone Ergonomic Leather Seats', 'مقاعد مريحة مكسوة بالجلد الفاخر بلونين مع مسند يد وسطي',
 '{"watermark":"MG · autofyon.com","animation":"zoom","aspectRatio":"21/9","overlayOpacity":0.45}', 'carousel', 0, 1, 'approved', 2),

-- Interior Sunroof Binding (sunroof)
('gal_mgzs_int_roof', 'biz_model_mg_mg_zs', 'sec_auto_interior', 'sunroof', 'sec_auto_interior',
 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85',
 'Electric Panoramic Sunroof', 'فتحة سقف كهربائية زجاجية واسعة تمنح المقصورة إضاءة طبيعية',
 '{"watermark":"autofyon.com","animation":"fade","aspectRatio":"21/9","overlayOpacity":0.5}', 'carousel', 0, 1, 'approved', 3),

-- Exterior Hero (Front View)
('gal_mgzs_ext_hero', 'biz_model_mg_mg_zs', 'sec_auto_exterior', NULL, 'sec_auto_exterior',
 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=85',
 'MG ZS Dynamic Front Grille & LED', 'الواجهة الهجومية الجريئة لكروس أوفر إم جي ZS مع مصابيح LED',
 '{"watermark":"MG · autofyon.com","animation":"kenburns","aspectRatio":"21/9","overlayOpacity":0.4}', 'carousel', 1, 1, 'approved', 1)

ON CONFLICT(id) DO UPDATE SET
  url = excluded.url,
  media_data = excluded.media_data,
  caption_ar = excluded.caption_ar;
