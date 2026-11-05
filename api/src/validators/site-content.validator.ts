import { z } from "zod";

export const siteContentPatchSchema = z.object({
  entries: z
    .array(
      z.object({
        key: z.string().trim().min(1).max(80),
        value: z.string().trim().max(8000),
        label: z.string().trim().max(160).optional(),
      }),
    )
    .min(1)
    .max(50),
});
