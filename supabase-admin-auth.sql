-- ============================================
-- Admin auth setup for Minas Bakeshop
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Confirm the admin account so login works without email verification.
-- Note: confirmed_at is auto-generated from email_confirmed_at — do not set it manually.
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'minasbakeshopp@gmail.com';

-- Optional: tag admin role in user metadata (already set on signup)
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE email = 'minasbakeshopp@gmail.com';
