import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../utils/response.js";

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return sendError(res, 400, "Invalid route parameters", "VALIDATION_ERROR");
    }
    res.locals.validatedParams = parsed.data;
    next();
  };
}
