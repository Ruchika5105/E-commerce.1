import { pgTable, uuid, text, integer, boolean, timestamp, index, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    message: text().notNull(),
    status: text().notNull().default("new"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("idx_enquiries_created_at").on(t.created_at.desc())],
);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    rating: integer().notNull(),
    message: text().notNull(),
    approved: boolean().notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_feedback_approved_created_at").on(t.approved, t.created_at.desc()),
    check("feedback_rating_range", sql`${t.rating} >= 1 AND ${t.rating} <= 5`),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text().notNull(),
    image: text().notNull(),
    badge: text().notNull().default("Premium"),
    sort_order: integer("sort_order").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("idx_products_sort").on(t.sort_order)],
);

export const gallery = pgTable(
  "gallery",
  {
    id: uuid().primaryKey().defaultRandom(),
    src: text().notNull(),
    alt: text().notNull(),
    category: text().notNull(),
    sort_order: integer("sort_order").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_gallery_sort").on(t.sort_order),
    check(
      "gallery_category_valid",
      sql`${t.category} IN ('Factory','Processing','Products','Packaging','Machinery')`,
    ),
  ],
);

// Emails allowed into the admin panel (in addition to Identity users with the `admin` role).
export const adminEmails = pgTable("admin_emails", {
  email: text().primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
