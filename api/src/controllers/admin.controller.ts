import type { Request, Response, NextFunction } from "express";
import { getDashboardSummary } from "../services/admin-dashboard.service.js";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  listAdminProducts,
  updateAdminProduct,
} from "../services/admin-product.service.js";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoryById,
  listAdminCategories,
  updateAdminCategory,
} from "../services/admin-category.service.js";
import {
  getAdminInquiryById,
  listAdminInquiries,
  updateAdminInquiryStatus,
} from "../services/admin-inquiry.service.js";
import {
  ensureDefaultContentKeys,
  listSiteContent,
  upsertSiteContentEntries,
} from "../services/site-content.service.js";
import { AdminUserModel, normalizeAdminEmail } from "../models/AdminUser.js";
import {
  hashPassword,
  revokeAllSessionsForUser,
  toPublicAdminUser,
} from "../services/auth.service.js";
import { getAuthConfig } from "../config/auth.js";
import type { Env } from "../config/env.js";
import type { AdminProductBody } from "../validators/admin-product.validator.js";
import type { AdminCategoryBody } from "../validators/admin-category.validator.js";
import { sendError, sendPaginatedSuccess, sendSuccess } from "../utils/response.js";
import { handleServiceError } from "../utils/serviceError.js";
import { recordAudit } from "../services/audit.service.js";

export async function getAdminDashboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const summary = await getDashboardSummary();
    return sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
}

export async function getAdminProductsList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = res.locals.validatedQuery as {
      page: number;
      limit: number;
      category?: string;
      search?: string;
      published?: boolean;
    };
    const { items, total } = await listAdminProducts(query);
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

export async function getAdminProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const product = await getAdminProductById(id);
    if (!product) {
      return sendError(res, 404, "Product not found", "NOT_FOUND");
    }
    return sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function postAdminProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const body = res.locals.validatedBody as AdminProductBody;
    const product = await createAdminProduct(body);
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "product.create",
        resourceType: "product",
        resourceId: product?.id,
        metadata: { slug: body.slug },
      });
    }
    return sendSuccess(res, product, 201);
  } catch (error) {
    return handleServiceError(res, error);
  }
}

export async function patchAdminProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const body = res.locals.validatedBody as AdminProductBody;
    const product = await updateAdminProduct(id, body);
    if (!product) {
      return sendError(res, 404, "Product not found", "NOT_FOUND");
    }
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "product.update",
        resourceType: "product",
        resourceId: id,
        metadata: { published: body.published },
      });
    }
    return sendSuccess(res, product);
  } catch (error) {
    return handleServiceError(res, error);
  }
}

export async function deleteAdminProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const deleted = await deleteAdminProduct(id);
    if (!deleted) {
      return sendError(res, 404, "Product not found", "NOT_FOUND");
    }
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "product.delete",
        resourceType: "product",
        resourceId: id,
      });
    }
    return sendSuccess(res, { ok: true });
  } catch (error) {
    next(error);
  }
}

export async function getAdminCategoriesList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = res.locals.validatedQuery as { search?: string };
    const items = await listAdminCategories(query.search);
    return sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
}

export async function getAdminCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const category = await getAdminCategoryById(id);
    if (!category) {
      return sendError(res, 404, "Category not found", "NOT_FOUND");
    }
    return sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
}

export async function postAdminCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const body = res.locals.validatedBody as AdminCategoryBody;
    const category = await createAdminCategory(body);
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "category.create",
        resourceType: "category",
        resourceId: category?.id,
      });
    }
    return sendSuccess(res, category, 201);
  } catch (error) {
    return handleServiceError(res, error);
  }
}

export async function patchAdminCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const body = res.locals.validatedBody as AdminCategoryBody;
    const category = await updateAdminCategory(id, body);
    if (!category) {
      return sendError(res, 404, "Category not found", "NOT_FOUND");
    }
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "category.update",
        resourceType: "category",
        resourceId: id,
      });
    }
    return sendSuccess(res, category);
  } catch (error) {
    return handleServiceError(res, error);
  }
}

export async function deleteAdminCategoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    try {
      const deleted = await deleteAdminCategory(id);
      if (!deleted) {
        return sendError(res, 404, "Category not found", "NOT_FOUND");
      }
    } catch (error) {
      return handleServiceError(res, error);
    }
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "category.delete",
        resourceType: "category",
        resourceId: id,
      });
    }
    return sendSuccess(res, { ok: true });
  } catch (error) {
    next(error);
  }
}

export async function getAdminInquiriesList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = res.locals.validatedQuery as {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    };
    const { items, total } = await listAdminInquiries(query);
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

export async function getAdminInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const inquiry = await getAdminInquiryById(id);
    if (!inquiry) {
      return sendError(res, 404, "Inquiry not found", "NOT_FOUND");
    }
    return sendSuccess(res, inquiry);
  } catch (error) {
    next(error);
  }
}

export async function patchAdminInquiryStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = res.locals.validatedParams as { id: string };
    const { status } = res.locals.validatedBody as { status: string };
    const inquiry = await updateAdminInquiryStatus(id, status);
    if (!inquiry) {
      return sendError(res, 404, "Inquiry not found", "NOT_FOUND");
    }
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "inquiry.status_update",
        resourceType: "inquiry",
        resourceId: id,
        metadata: { status },
      });
    }
    return sendSuccess(res, inquiry);
  } catch (error) {
    next(error);
  }
}

export async function getAdminSiteContent(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await ensureDefaultContentKeys();
    const entries = await listSiteContent();
    return sendSuccess(res, entries);
  } catch (error) {
    next(error);
  }
}

export async function patchAdminSiteContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { entries } = res.locals.validatedBody as {
      entries: Array<{ key: string; value: string; label?: string }>;
    };
    const updated = await upsertSiteContentEntries(entries);
    if (req.admin) {
      await recordAudit({
        actorId: req.admin.id,
        action: "content.update",
        resourceType: "site_content",
        metadata: { keys: entries.map((e) => e.key) },
      });
    }
    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
}

export async function listAdminUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await AdminUserModel.find({}).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, users.map((u) => toPublicAdminUser(u)));
  } catch (error) {
    next(error);
  }
}

export function createAdminUserHandlers(env: Env) {
  async function postAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = res.locals.validatedBody as {
        name: string;
        email: string;
        password: string;
        role: "SUPER_ADMIN" | "ADMIN";
        active: boolean;
      };

      const email = normalizeAdminEmail(body.email);
      const exists = await AdminUserModel.exists({ email });
      if (exists) {
        return sendError(res, 409, "An account with this email already exists", "DUPLICATE_EMAIL");
      }

      const user = await AdminUserModel.create({
        name: body.name,
        email,
        passwordHash: await hashPassword(body.password),
        role: body.role,
        active: body.active,
      });

      if (req.admin) {
        await recordAudit({
          actorId: req.admin.id,
          action: "admin_user.create",
          resourceType: "admin_user",
          resourceId: user._id.toString(),
          metadata: { role: body.role },
        });
      }

      return sendSuccess(res, toPublicAdminUser(user), 201);
    } catch (error) {
      next(error);
    }
  }

  async function patchAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = res.locals.validatedParams as { id: string };
      const body = res.locals.validatedBody as {
        name?: string;
        role?: "SUPER_ADMIN" | "ADMIN";
        active?: boolean;
      };

      const user = await AdminUserModel.findById(id);
      if (!user) {
        return sendError(res, 404, "User not found", "NOT_FOUND");
      }

      if (body.role && req.admin?.id === id && body.role !== user.role) {
        return sendError(res, 403, "You cannot change your own role", "FORBIDDEN");
      }

      if (body.active === false && req.admin?.id === id) {
        return sendError(res, 403, "You cannot disable your own account", "FORBIDDEN");
      }

      if (body.active === false && user.role === "SUPER_ADMIN") {
        const activeSuperAdmins = await AdminUserModel.countDocuments({
          role: "SUPER_ADMIN",
          active: true,
          _id: { $ne: id },
        });
        if (activeSuperAdmins === 0) {
          return sendError(
            res,
            409,
            "Cannot disable the last active super administrator",
            "LAST_SUPER_ADMIN",
          );
        }
      }

      if (body.name) user.name = body.name;
      if (body.role) user.role = body.role;
      if (body.active !== undefined) {
        user.active = body.active;
        if (!body.active) {
          await revokeAllSessionsForUser(user._id.toString());
        }
      }
      await user.save();

      if (req.admin) {
        await recordAudit({
          actorId: req.admin.id,
          action: "admin_user.update",
          resourceType: "admin_user",
          resourceId: id,
        });
      }

      return sendSuccess(res, toPublicAdminUser(user));
    } catch (error) {
      next(error);
    }
  }

  async function postAdminUserResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = res.locals.validatedParams as { id: string };
      const { newPassword } = res.locals.validatedBody as { newPassword: string };

      const user = await AdminUserModel.findById(id);
      if (!user) {
        return sendError(res, 404, "User not found", "NOT_FOUND");
      }

      user.passwordHash = await hashPassword(newPassword);
      await user.save();
      await revokeAllSessionsForUser(user._id.toString());

      if (req.admin) {
        await recordAudit({
          actorId: req.admin.id,
          action: "admin_user.reset_password",
          resourceType: "admin_user",
          resourceId: id,
        });
      }

      return sendSuccess(res, { ok: true });
    } catch (error) {
      next(error);
    }
  }

  void getAuthConfig(env);
  return { postAdminUser, patchAdminUser, postAdminUserResetPassword };
}
