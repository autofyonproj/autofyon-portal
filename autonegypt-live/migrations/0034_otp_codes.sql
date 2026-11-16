-- OTP codes table for phone-based vendor login.
-- Keyed on normalised phone number; one live code per phone at a time.
CREATE TABLE IF NOT EXISTS otp_codes (
  phone      TEXT    NOT NULL PRIMARY KEY,
  code       TEXT    NOT NULL,
  expires_at INTEGER NOT NULL,           -- Unix timestamp (seconds)
  created_at TEXT    DEFAULT (datetime('now'))
);
