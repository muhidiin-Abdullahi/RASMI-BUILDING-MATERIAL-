import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response.js";

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 404, "Not found");
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.code);
  }

  if (
    typeof err === "object" &&
    err &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    return sendError(res, 409, "Duplicate key conflict", "DUPLICATE_KEY");
  }

  if (process.env.NODE_ENV !== "production" && err instanceof Error) {
    console.error(err);
  }

  const status = res.statusCode >= 400 ? res.statusCode : 500;
  return sendError(
    res,
    status,
    "An unexpected error occurred",
    "INTERNAL_ERROR",
  );
}
