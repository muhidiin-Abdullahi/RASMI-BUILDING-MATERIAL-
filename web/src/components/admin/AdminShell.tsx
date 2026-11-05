"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  FileText,
  ImageIcon,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { AdminUser } from "@/lib/admin/api-client";
import { logoutAdmin } from "@/lib/admin/api-client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users, superAdminOnly: true },
];

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  const links = navItems.filter(
    (item) => !item.superAdminOnly || user.role === "SUPER_ADMIN",
  );

  return (
    <div className="flex min-h-screen bg-rbm-surface text-rbm-text-primary">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-rbm-border bg-white transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-rbm-border px-5 py-4">
          <Image src="/images/logo.png" alt="RBM" width={40} height={40} />
          <div>
            <p className="text-sm font-semibold text-rbm-navy">Rasmi Building Materials</p>
            <p className="text-xs text-rbm-text-secondary">CMS</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-rbm-navy text-white"
                    : "text-rbm-text-secondary hover:bg-rbm-surface hover:text-rbm-navy"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-rbm-border p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center gap-2 text-sm font-medium text-rbm-text-secondary hover:text-rbm-navy"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View website
          </a>
          <p className="truncate text-sm font-medium text-rbm-navy">{user.name}</p>
          <p className="truncate text-xs text-rbm-text-secondary">{user.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-rbm-border px-3 py-2 text-sm font-semibold text-rbm-navy hover:border-rbm-orange hover:text-rbm-orange"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rbm-border bg-white px-4 py-3 lg:px-8">
          <button
            type="button"
            className="rounded border border-rbm-border p-2 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="text-sm text-rbm-text-secondary">
            Signed in as <span className="font-semibold text-rbm-navy">{user.role.replace("_", " ")}</span>
          </p>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
