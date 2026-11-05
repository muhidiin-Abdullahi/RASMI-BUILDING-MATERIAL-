import mongoose from "mongoose";

/** Kept on globalThis so dev hot reloads reuse one connection pool. */
const store = globalThis as unknown as {
  __rbmMongoose?: Promise<typeof mongoose>;
};

export async function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!store.__rbmMongoose) {
    const uri = process.env.MONGODB_URI?.trim();
    if (!uri) {
      throw new Error("MONGODB_URI is required. Set it in web/.env.local.");
    }
    mongoose.set("strictQuery", true);
    store.__rbmMongoose = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .catch((error) => {
        store.__rbmMongoose = undefined;
        throw error;
      });
  }

  return store.__rbmMongoose;
}

export async function disconnectDatabase(): Promise<void> {
  store.__rbmMongoose = undefined;
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
