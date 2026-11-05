import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";

type DetailItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

export async function ContactDetails() {
  const { general } = await getSiteContent();
  const links = contactLinks(general);
  const items: DetailItem[] = [
    { icon: Phone, label: "Call us", value: general.phone, href: links.phoneHref },
    { icon: Mail, label: "Email us", value: general.email, href: links.emailHref },
    { icon: MapPin, label: "Visit us", value: general.address },
  ];
  if (general.hours) {
    items.push({ icon: Clock, label: "Opening hours", value: general.hours });
  }

  return (
    <ul className="divide-y divide-rbm-border border-y border-rbm-border">
      {items.map(({ icon: Icon, label, value, href }) => (
        <li key={label} className="flex items-center gap-4 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-rbm-navy text-white">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-rbm-text-secondary">{label}</p>
            {href ? (
              <a href={href} className="rbm-link break-words font-display text-base">
                {value}
              </a>
            ) : (
              <p className="font-display text-base font-semibold text-rbm-text-primary">
                {value}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
