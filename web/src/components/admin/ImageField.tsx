"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

type ImageFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
};

export function ImageField({ id, value, onChange, invalid }: ImageFieldProps) {
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (!picking) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPicking(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picking]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm border border-rbm-border bg-rbm-surface sm:w-36">
        {value ? (
          <CatalogImage src={value} alt="" fill className="object-cover" sizes="144px" />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-rbm-text-secondary">
            No image
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          id={id}
          className="rbm-input"
          value={value}
          aria-invalid={invalid || undefined}
          placeholder="Choose an image, or paste a link"
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="rounded-sm border border-rbm-navy/25 px-3 py-1.5 font-display text-sm font-semibold text-rbm-navy hover:border-rbm-navy"
        >
          Choose or upload image
        </button>
      </div>

      {picking ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose an image"
        >
          <div className="w-full max-w-4xl rounded-sm bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-rbm-navy">Choose an image</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setPicking(false)}
                className="rounded p-1 text-rbm-navy hover:bg-rbm-surface"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <MediaLibrary
              onSelect={(url) => {
                onChange(url);
                setPicking(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
