import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProjectTile } from "@/components/projects/ProjectTile";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteContent } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Projects & Gallery",
  description:
    "The types of residential, commercial, and hospitality projects Rasmi Building Materials supplies, and the materials used in each.",
};

export default async function ProjectsPage() {
  const { projects } = await getSiteContent();
  const posts = projects.posts.filter((post) => post.published);

  return (
    <>
      <PageIntro
        eyebrow={projects.eyebrow}
        title={projects.title}
        description={projects.description}
        image={projects.image}
      />
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={projects.listEyebrow}
            title={projects.listTitle}
            description={projects.listDescription}
          />
          {posts.length > 0 ? (
            <div className="mt-12 grid grid-flow-dense gap-5 md:auto-rows-[320px] md:grid-cols-3">
              {posts.map((project) => (
                <ProjectTile
                  key={project.slug ?? project.title}
                  project={project}
                  mode="detail"
                />
              ))}
            </div>
          ) : (
            <p className="rbm-prose mt-12">New projects are coming soon.</p>
          )}
          {projects.note && posts.length > 0 ? (
            <p className="mt-5 text-xs text-rbm-text-secondary">{projects.note}</p>
          ) : null}
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
