import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { Env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { createV1Router } from "./routes/v1/index.js";

export function createApp(env: Env) {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(env.API_PREFIX, createV1Router(env));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
