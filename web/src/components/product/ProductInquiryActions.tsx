import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import type { ProductInquiryContext } from "@/lib/inquiry-links";
import {
  buildContactInquiryUrl,
  buildMailInquiryUrl,
  buildWhatsAppInquiryUrl,
} from "@/lib/inquiry-links";
import { Button } from "@/components/ui/Button";

type ProductInquiryActionsProps = {
  product: ProductInquiryContext;
};

export async function ProductInquiryActions({ product }: ProductInquiryActionsProps) {
  const { general } = await getSiteContent();
  const whatsappUrl = buildWhatsAppInquiryUrl(product, general.whatsapp);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Button href={buildContactInquiryUrl(product)} size="lg">
        Request Price
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
      {whatsappUrl ? (
        <Button href={whatsappUrl} variant="outline" size="lg">
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp Inquiry
        </Button>
      ) : null}
      <a
        href={buildMailInquiryUrl(product, general.email)}
        className="inline-flex items-center justify-center gap-2 px-2 py-3 font-display text-sm font-semibold text-rbm-navy hover:text-rbm-orange"
      >
        <Mail className="h-4 w-4" aria-hidden />
        Email us about this product
      </a>
    </div>
  );
}
