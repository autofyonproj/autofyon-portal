ALTER TABLE custom_site_profiles
  ADD COLUMN override_options TEXT NOT NULL DEFAULT '[]';

CREATE TABLE IF NOT EXISTS custom_site_vehicle_overrides (
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  overrides TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (business_id, unit_id)
);
