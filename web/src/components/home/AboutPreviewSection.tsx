import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function AboutPreviewSection() {
  const { home } = await getSiteContent();

  return (
    <section className="bg-rbm-surface py-16 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow={home.aboutEyebrow} title={home.aboutTitle} />
          {home.aboutBody1 ? <p className="rbm-prose mt-6">{home.aboutBody1}</p> : null}
          {home.aboutBody2 ? <p className="rbm-prose mt-4">{home.aboutBody2}</p> : null}
          {home.aboutNote ? (
            <p className="mt-6 border-l-2 border-rbm-orange pl-4 text-sm font-medium text-rbm-text-primary">
              {home.aboutNote}
            </p>
          ) : null}
          <Button href="/about" variant="secondary" size="lg" className="mt-8">
            More About Rasmi
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <CatalogImage
            src={home.aboutImage}
            alt={home.aboutImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </Container>
    </section>
  );
}
