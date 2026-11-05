import { listPublishedProducts } from "@/server/services/product.service";
import { productListQuerySchema } from "@/server/validators/product.validator";
import { okPaginated, readQuery, route } from "@/server/http";

export const GET = route(async (req) => {
  const query = readQuery(req, productListQuerySchema);
  const { items, total } = await listPublishedProducts({
    page: query.page,
    limit: query.limit,
    categorySlug: query.category,
    search: query.search,
    featured: query.featured,
    sort: query.sort,
  });
  return okPaginated(items, query.page, query.limit, total);
});
