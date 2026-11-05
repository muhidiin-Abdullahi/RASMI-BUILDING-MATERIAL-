import type {
  Category,
  Product,
  ProductListQuery,
} from "@/types/product";
import type { PaginationMeta } from "@/types/api";

export type PaginatedProducts = {
  items: Product[];
  pagination: PaginationMeta;
};

export type ProductListParams = ProductListQuery & {
  page?: number;
  limit?: number;
  featured?: boolean;
};

/**
 * Catalog data access boundary for fixtures or REST API.
 */
export interface ProductService {
  listCategories(): Promise<Category[]>;
  listProducts(query?: ProductListQuery): Promise<Product[]>;
  listProductsPaginated(query?: ProductListParams): Promise<PaginatedProducts>;
  listFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductBySlug(
    slug: string,
    options?: { includeUnpublished?: boolean },
  ): Promise<Product | null>;
  getPublishedProductSlugs(): Promise<string[]>;
}
