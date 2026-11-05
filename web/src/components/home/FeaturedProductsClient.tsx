"use client";

import { useState } from "react";
import type { ProductWithCategory } from "@/lib/products/presenters";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/ui/ProductGrid";

const ALL_PRODUCTS = "All Products";

type FeaturedProductsClientProps = {
  eyebrow: string;
  title: string;
  products: ProductWithCategory[];
};

export function FeaturedProductsClient({
  eyebrow,
  title,
  products,
}: FeaturedProductsClientProps) {
  const [activeFilter, setActiveFilter] = useState(ALL_PRODUCTS);

  // Built from the loaded products so a filter can never come up empty.
  const filters = [
    ALL_PRODUCTS,
    ...new Set(products.map((product) => product.categoryName)),
  ];
  const visibleProducts =
    activeFilter === ALL_PRODUCTS
      ? products
      : products.filter((product) => product.categoryName === activeFilter);

  return (
    <section className="bg-rbm-surface py-16 lg:py-24">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter featured products by category"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "shrink-0 rounded-sm border px-4 py-2 font-display text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "border-rbm-navy bg-rbm-navy text-white"
                  : "border-rbm-border bg-white text-rbm-text-primary hover:border-rbm-navy/50",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ProductGrid products={visibleProducts} className="xl:grid-cols-4" />
        </div>
      </Container>
    </section>
  );
}
