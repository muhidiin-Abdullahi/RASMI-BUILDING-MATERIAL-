import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { call, seedMinimalCatalog, startTestDatabase } from "./helpers/test-context";

describe("Public API routes", () => {
  let db: Awaited<ReturnType<typeof startTestDatabase>>;

  beforeAll(async () => {
    db = await startTestDatabase();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    await db.reset();
    await seedMinimalCatalog();
  });

  it("returns health with connected database", async () => {
    const { status, json } = await call("GET", "/health");
    expect(status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.database).toBe("connected");
  });

  it("lists published products with pagination metadata", async () => {
    const { status, json } = await call("GET", "/products?page=1&limit=12");
    expect(status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.pagination.total).toBe(1);
  });

  it("rejects invalid list parameters", async () => {
    const { status } = await call("GET", "/products?limit=9999");
    expect(status).toBe(400);
  });

  it("excludes unpublished products from slug lookup", async () => {
    const { status } = await call("GET", "/products/hidden-draft");
    expect(status).toBe(404);
  });

  it("returns product by slug", async () => {
    const { status, json } = await call("GET", "/products/published-mirror");
    expect(status).toBe(200);
    expect(json.data.slug).toBe("published-mirror");
  });

  it("filters by search term", async () => {
    const { status, json } = await call("GET", "/products?search=mirror");
    expect(status).toBe(200);
    expect(json.data).toHaveLength(1);
  });

  it("creates an inquiry", async () => {
    const { status, json } = await call("POST", "/inquiries", {
      body: {
        fullName: "Test User",
        phone: "+252611000000",
        message: "Please send pricing.",
        productSlug: "published-mirror",
        productName: "Published Mirror",
      },
    });
    expect(status).toBe(201);
    expect(json.data.reference).toMatch(/^INQ-/);
  });

  it("rejects an invalid inquiry", async () => {
    const { status, json } = await call("POST", "/inquiries", {
      body: { fullName: "T", phone: "1", message: "" },
    });
    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("rate limits repeated inquiries", async () => {
    process.env.INQUIRY_RATE_LIMIT_MAX = "2";
    const body = { fullName: "Test User", phone: "+252611000000", message: "Hello there" };
    expect((await call("POST", "/inquiries", { body })).status).toBe(201);
    expect((await call("POST", "/inquiries", { body })).status).toBe(201);
    expect((await call("POST", "/inquiries", { body })).status).toBe(429);
    process.env.INQUIRY_RATE_LIMIT_MAX = "100";
  });

  it("blocks unauthenticated admin product mutation", async () => {
    const { status } = await call("POST", "/admin/products", { body: {} });
    expect(status).toBe(401);
  });
});
