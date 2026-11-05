/**
 * Fixed site identity. Editable text and contact details live in the CMS
 * (src/lib/content), with their starting values in src/lib/content/defaults.ts.
 */
export const siteConfig = {
  name: "Rasmi Building Materials Co.",
  shortName: "RBM",
  /** Static for prerender-safe footer; update when publishing a new copyright year */
  copyrightYear: 2026,
  description:
    "Building materials, brassware, sanitary ware, mirrors, and tiles for homeowners, contractors, architects, and developers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
