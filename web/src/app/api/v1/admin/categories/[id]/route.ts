import {
  deleteAdminCategory,
  getAdminCategoryById,
  updateAdminCategory,
} from "@/server/services/admin-category.service";
import { recordAudit } from "@/server/services/audit.service";
import { adminCategoryBodySchema } from "@/server/validators/admin-category.validator";
import { adminRoute, assertMongoId, fail, ok, readBody } from "@/server/http";

type Params = { id: string };
const notFound = () => fail(404, "Category not found", "NOT_FOUND");

export const GET = adminRoute<Params>(async (_req, { params }) => {
  const category = await getAdminCategoryById(assertMongoId((await params).id));
  return category ? ok(category) : notFound();
});

export const PATCH = adminRoute<Params>(async (req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  const body = await readBody(req, adminCategoryBodySchema);
  const category = await updateAdminCategory(id, body);
  if (!category) return notFound();
  await recordAudit({
    actorId: admin.id,
    action: "category.update",
    resourceType: "category",
    resourceId: id,
  });
  return ok(category);
});

export const DELETE = adminRoute<Params>(async (_req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  if (!(await deleteAdminCategory(id))) return notFound();
  await recordAudit({
    actorId: admin.id,
    action: "category.delete",
    resourceType: "category",
    resourceId: id,
  });
  return ok({ ok: true });
});
