SELECT id, name, name_ar, slug, status, 
  (SELECT COUNT(*) FROM businesses m WHERE m.parent_business_id = b.id AND m.type_id = 'vehicle_model') as models_count
FROM businesses b 
WHERE type_id = 'vehicle_brand'
ORDER BY name;
