import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE, getAuthConfig } from "@/server/auth-config";
import {
  clearAuthCookies,
  clientIp,
  fail,
  ok,
  route,
  setAuthCookies,
} from "@/server/http";
import { rotateRefreshSession, signAccessToken } from "@/server/services/auth.service";

async function refreshSession(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!token) return false;
  const config = getAuthConfig();
  const rotated = await rotateRefreshSession(token, config, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: clientIp(req),
  });
  if (!rotated) {
    clearAuthCookies(res, config);
    return false;
  }
  setAuthCookies(
    res,
    config,
    signAccessToken(config, rotated.userId, rotated.role),
    rotated.newRefreshToken,
  );
  return true;
}

/** Called by the admin client when a request gets a 401. */
export const POST = route(async (req) => {
  const res = ok({ ok: true });
  if (await refreshSession(req, res)) {
    return res;
  }
  const denied = fail(401, "Session expired", "UNAUTHENTICATED");
  clearAuthCookies(denied, getAuthConfig());
  return denied;
});

/** Page visits land here from the proxy: back to the page, or on to sign-in. */
export const GET = route(async (req) => {
  const requested = req.nextUrl.searchParams.get("next") ?? "";
  const next = /^\/admin(\/|$)/.test(requested) ? requested : "/admin/dashboard";

  const back = NextResponse.redirect(new URL(next, req.url));
  if (await refreshSession(req, back)) {
    return back;
  }
  const login = new URL("/admin/login", req.url);
  login.searchParams.set("next", next);
  const res = NextResponse.redirect(login);
  clearAuthCookies(res, getAuthConfig());
  return res;
});
