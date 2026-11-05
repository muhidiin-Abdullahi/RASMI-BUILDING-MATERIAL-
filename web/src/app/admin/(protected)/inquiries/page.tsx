import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InquiriesAdminClient } from "@/components/admin/InquiriesAdminClient";

export default function AdminInquiriesPage() {
  return (
    <div>
      <AdminPageHeader title="Inquiries" description="Review and update customer product inquiries." />
      <InquiriesAdminClient />
    </div>
  );
}
