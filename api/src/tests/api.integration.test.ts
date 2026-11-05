import request from "supertest";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { createTestContext } from "./helpers/test-context.js";

describe("RBM API v1", () => {
  let ctx: Awaited<ReturnType<typeof createTestContext>>;

  beforeEach(async () => {
    ctx = await createTestContext();
    await ctx.seedMinimalCatalog();
  });

  afterEach(async () => {
    await ctx.destroy();
  });

  it("returns health with connected database", async () => {
    const res = await request(ctx.app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database).toBe("connected");
  });

  it("lists published products with pagination metadata", async () => {
    const res = await request(ctx.app).get("/api/v1/products?page=1&limit=12");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it("excludes unpublished products from slug lookup", async () => {
    const res = await request(ctx.app).get("/api/v1/products/hidden-draft");
    expect(res.status).toBe(404);
  });

  it("returns product by slug", async () => {
    const res = await request(ctx.app).get("/api/v1/products/published-mirror");
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("published-mirror");
  });

  it("filters by search term", async () => {
    const res = await request(ctx.app).get("/api/v1/products?search=mirror");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("creates an inquiry", async () => {
    const res = await request(ctx.app).post("/api/v1/inquiries").send({
      fullName: "Test User",
      phone: "+971500000000",
      message: "Please send pricing.",
      productSlug: "published-mirror",
      productName: "Published Mirror",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.reference).toMatch(/^INQ-/);
  });

  it("blocks unauthenticated admin product mutation", async () => {
    const res = await request(ctx.app).post("/api/v1/admin/products").send({});
    expect(res.status).toBe(401);
  });
});
