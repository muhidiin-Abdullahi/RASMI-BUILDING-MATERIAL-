import type { Response } from "express";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendPaginatedSuccess<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
) {
  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  code?: string,
) {
  return res.status(status).json({
    success: false,
    error: { message, ...(code ? { code } : {}) },
  });
}
