import { z } from "zod";

const imageSchema = z.object({
  url: z.string().trim().min(1).max(2000),
  alt: z.string().trim().min(1).max(300),
});

const specSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(500),
});

export const adminProductBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i),
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(5000),
  images: z.array(imageSchema).max(20).default([]),
  specifications: z.array(specSchema).max(50).default([]),
  brand: z.string().trim().max(120).optional(),
  sku: z.string().trim().max(80).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().trim().max(8).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type AdminProductBody = z.infer<typeof adminProductBodySchema>;

export const adminProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  category: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  search: z.string().trim().max(120).optional(),
  published: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});
