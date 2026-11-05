import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/product";
import { CatalogImage } from "@/components/ui/CatalogImage";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative isolate flex aspect-[4/3] flex-col sm:aspect-[4/5] justify-end overflow-hidden rounded-sm bg-rbm-navy text-white"
    >
      <CatalogImage
        src={category.image}
        alt=""
        fill
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-rbm-navy-deep via-rbm-navy-deep/45 to-transparent"
        aria-hidden
      />
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
          {category.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/85">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 border-b border-rbm-orange-bright pb-1 font-display text-xs font-semibold tracking-wide">
          Explore category
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
