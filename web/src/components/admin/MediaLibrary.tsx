"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { adminFetch } from "@/lib/admin/api-client";
import { bundledImages } from "@/lib/content/defaults";
import { CatalogImage } from "@/components/ui/CatalogImage";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  size: number;
};

type MediaLibraryProps = {
  /** When set, clicking an image selects it instead of offering copy and delete. */
  onSelect?: (url: string) => void;
};

export function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const result = await adminFetch<MediaItem[]>("/admin/media");
    setLoading(false);
    if (result.data) {
      setItems(result.data);
    } else {
      setMessage(result.error?.message ?? "Could not load images.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      await Promise.resolve();
      if (active) await load();
    })();
    return () => {
      active = false;
    };
  }, [load]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage(null);
    const failures: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.set("file", file);
      const result = await adminFetch<MediaItem>("/admin/media", {
        method: "POST",
        body: form,
      });
      if (result.error) {
        failures.push(`${file.name}: ${result.error.message}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    setMessage(failures.length ? failures.join(" ") : "Upload complete.");
    await load();
  }

  async function onDelete(item: MediaItem) {
    if (
      !window.confirm(
        `Delete ${item.filename}? Any page or product using this image will lose it.`,
      )
    ) {
      return;
    }
    const result = await adminFetch(`/admin/media/${item.id}`, { method: "DELETE" });
    setMessage(result.error ? result.error.message : "Image deleted.");
    await load();
  }

  async function onCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage(`Copied ${url}`);
  }

  function tile(url: string, label: string, actions?: React.ReactNode) {
    const preview = (
      <span className="relative block aspect-[4/3] overflow-hidden bg-rbm-surface">
        <CatalogImage
          src={url}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 200px"
        />
      </span>
    );
    return (
      <li key={url} className="overflow-hidden rounded-sm border border-rbm-border bg-white">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(url)}
            aria-label={`Use ${label}`}
            className="block w-full hover:opacity-80"
          >
            {preview}
          </button>
        ) : (
          preview
        )}
        <div className="flex items-center justify-between gap-2 p-2">
          <span className="min-w-0 truncate text-xs text-rbm-text-secondary">{label}</span>
          {actions}
        </div>
      </li>
    );
  }

  const gridClass = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id="media-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => void onFiles(event.target.files)}
        />
        <label
          htmlFor="media-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-rbm-orange px-4 py-2 font-display text-sm font-semibold text-white hover:bg-rbm-orange-dark"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {uploading ? "Uploading…" : "Upload photos"}
        </label>
        <span className="text-xs text-rbm-text-secondary">JPG, PNG, or WebP, up to 5 MB each.</span>
      </div>

      {message ? (
        <p className="text-sm text-rbm-navy" role="status">
          {message}
        </p>
      ) : null}

      <section>
        <h3 className="font-display text-base font-semibold text-rbm-navy">Your uploads</h3>
        {loading ? (
          <p className="mt-2 text-sm text-rbm-text-secondary">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-2 text-sm text-rbm-text-secondary">No uploads yet.</p>
        ) : (
          <ul className={`mt-3 ${gridClass}`}>
            {items.map((item) =>
              tile(
                item.url,
                item.filename,
                onSelect ? null : (
                  <span className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label={`Copy link to ${item.filename}`}
                      onClick={() => void onCopy(item.url)}
                      className="rounded p-1 text-rbm-navy hover:bg-rbm-surface"
                    >
                      <Copy className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${item.filename}`}
                      onClick={() => void onDelete(item)}
                      className="rounded p-1 text-rbm-orange hover:bg-rbm-surface"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ),
              ),
            )}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-display text-base font-semibold text-rbm-navy">Website images</h3>
        <ul className={`mt-3 ${gridClass}`}>
          {bundledImages.map((url) => tile(url, url.split("/").pop() ?? url))}
        </ul>
      </section>
    </div>
  );
}
