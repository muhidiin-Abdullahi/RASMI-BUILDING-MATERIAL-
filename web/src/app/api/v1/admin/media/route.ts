import { recordAudit } from "@/server/services/audit.service";
import { createMedia, listMedia } from "@/server/services/media.service";
import { HttpError, adminRoute, ok } from "@/server/http";

export const GET = adminRoute(async () => ok(await listMedia()));

export const POST = adminRoute(async (req, _ctx, admin) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    throw new HttpError(400, "Choose an image to upload.", "VALIDATION_ERROR");
  }
  const media = await createMedia(file.name, Buffer.from(await file.arrayBuffer()));
  await recordAudit({
    actorId: admin.id,
    action: "media.upload",
    resourceType: "media",
    resourceId: media.id,
  });
  return ok(media, 201);
});
