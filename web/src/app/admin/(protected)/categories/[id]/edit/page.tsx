import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { loadAdminCategory } from "@/lib/admin/server-data";

type CategoryDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  published: boolean;
};

export default function AdminEditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]/edit">) {
  return (
    <Suspense fallback={<p className="text-sm">Loading…</p>}>
      <AdminEditCategoryContent params={params} />
    </Suspense>
  );
}

async function AdminEditCategoryContent({
  params,
}: {
  params: PageProps<"/admin/categories/[id]/edit">["params"];
}) {
  const { id } = await params;
  const category = await loadAdminCategory<CategoryDetail>(id);
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit category" description={category.name} />
      <CategoryForm
        categoryId={category.id}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          published: category.published,
        }}
      />
    </div>
  );
}
