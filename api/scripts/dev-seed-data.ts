/**
 * Development-only seed candidates. Not confirmed inventory.
 */

export const seedCategories = [
  {
    name: "Bathroom Mirrors",
    slug: "bathroom-mirrors",
    description:
      "Backlit and architectural mirror systems for residential and commercial washrooms.",
    image: "/images/categories/bathroom-mirrors.jpg",
    published: true,
  },
  {
    name: "Basin Mixer Taps",
    slug: "basin-mixer-taps",
    description:
      "Single-lever and dual-control basin mixers in PVD brass, chrome, and matte finishes.",
    image: "/images/categories/basin-mixer-taps.jpg",
    published: true,
  },
  {
    name: "Sanitary Ware",
    slug: "sanitary-ware",
    description:
      "Wall-hung and floor-standing sanitary ceramics with clean, modern profiles.",
    image: "/images/categories/sanitary-ware.jpg",
    published: true,
  },
  {
    name: "Tiles & Finishing Materials",
    slug: "tiles-finishing-materials",
    description:
      "Large-format porcelain, stone-look tiles, and coordinated finishing materials.",
    image: "/images/categories/tiles-finishing.jpg",
    published: true,
  },
] as const;

export const seedProducts = [
  {
    name: "Halo Round LED Mirror",
    slug: "halo-round-led-mirror",
    categorySlug: "bathroom-mirrors",
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
    ],
    featured: true,
    published: true,
  },
  {
    name: "Brushed Gold Basin Mixer",
    slug: "brushed-gold-basin-mixer",
    categorySlug: "basin-mixer-taps",
    shortDescription: "Single-lever deck mixer with ceramic disc cartridge.",
    description:
      "Single-lever deck mixer with ceramic disc cartridge. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/categories/basin-mixer-taps.jpg",
        alt: "Brushed brass basin mixer on a marble vanity",
      },
    ],
    specifications: [{ label: "Mount Type", value: "Deck-mounted" }],
    featured: true,
    published: true,
  },
  {
    name: "Wall-Hung WC Suite",
    slug: "wall-hung-wc-suite",
    categorySlug: "sanitary-ware",
    shortDescription: "Minimal wall-hung toilet for compact layouts.",
    description:
      "Minimal wall-hung toilet for compact layouts. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/products/wc-wall-hung.jpg",
        alt: "White wall-hung ceramic sanitary ware with a chrome mixer",
      },
    ],
    specifications: [{ label: "Installation", value: "Wall-hung" }],
    featured: true,
    published: true,
  },
  {
    name: "Rectified Porcelain Slab",
    slug: "rectified-porcelain-slab",
    categorySlug: "tiles-finishing-materials",
    shortDescription: "Large-format surface for seamless elevations.",
    description:
      "Large-format surface for seamless elevations. Contact our team for available sizes, finishes, and technical documentation.",
    images: [
      {
        url: "/images/showroom-materials.jpg",
        alt: "Showroom display of large marble-look slabs and material samples",
      },
    ],
    specifications: [{ label: "Format", value: "Large-format slab" }],
    featured: true,
    published: true,
  },
  {
    name: "Draft Catalog Entry (Internal)",
    slug: "draft-catalog-entry-internal",
    categorySlug: "sanitary-ware",
    shortDescription: "Unpublished seed record.",
    description: "Must remain hidden from public catalog endpoints.",
    images: [
      { url: "/images/hero-bathroom-stone.jpg", alt: "Placeholder" },
    ],
    specifications: [],
    featured: false,
    published: false,
  },
] as const;
