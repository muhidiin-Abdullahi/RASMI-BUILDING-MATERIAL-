"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function SiteError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center">
      <p className="font-display text-sm font-semibold text-rbm-orange">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-rbm-text-primary">
        We could not load this page
      </h1>
      <p className="rbm-prose mx-auto mt-4 max-w-lg">
        Please try again. If the problem continues, please contact our team.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button size="lg" onClick={() => retry()}>
          Try Again
        </Button>
        <Button href="/contact" variant="outline" size="lg">
          Contact Us
        </Button>
      </div>
    </Container>
  );
}
