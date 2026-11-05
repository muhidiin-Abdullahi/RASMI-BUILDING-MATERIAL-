import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { loadEnv, requireMongoUri } from "../src/config/env.js";
import { CategoryModel } from "../src/models/Category.js";
import { ProductModel } from "../src/models/Product.js";
import { seedCategories, seedProducts } from "./dev-seed-data.js";

async function seed() {
  const env = loadEnv();
  requireMongoUri(env);
  await connectDatabase(env);

  console.log("Seeding development categories and products…");

  const categoryMap = new Map<string, string>();

  for (const category of seedCategories) {
    const doc = await CategoryModel.findOneAndUpdate(
      { slug: category.slug },
      category,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    categoryMap.set(category.slug, doc._id.toString());
  }

  for (const product of seedProducts) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for product ${product.slug}`);
    }

    await ProductModel.findOneAndUpdate(
      { slug: product.slug },
      {
        name: product.name,
        slug: product.slug,
        category: categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        specifications: product.specifications,
        featured: product.featured,
        published: product.published,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  console.log("Seed completed.");
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
