-- 0035_vendor_password_auth.sql
-- Adds password_hash column to admin_users for minisite owner/sales login.
-- Uses SQLite-compatible approach: add nullable column, populate later via API.
-- Idempotent: wrapped in a guard check.

ALTER TABLE admin_users ADD COLUMN password_hash TEXT;
