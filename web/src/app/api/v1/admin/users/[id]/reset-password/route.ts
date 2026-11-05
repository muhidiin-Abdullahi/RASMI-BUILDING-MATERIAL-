import { AdminUserModel } from "@/server/models/AdminUser";
import { recordAudit } from "@/server/services/audit.service";
import { hashPassword, revokeAllSessionsForUser } from "@/server/services/auth.service";
import { resetAdminPasswordBodySchema } from "@/server/validators/admin-user.validator";
import { adminRoute, assertMongoId, fail, ok, readBody } from "@/server/http";

export const POST = adminRoute<{ id: string }>(
  async (req, { params }, admin) => {
    const id = assertMongoId((await params).id);
    const { newPassword } = await readBody(req, resetAdminPasswordBodySchema);
    const user = await AdminUserModel.findById(id);
    if (!user) {
      return fail(404, "User not found", "NOT_FOUND");
    }
    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    await revokeAllSessionsForUser(id);
    await recordAudit({
      actorId: admin.id,
      action: "admin_user.reset_password",
      resourceType: "admin_user",
      resourceId: id,
    });
    return ok({ ok: true });
  },
  { role: "SUPER_ADMIN" },
);
