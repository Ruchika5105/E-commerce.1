import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { getStore } from "@netlify/blobs";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { adminEmails, enquiries, feedback, gallery, products } from "../../db/schema.js";

const GALLERY_CATEGORIES = ["Factory", "Processing", "Products", "Packaging", "Machinery"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const json = (data: unknown, status = 200) => Response.json(data, { status });

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (body && typeof body === "object") return body as Record<string, unknown>;
  } catch {
    // fall through
  }
  throw new HttpError(400, "Invalid request body.");
}

function str(body: Record<string, unknown>, key: string, { required = true, max = 5000 } = {}) {
  const value = typeof body[key] === "string" ? (body[key] as string).trim() : "";
  if (required && !value) throw new HttpError(400, `Missing field: ${key}`);
  if (value.length > max) throw new HttpError(400, `Field too long: ${key}`);
  return value;
}

function int(body: Record<string, unknown>, key: string, fallback = 0) {
  const n = Number(body[key]);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function email(body: Record<string, unknown>, key = "email") {
  const value = str(body, key, { max: 320 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new HttpError(400, "Invalid email address.");
  return value;
}

async function currentAdmin() {
  const user = await getUser();
  if (!user?.email) return null;
  const userEmail = user.email.toLowerCase();
  if (user.roles?.includes("admin")) return { email: userEmail };
  const [row] = await db.select().from(adminEmails).where(eq(adminEmails.email, userEmail)).limit(1);
  return row ? { email: userEmail } : null;
}

async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) throw new HttpError(403, "Not authorized.");
  return admin;
}

function productPayload(body: Record<string, unknown>) {
  return {
    name: str(body, "name", { max: 200 }),
    description: str(body, "description", { max: 2000 }),
    image: str(body, "image", { max: 2000 }),
    badge: str(body, "badge", { required: false, max: 50 }) || "Premium",
    sort_order: int(body, "sort_order"),
  };
}

function galleryPayload(body: Record<string, unknown>) {
  const category = str(body, "category", { max: 50 });
  if (!GALLERY_CATEGORIES.includes(category)) throw new HttpError(400, "Invalid category.");
  return {
    src: str(body, "src", { max: 2000 }),
    alt: str(body, "alt", { max: 300 }),
    category,
    sort_order: int(body, "sort_order"),
  };
}

async function route(req: Request, segments: string[]): Promise<Response> {
  const method = req.method;
  const [first, second, third] = segments;

  // ---------- Public endpoints ----------
  if (first === "products" && !second && method === "GET") {
    return json(await db.select().from(products).orderBy(asc(products.sort_order), asc(products.created_at)));
  }

  if (first === "gallery" && !second && method === "GET") {
    return json(await db.select().from(gallery).orderBy(asc(gallery.sort_order), asc(gallery.created_at)));
  }

  if (first === "feedback" && !second && method === "GET") {
    const limit = Math.min(Math.max(Number(new URL(req.url).searchParams.get("limit")) || 10, 1), 50);
    const rows = await db
      .select({
        id: feedback.id,
        name: feedback.name,
        rating: feedback.rating,
        message: feedback.message,
        created_at: feedback.created_at,
      })
      .from(feedback)
      .where(eq(feedback.approved, true))
      .orderBy(desc(feedback.created_at))
      .limit(limit);
    return json(rows);
  }

  if (first === "feedback" && !second && method === "POST") {
    const body = await readJson(req);
    const rating = int(body, "rating", 5);
    if (rating < 1 || rating > 5) throw new HttpError(400, "Rating must be between 1 and 5.");
    await db.insert(feedback).values({
      name: str(body, "name", { max: 200 }),
      email: email(body),
      rating,
      message: str(body, "message", { max: 3000 }),
    });
    return json({ ok: true }, 201);
  }

  if (first === "enquiries" && !second && method === "POST") {
    const body = await readJson(req);
    await db.insert(enquiries).values({
      name: str(body, "name", { max: 200 }),
      email: email(body),
      phone: str(body, "phone", { required: false, max: 40 }) || null,
      message: str(body, "message", { max: 5000 }),
    });
    return json({ ok: true }, 201);
  }

  if (first === "images" && second && method === "GET") {
    const key = segments.slice(1).join("/");
    const result = await getStore("site-images").getWithMetadata(key, { type: "stream" });
    if (!result) return new Response("Not found", { status: 404 });
    return new Response(result.data, {
      headers: {
        "Content-Type": (result.metadata.contentType as string) || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // ---------- Admin endpoints ----------
  if (first !== "admin") throw new HttpError(404, "Not found.");

  if (second === "me" && method === "GET") {
    const admin = await currentAdmin();
    return json({ isAdmin: !!admin });
  }

  const admin = await requireAdmin();

  if (second === "enquiries") {
    if (!third && method === "GET") {
      return json(await db.select().from(enquiries).orderBy(desc(enquiries.created_at)));
    }
    if (third && method === "PATCH") {
      const body = await readJson(req);
      const status = str(body, "status", { max: 20 });
      if (!["new", "read"].includes(status)) throw new HttpError(400, "Invalid status.");
      await db.update(enquiries).set({ status }).where(eq(enquiries.id, third));
      return json({ ok: true });
    }
    if (third && method === "DELETE") {
      await db.delete(enquiries).where(eq(enquiries.id, third));
      return json({ ok: true });
    }
  }

  if (second === "feedback") {
    if (!third && method === "GET") {
      return json(await db.select().from(feedback).orderBy(desc(feedback.created_at)));
    }
    if (third && method === "PATCH") {
      const body = await readJson(req);
      await db.update(feedback).set({ approved: body.approved === true }).where(eq(feedback.id, third));
      return json({ ok: true });
    }
    if (third && method === "DELETE") {
      await db.delete(feedback).where(eq(feedback.id, third));
      return json({ ok: true });
    }
  }

  if (second === "products") {
    if (!third && method === "POST") {
      const [row] = await db.insert(products).values(productPayload(await readJson(req))).returning();
      return json(row, 201);
    }
    if (third && method === "PUT") {
      const [row] = await db
        .update(products)
        .set(productPayload(await readJson(req)))
        .where(eq(products.id, third))
        .returning();
      if (!row) throw new HttpError(404, "Product not found.");
      return json(row);
    }
    if (third && method === "DELETE") {
      await db.delete(products).where(eq(products.id, third));
      return json({ ok: true });
    }
  }

  if (second === "gallery") {
    if (!third && method === "POST") {
      const [row] = await db.insert(gallery).values(galleryPayload(await readJson(req))).returning();
      return json(row, 201);
    }
    if (third && method === "PUT") {
      const [row] = await db
        .update(gallery)
        .set(galleryPayload(await readJson(req)))
        .where(eq(gallery.id, third))
        .returning();
      if (!row) throw new HttpError(404, "Image not found.");
      return json(row);
    }
    if (third && method === "DELETE") {
      await db.delete(gallery).where(eq(gallery.id, third));
      return json({ ok: true });
    }
  }

  if (second === "admins") {
    if (!third && method === "GET") {
      return json(await db.select().from(adminEmails).orderBy(asc(adminEmails.created_at)));
    }
    if (!third && method === "POST") {
      const newEmail = email(await readJson(req));
      const [row] = await db.insert(adminEmails).values({ email: newEmail }).onConflictDoNothing().returning();
      if (!row) throw new HttpError(409, "This email is already on the allowlist.");
      return json(row, 201);
    }
    if (third && method === "DELETE") {
      const target = decodeURIComponent(third).toLowerCase();
      if (target === admin.email) throw new HttpError(400, "You can't remove your own account while signed in.");
      await db.delete(adminEmails).where(eq(adminEmails.email, target));
      return json({ ok: true });
    }
  }

  if (second === "upload" && method === "POST") {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new HttpError(400, "Only image uploads are allowed.");
    const data = await req.arrayBuffer();
    if (data.byteLength === 0) throw new HttpError(400, "Empty upload.");
    if (data.byteLength > MAX_UPLOAD_BYTES) throw new HttpError(413, "Image must be 5 MB or smaller.");
    const folder = third === "gallery" ? "gallery" : "products";
    const ext = contentType.split("/")[1]?.replace(/[^a-z0-9]/gi, "").slice(0, 5) || "img";
    const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    await getStore("site-images").set(key, data, { metadata: { contentType } });
    return json({ url: `/api/images/${key}` }, 201);
  }

  throw new HttpError(404, "Not found.");
}

export default async (req: Request) => {
  const segments = new URL(req.url).pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  try {
    return await route(req, segments);
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error(error);
    return json({ error: "Something went wrong." }, 500);
  }
};

export const config: Config = {
  path: "/api/*",
};
