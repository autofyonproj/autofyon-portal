-- ========================================================
-- Brand Ingestion: Audi (أودي)
-- Generated: 2026-11-16 20:53:34
-- ========================================================

-- 1. Register / Update Brand Node
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_brand_audi',
  'Audi',
  'أودي',
  'audi',
  'vehicle_brand',
  'automotive',
  NULL,
  '/audi',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"brand_origin":"Germany","official_website":"https://www.audi-eg.com/en/"}}'
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
  'biz_dist_eatc_audi',
  'Egyptian Automotive & Trading Co. - Audi',
  'الشركة المصرية التجارية - أودي',
  'eatc-audi',
  'main_agency',
  'automotive',
  NULL,
  '/eatc-audi',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_vendor_identity":{"company_name":"Egyptian Automotive & Trading Co. - Audi","company_name_ar":"الشركة المصرية التجارية - أودي","phone":null,"website":"https://www.audi-eg.com/en/","official_brands":["Audi"]}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- ── Model: Audi A6 Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_a6',
  'A6 Sedan',
  'أودي A6 سيدان',
  'audi-a6',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-a6',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"A6 Sedan","model_name_ar":"أودي A6 سيدان","official_specs":{"front_passenger_display_inches":10.9,"roof":"Panoramic glass roof with nine electrically dimmable segments","engine":"2.0L TFSI inline 4-cylinder petrol","displacement_cc":1984,"power_hp":190,"torque_nm":320,"transmission":"7-speed S tronic","drivetrain":"FWD","acceleration_0_100_s":7.9,"top_speed_kmh":237,"engine_type":"Petrol","cylinders":4,"transmission_type":"DCT","zero_to_100_s":7.9,"roof_type":"Panoramic glass roof (nine electrically dimmable segments)","roof_type_ar":"سقف زجاجي بانورامي (تسع مناطق قابلة للتعتيم كهربائياً)","climate_zones":4},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/A6.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1984,"cylinders":4,"transmission_type":"DCT","drivetrain":"FWD","power_hp":190,"torque_nm":320,"zero_to_100_s":7.9,"top_speed_kmh":237},"sec_auto_exterior":{"roof_type":"Panoramic glass roof (nine electrically dimmable segments)","roof_type_ar":"سقف زجاجي بانورامي (تسع مناطق قابلة للتعتيم كهربائياً)"},"sec_auto_comfort":{"climate_zones":4},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/A6.pdf"}}'
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
  'edge_biz_model_audi_audi_a6_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_a6',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_a6 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_a6';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a6_1',
  'biz_model_audi_audi_a6',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:789818af-c13f-43a8-81ea-14efcf354674/as/A6_2024_7603_without_cast-S.jpg?width=768',
  'Audi A6 Sedan - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/a6/a6-sedan/"}',
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
  'gal_audi_audi-a6_2',
  'biz_model_audi_audi_a6',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/117234/images/a47dc8f5ed1c73ddfeed0370a8cfe20efcca640d/A232492_web_1440.jpeg?1740748854',
  'Audi A6 Sedan (until 2025), static photo, Chronos grey metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/audi-a6-40"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a6_3',
  'biz_model_audi_audi_a6',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/117241/images/adacc08cbc00db52fcd8bf0a612ac5db8ae488c4/A232499_web_1440.jpeg?1742827238',
  'Audi A6 Sedan (until 2025), dynamic photo, Chronos grey metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/audi-a6-40"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi A3 Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_a3_sedan',
  'A3 Sedan',
  'أودي A3 سيدان',
  'audi-a3-sedan',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-a3-sedan',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"A3 Sedan","model_name_ar":"أودي A3 سيدان","official_specs":{"infotainment_display_inches":10.1,"drive_select":"Audi drive select","engine":"1.4L TFSI inline 4-cylinder petrol","displacement_cc":1395,"power_hp":150,"torque_nm":250,"transmission":"8-speed automatic","drivetrain":"FWD","acceleration_0_100_s":9,"top_speed_kmh":231,"engine_type":"Petrol","cylinders":4,"transmission_type":"Automatic","zero_to_100_s":9,"climate_zones":3,"infotainment_size_in":10.1},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A3_Sedan.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1395,"cylinders":4,"transmission_type":"Automatic","drivetrain":"FWD","power_hp":150,"torque_nm":250,"zero_to_100_s":9,"top_speed_kmh":231},"sec_auto_comfort":{"climate_zones":3},"sec_auto_technology":{"infotainment_size_in":10.1},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A3_Sedan.pdf"}}'
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
  'edge_biz_model_audi_audi_a3_sedan_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_a3_sedan',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_a3_sedan to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_a3_sedan';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a3-sedan_1',
  'biz_model_audi_audi_a3_sedan',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:4e43ff91-c4e3-43ea-af86-5732a4dedf29/as/A3%20Sedan.jpg?preferwebp=true',
  'Audi A3 Sedan - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/a3/a3-sedan/"}',
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
  'gal_audi_audi-a3-sedan_2',
  'biz_model_audi_audi_a3_sedan',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/124331/images/2577edd9bbd228d4efe873b68aadff64d01c6e56/A242220_web_1440.jpg?1780997458',
  'Audi A3 Sedan, static photo, Progressive red',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a3-sedan_3',
  'biz_model_audi_audi_a3_sedan',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/124332/images/4e283e4917b36560a792d4f9baf51f48e5888136/A242221_web_1440.jpg?1780997331',
  'Audi A3 Sedan, static photo, Progressive red',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi A3 Sportback ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_a3_sportback',
  'A3 Sportback',
  'أودي A3 سبورتباك',
  'audi-a3-sportback',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-a3-sportback',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Hatchback","model_name":"A3 Sportback","model_name_ar":"أودي A3 سبورتباك","official_specs":{"engine":"1.4L TFSI inline 4-cylinder petrol","displacement_cc":1395,"power_hp":150,"torque_nm":250,"transmission":"8-speed automatic","drivetrain":"FWD","acceleration_0_100_s":9,"top_speed_kmh":226,"engine_type":"Petrol","cylinders":4,"transmission_type":"Automatic","zero_to_100_s":9,"climate_zones":3},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A3_Sportback.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1395,"cylinders":4,"transmission_type":"Automatic","drivetrain":"FWD","power_hp":150,"torque_nm":250,"zero_to_100_s":9,"top_speed_kmh":226},"sec_auto_comfort":{"climate_zones":3},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A3_Sportback.pdf"}}'
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
  'edge_biz_model_audi_audi_a3_sportback_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_a3_sportback',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_a3_sportback to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_a3_sportback';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a3-sportback_1',
  'biz_model_audi_audi_a3_sportback',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:368c72d8-662b-4fe7-8f9f-2dbb879ae2e0/as/A3-SportB.jpg?preferwebp=true',
  'Audi A3 Sportback - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/a3/a3-sportback/"}',
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
  'gal_audi_audi-a3-sportback_2',
  'biz_model_audi_audi_a3_sportback',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/123857/images/ffd3942e0ddca9cfd29c6bae63c7af384db1cc85/A241746_web_1440.jpg?1781506357',
  'Audi A3 Sportback, dynamic photo, District Green Metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a3-sportback_3',
  'biz_model_audi_audi_a3_sportback',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/123846/images/7291b2af003cae267a3cc0b3178247635ca48659/A241735_web_1440.jpg?1781506961',
  'Audi A3 Sportback, static photo, District Green Metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a3-sportback_4',
  'biz_model_audi_audi_a3_sportback',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/123843/images/3cfcb8f656c6a59bfbd8eeab663b197761b9cfd7/A241732_web_1440.jpg?1781507294',
  'Audi A3 Sportback, static photo, District Green Metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917"}',
  NULL,
  NULL,
  0,
  3,
  'both',
  1,
  'approved',
  'image'
);

-- ── Model: Audi A5 Sedan ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_a5',
  'A5 Sedan',
  'أودي A5 سيدان',
  'audi-a5',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-a5',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"Sedan","model_name":"A5 Sedan","model_name_ar":"أودي A5 سيدان","official_specs":{"engine":"2.0L TFSI inline 4-cylinder petrol","displacement_cc":1984,"power_hp":196,"torque_nm":340,"transmission":"7-speed S tronic","drivetrain":"FWD","acceleration_0_100_s":7.8,"top_speed_kmh":246,"engine_type":"Petrol","cylinders":4,"transmission_type":"DCT","zero_to_100_s":7.8},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A5.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1984,"cylinders":4,"transmission_type":"DCT","drivetrain":"FWD","power_hp":196,"torque_nm":340,"zero_to_100_s":7.8,"top_speed_kmh":246},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/A5.pdf"}}'
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
  'edge_biz_model_audi_audi_a5_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_a5',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_a5 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_a5';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a5_1',
  'biz_model_audi_audi_a5',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/125085/images/886d3496b8a5d988af9a277c21d3079672812d06/A242974_blog.jpg?1758709466',
  'Audi A5 Sedan - official Audi model photo',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/a5/a5-sedan/"}',
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
  'gal_audi_audi-a5_2',
  'biz_model_audi_audi_a5',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/126606/images/62cbbc8caf5268f5262e2800ffd81065283d1299/A244454_web_1440.jpg?1754651542',
  'Audi A5 Sedan, dynamic photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/impressive-appearance-the-new-audi-a5-family-on-the-cote-dazur-16260"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-a5_3',
  'biz_model_audi_audi_a5',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/126607/images/7beacee8083226bd6b34b32d345978d21a39d92a/A244455_web_1440.jpg?1729589334',
  'Audi A5 Sedan, static photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/impressive-appearance-the-new-audi-a5-family-on-the-cote-dazur-16260"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi Q3 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_q3',
  'Q3',
  'أودي Q3',
  'audi-q3',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-q3',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"Q3","model_name_ar":"أودي Q3","official_specs":{"engine":"35 TFSI 1.4T","displacement_cc":1395,"power_kw":110,"power_hp":150,"power_rpm":"5000-6000 rpm","torque_nm":250,"torque_rpm":"1500-3500 rpm","transmission":"6-speed S tronic","acceleration_0_100_s":9.2,"fuel_consumption_combined_l_100km":"5.6-6.0","fuel_tank_l":58,"trunk_capacity_l":530,"weight_kg":1605,"engine_type":"Petrol","engine_type_ar":"بنزين","cylinders":4,"transmission_type":"DCT","transmission_type_ar":"ناقل حركة S tronic ثنائي القابض من 6 سرعات","drivetrain":"FWD","zero_to_100_s":9.2,"kerb_weight_kg":1605,"climate_zones":2},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/Q3.pdf"},"sec_auto_specs":{"engine_type":"Petrol","engine_type_ar":"بنزين","displacement_cc":1395,"cylinders":4,"transmission_type":"DCT","transmission_type_ar":"ناقل حركة S tronic ثنائي القابض من 6 سرعات","drivetrain":"FWD","power_hp":150,"torque_nm":250,"zero_to_100_s":9.2,"kerb_weight_kg":1605},"sec_auto_comfort":{"climate_zones":2},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/Q3.pdf"}}'
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
  'edge_biz_model_audi_audi_q3_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_q3',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_trim_audi-q3_advanced',
  'Advanced',
  'أدفانسد',
  'advanced',
  'vehicle_trim',
  'automotive',
  'biz_model_audi_audi_q3',
  '/audi/audi-q3/advanced',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"Advanced","trim_name_ar":"أدفانسد"}}'
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
  'biz_trim_audi-q3_s_line',
  'S line',
  'إس لاين',
  's-line',
  'vehicle_trim',
  'automotive',
  'biz_model_audi_audi_q3',
  '/audi/audi-q3/s-line',
  'embedded',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_listing_price":{"official_price_egp":null,"currency":"EGP"},"sec_1_identity":{"trim_name":"S line","trim_name_ar":"إس لاين"}}'
) ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  parent_business_id = excluded.parent_business_id,
  published = 1,
  custom_data = json_patch(businesses.custom_data, excluded.custom_data);

-- Reset old gallery for biz_model_audi_audi_q3 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_q3';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q3_1',
  'biz_model_audi_audi_q3',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:6121ee18-558c-4b74-a719-ac90b5de11ba/as/Q3.jpg?preferwebp=true',
  'Audi Q3 - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/q3/q3/"}',
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
  'gal_audi_audi-q3_2',
  'biz_model_audi_audi_q3',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/65177/images/2c69584e32129b5daecc7cec20ac5b141b7a873c/A188617_web_1440.jpg?1748952744',
  'Audi Q3 (until 2025), dynamic photo, Florett silver',
  NULL,
  '{"source_url":"https://www.audi.com/en/images/detail/audi-q3-until-2025-65177"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q3_3',
  'biz_model_audi_audi_q3',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/65167/images/f5e9afd95ff0153e1dffa782103ee8af2fb214d3/A188607_web_1440.jpg?1750085569',
  'Audi Q3 (until 2025), static photo, Turbo blue',
  NULL,
  '{"source_url":"https://www.audi.com/en/images/detail/audi-q3-until-2025-65167"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi Q3 Sportback ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_q3_sportback',
  'Q3 Sportback',
  'أودي Q3 سبورتباك',
  'audi-q3-sportback',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-q3-sportback',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"Q3 Sportback","model_name_ar":"أودي Q3 سبورتباك","official_specs":{"engine":"1.4L TFSI inline 4-cylinder petrol","displacement_cc":1395,"power_hp":150,"torque_nm":250,"transmission":"6-speed S tronic","drivetrain":"FWD","acceleration_0_100_s":9.2,"fuel_consumption_combined_l_100km":"5.6-6.0","engine_type":"Petrol","cylinders":4,"transmission_type":"DCT","transmission_type_ar":"ناقل حركة S tronic ثنائي القابض من 6 سرعات","zero_to_100_s":9.2,"climate_zones":2},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/Q3SB.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1395,"cylinders":4,"transmission_type":"DCT","transmission_type_ar":"ناقل حركة S tronic ثنائي القابض من 6 سرعات","drivetrain":"FWD","power_hp":150,"torque_nm":250,"zero_to_100_s":9.2},"sec_auto_comfort":{"climate_zones":2},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/Q3SB.pdf"}}'
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
  'edge_biz_model_audi_audi_q3_sportback_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_q3_sportback',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_q3_sportback to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_q3_sportback';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q3-sportback_1',
  'biz_model_audi_audi_q3_sportback',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:d14820d4-240f-45b5-ae6f-6c5ea74dc5d3/as/Q3SB.jpg?preferwebp=true',
  'Audi Q3 Sportback - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/q3/q3-sportback/"}',
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
  'gal_audi_audi-q3-sportback_2',
  'biz_model_audi_audi_q3_sportback',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/83706/images/a4381034b261cc8e9f26ba2c7526efd78d0812a1/A1911587_web_1440.jpg?1698390691',
  'Audi Q3 Sportback (until 2025), static photo, Dew silver',
  NULL,
  '{"source_url":"https://www.audi.com/en/images/detail/audi-q3-sportback-until-2025-83706"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q3-sportback_3',
  'biz_model_audi_audi_q3_sportback',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/83724/images/11c707438ca4f5c9782c96bcd07878a4b9406b21/A1911605_web_1440.jpg?1698390781',
  'Audi Q3 Sportback (until 2025), dynamic photo, Dew silver',
  NULL,
  '{"source_url":"https://www.audi.com/en/images/detail/audi-q3-sportback-until-2025-83724"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q3-sportback_4',
  'biz_model_audi_audi_q3_sportback',
  'sec_auto_interior',
  'https://uploads.audi.com/system/production/media/83750/images/db616b99496142146273e1f896a35502879622f7/A1911631_web_1440.jpg?1698390951',
  'Audi Q3 Sportback (until 2025), cockpit photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/images/detail/audi-q3-sportback-until-2025-83750"}',
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi Q7 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_q7',
  'Q7',
  'أودي Q7',
  'audi-q7',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-q7',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"Q7","model_name_ar":"أودي Q7","official_specs":{"engine":"2.0L TFSI inline 4-cylinder petrol","displacement_cc":1984,"power_hp":252,"torque_nm":370,"transmission":"8-speed Tiptronic","drivetrain":"AWD","acceleration_0_100_s":7.3,"top_speed_kmh":231,"engine_type":"Petrol","cylinders":4,"transmission_type":"Automatic","zero_to_100_s":7.3},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/Q7.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":1984,"cylinders":4,"transmission_type":"Automatic","drivetrain":"AWD","power_hp":252,"torque_nm":370,"zero_to_100_s":7.3,"top_speed_kmh":231},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/nemo/eg/Brochures/Q7.pdf"}}'
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
  'edge_biz_model_audi_audi_q7_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_q7',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_q7 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_q7';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q7_1',
  'biz_model_audi_audi_q7',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/132119/images/1ecdae31d8d07dfb86551dfae9d0f6aac5c4072e/A262960_blog.jpg?1780664806',
  'Audi Q7 - official Audi model photo',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/q7/q7/"}',
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
  'gal_audi_audi-q7_2',
  'biz_model_audi_audi_q7',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/122647/images/c0f44273ac21448d6f60aa0ccd398e9c738c660e/A240569_web_1440.jpg?1780417136',
  'Audi Q7 (until 2026), dynamic photo, Waitomo blue metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/strong-in-design-comfort-and-technologythe-revised-audi-q7-15849"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q7_3',
  'biz_model_audi_audi_q7',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/122629/images/628a9f1fcbb7a3e1e557f87cec46034128148dc4/A240551_web_1440.jpg?1780417136',
  'Audi Q7 (until 2026), static photo, Waitomo blue metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/strong-in-design-comfort-and-technologythe-revised-audi-q7-15849"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q7_4',
  'biz_model_audi_audi_q7',
  'sec_auto_interior',
  'https://uploads.audi.com/system/production/media/122638/images/8fa9fab0770da1b19f189198f284d262d8f9e83e/A240560_web_1440.jpg?1780417181',
  'Audi Q7 (until 2026), cockpit photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/strong-in-design-comfort-and-technologythe-revised-audi-q7-15849"}',
  NULL,
  NULL,
  0,
  3,
  'body',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q7_5',
  'biz_model_audi_audi_q7',
  'sec_auto_interior',
  'https://uploads.audi.com/system/production/media/122639/images/135528b47e034c7958112afda424b878b5f96d09/A240561_web_1440.jpg?1780417188',
  'Audi Q7 (until 2026), interior photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/strong-in-design-comfort-and-technologythe-revised-audi-q7-15849"}',
  NULL,
  NULL,
  0,
  4,
  'body',
  1,
  'approved',
  'image'
);

-- ── Model: Audi Q8 ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_q8',
  'Q8',
  'أودي Q8',
  'audi-q8',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-q8',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"Q8","model_name_ar":"أودي Q8","official_specs":{"engine":"3.0L TFSI V6 petrol","displacement_cc":2995,"power_hp":340,"torque_nm":500,"transmission":"8-speed Tiptronic","drivetrain":"AWD","acceleration_0_100_s":5.6,"top_speed_kmh":250,"engine_type":"Petrol","cylinders":6,"transmission_type":"Automatic","zero_to_100_s":5.6},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/Q8.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":2995,"cylinders":6,"transmission_type":"Automatic","drivetrain":"AWD","power_hp":340,"torque_nm":500,"zero_to_100_s":5.6,"top_speed_kmh":250},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/Q8.pdf"}}'
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
  'edge_biz_model_audi_audi_q8_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_q8',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_q8 to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_q8';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-q8_1',
  'biz_model_audi_audi_q8',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/119187/images/211cf27bb4f61459be737cff363a2e2cd98178c6/A234443_web_1440.jpg?1698538638',
  'Audi Q8, static photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/expressive-design-and-new-lighting-technology-the-upgraded-audi-q8-15555"}',
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
  'gal_audi_audi-q8_2',
  'biz_model_audi_audi_q8',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/120841/images/7924cfa8dc22b4b049d02f53a2d8ce5953c0d29e/A236042_web_1440.jpg?1733132477',
  'Audi Q8, static photo, Audi exclusive paint finish',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/expressive-design-and-new-lighting-technology-the-upgraded-audi-q8-15555"}',
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
  'gal_audi_audi-q8_3',
  'biz_model_audi_audi_q8',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/120842/images/a0a64bbcb48a1e7d41fe1fbc348b6a9ae2cb7734/A236043_web_1440.jpg?1733132559',
  'Audi Q8, dynamic photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/expressive-design-and-new-lighting-technology-the-upgraded-audi-q8-15555"}',
  NULL,
  NULL,
  0,
  2,
  'both',
  1,
  'approved',
  'image'
);

-- ── Model: Audi RS Q8 SUV performance ─────────────────────────────
INSERT INTO businesses (
  id, name, name_ar, slug, type_id, market_id, parent_business_id, path,
  minisite_mode, url_style, subscription_tier, status, published, custom_data
) VALUES (
  'biz_model_audi_audi_rs_q8_performance',
  'RS Q8 SUV performance',
  'أودي RS Q8 SUV بيرفورمانس',
  'audi-rs-q8-performance',
  'vehicle_model',
  'automotive',
  'biz_brand_audi',
  '/audi/audi-rs-q8-performance',
  'standalone',
  'root',
  'enterprise',
  'active',
  1,
  '{"sec_1_identity":{"category":"SUV","model_name":"RS Q8 SUV performance","model_name_ar":"أودي RS Q8 SUV بيرفورمانس","official_specs":{"engine":"4.0L TFSI V8 petrol","displacement_cc":3996,"power_hp":640,"torque_nm":850,"transmission":"8-speed Tiptronic","drivetrain":"AWD","acceleration_0_100_s":3.6,"top_speed_kmh":305,"engine_type":"Petrol","cylinders":8,"transmission_type":"Automatic","zero_to_100_s":3.6},"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/RS_Q8_p.pdf"},"sec_auto_specs":{"engine_type":"Petrol","displacement_cc":3996,"cylinders":8,"transmission_type":"Automatic","drivetrain":"AWD","power_hp":640,"torque_nm":850,"zero_to_100_s":3.6,"top_speed_kmh":305},"sec_overview":{"brochure_url":"https://oneaudi-falcon-asset-urls.prod.renderer.one.audi/api/assets/p123727-e1214567/publish?path=/content/dam/country/eg/assets/brochures/RS_Q8_p.pdf"}}'
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
  'edge_biz_model_audi_audi_rs_q8_performance_sold_by_biz_dist_eatc_audi',
  'biz_model_audi_audi_rs_q8_performance',
  'biz_dist_eatc_audi',
  'sold_by',
  1
) ON CONFLICT(from_business_id, to_business_id, relation_type) DO UPDATE SET is_primary = 1;

-- Reset old gallery for biz_model_audi_audi_rs_q8_performance to prevent dangling assets
DELETE FROM vendor_gallery WHERE business_id = 'biz_model_audi_audi_rs_q8_performance';
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-rs-q8-performance_1',
  'biz_model_audi_audi_rs_q8_performance',
  'sec_1_identity',
  'https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:2b693ca6-3d7a-4912-94d7-a2957ffe31c6/as/RS_Q8_Performance.jpg?preferwebp=true',
  'Audi RS Q8 SUV performance - Egypt model image',
  NULL,
  '{"source_url":"https://www.audi-eg.com/en/models/q8/rsq8/"}',
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
  'gal_audi_audi-rs-q8-performance_2',
  'biz_model_audi_audi_rs_q8_performance',
  'sec_1_identity',
  'https://uploads.audi.com/system/production/media/124876/images/981d5918c35b973124f4226df91a5134cf139744/A242765_web_1440.jpg?1718971817',
  'Audi RS Q8 and RS Q8 performance, official photo',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/audi-sport-gmbhs-most-powerful-suvs-the-new-rs-q8-performance-and-the-updated-rs-q8-16058"}',
  NULL,
  NULL,
  0,
  1,
  'both',
  1,
  'approved',
  'image'
);
INSERT INTO vendor_gallery (
  id, business_id, section_id, url, caption, caption_ar, media_data, field_key, field_section_id, is_hero, display_order, placement, show_on_minisite, approval_status, media_type
) VALUES (
  'gal_audi_audi-rs-q8-performance_3',
  'biz_model_audi_audi_rs_q8_performance',
  'sec_auto_exterior',
  'https://uploads.audi.com/system/production/media/126683/images/296e36650a2beda38057ae623a72c7d3154e78b2/A244531_web_1440.jpg?1730283249',
  'Audi RS Q8 performance, dynamic photo, Chilli red metallic',
  NULL,
  '{"source_url":"https://www.audi.com/en/media-releases/audi-sport-gmbhs-most-powerful-suvs-the-new-rs-q8-performance-and-the-updated-rs-q8-16058"}',
  NULL,
  NULL,
  0,
  2,
  'body',
  1,
  'approved',
  'image'
);
