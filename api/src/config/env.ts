import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  MONGODB_URI: z.string().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  INQUIRY_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(15),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }
  return parsed.data;
}

export function requireMongoUri(env: Env): string {
  const uri = env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is required. Set it in api/.env (see .env.example).",
    );
  }
  return uri;
}
