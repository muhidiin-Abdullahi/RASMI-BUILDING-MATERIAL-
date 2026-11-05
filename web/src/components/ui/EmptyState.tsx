import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function EmptyState({
  title = "Nothing to display yet",
  description = "Check back soon or adjust your filters.",
  actionHref,
  actionLabel = "Browse products",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rbm-card mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center",
        className,
      )}
    >
      <PackageOpen className="h-10 w-10 text-rbm-navy/60" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-rbm-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-rbm-text-secondary">{description}</p>
      {actionHref ? (
        <Button href={actionHref} className="mt-6" variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
