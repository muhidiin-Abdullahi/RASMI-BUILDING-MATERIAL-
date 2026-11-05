import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ACCESS_COOKIE, getAuthConfig } from "@/server/auth-config";
import { connectDatabase } from "@/server/db";
import { AdminUserModel } from "@/server/models/AdminUser";
import { verifyAccessToken } from "@/server/services/auth.service";
import type { AdminUser } from "./api-client";

export async function getServerAdminSession(): Promise<AdminUser | null> {
  // Checking a token reads the clock, so it has to wait for a real request.
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyAccessToken(getAuthConfig(), token);
  if (!payload) {
    return null;
  }

  await connectDatabase();
  const user = await AdminUserModel.findById(payload.sub).lean();
  if (!user || !user.active) {
    return null;
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/** Every server-side admin data load calls this first. */
export async function requireAdminPage(): Promise<AdminUser> {
  const session = await getServerAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
