CREATE TABLE IF NOT EXISTS vendor_prospects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  original_category TEXT NOT NULL DEFAULT '',
  original_subcategory TEXT NOT NULL DEFAULT '',
  category_key TEXT NOT NULL CHECK (category_key IN (
    'dealer', 'showroom', 'authorized_agent', 'distributor', 'agent',
    'parts_supplier', 'service_center', 'rental_company', 'insurer',
    'driving_school', 'finance_company', 'manufacturer', 'unclassified'
  )),
  brand TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  district TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  phones TEXT NOT NULL DEFAULT '{}',
  contact_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  source_names TEXT NOT NULL DEFAULT '',
  source_count INTEGER NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  source_row INTEGER NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'unknown' CHECK (country_code IN ('EG', 'SA', 'QA', 'unknown')),
  duplicate_key TEXT,
  has_phone INTEGER NOT NULL DEFAULT 0 CHECK (has_phone IN (0, 1)),
  free_offer_eligible INTEGER NOT NULL DEFAULT 0 CHECK (free_offer_eligible IN (0, 1)),
  campaign_status TEXT NOT NULL DEFAULT 'new' CHECK (campaign_status IN (
    'new', 'offer_ready', 'queued', 'contacted', 'accepted', 'declined', 'do_not_contact'
  )),
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_prospects_category_country
  ON vendor_prospects(category_key, country_code);
CREATE INDEX IF NOT EXISTS idx_vendor_prospects_city
  ON vendor_prospects(city);
CREATE INDEX IF NOT EXISTS idx_vendor_prospects_brand
  ON vendor_prospects(brand);
CREATE INDEX IF NOT EXISTS idx_vendor_prospects_offer
  ON vendor_prospects(free_offer_eligible, campaign_status);
CREATE INDEX IF NOT EXISTS idx_vendor_prospects_duplicate
  ON vendor_prospects(duplicate_key);
