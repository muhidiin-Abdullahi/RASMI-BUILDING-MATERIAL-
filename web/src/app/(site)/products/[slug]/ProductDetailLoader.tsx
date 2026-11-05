import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInquiryActions } from "@/components/product/ProductInquiryActions";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { isFixtureCatalogMode } from "@/lib/api/config";
import { getCategoryById, getRelatedProducts } from "@/lib/products/query";
import { attachCategoryToProducts } from "@/lib/products/presenters";
import { getProductService } from "@/services/products";

type ProductDetailLoaderProps = {
  params: Promise<{ slug: string }>;
};

export async function ProductDetailLoader({ params }: ProductDetailLoaderProps) {
  const { slug } = await params;
  const service = getProductService();
  const product = await service.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [categories, allPublished] = await Promise.all([
    service.listCategories(),
    service.listProducts({ publishedOnly: true }),
  ]);

  const category = getCategoryById(categories, product.categoryId);
  const related = attachCategoryToProducts(
    getRelatedProducts(allPublished, product, 4),
    categories,
  );

  const showPrice =
    typeof product.price === "number" && product.currency && product.price > 0;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          {
            label: category?.name ?? "Category",
            href: category ? `/products?category=${category.slug}` : "/products",
          },
          { label: product.name },
        ]}
      />

      <Container className="py-10 lg:py-14">
        {isFixtureCatalogMode() ? (
          <div className="mb-4 rounded-sm border border-rbm-border bg-rbm-surface px-3 py-2 text-xs text-rbm-text-secondary">
            Development fixture product record — not confirmed inventory.
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            {category ? (
              <p className="font-display text-sm font-semibold text-rbm-orange">
                {category.name}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-rbm-text-primary sm:text-5xl">
              {product.name}
            </h1>
            <p className="rbm-prose mt-4">{product.description}</p>

            {product.brand || product.sku ? (
              <dl className="mt-6 grid gap-3 rounded-sm border border-rbm-border bg-rbm-surface p-4 text-sm sm:grid-cols-2">
                {product.brand ? (
                  <div>
                    <dt className="font-semibold text-rbm-text-primary">Brand</dt>
                    <dd className="text-rbm-text-secondary">{product.brand}</dd>
                  </div>
                ) : null}
                {product.sku ? (
                  <div>
                    <dt className="font-semibold text-rbm-text-primary">SKU</dt>
                    <dd className="text-rbm-text-secondary">{product.sku}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {showPrice ? (
              <p className="mt-6 text-2xl font-semibold text-rbm-navy">
                {new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: product.currency,
                }).format(product.price ?? 0)}
              </p>
            ) : (
              <p className="mt-6 text-sm font-medium text-rbm-text-secondary">
                Pricing available on request.
              </p>
            )}

            <div className="mt-8">
              <ProductInquiryActions
                product={{ slug: product.slug, name: product.name }}
              />
            </div>
          </div>
        </div>

        {product.specifications.length > 0 ? (
          <section className="mt-12" aria-labelledby="product-specifications">
            <h2
              id="product-specifications"
              className="font-display text-2xl font-semibold tracking-tight text-rbm-text-primary"
            >
              Specifications
            </h2>
            <div className="mt-4 overflow-x-auto rounded-sm border border-rbm-border">
              <table className="min-w-full text-left text-sm">
                <tbody>
                  {product.specifications.map((spec) => (
                    <tr key={spec.label} className="border-b border-rbm-border last:border-0">
                      <th className="w-1/3 bg-rbm-surface px-4 py-3 font-semibold text-rbm-text-primary">
                        {spec.label}
                      </th>
                      <td className="px-4 py-3 text-rbm-text-secondary">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </Container>

      <RelatedProducts products={related} />
    </>
  );
}
