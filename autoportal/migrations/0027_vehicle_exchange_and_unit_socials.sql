ALTER TABLE site_profiles
  ADD COLUMN social_links TEXT NOT NULL DEFAULT '{}';

ALTER TABLE units
  ADD COLUMN source_site_business_id TEXT REFERENCES businesses(id) ON DELETE SET NULL;

ALTER TABLE units
  ADD COLUMN source_vehicle_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_units_external_source
  ON units(source_site_business_id, source_vehicle_id)
  WHERE source_site_business_id IS NOT NULL AND source_vehicle_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS vehicle_exchange_sites (
  vendor_business_id TEXT PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_exchange_proposals (
  id TEXT PRIMARY KEY,
  vendor_business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('import', 'export')),
  external_vehicle_id TEXT NOT NULL,
  unit_id TEXT REFERENCES units(id) ON DELETE SET NULL,
  version_hash TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at TEXT,
  decided_by TEXT,
  delivered_at TEXT,
  UNIQUE (vendor_business_id, direction, external_vehicle_id, version_hash)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_exchange_queue
  ON vehicle_exchange_proposals(status, created_at);
CREATE INDEX IF NOT EXISTS idx_vehicle_exchange_site
  ON vehicle_exchange_proposals(vendor_business_id, direction, status);
