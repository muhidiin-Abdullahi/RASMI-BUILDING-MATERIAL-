import { z } from "zod";

const REQUIRED = "This field is required.";

const short = () => z.string().trim().max(300);
const shortRequired = () => short().min(1, REQUIRED);
const long = () => z.string().trim().max(3000);
const longRequired = () => long().min(1, REQUIRED);

const imagePath = () =>
  z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === "" || /^(\/|https?:\/\/)/i.test(value), {
      message: "Choose an image, or enter a path starting with / or https://.",
    });

const webLink = () =>
  z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === "" || /^https?:\/\//i.test(value), {
      message: "Enter a full link starting with https://.",
    });

const titledItem = z.object({
  title: shortRequired(),
  description: longRequired(),
});

const projectPost = z.object({
  /** Set on the server from the title; used as the post's page anchor. */
  slug: short().optional(),
  sector: shortRequired(),
  title: shortRequired(),
  description: longRequired(),
  image: imagePath().refine((value) => value !== "", { message: REQUIRED }),
  alt: short(),
  layout: z.enum(["standard", "wide", "tall"]),
  published: z.boolean(),
  materials: z
    .array(
      z.object({
        label: shortRequired(),
        href: z
          .string()
          .trim()
          .max(2000)
          .refine((value) => /^(\/|https?:\/\/)/i.test(value), {
            message: "Enter a link starting with / or https://.",
          }),
      }),
    )
    .max(8),
});

export type ProjectPost = z.infer<typeof projectPost>;

export const sectionSchemas = {
  general: z.object({
    tagline: longRequired(),
    phone: shortRequired(),
    email: z.email("Enter a valid email address.").max(160),
    address: shortRequired(),
    hours: short(),
    whatsapp: z
      .string()
      .trim()
      .max(30)
      .refine((value) => /^[+\d\s()-]*$/.test(value), {
        message: "Use numbers only, for example 252611573839.",
      }),
    instagram: webLink(),
    facebook: webLink(),
    linkedin: webLink(),
  }),
  home: z.object({
    heroEyebrow: short(),
    heroTitleLine1: shortRequired(),
    heroTitleLine2: short(),
    heroDescription: long(),
    heroImage: imagePath(),
    heroImageAlt: short(),
    heroPrimaryLabel: shortRequired(),
    heroSecondaryLabel: shortRequired(),
    valueProps: z.array(titledItem).max(6),
    categoriesEyebrow: short(),
    categoriesTitle: shortRequired(),
    featuredEyebrow: short(),
    featuredTitle: shortRequired(),
    whyEyebrow: short(),
    whyTitle: shortRequired(),
    whyImage: imagePath(),
    whyImageAlt: short(),
    whyItems: z.array(titledItem).max(8),
    projectsEyebrow: short(),
    projectsTitle: shortRequired(),
    projectsDescription: long(),
    aboutEyebrow: short(),
    aboutTitle: shortRequired(),
    aboutBody1: long(),
    aboutBody2: long(),
    aboutNote: long(),
    aboutImage: imagePath(),
    aboutImageAlt: short(),
    contactEyebrow: short(),
    contactTitle: shortRequired(),
    contactDescription: long(),
    contactFormTitle: shortRequired(),
  }),
  products: z.object({
    eyebrow: short(),
    title: shortRequired(),
    description: long(),
    image: imagePath(),
  }),
  projects: z.object({
    eyebrow: short(),
    title: shortRequired(),
    description: long(),
    image: imagePath(),
    listEyebrow: short(),
    listTitle: shortRequired(),
    listDescription: long(),
    note: long(),
    posts: z.array(projectPost).max(60),
  }),
  about: z.object({
    eyebrow: short(),
    title: shortRequired(),
    description: long(),
    image: imagePath(),
    whoEyebrow: short(),
    whoTitle: shortRequired(),
    whoBody1: long(),
    whoBody2: long(),
    whoImage: imagePath(),
    whoImageAlt: short(),
    audiencesEyebrow: short(),
    audiencesTitle: shortRequired(),
    audiences: z.array(titledItem).max(8),
    howEyebrow: short(),
    howTitle: shortRequired(),
    howImage: imagePath(),
    howImageAlt: short(),
    steps: z.array(titledItem).max(8),
  }),
  contact: z.object({
    eyebrow: short(),
    title: shortRequired(),
    description: long(),
    image: imagePath(),
    directEyebrow: short(),
    directTitle: shortRequired(),
    directDescription: long(),
    formTitle: shortRequired(),
  }),
  cta: z.object({
    title: shortRequired(),
    description: long(),
    image: imagePath(),
    buttonLabel: shortRequired(),
  }),
};

export type SectionKey = keyof typeof sectionSchemas;

export type SiteContent = {
  [K in SectionKey]: z.infer<(typeof sectionSchemas)[K]>;
};

export const SECTION_KEYS = Object.keys(sectionSchemas) as SectionKey[];

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && value in sectionSchemas;
}

/** Saved sections are laid over the defaults, so fields added later still have a value. */
export function mergeContent(
  defaults: SiteContent,
  stored: Partial<Record<SectionKey, Record<string, unknown>>>,
): SiteContent {
  const merged = { ...defaults } as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) {
    const section = stored[key];
    if (section) {
      merged[key] = { ...defaults[key], ...section };
    }
  }
  return merged as SiteContent;
}
