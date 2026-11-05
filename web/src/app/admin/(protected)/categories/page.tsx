import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";

export default function AdminCategoriesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organize products into website categories."
        action={{ href: "/admin/categories/new", label: "New category" }}
      />
      <CategoriesAdminClient />
    </div>
  );
}
