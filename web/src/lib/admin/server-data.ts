import { getAdminCategoryById, listAdminCategories } from "@/server/services/admin-category.service";
import { getDashboardSummary } from "@/server/services/admin-dashboard.service";
import { getAdminProductById } from "@/server/services/admin-product.service";
import { mongoIdParamSchema } from "@/server/validators/auth.validator";
import { requireAdminPage } from "./server-session";

/** Dates and ids become plain JSON, as they would in an API response. */
function plain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const isMongoId = (id: string) => mongoIdParamSchema.safeParse({ id }).success;

export async function loadCategoryOptions() {
  await requireAdminPage();
  return plain<Array<{ id: string; name: string }>>(await listAdminCategories());
}

export async function loadAdminCategory<T>(id: string): Promise<T | null> {
  await requireAdminPage();
  if (!isMongoId(id)) return null;
  const category = await getAdminCategoryById(id);
  return category ? plain<T>(category) : null;
}

export async function loadAdminProduct<T>(id: string): Promise<T | null> {
  await requireAdminPage();
  if (!isMongoId(id)) return null;
  const product = await getAdminProductById(id);
  return product ? plain<T>(product) : null;
}

export type DashboardData = {
  metrics: {
    publishedProducts: number;
    categories: number;
    pendingInquiries: number;
    projectPosts: number;
  };
  recentInquiries: Array<{
    id: string;
    fullName: string;
    status: string;
    productName?: string;
    createdAt: string;
  }>;
  recentProducts: Array<{
    id: string;
    name: string;
    slug: string;
    published: boolean;
    updatedAt: string;
  }>;
};

export async function loadDashboard(): Promise<DashboardData> {
  await requireAdminPage();
  return plain<DashboardData>(await getDashboardSummary());
}
