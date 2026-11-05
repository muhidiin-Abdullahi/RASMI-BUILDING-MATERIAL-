import type { Request, Response } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { sendSuccess } from "../utils/response.js";

export function getHealth(_req: Request, res: Response) {
  return sendSuccess(res, {
    status: "ok",
    service: "rbm-api",
    database: isDatabaseConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}
