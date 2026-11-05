import { CategoryModel } from "../models/Category";
import { ProductModel } from "../models/Product";
import { escapeRegex } from "../utils/slug";
import { mapProduct } from "./mappers";

export type ProductListParams = {
  page: number;
  limit: number;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  sort: "featured" | "name-asc" | "name-desc";
};

function buildSort(sort: ProductListParams["sort"]): Record<string, 1 | -1> {
  if (sort === "name-desc") {
    return { name: -1 };
  }
  if (sort === "name-asc") {
    return { name: 1 };
  }
  return { featured: -1, name: 1 };
}

export async function listPublishedProducts(params: ProductListParams) {
  const filter: Record<string, unknown> = { published: true };

  if (params.categorySlug) {
    const category = await CategoryModel.findOne({
      slug: params.categorySlug,
      published: true,
    })
      .select("_id")
      .lean();
    if (!category) {
      return { items: [], total: 0 };
    }
    filter.category = category._id;
  }

  if (params.featured) {
    filter.featured = true;
  }

  if (params.search?.trim()) {
    const term = escapeRegex(params.search.trim());
    const regex = new RegExp(term, "i");
    filter.$or = [
      { name: regex },
      { shortDescription: regex },
      { description: regex },
      { sku: regex },
      { brand: regex },
    ];
  }

  const skip = (params.page - 1) * params.limit;
  const sort = buildSort(params.sort);

  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(params.limit)
      .populate("category", "name slug")
      .select("-__v")
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    items: docs.map((doc) => mapProduct(doc)),
    total,
  };
}

export async function listFeaturedPublishedProducts(limit = 12) {
  const docs = await ProductModel.find({ published: true, featured: true })
    .sort({ name: 1 })
    .limit(Math.min(limit, 12))
    .populate("category", "name slug")
    .select("-__v")
    .lean();
  return docs.map((doc) => mapProduct(doc as never));
}

export async function getPublishedProductBySlug(slug: string) {
  const doc = await ProductModel.findOne({ slug, published: true })
    .populate("category", "name slug description image published")
    .select("-__v")
    .lean();
  return doc ? mapProduct(doc as never) : null;
}

export async function getPublishedProductSlugs() {
  const docs = await ProductModel.find({ published: true }).select("slug").lean();
  return docs.map((doc) => doc.slug);
}
