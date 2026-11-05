import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultContent } from "@/lib/content/defaults";
import { SECTION_KEYS, mergeContent, sectionSchemas } from "@/lib/content/schema";
import { contentSections, type Field } from "@/lib/content/fields";
import { AdminUserModel } from "../models/AdminUser";
import { hashPassword } from "../services/auth.service";
import { readStoredContent } from "../services/site-content.service";
import { call, cookiesFrom, startTestDatabase } from "./helpers/test-context";

const revalidateTag = vi.hoisted(() => vi.fn());
const revalidatePath = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag, revalidatePath }));

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

describe("CMS content and media", () => {
  let db: Awaited<ReturnType<typeof startTestDatabase>>;
  let cookie: string;

  beforeAll(async () => {
    db = await startTestDatabase();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    await db.reset();
    revalidateTag.mockClear();
    revalidatePath.mockClear();
    const password = "SecurePass123!";
    await AdminUserModel.create({
      name: "Test Admin",
      email: "admin@rbm.test",
      passwordHash: await hashPassword(password),
      role: "ADMIN",
      active: true,
    });
    const { res } = await call("POST", "/auth/login", {
      body: { email: "admin@rbm.test", password },
    });
    cookie = cookiesFrom(res);
  });

  const save = (section: string, data: unknown) =>
    call("PATCH", "/admin/content", { cookie, body: { section, data } });

  it("requires a login to read or change content", async () => {
    expect((await call("GET", "/admin/content")).status).toBe(401);
    const denied = await call("PATCH", "/admin/content", {
      body: { section: "cta", data: defaultContent.cta },
    });
    expect(denied.status).toBe(401);
    expect(await readStoredContent()).toEqual({});
  });

  it("returns the defaults before anything is edited", async () => {
    const { status, json } = await call("GET", "/admin/content", { cookie });
    expect(status).toBe(200);
    expect(json.data.content.home.heroTitleLine1).toBe(defaultContent.home.heroTitleLine1);
  });

  it("saves a section, returns it, and refreshes the public site", async () => {
    const { status, json } = await save("cta", {
      ...defaultContent.cta,
      title: "Build with Rasmi",
    });
    expect(status).toBe(200);
    expect(json.data.title).toBe("Build with Rasmi");

    const read = await call("GET", "/admin/content", { cookie });
    expect(read.json.data.content.cta.title).toBe("Build with Rasmi");
    expect(read.json.data.content.home.heroTitleLine1).toBe(defaultContent.home.heroTitleLine1);
    expect(revalidateTag).toHaveBeenCalledWith("site-content", { expire: 0 });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("saves optional fields left blank", async () => {
    const { status } = await save("general", { ...defaultContent.general, hours: "" });
    expect(status).toBe(200);
  });

  it("reports validation errors by field and saves nothing", async () => {
    const { status, json } = await save("general", {
      ...defaultContent.general,
      phone: "",
      email: "not-an-email",
      instagram: "javascript:alert(1)",
    });
    expect(status).toBe(400);
    const paths = json.error.fields.map((field: { path: string }) => field.path);
    expect(paths).toEqual(expect.arrayContaining(["phone", "email", "instagram"]));
    expect(await readStoredContent()).toEqual({});
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("reports nested post errors with their list position", async () => {
    const posts = defaultContent.projects.posts.map((post) => ({ ...post }));
    posts[1].title = "";
    const { status, json } = await save("projects", { ...defaultContent.projects, posts });
    expect(status).toBe(400);
    expect(json.error.fields[0].path).toBe("posts.1.title");
  });

  it("rejects unknown sections and dangerous links", async () => {
    expect((await save("secrets", {})).status).toBe(400);
    const post = {
      ...defaultContent.projects.posts[0],
      materials: [{ label: "Bad", href: "javascript:alert(1)" }],
    };
    const { status } = await save("projects", { ...defaultContent.projects, posts: [post] });
    expect(status).toBe(400);
  });

  it("gives project posts unique slugs, ignoring any sent by the browser", async () => {
    const post = { ...defaultContent.projects.posts[0], title: "Same Name", slug: "tampered" };
    const { status, json } = await save("projects", {
      ...defaultContent.projects,
      posts: [post, post],
    });
    expect(status).toBe(200);
    expect(json.data.posts.map((p: { slug: string }) => p.slug)).toEqual([
      "same-name",
      "same-name-2",
    ]);
  });

  it("counts published project posts on the dashboard", async () => {
    const posts = defaultContent.projects.posts.slice(0, 3).map((post, index) => ({
      ...post,
      published: index !== 0,
    }));
    await save("projects", { ...defaultContent.projects, posts });
    const { json } = await call("GET", "/admin/dashboard", { cookie });
    expect(json.data.metrics.projectPosts).toBe(2);
  });

  it("fills fields missing from saved content with their defaults", () => {
    const merged = mergeContent(defaultContent, { cta: { title: "Only this" } });
    expect(merged.cta.title).toBe("Only this");
    expect(merged.cta.buttonLabel).toBe(defaultContent.cta.buttonLabel);
  });

  it("has valid defaults, and an editor field for every schema field", () => {
    const names = (fields: Field[]) =>
      fields.flatMap((field) => ("name" in field ? [field.name] : []));

    for (const key of SECTION_KEYS) {
      expect(sectionSchemas[key].safeParse(defaultContent[key]).success).toBe(true);
      const section = contentSections.find((item) => item.key === key);
      expect(section, key).toBeDefined();
      expect(names(section?.fields ?? []).sort()).toEqual(
        Object.keys(defaultContent[key]).sort(),
      );
    }
  });

  describe("media", () => {
    const upload = (bytes: Buffer, name = "photo.png", withCookie = true) => {
      const form = new FormData();
      form.set("file", new File([new Uint8Array(bytes)], name));
      return call("POST", "/admin/media", {
        form,
        cookie: withCookie ? cookie : undefined,
      });
    };

    it("requires a login to upload", async () => {
      expect((await upload(PNG, "photo.png", false)).status).toBe(401);
    });

    it("stores an image and serves it publicly with its real type", async () => {
      const { status, json } = await upload(PNG);
      expect(status).toBe(201);
      expect(json.data.contentType).toBe("image/png");

      const served = await call("GET", `/media/${json.data.id}`);
      expect(served.status).toBe(200);
      expect(served.res.headers.get("content-type")).toBe("image/png");
      expect(Buffer.from(await served.res.arrayBuffer()).equals(PNG)).toBe(true);
    });

    it("rejects files that are not images, whatever their name", async () => {
      const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>');
      expect((await upload(svg, "photo.png")).status).toBe(415);
      expect((await upload(Buffer.from("MZ executable"), "photo.jpg")).status).toBe(415);
    });

    it("rejects oversized files", async () => {
      const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024)]);
      expect((await upload(big)).status).toBe(413);
    });

    it("lists uploads without their file data and deletes them", async () => {
      const { json } = await upload(PNG);
      const list = await call("GET", "/admin/media", { cookie });
      expect(list.json.data).toHaveLength(1);
      expect(list.json.data[0].data).toBeUndefined();

      const removed = await call("DELETE", `/admin/media/${json.data.id}`, { cookie });
      expect(removed.status).toBe(200);
      expect((await call("GET", `/media/${json.data.id}`)).status).toBe(404);
    });

    it("rejects a malformed media id", async () => {
      expect((await call("GET", "/media/not-an-id")).status).toBe(400);
    });
  });
});
