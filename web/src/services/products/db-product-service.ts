import { connection } from "next/server";
import type { Category, Product, ProductListQuery } from "@/types/product";
import type {
  PaginatedProducts,
  ProductListParams,
  ProductService,
} from "@/services/products/product-service";
import { connectDatabase } from "@/server/db";
import { listPublishedCategories } from "@/server/services/category.service";
import {
  getPublishedProductBySlug,
  getPublishedProductSlugs,
  listFeaturedPublishedProducts,
  listPublishedProducts,
} from "@/server/services/product.service";

/** The catalog changes without a rebuild, so these reads wait for a real request. */
async function ready() {
  await connection();
  await connectDatabase();
}

/** Plain JSON only: results are passed to Client Components. */
function toProduct(item: unknown): Product {
  const product = JSON.parse(JSON.stringify(item));
  delete product.category;
  return product as Product;
}

export const dbProductService: ProductService = {
  async listCategories() {
    await ready();
    return (await listPublishedCategories()) as Category[];
  },

  async listProducts(query: ProductListQuery = {}) {
    const paginated = await dbProductService.listProductsPaginated({
      ...query,
      page: 1,
      limit: 50,
    });
    return paginated.items;
  },

  async listProductsPaginated(params: ProductListParams = {}) {
    await ready();
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 12, 50);
    const { items, total } = await listPublishedProducts({
      page,
      limit,
      categorySlug: params.categorySlug,
      search: params.search,
      featured: params.featured,
      sort: params.sort ?? "featured",
    });
    return {
      items: items.map(toProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    } satisfies PaginatedProducts;
  },

  async listFeaturedProducts(limit = 12) {
    await ready();
    const items = await listFeaturedPublishedProducts(limit);
    return items.map(toProduct);
  },

  async getProductBySlug(slug, options) {
    if (options?.includeUnpublished) {
      return null;
    }
    await ready();
    const product = await getPublishedProductBySlug(slug);
    return product ? toProduct(product) : null;
  },

  /** Runs during the build from generateStaticParams, outside any request. */
  async getPublishedProductSlugs() {
    await connectDatabase();
    return getPublishedProductSlugs();
  },
};
