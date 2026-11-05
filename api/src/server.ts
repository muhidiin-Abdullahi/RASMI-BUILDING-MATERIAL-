import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { loadEnv } from "./config/env.js";

async function start() {
  const env = loadEnv();
  await connectDatabase(env);

  const app = createApp(env);
  const server = app.listen(env.PORT, () => {
    console.log(
      `RBM API listening on http://localhost:${env.PORT}${env.API_PREFIX}`,
    );
  });

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down…`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Failed to start API server:", error);
  process.exit(1);
});
