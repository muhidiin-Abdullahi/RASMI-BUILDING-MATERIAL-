import { connectDatabase, disconnectDatabase } from "../src/server/db";
import { CategoryModel } from "../src/server/models/Category";
import { ProductModel } from "../src/server/models/Product";
import { seedCategories, seedProducts } from "./dev-seed-data";

async function seed() {
  await connectDatabase();
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
