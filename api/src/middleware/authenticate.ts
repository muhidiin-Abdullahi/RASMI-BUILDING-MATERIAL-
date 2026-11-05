import type { NextFunction, Request, Response } from "express";
import { getAuthConfig } from "../config/auth.js";
import type { Env } from "../config/env.js";
import { ACCESS_COOKIE } from "../config/auth.js";
import { AdminUserModel } from "../models/AdminUser.js";
import { verifyAccessToken } from "../services/auth.service.js";
import { sendError } from "../utils/response.js";

export function createAuthenticate(env: Env) {
  const authConfig = getAuthConfig(env);

  return async function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
    if (!token) {
      return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
    }

    const payload = verifyAccessToken(authConfig, token);
    if (!payload) {
      return sendError(res, 401, "Invalid or expired session", "UNAUTHENTICATED");
    }

    const user = await AdminUserModel.findById(payload.sub).exec();
    if (!user || !user.active) {
      return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
    }

    req.admin = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  };
}

export function requireRole(...roles: Array<"SUPER_ADMIN" | "ADMIN">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
    }
    if (!roles.includes(req.admin.role)) {
      return sendError(res, 403, "Insufficient permissions", "FORBIDDEN");
    }
    next();
  };
}

/** @deprecated Use createAuthenticate(env) */
export function requireAdmin(_req: Request, res: Response, _next: NextFunction) {
  return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
}
