CREATE TABLE IF NOT EXISTS autofyon_customer_plans (
  business_id TEXT PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'paid')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  paid_through TEXT,
  contact_phone TEXT NOT NULL DEFAULT '',
  last_seen_at TEXT,
  follow_up_at TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT REFERENCES admin_users(id),
  CHECK (plan = 'paid' OR paid_through IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_autofyon_customer_plans_follow_up
  ON autofyon_customer_plans(follow_up_at, status);

CREATE INDEX IF NOT EXISTS idx_autofyon_customer_plans_plan
  ON autofyon_customer_plans(plan, status, paid_through);
