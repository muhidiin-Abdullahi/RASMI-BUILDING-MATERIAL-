import { MediaModel } from "../models/Media";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** The file's real type comes from its first bytes, never the name the browser sent. */
function detectImageType(bytes: Buffer): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

function toPublicMedia(doc: {
  _id: { toString(): string };
  filename: string;
  contentType: string;
  size: number;
  createdAt?: Date;
}) {
  const id = doc._id.toString();
  return {
    id,
    url: `/api/v1/media/${id}`,
    filename: doc.filename,
    contentType: doc.contentType,
    size: doc.size,
    createdAt: doc.createdAt,
  };
}

export async function listMedia() {
  const docs = await MediaModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map(toPublicMedia);
}

export async function createMedia(filename: string, bytes: Buffer) {
  if (bytes.length === 0) {
    throw Object.assign(new Error("The file is empty."), {
      status: 400,
      code: "EMPTY_FILE",
    });
  }
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw Object.assign(new Error("Images must be 5 MB or smaller."), {
      status: 413,
      code: "FILE_TOO_LARGE",
    });
  }
  const contentType = detectImageType(bytes);
  if (!contentType) {
    throw Object.assign(new Error("Upload a JPG, PNG, or WebP image."), {
      status: 415,
      code: "UNSUPPORTED_FILE",
    });
  }

  const doc = await MediaModel.create({
    filename: filename.trim().slice(0, 200) || "image",
    contentType,
    size: bytes.length,
    data: bytes,
  });
  return toPublicMedia(doc);
}

export async function getMediaFile(id: string) {
  return MediaModel.findById(id).select("+data").exec();
}

export async function deleteMedia(id: string) {
  const result = await MediaModel.findByIdAndDelete(id);
  return Boolean(result);
}
