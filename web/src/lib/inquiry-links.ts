import { siteConfig } from "@/lib/site-config";

export type ProductInquiryContext = {
  slug: string;
  name: string;
};

export function buildContactInquiryUrl(product: ProductInquiryContext): string {
  const params = new URLSearchParams({
    product: product.slug,
    productName: product.name,
  });
  return `/contact?${params.toString()}`;
}

export function buildWhatsAppInquiryUrl(
  product: ProductInquiryContext,
  whatsapp: string,
): string | undefined {
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) {
    return undefined;
  }
  const message = `Hello ${siteConfig.shortName}, I would like to inquire about: ${product.name}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildMailInquiryUrl(
  product: ProductInquiryContext,
  email: string,
): string {
  const subject = encodeURIComponent(`Product inquiry: ${product.name}`);
  const body = encodeURIComponent(
    `Hello,\n\nI am interested in the following product:\n- ${product.name}\n- Reference: ${product.slug}\n\n`,
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
