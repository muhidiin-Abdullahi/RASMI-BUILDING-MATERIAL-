import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

const inquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    email: { type: String, trim: true, maxlength: 160, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    productSlug: { type: String, trim: true, maxlength: 200 },
    productName: { type: String, trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ["new", "in_progress", "responded", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

export type InquiryDocument = InferSchemaType<typeof inquirySchema> & {
  _id: Types.ObjectId;
};

export const InquiryModel = (
  mongoose.models.Inquiry ??
  mongoose.model("Inquiry", inquirySchema)
) as mongoose.Model<InquiryDocument>;
