import { DEFAULT_CONTENT_KEYS, SiteContentModel } from "../models/SiteContent.js";

export async function listSiteContent() {
  const docs = await SiteContentModel.find({}).sort({ key: 1 }).lean();
  return docs.map((d) => ({
    key: d.key,
    value: d.value,
    label: d.label,
    updatedAt: d.updatedAt,
  }));
}

export async function upsertSiteContentEntries(
  entries: Array<{ key: string; value: string; label?: string }>,
) {
  for (const entry of entries) {
    await SiteContentModel.findOneAndUpdate(
      { key: entry.key },
      {
        key: entry.key,
        value: entry.value,
        ...(entry.label ? { label: entry.label } : {}),
      },
      { upsert: true, new: true, runValidators: true },
    );
  }
  return listSiteContent();
}

export async function ensureDefaultContentKeys() {
  for (const key of DEFAULT_CONTENT_KEYS) {
    await SiteContentModel.updateOne(
      { key },
      { $setOnInsert: { key, value: "", label: key } },
      { upsert: true },
    );
  }
}
