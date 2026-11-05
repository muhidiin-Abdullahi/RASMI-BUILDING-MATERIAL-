import type { SectionKey } from "./schema";

/** Describes the CMS form for each section. The editor is generated from this. */
export type Field =
  | { type: "heading"; label: string; hint?: string }
  | { type: "text" | "textarea" | "image"; name: string; label: string; hint?: string }
  | { type: "checkbox"; name: string; label: string; hint?: string }
  | {
      type: "select";
      name: string;
      label: string;
      hint?: string;
      options: Array<{ value: string; label: string }>;
    }
  | {
      type: "list";
      name: string;
      label: string;
      hint?: string;
      itemLabel: string;
      titleField: string;
      fields: Field[];
      newItem: Record<string, unknown>;
    };

const titledList = (
  name: string,
  label: string,
  itemLabel: string,
): Field => ({
  type: "list",
  name,
  label,
  itemLabel,
  titleField: "title",
  fields: [
    { type: "text", name: "title", label: "Title" },
    { type: "textarea", name: "description", label: "Description" },
  ],
  newItem: { title: "", description: "" },
});

const altHint = "Describes the photo for search engines and screen readers.";

export type ContentSection = {
  key: SectionKey;
  label: string;
  description: string;
  previewHref: string;
  fields: Field[];
};

export const contentSections: ContentSection[] = [
  {
    key: "projects",
    label: "Project posts",
    description: "Add, edit, reorder, or hide project posts, and edit the Projects page.",
    previewHref: "/projects",
    fields: [
      {
        type: "list",
        name: "posts",
        label: "Posts",
        hint: "The first four published posts also appear on the homepage.",
        itemLabel: "post",
        titleField: "title",
        newItem: {
          sector: "",
          title: "",
          description: "",
          image: "",
          alt: "",
          layout: "standard",
          published: true,
          materials: [],
        },
        fields: [
          { type: "checkbox", name: "published", label: "Published (visible on the website)" },
          { type: "text", name: "title", label: "Title" },
          { type: "text", name: "sector", label: "Label", hint: "Short tag, for example Residential." },
          { type: "textarea", name: "description", label: "Description" },
          { type: "image", name: "image", label: "Photo" },
          { type: "text", name: "alt", label: "Photo description", hint: altHint },
          {
            type: "select",
            name: "layout",
            label: "Size in the gallery",
            options: [
              { value: "standard", label: "Standard" },
              { value: "wide", label: "Wide" },
              { value: "tall", label: "Tall" },
            ],
          },
          {
            type: "list",
            name: "materials",
            label: "Material links",
            hint: "Buttons on the post that open part of your catalog.",
            itemLabel: "link",
            titleField: "label",
            newItem: { label: "", href: "/products" },
            fields: [
              { type: "text", name: "label", label: "Button text" },
              {
                type: "text",
                name: "href",
                label: "Link",
                hint: "For example /products?category=sanitary-ware",
              },
            ],
          },
        ],
      },
      { type: "heading", label: "Page header" },
      { type: "text", name: "eyebrow", label: "Small label" },
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "image", name: "image", label: "Background photo" },
      { type: "heading", label: "Above the posts" },
      { type: "text", name: "listEyebrow", label: "Small label" },
      { type: "text", name: "listTitle", label: "Title" },
      { type: "textarea", name: "listDescription", label: "Description" },
      {
        type: "textarea",
        name: "note",
        label: "Note under the gallery",
        hint: "Tells visitors the photos are illustrative. Clear it once every post uses your own project photos.",
      },
    ],
  },
  {
    key: "home",
    label: "Homepage",
    description: "All text and photos on the homepage.",
    previewHref: "/",
    fields: [
      { type: "heading", label: "Hero" },
      { type: "text", name: "heroEyebrow", label: "Small label" },
      { type: "text", name: "heroTitleLine1", label: "Headline, line 1" },
      { type: "text", name: "heroTitleLine2", label: "Headline, line 2" },
      { type: "textarea", name: "heroDescription", label: "Description" },
      { type: "text", name: "heroPrimaryLabel", label: "Main button text" },
      { type: "text", name: "heroSecondaryLabel", label: "Second button text" },
      { type: "image", name: "heroImage", label: "Background photo" },
      { type: "text", name: "heroImageAlt", label: "Photo description", hint: altHint },
      titledList("valueProps", "Highlights under the hero", "highlight"),
      { type: "heading", label: "Categories" },
      { type: "text", name: "categoriesEyebrow", label: "Small label" },
      { type: "text", name: "categoriesTitle", label: "Title" },
      { type: "heading", label: "Featured products" },
      { type: "text", name: "featuredEyebrow", label: "Small label" },
      { type: "text", name: "featuredTitle", label: "Title" },
      { type: "heading", label: "Why Rasmi" },
      { type: "text", name: "whyEyebrow", label: "Small label" },
      { type: "text", name: "whyTitle", label: "Title" },
      { type: "image", name: "whyImage", label: "Photo" },
      { type: "text", name: "whyImageAlt", label: "Photo description", hint: altHint },
      titledList("whyItems", "Reasons", "reason"),
      { type: "heading", label: "Projects preview" },
      { type: "text", name: "projectsEyebrow", label: "Small label" },
      { type: "text", name: "projectsTitle", label: "Title" },
      { type: "textarea", name: "projectsDescription", label: "Description" },
      { type: "heading", label: "About preview" },
      { type: "text", name: "aboutEyebrow", label: "Small label" },
      { type: "text", name: "aboutTitle", label: "Title" },
      { type: "textarea", name: "aboutBody1", label: "First paragraph" },
      { type: "textarea", name: "aboutBody2", label: "Second paragraph" },
      { type: "textarea", name: "aboutNote", label: "Highlighted note" },
      { type: "image", name: "aboutImage", label: "Photo" },
      { type: "text", name: "aboutImageAlt", label: "Photo description", hint: altHint },
      { type: "heading", label: "Contact section" },
      { type: "text", name: "contactEyebrow", label: "Small label" },
      { type: "text", name: "contactTitle", label: "Title" },
      { type: "textarea", name: "contactDescription", label: "Description" },
      { type: "text", name: "contactFormTitle", label: "Form title" },
    ],
  },
  {
    key: "about",
    label: "About page",
    description: "Company story, who you work with, and how you work.",
    previewHref: "/about",
    fields: [
      { type: "heading", label: "Page header" },
      { type: "text", name: "eyebrow", label: "Small label" },
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "image", name: "image", label: "Background photo" },
      { type: "heading", label: "Who we are" },
      { type: "text", name: "whoEyebrow", label: "Small label" },
      { type: "text", name: "whoTitle", label: "Title" },
      { type: "textarea", name: "whoBody1", label: "First paragraph" },
      { type: "textarea", name: "whoBody2", label: "Second paragraph" },
      { type: "image", name: "whoImage", label: "Photo" },
      { type: "text", name: "whoImageAlt", label: "Photo description", hint: altHint },
      { type: "heading", label: "Who we work with" },
      { type: "text", name: "audiencesEyebrow", label: "Small label" },
      { type: "text", name: "audiencesTitle", label: "Title" },
      titledList("audiences", "Customer types", "customer type"),
      { type: "heading", label: "How we work" },
      { type: "text", name: "howEyebrow", label: "Small label" },
      { type: "text", name: "howTitle", label: "Title" },
      { type: "image", name: "howImage", label: "Photo" },
      { type: "text", name: "howImageAlt", label: "Photo description", hint: altHint },
      titledList("steps", "Steps", "step"),
    ],
  },
  {
    key: "products",
    label: "Products page",
    description: "The header of the Products page. Add products under Products in the menu.",
    previewHref: "/products",
    fields: [
      { type: "text", name: "eyebrow", label: "Small label" },
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "image", name: "image", label: "Background photo" },
    ],
  },
  {
    key: "contact",
    label: "Contact page",
    description: "Text and photo on the Contact page.",
    previewHref: "/contact",
    fields: [
      { type: "heading", label: "Page header" },
      { type: "text", name: "eyebrow", label: "Small label" },
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "image", name: "image", label: "Background photo" },
      { type: "heading", label: "Direct contact" },
      { type: "text", name: "directEyebrow", label: "Small label" },
      { type: "text", name: "directTitle", label: "Title" },
      { type: "textarea", name: "directDescription", label: "Description" },
      { type: "text", name: "formTitle", label: "Form title" },
    ],
  },
  {
    key: "cta",
    label: "Call-to-action banner",
    description: "The photo banner shown on the Home, About, and Projects pages.",
    previewHref: "/about",
    fields: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "text", name: "buttonLabel", label: "Button text" },
      { type: "image", name: "image", label: "Background photo" },
    ],
  },
  {
    key: "general",
    label: "Contact details",
    description: "Phone, email, address, and social links shown across the whole website.",
    previewHref: "/contact",
    fields: [
      { type: "text", name: "phone", label: "Phone number" },
      { type: "text", name: "email", label: "Email" },
      { type: "text", name: "address", label: "Address" },
      { type: "text", name: "hours", label: "Opening hours", hint: "Hidden on the website when empty." },
      {
        type: "text",
        name: "whatsapp",
        label: "WhatsApp number",
        hint: "With country code, for example 252611573839. WhatsApp buttons appear once this is set.",
      },
      { type: "textarea", name: "tagline", label: "Footer description" },
      { type: "heading", label: "Social links", hint: "Hidden on the website when empty." },
      { type: "text", name: "instagram", label: "Instagram link" },
      { type: "text", name: "facebook", label: "Facebook link" },
      { type: "text", name: "linkedin", label: "LinkedIn link" },
    ],
  },
];
