-- Migration 0037: Add country and city tracking to business_analytics_events
-- Idempotent check for D1 / SQLite

ALTER TABLE business_analytics_events ADD COLUMN country TEXT;
ALTER TABLE business_analytics_events ADD COLUMN city TEXT;
