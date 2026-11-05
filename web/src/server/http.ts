import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_COOKIE_PATH,
  getAuthConfig,
  type AuthConfig,
} from "./auth-config";
import { connectDatabase } from "./db";
import { AdminUserModel, type AdminRole } from "./models/AdminUser";
import { verifyAccessToken } from "./services/auth.service";
import { mongoIdParamSchema } from "./validators/auth.validator";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

export type FieldError = { path: string; message: string };

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public fields?: FieldError[],
  ) {
    super(message);
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function okPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 0 },
  });
}

export function fail(
  status: number,
  message: string,
  code?: string,
  fields?: FieldError[],
) {
  return NextResponse.json(
    {
      success: false,
      error: { message, ...(code ? { code } : {}), ...(fields ? { fields } : {}) },
    },
    { status },
  );
}

function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return fail(error.status, error.message, error.code, error.fields);
  }

  // Business rules in the services throw errors carrying a status and code.
  if (error instanceof Error && "status" in error && error.status) {
    const serviceError = error as Error & {
      status: number;
      code?: string;
      productCount?: number;
    };
    const message =
      serviceError.code === "CATEGORY_HAS_PRODUCTS"
        ? `Cannot delete category with ${serviceError.productCount ?? 0} associated product(s). Reassign products first.`
        : serviceError.message;
    return fail(serviceError.status, message, serviceError.code);
  }

  if (typeof error === "object" && error && "code" in error && error.code === 11000) {
    return fail(409, "Duplicate key conflict", "DUPLICATE_KEY");
  }

  console.error(error);
  return fail(500, "An unexpected error occurred", "INTERNAL_ERROR");
}

export function toFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export async function readBody<S extends z.ZodType>(
  req: NextRequest,
  schema: S,
): Promise<z.output<S>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, "Invalid request body", "VALIDATION_ERROR");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new HttpError(
      400,
      "Invalid request body",
      "VALIDATION_ERROR",
      toFieldErrors(parsed.error),
    );
  }
  return parsed.data;
}

export function readQuery<S extends z.ZodType>(
  req: NextRequest,
  schema: S,
): z.output<S> {
  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    throw new HttpError(400, "Invalid query parameters", "VALIDATION_ERROR");
  }
  return parsed.data;
}

export function assertMongoId(id: string): string {
  if (!mongoIdParamSchema.safeParse({ id }).success) {
    throw new HttpError(400, "Invalid route parameters", "VALIDATION_ERROR");
  }
  return id;
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function setAuthCookies(
  res: NextResponse,
  config: AuthConfig,
  accessToken: string,
  refreshToken: string,
) {
  const base = {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    ...base,
    path: "/",
    maxAge: config.accessTtlSeconds,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    ...base,
    path: REFRESH_COOKIE_PATH,
    maxAge: config.refreshTtlDays * 86400,
  });
}

export function clearAuthCookies(res: NextResponse, config: AuthConfig) {
  const base = {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: "lax" as const,
    maxAge: 0,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };
  res.cookies.set(ACCESS_COOKIE, "", { ...base, path: "/" });
  res.cookies.set(REFRESH_COOKIE, "", { ...base, path: REFRESH_COOKIE_PATH });
}

export async function authenticate(req: NextRequest): Promise<AdminIdentity> {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    throw new HttpError(401, "Authentication required", "UNAUTHENTICATED");
  }
  const payload = verifyAccessToken(getAuthConfig(), token);
  if (!payload) {
    throw new HttpError(401, "Invalid or expired session", "UNAUTHENTICATED");
  }
  const user = await AdminUserModel.findById(payload.sub).exec();
  if (!user || !user.active) {
    throw new HttpError(401, "Authentication required", "UNAUTHENTICATED");
  }
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

type RouteContext<P> = { params: Promise<P> };

/** Wraps a Route Handler with the database connection and JSON error responses. */
export function route<P = Record<string, string>>(
  handler: (req: NextRequest, ctx: RouteContext<P>) => Promise<Response>,
) {
  return async (req: NextRequest, ctx: RouteContext<P>): Promise<Response> => {
    // Reading the request keeps every handler at request time, never prerendered.
    // Outside the try: during a build this throws a signal Next.js must receive.
    req.headers.get("host");
    try {
      await connectDatabase();
      return await handler(req, ctx);
    } catch (error) {
      unstable_rethrow(error);
      return toErrorResponse(error);
    }
  };
}

/** Like route(), but only for signed-in admins, optionally limited to one role. */
export function adminRoute<P = Record<string, string>>(
  handler: (
    req: NextRequest,
    ctx: RouteContext<P>,
    admin: AdminIdentity,
  ) => Promise<Response>,
  options?: { role?: AdminRole },
) {
  return route<P>(async (req, ctx) => {
    const admin = await authenticate(req);
    if (options?.role && admin.role !== options.role) {
      throw new HttpError(403, "Insufficient permissions", "FORBIDDEN");
    }
    return handler(req, ctx, admin);
  });
}
