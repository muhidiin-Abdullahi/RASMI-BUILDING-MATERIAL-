import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AdminSessionModel } from "../models/AdminSession";
import { AdminUserModel } from "../models/AdminUser";
import { hashPassword } from "../services/auth.service";
import {
  call,
  cookiesFrom,
  seedMinimalCatalog,
  startTestDatabase,
} from "./helpers/test-context";

describe("Admin authentication", () => {
  let db: Awaited<ReturnType<typeof startTestDatabase>>;
  const password = "SecurePass123!";
  const credentials = { email: "admin@rbm.test", password };

  beforeAll(async () => {
    db = await startTestDatabase();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    await db.reset();
    await AdminUserModel.create({
      name: "Test Admin",
      email: credentials.email,
      passwordHash: await hashPassword(password),
      role: "SUPER_ADMIN",
      active: true,
    });
  });

  async function login() {
    const { res } = await call("POST", "/auth/login", { body: credentials });
    return cookiesFrom(res);
  }

  it("rejects invalid credentials without revealing account existence", async () => {
    const { status, json } = await call("POST", "/auth/login", {
      body: { email: "missing@rbm.test", password: "wrong-password-xyz" },
    });
    expect(status).toBe(401);
    expect(json.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("establishes a session with valid credentials", async () => {
    const { status, json, res } = await call("POST", "/auth/login", { body: credentials });
    expect(status).toBe(200);
    expect(json.data.user.email).toBe(credentials.email);

    const me = await call("GET", "/auth/me", { cookie: cookiesFrom(res) });
    expect(me.status).toBe(200);
    expect(me.json.data.user.role).toBe("SUPER_ADMIN");
  });

  it("sets HTTP-only session cookies", async () => {
    const { res } = await call("POST", "/auth/login", { body: credentials });
    for (const cookie of res.headers.getSetCookie()) {
      expect(cookie.toLowerCase()).toContain("httponly");
    }
  });

  it("rejects disabled accounts", async () => {
    await AdminUserModel.updateOne({ email: credentials.email }, { active: false });
    const { status } = await call("POST", "/auth/login", { body: credentials });
    expect(status).toBe(401);
  });

  it("protects admin APIs without authentication", async () => {
    expect((await call("GET", "/admin/dashboard")).status).toBe(401);
  });

  it("allows authenticated admin product access until logout", async () => {
    await seedMinimalCatalog();
    const cookie = await login();

    const list = await call("GET", "/admin/products", { cookie });
    expect(list.status).toBe(200);
    expect(list.json.data.length).toBeGreaterThan(0);

    const logout = await call("POST", "/auth/logout", { cookie });
    expect(logout.status).toBe(200);
    expect(cookiesFrom(logout.res)).toBe("");
    expect((await call("GET", "/admin/products", { cookie: "" })).status).toBe(401);
  });

  it("revokes the session on the server at logout", async () => {
    const cookie = await login();
    expect(await AdminSessionModel.countDocuments()).toBe(1);

    await call("POST", "/auth/logout", { cookie });
    expect(await AdminSessionModel.countDocuments()).toBe(0);
    expect((await call("POST", "/auth/refresh", { cookie })).status).toBe(401);
  });

  it("renews an expired session with the refresh token", async () => {
    const cookie = await login();
    const refreshOnly = cookie
      .split("; ")
      .filter((pair) => pair.startsWith("rbm_refresh="))
      .join("; ");

    expect((await call("GET", "/auth/me", { cookie: refreshOnly })).status).toBe(401);

    const refreshed = await call("POST", "/auth/refresh", { cookie: refreshOnly });
    expect(refreshed.status).toBe(200);
    const me = await call("GET", "/auth/me", { cookie: cookiesFrom(refreshed.res) });
    expect(me.status).toBe(200);
  });

  it("restricts user management to super admins", async () => {
    await AdminUserModel.create({
      name: "Editor",
      email: "editor@rbm.test",
      passwordHash: await hashPassword(password),
      role: "ADMIN",
      active: true,
    });
    const { res } = await call("POST", "/auth/login", {
      body: { email: "editor@rbm.test", password },
    });
    const editor = cookiesFrom(res);

    expect((await call("GET", "/admin/users", { cookie: editor })).status).toBe(403);
    expect((await call("GET", "/admin/users", { cookie: await login() })).status).toBe(200);
  });

  it("stores password hashes only", async () => {
    const user = await AdminUserModel.findOne({ email: credentials.email })
      .select("+passwordHash")
      .lean();
    expect(user?.passwordHash).toBeDefined();
    expect(user?.passwordHash).not.toBe(password);
    expect(user?.passwordHash.startsWith("$2b$")).toBe(true);
  });
});
