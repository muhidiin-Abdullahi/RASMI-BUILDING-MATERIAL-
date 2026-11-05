import {
  developmentCategories,
  developmentProducts,
} from "@/data/fixtures/catalog";
import { filterAndSortProducts } from "@/lib/products/query";
import type { ProductListQuery } from "@/types/product";
import type {
  PaginatedProducts,
  ProductListParams,
  ProductService,
} from "@/services/products/product-service";

export const fixtureProductService: ProductService = {
  async listCategories() {
    return developmentCategories.filter((category) => category.published);
  },

  async listProducts(query: ProductListQuery = {}) {
    return filterAndSortProducts(
      developmentProducts,
      developmentCategories,
      query,
    );
  },

  async listProductsPaginated(params: ProductListParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 12;
    const filtered = filterAndSortProducts(
      developmentProducts,
      developmentCategories,
      {
        categorySlug: params.categorySlug,
        search: params.search,
        sort: params.sort,
        publishedOnly: params.publishedOnly ?? true,
      },
    ).filter((product) => (params.featured ? product.featured : true));

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    } satisfies PaginatedProducts;
  },

  async listFeaturedProducts(limit = 12) {
    return developmentProducts
      .filter((product) => product.published && product.featured)
      .slice(0, limit);
  },

  async getProductBySlug(slug, options) {
    const product = developmentProducts.find((item) => item.slug === slug);
    if (!product) {
      return null;
    }
    if (!product.published && !options?.includeUnpublished) {
      return null;
    }
    return product;
  },

  async getPublishedProductSlugs() {
    return developmentProducts
      .filter((product) => product.published)
      .map((product) => product.slug);
  },
};
