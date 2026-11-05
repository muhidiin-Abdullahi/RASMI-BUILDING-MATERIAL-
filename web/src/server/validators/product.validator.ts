import { z } from "zod";

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().max(120).optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  sort: z.enum(["featured", "name-asc", "name-desc"]).default("featured"),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
