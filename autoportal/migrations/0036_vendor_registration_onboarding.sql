ALTER TABLE businesses ADD COLUMN updated_at TEXT;
UPDATE businesses SET updated_at = created_at WHERE updated_at IS NULL;

ALTER TABLE otp_codes ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE otp_codes ADD COLUMN send_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE otp_codes ADD COLUMN last_sent_at INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS vendor_registration_invites (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL REFERENCES vendor_prospects(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  authorized_phone TEXT NOT NULL,
  campaign_ref TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited', 'verified', 'changes_requested', 'submitted', 'approved', 'rejected', 'revoked', 'expired')),
  expires_at INTEGER NOT NULL,
  created_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  business_id TEXT REFERENCES businesses(id) ON DELETE SET NULL,
  verified_at TEXT,
  submitted_at TEXT,
  decided_at TEXT,
  decision_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_registration_active_invite
  ON vendor_registration_invites(prospect_id)
  WHERE status IN ('invited', 'verified', 'changes_requested', 'submitted');
CREATE INDEX IF NOT EXISTS idx_vendor_registration_pipeline
  ON vendor_registration_invites(status, created_at DESC);

CREATE TABLE IF NOT EXISTS vendor_onboarding_drafts (
  invite_id TEXT PRIMARY KEY REFERENCES vendor_registration_invites(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  company_name_ar TEXT NOT NULL DEFAULT '',
  type_id TEXT NOT NULL DEFAULT 'showroom',
  city TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  application_ids TEXT NOT NULL DEFAULT '[]',
  publish_consent INTEGER NOT NULL DEFAULT 0 CHECK (publish_consent IN (0, 1)),
  phone_consent INTEGER NOT NULL DEFAULT 0 CHECK (phone_consent IN (0, 1)),
  whatsapp_consent INTEGER NOT NULL DEFAULT 0 CHECK (whatsapp_consent IN (0, 1)),
  email_consent INTEGER NOT NULL DEFAULT 0 CHECK (email_consent IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_registration_otps (
  invite_id TEXT PRIMARY KEY REFERENCES vendor_registration_invites(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  send_count INTEGER NOT NULL DEFAULT 0 CHECK (send_count >= 0),
  last_sent_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_onboarding_audit (
  id TEXT PRIMARY KEY,
  invite_id TEXT NOT NULL REFERENCES vendor_registration_invites(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_onboarding_audit_invite
  ON vendor_onboarding_audit(invite_id, created_at DESC);

CREATE TABLE IF NOT EXISTS vendor_referrals (
  id TEXT PRIMARY KEY,
  source_invite_id TEXT NOT NULL REFERENCES vendor_registration_invites(id) ON DELETE CASCADE,
  prospect_id TEXT NOT NULL REFERENCES vendor_prospects(id) ON DELETE CASCADE,
  submitted_name TEXT NOT NULL,
  submitted_phone TEXT NOT NULL,
  submitted_city TEXT NOT NULL DEFAULT '',
  submitted_contact_name TEXT NOT NULL DEFAULT '',
  submitted_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'approved', 'invited', 'converted', 'rejected')),
  contact_consent INTEGER NOT NULL DEFAULT 0 CHECK (contact_consent IN (0, 1)),
  reviewed_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at TEXT,
  review_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (source_invite_id, prospect_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_referrals_pipeline
  ON vendor_referrals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_referrals_prospect
  ON vendor_referrals(prospect_id, status);
