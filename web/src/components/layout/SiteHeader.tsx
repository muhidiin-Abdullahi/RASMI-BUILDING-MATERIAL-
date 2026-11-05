"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type SiteHeaderProps = {
  phone: string;
  phoneHref: string;
};

export function SiteHeader({ phone, phoneHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rbm-border bg-white">
      <Container className="flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 shrink items-center gap-3">
          <Image
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-11 w-11 shrink-0"
            loading="eager"
          />
          <span className="min-w-0 font-display leading-none text-rbm-navy">
            <span className="block text-lg font-bold tracking-tight">Rasmi</span>
            <span className="mt-1 block whitespace-nowrap text-[11px] font-medium tracking-wide text-rbm-text-secondary">
              Building Materials Co.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap py-2 font-display text-[15px] font-medium text-rbm-text-primary transition-colors hover:text-rbm-orange",
                  active &&
                    "text-rbm-navy after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:bg-rbm-orange",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-rbm-navy hover:bg-rbm-surface"
            aria-label="Search products catalog"
          >
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <Button href="/admin/login" variant="outline" prefetch={false}>
              Login
            </Button>
            <Button href="/contact">
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-rbm-navy hover:bg-rbm-surface xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        phone={phone}
        phoneHref={phoneHref}
      />
    </header>
  );
}
