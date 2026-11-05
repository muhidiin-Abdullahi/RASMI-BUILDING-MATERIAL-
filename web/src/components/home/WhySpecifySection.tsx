import { Headphones, Layers, Package, Truck } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [Layers, Package, Truck, Headphones];

export async function WhySpecifySection() {
  const { home } = await getSiteContent();

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:aspect-[5/6]">
          <CatalogImage
            src={home.whyImage}
            alt={home.whyImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <SectionHeading eyebrow={home.whyEyebrow} title={home.whyTitle} />
          <ul className="mt-10 divide-y divide-rbm-border border-y border-rbm-border">
            {home.whyItems.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <li key={item.title} className="flex gap-5 py-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-rbm-navy text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-rbm-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-rbm-text-secondary sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
