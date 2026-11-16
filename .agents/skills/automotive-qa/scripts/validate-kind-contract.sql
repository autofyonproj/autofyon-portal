-- 1. Check for illegal child-parent nesting
SELECT 
    b.id AS business_id,
    b.name AS business_name,
    b.type_id AS child_kind,
    p.type_id AS parent_kind
FROM businesses b
JOIN businesses p ON b.parent_business_id = p.id
WHERE (
    (p.type_id = 'showroom') -- Showrooms cannot have child businesses
    OR (b.type_id = 'vehicle_model' AND p.type_id != 'vehicle_brand')
    OR (b.type_id = 'vehicle_trim' AND p.type_id NOT IN ('vehicle_model', 'vehicle_brand'))
    OR (b.type_id = 'showroom' AND p.type_id NOT IN ('main_agency', 'distributor'))
);

-- 2. Check for invalid relationship edge directions
SELECT 
    r.id AS relationship_id,
    r.relation_type,
    bf.type_id AS from_kind,
    bt.type_id AS to_kind
FROM business_relationships r
JOIN businesses bf ON r.from_business_id = bf.id
JOIN businesses bt ON r.to_business_id = bt.id
WHERE (
    (r.relation_type = 'manufactured_at' AND (bf.type_id NOT IN ('vehicle_model', 'vehicle_trim') OR bt.type_id != 'factory'))
    OR (r.relation_type = 'sold_by' AND (bf.type_id NOT IN ('vehicle_brand', 'vehicle_model', 'vehicle_trim') OR bt.type_id NOT IN ('main_agency', 'showroom', 'distributor', 'agent_broker', 'used_car_dealer')))
    OR (r.relation_type = 'agent_of' AND (bf.type_id != 'agent_broker' OR bt.type_id NOT IN ('main_agency', 'showroom', 'distributor')))
);
