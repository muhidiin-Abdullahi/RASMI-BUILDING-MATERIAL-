import { getPublishedProductBySlug } from "@/server/services/product.service";
import { fail, ok, route } from "@/server/http";

export const GET = route<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  return product ? ok(product) : fail(404, "Product not found", "NOT_FOUND");
});
