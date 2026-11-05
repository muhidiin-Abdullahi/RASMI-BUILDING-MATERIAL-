import { updateAdminInquiryStatus } from "@/server/services/admin-inquiry.service";
import { recordAudit } from "@/server/services/audit.service";
import { adminInquiryStatusBodySchema } from "@/server/validators/admin-inquiry.validator";
import { adminRoute, assertMongoId, fail, ok, readBody } from "@/server/http";

export const PATCH = adminRoute<{ id: string }>(async (req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  const { status } = await readBody(req, adminInquiryStatusBodySchema);
  const inquiry = await updateAdminInquiryStatus(id, status);
  if (!inquiry) {
    return fail(404, "Inquiry not found", "NOT_FOUND");
  }
  await recordAudit({
    actorId: admin.id,
    action: "inquiry.status_update",
    resourceType: "inquiry",
    resourceId: id,
    metadata: { status },
  });
  return ok(inquiry);
});
