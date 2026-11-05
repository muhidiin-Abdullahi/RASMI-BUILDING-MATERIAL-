"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

export function SettingsClient() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await adminFetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage("Password updated. You will need to sign in again.");
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded border border-rbm-border bg-white p-6">
      <h2 className="text-lg font-semibold text-rbm-navy">Change password</h2>
      <label className="block text-sm">
        Current password
        <input
          type="password"
          className="rbm-input mt-1 w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        New password (min 12 characters)
        <input
          type="password"
          className="rbm-input mt-1 w-full"
          minLength={12}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </label>
      {message ? <p className="text-sm text-rbm-navy">{message}</p> : null}
      <button type="submit" disabled={loading} className="rounded bg-rbm-navy px-4 py-2 text-sm font-semibold text-white">
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
