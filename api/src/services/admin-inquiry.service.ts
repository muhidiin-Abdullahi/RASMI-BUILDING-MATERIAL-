import { InquiryModel } from "../models/Inquiry.js";
import { escapeRegex } from "../utils/slug.js";

function mapAdminInquiry(doc: Record<string, unknown>) {
  return {
    id: (doc._id as { toString(): string }).toString(),
    fullName: doc.fullName,
    phone: doc.phone,
    email: doc.email,
    message: doc.message,
    productSlug: doc.productSlug,
    productName: doc.productName,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listAdminInquiries(params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (params.status) {
    filter.status = params.status;
  }
  if (params.search?.trim()) {
    const regex = new RegExp(escapeRegex(params.search.trim()), "i");
    filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }, { productName: regex }];
  }

  const skip = (params.page - 1) * params.limit;
  const [docs, total] = await Promise.all([
    InquiryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(params.limit).lean(),
    InquiryModel.countDocuments(filter),
  ]);

  return { items: docs.map((d) => mapAdminInquiry(d as Record<string, unknown>)), total };
}

export async function getAdminInquiryById(id: string) {
  const doc = await InquiryModel.findById(id).lean();
  if (!doc) return null;
  return mapAdminInquiry(doc as Record<string, unknown>);
}

export async function updateAdminInquiryStatus(id: string, status: string) {
  const doc = await InquiryModel.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  ).lean();
  if (!doc) return null;
  return mapAdminInquiry(doc as Record<string, unknown>);
}
