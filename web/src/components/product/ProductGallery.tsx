"use client";

import { useState } from "react";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-rbm-border bg-rbm-surface">
        <CatalogImage
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-rbm-border bg-rbm-surface">
        <CatalogImage
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          preload
        />
      </div>
      {images.length > 1 ? (
        <div
          className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5"
          aria-label={`${productName} image thumbnails`}
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rbm-navy focus-visible:ring-offset-2",
                activeIndex === index
                  ? "border-rbm-navy ring-2 ring-rbm-navy/30"
                  : "border-rbm-border",
              )}
            >
              <CatalogImage
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
