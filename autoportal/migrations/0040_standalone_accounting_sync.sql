ALTER TABLE standalone_client_copies
  ADD COLUMN business_id TEXT REFERENCES businesses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_standalone_copies_business
  ON standalone_client_copies(business_id, status);

CREATE TABLE IF NOT EXISTS standalone_accounting_drafts (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_serial TEXT NOT NULL REFERENCES standalone_client_copies(serial) ON DELETE CASCADE,
  source_record_id TEXT NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('sale', 'purchase')),
  occurred_at TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  payload_json TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'approved', 'rejected')),
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (source_serial, source_record_id)
);

CREATE INDEX IF NOT EXISTS idx_standalone_accounting_drafts_business_status
  ON standalone_accounting_drafts(business_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_standalone_accounting_drafts_delivery
  ON standalone_accounting_drafts(business_id, status, reviewed_at, id);

CREATE TABLE IF NOT EXISTS standalone_accounting_deliveries (
  draft_id TEXT NOT NULL REFERENCES standalone_accounting_drafts(id) ON DELETE CASCADE,
  recipient_serial TEXT NOT NULL REFERENCES standalone_client_copies(serial) ON DELETE CASCADE,
  acknowledged_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (draft_id, recipient_serial)
);

CREATE TABLE IF NOT EXISTS standalone_accounting_draft_events (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES standalone_accounting_drafts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('submitted', 'approved', 'rejected', 'acknowledged')),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('license', 'admin')),
  actor_id TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_standalone_accounting_draft_events_draft
  ON standalone_accounting_draft_events(draft_id, created_at);
