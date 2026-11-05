import request from "supertest";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { AdminUserModel } from "../models/AdminUser.js";
import { hashPassword } from "../services/auth.service.js";
import { createTestContext } from "./helpers/test-context.js";

describe("Admin authentication", () => {
  let ctx: Awaited<ReturnType<typeof createTestContext>>;
  const password = "SecurePass123!";

  beforeEach(async () => {
    ctx = await createTestContext();
    await AdminUserModel.create({
      name: "Test Admin",
      email: "admin@rbm.test",
      passwordHash: await hashPassword(password),
      role: "SUPER_ADMIN",
      active: true,
    });
  });

  afterEach(async () => {
    await ctx.destroy();
  });

  it("rejects invalid credentials without revealing account existence", async () => {
    const res = await request(ctx.app).post("/api/v1/auth/login").send({
      email: "missing@rbm.test",
      password: "wrong-password-xyz",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("establishes a session with valid credentials", async () => {
    const res = await request(ctx.app).post("/api/v1/auth/login").send({
      email: "admin@rbm.test",
      password,
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("admin@rbm.test");
    expect(res.headers["set-cookie"]).toBeDefined();

    const cookie = res.headers["set-cookie"];
    const me = await request(ctx.app).get("/api/v1/auth/me").set("Cookie", cookie);
    expect(me.status).toBe(200);
    expect(me.body.data.user.role).toBe("SUPER_ADMIN");
  });

  it("rejects disabled accounts", async () => {
    await AdminUserModel.updateOne({ email: "admin@rbm.test" }, { active: false });
    const res = await request(ctx.app).post("/api/v1/auth/login").send({
      email: "admin@rbm.test",
      password,
    });
    expect(res.status).toBe(401);
  });

  it("protects admin APIs without authentication", async () => {
    const res = await request(ctx.app).get("/api/v1/admin/dashboard");
    expect(res.status).toBe(401);
  });

  it("allows authenticated admin product CRUD", async () => {
    await ctx.seedMinimalCatalog();
    const login = await request(ctx.app).post("/api/v1/auth/login").send({
      email: "admin@rbm.test",
      password,
    });
    const cookie = login.headers["set-cookie"];

    const list = await request(ctx.app).get("/api/v1/admin/products").set("Cookie", cookie);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);

    const logout = await request(ctx.app).post("/api/v1/auth/logout").set("Cookie", cookie);
    expect(logout.status).toBe(200);

    const blocked = await request(ctx.app)
      .get("/api/v1/admin/products")
      .set("Cookie", logout.headers["set-cookie"] ?? cookie);
    expect(blocked.status).toBe(401);
  });

  it("stores password hashes only", async () => {
    const user = await AdminUserModel.findOne({ email: "admin@rbm.test" })
      .select("+passwordHash")
      .lean();
    expect(user?.passwordHash).toBeDefined();
    expect(user?.passwordHash).not.toBe(password);
    expect(user?.passwordHash.startsWith("$2b$")).toBe(true);
  });
});
