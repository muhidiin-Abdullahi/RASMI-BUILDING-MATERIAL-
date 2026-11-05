import { getDashboardSummary } from "@/server/services/admin-dashboard.service";
import { adminRoute, ok } from "@/server/http";

export const GET = adminRoute(async () => ok(await getDashboardSummary()));
