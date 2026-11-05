import { unstable_rethrow } from "next/navigation";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { isFixtureCatalogMode } from "@/lib/api/config";
import { parseSortOption } from "@/lib/products/query";
import { getSiteContent } from "@/lib/content/get-site-content";
import { getProductService } from "@/services/products";

type CatalogPageLoaderProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
};

async function loadCatalog(searchParams: CatalogPageLoaderProps["searchParams"]) {
  const params = await searchParams;
  const service = getProductService();
  const [categories, catalog] = await Promise.all([
    service.listCategories(),
    service.listProductsPaginated({
      categorySlug: params.category,
      search: params.q,
      sort: parseSortOption(params.sort),
      page: Number(params.page) > 0 ? Number(params.page) : 1,
      limit: 12,
      publishedOnly: true,
    }),
  ]);
  return { categories, catalog };
}

export async function CatalogPageLoader({ searchParams }: CatalogPageLoaderProps) {
  let data;
  try {
    data = await loadCatalog(searchParams);
  } catch (error) {
    unstable_rethrow(error);
    return (
      <ErrorState
        title="Our catalog is temporarily unavailable"
        description={`Please try again shortly, or call us on ${(await getSiteContent()).general.phone} for product information.`}
        retryHref="/products"
        retryLabel="Try Again"
        className="my-16"
      />
    );
  }

  return (
    <>
      {isFixtureCatalogMode() ? (
        <Container className="pt-4 text-xs text-rbm-text-secondary">
          Fixture catalog mode is active (`NEXT_PUBLIC_CATALOG_DATA_SOURCE=fixture`).
        </Container>
      ) : null}
      <CatalogView
        categories={data.categories}
        products={data.catalog.items}
        pagination={data.catalog.pagination}
        serverFiltered
      />
    </>
  );
}
