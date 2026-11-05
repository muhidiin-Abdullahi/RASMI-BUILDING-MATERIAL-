import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-rbm-navy">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-rbm-text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="rounded bg-rbm-orange px-4 py-2 text-sm font-semibold text-white hover:bg-rbm-navy"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
