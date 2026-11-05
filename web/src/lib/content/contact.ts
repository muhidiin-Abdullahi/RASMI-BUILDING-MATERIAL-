import type { SiteContent } from "./schema";

/** Click-to-call, email, and WhatsApp links built from the saved contact details. */
export function contactLinks(general: SiteContent["general"]) {
  const whatsappDigits = general.whatsapp.replace(/\D/g, "");
  return {
    phoneHref: `tel:${general.phone.replace(/[\s()-]/g, "")}`,
    emailHref: `mailto:${general.email}`,
    whatsappHref: whatsappDigits ? `https://wa.me/${whatsappDigits}` : undefined,
  };
}
