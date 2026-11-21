CREATE TABLE IF NOT EXISTS vendor_leads (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  inquiry TEXT NOT NULL DEFAULT '',
  inquiry_for TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'website'
    CHECK (source IN ('website', 'social', 'referral', 'campaign', 'other')),
  source_path TEXT NOT NULL DEFAULT '',
  consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'visit_or_quote', 'won', 'lost')),
  next_follow_up_at TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_leads_business_pipeline
  ON vendor_leads(business_id, status, next_follow_up_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_business_created
  ON vendor_leads(business_id, created_at, id);

CREATE TABLE IF NOT EXISTS vendor_lead_activities (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id TEXT NOT NULL REFERENCES vendor_leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL
    CHECK (activity_type IN ('note', 'call', 'email', 'whatsapp', 'meeting', 'follow_up', 'status_change')),
  summary TEXT NOT NULL,
  created_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_lead_activities_lead
  ON vendor_lead_activities(business_id, lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS vendor_lead_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_lead_connections (
  business_id TEXT PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT,
  revoked_at TEXT
);
