INSERT INTO admin_users (id, email, name, role, scope_ids, active)
VALUES (
  'usr_platform_admin',
  'platformadmin@autofyon.com',
  'AUTOFYON Platform Admin',
  'platform_admin',
  '["*"]',
  1
)
ON CONFLICT(email) DO UPDATE SET
  name = excluded.name,
  role = excluded.role,
  scope_ids = excluded.scope_ids,
  active = 1;

INSERT INTO admin_users (id, email, name, role, scope_ids, active)
VALUES (
  'usr_auto_one_owner',
  'admin@autonegypt.com',
  'Auto One Egypt Owner',
  'vendor',
  '["biz_auto_one_egypt"]',
  1
)
ON CONFLICT(email) DO UPDATE SET
  name = excluded.name,
  role = excluded.role,
  scope_ids = excluded.scope_ids,
  active = 1;

INSERT INTO business_memberships (id, business_id, admin_user_id, role, status)
SELECT 'member_auto_one_owner', 'biz_auto_one_egypt', id, 'owner', 'active'
FROM admin_users
WHERE email = 'admin@autonegypt.com'
ON CONFLICT(business_id, admin_user_id) DO UPDATE SET
  role = 'owner',
  status = 'active',
  updated_at = CURRENT_TIMESTAMP;

UPDATE admin_users
SET active = 0
WHERE email = 'super@mostasharak.com'
  AND id <> 'usr_platform_admin';
