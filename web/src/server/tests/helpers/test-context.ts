import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { connectDatabase, disconnectDatabase } from "../../db";
import { CategoryModel } from "../../models/Category";
import { ProductModel } from "../../models/Product";
import { resetRateLimits } from "../../rate-limit";

type RouteModule = Record<
  string,
  (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>
>;

/** Most specific paths first, as the App Router matches them. */
const ROUTES: Array<[RegExp, string[], () => Promise<unknown>]> = [
  [/^\/health$/, [], () => import("@/app/api/v1/health/route")],
  [/^\/categories$/, [], () => import("@/app/api/v1/categories/route")],
  [/^\/products$/, [], () => import("@/app/api/v1/products/route")],
  [/^\/products\/featured$/, [], () => import("@/app/api/v1/products/featured/route")],
  [/^\/products\/([^/]+)$/, ["slug"], () => import("@/app/api/v1/products/[slug]/route")],
  [/^\/inquiries$/, [], () => import("@/app/api/v1/inquiries/route")],
  [/^\/media\/([^/]+)$/, ["id"], () => import("@/app/api/v1/media/[id]/route")],
  [/^\/auth\/login$/, [], () => import("@/app/api/v1/auth/login/route")],
  [/^\/auth\/logout$/, [], () => import("@/app/api/v1/auth/logout/route")],
  [/^\/auth\/me$/, [], () => import("@/app/api/v1/auth/me/route")],
  [/^\/auth\/refresh$/, [], () => import("@/app/api/v1/auth/refresh/route")],
  [/^\/admin\/dashboard$/, [], () => import("@/app/api/v1/admin/dashboard/route")],
  [/^\/admin\/products$/, [], () => import("@/app/api/v1/admin/products/route")],
  [/^\/admin\/content$/, [], () => import("@/app/api/v1/admin/content/route")],
  [/^\/admin\/media$/, [], () => import("@/app/api/v1/admin/media/route")],
  [/^\/admin\/media\/([^/]+)$/, ["id"], () => import("@/app/api/v1/admin/media/[id]/route")],
  [/^\/admin\/users$/, [], () => import("@/app/api/v1/admin/users/route")],
];

export type CallOptions = {
  body?: unknown;
  form?: FormData;
  cookie?: string;
};

/** Calls the real Route Handler for a path, without an HTTP server. */
export async function call(method: string, url: string, options: CallOptions = {}) {
  const pathname = url.split("?")[0];
  for (const [pattern, names, load] of ROUTES) {
    const match = pattern.exec(pathname);
    if (!match) continue;

    const params = Object.fromEntries(names.map((name, i) => [name, match[i + 1]]));
    const handler = ((await load()) as RouteModule)[method];
    if (!handler) throw new Error(`No ${method} handler for ${url}`);

    const headers = new Headers();
    if (options.cookie) headers.set("cookie", options.cookie);
    let body: BodyInit | undefined;
    if (options.form) {
      body = options.form;
    } else if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      body = JSON.stringify(options.body);
    }

    const res = await handler(
      new NextRequest(`http://localhost:3000/api/v1${url}`, { method, headers, body }),
      { params: Promise.resolve(params) },
    );
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const json = isJson ? await res.clone().json() : undefined;
    return { res, status: res.status, json };
  }
  throw new Error(`No route matches ${url}`);
}

/** Cookie header built from a response, ignoring cookies it cleared. */
export function cookiesFrom(res: Response): string {
  return res.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .filter((pair) => pair.split("=")[1] !== "")
    .join("; ");
}

export async function startTestDatabase() {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_ACCESS_SECRET = "test-access-secret-minimum-32-characters-long";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-minimum-32-characters-long";
  process.env.INQUIRY_RATE_LIMIT_MAX = "100";
  process.env.LOGIN_RATE_LIMIT_MAX = "100";
  await connectDatabase();

  return {
    async reset() {
      resetRateLimits();
      await mongoose.connection.dropDatabase();
      // Dropping removes unique indexes, which the duplicate checks rely on.
      await Promise.all(
        Object.values(mongoose.models).map((model) => model.syncIndexes()),
      );
    },
    async stop() {
      await disconnectDatabase();
      await mongo.stop();
    },
  };
}

export async function seedMinimalCatalog() {
  const category = await CategoryModel.create({
    name: "Bathroom Mirrors",
    slug: "bathroom-mirrors",
    description: "Mirrors",
    image: "/images/categories/bathroom-mirrors.jpg",
    published: true,
  });

  await ProductModel.create([
    {
      name: "Published Mirror",
      slug: "published-mirror",
      category: category._id,
      shortDescription: "Visible mirror",
      description: "Published product for tests",
      images: [{ url: "/images/products/mirror-round-led.jpg", alt: "Mirror" }],
      specifications: [{ label: "Shape", value: "Round" }],
      featured: true,
      published: true,
    },
    {
      name: "Hidden Draft",
      slug: "hidden-draft",
      category: category._id,
      shortDescription: "Hidden",
      description: "Unpublished",
      images: [{ url: "/images/products/mirror-round-led.jpg", alt: "Hidden" }],
      specifications: [],
      featured: false,
      published: false,
    },
  ]);
}
