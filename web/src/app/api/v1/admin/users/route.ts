import { AdminUserModel, normalizeAdminEmail } from "@/server/models/AdminUser";
import { recordAudit } from "@/server/services/audit.service";
import { hashPassword, toPublicAdminUser } from "@/server/services/auth.service";
import { createAdminUserBodySchema } from "@/server/validators/admin-user.validator";
import { adminRoute, fail, ok, readBody } from "@/server/http";

const superAdminOnly = { role: "SUPER_ADMIN" } as const;

export const GET = adminRoute(async () => {
  const users = await AdminUserModel.find({}).sort({ createdAt: -1 }).lean();
  return ok(users.map((user) => toPublicAdminUser(user)));
}, superAdminOnly);

export const POST = adminRoute(async (req, _ctx, admin) => {
  const body = await readBody(req, createAdminUserBodySchema);
  const email = normalizeAdminEmail(body.email);
  if (await AdminUserModel.exists({ email })) {
    return fail(409, "An account with this email already exists", "DUPLICATE_EMAIL");
  }
  const user = await AdminUserModel.create({
    name: body.name,
    email,
    passwordHash: await hashPassword(body.password),
    role: body.role,
    active: body.active,
  });
  await recordAudit({
    actorId: admin.id,
    action: "admin_user.create",
    resourceType: "admin_user",
    resourceId: user._id.toString(),
    metadata: { role: body.role },
  });
  return ok(toPublicAdminUser(user), 201);
}, superAdminOnly);
