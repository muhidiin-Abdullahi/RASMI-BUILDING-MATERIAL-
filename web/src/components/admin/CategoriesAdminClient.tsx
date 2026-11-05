"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  productCount: number;
};

export function CategoriesAdminClient() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const res = await fetch(`${window.location.origin}/api/v1/admin/categories${params}`, {
      credentials: "include",
    });
    const body = await res.json();
    setLoading(false);
    if (body.success) setRows(body.data);
  }, [search]);

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
    if (!confirm(`Delete category "${name}"?`)) return;
    const result = await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
    if (result.error) {
      alert(result.error.message);
      return;
    }
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded border border-rbm-border bg-white p-4">
        <input
          className="rbm-input flex-1"
          placeholder="Search categories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" onClick={() => void load()} className="rounded border border-rbm-border px-4 py-2 text-sm font-semibold">
          Search
        </button>
      </div>

      {loading ? <p className="text-sm text-rbm-text-secondary">Loading…</p> : null}

      <div className="overflow-x-auto rounded border border-rbm-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-rbm-border bg-rbm-surface text-rbm-text-secondary">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-rbm-border">
                <td className="px-4 py-3 font-medium text-rbm-navy">{row.name}</td>
                <td className="px-4 py-3">{row.slug}</td>
                <td className="px-4 py-3">{row.productCount}</td>
                <td className="px-4 py-3">{row.published ? "Published" : "Hidden"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/categories/${row.id}/edit`} className="rbm-link">
                      Edit
                    </Link>
                    <button type="button" className="text-red-700" onClick={() => void onDelete(row.id, row.name)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
