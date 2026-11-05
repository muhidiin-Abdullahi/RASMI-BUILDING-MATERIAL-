import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createApp } from "../../app.js";
import type { Env } from "../../config/env.js";
import { connectDatabase, disconnectDatabase } from "../../config/database.js";
import { CategoryModel } from "../../models/Category.js";
import { ProductModel } from "../../models/Product.js";

export async function createTestContext() {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.NODE_ENV = "test";
  process.env.CORS_ORIGIN = "http://localhost:3000";
  process.env.JWT_ACCESS_SECRET = "test-access-secret-minimum-32-characters-long";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-minimum-32-characters-long";

  const env: Env = {
    NODE_ENV: "test",
    PORT: 0,
    API_PREFIX: "/api/v1",
    MONGODB_URI: mongo.getUri(),
    CORS_ORIGIN: "http://localhost:3000",
    INQUIRY_RATE_LIMIT_MAX: 100,
    LOGIN_RATE_LIMIT_MAX: 100,
  };

  await connectDatabase(env);
  const app = createApp(env);

  async function seedMinimalCatalog() {
    const category = await CategoryModel.create({
      name: "Bathroom Mirrors",
      slug: "bathroom-mirrors",
      description: "Mirrors",
      image: "/images/hero-bathroom-vanity.jpg",
      published: true,
    });

    await ProductModel.create([
      {
        name: "Published Mirror",
        slug: "published-mirror",
        category: category._id,
        shortDescription: "Visible mirror",
        description: "Published product for tests",
        images: [{ url: "/images/hero-bathroom-vanity.jpg", alt: "Mirror" }],
        specifications: [{ label: "Shape", value: "Round" }],
        featured: true,
        published: true,
      },
      {
        name: "Hidden Draft",
        slug: "hidden-draft",
        category: category._id,
        shortDescription: "Hidden",
        description: "Unpublished",
        images: [{ url: "/images/hero-bathroom-vanity.jpg", alt: "Hidden" }],
        specifications: [],
        featured: false,
        published: false,
      },
    ]);
  }

  async function destroy() {
    await disconnectDatabase();
    await mongo.stop();
  }

  return { app, env, seedMinimalCatalog, destroy };
}
