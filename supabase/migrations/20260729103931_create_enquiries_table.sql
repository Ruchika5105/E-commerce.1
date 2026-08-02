/*
# Create enquiries table (single-tenant, no auth)

1. New Tables
- `enquiries`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — sender's full name
  - `email` (text, not null) — sender's email address
  - `phone` (text, nullable) — sender's phone number
  - `message` (text, not null) — enquiry details (product type, quantity, etc.)
  - `status` (text, not null, default 'new') — tracking status for the business owner
  - `created_at` (timestamptz, default now()) — when the enquiry was submitted

2. Security
- Enable RLS on `enquiries`.
- INSERT open to anon + authenticated (public contact form, no sign-in required).
- SELECT/UPDATE/DELETE open to anon + authenticated — single-tenant app where the
  owner reviews enquiries through the same anon-key frontend. There is no sign-in
  screen, so restricting to `authenticated` only would make the data invisible.
- `USING (true)` is acceptable here because the data is intentionally shared/public
  in this no-auth single-tenant context.

3. Notes
- No `user_id` column — this is not a multi-user app.
- The contact form writes via the anon key, so policies MUST include `anon`.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_enquiries" ON enquiries;
CREATE POLICY "anon_select_enquiries"
ON enquiries FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries"
ON enquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_enquiries" ON enquiries;
CREATE POLICY "anon_update_enquiries"
ON enquiries FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_enquiries" ON enquiries;
CREATE POLICY "anon_delete_enquiries"
ON enquiries FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
