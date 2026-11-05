import { z } from "zod";
import { ADMIN_ROLES } from "../models/AdminUser";

export const createAdminUserBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(12).max(128),
  role: z.enum(ADMIN_ROLES).default("ADMIN"),
  active: z.boolean().default(true),
});

export const updateAdminUserBodySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  active: z.boolean().optional(),
});

export const resetAdminPasswordBodySchema = z.object({
  newPassword: z.string().min(12).max(128),
});
