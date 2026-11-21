CREATE TABLE IF NOT EXISTS vendor_social_posts (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  caption_en TEXT NOT NULL DEFAULT '',
  caption_ar TEXT NOT NULL DEFAULT '',
  channels_json TEXT NOT NULL,
  planned_for TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'archived')),
  approved_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  approved_at TEXT,
  archived_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_social_posts_business_calendar
  ON vendor_social_posts(business_id, planned_for, status);
CREATE INDEX IF NOT EXISTS idx_vendor_social_posts_business_created
  ON vendor_social_posts(business_id, created_at DESC);
