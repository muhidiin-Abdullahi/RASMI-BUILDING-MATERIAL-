import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, required: true, default: "ADMIN" },
    active: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema> & {
  _id: Types.ObjectId;
};

export const AdminUserModel = (
  mongoose.models.AdminUser ??
  mongoose.model("AdminUser", adminUserSchema)
) as mongoose.Model<AdminUserDocument>;

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}
