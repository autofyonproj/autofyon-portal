SELECT id, name, substring(custom_data, 1, 500) as custom_data_preview 
FROM businesses 
WHERE type_id = 'vehicle_model' 
LIMIT 5;
