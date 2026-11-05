import { z } from "zod";

export const inquiryStatusSchema = z.enum([
  "new",
  "in_progress",
  "responded",
  "closed",
]);

export const adminInquiryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: inquiryStatusSchema.optional(),
  search: z.string().trim().max(120).optional(),
});

export const adminInquiryStatusBodySchema = z.object({
  status: inquiryStatusSchema,
});
