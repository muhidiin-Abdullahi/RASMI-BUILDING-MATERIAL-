import Image, { type ImageProps } from "next/image";

const FALLBACK_IMAGE = "/images/showroom-materials.jpg";

type CatalogImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

/**
 * Image for CMS-managed catalog data. The CMS accepts any URL or an empty value,
 * and next/image throws on empty paths and on hosts missing from remotePatterns,
 * which would crash the whole page. Remote images skip the optimizer instead.
 */
export function CatalogImage({ src, alt, ...props }: CatalogImageProps) {
  const value = src?.trim() ?? "";
  const isRemote = /^https?:\/\//i.test(value);
  const url = isRemote || value.startsWith("/") ? value : FALLBACK_IMAGE;

  return <Image {...props} src={url} alt={alt} unoptimized={isRemote} />;
}
