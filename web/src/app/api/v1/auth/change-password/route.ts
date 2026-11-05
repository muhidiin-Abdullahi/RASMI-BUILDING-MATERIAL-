import { getAuthConfig } from "@/server/auth-config";
import { adminRoute, clearAuthCookies, fail, ok, readBody } from "@/server/http";
import { AdminUserModel } from "@/server/models/AdminUser";
import { recordAudit } from "@/server/services/audit.service";
import {
  hashPassword,
  revokeAllSessionsForUser,
  verifyPassword,
} from "@/server/services/auth.service";
import { changePasswordBodySchema } from "@/server/validators/auth.validator";

export const POST = adminRoute(async (req, _ctx, admin) => {
  const { currentPassword, newPassword } = await readBody(req, changePasswordBodySchema);
  const user = await AdminUserModel.findById(admin.id).select("+passwordHash").exec();
  if (!user) {
    return fail(401, "Authentication required", "UNAUTHENTICATED");
  }
  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    return fail(400, "Current password is incorrect", "INVALID_PASSWORD");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  await revokeAllSessionsForUser(user._id.toString());
  await recordAudit({
    actorId: admin.id,
    action: "auth.password_change",
    resourceType: "admin_user",
    resourceId: admin.id,
  });

  const res = ok({ ok: true, message: "Password updated. Please sign in again." });
  clearAuthCookies(res, getAuthConfig());
  return res;
});
