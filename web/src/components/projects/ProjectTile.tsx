import Link from "next/link";
import type { ProjectPost } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { CatalogImage } from "@/components/ui/CatalogImage";

type ProjectTileProps = {
  project: ProjectPost;
  /** Homepage tiles link through to the gallery; gallery tiles list materials. */
  mode: "link" | "detail";
  /** Overrides the post's saved size. */
  layout?: ProjectPost["layout"];
};

const layoutClasses: Record<ProjectPost["layout"], string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  standard: "",
};

const tileClass =
  "group relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-sm bg-rbm-navy text-white";

export function ProjectTile({ project, mode, layout }: ProjectTileProps) {
  const size = layout ?? project.layout;
  const content = (
    <>
      <CatalogImage
        src={project.image}
        alt={project.alt}
        fill
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={
          size === "wide"
            ? "(max-width: 768px) 100vw, 66vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-rbm-navy-deep/95 via-rbm-navy-deep/40 to-transparent"
        aria-hidden
      />
      <div className="p-6">
        <p className="inline-block bg-rbm-orange px-2 py-0.5 font-display text-[11px] font-semibold tracking-wide">
          {project.sector}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
          {project.description}
        </p>
        {mode === "detail" && project.materials.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.materials.map((material) => (
              <li key={`${material.label}-${material.href}`}>
                <Link
                  href={material.href}
                  className="inline-block rounded-sm border border-white/40 px-2.5 py-1 text-xs font-medium hover:border-white hover:bg-white hover:text-rbm-navy"
                >
                  {material.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );

  if (mode === "link") {
    return (
      <Link
        href={`/projects#${project.slug}`}
        className={cn(tileClass, layoutClasses[size])}
      >
        {content}
      </Link>
    );
  }

  return (
    <article id={project.slug} className={cn(tileClass, layoutClasses[size])}>
      {content}
    </article>
  );
}
