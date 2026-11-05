import type { ProjectPost, SiteContent } from "./schema";

const env = (value: string | undefined) => value?.trim() ?? "";

/**
 * The website's text and images until they are edited in the CMS at
 * /admin/content. Contact details can also be seeded from environment variables.
 *
 * The project posts below use licensed stock photographs (docs/IMAGE_CREDITS.md)
 * showing the KINDS of project Rasmi supplies. They are not Rasmi's own completed
 * work, so they must not name clients, locations, or results.
 */

const materials = {
  mirrors: { label: "Mirrors", href: "/products?category=bathroom-mirrors" },
  taps: { label: "Mixers & Taps", href: "/products?category=basin-mixer-taps" },
  sanitary: { label: "Sanitary Ware", href: "/products?category=sanitary-ware" },
  tiles: {
    label: "Tiles & Finishes",
    href: "/products?category=tiles-finishing-materials",
  },
};

const posts: ProjectPost[] = [
  {
    slug: "residential-towers",
    sector: "Residential",
    title: "Residential Towers",
    description:
      "Repeatable bathroom and finishing packages for multi-unit apartment buildings.",
    image: "/images/projects/residential-tower.jpg",
    alt: "Modern apartment tower with glass balconies against a soft evening sky",
    layout: "wide",
    published: true,
    materials: [materials.sanitary, materials.taps, materials.tiles],
  },
  {
    slug: "hotels-hospitality",
    sector: "Hospitality",
    title: "Hotels & Hospitality",
    description:
      "Surfaces, mirrors, and fittings for lobbies, guest rooms, and public washrooms.",
    image: "/images/projects/hospitality-lobby.jpg",
    alt: "Hotel lobby with a polished geometric marble floor and timber-clad elevators",
    layout: "tall",
    published: true,
    materials: [materials.tiles, materials.mirrors, materials.taps],
  },
  {
    slug: "private-villas",
    sector: "Residential",
    title: "Private Villas",
    description:
      "Coordinated finishes for individual homes, from bathrooms to feature surfaces.",
    image: "/images/projects/private-villa.jpg",
    alt: "Contemporary white villa with timber cladding among palm trees",
    layout: "standard",
    published: true,
    materials: [materials.tiles, materials.sanitary],
  },
  {
    slug: "commercial-buildings",
    sector: "Commercial",
    title: "Commercial Buildings",
    description:
      "Washroom fixtures and floor finishes for offices and high-traffic buildings.",
    image: "/images/projects/commercial-facade.jpg",
    alt: "Curved blue glass facade of a commercial office building",
    layout: "standard",
    published: true,
    materials: [materials.sanitary, materials.tiles],
  },
  {
    slug: "new-build-construction",
    sector: "Construction",
    title: "New-Build Construction",
    description:
      "Materials scheduled against the build programme, with phased site deliveries.",
    image: "/images/projects/structure-in-progress.jpg",
    alt: "Multi-storey concrete and steel building frame under construction",
    layout: "tall",
    published: true,
    materials: [materials.tiles, materials.sanitary],
  },
  {
    slug: "kitchen-fit-outs",
    sector: "Interiors",
    title: "Kitchen Fit-Outs",
    description:
      "Stone-look surfaces, large-format tiles, and mixers for working kitchens.",
    image: "/images/projects/kitchen-fitout.jpg",
    alt: "Modern kitchen with a marble-look waterfall island and pendant lights",
    layout: "wide",
    published: true,
    materials: [materials.tiles, materials.taps],
  },
  {
    slug: "bathroom-fit-outs",
    sector: "Interiors",
    title: "Bathroom Fit-Outs",
    description:
      "Complete bathroom selections, matched across fixtures, mirrors, and tiles.",
    image: "/images/projects/bathroom-fitout.jpg",
    alt: "Bright bathroom with a marble shower wall, round mirror, and brass mixer",
    layout: "standard",
    published: true,
    materials: [materials.sanitary, materials.mirrors, materials.taps],
  },
  {
    slug: "renovation-tiling",
    sector: "Renovation",
    title: "Renovation & Tiling",
    description:
      "Replacement floors, walls, and fixtures for upgrading existing spaces.",
    image: "/images/projects/tile-installation.jpg",
    alt: "Installer laying large-format floor tiles in an empty room",
    layout: "standard",
    published: true,
    materials: [materials.tiles],
  },
];

export const defaultContent: SiteContent = {
  general: {
    tagline:
      "Building materials, brassware, sanitary ware, mirrors, and tiles for homeowners, contractors, architects, and developers.",
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE) || "+252611573839",
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "info@rasmi.com",
    address: env(process.env.NEXT_PUBLIC_OFFICE_ADDRESS) || "Mogadishu, Somalia",
    hours: env(process.env.NEXT_PUBLIC_OFFICE_HOURS),
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    instagram: env(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    facebook: env(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    linkedin: env(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
  },
  home: {
    heroEyebrow: "Building Materials Supplier · Mogadishu, Somalia",
    heroTitleLine1: "Quality Materials.",
    heroTitleLine2: "Better Spaces.",
    heroDescription:
      "Discover quality building and bathroom materials for your home, renovation, or construction project.",
    heroImage: "/images/site/hero-cranes-dusk.jpg",
    heroImageAlt: "Tower cranes above buildings under construction at dusk",
    heroPrimaryLabel: "Explore Our Products",
    heroSecondaryLabel: "Request a Quote",
    valueProps: [
      {
        title: "Product Choice",
        description:
          "Brassware, sanitary ware, mirrors, and finishing materials under one roof.",
      },
      {
        title: "Global Selection",
        description:
          "Collections suited to residential upgrades and commercial fit-outs.",
      },
      {
        title: "Professional Advice",
        description:
          "Support with product selection, schedules, and project coordination.",
      },
    ],
    categoriesEyebrow: "What We Supply",
    categoriesTitle: "Explore Our Product Categories",
    featuredEyebrow: "From the Catalog",
    featuredTitle: "Featured Products",
    whyEyebrow: "Why Rasmi",
    whyTitle: "One supplier from first schedule to final finish",
    whyImage: "/images/site/site-crew-rebar.jpg",
    whyImageAlt:
      "Aerial view of a construction crew in orange vests working among steel reinforcement on site",
    whyItems: [
      {
        title: "Full Product Lineup",
        description:
          "Brassware, sanitary ware, mirrors, and finishing materials from a single supplier.",
      },
      {
        title: "Project Coordination",
        description:
          "Structured quotations and documentation support for active projects.",
      },
      {
        title: "Distribution Support",
        description:
          "Logistics coordination for phased deliveries and site requirements.",
      },
      {
        title: "Responsive Trade Desk",
        description:
          "Direct channels for inquiries, samples, and specification questions.",
      },
    ],
    projectsEyebrow: "Projects & Gallery",
    projectsTitle: "Materials for every type of project",
    projectsDescription:
      "From private villas to high-rise towers, see where our materials fit.",
    aboutEyebrow: "About Us",
    aboutTitle: "Building Better Spaces with Rasmi",
    aboutBody1:
      "Rasmi Building Materials Co. supports architects, contractors, and developers with specification-ready materials, technical coordination, and dependable project supply.",
    aboutBody2:
      "From brassware and sanitary ware to mirrors and architectural surfaces, our team helps translate design intent into deliverable material schedules.",
    aboutNote:
      "Showroom sampling and technical documentation available by appointment.",
    aboutImage: "/images/showroom-materials.jpg",
    aboutImageAlt:
      "Showroom display of marble slabs, terrazzo, stone, and timber samples",
    contactEyebrow: "Contact",
    contactTitle: "Get in Touch with Rasmi",
    contactDescription:
      "Share your product interest or project scope. Our team will follow up with specification guidance and next steps.",
    contactFormTitle: "Send an Inquiry",
  },
  products: {
    eyebrow: "Product Catalog",
    title: "Our Products",
    description:
      "Browse mirrors, mixers and taps, sanitary ware, tiles, and finishing materials. Pricing is available on request.",
    image: "/images/showroom-materials.jpg",
  },
  projects: {
    eyebrow: "Projects & Gallery",
    title: "Materials for every type of project",
    description:
      "From a single bathroom renovation to a high-rise development, see where our product range fits your project.",
    image: "/images/site/site-survey-crew.jpg",
    listEyebrow: "Project Types",
    listTitle: "Where our materials are used",
    listDescription:
      "Select a material under any project type to browse that part of our catalog.",
    note: "Photographs illustrate the types of project our materials are used in.",
    posts,
  },
  about: {
    eyebrow: "About Rasmi",
    title: "Dedicated to Architectural Integrity and Lasting Material Excellence",
    description: "",
    image: "/images/site/materials-racking.jpg",
    whoEyebrow: "Who We Are",
    whoTitle: "Your partner for building materials",
    whoBody1:
      "Rasmi Building Materials Co. supports architects, contractors, developers, and homeowners with specification-ready materials, technical coordination, and dependable project supply.",
    whoBody2:
      "From brassware and sanitary ware to mirrors and architectural surfaces, our team helps translate design intent into deliverable material schedules.",
    whoImage: "/images/showroom-materials.jpg",
    whoImageAlt:
      "Showroom display of marble slabs, terrazzo, stone, and timber samples",
    audiencesEyebrow: "Who We Work With",
    audiencesTitle: "Support for every role on a project",
    audiences: [
      {
        title: "Architects & Designers",
        description:
          "Specification support, material samples, and technical documentation.",
      },
      {
        title: "Contractors",
        description:
          "Structured quotations and deliveries coordinated with site requirements.",
      },
      {
        title: "Developers",
        description:
          "One point of contact for materials across residential and commercial schedules.",
      },
      {
        title: "Homeowners",
        description:
          "Practical guidance on choosing products for a renovation or new home.",
      },
    ],
    howEyebrow: "How We Work",
    howTitle: "From first inquiry to site delivery",
    howImage: "/images/site/drawings-plans.jpg",
    howImageAlt: "Architectural floor plans spread across a work surface",
    steps: [
      {
        title: "Share your requirements",
        description:
          "Send a material schedule, a BOQ, or simply tell us about your project.",
      },
      {
        title: "Review the options",
        description:
          "We advise on suitable products, with showroom sampling by appointment.",
      },
      {
        title: "Receive your quotation",
        description:
          "Get a structured quotation, with documentation for your project file.",
      },
      {
        title: "Coordinate delivery",
        description:
          "We plan logistics around your site, including phased deliveries.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Connect with Our Architectural & Sales Team",
    description:
      "Send your material schedule or BOQ, ask about a product, or request a quote.",
    image: "/images/site/drawings-plans.jpg",
    directEyebrow: "Direct Contact",
    directTitle: "Talk to our team",
    directDescription:
      "Call or email us directly, or use the form and we will follow up with next steps.",
    formTitle: "Request a Quote or Project Inquiry",
  },
  cta: {
    title: "Planning Your Next Project?",
    description:
      "Send us your material schedule or BOQ. Our team will respond with specification guidance and next steps.",
    image: "/images/site/cta-cranes-sunset.jpg",
    buttonLabel: "Request a Quote",
  },
};

/** Images shipped with the site, offered in the CMS image picker. */
export const bundledImages: string[] = [
  "/images/showroom-materials.jpg",
  "/images/hero-bathroom-stone.jpg",
  "/images/hero-bathroom-vanity.jpg",
  "/images/site/hero-cranes-dusk.jpg",
  "/images/site/cta-cranes-sunset.jpg",
  "/images/site/site-crew-rebar.jpg",
  "/images/site/materials-racking.jpg",
  "/images/site/drawings-plans.jpg",
  "/images/site/site-survey-crew.jpg",
  "/images/projects/residential-tower.jpg",
  "/images/projects/commercial-facade.jpg",
  "/images/projects/private-villa.jpg",
  "/images/projects/hospitality-lobby.jpg",
  "/images/projects/kitchen-fitout.jpg",
  "/images/projects/bathroom-fitout.jpg",
  "/images/projects/structure-in-progress.jpg",
  "/images/projects/tile-installation.jpg",
  "/images/categories/bathroom-mirrors.jpg",
  "/images/categories/basin-mixer-taps.jpg",
  "/images/categories/sanitary-ware.jpg",
  "/images/categories/tiles-finishing.jpg",
  "/images/products/mirror-round-led.jpg",
  "/images/products/shower-matt-black.jpg",
  "/images/products/bath-mixer-brass.jpg",
  "/images/products/wc-wall-hung.jpg",
  "/images/products/wc-close-coupled.jpg",
  "/images/products/tile-stone-look.jpg",
  "/images/products/tap-chrome.jpg",
];
