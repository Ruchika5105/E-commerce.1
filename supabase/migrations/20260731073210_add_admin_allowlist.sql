/*
# Add admin email allowlist + lock down admin access

## What this does
Right now any authenticated user can view/manage enquiries and feedback.
This migration introduces an email allowlist so ONLY pre-approved email
addresses can access admin data — even if a stranger creates an account,
they see nothing unless their email is on the list.

## 1. New Tables
- `admin_emails`
  - `email` (text, primary key) — an authorized admin email address
  - `created_at` (timestamptz, default now())

## 2. New Functions
- `is_admin()` — SECURITY DEFINER function (runs with elevated privileges,
  bypassing RLS) that checks whether the current authenticated user's email
  exists in the admin_emails allowlist. Returns boolean.
  Used inside RLS policies on enquiries and feedback so the allowlist check
  is enforced at the database level, not just in the frontend.

## 3. Security changes
- RLS on `admin_emails`: only existing admins can read/modify the list.
- Enquiries SELECT/UPDATE/DELETE: require `is_admin()`.
- Feedback SELECT (authenticated): requires `is_admin()`.
  Anon SELECT stays `approved = true` so public testimonials still work.
- Feedback UPDATE/DELETE: require `is_admin()`.
- INSERT on both tables stays open to anon (public forms still work).

## 4. Important notes
- The first admin email must be seeded via SQL (bypasses RLS).
- To add more admins later, insert their email into admin_emails via the
  Supabase dashboard Table Editor or SQL.
*/

-- === Step 1: Create the allowlist table ===
CREATE TABLE IF NOT EXISTS admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- === Step 2: Create the is_admin() function BEFORE any policy uses it ===
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_emails
    WHERE email = auth.jwt() ->> 'email'
  );
$$;

-- === Step 3: Lock down admin_emails table (only admins can manage it) ===
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_admin_emails" ON admin_emails;
CREATE POLICY "admin_select_admin_emails"
ON admin_emails FOR SELECT
TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_admin_emails" ON admin_emails;
CREATE POLICY "admin_insert_admin_emails"
ON admin_emails FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_admin_emails" ON admin_emails;
CREATE POLICY "admin_update_admin_emails"
ON admin_emails FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_admin_emails" ON admin_emails;
CREATE POLICY "admin_delete_admin_emails"
ON admin_emails FOR DELETE
TO authenticated USING (is_admin());

-- === Step 4: Lock down enquiries to is_admin() ===
DROP POLICY IF EXISTS "auth_select_enquiries" ON enquiries;
CREATE POLICY "auth_select_enquiries"
ON enquiries FOR SELECT
TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries"
ON enquiries FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries"
ON enquiries FOR DELETE
TO authenticated USING (is_admin());

-- === Step 5: Lock down feedback to is_admin() (anon still sees approved) ===
DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback"
ON feedback FOR SELECT
TO anon USING (approved = true);

DROP POLICY IF EXISTS "auth_select_feedback" ON feedback;
CREATE POLICY "auth_select_feedback"
ON feedback FOR SELECT
TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "auth_update_feedback" ON feedback;
CREATE POLICY "auth_update_feedback"
ON feedback FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_delete_feedback" ON feedback;
CREATE POLICY "auth_delete_feedback"
ON feedback FOR DELETE
TO authenticated USING (is_admin());
