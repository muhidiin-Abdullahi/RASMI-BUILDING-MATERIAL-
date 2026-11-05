import type { Category, Product } from "@/types/product";

export type ProductWithCategory = Product & {
  categoryName: string;
  categorySlug: string;
};

export function attachCategoryToProducts(
  products: Product[],
  categories: Category[],
): ProductWithCategory[] {
  return products.map((product) => {
    const category = categories.find((item) => item.id === product.categoryId);
    return {
      ...product,
      categoryName: category?.name ?? "Category pending",
      categorySlug: category?.slug ?? "",
    };
  });
}

export function getPrimaryImage(product: Product): Product["images"][number] | undefined {
  return product.images[0];
}
