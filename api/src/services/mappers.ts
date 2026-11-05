import type { Types } from "mongoose";
import type { CategoryDocument } from "../models/Category.js";
import type { ProductDocument } from "../models/Product.js";

type PopulatedCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image?: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type PopulatedProduct = ProductDocument & {
  category?: PopulatedCategory | Types.ObjectId;
};

function toIso(value?: Date | string) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
}

export function mapCategory(doc: CategoryDocument | PopulatedCategory) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    image: doc.image ?? "",
    published: doc.published,
    createdAt: toIso((doc as { createdAt?: Date }).createdAt),
    updatedAt: toIso((doc as { updatedAt?: Date }).updatedAt),
  };
}

export function mapProduct(doc: PopulatedProduct) {
  const category =
    doc.category && typeof doc.category === "object" && "slug" in doc.category
      ? doc.category
      : undefined;

  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    categoryId: category?._id?.toString() ?? doc.category?.toString() ?? "",
    description: doc.description,
    shortDescription: doc.shortDescription,
    images: doc.images ?? [],
    specifications: doc.specifications ?? [],
    brand: doc.brand ?? undefined,
    sku: doc.sku ?? undefined,
    price: typeof doc.price === "number" ? doc.price : undefined,
    currency: doc.currency ?? undefined,
    featured: doc.featured,
    published: doc.published,
    createdAt: toIso((doc as { createdAt?: Date }).createdAt),
    updatedAt: toIso((doc as { updatedAt?: Date }).updatedAt),
    category: category
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : undefined,
  };
}
