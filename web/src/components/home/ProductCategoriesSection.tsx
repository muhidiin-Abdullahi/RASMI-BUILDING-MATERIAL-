import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductService } from "@/services/products";

export async function ProductCategoriesSection() {
  const { home } = await getSiteContent();
  let categories;
  try {
    categories = await getProductService().listCategories();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={home.categoriesEyebrow}
            title={home.categoriesTitle}
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-rbm-navy hover:text-rbm-orange"
          >
            View all products
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
