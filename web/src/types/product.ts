export type ProductImage = {
  url: string;
  alt: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  published: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  brand?: string;
  sku?: string;
  /** Only present when approved for public display */
  price?: number;
  currency?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductSortOption = "featured" | "name-asc" | "name-desc";

export type ProductListQuery = {
  categorySlug?: string;
  search?: string;
  sort?: ProductSortOption;
  publishedOnly?: boolean;
};
