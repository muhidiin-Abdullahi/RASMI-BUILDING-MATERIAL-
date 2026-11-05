import {
  createAdminProduct,
  listAdminProducts,
} from "@/server/services/admin-product.service";
import { recordAudit } from "@/server/services/audit.service";
import {
  adminProductBodySchema,
  adminProductListQuerySchema,
} from "@/server/validators/admin-product.validator";
import { adminRoute, ok, okPaginated, readBody, readQuery } from "@/server/http";

export const GET = adminRoute(async (req) => {
  const query = readQuery(req, adminProductListQuerySchema);
  const { items, total } = await listAdminProducts(query);
  return okPaginated(items, query.page, query.limit, total);
});

export const POST = adminRoute(async (req, _ctx, admin) => {
  const body = await readBody(req, adminProductBodySchema);
  const product = await createAdminProduct(body);
  await recordAudit({
    actorId: admin.id,
    action: "product.create",
    resourceType: "product",
    resourceId: product?.id,
    metadata: { slug: body.slug },
  });
  return ok(product, 201);
});
