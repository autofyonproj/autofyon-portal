SELECT id, name, type_id, substring(custom_data, 1, 600) as cd 
FROM businesses 
WHERE type_id IN ('vehicle_model','vehicle_trim') 
ORDER BY type_id, name
LIMIT 8;
