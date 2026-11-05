import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { loadAdminProduct, loadCategoryOptions } from "@/lib/admin/server-data";

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  category: { id?: string } | null;
  shortDescription: string;
  description: string;
  brand?: string;
  sku?: string;
  price?: number;
  currency?: string;
  featured: boolean;
  published: boolean;
  images: Array<{ url: string; alt: string }>;
  specifications: Array<{ label: string; value: string }>;
};

export default function AdminEditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  return (
    <Suspense fallback={<p className="text-sm">Loading…</p>}>
      <AdminEditProductContent params={params} />
    </Suspense>
  );
}

async function AdminEditProductContent({
  params,
}: {
  params: PageProps<"/admin/products/[id]/edit">["params"];
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    loadAdminProduct<ProductDetail>(id),
    loadCategoryOptions(),
  ]);

  if (!product) {
    notFound();
  }

  const firstImage = product.images[0];

  return (
    <div>
      <AdminPageHeader title="Edit product" description={product.name} />
      <ProductForm
        productId={product.id}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          name: product.name,
          slug: product.slug,
          categoryId: product.category?.id ?? "",
          shortDescription: product.shortDescription,
          description: product.description,
          brand: product.brand ?? "",
          sku: product.sku ?? "",
          price: product.price != null ? String(product.price) : "",
          currency: product.currency ?? "USD",
          featured: product.featured,
          published: product.published,
          imageUrl: firstImage?.url ?? "",
          imageAlt: firstImage?.alt ?? "",
          specifications: product.specifications.length
            ? product.specifications
            : [{ label: "", value: "" }],
        }}
      />
    </div>
  );
}
