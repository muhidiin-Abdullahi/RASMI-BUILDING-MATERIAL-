import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsClient } from "@/components/admin/SettingsClient";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="Settings" description="Account and security preferences." />
      <SettingsClient />
    </div>
  );
}
