import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";
import { footerCategoryLinks, footerCompanyLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";

const headingClass = "font-display text-sm font-semibold tracking-wide text-white";

export async function SiteFooter() {
  const { general } = await getSiteContent();
  const links = contactLinks(general);

  return (
    <footer className="bg-rbm-navy-deep text-white">
      <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <p className="font-display text-xl font-bold tracking-tight">
              {siteConfig.name}
            </p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
            {general.tagline}
          </p>
        </div>

        <div>
          <h3 className={headingClass}>Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {footerCompanyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {footerCategoryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Office</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rbm-orange-bright" aria-hidden />
              <span>{general.address}</span>
            </li>
            <li>
              <a
                href={links.phoneHref}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 text-rbm-orange-bright" aria-hidden />
                {general.phone}
              </a>
            </li>
            <li>
              <a
                href={links.emailHref}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 text-rbm-orange-bright" aria-hidden />
                {general.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-xs text-white/60">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
