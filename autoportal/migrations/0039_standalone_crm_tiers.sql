ALTER TABLE standalone_client_copies
  ADD COLUMN crm_tier TEXT NOT NULL DEFAULT 'enterprise'
    CHECK (crm_tier IN ('growth', 'pro', 'enterprise'));
