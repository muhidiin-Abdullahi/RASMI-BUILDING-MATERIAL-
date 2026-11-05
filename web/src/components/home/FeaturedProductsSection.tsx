import { unstable_rethrow } from "next/navigation";
import { getSiteContent } from "@/lib/content/get-site-content";
import { attachCategoryToProducts } from "@/lib/products/presenters";
import { getProductService } from "@/services/products";
import { FeaturedProductsClient } from "@/components/home/FeaturedProductsClient";

async function loadFeaturedProducts() {
  const service = getProductService();
  const categories = await service.listCategories();
  const featured = await service.listFeaturedProducts(8);
  return attachCategoryToProducts(featured, categories);
}

export async function FeaturedProductsSection() {
  const { home } = await getSiteContent();
  let products;
  try {
    products = await loadFeaturedProducts();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <FeaturedProductsClient
      eyebrow={home.featuredEyebrow}
      title={home.featuredTitle}
      products={products}
    />
  );
}
