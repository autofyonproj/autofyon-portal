-- 1. Hosts & event counts
SELECT host, source_host, event_type, COUNT(*) as count 
FROM business_analytics_events 
GROUP BY host, source_host, event_type;

-- 2. Check specifically for autonegypt
SELECT * FROM business_analytics_events 
WHERE host LIKE '%autonegypt%' OR path LIKE '%autonegypt%' OR source_host LIKE '%autonegypt%'
ORDER BY created_at DESC LIMIT 50;

-- 3. Check clicks (phone_click, whatsapp_click, vehicle_click)
SELECT id, business_id, event_type, host, path, contact_target, created_at 
FROM business_analytics_events 
WHERE event_type IN ('phone_click', 'whatsapp_click', 'vehicle_click')
ORDER BY created_at DESC;

-- 4. Check vendor leads
SELECT id, business_id, full_name, phone, inquiry, source_url, created_at 
FROM vendor_leads 
ORDER BY created_at DESC LIMIT 20;
