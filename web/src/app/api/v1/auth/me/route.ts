import { adminRoute, ok } from "@/server/http";

export const GET = adminRoute(async (_req, _ctx, admin) =>
  ok({
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  }),
);
