SELECT id, name, slug, type_id, parent_business_id FROM businesses WHERE id = 'biz_brand_mg' OR parent_business_id = 'biz_brand_mg' OR slug LIKE '%mg%' OR name LIKE '%MG%';
