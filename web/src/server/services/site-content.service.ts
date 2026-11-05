import type { ProjectPost, SectionKey, SiteContent } from "../../lib/content/schema";
import { SECTION_KEYS } from "../../lib/content/schema";
import { SiteContentModel } from "../models/SiteContent";
import { normalizeSlug } from "../utils/slug";

type StoredContent = Partial<Record<SectionKey, Record<string, unknown>>>;

/** Saved sections only; plain JSON so the result can be cached. */
export async function readStoredContent(): Promise<StoredContent> {
  const docs = await SiteContentModel.find({ key: { $in: SECTION_KEYS } }).lean();
  const stored: StoredContent = {};
  for (const doc of docs) {
    if (doc.data) {
      stored[doc.key as SectionKey] = JSON.parse(JSON.stringify(doc.data));
    }
  }
  return stored;
}

function assignPostSlugs(posts: ProjectPost[]): ProjectPost[] {
  const used = new Set<string>();
  return posts.map((post) => {
    const base = normalizeSlug(post.title) || "project";
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix += 1) {
      slug = `${base}-${suffix}`;
    }
    used.add(slug);
    return { ...post, slug };
  });
}

export async function saveContentSection<K extends SectionKey>(
  section: K,
  data: SiteContent[K],
): Promise<SiteContent[K]> {
  const toSave =
    section === "projects"
      ? {
          ...(data as SiteContent["projects"]),
          posts: assignPostSlugs((data as SiteContent["projects"]).posts),
        }
      : data;

  await SiteContentModel.findOneAndUpdate(
    { key: section },
    { key: section, data: toSave },
    { upsert: true, new: true },
  );
  return toSave as SiteContent[K];
}
