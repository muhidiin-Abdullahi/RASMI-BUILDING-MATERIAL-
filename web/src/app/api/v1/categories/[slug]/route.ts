import { getPublishedCategoryBySlug } from "@/server/services/category.service";
import { fail, ok, route } from "@/server/http";

export const GET = route<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const category = await getPublishedCategoryBySlug(slug);
  return category ? ok(category) : fail(404, "Category not found", "NOT_FOUND");
});
