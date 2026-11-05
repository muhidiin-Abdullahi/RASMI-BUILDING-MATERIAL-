"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";
import { ImageField } from "@/components/admin/ImageField";

export type CategoryOption = { id: string; name: string };

export type ProductFormValues = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  brand: string;
  sku: string;
  price: string;
  currency: string;
  featured: boolean;
  published: boolean;
  imageUrl: string;
  imageAlt: string;
  specifications: Array<{ label: string; value: string }>;
};

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  brand: "",
  sku: "",
  price: "",
  currency: "USD",
  featured: false,
  published: false,
  imageUrl: "",
  imageAlt: "",
  specifications: [{ label: "", value: "" }],
};

export function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: CategoryOption[];
  initial?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const images =
      values.imageUrl.trim() && values.imageAlt.trim()
        ? [{ url: values.imageUrl.trim(), alt: values.imageAlt.trim() }]
        : [];

    const body = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      categoryId: values.categoryId,
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      images,
      specifications: values.specifications.filter((s) => s.label && s.value),
      brand: values.brand.trim() || undefined,
      sku: values.sku.trim() || undefined,
      price: values.price ? Number(values.price) : undefined,
      currency: values.currency.trim() || undefined,
      featured: values.featured,
      published: values.published,
    };

    const path = productId ? `/admin/products/${productId}` : "/admin/products";
    const method = productId ? "PATCH" : "POST";
    const result = await adminFetch(path, { method, body: JSON.stringify(body) });
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5 rounded border border-rbm-border bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name">
          <input
            className="rbm-input w-full"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Field>
        <Field label="Slug">
          <input
            className="rbm-input w-full"
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          className="rbm-input w-full"
          value={values.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Short description">
        <textarea
          className="rbm-input w-full"
          rows={2}
          value={values.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          required
        />
      </Field>

      <Field label="Full description">
        <textarea
          className="rbm-input w-full"
          rows={5}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="block text-sm">
          <label htmlFor="product-image" className="mb-1 block font-medium">
            Image
          </label>
          <ImageField
            id="product-image"
            value={values.imageUrl}
            onChange={(value) => update("imageUrl", value)}
          />
        </div>
        <Field label="Image alt text">
          <input
            className="rbm-input w-full"
            value={values.imageAlt}
            onChange={(e) => update("imageAlt", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Brand">
          <input className="rbm-input w-full" value={values.brand} onChange={(e) => update("brand", e.target.value)} />
        </Field>
        <Field label="SKU">
          <input className="rbm-input w-full" value={values.sku} onChange={(e) => update("sku", e.target.value)} />
        </Field>
        <Field label="Price">
          <input
            className="rbm-input w-full"
            type="number"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.published} onChange={(e) => update("published", e.target.checked)} />
          Published
        </label>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-rbm-navy px-5 py-2 text-sm font-semibold text-white hover:bg-rbm-orange disabled:opacity-60"
      >
        {loading ? "Saving…" : productId ? "Update product" : "Create product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-rbm-navy">{label}</span>
      {children}
    </label>
  );
}
