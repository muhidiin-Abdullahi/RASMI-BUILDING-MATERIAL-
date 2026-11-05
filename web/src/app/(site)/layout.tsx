import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteHeaderFallback } from "@/components/layout/SiteHeaderFallback";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { contactLinks } from "@/lib/content/contact";
import { getSiteContent } from "@/lib/content/get-site-content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
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
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
