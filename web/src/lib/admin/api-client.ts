import { API_BASE_PATH } from "@/lib/api/config";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export type AdminApiError = {
  message: string;
  code?: string;
  fields?: Array<{ path: string; message: string }>;
};

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; error: AdminApiError };

const DEFAULT_TIMEOUT_MS = 30_000;

async function send<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: AdminApiError; status: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_PATH}${path}`, {
      ...init,
      credentials: "include",
      signal: controller.signal,
      // The browser sets the multipart boundary itself for file uploads.
      headers:
        init?.body instanceof FormData
          ? init.headers
          : { "Content-Type": "application/json", ...init?.headers },
    });

    let body: ApiSuccess<T> | ApiFailure | null = null;
    try {
      body = (await res.json()) as ApiSuccess<T> | ApiFailure;
    } catch {
      return {
        status: res.status || 502,
        error: {
          message: "The server sent an unexpected response. Please try again.",
          code: "BAD_RESPONSE",
        },
      };
    }

    if (!body.success) {
      return { error: body.error, status: res.status };
    }
    return { data: body.data, status: res.status };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      status: 0,
      error: {
        message: aborted
          ? "The request timed out. Please try again."
          : "Could not reach the server. Check your connection and try again.",
        code: "NETWORK_ERROR",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Access tokens last 15 minutes. When one expires mid-edit, this renews the
 * session and retries, so saving a long edit does not lose the work.
 */
export async function adminFetch<T>(path: string, init?: RequestInit) {
  const result = await send<T>(path, init);
  if (result.status !== 401 || path.startsWith("/auth/")) {
    return result;
  }
  const refreshed = await send<{ ok: boolean }>("/auth/refresh", { method: "POST" });
  return refreshed.data ? send<T>(path, init) : result;
}

export async function getSession(): Promise<AdminUser | null> {
  const result = await adminFetch<{ user: AdminUser }>("/auth/me");
  if (result.status === 401 || !result.data) {
    return null;
  }
  return result.data.user;
}

export async function loginAdmin(email: string, password: string) {
  return send<{ user: AdminUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return send<{ ok: boolean }>("/auth/logout", { method: "POST" });
}
