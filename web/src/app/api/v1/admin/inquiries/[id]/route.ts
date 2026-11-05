import { getAdminInquiryById } from "@/server/services/admin-inquiry.service";
import { adminRoute, assertMongoId, fail, ok } from "@/server/http";

export const GET = adminRoute<{ id: string }>(async (_req, { params }) => {
  const inquiry = await getAdminInquiryById(assertMongoId((await params).id));
  return inquiry ? ok(inquiry) : fail(404, "Inquiry not found", "NOT_FOUND");
});
