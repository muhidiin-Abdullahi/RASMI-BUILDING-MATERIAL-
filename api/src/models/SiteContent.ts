import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";

/** Keyed site copy editable from the CMS (plain text / URLs only). */
const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    value: { type: String, required: true, trim: true, maxlength: 8000 },
    label: { type: String, trim: true, maxlength: 160 },
  },
  { timestamps: true },
);

export type SiteContentDocument = InferSchemaType<typeof siteContentSchema> & {
  _id: Types.ObjectId;
};

export const SiteContentModel = (
  mongoose.models.SiteContent ??
  mongoose.model("SiteContent", siteContentSchema)
) as mongoose.Model<SiteContentDocument>;

export const DEFAULT_CONTENT_KEYS = [
  "home.hero.title",
  "home.hero.subtitle",
  "home.intro.body",
  "contact.phone",
  "contact.email",
  "footer.tagline",
] as const;
