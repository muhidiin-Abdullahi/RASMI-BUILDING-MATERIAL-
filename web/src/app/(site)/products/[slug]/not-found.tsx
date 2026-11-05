import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFoundPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Not found" },
        ]}
      />
      <Container className="py-16">
        <EmptyState
          title="Product not found"
          description="This product may be unpublished, removed, or the link may be incorrect."
          actionHref="/products"
          actionLabel="Back to catalog"
        />
      </Container>
    </>
  );
}
