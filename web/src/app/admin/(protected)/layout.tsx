import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getServerAdminSession } from "@/lib/admin/server-session";

export default function AdminProtectedLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rbm-surface p-8 text-sm">Loading…</div>}>
      <AdminProtectedShell>{children}</AdminProtectedShell>
    </Suspense>
  );
}

async function AdminProtectedShell({ children }: { children: React.ReactNode }) {
  const session = await getServerAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return <AdminShell user={session}>{children}</AdminShell>;
}
