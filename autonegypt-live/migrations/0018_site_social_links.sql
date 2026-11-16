CREATE TABLE IF NOT EXISTS site_social_links (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  platform_key TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  is_visible INTEGER NOT NULL DEFAULT 1 CHECK (is_visible IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_site_social_business_platform
  ON site_social_links(business_id, platform_key)
  WHERE unit_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_site_social_unit_platform
  ON site_social_links(unit_id, platform_key)
  WHERE unit_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_site_social_business
  ON site_social_links(business_id, unit_id, is_visible, display_order);
