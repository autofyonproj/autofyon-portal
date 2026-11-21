ALTER TABLE vendor_leads
  ADD COLUMN sync_revision INTEGER NOT NULL DEFAULT 1;

ALTER TABLE vendor_leads
  ADD COLUMN archived_at TEXT;

CREATE INDEX IF NOT EXISTS idx_vendor_leads_business_updated
  ON vendor_leads(business_id, updated_at, id);

ALTER TABLE vendor_lead_activities
  ADD COLUMN external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_lead_activities_external
  ON vendor_lead_activities(business_id, lead_id, external_id)
  WHERE external_id IS NOT NULL;

ALTER TABLE vendor_lead_connections
  ADD COLUMN can_write INTEGER NOT NULL DEFAULT 0
    CHECK (can_write IN (0, 1));
