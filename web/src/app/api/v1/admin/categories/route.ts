import {
  createAdminCategory,
  listAdminCategories,
} from "@/server/services/admin-category.service";
import { recordAudit } from "@/server/services/audit.service";
import {
  adminCategoryBodySchema,
  adminCategoryListQuerySchema,
} from "@/server/validators/admin-category.validator";
import { adminRoute, ok, readBody, readQuery } from "@/server/http";

export const GET = adminRoute(async (req) => {
  const query = readQuery(req, adminCategoryListQuerySchema);
  return ok(await listAdminCategories(query.search));
});

export const POST = adminRoute(async (req, _ctx, admin) => {
  const body = await readBody(req, adminCategoryBodySchema);
  const category = await createAdminCategory(body);
  await recordAudit({
    actorId: admin.id,
    action: "category.create",
    resourceType: "category",
    resourceId: category?.id,
  });
  return ok(category, 201);
});
