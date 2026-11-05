"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  updatedAt?: string;
  images?: Array<{ url: string; alt: string }>;
  category?: { name?: string } | null;
};

type CategoryOption = { id: string; name: string };

export function ProductsAdminClient({ categories }: { categories: CategoryOption[] }) {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", limit: "50" });
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (published) params.set("published", published);

    const res = await fetch(`${window.location.origin}/api/v1/admin/products?${params}`, {
      credentials: "include",
    });
    const body = await res.json();
    setLoading(false);
    if (!body.success) {
      setError(body.error?.message ?? "Failed to load products");
      return;
    }
    setError(null);
    setRows(body.data);
  }, [search, category, published]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const result = await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
    if (result.error) {
      alert(result.error.message);
      return;
    }
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded border border-rbm-border bg-white p-4">
        <input
          className="rbm-input min-w-[200px] flex-1"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="rbm-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="rbm-input" value={published} onChange={(e) => setPublished(e.target.value)}>
          <option value="">All statuses</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded border border-rbm-border px-4 py-2 text-sm font-semibold text-rbm-navy"
        >
          Apply
        </button>
      </div>

      {loading ? <p className="text-sm text-rbm-text-secondary">Loading products…</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="overflow-x-auto rounded border border-rbm-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-rbm-border bg-rbm-surface text-rbm-text-secondary">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-rbm-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {row.images?.[0]?.url ? (
                      <Image
                        src={row.images[0].url}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-rbm-surface" />
                    )}
                    <span className="font-medium text-rbm-navy">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{row.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{row.published ? "Published" : "Draft"}</td>
                <td className="px-4 py-3 text-rbm-text-secondary">
                  {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${row.id}/edit`} className="rbm-link text-sm">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-700"
                      onClick={() => void onDelete(row.id, row.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 ? (
          <p className="p-6 text-sm text-rbm-text-secondary">No products match your filters.</p>
        ) : null}
      </div>
    </div>
  );
}
