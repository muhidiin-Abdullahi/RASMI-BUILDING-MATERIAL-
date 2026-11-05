import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    action: { type: String, required: true, trim: true, maxlength: 80 },
    resourceType: { type: String, required: true, trim: true, maxlength: 80 },
    resourceId: { type: String, trim: true, maxlength: 64 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema> & {
  _id: Types.ObjectId;
};

export const AuditLogModel = (
  mongoose.models.AuditLog ??
  mongoose.model("AuditLog", auditLogSchema)
) as mongoose.Model<AuditLogDocument>;
