import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
};

export function PageIntro({ eyebrow, title, description, image }: PageIntroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-rbm-navy-deep text-white">
      <CatalogImage
        src={image}
        alt=""
        fill
        preload
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-rbm-navy-deep via-rbm-navy-deep/85 to-rbm-navy-deep/45"
        aria-hidden
      />
      <Container className="py-16 lg:py-24">
        {eyebrow ? (
          <p className="rbm-eyebrow rbm-eyebrow-light">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
