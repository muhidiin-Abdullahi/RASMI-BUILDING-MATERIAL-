import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Use "dark" when the heading sits on a navy section or a photo. */
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  className,
}: SectionHeadingProps) {
  const onDark = tone === "dark";

  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <p className={cn("rbm-eyebrow mb-4", onDark && "rbm-eyebrow-light")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          onDark ? "text-white" : "text-rbm-text-primary",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            onDark ? "text-white/80" : "text-rbm-text-secondary",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
