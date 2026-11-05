/**
 * @deprecated Import from `@/data/fixtures/catalog` or use `getProductService()`.
 */
export {
  developmentCategories as categoryFixtures,
  developmentProducts,
} from "@/data/fixtures/catalog";

import { developmentProducts } from "@/data/fixtures/catalog";
import type { Product } from "@/types/product";

/** @deprecated Use ProductService.getProductBySlug */
export function getProductFixtureBySlug(slug: string): Product | undefined {
  return developmentProducts.find(
    (product) => product.slug === slug && product.published,
  );
}

/** @deprecated Use listProducts({ publishedOnly: true, sort: 'featured' }) */
export const featuredProductFixtures = developmentProducts.filter(
  (product) => product.published,
);
