import { CategoryModel } from "../models/Category.js";
import { InquiryModel } from "../models/Inquiry.js";
import { ProductModel } from "../models/Product.js";

export async function getDashboardSummary() {
  const [publishedProducts, categories, pendingInquiries, recentInquiries, recentProducts] =
    await Promise.all([
      ProductModel.countDocuments({ published: true }),
      CategoryModel.countDocuments({}),
      InquiryModel.countDocuments({ status: { $in: ["new", "in_progress"] } }),
      InquiryModel.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName status productName createdAt")
        .lean(),
      ProductModel.find({})
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("name slug published updatedAt")
        .lean(),
    ]);

  return {
    metrics: {
      publishedProducts,
      categories,
      pendingInquiries,
      galleryItems: null as number | null,
    },
    recentInquiries: recentInquiries.map((i) => ({
      id: i._id.toString(),
      fullName: i.fullName,
      status: i.status,
      productName: i.productName,
      createdAt: i.createdAt,
    })),
    recentProducts: recentProducts.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      published: p.published,
      updatedAt: p.updatedAt,
    })),
  };
}
