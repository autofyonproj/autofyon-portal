CREATE TABLE IF NOT EXISTS vendor_prospect_groups (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  duplicate_key TEXT NOT NULL UNIQUE,
  review_status TEXT NOT NULL DEFAULT 'candidate'
    CHECK (review_status IN ('candidate', 'confirmed', 'separated')),
  campaign_status TEXT NOT NULL DEFAULT 'new'
    CHECK (campaign_status IN (
      'new', 'offer_ready', 'queued', 'contacted', 'accepted', 'declined', 'do_not_contact'
    )),
  next_follow_up_at TEXT,
  assigned_admin_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE vendor_prospects
  ADD COLUMN prospect_group_id TEXT REFERENCES vendor_prospect_groups(id) ON DELETE SET NULL;

INSERT INTO vendor_prospect_groups (
  id, display_name, duplicate_key, campaign_status
)
SELECT
  'vpg_' || substr(duplicate_key, 6),
  MIN(name),
  duplicate_key,
  CASE WHEN MAX(free_offer_eligible) = 1 THEN 'offer_ready' ELSE 'new' END
FROM vendor_prospects
WHERE duplicate_key IS NOT NULL
GROUP BY duplicate_key
HAVING COUNT(*) > 1
ON CONFLICT(duplicate_key) DO NOTHING;

UPDATE vendor_prospects
SET prospect_group_id = (
  SELECT g.id FROM vendor_prospect_groups g
  WHERE g.duplicate_key = vendor_prospects.duplicate_key
)
WHERE duplicate_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vendor_prospects_group
  ON vendor_prospects(prospect_group_id);
CREATE INDEX IF NOT EXISTS idx_vendor_prospect_groups_pipeline
  ON vendor_prospect_groups(review_status, campaign_status, next_follow_up_at);

CREATE TABLE IF NOT EXISTS vendor_prospect_activities (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES vendor_prospect_groups(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'note', 'call', 'email', 'whatsapp', 'meeting', 'follow_up', 'status_change'
  )),
  summary TEXT NOT NULL,
  outcome TEXT NOT NULL DEFAULT '',
  next_follow_up_at TEXT,
  created_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_prospect_activities_group
  ON vendor_prospect_activities(group_id, created_at DESC);
