CREATE TABLE IF NOT EXISTS business_analytics_events (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES units(id) ON DELETE SET NULL,
  actor_admin_user_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'vehicle_view', 'vehicle_click', 'phone_click', 'whatsapp_click'
  )),
  host TEXT NOT NULL,
  path TEXT NOT NULL,
  source_host TEXT NOT NULL DEFAULT '',
  contact_target TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_analytics_business_created
  ON business_analytics_events(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_analytics_unit_created
  ON business_analytics_events(unit_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_analytics_actor_created
  ON business_analytics_events(actor_admin_user_id, created_at DESC);
