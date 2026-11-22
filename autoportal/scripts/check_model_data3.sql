SELECT b.id, b.name, b.type_id, substr(b.custom_data,1,500) as cd, p.name as parent_name
FROM businesses b
LEFT JOIN businesses p ON b.parent_business_id = p.id
WHERE b.type_id IN ('vehicle_model','vehicle_trim')
ORDER BY b.type_id, b.name
LIMIT 6;
