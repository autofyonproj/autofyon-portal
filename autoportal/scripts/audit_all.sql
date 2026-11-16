SELECT '=== 1. VEHICLE MODELS & PARENTS ===';
SELECT m.id, m.name, m.slug, m.parent_business_id, p.name as parent_name, p.slug as parent_slug
FROM businesses m
LEFT JOIN businesses p ON m.parent_business_id = p.id
WHERE m.type_id = 'vehicle_model'
ORDER BY m.parent_business_id, m.name;

SELECT '=== 2. BUSINESS RELATIONSHIPS ===';
SELECT r.id, r.relation_type,
       s.name as from_name, s.slug as from_slug,
       t.name as to_name, t.slug as to_slug
FROM business_relationships r
JOIN businesses s ON r.from_business_id = s.id
JOIN businesses t ON r.to_business_id = t.id
WHERE s.type_id = 'vehicle_model' OR t.type_id = 'vehicle_model';

SELECT '=== 3. VENDOR GALLERY IMAGES ===';
SELECT g.id, b.slug as car_slug, b.name as car_name, g.section_id, g.field_key, g.field_section_id, g.url, g.caption
FROM vendor_gallery g
JOIN businesses b ON g.business_id = b.id
WHERE b.type_id = 'vehicle_model'
ORDER BY b.slug, g.section_id;
