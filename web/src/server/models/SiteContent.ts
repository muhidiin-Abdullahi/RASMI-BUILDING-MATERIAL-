import mongoose, { Schema, type Types } from "mongoose";

/** One document per editable website section. See src/lib/content/schema.ts. */
const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true, minimize: false },
);

export type SiteContentDocument = {
  _id: Types.ObjectId;
  key: string;
  data?: Record<string, unknown>;
  updatedAt?: Date;
};

export const SiteContentModel = (
  mongoose.models.SiteContent ??
  mongoose.model("SiteContent", siteContentSchema)
) as mongoose.Model<SiteContentDocument>;
