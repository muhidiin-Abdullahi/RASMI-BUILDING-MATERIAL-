"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";
import { ImageField } from "@/components/admin/ImageField";

export function CategoryForm({
  categoryId,
  initial,
}: {
  categoryId?: string;
  initial?: {
    name: string;
    slug: string;
    description: string;
    image: string;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const body = { name, slug, description, image, published };
    const path = categoryId ? `/admin/categories/${categoryId}` : "/admin/categories";
    const result = await adminFetch(path, {
      method: categoryId ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded border border-rbm-border bg-white p-6">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Name</span>
        <input className="rbm-input w-full" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Slug</span>
        <input className="rbm-input w-full" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Description</span>
        <textarea className="rbm-input w-full" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <div className="block text-sm">
        <label htmlFor="category-image" className="mb-1 block font-medium">Image</label>
        <ImageField id="category-image" value={image} onChange={setImage} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published on website
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={loading} className="rounded bg-rbm-navy px-5 py-2 text-sm font-semibold text-white">
        {loading ? "Saving…" : categoryId ? "Update category" : "Create category"}
      </button>
    </form>
  );
}
