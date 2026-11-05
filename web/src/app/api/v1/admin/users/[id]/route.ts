import { AdminUserModel } from "@/server/models/AdminUser";
import { recordAudit } from "@/server/services/audit.service";
import { revokeAllSessionsForUser, toPublicAdminUser } from "@/server/services/auth.service";
import { updateAdminUserBodySchema } from "@/server/validators/admin-user.validator";
import { adminRoute, assertMongoId, fail, ok, readBody } from "@/server/http";

export const PATCH = adminRoute<{ id: string }>(
  async (req, { params }, admin) => {
    const id = assertMongoId((await params).id);
    const body = await readBody(req, updateAdminUserBodySchema);
    const user = await AdminUserModel.findById(id);
    if (!user) {
      return fail(404, "User not found", "NOT_FOUND");
    }
    if (body.role && admin.id === id && body.role !== user.role) {
      return fail(403, "You cannot change your own role", "FORBIDDEN");
    }
    if (body.active === false && admin.id === id) {
      return fail(403, "You cannot disable your own account", "FORBIDDEN");
    }
    if (body.active === false && user.role === "SUPER_ADMIN") {
      const others = await AdminUserModel.countDocuments({
        role: "SUPER_ADMIN",
        active: true,
        _id: { $ne: id },
      });
      if (others === 0) {
        return fail(
          409,
          "Cannot disable the last active super administrator",
          "LAST_SUPER_ADMIN",
        );
      }
    }

    if (body.name) user.name = body.name;
    if (body.role) user.role = body.role;
    if (body.active !== undefined) {
      user.active = body.active;
      if (!body.active) {
        await revokeAllSessionsForUser(id);
      }
    }
    await user.save();

    await recordAudit({
      actorId: admin.id,
      action: "admin_user.update",
      resourceType: "admin_user",
      resourceId: id,
    });
    return ok(toPublicAdminUser(user));
  },
  { role: "SUPER_ADMIN" },
);
