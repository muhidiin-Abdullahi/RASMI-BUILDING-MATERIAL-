import type { Request, Response, NextFunction } from "express";
import { paramString } from "../utils/params.js";
import {
  getPublishedCategoryBySlug,
  listPublishedCategories,
} from "../services/category.service.js";
import { sendSuccess } from "../utils/response.js";

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categories = await listPublishedCategories();
    return sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const category = await getPublishedCategoryBySlug(paramString(req.params.slug));
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { message: "Category not found", code: "NOT_FOUND" },
      });
    }
    return sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
}
