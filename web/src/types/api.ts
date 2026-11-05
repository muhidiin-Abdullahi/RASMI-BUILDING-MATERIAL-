import type { Category, Product } from "@/types/product";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiPaginatedSuccess<T> = ApiSuccess<T[]> & {
  pagination: PaginationMeta;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

export type ApiProduct = Product & {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type ApiCategory = Category;

export type InquiryCreateResponse = {
  id: string;
  reference: string;
};
