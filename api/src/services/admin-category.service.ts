import { CategoryModel } from "../models/Category.js";
import { ProductModel } from "../models/Product.js";
import { escapeRegex } from "../utils/slug.js";
import type { AdminCategoryBody } from "../validators/admin-category.validator.js";

function mapAdminCategory(doc: Record<string, unknown>, productCount?: number) {
  return {
    id: (doc._id as { toString(): string }).toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    image: doc.image,
    published: doc.published,
    productCount: productCount ?? 0,
    updatedAt: doc.updatedAt,
    createdAt: doc.createdAt,
  };
}

export async function listAdminCategories(search?: string) {
  const filter: Record<string, unknown> = {};
  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: regex }, { slug: regex }];
  }

  const docs = await CategoryModel.find(filter).sort({ name: 1 }).lean();
  const counts = await ProductModel.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  return docs.map((d) =>
    mapAdminCategory(d as Record<string, unknown>, countMap.get(String(d._id)) ?? 0),
  );
}

export async function getAdminCategoryById(id: string) {
  const doc = await CategoryModel.findById(id).lean();
  if (!doc) return null;
  const productCount = await ProductModel.countDocuments({ category: id });
  return mapAdminCategory(doc as Record<string, unknown>, productCount);
}

export async function createAdminCategory(body: AdminCategoryBody) {
  const existing = await CategoryModel.findOne({ slug: body.slug.toLowerCase() }).select("_id").lean();
  if (existing) {
    throw Object.assign(new Error("Category slug already exists"), { status: 409, code: "DUPLICATE_SLUG" });
  }

  const doc = await CategoryModel.create({
    name: body.name,
    slug: body.slug,
    description: body.description,
    image: body.image ?? "",
    published: body.published,
  });

  return getAdminCategoryById(doc._id.toString());
}

export async function updateAdminCategory(id: string, body: AdminCategoryBody) {
  const category = await CategoryModel.findById(id);
  if (!category) return null;

  const slugConflict = await CategoryModel.findOne({
    slug: body.slug.toLowerCase(),
    _id: { $ne: id },
  })
    .select("_id")
    .lean();
  if (slugConflict) {
    throw Object.assign(new Error("Category slug already exists"), { status: 409, code: "DUPLICATE_SLUG" });
  }

  category.name = body.name;
  category.slug = body.slug;
  category.description = body.description;
  category.image = body.image ?? "";
  category.published = body.published;
  await category.save();

  return getAdminCategoryById(id);
}

export async function deleteAdminCategory(id: string) {
  const productCount = await ProductModel.countDocuments({ category: id });
  if (productCount > 0) {
    throw Object.assign(new Error("Category has associated products"), {
      status: 409,
      code: "CATEGORY_HAS_PRODUCTS",
      productCount,
    });
  }
  const result = await CategoryModel.findByIdAndDelete(id);
  return Boolean(result);
}
