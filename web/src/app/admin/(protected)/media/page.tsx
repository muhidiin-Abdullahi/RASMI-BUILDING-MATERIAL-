import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Upload photos here, then choose them when editing content, products, or categories."
      />
      <MediaLibrary />
    </div>
  );
}
