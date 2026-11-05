import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageLoader } from "./CatalogPageLoader";
import { PageIntro } from "@/components/layout/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LoadingState } from "@/components/ui/LoadingState";
import { getSiteContent } from "@/lib/content/get-site-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse Rasmi Building Materials Co. product categories, search the catalog, and request pricing for fixtures and finishing materials.",
  alternates: {
    canonical: `${siteConfig.url}/products`,
  },
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { products } = await getSiteContent();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />
      <PageIntro
        eyebrow={products.eyebrow}
        title={products.title}
        description={products.description}
        image={products.image}
      />
      <Suspense fallback={<LoadingState label="Loading catalog…" />}>
        <CatalogPageLoader searchParams={searchParams} />
      </Suspense>
    </>
  );
}
