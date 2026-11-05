import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";
import { normalizeSlug } from "../utils/slug";

const productImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { _id: false },
);

const productSpecificationSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    value: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true, maxlength: 500 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    images: { type: [productImageSchema], default: [] },
    specifications: { type: [productSpecificationSchema], default: [] },
    brand: { type: String, trim: true, maxlength: 120 },
    sku: { type: String, trim: true, maxlength: 80 },
    price: { type: Number, min: 0 },
    currency: { type: String, trim: true, maxlength: 8 },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

productSchema.pre("validate", function validateSlug(next) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
  next();
});

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
  category: Types.ObjectId;
};

export const ProductModel = (
  mongoose.models.Product ??
  mongoose.model("Product", productSchema)
) as mongoose.Model<ProductDocument>;
