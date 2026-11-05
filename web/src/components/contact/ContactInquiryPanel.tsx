"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/forms/ContactForm";

export function ContactInquiryPanel() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") ?? undefined;
  const productName = searchParams.get("productName") ?? undefined;

  return (
    <ContactForm
      id="contact-page-form"
      key={`${productSlug ?? "general"}-${productName ?? ""}`}
      initialProductSlug={productSlug}
      initialProductName={productName}
    />
  );
}
