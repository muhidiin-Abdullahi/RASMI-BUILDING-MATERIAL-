import mongoose from "mongoose";
import { ProductModel } from "../models/Product";
import { CategoryModel } from "../models/Category";
import { escapeRegex } from "../utils/slug";
import type { AdminProductBody } from "../validators/admin-product.validator";

function mapAdminProduct(doc: Record<string, unknown>) {
  const category = doc.category as { _id?: { toString(): string }; name?: string; slug?: string } | null;
  return {
    id: (doc._id as { toString(): string }).toString(),
    name: doc.name,
    slug: doc.slug,
    category: category
      ? {
          id: category._id?.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
    shortDescription: doc.shortDescription,
    description: doc.description,
    images: doc.images ?? [],
    specifications: doc.specifications ?? [],
    brand: doc.brand,
    sku: doc.sku,
    price: doc.price,
    currency: doc.currency,
    featured: doc.featured,
    published: doc.published,
    updatedAt: doc.updatedAt,
    createdAt: doc.createdAt,
  };
}

export async function listAdminProducts(params: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  published?: boolean;
}) {
  const filter: Record<string, unknown> = {};
  if (params.category) {
    filter.category = new mongoose.Types.ObjectId(params.category);
  }
  if (params.published !== undefined) {
    filter.published = params.published;
  }
  if (params.search?.trim()) {
    const regex = new RegExp(escapeRegex(params.search.trim()), "i");
    filter.$or = [{ name: regex }, { slug: regex }, { sku: regex }];
  }

  const skip = (params.page - 1) * params.limit;
  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(params.limit)
      .populate("category", "name slug")
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return { items: docs.map((d) => mapAdminProduct(d as Record<string, unknown>)), total };
}

export async function getAdminProductById(id: string) {
  const doc = await ProductModel.findById(id).populate("category", "name slug").lean();
  if (!doc) return null;
  return mapAdminProduct(doc as Record<string, unknown>);
}

async function assertCategoryExists(categoryId: string) {
  const exists = await CategoryModel.exists({ _id: categoryId });
  if (!exists) {
    throw Object.assign(new Error("Category not found"), { status: 400, code: "INVALID_CATEGORY" });
  }
}

export async function createAdminProduct(body: AdminProductBody) {
  await assertCategoryExists(body.categoryId);
  const existing = await ProductModel.findOne({ slug: body.slug.toLowerCase() }).select("_id").lean();
  if (existing) {
    throw Object.assign(new Error("Product slug already exists"), { status: 409, code: "DUPLICATE_SLUG" });
  }

  const doc = await ProductModel.create({
    name: body.name,
    slug: body.slug,
    category: body.categoryId,
    shortDescription: body.shortDescription,
    description: body.description,
    images: body.images,
    specifications: body.specifications,
    brand: body.brand,
    sku: body.sku,
    price: body.price,
    currency: body.currency,
    featured: body.featured,
    published: body.published,
  });

  return getAdminProductById(doc._id.toString());
}

export async function updateAdminProduct(id: string, body: AdminProductBody) {
  await assertCategoryExists(body.categoryId);
  const product = await ProductModel.findById(id);
  if (!product) {
    return null;
  }

  const slugConflict = await ProductModel.findOne({
    slug: body.slug.toLowerCase(),
    _id: { $ne: id },
  })
    .select("_id")
    .lean();
  if (slugConflict) {
    throw Object.assign(new Error("Product slug already exists"), { status: 409, code: "DUPLICATE_SLUG" });
  }

  product.name = body.name;
  product.slug = body.slug;
  product.category = new mongoose.Types.ObjectId(body.categoryId);
  product.shortDescription = body.shortDescription;
  product.description = body.description;
  product.set("images", body.images);
  product.set("specifications", body.specifications);
  product.brand = body.brand;
  product.sku = body.sku;
  product.price = body.price;
  product.currency = body.currency;
  product.featured = body.featured;
  product.published = body.published;
  await product.save();

  return getAdminProductById(id);
}

export async function deleteAdminProduct(id: string) {
  const result = await ProductModel.findByIdAndDelete(id);
  return Boolean(result);
}
