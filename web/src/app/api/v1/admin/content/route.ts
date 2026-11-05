import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { defaultContent } from "@/lib/content/defaults";
import { isSectionKey, mergeContent, sectionSchemas } from "@/lib/content/schema";
import { SITE_CONTENT_TAG } from "@/lib/content/tag";
import { recordAudit } from "@/server/services/audit.service";
import {
  readStoredContent,
  saveContentSection,
} from "@/server/services/site-content.service";
import { HttpError, adminRoute, ok, readBody, toFieldErrors } from "@/server/http";

const patchSchema = z.object({
  section: z.string().refine(isSectionKey, { message: "Unknown section" }),
  data: z.unknown(),
});

export const GET = adminRoute(async () =>
  ok({
    content: mergeContent(defaultContent, await readStoredContent()),
    defaults: defaultContent,
  }),
);

export const PATCH = adminRoute(async (req, _ctx, admin) => {
  const { section, data } = await readBody(req, patchSchema);
  if (!isSectionKey(section)) {
    throw new HttpError(400, "Unknown section", "VALIDATION_ERROR");
  }

  const parsed = sectionSchemas[section].safeParse(data);
  if (!parsed.success) {
    throw new HttpError(
      400,
      "Please fix the highlighted fields.",
      "VALIDATION_ERROR",
      toFieldErrors(parsed.error),
    );
  }

  const saved = await saveContentSection(section, parsed.data as never);
  await recordAudit({
    actorId: admin.id,
    action: "content.update",
    resourceType: "site_content",
    resourceId: section,
  });

  // The next visit to any public page shows the saved content.
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return ok(saved);
});
