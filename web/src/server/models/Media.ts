import mongoose, { Schema, type Types } from "mongoose";

/**
 * Uploaded images are stored in MongoDB. Files written to public/ at runtime are
 * not served by `next start`, and this keeps uploads working on any host.
 */
const mediaSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true, maxlength: 200 },
    contentType: { type: String, required: true, maxlength: 40 },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false },
  },
  { timestamps: true },
);

export type MediaDocument = {
  _id: Types.ObjectId;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  createdAt?: Date;
};

export const MediaModel = (
  mongoose.models.Media ?? mongoose.model("Media", mediaSchema)
) as mongoose.Model<MediaDocument>;
