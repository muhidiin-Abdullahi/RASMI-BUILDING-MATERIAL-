import { Mail, MapPin, Phone } from "lucide-react";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";
import { Container } from "@/components/ui/Container";

export async function TopBar() {
  const { general } = await getSiteContent();
  const links = contactLinks(general);
  const socialLinks = [
    { label: "Instagram", href: general.instagram },
    { label: "Facebook", href: general.facebook },
    { label: "LinkedIn", href: general.linkedin },
  ];

  return (
    <div className="hidden bg-rbm-navy-deep text-white lg:block">
      <Container className="flex h-10 items-center justify-between text-xs">
        <div className="flex items-center gap-6 text-white/85">
          <a
            href={links.phoneHref}
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 text-rbm-orange-bright" aria-hidden />
            {general.phone}
          </a>
          <a
            href={links.emailHref}
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-rbm-orange-bright" aria-hidden />
            {general.email}
          </a>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rbm-orange-bright" aria-hidden />
            {general.address}
          </span>
        </div>
        <div className="flex items-center gap-5 text-white/85">
          {socialLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {link.label}
              </a>
            ) : null,
          )}
        </div>
      </Container>
    </div>
  );
}
