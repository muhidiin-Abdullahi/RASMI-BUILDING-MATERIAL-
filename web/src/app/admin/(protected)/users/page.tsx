import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsersAdminClient } from "@/components/admin/UsersAdminClient";

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader title="Administrators" description="Super administrators can provision and disable CMS accounts." />
      <UsersAdminClient />
    </div>
  );
}
