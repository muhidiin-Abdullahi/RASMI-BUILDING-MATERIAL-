"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  phone: string;
  phoneHref: string;
};

export function MobileNavigation({
  open,
  onClose,
  phone,
  phoneHref,
}: MobileNavigationProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <nav
      className="border-t border-rbm-border bg-white xl:hidden"
      aria-label="Mobile navigation"
      id="mobile-main-nav"
    >
      <Container className="flex flex-col gap-1 py-4">
        {mainNav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-sm px-2 py-3 font-display text-base font-medium hover:bg-rbm-surface",
                active ? "text-rbm-orange" : "text-rbm-text-primary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Button href="/contact" size="lg" className="mt-3 w-full" onClick={onClose}>
          Request a Quote
        </Button>
        <Button
          href="/admin/login"
          variant="outline"
          prefetch={false}
          size="lg"
          className="mt-2 w-full"
          onClick={onClose}
        >
          Login
        </Button>
        <a
          href={phoneHref}
          className="mt-2 inline-flex items-center justify-center gap-2 py-2 font-display text-sm font-semibold text-rbm-navy"
        >
          <Phone className="h-4 w-4 text-rbm-orange" aria-hidden />
          {phone}
        </a>
      </Container>
    </nav>
  );
}
