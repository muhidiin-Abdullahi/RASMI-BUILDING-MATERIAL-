import Link from "next/link";

export default function AdminUnauthorizedPage() {
  return (
    <div className="mx-auto max-w-lg rounded border border-rbm-border bg-white p-8 text-center">
      <h1 className="font-display text-2xl text-rbm-navy">Access denied</h1>
      <p className="mt-2 text-sm text-rbm-text-secondary">
        Your account does not have permission to view this section.
      </p>
      <Link href="/admin/dashboard" className="rbm-link mt-6 inline-block text-sm">
        Return to dashboard
      </Link>
    </div>
  );
}
