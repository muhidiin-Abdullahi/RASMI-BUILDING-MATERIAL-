import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

const adminSessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    refreshTokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String, trim: true, maxlength: 500 },
    ipAddress: { type: String, trim: true, maxlength: 64 },
  },
  { timestamps: true },
);

adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminSessionDocument = InferSchemaType<typeof adminSessionSchema> & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
};

export const AdminSessionModel = (
  mongoose.models.AdminSession ??
  mongoose.model("AdminSession", adminSessionSchema)
) as mongoose.Model<AdminSessionDocument>;
