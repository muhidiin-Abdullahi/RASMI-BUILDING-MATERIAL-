import { listFeaturedPublishedProducts } from "@/server/services/product.service";
import { ok, route } from "@/server/http";

export const GET = route(async () => ok(await listFeaturedPublishedProducts(12)));
