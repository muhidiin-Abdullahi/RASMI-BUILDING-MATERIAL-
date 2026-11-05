import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { CatalogImage } from "@/components/ui/CatalogImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteContent } from "@/lib/content/get-site-content";
import { footerCategoryLinks } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Rasmi Building Materials Co. supplies brassware, sanitary ware, mirrors, tiles, and finishing materials to homeowners, contractors, architects, and developers.",
};

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <>
      <PageIntro
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.description}
        image={about.image}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={about.whoEyebrow} title={about.whoTitle} />
            {about.whoBody1 ? <p className="rbm-prose mt-6">{about.whoBody1}</p> : null}
            {about.whoBody2 ? <p className="rbm-prose mt-4">{about.whoBody2}</p> : null}
            <ul className="mt-8 divide-y divide-rbm-border border-y border-rbm-border">
              {footerCategoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-3.5 font-display font-medium text-rbm-text-primary transition-colors hover:text-rbm-orange"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-rbm-orange" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:aspect-[5/6]">
            <CatalogImage
              src={about.whoImage}
              alt={about.whoImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>

      <section className="bg-rbm-surface py-16 lg:py-24">
        <Container>
          <SectionHeading eyebrow={about.audiencesEyebrow} title={about.audiencesTitle} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {about.audiences.map((audience) => (
              <article
                key={audience.title}
                className="rbm-card border-t-2 border-t-rbm-orange p-6"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-rbm-text-primary">
                  {audience.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-rbm-text-secondary">
                  {audience.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <CatalogImage
              src={about.howImage}
              alt={about.howImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading eyebrow={about.howEyebrow} title={about.howTitle} />
            <ol className="mt-10 space-y-7">
              {about.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-display text-3xl font-bold leading-none text-rbm-orange">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-rbm-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-rbm-text-secondary sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
