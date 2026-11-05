import { recordAudit } from "@/server/services/audit.service";
import { deleteMedia } from "@/server/services/media.service";
import { adminRoute, assertMongoId, fail, ok } from "@/server/http";

export const DELETE = adminRoute<{ id: string }>(async (_req, { params }, admin) => {
  const id = assertMongoId((await params).id);
  if (!(await deleteMedia(id))) {
    return fail(404, "Image not found", "NOT_FOUND");
  }
  await recordAudit({
    actorId: admin.id,
    action: "media.delete",
    resourceType: "media",
    resourceId: id,
  });
  return ok({ ok: true });
});
