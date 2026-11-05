import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductWithCategory } from "@/lib/products/presenters";
import { getPrimaryImage } from "@/lib/products/presenters";
import { buildContactInquiryUrl } from "@/lib/inquiry-links";
import { Button } from "@/components/ui/Button";
import { CatalogImage } from "@/components/ui/CatalogImage";

type ProductCardProps = {
  product: ProductWithCategory;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = getPrimaryImage(product);

  return (
    <article className="group rbm-card flex h-full flex-col overflow-hidden transition-colors hover:border-rbm-navy/40">
      <Link
        href={`/products/${product.slug}`}
        tabIndex={-1}
        className="relative block aspect-[4/3] overflow-hidden bg-rbm-surface"
      >
        <CatalogImage
          src={primaryImage?.url}
          alt={primaryImage?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {product.featured ? (
          <span className="absolute left-0 top-4 bg-rbm-navy px-3 py-1 font-display text-[11px] font-semibold tracking-wide text-white">
            Featured
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xs font-semibold tracking-wide text-rbm-orange">
          {product.categoryName}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-rbm-text-primary">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-rbm-navy hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-rbm-text-secondary">
          {product.shortDescription}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-rbm-border pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-rbm-navy hover:text-rbm-orange"
          >
            View details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Button
            href={buildContactInquiryUrl({ slug: product.slug, name: product.name })}
            size="sm"
          >
            Request price
          </Button>
        </div>
      </div>
    </article>
  );
}
