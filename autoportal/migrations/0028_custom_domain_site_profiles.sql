CREATE TABLE IF NOT EXISTS custom_site_profiles (
  business_id TEXT PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL DEFAULT 'editorial'
    CHECK (template_id IN ('editorial', 'showroom', 'minimal')),
  inventory_options TEXT NOT NULL DEFAULT '{"showYear":true,"showPrice":true,"showAvailability":true,"showMileage":false,"showAutofyonDetailsLink":true}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
