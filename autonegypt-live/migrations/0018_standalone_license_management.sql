CREATE TABLE IF NOT EXISTS standalone_license_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features_json TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_by TEXT NOT NULL REFERENCES admin_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS standalone_client_copies (
  serial TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  template_id TEXT NOT NULL REFERENCES standalone_license_templates(id),
  feature_overrides_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending_verification'
    CHECK (status IN ('pending_verification', 'active', 'suspended', 'revoked')),
  phone_verified_at TEXT,
  package_version TEXT,
  last_seen_at TEXT,
  follow_up_at TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL REFERENCES admin_users(id),
  updated_by TEXT NOT NULL REFERENCES admin_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_standalone_copies_status
  ON standalone_client_copies(status, updated_at);

CREATE INDEX IF NOT EXISTS idx_standalone_copies_follow_up
  ON standalone_client_copies(follow_up_at, status);

CREATE TABLE IF NOT EXISTS standalone_license_events (
  id TEXT PRIMARY KEY,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('template', 'copy')),
  subject_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  actor_email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_standalone_license_events_subject
  ON standalone_license_events(subject_type, subject_id, created_at);

INSERT OR IGNORE INTO standalone_license_templates
  (id, name, description, features_json, active, created_by)
VALUES
  ('starter', 'Starter', 'الأساسيات التشغيلية للمخزون والمحاسبة', '{"accounting":true,"inventory":true,"purchasing":true,"crm":false,"advanced_reports":false,"cloud_sync":false,"marketplace":false,"owner_ribbon":false,"staff_accounts":false}', 1, 'usr_almostashar_admin'),
  ('standard', 'Standard', 'المحاسبة والمخزون والمبيعات وإدارة العملاء', '{"accounting":true,"inventory":true,"purchasing":true,"crm":true,"advanced_reports":true,"cloud_sync":true,"marketplace":false,"owner_ribbon":true,"staff_accounts":false}', 1, 'usr_almostashar_admin'),
  ('professional', 'Professional', 'كافة الوظائف مع المزامنة والسوق ومستخدمي الفريق', '{"accounting":true,"inventory":true,"purchasing":true,"crm":true,"advanced_reports":true,"cloud_sync":true,"marketplace":true,"owner_ribbon":true,"staff_accounts":true}', 1, 'usr_almostashar_admin');
