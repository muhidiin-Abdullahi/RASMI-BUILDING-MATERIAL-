import type { ProductWithCategory } from "@/lib/products/presenters";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/ui/ProductGrid";

type RelatedProductsProps = {
  products: ProductWithCategory[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-rbm-border bg-rbm-surface py-14 lg:py-16">
      <Container>
        <SectionHeading title="Related Products" />
        <div className="mt-8">
          <ProductGrid products={products} className="xl:grid-cols-4" />
        </div>
      </Container>
    </section>
  );
}
