"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  active: boolean;
};

export function UsersAdminClient() {
  const [users, setUsers] = useState<AdminRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`${window.location.origin}/api/v1/admin/users`, { credentials: "include" });
    const body = await res.json();
    if (body.success) setUsers(body.data);
  }

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
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await adminFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, active: true }),
    });
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    void load();
  }

  async function toggleActive(user: AdminRow) {
    if (!confirm(`${user.active ? "Disable" : "Enable"} ${user.email}?`)) return;
    const result = await adminFetch(`/admin/users/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: !user.active }),
    });
    if (result.error) alert(result.error.message);
    void load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={createUser} className="max-w-xl space-y-3 rounded border border-rbm-border bg-white p-5">
        <h2 className="font-semibold text-rbm-navy">Create administrator</h2>
        <input className="rbm-input w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rbm-input w-full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rbm-input w-full" type="password" placeholder="Temporary password (min 12)" minLength={12} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="rbm-input w-full" value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "SUPER_ADMIN")}>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="rounded bg-rbm-orange px-4 py-2 text-sm font-semibold text-white">
          Create account
        </button>
      </form>

      <div className="overflow-x-auto rounded border border-rbm-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-rbm-border bg-rbm-surface">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-rbm-border">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.active ? "Active" : "Disabled"}</td>
                <td className="px-4 py-3">
                  <button type="button" className="text-sm font-semibold text-rbm-navy" onClick={() => void toggleActive(user)}>
                    {user.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
