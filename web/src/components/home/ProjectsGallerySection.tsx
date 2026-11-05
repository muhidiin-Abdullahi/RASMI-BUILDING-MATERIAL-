import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteContent } from "@/lib/content/get-site-content";
import type { ProjectPost } from "@/lib/content/schema";
import { ProjectTile } from "@/components/projects/ProjectTile";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Fixed sizes that always fill the grid, whichever posts come first. */
const previewLayouts: ProjectPost["layout"][] = ["wide", "tall", "standard", "standard"];

export async function ProjectsGallerySection() {
  const { home, projects } = await getSiteContent();
  const posts = projects.posts.filter((post) => post.published).slice(0, 4);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-rbm-navy py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={home.projectsEyebrow}
            title={home.projectsTitle}
            description={home.projectsDescription}
            tone="dark"
          />
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-white hover:text-rbm-orange-bright"
          >
            View all projects
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:auto-rows-[300px] md:grid-cols-3">
          {posts.map((project, index) => (
            <ProjectTile
              key={project.slug ?? project.title}
              project={project}
              mode="link"
              layout={posts.length === 4 ? previewLayouts[index] : "standard"}
            />
          ))}
        </div>
        {projects.note ? (
          <p className="mt-5 text-xs text-white/60">{projects.note}</p>
        ) : null}
      </Container>
    </section>
  );
}
