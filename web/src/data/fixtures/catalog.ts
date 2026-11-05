/**
 * DEVELOPMENT FIXTURE DATA — not confirmed Rasmi inventory.
 * Replace via ProductService API implementation when MongoDB catalog is live.
 */

import type { Category, Product } from "@/types/product";

const ts = "2025-06-01T00:00:00.000Z";

export const developmentCategories: Category[] = [
  {
    id: "cat-bathroom-mirrors",
    name: "Bathroom Mirrors",
    slug: "bathroom-mirrors",
    description:
      "Backlit and architectural mirror systems for residential and commercial washrooms.",
    image: "/images/categories/bathroom-mirrors.jpg",
    published: true,
  },
  {
    id: "cat-basin-mixer-taps",
    name: "Basin Mixer Taps",
    slug: "basin-mixer-taps",
    description:
      "Single-lever and dual-control basin mixers in PVD brass, chrome, and matte finishes.",
    image: "/images/categories/basin-mixer-taps.jpg",
    published: true,
  },
  {
    id: "cat-sanitary-ware",
    name: "Sanitary Ware",
    slug: "sanitary-ware",
    description:
      "Wall-hung and floor-standing sanitary ceramics with clean, modern profiles.",
    image: "/images/categories/sanitary-ware.jpg",
    published: true,
  },
  {
    id: "cat-tiles-finishing",
    name: "Tiles & Finishing Materials",
    slug: "tiles-finishing-materials",
    description:
      "Large-format porcelain, stone-look tiles, and coordinated finishing materials.",
    image: "/images/categories/tiles-finishing.jpg",
    published: true,
  },
];

export const developmentProducts: Product[] = [
  {
    id: "dev-prod-001",
    name: "Halo Round LED Mirror",
    slug: "halo-round-led-mirror",
    categoryId: "cat-bathroom-mirrors",
    shortDescription: "Backlit circular mirror with even perimeter illumination.",
    description:
      "Backlit circular mirror with even perimeter illumination. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/mirror-round-led.jpg",
        alt: "Round backlit LED mirror above a wall-hung vanity with a white basin",
      },
    ],
    specifications: [
      { label: "Shape", value: "Round" },
      { label: "Lighting", value: "Perimeter LED" },
      { label: "Documentation", value: "Technical sheets on request" },
    ],
    featured: true,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-002",
    name: "Brushed Gold Basin Mixer",
    slug: "brushed-gold-basin-mixer",
    categoryId: "cat-basin-mixer-taps",
    shortDescription: "Single-lever deck mixer with ceramic disc cartridge.",
    description:
      "Single-lever deck mixer with ceramic disc cartridge. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/categories/basin-mixer-taps.jpg",
        alt: "Brushed brass basin mixer on a marble vanity",
      },
    ],
    specifications: [
      { label: "Mount Type", value: "Deck-mounted" },
      { label: "Handle", value: "Single lever" },
      { label: "Finish", value: "Brushed gold" },
    ],
    featured: true,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-003",
    name: "Full Matt Black Rain Shower",
    slug: "full-matt-black-rain-shower",
    categoryId: "cat-basin-mixer-taps",
    shortDescription: "Ceiling-mounted rain shower for contemporary wet rooms.",
    description:
      "Ceiling-mounted rain shower for contemporary wet rooms. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/shower-matt-black.jpg",
        alt: "Glass shower enclosure with matt black rain shower fittings",
      },
    ],
    specifications: [
      { label: "Application", value: "Shower area" },
      { label: "Finish", value: "Matt black" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-004",
    name: "Floor Mounted Bath Mixer",
    slug: "floor-mounted-bath-mixer",
    categoryId: "cat-basin-mixer-taps",
    shortDescription: "Freestanding tub filler with hand shower set.",
    description:
      "Freestanding tub filler with hand shower set. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/bath-mixer-brass.jpg",
        alt: "Brass bath mixer with a handheld shower head",
      },
    ],
    specifications: [
      { label: "Mount Type", value: "Floor-mounted" },
      { label: "Configuration", value: "Tub filler with hand shower" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-005",
    name: "Wall-Hung WC Suite",
    slug: "wall-hung-wc-suite",
    categoryId: "cat-sanitary-ware",
    shortDescription: "Minimal wall-hung toilet for compact layouts.",
    description:
      "Minimal wall-hung toilet for compact layouts. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/wc-wall-hung.jpg",
        alt: "White wall-hung ceramic sanitary ware with a chrome mixer",
      },
    ],
    specifications: [
      { label: "Installation", value: "Wall-hung" },
      { label: "Material", value: "Vitreous china" },
    ],
    featured: true,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-006",
    name: "Rimless Close-Coupled WC",
    slug: "rimless-close-coupled-wc",
    categoryId: "cat-sanitary-ware",
    shortDescription: "Rimless pan with simplified maintenance geometry.",
    description:
      "Rimless pan with simplified maintenance geometry. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/wc-close-coupled.jpg",
        alt: "Close-coupled WC beside a white vanity against dark marble walls",
      },
    ],
    specifications: [
      { label: "Installation", value: "Floor-standing" },
      { label: "Rim Profile", value: "Rimless" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-007",
    name: "Rectified Porcelain Slab",
    slug: "rectified-porcelain-slab",
    categoryId: "cat-tiles-finishing",
    shortDescription: "Large-format surface for seamless elevations.",
    description:
      "Large-format surface for seamless elevations. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/showroom-materials.jpg",
        alt: "Showroom display of large marble-look slabs and material samples",
      },
    ],
    specifications: [
      { label: "Format", value: "Large-format slab" },
      { label: "Edge", value: "Rectified" },
    ],
    featured: true,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-008",
    name: "Stone-Look Porcelain Tile",
    slug: "stone-look-porcelain-tile",
    categoryId: "cat-tiles-finishing",
    shortDescription: "Matte stone-look tile for wet-area floors and walls.",
    description:
      "Matte stone-look tile for wet-area floors and walls. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/tile-stone-look.jpg",
        alt: "Bathroom finished in stone-look wall tiles with a timber vanity",
      },
    ],
    specifications: [
      { label: "Finish", value: "Matte stone look" },
      { label: "Application", value: "Wall and floor" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-009",
    name: "Architectural Rectangle Mirror",
    slug: "architectural-rectangle-mirror",
    categoryId: "cat-bathroom-mirrors",
    shortDescription: "Frameless rectangle mirror for specifier bathrooms.",
    description:
      "Frameless rectangle mirror for specifier bathrooms. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/categories/bathroom-mirrors.jpg",
        alt: "Large rectangular illuminated mirror above a white vanity",
      },
    ],
    specifications: [
      { label: "Shape", value: "Rectangle" },
      { label: "Frame", value: "Frameless" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: "dev-prod-010",
    name: "Chrome Single-Lever Basin Mixer",
    slug: "chrome-single-lever-basin-mixer",
    categoryId: "cat-basin-mixer-taps",
    shortDescription: "Chrome deck mixer for standard basin installations.",
    description:
      "Chrome deck mixer for standard basin installations. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/tap-chrome.jpg",
        alt: "Chrome single-lever basin mixer on a white basin",
      },
    ],
    specifications: [
      { label: "Finish", value: "Chrome" },
      { label: "Mount Type", value: "Deck-mounted" },
    ],
    featured: false,
    published: true,
    createdAt: ts,
    updatedAt: ts,
  },
  /** Unpublished — used to verify public access rules */
  {
    id: "dev-prod-draft",
    name: "Draft Catalog Entry (Internal)",
    slug: "draft-catalog-entry-internal",
    categoryId: "cat-sanitary-ware",
    shortDescription: "Unpublished development record.",
    description: "This product must not appear in the public catalog.",
    images: [
      {
        url: "/images/hero-bathroom-stone.jpg",
        alt: "Placeholder",
      },
    ],
    specifications: [],
    featured: false,
    published: false,
    createdAt: ts,
    updatedAt: ts,
  },
];
