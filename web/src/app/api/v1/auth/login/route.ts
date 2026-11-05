import { getAuthConfig } from "@/server/auth-config";
import { fail, clientIp, ok, readBody, route, setAuthCookies } from "@/server/http";
import { enforceRateLimit } from "@/server/rate-limit";
import { recordAudit } from "@/server/services/audit.service";
import {
  authenticateAdminCredentials,
  createSession,
  generateRefreshToken,
  signAccessToken,
} from "@/server/services/auth.service";
import { loginBodySchema } from "@/server/validators/auth.validator";

export const POST = route(async (req) => {
  enforceRateLimit(
    req,
    "login",
    Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 15),
    "Too many login attempts. Try again later.",
  );
  const body = await readBody(req, loginBodySchema);
  const admin = await authenticateAdminCredentials(body.email, body.password);
  if (!admin) {
    return fail(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const config = getAuthConfig();
  const refreshToken = generateRefreshToken();
  await createSession(admin.id, refreshToken, config, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: clientIp(req),
  });
  await recordAudit({ actorId: admin.id, action: "auth.login", resourceType: "session" });

  const res = ok({
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
  setAuthCookies(res, config, signAccessToken(config, admin.id, admin.role), refreshToken);
  return res;
});
