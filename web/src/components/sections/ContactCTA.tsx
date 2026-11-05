import { ArrowRight, MessageCircle } from "lucide-react";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function ContactCTA() {
  const { cta, general } = await getSiteContent();
  const links = contactLinks(general);

  return (
    <section className="relative isolate overflow-hidden bg-rbm-navy-deep text-white">
      <CatalogImage
        src={cta.image}
        alt=""
        fill
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-rbm-navy-deep via-rbm-navy-deep/85 to-rbm-navy-deep/40"
        aria-hidden
      />
      <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {cta.title}
          </h2>
          {cta.description ? (
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
              {cta.description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            {cta.buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          {links.whatsappHref ? (
            <Button href={links.whatsappHref} variant="outlineLight" size="lg">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </Button>
          ) : (
            <Button href={links.phoneHref} variant="outlineLight" size="lg">
              Call {general.phone}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
