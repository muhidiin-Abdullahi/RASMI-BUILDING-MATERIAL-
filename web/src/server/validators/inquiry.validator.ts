import { z } from "zod";

export const createInquirySchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(5).max(40),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email",
    }),
  message: z.string().trim().min(5).max(5000),
  productSlug: z.string().trim().max(200).optional(),
  productName: z.string().trim().max(200).optional(),
});

export type CreateInquiryBody = z.infer<typeof createInquirySchema>;
