import { getMediaFile } from "@/server/services/media.service";
import { assertMongoId, fail, route } from "@/server/http";

/** Public image file. Each upload gets a new id, so it can be cached for good. */
export const GET = route<{ id: string }>(async (_req, { params }) => {
  const { id } = await params;
  const file = await getMediaFile(assertMongoId(id));
  if (!file) {
    return fail(404, "Image not found", "NOT_FOUND");
  }
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
