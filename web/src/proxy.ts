import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/admin/login";
  const meUrl = new URL("/api/v1/auth/me", request.url);
  let authenticated = false;
  let role: string | undefined;
  try {
    const res = await fetch(meUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    authenticated = res.ok;
    if (authenticated) {
      const body = (await res.json()) as { data?: { user?: { role?: string } } };
      role = body.data?.user?.role;
    }
  } catch {
    authenticated = false;
  }

  if (isLogin) {
    return authenticated
      ? NextResponse.redirect(new URL("/admin/dashboard", request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    // Renews an expired session and returns here, or continues to the login page.
    const refreshUrl = new URL("/api/v1/auth/refresh", request.url);
    refreshUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  if (pathname.startsWith("/admin/users") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
