import { listAdminInquiries } from "@/server/services/admin-inquiry.service";
import { adminInquiryListQuerySchema } from "@/server/validators/admin-inquiry.validator";
import { adminRoute, okPaginated, readQuery } from "@/server/http";

export const GET = adminRoute(async (req) => {
  const query = readQuery(req, adminInquiryListQuerySchema);
  const { items, total } = await listAdminInquiries(query);
  return okPaginated(items, query.page, query.limit, total);
});
