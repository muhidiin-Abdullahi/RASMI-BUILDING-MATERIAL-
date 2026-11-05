import type { ProductWithCategory } from "@/lib/products/presenters";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/cn";

type ProductGridProps = {
  products: ProductWithCategory[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="min-h-full">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
