import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactInquiryPanel } from "@/components/contact/ContactInquiryPanel";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { LoadingState } from "@/components/ui/LoadingState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteContent } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a quote, send your material schedule or BOQ, and connect with the Rasmi Building Materials team.",
};

export default async function ContactPage() {
  const { contact } = await getSiteContent();

  return (
    <>
      <PageIntro
        eyebrow={contact.eyebrow}
        title={contact.title}
        description={contact.description}
        image={contact.image}
      />
      <section className="bg-white py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <aside>
            <SectionHeading
              eyebrow={contact.directEyebrow}
              title={contact.directTitle}
              description={contact.directDescription}
            />
            <div className="mt-10">
              <ContactDetails />
            </div>
          </aside>
          <div className="rbm-card p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-rbm-text-primary">
              {contact.formTitle}
            </h2>
            <div className="mt-6">
              <Suspense fallback={<LoadingState label="Loading inquiry form…" />}>
                <ContactInquiryPanel />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
