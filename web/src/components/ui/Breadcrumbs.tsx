import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("bg-rbm-surface py-3", className)}>
      <Container>
        <ol className="flex flex-wrap items-center gap-1 text-xs text-rbm-text-secondary">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 ? (
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
                ) : null}
                {item.href && !isLast ? (
                  <Link href={item.href} className="rbm-link font-medium normal-case">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && "font-semibold text-rbm-text-primary")}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
