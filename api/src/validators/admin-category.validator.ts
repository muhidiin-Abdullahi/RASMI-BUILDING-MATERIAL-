import { z } from "zod";

export const adminCategoryBodySchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(2000),
  image: z.string().trim().max(2000).optional(),
  published: z.boolean().default(true),
});

export type AdminCategoryBody = z.infer<typeof adminCategoryBodySchema>;

export const adminCategoryListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});
