"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { PaginationMeta } from "@/types/api";
import type { Category, Product } from "@/types/product";
import {
  isValidCategorySlug,
  normalizeSearchTerm,
  parseSortOption,
} from "@/lib/products/query";
import { attachCategoryToProducts } from "@/lib/products/presenters";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

type CatalogViewProps = {
  categories: Category[];
  products: Product[];
  pagination?: PaginationMeta;
  serverFiltered?: boolean;
};

export function CatalogView({
  categories,
  products,
  pagination,
  serverFiltered = false,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categorySlugParam = searchParams.get("category") ?? undefined;
  const searchParam = searchParams.get("q") ?? "";
  const sortParam = parseSortOption(searchParams.get("sort") ?? undefined);

  const [searchInput, setSearchInput] = useState(searchParam);

  const activeCategorySlug = isValidCategorySlug(categorySlugParam, categories)
    ? categorySlugParam
    : undefined;

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Check for the key, not its value: clearing a filter passes undefined and
      // must also return to page 1, or the shorter list can land on an empty page.
      if ("category" in updates || "q" in updates || "sort" in updates) {
        params.delete("page");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const productsWithCategory = useMemo(
    () => attachCategoryToProducts(products, categories),
    [categories, products],
  );

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = normalizeSearchTerm(searchInput);
    updateParams({ q: normalized || undefined });
  }

  function clearFilters() {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }

  const hasActiveFilters =
    Boolean(activeCategorySlug) || Boolean(normalizeSearchTerm(searchParam));

  return (
    <Container className="py-10 lg:py-14">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="rbm-card sticky top-24 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-rbm-navy">
                Categories
              </h2>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-display text-sm font-semibold text-rbm-orange hover:text-rbm-navy"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => updateParams({ category: undefined })}
                  className={cn(
                    "w-full rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors",
                    !activeCategorySlug
                      ? "bg-rbm-navy text-white"
                      : "text-rbm-text-primary hover:bg-rbm-surface",
                  )}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: category.slug })}
                    className={cn(
                      "w-full rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors",
                      activeCategorySlug === category.slug
                        ? "bg-rbm-navy text-white"
                        : "text-rbm-text-primary hover:bg-rbm-surface",
                    )}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <form onSubmit={handleSearchSubmit} className="rbm-card flex gap-2 p-2">
            <label htmlFor="catalog-search" className="sr-only">
              Search products
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rbm-text-secondary"
                aria-hidden
              />
              <input
                id="catalog-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name or description"
                className="rbm-input pl-9"
              />
            </div>
            <button
              type="submit"
              className="rounded-sm bg-rbm-navy px-5 py-2 font-display text-sm font-semibold text-white hover:bg-rbm-navy-deep"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rbm-text-secondary">
              Showing{" "}
              <span className="font-semibold text-rbm-text-primary">
                {productsWithCategory.length}
              </span>{" "}
              product{productsWithCategory.length === 1 ? "" : "s"}
              {pagination ? (
                <>
                  {" "}
                  (page {pagination.page} of {Math.max(pagination.totalPages, 1)})
                </>
              ) : null}
              {activeCategory ? (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-rbm-text-primary">
                    {activeCategory.name}
                  </span>
                </>
              ) : null}
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="catalog-sort"
                className="text-sm font-medium text-rbm-text-secondary"
              >
                Sort
              </label>
              <select
                id="catalog-sort"
                value={sortParam}
                onChange={(event) =>
                  updateParams({
                    sort:
                      event.target.value === "featured"
                        ? undefined
                        : event.target.value,
                  })
                }
                className="rbm-select w-auto min-w-[180px]"
              >
                <option value="featured">Featured first</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined })}
              className={cn(
                "shrink-0 rounded-sm border px-3 py-2 font-display text-sm font-medium",
                !activeCategorySlug
                  ? "border-rbm-navy bg-rbm-navy text-white"
                  : "border-rbm-border bg-white",
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => updateParams({ category: category.slug })}
                className={cn(
                  "shrink-0 rounded-sm border px-3 py-2 font-display text-sm font-medium",
                  activeCategorySlug === category.slug
                    ? "border-rbm-navy bg-rbm-navy text-white"
                    : "border-rbm-border bg-white",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {normalizeSearchTerm(searchParam) ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-sm border border-rbm-border bg-white px-3 py-1 text-xs text-rbm-text-secondary">
                Search:{" "}
                <strong className="text-rbm-text-primary">{searchParam}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateParams({ q: undefined });
                }}
                className="inline-flex items-center gap-1 font-display text-sm font-semibold text-rbm-orange"
              >
                <X className="h-3 w-3" aria-hidden />
                Clear search
              </button>
            </div>
          ) : null}

          <div className="mt-8">
            {productsWithCategory.length > 0 ? (
              <>
                <ProductGrid products={productsWithCategory} />
                {pagination && pagination.totalPages > 1 ? (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() =>
                        updateParams({ page: String(pagination.page - 1) })
                      }
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-rbm-text-secondary">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() =>
                        updateParams({ page: String(pagination.page + 1) })
                      }
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title="No products match your filters"
                description={
                  serverFiltered
                    ? "Try another category or search term, or reset the catalog filters."
                    : "No published products are available for the selected filters."
                }
                actionHref="/products"
                actionLabel="Reset catalog"
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
