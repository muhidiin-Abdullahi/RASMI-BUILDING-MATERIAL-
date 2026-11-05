import type { Request, Response, NextFunction } from "express";
import { paramString } from "../utils/params.js";
import {
  getPublishedProductBySlug,
  listFeaturedPublishedProducts,
  listPublishedProducts,
} from "../services/product.service.js";
import type { ProductListQuery } from "../validators/product.validator.js";
import { sendPaginatedSuccess, sendSuccess } from "../utils/response.js";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = res.locals.validatedQuery as ProductListQuery;
    const { items, total } = await listPublishedProducts({
      page: query.page,
      limit: query.limit,
      categorySlug: query.category,
      search: query.search,
      featured: query.featured,
      sort: query.sort,
    });

    const totalPages = Math.ceil(total / query.limit) || 0;
    return sendPaginatedSuccess(res, items, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await listFeaturedPublishedProducts(12);
    return sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const product = await getPublishedProductBySlug(paramString(req.params.slug));
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: "Product not found", code: "NOT_FOUND" },
      });
    }
    return sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}
