import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../utils/response.js";

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(res, 400, "Invalid query parameters", "VALIDATION_ERROR");
    }
    res.locals.validatedQuery = parsed.data;
    next();
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, "Invalid request body", "VALIDATION_ERROR");
    }
    res.locals.validatedBody = parsed.data;
    next();
  };
}
