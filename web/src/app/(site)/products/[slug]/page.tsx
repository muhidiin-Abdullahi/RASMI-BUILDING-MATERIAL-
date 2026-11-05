import type { Metadata } from "next";
import { Suspense } from "react";
import { unstable_rethrow } from "next/navigation";
import { ProductDetailLoader } from "./ProductDetailLoader";
import { LoadingState } from "@/components/ui/LoadingState";
import { getProductService } from "@/services/products";
import { siteConfig } from "@/lib/site-config";

type ProductDetailPageProps = PageProps<"/products/[slug]">;

export async function generateStaticParams() {
  try {
    const slugs = await getProductService().getPublishedProductSlugs();
    if (slugs.length > 0) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch {
    // The database may be unavailable at build time; fall back to fixture slugs.
  }

  const { developmentProducts } = await import("@/data/fixtures/catalog");
  return developmentProducts
    .filter((product) => product.published)
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductService().getProductBySlug(slug);
    if (product) {
      const canonical = `${siteConfig.url}/products/${product.slug}`;
      const image = product.images[0]?.url;
      return {
        title: product.name,
        description: product.shortDescription,
        alternates: { canonical },
        openGraph: {
          title: product.name,
          description: product.shortDescription,
          url: canonical,
          type: "website",
          images: image ? [{ url: image }] : undefined,
        },
      };
    }
  } catch (error) {
    unstable_rethrow(error);
    // Metadata falls back below when the database is unavailable.
  }

  return {
    title: slug.replace(/-/g, " "),
    description: "Product details — Rasmi Building Materials Co.",
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <Suspense fallback={<LoadingState label="Loading product details…" />}>
      <ProductDetailLoader params={params} />
    </Suspense>
  );
}
