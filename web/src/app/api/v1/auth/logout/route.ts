import { REFRESH_COOKIE, getAuthConfig } from "@/server/auth-config";
import { authenticate, clearAuthCookies, ok, route } from "@/server/http";
import { recordAudit } from "@/server/services/audit.service";
import { revokeRefreshToken } from "@/server/services/auth.service";

/** Works with an expired access token too, so signing out can always finish. */
export const POST = route(async (req) => {
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    await revokeRefreshToken(refresh);
  }
  const admin = await authenticate(req).catch(() => null);
  if (admin) {
    await recordAudit({ actorId: admin.id, action: "auth.logout", resourceType: "session" });
  }
  const res = ok({ ok: true });
  clearAuthCookies(res, getAuthConfig());
  return res;
});
