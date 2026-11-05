import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsAdminClient } from "@/components/admin/ProductsAdminClient";
import { loadCategoryOptions } from "@/lib/admin/server-data";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="text-sm">Loading…</p>}>
      <AdminProductsContent />
    </Suspense>
  );
}

async function AdminProductsContent() {
  const categories = await loadCategoryOptions();

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage catalog products, publication status, and images."
        action={{ href: "/admin/products/new", label: "New product" }}
      />
      <ProductsAdminClient categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
