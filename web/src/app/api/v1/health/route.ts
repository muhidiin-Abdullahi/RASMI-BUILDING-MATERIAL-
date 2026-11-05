import { connectDatabase, isDatabaseConnected } from "@/server/db";
import { ok } from "@/server/http";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  req.headers.get("host");
  try {
    await connectDatabase();
  } catch {
    // Reported as "disconnected" below.
  }
  return ok({
    status: "ok",
    service: "rbm-web",
    database: isDatabaseConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}
