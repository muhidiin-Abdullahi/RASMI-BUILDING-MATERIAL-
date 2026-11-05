import type { ApiError } from "@/types/api";
import { API_BASE_PATH } from "@/lib/api/config";

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type FetchJsonOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

/** Browser request to this app's Route Handlers. */
export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    method: options.method ?? "GET",
    headers:
      options.body !== undefined
        ? { "Content-Type": "application/json" }
        : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json()) as T | ApiError;

  if (!response.ok || (payload as ApiError).success === false) {
    const errorPayload = payload as ApiError;
    throw new ApiRequestError(
      errorPayload.error?.message ?? "API request failed",
      response.status,
      errorPayload.error?.code,
    );
  }

  return payload as T;
}
