"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

type InquiryRow = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  productName?: string;
  status: string;
  createdAt: string;
};

const statuses = ["new", "in_progress", "responded", "closed"] as const;

export function InquiriesAdminClient() {
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", limit: "50" });
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`${window.location.origin}/api/v1/admin/inquiries?${params}`, {
      credentials: "include",
    });
    const body = await res.json();
    setLoading(false);
    if (body.success) setRows(body.data);
  }, [status, search]);

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

  async function updateStatus(id: string, nextStatus: string) {
    const result = await adminFetch(`/admin/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
    if (result.error) {
      alert(result.error.message);
      return;
    }
    void load();
    if (selected?.id === id) {
      setSelected({ ...selected, status: nextStatus });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 rounded border border-rbm-border bg-white p-4">
          <input
            className="rbm-input min-w-[180px] flex-1"
            placeholder="Search inquiries"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="rbm-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <button type="button" className="rounded border border-rbm-border px-4 py-2 text-sm font-semibold" onClick={() => void load()}>
            Apply
          </button>
        </div>

        {loading ? <p className="text-sm text-rbm-text-secondary">Loading inquiries…</p> : null}

        <ul className="divide-y divide-rbm-border rounded border border-rbm-border bg-white">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-rbm-surface"
                onClick={() => setSelected(row)}
              >
                <span className="font-medium text-rbm-navy">{row.fullName}</span>
                <span className="text-xs text-rbm-text-secondary">
                  {row.productName ?? "General"} · {row.status} · {new Date(row.createdAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
          {!loading && rows.length === 0 ? (
            <li className="p-6 text-sm text-rbm-text-secondary">No inquiries found.</li>
          ) : null}
        </ul>
      </div>

      <aside className="rounded border border-rbm-border bg-white p-5">
        {selected ? (
          <>
            <h2 className="text-lg font-semibold text-rbm-navy">{selected.fullName}</h2>
            <p className="mt-1 text-sm text-rbm-text-secondary">{selected.phone}</p>
            {selected.email ? <p className="text-sm text-rbm-text-secondary">{selected.email}</p> : null}
            {selected.productName ? (
              <p className="mt-2 text-sm">
                Product: <strong>{selected.productName}</strong>
              </p>
            ) : null}
            <p className="mt-4 whitespace-pre-wrap text-sm text-rbm-text-primary">{selected.message}</p>
            <label className="mt-4 block text-sm">
              <span className="mb-1 block font-medium">Status</span>
              <select
                className="rbm-input w-full"
                value={selected.status}
                onChange={(e) => void updateStatus(selected.id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <p className="text-sm text-rbm-text-secondary">Select an inquiry to view details.</p>
        )}
      </aside>
    </div>
  );
}
