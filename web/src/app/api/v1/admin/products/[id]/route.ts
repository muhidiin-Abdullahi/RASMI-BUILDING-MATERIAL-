import {
  deleteAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/server/services/admin-product.service";
import { recordAudit } from "@/server/services/audit.service";
import { adminProductBodySchema } from "@/server/validators/admin-product.validator";
import { adminRoute, assertMongoId, fail, ok, readBody } from "@/server/http";

type Params = { id: string };
const notFound = () => fail(404, "Product not found", "NOT_FOUND");

export const GET = adminRoute<Params>(async (_req, { params }) => {
  const product = await getAdminProductById(assertMongoId((await params).id));
  return product ? ok(product) : notFound();
});

export const PATCH = adminRoute<Params>(async (req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  const body = await readBody(req, adminProductBodySchema);
  const product = await updateAdminProduct(id, body);
  if (!product) return notFound();
  await recordAudit({
    actorId: admin.id,
    action: "product.update",
    resourceType: "product",
    resourceId: id,
    metadata: { published: body.published },
  });
  return ok(product);
});

export const DELETE = adminRoute<Params>(async (_req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  if (!(await deleteAdminProduct(id))) return notFound();
  await recordAudit({
    actorId: admin.id,
    action: "product.delete",
    resourceType: "product",
    resourceId: id,
  });
  return ok({ ok: true });
});
