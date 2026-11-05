import mongoose from "mongoose";
import { requireMongoUri, type Env } from "./env.js";

let connected = false;

export async function connectDatabase(env: Env): Promise<typeof mongoose> {
  if (connected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const uri = requireMongoUri(env);
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  connected = true;
  return mongoose;
}

export async function disconnectDatabase(): Promise<void> {
  if (!connected) {
    return;
  }
  await mongoose.disconnect();
  connected = false;
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
