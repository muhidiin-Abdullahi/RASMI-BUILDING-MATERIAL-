import { listPublishedCategories } from "@/server/services/category.service";
import { ok, route } from "@/server/http";

export const GET = route(async () => ok(await listPublishedCategories()));
