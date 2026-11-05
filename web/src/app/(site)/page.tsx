import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProductCategoriesSection } from "@/components/home/ProductCategoriesSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { WhySpecifySection } from "@/components/home/WhySpecifySection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { ProjectsGallerySection } from "@/components/home/ProjectsGallerySection";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ContactPreviewSection } from "@/components/home/ContactPreviewSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<LoadingState label="Loading categories…" />}>
        <ProductCategoriesSection />
      </Suspense>
      <Suspense fallback={<LoadingState label="Loading featured products…" />}>
        <FeaturedProductsSection />
      </Suspense>
      <WhySpecifySection />
      <ProjectsGallerySection />
      <AboutPreviewSection />
      <ContactCTA />
      <ContactPreviewSection />
    </>
  );
}
