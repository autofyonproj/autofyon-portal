CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_leads_id_business
  ON vendor_leads(id, business_id);

CREATE TABLE IF NOT EXISTS vendor_lead_documents (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('identity', 'vehicle', 'contract', 'finance', 'other')),
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL
    CHECK (content_type IN ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 15728640),
  object_key TEXT NOT NULL UNIQUE,
  uploaded_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id, business_id)
    REFERENCES vendor_leads(id, business_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vendor_lead_documents_owner
  ON vendor_lead_documents(business_id, lead_id, created_at DESC);
