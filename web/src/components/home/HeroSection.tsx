import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function HeroSection() {
  const { home } = await getSiteContent();

  return (
    <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-rbm-navy-deep text-white lg:min-h-[760px]">
      <CatalogImage
        src={home.heroImage}
        alt={home.heroImageAlt}
        fill
        preload
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-rbm-navy-deep/95 via-rbm-navy-deep/70 to-rbm-navy-deep/10"
        aria-hidden
      />

      <Container className="flex flex-1 flex-col justify-center py-16 lg:py-24">
        {home.heroEyebrow ? (
          <p className="rbm-eyebrow rbm-eyebrow-light">{home.heroEyebrow}</p>
        ) : null}
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.5rem]">
          <span className="block">{home.heroTitleLine1}</span>
          {home.heroTitleLine2 ? (
            <span className="block">{home.heroTitleLine2}</span>
          ) : null}
        </h1>
        {home.heroDescription ? (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {home.heroDescription}
          </p>
        ) : null}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/products" size="lg">
            {home.heroPrimaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/contact" variant="outlineLight" size="lg">
            {home.heroSecondaryLabel}
          </Button>
        </div>
      </Container>

      {home.valueProps.length > 0 ? (
        <div className="border-t border-white/15 bg-rbm-navy-deep/70 backdrop-blur-sm">
          <Container className="grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {home.valueProps.map((item) => (
              <div key={item.title} className="py-5 md:px-8 md:py-7 md:first:pl-0 md:last:pr-0">
                <h2 className="font-display text-base font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-white/75">
                  {item.description}
                </p>
              </div>
            ))}
          </Container>
        </div>
      ) : null}
    </section>
  );
}
