import { Container } from "@/components/ui/Container";

export function SiteHeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-rbm-navy/10 bg-white shadow-sm">
      <Container className="flex h-[72px] items-center justify-between">
        <div className="h-11 w-44 animate-pulse rounded-sm bg-rbm-surface" />
        <div className="hidden h-4 w-80 animate-pulse rounded-sm bg-rbm-surface lg:block" />
        <div className="h-10 w-28 animate-pulse rounded-sm bg-rbm-surface" />
      </Container>
    </header>
  );
}
