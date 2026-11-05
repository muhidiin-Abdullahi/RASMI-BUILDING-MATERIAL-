import Link from "next/link";
import { Suspense } from "react";
import { loadDashboard } from "@/lib/admin/server-data";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="text-sm text-rbm-text-secondary">Loading dashboard…</p>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const data = await loadDashboard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-rbm-navy">Dashboard</h1>
        <p className="text-sm text-rbm-text-secondary">Overview of catalog and customer inquiries</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Published products" value={data.metrics.publishedProducts} />
        <MetricCard label="Categories" value={data.metrics.categories} />
        <MetricCard label="Pending inquiries" value={data.metrics.pendingInquiries} />
        <MetricCard label="Project posts" value={data.metrics.projectPosts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded border border-rbm-border bg-white p-5">
          <h2 className="text-lg font-semibold text-rbm-navy">Recent inquiries</h2>
          {data.recentInquiries.length === 0 ? (
            <p className="mt-3 text-sm text-rbm-text-secondary">No inquiries yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rbm-border">
              {data.recentInquiries.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <p className="font-medium text-rbm-navy">{item.fullName}</p>
                  <p className="text-rbm-text-secondary">
                    {item.productName ?? "General inquiry"} · {item.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inquiries" className="rbm-link mt-4 inline-block text-sm">
            View all inquiries
          </Link>
        </section>

        <section className="rounded border border-rbm-border bg-white p-5">
          <h2 className="text-lg font-semibold text-rbm-navy">Recently updated products</h2>
          {data.recentProducts.length === 0 ? (
            <p className="mt-3 text-sm text-rbm-text-secondary">No products yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rbm-border">
              {data.recentProducts.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium text-rbm-navy">{item.name}</span>
                  <span className="text-rbm-text-secondary">
                    {item.published ? "Published" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/products" className="rbm-link mt-4 inline-block text-sm">
            Manage products
          </Link>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-rbm-border bg-white p-5">
      <p className="text-sm text-rbm-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-rbm-navy">{value}</p>
    </div>
  );
}
