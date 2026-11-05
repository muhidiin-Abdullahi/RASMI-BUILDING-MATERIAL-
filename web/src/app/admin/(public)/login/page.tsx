"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "@/lib/admin/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only ever return to a page inside the CMS, never another website.
  const requested = searchParams.get("next") ?? "";
  const next = /^\/admin(\/|$)/.test(requested) ? requested : "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!email.trim() || password.length < 8) {
      setError("Enter a valid email and password (minimum 8 characters).");
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin(email.trim(), password);

      if (result.error || !result.data) {
        setError(result.error?.message ?? "Unable to sign in. Check your credentials.");
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Sign-in failed unexpectedly. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rbm-surface px-4">
      <div className="w-full max-w-md rounded border border-rbm-border bg-white p-8 shadow-rbm-soft">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="Rasmi Building Materials Co." width={72} height={72} />
          <h1 className="mt-4 font-display text-2xl text-rbm-navy">Rasmi Building Materials Co.</h1>
          <p className="mt-1 text-sm text-rbm-text-secondary">Administrator sign in</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-rbm-navy">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rbm-input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-rbm-navy">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rbm-input w-full pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-rbm-text-secondary"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-rbm-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-rbm-navy disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-rbm-text-secondary">
          <Link href="/" className="rbm-link text-xs">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
