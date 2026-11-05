export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Projects & Gallery", href: "/projects" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const footerCompanyLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerCategoryLinks = [
  { label: "Bathroom Mirrors", href: "/products?category=bathroom-mirrors" },
  { label: "Basin Mixer Taps", href: "/products?category=basin-mixer-taps" },
  { label: "Sanitary Ware", href: "/products?category=sanitary-ware" },
  {
    label: "Tiles & Finishing Materials",
    href: "/products?category=tiles-finishing-materials",
  },
] as const;
