CREATE TABLE IF NOT EXISTS unit_vendor_offers (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  vendor_business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  price_egp INTEGER CHECK (price_egp IS NULL OR price_egp > 0),
  price_currency TEXT NOT NULL DEFAULT 'EGP',
  negotiable INTEGER NOT NULL DEFAULT 0 CHECK (negotiable IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'reserved', 'sold', 'rented', 'inactive')),
  availability_note TEXT,
  availability_note_ar TEXT,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (unit_id, vendor_business_id)
);

CREATE INDEX IF NOT EXISTS idx_unit_vendor_offers_vendor
  ON unit_vendor_offers(vendor_business_id, published, status);
CREATE INDEX IF NOT EXISTS idx_unit_vendor_offers_unit
  ON unit_vendor_offers(unit_id, published);

INSERT OR IGNORE INTO unit_vendor_offers
  (id, unit_id, vendor_business_id, price_egp, price_currency, negotiable, status, published, created_at, updated_at)
SELECT 'uvo_' || u.id || '_' || u.seller_business_id,
       u.id, u.seller_business_id, u.price_egp, u.price_currency, u.negotiable,
       u.status, u.published, u.created_at, u.updated_at
  FROM units u;

INSERT OR IGNORE INTO price_snapshots
  (id, subject_type, subject_id, price_egp, currency, source_type, source_url, source_hash, captured_at, captured_by)
SELECT 'ps_uvo_' || ps.id, 'offer',
       'uvo_' || u.id || '_' || u.seller_business_id,
       ps.price_egp, ps.currency, ps.source_type, ps.source_url, ps.source_hash, ps.captured_at, ps.captured_by
  FROM price_snapshots ps
  JOIN units u ON ps.subject_type = 'unit' AND ps.subject_id = u.id
 WHERE u.price_egp = ps.price_egp;
