import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getCategories, getCategoryBySlug } from "../../controllers/category.controller.js";
import { getHealth } from "../../controllers/health.controller.js";
import { postInquiry } from "../../controllers/inquiry.controller.js";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
} from "../../controllers/product.controller.js";
import { createAuthController } from "../../controllers/auth.controller.js";
import {
  createAdminUserHandlers,
  deleteAdminCategoryHandler,
  deleteAdminProductHandler,
  getAdminCategoriesList,
  getAdminCategory,
  getAdminDashboard,
  getAdminInquiriesList,
  getAdminInquiry,
  getAdminProduct,
  getAdminProductsList,
  getAdminSiteContent,
  listAdminUsers,
  patchAdminCategory,
  patchAdminInquiryStatus,
  patchAdminProduct,
  patchAdminSiteContent,
  postAdminCategory,
  postAdminProduct,
} from "../../controllers/admin.controller.js";
import { createAuthenticate, requireRole } from "../../middleware/authenticate.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { validateParams } from "../../middleware/validateParams.js";
import { createInquirySchema } from "../../validators/inquiry.validator.js";
import { productListQuerySchema } from "../../validators/product.validator.js";
import {
  changePasswordBodySchema,
  loginBodySchema,
  mongoIdParamSchema,
} from "../../validators/auth.validator.js";
import { adminProductBodySchema, adminProductListQuerySchema } from "../../validators/admin-product.validator.js";
import {
  adminCategoryBodySchema,
  adminCategoryListQuerySchema,
} from "../../validators/admin-category.validator.js";
import {
  adminInquiryListQuerySchema,
  adminInquiryStatusBodySchema,
} from "../../validators/admin-inquiry.validator.js";
import {
  createAdminUserBodySchema,
  resetAdminPasswordBodySchema,
  updateAdminUserBodySchema,
} from "../../validators/admin-user.validator.js";
import { siteContentPatchSchema } from "../../validators/site-content.validator.js";
import type { Env } from "../../config/env.js";

export function createV1Router(env: Env) {
  const router = Router();
  const authenticate = createAuthenticate(env);
  const auth = createAuthController(env);
  const adminUsers = createAdminUserHandlers(env);

  router.get("/health", getHealth);

  router.get("/categories", getCategories);
  router.get("/categories/:slug", getCategoryBySlug);

  router.get("/products", validateQuery(productListQuerySchema), getProducts);
  router.get("/products/featured", getFeaturedProducts);
  router.get("/products/:slug", getProductBySlug);

  const inquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.INQUIRY_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  });
  router.post(
    "/inquiries",
    inquiryLimiter,
    validateBody(createInquirySchema),
    postInquiry,
  );

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.LOGIN_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: "Too many login attempts. Try again later.", code: "RATE_LIMITED" },
    },
  });

  const authRouter = Router();
  authRouter.post("/login", loginLimiter, validateBody(loginBodySchema), auth.login);
  authRouter.post("/logout", authenticate, auth.logout);
  authRouter.get("/me", authenticate, auth.me);
  authRouter.post("/refresh", auth.refresh);
  authRouter.post(
    "/change-password",
    authenticate,
    validateBody(changePasswordBodySchema),
    auth.changePassword,
  );
  router.use("/auth", authRouter);

  const admin = Router();
  admin.use(authenticate);

  admin.get("/dashboard", getAdminDashboard);

  admin.get("/products", validateQuery(adminProductListQuerySchema), getAdminProductsList);
  admin.get("/products/:id", validateParams(mongoIdParamSchema), getAdminProduct);
  admin.post("/products", validateBody(adminProductBodySchema), postAdminProduct);
  admin.patch(
    "/products/:id",
    validateParams(mongoIdParamSchema),
    validateBody(adminProductBodySchema),
    patchAdminProduct,
  );
  admin.delete(
    "/products/:id",
    validateParams(mongoIdParamSchema),
    deleteAdminProductHandler,
  );

  admin.get("/categories", validateQuery(adminCategoryListQuerySchema), getAdminCategoriesList);
  admin.get("/categories/:id", validateParams(mongoIdParamSchema), getAdminCategory);
  admin.post("/categories", validateBody(adminCategoryBodySchema), postAdminCategory);
  admin.patch(
    "/categories/:id",
    validateParams(mongoIdParamSchema),
    validateBody(adminCategoryBodySchema),
    patchAdminCategory,
  );
  admin.delete(
    "/categories/:id",
    validateParams(mongoIdParamSchema),
    deleteAdminCategoryHandler,
  );

  admin.get("/inquiries", validateQuery(adminInquiryListQuerySchema), getAdminInquiriesList);
  admin.get("/inquiries/:id", validateParams(mongoIdParamSchema), getAdminInquiry);
  admin.patch(
    "/inquiries/:id/status",
    validateParams(mongoIdParamSchema),
    validateBody(adminInquiryStatusBodySchema),
    patchAdminInquiryStatus,
  );

  admin.get("/content", getAdminSiteContent);
  admin.patch("/content", validateBody(siteContentPatchSchema), patchAdminSiteContent);

  admin.get("/users", requireRole("SUPER_ADMIN"), listAdminUsers);
  admin.post(
    "/users",
    requireRole("SUPER_ADMIN"),
    validateBody(createAdminUserBodySchema),
    adminUsers.postAdminUser,
  );
  admin.patch(
    "/users/:id",
    requireRole("SUPER_ADMIN"),
    validateParams(mongoIdParamSchema),
    validateBody(updateAdminUserBodySchema),
    adminUsers.patchAdminUser,
  );
  admin.post(
    "/users/:id/reset-password",
    requireRole("SUPER_ADMIN"),
    validateParams(mongoIdParamSchema),
    validateBody(resetAdminPasswordBodySchema),
    adminUsers.postAdminUserResetPassword,
  );

  router.use("/admin", admin);

  return router;
}
