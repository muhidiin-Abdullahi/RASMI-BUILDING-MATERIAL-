import { createInquiry } from "@/server/services/inquiry.service";
import { createInquirySchema } from "@/server/validators/inquiry.validator";
import { enforceRateLimit } from "@/server/rate-limit";
import { ok, readBody, route } from "@/server/http";

export const POST = route(async (req) => {
  enforceRateLimit(req, "inquiry", Number(process.env.INQUIRY_RATE_LIMIT_MAX ?? 20));
  const body = await readBody(req, createInquirySchema);
  const result = await createInquiry({
    fullName: body.fullName,
    phone: body.phone,
    email: body.email || undefined,
    message: body.message,
    productSlug: body.productSlug,
    productName: body.productName,
  });
  return ok(result, 201);
});
