import type { NextRequest } from "next/server";
import { HttpError, clientIp } from "./http";

const WINDOW_MS = 15 * 60 * 1000;

const store = globalThis as unknown as {
  __rbmRateLimits?: Map<string, { count: number; resetAt: number }>;
};
const buckets = (store.__rbmRateLimits ??= new Map());

/**
 * Fixed-window limit per client IP, held in this server process's memory. It
 * suits a single Node server. Serverless hosts run many processes, so there it
 * only limits per process and a shared store would be needed for a hard limit.
 */
export function enforceRateLimit(
  req: NextRequest,
  scope: string,
  max: number,
  message = "Too many requests. Try again later.",
) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  const key = `${scope}:${clientIp(req)}`;
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  bucket.count += 1;
  if (bucket.count > max) {
    throw new HttpError(429, message, "RATE_LIMITED");
  }
}

export function resetRateLimits() {
  buckets.clear();
}
