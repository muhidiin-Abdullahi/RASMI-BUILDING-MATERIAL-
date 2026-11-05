import type { Response } from "express";
import { sendError } from "./response.js";

export function isServiceError(
  error: unknown,
): error is Error & { status?: number; code?: string; productCount?: number } {
  return error instanceof Error && "status" in error;
}

export function handleServiceError(res: Response, error: unknown) {
  if (isServiceError(error) && error.status) {
    const message =
      error.code === "CATEGORY_HAS_PRODUCTS"
        ? `Cannot delete category with ${error.productCount ?? 0} associated product(s). Reassign products first.`
        : error.message;
    return sendError(res, error.status, message, error.code);
  }
  throw error;
}
