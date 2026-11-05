export type AuthConfig = {
  accessSecret: string;
  refreshSecret: string;
  accessTtlSeconds: number;
  refreshTtlDays: number;
  cookieSecure: boolean;
  cookieDomain?: string;
};

export function getAuthConfig(): AuthConfig {
  const accessSecret = process.env.JWT_ACCESS_SECRET?.trim();
  const refreshSecret = process.env.JWT_REFRESH_SECRET?.trim();

  if (!accessSecret || accessSecret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET must be set (min 32 characters).");
  }
  if (!refreshSecret || refreshSecret.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be set (min 32 characters).");
  }

  return {
    accessSecret,
    refreshSecret,
    accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7),
    cookieSecure: process.env.NODE_ENV === "production",
    cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  };
}

export const ACCESS_COOKIE = "rbm_access";
export const REFRESH_COOKIE = "rbm_refresh";
/** Scoped to the auth routes so the refresh token is not sent with every request. */
export const REFRESH_COOKIE_PATH = "/api/v1/auth";
