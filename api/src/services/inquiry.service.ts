import { InquiryModel } from "../models/Inquiry.js";
import { ProductModel } from "../models/Product.js";

export type CreateInquiryInput = {
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  productSlug?: string;
  productName?: string;
};

export async function createInquiry(input: CreateInquiryInput) {
  let productId: string | undefined;

  if (input.productSlug) {
    const product = await ProductModel.findOne({
      slug: input.productSlug,
      published: true,
    })
      .select("_id name slug")
      .lean();
    if (product) {
      productId = product._id.toString();
    }
  }

  const inquiry = await InquiryModel.create({
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    message: input.message,
    product: productId,
    productSlug: input.productSlug,
    productName: input.productName,
    status: "new",
  });

  return {
    id: inquiry._id.toString(),
    reference: `INQ-${inquiry._id.toString().slice(-8).toUpperCase()}`,
  };
}
