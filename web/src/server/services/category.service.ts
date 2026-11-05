import { CategoryModel } from "../models/Category";
import { ProductModel } from "../models/Product";
import { mapCategory } from "./mappers";

export async function listPublishedCategories() {
  const docs = await CategoryModel.find({ published: true })
    .sort({ name: 1 })
    .select("name slug description image published createdAt updatedAt")
    .lean();
  return docs.map((doc) => mapCategory(doc));
}

export async function getPublishedCategoryBySlug(slug: string) {
  const doc = await CategoryModel.findOne({ slug, published: true })
    .select("name slug description image published createdAt updatedAt")
    .lean();
  return doc ? mapCategory(doc as never) : null;
}

export async function countProductsInCategory(categoryId: string) {
  return ProductModel.countDocuments({ category: categoryId, published: true });
}
