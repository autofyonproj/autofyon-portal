CREATE TABLE IF NOT EXISTS connected_vendor_sites (
  vendor_business_id TEXT PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  allowed_origin TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  features TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
