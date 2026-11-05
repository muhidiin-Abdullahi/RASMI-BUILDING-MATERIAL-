import type { Category, Product, ProductListQuery, ProductSortOption } from "@/types/product";

export function normalizeSearchTerm(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function isValidCategorySlug(
  slug: string | undefined,
  categories: Category[],
): slug is string {
  if (!slug) {
    return false;
  }
  return categories.some(
    (category) => category.published && category.slug === slug,
  );
}

export function parseSortOption(value: string | undefined): ProductSortOption {
  if (value === "name-asc" || value === "name-desc" || value === "featured") {
    return value;
  }
  return "featured";
}

function productMatchesSearch(product: Product, search: string): boolean {
  if (!search) {
    return true;
  }
  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    product.sku ?? "",
    product.brand ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(search);
}

export function filterAndSortProducts(
  products: Product[],
  categories: Category[],
  query: ProductListQuery,
): Product[] {
  const publishedOnly = query.publishedOnly ?? true;
  const search = normalizeSearchTerm(query.search);
  const category = categories.find((c) => c.slug === query.categorySlug);

  let result = products.filter((product) => {
    if (publishedOnly && !product.published) {
      return false;
    }
    if (query.categorySlug && product.categoryId !== category?.id) {
      return false;
    }
    return productMatchesSearch(product, search);
  });

  const sort = query.sort ?? "featured";
  result = [...result].sort((a, b) => {
    if (sort === "featured") {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    }
    if (sort === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return a.name.localeCompare(b.name);
  });

  return result;
}

export function getCategoryById(
  categories: Category[],
  categoryId: string,
): Category | undefined {
  return categories.find((category) => category.id === categoryId);
}

export function getRelatedProducts(
  products: Product[],
  current: Product,
  limit = 4,
): Product[] {
  return products
    .filter(
      (product) =>
        product.published &&
        product.id !== current.id &&
        product.categoryId === current.categoryId,
    )
    .slice(0, limit);
}
