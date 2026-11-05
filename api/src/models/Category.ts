import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";
import { normalizeSlug } from "../utils/slug.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    image: { type: String, trim: true, default: "" },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

categorySchema.pre("validate", function validateSlug(next) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
  next();
});

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: Types.ObjectId;
};

export const CategoryModel = (
  mongoose.models.Category ??
  mongoose.model("Category", categorySchema)
) as mongoose.Model<CategoryDocument>;
