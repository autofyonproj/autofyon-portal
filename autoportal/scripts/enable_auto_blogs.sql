-- Enable blog feature on all automotive sections and identity section
UPDATE sections SET enable_blog = 1 WHERE id LIKE 'sec_auto_%' OR id = 'sec_1_identity';
