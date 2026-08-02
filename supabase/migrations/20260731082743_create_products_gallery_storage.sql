/*
# Create products + gallery tables with storage, seed existing content

## What this does
Moves hardcoded products and gallery images from the frontend into the
database so the business owner can add/edit/remove them from the admin
panel without touching code. Also creates a public storage bucket for
owner-uploaded product/gallery photos.

## 1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null) — product name
  - `description` (text, not null) — short description
  - `image` (text, not null) — image URL (external or Supabase storage)
  - `badge` (text, not null, default 'Premium') — e.g. "Premium", "Wholesale"
  - `sort_order` (int, default 0) — controls display order
  - `created_at` (timestamptz, default now())

- `gallery`
  - `id` (uuid, primary key)
  - `src` (text, not null) — image URL
  - `alt` (text, not null) — alt text / caption
  - `category` (text, not null) — Factory|Processing|Products|Packaging|Machinery
  - `sort_order` (int, default 0)
  - `created_at` (timestamptz, default now())

## 2. Security
- Both tables: anon + authenticated can SELECT (public website reads them).
- Only is_admin() can INSERT / UPDATE / DELETE.
- Storage bucket `site-images`: public read + admin-only write.

## 3. Data seed
- Inserts all 7 existing products and 12 existing gallery images so the
  site looks identical until the owner edits via the admin panel.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  badge text NOT NULL DEFAULT 'Premium',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
ON products FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
ON products FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
ON products FOR DELETE
TO authenticated USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort_order);

CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL CHECK (category IN ('Factory','Processing','Products','Packaging','Machinery')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery"
ON gallery FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery" ON gallery;
CREATE POLICY "admin_insert_gallery"
ON gallery FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_gallery" ON gallery;
CREATE POLICY "admin_update_gallery"
ON gallery FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_gallery" ON gallery;
CREATE POLICY "admin_delete_gallery"
ON gallery FOR DELETE
TO authenticated USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery (sort_order);

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_site_images" ON storage.objects;
CREATE POLICY "anon_read_site_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "admin_insert_site_images" ON storage.objects;
CREATE POLICY "admin_insert_site_images"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'site-images' AND is_admin());

DROP POLICY IF EXISTS "admin_update_site_images" ON storage.objects;
CREATE POLICY "admin_update_site_images"
ON storage.objects FOR UPDATE
TO authenticated USING (bucket_id = 'site-images' AND is_admin()) WITH CHECK (bucket_id = 'site-images' AND is_admin());

DROP POLICY IF EXISTS "admin_delete_site_images" ON storage.objects;
CREATE POLICY "admin_delete_site_images"
ON storage.objects FOR DELETE
TO authenticated USING (bucket_id = 'site-images' AND is_admin());

INSERT INTO products (name, description, image, badge, sort_order)
SELECT * FROM (VALUES
  ('Premium Cashew Kernels', 'Hand-graded, premium-grade whole cashew kernels processed under strict hygiene standards.', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium', 1),
  ('Whole Cashews', 'Carefully sourced whole cashews with uniform size, rich taste, and natural freshness.', 'https://images.pexels.com/photos/7245665/pexels-photo-7245665.jpeg?auto=compress&cs=tinysrgb&w=800', 'Grade A', 2),
  ('Split Cashews', 'Naturally split cashew kernels retaining full flavor — ideal for culinary and commercial use.', 'https://images.pexels.com/photos/9811624/pexels-photo-9811624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wholesale', 3),
  ('Broken Cashews', 'Economically priced broken kernels perfect for sweets, baking, and food manufacturing.', 'https://images.pexels.com/photos/6730156/pexels-photo-6730156.jpeg?auto=compress&cs=tinysrgb&w=800', 'Economy', 4),
  ('Cashew Pieces', 'Convenient ready-to-use cashew pieces for snacks, gravies, and industrial food preparation.', 'https://images.pexels.com/photos/9017852/pexels-photo-9017852.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bulk', 5),
  ('Bulk Supply', 'Large-volume cashew supply tailored for distributors, wholesalers, and food businesses.', 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800', 'B2B', 6),
  ('Wholesale Orders', 'Competitive wholesale pricing with reliable, on-time delivery for repeat business partners.', 'https://images.pexels.com/photos/4499222/pexels-photo-4499222.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wholesale', 7)
) AS v(name, description, image, badge, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO gallery (src, alt, category, sort_order)
SELECT * FROM (VALUES
  ('https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800', 'Modern food processing facility', 'Factory', 1),
  ('https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cashew processing line', 'Processing', 2),
  ('https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium cashew kernels', 'Products', 3),
  ('https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hygienic packaging process', 'Packaging', 4),
  ('https://images.pexels.com/photos/3892482/pexels-photo-3892482.jpeg?auto=compress&cs=tinysrgb&w=800', 'Industrial processing machinery', 'Machinery', 5),
  ('https://images.pexels.com/photos/7245665/pexels-photo-7245665.jpeg?auto=compress&cs=tinysrgb&w=800', 'Close-up of premium cashews', 'Products', 6),
  ('https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=800', 'Factory production floor', 'Factory', 7),
  ('https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=800', 'Workers in food processing', 'Processing', 8),
  ('https://images.pexels.com/photos/4198607/pexels-photo-4198607.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sealed packaged products', 'Packaging', 9),
  ('https://images.pexels.com/photos/9811624/pexels-photo-9811624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Close-up of cashew nuts', 'Products', 10),
  ('https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800', 'Food manufacturing equipment', 'Machinery', 11),
  ('https://images.pexels.com/photos/34424388/pexels-photo-34424388.jpeg?auto=compress&cs=tinysrgb&w=800', 'Fresh cashew on the farm', 'Processing', 12)
) AS v(src, alt, category, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM gallery);
