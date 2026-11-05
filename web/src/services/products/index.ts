import { isFixtureCatalogMode } from "@/lib/api/config";
import { dbProductService } from "@/services/products/db-product-service";
import { fixtureProductService } from "@/services/products/fixture-product-service";
import type { ProductService } from "@/services/products/product-service";

/** Reads the catalog from MongoDB by default; fixtures when explicitly configured. */
export function getProductService(): ProductService {
  return isFixtureCatalogMode() ? fixtureProductService : dbProductService;
}

export type { ProductService } from "@/services/products/product-service";
