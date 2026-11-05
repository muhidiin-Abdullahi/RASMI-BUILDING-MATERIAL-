import type { Request, Response, NextFunction } from "express";
import { createInquiry } from "../services/inquiry.service.js";
import type { CreateInquiryBody } from "../validators/inquiry.validator.js";
import { sendSuccess } from "../utils/response.js";

export async function postInquiry(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = res.locals.validatedBody as CreateInquiryBody;
    const result = await createInquiry({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || undefined,
      message: body.message,
      productSlug: body.productSlug,
      productName: body.productName,
    });
    return sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}
