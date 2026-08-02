/*
# Create feedback table + lock down enquiries to admin-only reads

1. New Tables
- `feedback`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — customer's name
  - `email` (text, not null) — customer's email
  - `rating` (integer, not null, 1-5) — star rating
  - `message` (text, not null) — feedback text
  - `approved` (boolean, default false) — admin must approve before it shows publicly
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `feedback`.
- INSERT open to anon + authenticated (public feedback form, no sign-in).
- SELECT: anon can read ONLY approved feedback (so the public testimonials
  section works). authenticated (admin) can read ALL feedback.
- UPDATE/DELETE: authenticated only (admin manages feedback).
- Enquiries: REPLACE the old anon SELECT/UPDATE/DELETE policies with
  authenticated-only versions so only the signed-in admin can view/manage
  enquiries. INSERT stays open to anon so the public contact form still works.

3. Notes
- No user_id columns — single-tenant admin app.
- The admin signs in via Supabase email/password auth.
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Feedback: public can insert
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback"
ON feedback FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Feedback: anon can read approved only; authenticated can read all
DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback"
ON feedback FOR SELECT
TO anon USING (approved = true);

DROP POLICY IF EXISTS "auth_select_feedback" ON feedback;
CREATE POLICY "auth_select_feedback"
ON feedback FOR SELECT
TO authenticated USING (true);

-- Feedback: admin can update + delete
DROP POLICY IF EXISTS "auth_update_feedback" ON feedback;
CREATE POLICY "auth_update_feedback"
ON feedback FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_feedback" ON feedback;
CREATE POLICY "auth_delete_feedback"
ON feedback FOR DELETE
TO authenticated USING (true);

-- Enquiries: lock down SELECT/UPDATE/DELETE to authenticated only
DROP POLICY IF EXISTS "anon_select_enquiries" ON enquiries;
CREATE POLICY "auth_select_enquiries"
ON enquiries FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries"
ON enquiries FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries"
ON enquiries FOR DELETE
TO authenticated USING (true);

-- Enquiries: INSERT stays open to anon for the public contact form
-- (existing anon_insert_enquiries policy already covers this)

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_approved ON feedback (approved);
