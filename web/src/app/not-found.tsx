import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteHeaderFallback } from "@/components/layout/SiteHeaderFallback";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default async function NotFound() {
  const { general } = await getSiteContent();

  return (
    <div className="flex min-h-full flex-col">
      <TopBar />
      <Suspense fallback={<SiteHeaderFallback />}>
        <SiteHeader
          phone={general.phone}
          phoneHref={contactLinks(general).phoneHref}
        />
      </Suspense>
      <main className="flex-1">
        <Container className="py-24 text-center lg:py-32">
          <p className="font-display text-sm font-semibold text-rbm-orange">404</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-rbm-text-primary sm:text-5xl">
            We could not find that page
          </h1>
          <p className="rbm-prose mx-auto mt-4 max-w-lg">
            The link may be out of date. Browse our products or contact the team
            for help finding what you need.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/products" size="lg">
              Browse Products
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
