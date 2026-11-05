import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function AdminNewCategoryPage() {
  return (
    <div>
      <AdminPageHeader title="New category" />
      <CategoryForm />
    </div>
  );
}
