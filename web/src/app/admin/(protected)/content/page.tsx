import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditorClient } from "@/components/admin/ContentEditorClient";

export default function AdminContentPage() {
  return (
    <div>
      <AdminPageHeader
        title="Website content"
        description="Edit the text, photos, and project posts on your website. Saved changes go live straight away."
      />
      <ContentEditorClient />
    </div>
  );
}
