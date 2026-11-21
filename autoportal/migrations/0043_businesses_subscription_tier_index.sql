-- Migration 0036: Index businesses(subscription_tier) for Cloudflare D1 quota efficiency
-- Ensures O(1) indexed lookups when querying vendors/businesses by subscription tier

CREATE INDEX IF NOT EXISTS idx_businesses_subscription_tier ON businesses(subscription_tier);
