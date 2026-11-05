import type { AdminRole } from "../models/AdminUser.js";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        name: string;
        role: AdminRole;
      };
    }
  }
}

export {};
