import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(12).max(128),
});

export const mongoIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
});
