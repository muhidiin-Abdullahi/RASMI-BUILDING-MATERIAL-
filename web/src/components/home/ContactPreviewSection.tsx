import { getSiteContent } from "@/lib/content/get-site-content";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function ContactPreviewSection() {
  const { home } = await getSiteContent();

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={home.contactEyebrow}
            title={home.contactTitle}
            description={home.contactDescription}
          />
          <div className="mt-10">
            <ContactDetails />
          </div>
        </div>

        <div className="rbm-card p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold tracking-tight text-rbm-text-primary">
            {home.contactFormTitle}
          </h3>
          <div className="mt-6">
            <ContactForm id="homepage-contact-form" compact />
          </div>
        </div>
      </Container>
    </section>
  );
}
