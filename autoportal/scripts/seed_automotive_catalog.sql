INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_toyota', 'Toyota', 'تويوتا', 'toyota', 'vehicle_brand', 'automotive', NULL, '/toyota', 'standalone', '{"sec_1_identity":{"business_name":"Toyota","business_name_ar":"تويوتا","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/toyota.png","country":"Japan","country_ar":"اليابان","tagline_ar":"رمز الاعتمادية والجودة العالية في مصر"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_toyota', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/toyota.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_corolla', 'Corolla', 'كورولا', 'corolla', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/corolla', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Corolla","business_name_ar":"تويوتا كورولا","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_fortuner', 'Fortuner', 'فورتشنر', 'fortuner', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/fortuner', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Fortuner","business_name_ar":"تويوتا فورتشنر","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_yaris', 'Yaris', 'ياريس', 'yaris', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/yaris', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Yaris","business_name_ar":"تويوتا ياريس","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_land_cruiser', 'Land Cruiser', 'لاند كروزر', 'land-cruiser', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/land-cruiser', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Land Cruiser","business_name_ar":"تويوتا لاند كروزر","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_belta', 'Belta', 'بيلتا', 'belta', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/belta', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Belta","business_name_ar":"تويوتا بيلتا","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_rumion', 'Rumion', 'روميون', 'rumion', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/rumion', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Rumion","business_name_ar":"تويوتا روميون","category":"MPV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_camry', 'Camry', 'كامري', 'camry', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/camry', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Camry","business_name_ar":"تويوتا كامري","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_rav4', 'RAV4', 'راف فور', 'rav4', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/rav4', 'standalone', '{"sec_1_identity":{"business_name":"Toyota RAV4","business_name_ar":"تويوتا راف فور","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_toyota_hilux', 'Hilux', 'هايلوكس', 'hilux', 'vehicle_model', 'automotive', 'biz_brand_toyota', '/toyota/hilux', 'standalone', '{"sec_1_identity":{"business_name":"Toyota Hilux","business_name_ar":"تويوتا هايلوكس","category":"Pickup"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_mercedes_benz', 'Mercedes-Benz', 'مرسيدس بنز', 'mercedes-benz', 'vehicle_brand', 'automotive', NULL, '/mercedes-benz', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz","business_name_ar":"مرسيدس بنز","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mercedes-benz.png","country":"Germany","country_ar":"ألمانيا","tagline_ar":"قمة الفخامة والأداء الألماني المتطور"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_mercedes_benz', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mercedes-benz.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_c_class', 'C-Class', 'سي كلاس (C180 / C200)', 'c-class', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/c-class', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz C-Class","business_name_ar":"مرسيدس بنز سي كلاس (C180 / C200)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_e_class', 'E-Class', 'إي كلاس (E200 / E300)', 'e-class', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/e-class', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz E-Class","business_name_ar":"مرسيدس بنز إي كلاس (E200 / E300)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_s_class', 'S-Class', 'إس كلاس (S500)', 's-class', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/s-class', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz S-Class","business_name_ar":"مرسيدس بنز إس كلاس (S500)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_glc', 'GLC', 'جي إل سي', 'glc', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/glc', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz GLC","business_name_ar":"مرسيدس بنز جي إل سي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_cla', 'CLA', 'سي إل إيه', 'cla', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/cla', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz CLA","business_name_ar":"مرسيدس بنز سي إل إيه","category":"Coupe"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_gla', 'GLA', 'جي إل إيه', 'gla', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/gla', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz GLA","business_name_ar":"مرسيدس بنز جي إل إيه","category":"Crossover"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_gle', 'GLE', 'جي إل إي', 'gle', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/gle', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz GLE","business_name_ar":"مرسيدس بنز جي إل إي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mercedes_benz_g_class', 'G-Class', 'جي كلاس (G63)', 'g-class', 'vehicle_model', 'automotive', 'biz_brand_mercedes_benz', '/mercedes-benz/g-class', 'standalone', '{"sec_1_identity":{"business_name":"Mercedes-Benz G-Class","business_name_ar":"مرسيدس بنز جي كلاس (G63)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_bmw', 'BMW', 'بي إم دابليو', 'bmw', 'vehicle_brand', 'automotive', NULL, '/bmw', 'standalone', '{"sec_1_identity":{"business_name":"BMW","business_name_ar":"بي إم دابليو","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/bmw.png","country":"Germany","country_ar":"ألمانيا","tagline_ar":"متعة القيادة الرياضية الفاخرة المطلقة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_bmw', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/bmw.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_3_series', '3 Series', 'الفئة الثالثة (320i)', '3-series', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/3-series', 'standalone', '{"sec_1_identity":{"business_name":"BMW 3 Series","business_name_ar":"بي إم دابليو الفئة الثالثة (320i)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_5_series', '5 Series', 'الفئة الخامسة (520i)', '5-series', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/5-series', 'standalone', '{"sec_1_identity":{"business_name":"BMW 5 Series","business_name_ar":"بي إم دابليو الفئة الخامسة (520i)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_7_series', '7 Series', 'الفئة السابعة (740i)', '7-series', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/7-series', 'standalone', '{"sec_1_identity":{"business_name":"BMW 7 Series","business_name_ar":"بي إم دابليو الفئة السابعة (740i)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_x1', 'X1', 'إكس 1', 'x1', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/x1', 'standalone', '{"sec_1_identity":{"business_name":"BMW X1","business_name_ar":"بي إم دابليو إكس 1","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_x3', 'X3', 'إكس 3', 'x3', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/x3', 'standalone', '{"sec_1_identity":{"business_name":"BMW X3","business_name_ar":"بي إم دابليو إكس 3","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_x5', 'X5', 'إكس 5', 'x5', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/x5', 'standalone', '{"sec_1_identity":{"business_name":"BMW X5","business_name_ar":"بي إم دابليو إكس 5","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_x6', 'X6', 'إكس 6', 'x6', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/x6', 'standalone', '{"sec_1_identity":{"business_name":"BMW X6","business_name_ar":"بي إم دابليو إكس 6","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_bmw_x7', 'X7', 'إكس 7', 'x7', 'vehicle_model', 'automotive', 'biz_brand_bmw', '/bmw/x7', 'standalone', '{"sec_1_identity":{"business_name":"BMW X7","business_name_ar":"بي إم دابليو إكس 7","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_hyundai', 'Hyundai', 'هيونداي', 'hyundai', 'vehicle_brand', 'automotive', NULL, '/hyundai', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai","business_name_ar":"هيونداي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/hyundai.png","country":"South Korea","country_ar":"كوريا الجنوبية","tagline_ar":"السيارة الأكثر انتشاراً وثقة في السوق المصري"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_hyundai', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/hyundai.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_tucson', 'Tucson', 'توسان', 'tucson', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/tucson', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Tucson","business_name_ar":"هيونداي توسان","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_elantra_cn7', 'Elantra CN7', 'إلنترا CN7', 'elantra-cn7', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/elantra-cn7', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Elantra CN7","business_name_ar":"هيونداي إلنترا CN7","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_elantra_hd', 'Elantra HD', 'إلنترا HD', 'elantra-hd', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/elantra-hd', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Elantra HD","business_name_ar":"هيونداي إلنترا HD","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_accent_rb', 'Accent RB', 'أكسنت RB', 'accent-rb', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/accent-rb', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Accent RB","business_name_ar":"هيونداي أكسنت RB","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_creta', 'Creta', 'كريتا', 'creta', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/creta', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Creta","business_name_ar":"هيونداي كريتا","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_bayon', 'Bayon', 'بايون', 'bayon', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/bayon', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Bayon","business_name_ar":"هيونداي بايون","category":"Crossover"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_hyundai_santa_fe', 'Santa Fe', 'سانتا في', 'santa-fe', 'vehicle_model', 'automotive', 'biz_brand_hyundai', '/hyundai/santa-fe', 'standalone', '{"sec_1_identity":{"business_name":"Hyundai Santa Fe","business_name_ar":"هيونداي سانتا في","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_kia', 'Kia', 'كيا', 'kia', 'vehicle_brand', 'automotive', NULL, '/kia', 'standalone', '{"sec_1_identity":{"business_name":"Kia","business_name_ar":"كيا","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/kia.png","country":"South Korea","country_ar":"كوريا الجنوبية","tagline_ar":"تصاميم عصرية وديناميكية مبتكرة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_kia', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/kia.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_sportage', 'Sportage', 'سبورتاج', 'sportage', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/sportage', 'standalone', '{"sec_1_identity":{"business_name":"Kia Sportage","business_name_ar":"كيا سبورتاج","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_cerato', 'Cerato', 'سيراتو / جراند سيراتو', 'cerato', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/cerato', 'standalone', '{"sec_1_identity":{"business_name":"Kia Cerato","business_name_ar":"كيا سيراتو / جراند سيراتو","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_seltos', 'Seltos', 'سيلتوس', 'seltos', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/seltos', 'standalone', '{"sec_1_identity":{"business_name":"Kia Seltos","business_name_ar":"كيا سيلتوس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_sorento', 'Sorento', 'سورينتو', 'sorento', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/sorento', 'standalone', '{"sec_1_identity":{"business_name":"Kia Sorento","business_name_ar":"كيا سورينتو","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_carens', 'Carens', 'كارنز', 'carens', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/carens', 'standalone', '{"sec_1_identity":{"business_name":"Kia Carens","business_name_ar":"كيا كارنز","category":"MPV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_pegas', 'Pegas', 'بيجاس', 'pegas', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/pegas', 'standalone', '{"sec_1_identity":{"business_name":"Kia Pegas","business_name_ar":"كيا بيجاس","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_kia_ev6', 'EV6', 'إي في 6 (كهربائية)', 'ev6', 'vehicle_model', 'automotive', 'biz_brand_kia', '/kia/ev6', 'standalone', '{"sec_1_identity":{"business_name":"Kia EV6","business_name_ar":"كيا إي في 6 (كهربائية)","category":"EV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_mg', 'MG', 'إم جي', 'mg', 'vehicle_brand', 'automotive', NULL, '/mg', 'standalone', '{"sec_1_identity":{"business_name":"MG","business_name_ar":"إم جي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mg.png","country":"United Kingdom / China","country_ar":"إنجلترا / الصين","tagline_ar":"العلامة الأسرع نمواً مع التكنولوجيا المتقدمة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_mg', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mg.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_zs', 'MG ZS', 'إم جي ZS', 'mg-zs', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-zs', 'standalone', '{"sec_1_identity":{"business_name":"MG MG ZS","business_name_ar":"إم جي إم جي ZS","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_5', 'MG 5', 'إم جي 5', 'mg-5', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-5', 'standalone', '{"sec_1_identity":{"business_name":"MG MG 5","business_name_ar":"إم جي إم جي 5","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_6', 'MG 6', 'إم جي 6', 'mg-6', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-6', 'standalone', '{"sec_1_identity":{"business_name":"MG MG 6","business_name_ar":"إم جي إم جي 6","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_rx5', 'MG RX5', 'إم جي RX5', 'mg-rx5', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-rx5', 'standalone', '{"sec_1_identity":{"business_name":"MG MG RX5","business_name_ar":"إم جي إم جي RX5","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_hs', 'MG HS', 'إم جي HS', 'mg-hs', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-hs', 'standalone', '{"sec_1_identity":{"business_name":"MG MG HS","business_name_ar":"إم جي إم جي HS","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_one', 'MG ONE', 'إم جي ONE', 'mg-one', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-one', 'standalone', '{"sec_1_identity":{"business_name":"MG MG ONE","business_name_ar":"إم جي إم جي ONE","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mg_mg_4', 'MG 4', 'إم جي 4 (كهربائية)', 'mg-4', 'vehicle_model', 'automotive', 'biz_brand_mg', '/mg/mg-4', 'standalone', '{"sec_1_identity":{"business_name":"MG MG 4","business_name_ar":"إم جي إم جي 4 (كهربائية)","category":"EV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_chery', 'Chery', 'شيري', 'chery', 'vehicle_brand', 'automotive', NULL, '/chery', 'standalone', '{"sec_1_identity":{"business_name":"Chery","business_name_ar":"شيري","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/chery.png","country":"China","country_ar":"الصين","tagline_ar":"سيارات الدفع الرباعي العائلية الرائدة في مصر"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_chery', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/chery.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chery_tiggo_7', 'Tiggo 7', 'تيجو 7', 'tiggo-7', 'vehicle_model', 'automotive', 'biz_brand_chery', '/chery/tiggo-7', 'standalone', '{"sec_1_identity":{"business_name":"Chery Tiggo 7","business_name_ar":"شيري تيجو 7","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chery_tiggo_8', 'Tiggo 8', 'تيجو 8 (7 راكب)', 'tiggo-8', 'vehicle_model', 'automotive', 'biz_brand_chery', '/chery/tiggo-8', 'standalone', '{"sec_1_identity":{"business_name":"Chery Tiggo 8","business_name_ar":"شيري تيجو 8 (7 راكب)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chery_tiggo_3', 'Tiggo 3', 'تيجو 3', 'tiggo-3', 'vehicle_model', 'automotive', 'biz_brand_chery', '/chery/tiggo-3', 'standalone', '{"sec_1_identity":{"business_name":"Chery Tiggo 3","business_name_ar":"شيري تيجو 3","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chery_tiggo_4_pro', 'Tiggo 4 Pro', 'تيجو 4 برو', 'tiggo-4-pro', 'vehicle_model', 'automotive', 'biz_brand_chery', '/chery/tiggo-4-pro', 'standalone', '{"sec_1_identity":{"business_name":"Chery Tiggo 4 Pro","business_name_ar":"شيري تيجو 4 برو","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chery_arrizo_5', 'Arrizo 5', 'أريزو 5', 'arrizo-5', 'vehicle_model', 'automotive', 'biz_brand_chery', '/chery/arrizo-5', 'standalone', '{"sec_1_identity":{"business_name":"Chery Arrizo 5","business_name_ar":"شيري أريزو 5","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_nissan', 'Nissan', 'نيسان', 'nissan', 'vehicle_brand', 'automotive', NULL, '/nissan', 'standalone', '{"sec_1_identity":{"business_name":"Nissan","business_name_ar":"نيسان","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/nissan.png","country":"Japan","country_ar":"اليابان","tagline_ar":"ابتكار يثير الحماس واعتمادية عريقة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_nissan', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/nissan.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_sunny', 'Sunny', 'صني', 'sunny', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/sunny', 'standalone', '{"sec_1_identity":{"business_name":"Nissan Sunny","business_name_ar":"نيسان صني","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_sentra', 'Sentra', 'سنترا', 'sentra', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/sentra', 'standalone', '{"sec_1_identity":{"business_name":"Nissan Sentra","business_name_ar":"نيسان سنترا","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_qashqai', 'Qashqai', 'قشقاي', 'qashqai', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/qashqai', 'standalone', '{"sec_1_identity":{"business_name":"Nissan Qashqai","business_name_ar":"نيسان قشقاي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_juke', 'Juke', 'جوك', 'juke', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/juke', 'standalone', '{"sec_1_identity":{"business_name":"Nissan Juke","business_name_ar":"نيسان جوك","category":"Crossover"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_x_trail', 'X-Trail', 'إكس تريل', 'x-trail', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/x-trail', 'standalone', '{"sec_1_identity":{"business_name":"Nissan X-Trail","business_name_ar":"نيسان إكس تريل","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_nissan_patrol', 'Patrol', 'باترول', 'patrol', 'vehicle_model', 'automotive', 'biz_brand_nissan', '/nissan/patrol', 'standalone', '{"sec_1_identity":{"business_name":"Nissan Patrol","business_name_ar":"نيسان باترول","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_byd', 'BYD', 'بي واي دي', 'byd', 'vehicle_brand', 'automotive', NULL, '/byd', 'standalone', '{"sec_1_identity":{"business_name":"BYD","business_name_ar":"بي واي دي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/byd.png","country":"China","country_ar":"الصين","tagline_ar":"رائد ثورة السيارات الكهربائية والهجينة عالمياً"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_byd', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/byd.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_byd_byd_f3', 'F3', 'إف 3', 'byd-f3', 'vehicle_model', 'automotive', 'biz_brand_byd', '/byd/byd-f3', 'standalone', '{"sec_1_identity":{"business_name":"BYD F3","business_name_ar":"بي واي دي إف 3","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_byd_song_plus', 'Song Plus', 'سونج بلس', 'song-plus', 'vehicle_model', 'automotive', 'biz_brand_byd', '/byd/song-plus', 'standalone', '{"sec_1_identity":{"business_name":"BYD Song Plus","business_name_ar":"بي واي دي سونج بلس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_byd_yuan_plus', 'Yuan Plus', 'يوان بلس (Atto 3)', 'yuan-plus', 'vehicle_model', 'automotive', 'biz_brand_byd', '/byd/yuan-plus', 'standalone', '{"sec_1_identity":{"business_name":"BYD Yuan Plus","business_name_ar":"بي واي دي يوان بلس (Atto 3)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_byd_byd_han', 'Han', 'هان', 'byd-han', 'vehicle_model', 'automotive', 'biz_brand_byd', '/byd/byd-han', 'standalone', '{"sec_1_identity":{"business_name":"BYD Han","business_name_ar":"بي واي دي هان","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_byd_byd_seal', 'Seal', 'سيل', 'byd-seal', 'vehicle_model', 'automotive', 'biz_brand_byd', '/byd/byd-seal', 'standalone', '{"sec_1_identity":{"business_name":"BYD Seal","business_name_ar":"بي واي دي سيل","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_geely', 'Geely', 'جيلي', 'geely', 'vehicle_brand', 'automotive', NULL, '/geely', 'standalone', '{"sec_1_identity":{"business_name":"Geely","business_name_ar":"جيلي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/geely.png","country":"China","country_ar":"الصين","tagline_ar":"تكنولوجيا متقدمة وتصميم أوروبي جذاب"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_geely', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/geely.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_geely_coolray', 'Coolray', 'كول راي', 'coolray', 'vehicle_model', 'automotive', 'biz_brand_geely', '/geely/coolray', 'standalone', '{"sec_1_identity":{"business_name":"Geely Coolray","business_name_ar":"جيلي كول راي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_geely_emgrand', 'Emgrand', 'إمجراند', 'emgrand', 'vehicle_model', 'automotive', 'biz_brand_geely', '/geely/emgrand', 'standalone', '{"sec_1_identity":{"business_name":"Geely Emgrand","business_name_ar":"جيلي إمجراند","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_geely_okavango', 'Okavango', 'أوكافانجو (7 راكب)', 'okavango', 'vehicle_model', 'automotive', 'biz_brand_geely', '/geely/okavango', 'standalone', '{"sec_1_identity":{"business_name":"Geely Okavango","business_name_ar":"جيلي أوكافانجو (7 راكب)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_geely_monjaro', 'Monjaro', 'مونجارو', 'monjaro', 'vehicle_model', 'automotive', 'biz_brand_geely', '/geely/monjaro', 'standalone', '{"sec_1_identity":{"business_name":"Geely Monjaro","business_name_ar":"جيلي مونجارو","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_geely_starray', 'Starray', 'ستار راي', 'starray', 'vehicle_model', 'automotive', 'biz_brand_geely', '/geely/starray', 'standalone', '{"sec_1_identity":{"business_name":"Geely Starray","business_name_ar":"جيلي ستار راي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_peugeot', 'Peugeot', 'بيجو', 'peugeot', 'vehicle_brand', 'automotive', NULL, '/peugeot', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot","business_name_ar":"بيجو","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/peugeot.png","country":"France","country_ar":"فرنسا","tagline_ar":"سحر التصميم الفرنسي والراحة الاستثنائية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_peugeot', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/peugeot.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_3008', '3008', 'بيجو 3008', 'peugeot-3008', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-3008', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 3008","business_name_ar":"بيجو بيجو 3008","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_5008', '5008', 'بيجو 5008 (7 راكب)', 'peugeot-5008', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-5008', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 5008","business_name_ar":"بيجو بيجو 5008 (7 راكب)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_2008', '2008', 'بيجو 2008', 'peugeot-2008', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-2008', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 2008","business_name_ar":"بيجو بيجو 2008","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_508', '508', 'بيجو 508', 'peugeot-508', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-508', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 508","business_name_ar":"بيجو بيجو 508","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_301', '301', 'بيجو 301', 'peugeot-301', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-301', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 301","business_name_ar":"بيجو بيجو 301","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_peugeot_peugeot_408', '408', 'بيجو 408', 'peugeot-408', 'vehicle_model', 'automotive', 'biz_brand_peugeot', '/peugeot/peugeot-408', 'standalone', '{"sec_1_identity":{"business_name":"Peugeot 408","business_name_ar":"بيجو بيجو 408","category":"Crossover"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_renault', 'Renault', 'رينو', 'renault', 'vehicle_brand', 'automotive', NULL, '/renault', 'standalone', '{"sec_1_identity":{"business_name":"Renault","business_name_ar":"رينو","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/renault.png","country":"France","country_ar":"فرنسا","tagline_ar":"شغف بالحياة وسيارات عائلية اقتصادية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_renault', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/renault.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_renault_megane', 'Megane', 'ميجان', 'megane', 'vehicle_model', 'automotive', 'biz_brand_renault', '/renault/megane', 'standalone', '{"sec_1_identity":{"business_name":"Renault Megane","business_name_ar":"رينو ميجان","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_renault_duster', 'Duster', 'داستر', 'duster', 'vehicle_model', 'automotive', 'biz_brand_renault', '/renault/duster', 'standalone', '{"sec_1_identity":{"business_name":"Renault Duster","business_name_ar":"رينو داستر","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_renault_stepway', 'Stepway', 'ستيب واي', 'stepway', 'vehicle_model', 'automotive', 'biz_brand_renault', '/renault/stepway', 'standalone', '{"sec_1_identity":{"business_name":"Renault Stepway","business_name_ar":"رينو ستيب واي","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_renault_kadjar', 'Kadjar', 'قيدجار', 'kadjar', 'vehicle_model', 'automotive', 'biz_brand_renault', '/renault/kadjar', 'standalone', '{"sec_1_identity":{"business_name":"Renault Kadjar","business_name_ar":"رينو قيدجار","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_renault_austral', 'Austral', 'أوسترال', 'austral', 'vehicle_model', 'automotive', 'biz_brand_renault', '/renault/austral', 'standalone', '{"sec_1_identity":{"business_name":"Renault Austral","business_name_ar":"رينو أوسترال","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_skoda', 'Skoda', 'سكودا', 'skoda', 'vehicle_brand', 'automotive', NULL, '/skoda', 'standalone', '{"sec_1_identity":{"business_name":"Skoda","business_name_ar":"سكودا","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/skoda.png","country":"Czech Republic / Germany","country_ar":"التشيك / ألمانيا","tagline_ar":"ذكاء الحلول والاتساع والصلابة الأوروبية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_skoda', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/skoda.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_skoda_octavia', 'Octavia', 'أوكتافيا (A8)', 'octavia', 'vehicle_model', 'automotive', 'biz_brand_skoda', '/skoda/octavia', 'standalone', '{"sec_1_identity":{"business_name":"Skoda Octavia","business_name_ar":"سكودا أوكتافيا (A8)","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_skoda_kodiaq', 'Kodiaq', 'كودياك (7 راكب)', 'kodiaq', 'vehicle_model', 'automotive', 'biz_brand_skoda', '/skoda/kodiaq', 'standalone', '{"sec_1_identity":{"business_name":"Skoda Kodiaq","business_name_ar":"سكودا كودياك (7 راكب)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_skoda_karoq', 'Karoq', 'كاروك', 'karoq', 'vehicle_model', 'automotive', 'biz_brand_skoda', '/skoda/karoq', 'standalone', '{"sec_1_identity":{"business_name":"Skoda Karoq","business_name_ar":"سكودا كاروك","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_skoda_kamiq', 'Kamiq', 'كاميك', 'kamiq', 'vehicle_model', 'automotive', 'biz_brand_skoda', '/skoda/kamiq', 'standalone', '{"sec_1_identity":{"business_name":"Skoda Kamiq","business_name_ar":"سكودا كاميك","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_skoda_superb', 'Superb', 'سوبيرب', 'superb', 'vehicle_model', 'automotive', 'biz_brand_skoda', '/skoda/superb', 'standalone', '{"sec_1_identity":{"business_name":"Skoda Superb","business_name_ar":"سكودا سوبيرب","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_volkswagen', 'Volkswagen', 'فولكس فاجن', 'volkswagen', 'vehicle_brand', 'automotive', NULL, '/volkswagen', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen","business_name_ar":"فولكس فاجن","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/volkswagen.png","country":"Germany","country_ar":"ألمانيا","tagline_ar":"الهندسة الألمانية الموثوقة للأجيال"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_volkswagen', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/volkswagen.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volkswagen_golf', 'Golf', 'جولف', 'golf', 'vehicle_model', 'automotive', 'biz_brand_volkswagen', '/volkswagen/golf', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen Golf","business_name_ar":"فولكس فاجن جولف","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volkswagen_tiguan', 'Tiguan', 'تيجوان', 'tiguan', 'vehicle_model', 'automotive', 'biz_brand_volkswagen', '/volkswagen/tiguan', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen Tiguan","business_name_ar":"فولكس فاجن تيجوان","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volkswagen_passat', 'Passat', 'باسات', 'passat', 'vehicle_model', 'automotive', 'biz_brand_volkswagen', '/volkswagen/passat', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen Passat","business_name_ar":"فولكس فاجن باسات","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volkswagen_t_roc', 'T-Roc', 'تي روك', 't-roc', 'vehicle_model', 'automotive', 'biz_brand_volkswagen', '/volkswagen/t-roc', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen T-Roc","business_name_ar":"فولكس فاجن تي روك","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volkswagen_id4', 'ID.4', 'آي دي 4 (كهربائية)', 'id4', 'vehicle_model', 'automotive', 'biz_brand_volkswagen', '/volkswagen/id4', 'standalone', '{"sec_1_identity":{"business_name":"Volkswagen ID.4","business_name_ar":"فولكس فاجن آي دي 4 (كهربائية)","category":"EV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_audi', 'Audi', 'أودي', 'audi', 'vehicle_brand', 'automotive', NULL, '/audi', 'standalone', '{"sec_1_identity":{"business_name":"Audi","business_name_ar":"أودي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/audi.png","country":"Germany","country_ar":"ألمانيا","tagline_ar":"التقدم عبر التكنولوجيا والهندسة المتطورة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_audi', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/audi.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_a4', 'A4', 'أودي A4', 'audi-a4', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-a4', 'standalone', '{"sec_1_identity":{"business_name":"Audi A4","business_name_ar":"أودي أودي A4","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_a6', 'A6', 'أودي A6', 'audi-a6', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-a6', 'standalone', '{"sec_1_identity":{"business_name":"Audi A6","business_name_ar":"أودي أودي A6","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_q3', 'Q3', 'أودي Q3', 'audi-q3', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-q3', 'standalone', '{"sec_1_identity":{"business_name":"Audi Q3","business_name_ar":"أودي أودي Q3","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_q5', 'Q5', 'أودي Q5', 'audi-q5', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-q5', 'standalone', '{"sec_1_identity":{"business_name":"Audi Q5","business_name_ar":"أودي أودي Q5","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_q7', 'Q7', 'أودي Q7', 'audi-q7', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-q7', 'standalone', '{"sec_1_identity":{"business_name":"Audi Q7","business_name_ar":"أودي أودي Q7","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_audi_audi_q8', 'Q8', 'أودي Q8', 'audi-q8', 'vehicle_model', 'automotive', 'biz_brand_audi', '/audi/audi-q8', 'standalone', '{"sec_1_identity":{"business_name":"Audi Q8","business_name_ar":"أودي أودي Q8","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_porsche', 'Porsche', 'بورشه', 'porsche', 'vehicle_brand', 'automotive', NULL, '/porsche', 'standalone', '{"sec_1_identity":{"business_name":"Porsche","business_name_ar":"بورشه","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/porsche.png","country":"Germany","country_ar":"ألمانيا","tagline_ar":"أسطورة السيارات الرياضية الفاخرة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_porsche', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/porsche.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_porsche_cayenne', 'Cayenne', 'كايين', 'cayenne', 'vehicle_model', 'automotive', 'biz_brand_porsche', '/porsche/cayenne', 'standalone', '{"sec_1_identity":{"business_name":"Porsche Cayenne","business_name_ar":"بورشه كايين","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_porsche_macan', 'Macan', 'ماكان', 'macan', 'vehicle_model', 'automotive', 'biz_brand_porsche', '/porsche/macan', 'standalone', '{"sec_1_identity":{"business_name":"Porsche Macan","business_name_ar":"بورشه ماكان","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_porsche_panamera', 'Panamera', 'باناميرا', 'panamera', 'vehicle_model', 'automotive', 'biz_brand_porsche', '/porsche/panamera', 'standalone', '{"sec_1_identity":{"business_name":"Porsche Panamera","business_name_ar":"بورشه باناميرا","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_porsche_porsche_911', '911', 'بورشه 911', 'porsche-911', 'vehicle_model', 'automotive', 'biz_brand_porsche', '/porsche/porsche-911', 'standalone', '{"sec_1_identity":{"business_name":"Porsche 911","business_name_ar":"بورشه بورشه 911","category":"Coupe"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_porsche_taycan', 'Taycan', 'تايكان (كهربائية)', 'taycan', 'vehicle_model', 'automotive', 'biz_brand_porsche', '/porsche/taycan', 'standalone', '{"sec_1_identity":{"business_name":"Porsche Taycan","business_name_ar":"بورشه تايكان (كهربائية)","category":"EV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_fiat', 'Fiat', 'فيات', 'fiat', 'vehicle_brand', 'automotive', NULL, '/fiat', 'standalone', '{"sec_1_identity":{"business_name":"Fiat","business_name_ar":"فيات","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/fiat.png","country":"Italy","country_ar":"إيطاليا","tagline_ar":"العراقة الإيطالية والسيارة الاقتصادية المفضلة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_fiat', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/fiat.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_fiat_tipo', 'Tipo', 'تيبو', 'tipo', 'vehicle_model', 'automotive', 'biz_brand_fiat', '/fiat/tipo', 'standalone', '{"sec_1_identity":{"business_name":"Fiat Tipo","business_name_ar":"فيات تيبو","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_fiat_fiat_500', '500', 'فيات 500', 'fiat-500', 'vehicle_model', 'automotive', 'biz_brand_fiat', '/fiat/fiat-500', 'standalone', '{"sec_1_identity":{"business_name":"Fiat 500","business_name_ar":"فيات فيات 500","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_fiat_fiat_500x', '500X', 'فيات 500X', 'fiat-500x', 'vehicle_model', 'automotive', 'biz_brand_fiat', '/fiat/fiat-500x', 'standalone', '{"sec_1_identity":{"business_name":"Fiat 500X","business_name_ar":"فيات فيات 500X","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_mitsubishi', 'Mitsubishi', 'ميتسوبيشي', 'mitsubishi', 'vehicle_brand', 'automotive', NULL, '/mitsubishi', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi","business_name_ar":"ميتسوبيشي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mitsubishi.png","country":"Japan","country_ar":"اليابان","tagline_ar":"القوة والاعتمادية والرحابة العائلية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_mitsubishi', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/mitsubishi.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mitsubishi_xpander', 'Xpander', 'إكسباندر (7 راكب)', 'xpander', 'vehicle_model', 'automotive', 'biz_brand_mitsubishi', '/mitsubishi/xpander', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi Xpander","business_name_ar":"ميتسوبيشي إكسباندر (7 راكب)","category":"MPV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mitsubishi_eclipse_cross', 'Eclipse Cross', 'إكليبس كروس', 'eclipse-cross', 'vehicle_model', 'automotive', 'biz_brand_mitsubishi', '/mitsubishi/eclipse-cross', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi Eclipse Cross","business_name_ar":"ميتسوبيشي إكليبس كروس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mitsubishi_mirage', 'Mirage', 'ميراج', 'mirage', 'vehicle_model', 'automotive', 'biz_brand_mitsubishi', '/mitsubishi/mirage', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi Mirage","business_name_ar":"ميتسوبيشي ميراج","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mitsubishi_attrage', 'Attrage', 'أتراج', 'attrage', 'vehicle_model', 'automotive', 'biz_brand_mitsubishi', '/mitsubishi/attrage', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi Attrage","business_name_ar":"ميتسوبيشي أتراج","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_mitsubishi_pajero', 'Pajero', 'باجيرو', 'pajero', 'vehicle_model', 'automotive', 'biz_brand_mitsubishi', '/mitsubishi/pajero', 'standalone', '{"sec_1_identity":{"business_name":"Mitsubishi Pajero","business_name_ar":"ميتسوبيشي باجيرو","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_suzuki', 'Suzuki', 'سوزوكي', 'suzuki', 'vehicle_brand', 'automotive', NULL, '/suzuki', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki","business_name_ar":"سوزوكي","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/suzuki.png","country":"Japan","country_ar":"اليابان","tagline_ar":"كفاءة استهلاك الوقود وسهولة القيادة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_suzuki', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/suzuki.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_swift', 'Swift', 'سويفت', 'swift', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/swift', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Swift","business_name_ar":"سوزوكي سويفت","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_dzire', 'Dzire', 'ديزاير', 'dzire', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/dzire', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Dzire","business_name_ar":"سوزوكي ديزاير","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_ertiga', 'Ertiga', 'إرتيجا (7 راكب)', 'ertiga', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/ertiga', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Ertiga","business_name_ar":"سوزوكي إرتيجا (7 راكب)","category":"MPV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_ciaz', 'Ciaz', 'سياز', 'ciaz', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/ciaz', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Ciaz","business_name_ar":"سوزوكي سياز","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_fronx', 'Fronx', 'فرونكس', 'fronx', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/fronx', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Fronx","business_name_ar":"سوزوكي فرونكس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_suzuki_jimny', 'Jimny', 'جيمني', 'jimny', 'vehicle_model', 'automotive', 'biz_brand_suzuki', '/suzuki/jimny', 'standalone', '{"sec_1_identity":{"business_name":"Suzuki Jimny","business_name_ar":"سوزوكي جيمني","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_chevrolet', 'Chevrolet', 'شيفروليه', 'chevrolet', 'vehicle_brand', 'automotive', NULL, '/chevrolet', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet","business_name_ar":"شيفروليه","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/chevrolet.png","country":"USA","country_ar":"الولايات المتحدة","tagline_ar":"شريك الطرق المصري والسيارات التجارية والعائلية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_chevrolet', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/chevrolet.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chevrolet_optra', 'Optra', 'أوبترا', 'optra', 'vehicle_model', 'automotive', 'biz_brand_chevrolet', '/chevrolet/optra', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet Optra","business_name_ar":"شيفروليه أوبترا","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chevrolet_captiva', 'Captiva', 'كابتيفا', 'captiva', 'vehicle_model', 'automotive', 'biz_brand_chevrolet', '/chevrolet/captiva', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet Captiva","business_name_ar":"شيفروليه كابتيفا","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chevrolet_aveo', 'Aveo', 'أفيو', 'aveo', 'vehicle_model', 'automotive', 'biz_brand_chevrolet', '/chevrolet/aveo', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet Aveo","business_name_ar":"شيفروليه أفيو","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chevrolet_t_series_dabbaba', 'T-Series (الدبابة)', 'الدبابة T-Series', 't-series-dabbaba', 'vehicle_model', 'automotive', 'biz_brand_chevrolet', '/chevrolet/t-series-dabbaba', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet T-Series (الدبابة)","business_name_ar":"شيفروليه الدبابة T-Series","category":"Pickup"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_chevrolet_jumbo', 'Jumbo', 'جامبو', 'jumbo', 'vehicle_model', 'automotive', 'biz_brand_chevrolet', '/chevrolet/jumbo', 'standalone', '{"sec_1_identity":{"business_name":"Chevrolet Jumbo","business_name_ar":"شيفروليه جامبو","category":"Truck"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_jeep', 'Jeep', 'جيب', 'jeep', 'vehicle_brand', 'automotive', NULL, '/jeep', 'standalone', '{"sec_1_identity":{"business_name":"Jeep","business_name_ar":"جيب","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/jeep.png","country":"USA","country_ar":"الولايات المتحدة","tagline_ar":"أسطورة الطرق الوعرة والمغامرة الأصيلة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_jeep', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/jeep.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jeep_grand_cherokee', 'Grand Cherokee', 'جراند شيروكي', 'grand-cherokee', 'vehicle_model', 'automotive', 'biz_brand_jeep', '/jeep/grand-cherokee', 'standalone', '{"sec_1_identity":{"business_name":"Jeep Grand Cherokee","business_name_ar":"جيب جراند شيروكي","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jeep_wrangler', 'Wrangler', 'رانجلر', 'wrangler', 'vehicle_model', 'automotive', 'biz_brand_jeep', '/jeep/wrangler', 'standalone', '{"sec_1_identity":{"business_name":"Jeep Wrangler","business_name_ar":"جيب رانجلر","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jeep_renegade', 'Renegade', 'رينيجيد', 'renegade', 'vehicle_model', 'automotive', 'biz_brand_jeep', '/jeep/renegade', 'standalone', '{"sec_1_identity":{"business_name":"Jeep Renegade","business_name_ar":"جيب رينيجيد","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_land_rover', 'Land Rover', 'لاند روفر', 'land-rover', 'vehicle_brand', 'automotive', NULL, '/land-rover', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover","business_name_ar":"لاند روفر","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/land-rover.png","country":"United Kingdom","country_ar":"المملكة المتحدة","tagline_ar":"فخامة بريطانية وقدرات دفع رباعي خارقة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_land_rover', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/land-rover.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_land_rover_range_rover', 'Range Rover', 'رينج روفر فوغ', 'range-rover', 'vehicle_model', 'automotive', 'biz_brand_land_rover', '/land-rover/range-rover', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover Range Rover","business_name_ar":"لاند روفر رينج روفر فوغ","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_land_rover_range_rover_sport', 'Range Rover Sport', 'رينج روفر سبورت', 'range-rover-sport', 'vehicle_model', 'automotive', 'biz_brand_land_rover', '/land-rover/range-rover-sport', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover Range Rover Sport","business_name_ar":"لاند روفر رينج روفر سبورت","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_land_rover_defender', 'Defender', 'ديفيندر', 'defender', 'vehicle_model', 'automotive', 'biz_brand_land_rover', '/land-rover/defender', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover Defender","business_name_ar":"لاند روفر ديفيندر","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_land_rover_velar', 'Velar', 'فيلار', 'velar', 'vehicle_model', 'automotive', 'biz_brand_land_rover', '/land-rover/velar', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover Velar","business_name_ar":"لاند روفر فيلار","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_land_rover_evoque', 'Evoque', 'إيفوك', 'evoque', 'vehicle_model', 'automotive', 'biz_brand_land_rover', '/land-rover/evoque', 'standalone', '{"sec_1_identity":{"business_name":"Land Rover Evoque","business_name_ar":"لاند روفر إيفوك","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_volvo', 'Volvo', 'فولفو', 'volvo', 'vehicle_brand', 'automotive', NULL, '/volvo', 'standalone', '{"sec_1_identity":{"business_name":"Volvo","business_name_ar":"فولفو","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/volvo.png","country":"Sweden","country_ar":"السويد","tagline_ar":"قمة معايير الأمان والهدوء الاسكندنافي الفاخر"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_volvo', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/volvo.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volvo_xc90', 'XC90', 'فولفو XC90', 'xc90', 'vehicle_model', 'automotive', 'biz_brand_volvo', '/volvo/xc90', 'standalone', '{"sec_1_identity":{"business_name":"Volvo XC90","business_name_ar":"فولفو فولفو XC90","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volvo_xc60', 'XC60', 'فولفو XC60', 'xc60', 'vehicle_model', 'automotive', 'biz_brand_volvo', '/volvo/xc60', 'standalone', '{"sec_1_identity":{"business_name":"Volvo XC60","business_name_ar":"فولفو فولفو XC60","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_volvo_xc40', 'XC40', 'فولفو XC40', 'xc40', 'vehicle_model', 'automotive', 'biz_brand_volvo', '/volvo/xc40', 'standalone', '{"sec_1_identity":{"business_name":"Volvo XC40","business_name_ar":"فولفو فولفو XC40","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_lexus', 'Lexus', 'لكزس', 'lexus', 'vehicle_brand', 'automotive', NULL, '/lexus', 'standalone', '{"sec_1_identity":{"business_name":"Lexus","business_name_ar":"لكزس","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/lexus.png","country":"Japan","country_ar":"اليابان","tagline_ar":"إتقان الحرفية والرفاهية اليابانية الفائقة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_lexus', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/lexus.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_lexus_lx600', 'LX600', 'لكزس LX600', 'lx600', 'vehicle_model', 'automotive', 'biz_brand_lexus', '/lexus/lx600', 'standalone', '{"sec_1_identity":{"business_name":"Lexus LX600","business_name_ar":"لكزس لكزس LX600","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_lexus_rx350', 'RX350', 'لكزس RX350', 'rx350', 'vehicle_model', 'automotive', 'biz_brand_lexus', '/lexus/rx350', 'standalone', '{"sec_1_identity":{"business_name":"Lexus RX350","business_name_ar":"لكزس لكزس RX350","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_lexus_es350', 'ES350', 'لكزس ES350', 'es350', 'vehicle_model', 'automotive', 'biz_brand_lexus', '/lexus/es350', 'standalone', '{"sec_1_identity":{"business_name":"Lexus ES350","business_name_ar":"لكزس لكزس ES350","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_lexus_nx350', 'NX350', 'لكزس NX350', 'nx350', 'vehicle_model', 'automotive', 'biz_brand_lexus', '/lexus/nx350', 'standalone', '{"sec_1_identity":{"business_name":"Lexus NX350","business_name_ar":"لكزس لكزس NX350","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_cupra', 'Cupra', 'كوبرا', 'cupra', 'vehicle_brand', 'automotive', NULL, '/cupra', 'standalone', '{"sec_1_identity":{"business_name":"Cupra","business_name_ar":"كوبرا","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/cupra.png","country":"Spain","country_ar":"إسبانيا","tagline_ar":"الأداء الرياضي الجريء والروح المتمردة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_cupra', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/cupra.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_cupra_formentor', 'Formentor', 'فورمينتور', 'formentor', 'vehicle_model', 'automotive', 'biz_brand_cupra', '/cupra/formentor', 'standalone', '{"sec_1_identity":{"business_name":"Cupra Formentor","business_name_ar":"كوبرا فورمينتور","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_cupra_cupra_leon', 'Leon', 'كوبرا ليون', 'cupra-leon', 'vehicle_model', 'automotive', 'biz_brand_cupra', '/cupra/cupra-leon', 'standalone', '{"sec_1_identity":{"business_name":"Cupra Leon","business_name_ar":"كوبرا كوبرا ليون","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_seat', 'Seat', 'سيات', 'seat', 'vehicle_brand', 'automotive', NULL, '/seat', 'standalone', '{"sec_1_identity":{"business_name":"Seat","business_name_ar":"سيات","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/seat.png","country":"Spain","country_ar":"إسبانيا","tagline_ar":"حيوية وحماس وتكنولوجيا مجموعة فولكس فاجن"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_seat', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/seat.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_seat_ibiza', 'Ibiza', 'إبيزا', 'ibiza', 'vehicle_model', 'automotive', 'biz_brand_seat', '/seat/ibiza', 'standalone', '{"sec_1_identity":{"business_name":"Seat Ibiza","business_name_ar":"سيات إبيزا","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_seat_seat_leon', 'Leon', 'سيات ليون', 'seat-leon', 'vehicle_model', 'automotive', 'biz_brand_seat', '/seat/seat-leon', 'standalone', '{"sec_1_identity":{"business_name":"Seat Leon","business_name_ar":"سيات سيات ليون","category":"Hatchback"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_seat_ateca', 'Ateca', 'أتيكا', 'ateca', 'vehicle_model', 'automotive', 'biz_brand_seat', '/seat/ateca', 'standalone', '{"sec_1_identity":{"business_name":"Seat Ateca","business_name_ar":"سيات أتيكا","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_seat_arona', 'Arona', 'أرونا', 'arona', 'vehicle_model', 'automotive', 'biz_brand_seat', '/seat/arona', 'standalone', '{"sec_1_identity":{"business_name":"Seat Arona","business_name_ar":"سيات أرونا","category":"Crossover"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_seat_tarraco', 'Tarraco', 'تاراكو', 'tarraco', 'vehicle_model', 'automotive', 'biz_brand_seat', '/seat/tarraco', 'standalone', '{"sec_1_identity":{"business_name":"Seat Tarraco","business_name_ar":"سيات تاراكو","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_haval', 'Haval', 'هافال', 'haval', 'vehicle_brand', 'automotive', NULL, '/haval', 'standalone', '{"sec_1_identity":{"business_name":"Haval","business_name_ar":"هافال","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/haval.png","country":"China","country_ar":"الصين","tagline_ar":"خبراء سيارات الدفع الرباعي الذكية"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_haval', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/haval.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_haval_jolion', 'Jolion', 'جوليون', 'jolion', 'vehicle_model', 'automotive', 'biz_brand_haval', '/haval/jolion', 'standalone', '{"sec_1_identity":{"business_name":"Haval Jolion","business_name_ar":"هافال جوليون","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_haval_haval_h6', 'H6', 'هافال H6', 'haval-h6', 'vehicle_model', 'automotive', 'biz_brand_haval', '/haval/haval-h6', 'standalone', '{"sec_1_identity":{"business_name":"Haval H6","business_name_ar":"هافال هافال H6","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_jetour', 'Jetour', 'جيتور', 'jetour', 'vehicle_brand', 'automotive', NULL, '/jetour', 'standalone', '{"sec_1_identity":{"business_name":"Jetour","business_name_ar":"جيتور","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/jetour.png","country":"China","country_ar":"الصين","tagline_ar":"سيارات السفر العائلية المترفة والرحابة الفائقة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_jetour', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/jetour.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jetour_dashing', 'Dashing', 'داشينج', 'dashing', 'vehicle_model', 'automotive', 'biz_brand_jetour', '/jetour/dashing', 'standalone', '{"sec_1_identity":{"business_name":"Jetour Dashing","business_name_ar":"جيتور داشينج","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jetour_x70_plus', 'X70 Plus', 'إكس 70 بلس', 'x70-plus', 'vehicle_model', 'automotive', 'biz_brand_jetour', '/jetour/x70-plus', 'standalone', '{"sec_1_identity":{"business_name":"Jetour X70 Plus","business_name_ar":"جيتور إكس 70 بلس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jetour_x90_plus', 'X90 Plus', 'إكس 90 بلس (7 راكب)', 'x90-plus', 'vehicle_model', 'automotive', 'biz_brand_jetour', '/jetour/x90-plus', 'standalone', '{"sec_1_identity":{"business_name":"Jetour X90 Plus","business_name_ar":"جيتور إكس 90 بلس (7 راكب)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_jetour_jetour_t2', 'T2', 'ترافيلر T2 (دفع رباعي)', 'jetour-t2', 'vehicle_model', 'automotive', 'biz_brand_jetour', '/jetour/jetour-t2', 'standalone', '{"sec_1_identity":{"business_name":"Jetour T2","business_name_ar":"جيتور ترافيلر T2 (دفع رباعي)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_changan', 'Changan', 'شانجان', 'changan', 'vehicle_brand', 'automotive', NULL, '/changan', 'standalone', '{"sec_1_identity":{"business_name":"Changan","business_name_ar":"شانجان","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/changan.png","country":"China","country_ar":"الصين","tagline_ar":"الجودة والابتكار والأداء المتوازن"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_changan', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/changan.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_changan_cs35_plus', 'CS35 Plus', 'CS35 بلس', 'cs35-plus', 'vehicle_model', 'automotive', 'biz_brand_changan', '/changan/cs35-plus', 'standalone', '{"sec_1_identity":{"business_name":"Changan CS35 Plus","business_name_ar":"شانجان CS35 بلس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_changan_cs55_plus', 'CS55 Plus', 'CS55 بلس', 'cs55-plus', 'vehicle_model', 'automotive', 'biz_brand_changan', '/changan/cs55-plus', 'standalone', '{"sec_1_identity":{"business_name":"Changan CS55 Plus","business_name_ar":"شانجان CS55 بلس","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_changan_cs85', 'CS85', 'CS85 كوبيه', 'cs85', 'vehicle_model', 'automotive', 'biz_brand_changan', '/changan/cs85', 'standalone', '{"sec_1_identity":{"business_name":"Changan CS85","business_name_ar":"شانجان CS85 كوبيه","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_changan_alsvin', 'Alsvin', 'ألسفن', 'alsvin', 'vehicle_model', 'automotive', 'biz_brand_changan', '/changan/alsvin', 'standalone', '{"sec_1_identity":{"business_name":"Changan Alsvin","business_name_ar":"شانجان ألسفن","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_changan_eado', 'Eado', 'إيدو DT', 'eado', 'vehicle_model', 'automotive', 'biz_brand_changan', '/changan/eado', 'standalone', '{"sec_1_identity":{"business_name":"Changan Eado","business_name_ar":"شانجان إيدو DT","category":"Sedan"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_brand_baic', 'Baic', 'بايك', 'baic', 'vehicle_brand', 'automotive', NULL, '/baic', 'standalone', '{"sec_1_identity":{"business_name":"Baic","business_name_ar":"بايك","logo_url":"https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/baic-motor.png","country":"China","country_ar":"الصين","tagline_ar":"صلابة وقوة وتجهيزات عصرية متكاملة"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO site_profiles (target_type, target_id, template_id, logo_url, accent_color, background_color, social_links)
VALUES ('business', 'biz_brand_baic', 'editorial', 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/baic-motor.png', '#e5383b', '#07090c', '{}')
ON CONFLICT(target_type, target_id) DO UPDATE SET
  logo_url = excluded.logo_url;

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_baic_baic_x3', 'X3', 'بايك X3', 'baic-x3', 'vehicle_model', 'automotive', 'biz_brand_baic', '/baic/baic-x3', 'standalone', '{"sec_1_identity":{"business_name":"Baic X3","business_name_ar":"بايك بايك X3","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_baic_baic_x55', 'X55', 'بايك X55', 'baic-x55', 'vehicle_model', 'automotive', 'biz_brand_baic', '/baic/baic-x55', 'standalone', '{"sec_1_identity":{"business_name":"Baic X55","business_name_ar":"بايك بايك X55","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_baic_baic_x7', 'X7', 'بايك X7', 'baic-x7', 'vehicle_model', 'automotive', 'biz_brand_baic', '/baic/baic-x7', 'standalone', '{"sec_1_identity":{"business_name":"Baic X7","business_name_ar":"بايك بايك X7","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';

INSERT INTO businesses (id, name, name_ar, slug, type_id, market_id, parent_business_id, path, minisite_mode, custom_data, published, status)
VALUES ('biz_model_baic_bj40', 'BJ40', 'بايك BJ40 (صحراوي)', 'bj40', 'vehicle_model', 'automotive', 'biz_brand_baic', '/baic/bj40', 'standalone', '{"sec_1_identity":{"business_name":"Baic BJ40","business_name_ar":"بايك بايك BJ40 (صحراوي)","category":"SUV"}}', 1, 'active')
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  name_ar = excluded.name_ar,
  slug = excluded.slug,
  parent_business_id = excluded.parent_business_id,
  path = excluded.path,
  custom_data = excluded.custom_data,
  published = 1,
  status = 'active';