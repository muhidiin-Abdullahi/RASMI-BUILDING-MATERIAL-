import type { Response } from "express";
import type { AuthConfig } from "../config/auth.js";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../config/auth.js";

function cookieBase(config: AuthConfig) {
  return {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };
}

export function setAuthCookies(
  res: Response,
  config: AuthConfig,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...cookieBase(config),
    path: "/",
    maxAge: config.accessTtlSeconds * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...cookieBase(config),
    path: "/api/v1/auth/refresh",
    maxAge: config.refreshTtlDays * 86400000,
  });
}

export function clearAuthCookies(res: Response, config: AuthConfig) {
  const base = cookieBase(config);
  res.clearCookie(ACCESS_COOKIE, { ...base, path: "/" });
  res.clearCookie(REFRESH_COOKIE, { ...base, path: "/api/v1/auth/refresh" });
}
