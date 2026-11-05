import type { Request, Response, NextFunction } from "express";
import { getAuthConfig, REFRESH_COOKIE } from "../config/auth.js";
import type { Env } from "../config/env.js";
import {
  authenticateAdminCredentials,
  createSession,
  generateRefreshToken,
  revokeRefreshToken,
  rotateRefreshSession,
  signAccessToken,
  verifyAccessToken,
  hashPassword,
  revokeAllSessionsForUser,
} from "../services/auth.service.js";
import { AdminUserModel } from "../models/AdminUser.js";
import { ACCESS_COOKIE } from "../config/auth.js";
import type { LoginBody } from "../validators/auth.validator.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { recordAudit } from "../services/audit.service.js";

export function createAuthController(env: Env) {
  const authConfig = getAuthConfig(env);

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = res.locals.validatedBody as LoginBody;
      const admin = await authenticateAdminCredentials(body.email, body.password);
      if (!admin) {
        return sendError(res, 401, "Invalid email or password", "INVALID_CREDENTIALS");
      }

      const refreshToken = generateRefreshToken();
      await createSession(admin.id, refreshToken, authConfig, {
        userAgent: req.get("user-agent") ?? undefined,
        ipAddress: req.ip,
      });

      const accessToken = signAccessToken(authConfig, admin.id, admin.role);
      setAuthCookies(res, authConfig, accessToken, refreshToken);

      await recordAudit({
        actorId: admin.id,
        action: "auth.login",
        resourceType: "session",
      });

      return sendSuccess(res, {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async function logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refresh = req.cookies?.[REFRESH_COOKIE] as string | undefined;
      if (refresh) {
        await revokeRefreshToken(refresh);
      }
      if (req.admin) {
        await recordAudit({
          actorId: req.admin.id,
          action: "auth.logout",
          resourceType: "session",
        });
      }
      clearAuthCookies(res, authConfig);
      return sendSuccess(res, { ok: true });
    } catch (error) {
      next(error);
    }
  }

  async function me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.admin) {
        return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
      }
      const user = await AdminUserModel.findById(req.admin.id).lean();
      if (!user || !user.active) {
        return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
      }
      return sendSuccess(res, {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refresh = req.cookies?.[REFRESH_COOKIE] as string | undefined;
      if (!refresh) {
        return sendError(res, 401, "Session expired", "UNAUTHENTICATED");
      }

      const rotated = await rotateRefreshSession(refresh, authConfig, {
        userAgent: req.get("user-agent") ?? undefined,
        ipAddress: req.ip,
      });
      if (!rotated) {
        clearAuthCookies(res, authConfig);
        return sendError(res, 401, "Session expired", "UNAUTHENTICATED");
      }

      const accessToken = signAccessToken(authConfig, rotated.userId, rotated.role);
      setAuthCookies(res, authConfig, accessToken, rotated.newRefreshToken);
      return sendSuccess(res, { ok: true });
    } catch (error) {
      next(error);
    }
  }

  async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.admin) {
        return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
      }
      const { currentPassword, newPassword } = res.locals.validatedBody as {
        currentPassword: string;
        newPassword: string;
      };

      const user = await AdminUserModel.findById(req.admin.id).select("+passwordHash").exec();
      if (!user) {
        return sendError(res, 401, "Authentication required", "UNAUTHENTICATED");
      }

      const { verifyPassword } = await import("../services/auth.service.js");
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        return sendError(res, 400, "Current password is incorrect", "INVALID_PASSWORD");
      }

      user.passwordHash = await hashPassword(newPassword);
      await user.save();
      await revokeAllSessionsForUser(user._id.toString());

      await recordAudit({
        actorId: req.admin.id,
        action: "auth.password_change",
        resourceType: "admin_user",
        resourceId: req.admin.id,
      });

      clearAuthCookies(res, authConfig);
      return sendSuccess(res, { ok: true, message: "Password updated. Please sign in again." });
    } catch (error) {
      next(error);
    }
  }

  /** Optional silent refresh when access token expired but refresh valid */
  async function tryRefreshFromAccess(req: Request, res: Response) {
    const access = req.cookies?.[ACCESS_COOKIE] as string | undefined;
    if (access && verifyAccessToken(authConfig, access)) {
      return false;
    }
    const refresh = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!refresh) return false;

    const rotated = await rotateRefreshSession(refresh, authConfig);
    if (!rotated) return false;

    const accessToken = signAccessToken(authConfig, rotated.userId, rotated.role);
    setAuthCookies(res, authConfig, accessToken, rotated.newRefreshToken);
    return true;
  }

  return { login, logout, me, refresh, changePassword, tryRefreshFromAccess };
}
