-- Restore the original product catalogue, gallery and first admin from the retired Supabase project.
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
--> statement-breakpoint

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
--> statement-breakpoint

INSERT INTO admin_emails (email) VALUES ('k.gaureehafoodindustry@gmail.com') ON CONFLICT (email) DO NOTHING;
