-- Migration: 0044_download_events
-- Audit log for every successful package/installer download.
-- Records who (phone), from where (IP), when, and which serial was verified.
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS download_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  serial        TEXT    NOT NULL,
  phone         TEXT,
  ip            TEXT,
  user_agent    TEXT,
  tier          TEXT,
  downloaded_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_download_events_serial ON download_events(serial);
CREATE INDEX IF NOT EXISTS idx_download_events_phone  ON download_events(phone);
CREATE INDEX IF NOT EXISTS idx_download_events_at     ON download_events(downloaded_at);
