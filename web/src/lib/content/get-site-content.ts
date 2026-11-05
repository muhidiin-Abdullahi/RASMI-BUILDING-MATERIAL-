import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { isFixtureCatalogMode } from "@/lib/api/config";
import { connectDatabase } from "@/server/db";
import { readStoredContent } from "@/server/services/site-content.service";
import { defaultContent } from "./defaults";
import { mergeContent, type SiteContent } from "./schema";
import { SITE_CONTENT_TAG } from "./tag";

/** Cached so public pages stay fast; saving in the CMS clears it through the tag. */
async function loadStoredContent() {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);
  cacheLife("max");
  await connectDatabase();
  return readStoredContent();
}

/** Falls back to the defaults, so a database outage never takes the site down. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (isFixtureCatalogMode()) {
    return defaultContent;
  }
  try {
    return mergeContent(defaultContent, await loadStoredContent());
  } catch (error) {
    unstable_rethrow(error);
    console.error("Could not load site content; using defaults.", error);
    return defaultContent;
  }
});
