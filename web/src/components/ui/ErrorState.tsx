import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  retryHref?: string;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  retryHref,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rbm-card mx-auto flex max-w-lg flex-col items-center border-rbm-orange/30 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="h-10 w-10 text-rbm-orange" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-rbm-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-rbm-text-secondary">{description}</p>
      {retryHref ? (
        <Button href={retryHref} className="mt-6">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
