import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { loadCategoryOptions } from "@/lib/admin/server-data";

export default function AdminNewProductPage() {
  return (
    <Suspense fallback={<p className="text-sm">Loading…</p>}>
      <AdminNewProductContent />
    </Suspense>
  );
}

async function AdminNewProductContent() {
  const categories = await loadCategoryOptions();

  return (
    <div>
      <AdminPageHeader title="New product" description="Create a catalog product." />
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
