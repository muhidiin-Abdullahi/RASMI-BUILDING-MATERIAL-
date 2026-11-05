# Rasmi Building Materials Co. — Implementation Plan

**Last updated:** 2026-10-17  
**Status:** Phase 5 admin authentication + CMS implemented

> **Update, 2026-11-04:** this plan is kept as a historical record. The Express API was moved into Next.js Route Handlers, so the site now runs as one Next.js app with MongoDB. See the root `README.md` for the current setup, and read references below to `api/`, Express, and separate ports in that light.

---

## 1. Project audit findings

### 1.1 Repository state (initial)

| Item | Finding |
|------|---------|
| Workspace | `Rasmi building` was **empty** at audit start — greenfield implementation |
| Git | Not initialized in workspace |
| Frontend | **None** — created `web/` (Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4) |
| Backend | **None** — `api/` Express + TypeScript scaffold (Phase 1 skeleton) |
| Database | **None** — MongoDB/Mongoose planned for Phase 6 |
| Environment | No `.env` files present |
| Admin | `/admin/*` CMS + JWT cookie auth (Phase 5) |

### 1.2 Design assets discovered

Stitch screen exports and photography were provided via Cursor workspace assets and copied into the repo:

| Asset | Location | Purpose |
|-------|----------|---------|
| RBM logo (official) | `web/public/images/logo.png` | Header, footer, favicon candidate |
| Showroom / materials | `web/public/images/showroom-materials.jpg` | About, gallery, homepage |
| Bathroom hero (stone wall) | `web/public/images/hero-bathroom-stone.jpg` | Homepage hero, projects |
| Bathroom hero (vanity) | `web/public/images/hero-bathroom-vanity.jpg` | Categories, featured products |
| Full Stitch PNG mocks | `docs/design-reference/*.png` | Layout fidelity reference |

**Missing from exports (placeholders used until supplied):**

- Individual product SKU photography (catalog uses design-derived names + shared lifestyle images)
- BIM/PDF/spec downloads (links disabled until files provided)
- Admin UI designs (not present in Stitch exports — will follow standard CRUD patterns aligned with brand)
- Favicon set, Open Graph default image (logo usable interim)
- Verified map embed coordinates (config-driven)

### 1.3 Contact & business information gaps

Designs contain **inconsistent** contact details (Dubai vs Jakarta references, multiple phone formats). Per project rules, **unverified data must not be presented as fact**.

| Field | Source in designs | Implementation |
|-------|-------------------|----------------|
| Company name | Consistent | `Rasmi Building Materials Co.` |
| Brand colors | Consistent | `#041A66`, `#F8542F`, `#F5F7FB`, `#172033`, `#667085` |
| Phone | `+971 4 225 5406` on homepage utility bar (superseded) | `+252611573839`, set by the owner on 2026-11-04 via `NEXT_PUBLIC_CONTACT_PHONE` |
| Email | `info@rasmi.com` on homepage bar | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Address | Deira Dubai (homepage footer area) vs Jakarta (contact mock) (superseded) | `Mogadishu, Somalia`, set by the owner on 2026-11-04 via `NEXT_PUBLIC_OFFICE_ADDRESS` |
| WhatsApp | Various placeholders | `NEXT_PUBLIC_WHATSAPP_NUMBER` — optional, hidden if unset |
| Trade hours | Stitch variants | Config only after confirmation |

All public contact UI reads from `web/src/lib/site-config.ts` and environment variables.

---

## 2. Design and page inventory

| # | Page | Stitch reference | Route (planned) | Phase |
|---|------|------------------|-----------------|-------|
| 1 | Homepage | `design-reference/screen8*.png` | `/` | **1 (active)** |
| 2 | Products catalog | `screen9*.png` | `/products` | **3 (done — fixture-backed)** |
| 3 | Product detail | `screen12*.png` | `/products/[slug]` | **3 (done — core layout)** |
| 4 | About Us | `screen6*.png` | `/about` | 3 |
| 5 | Projects & Gallery | `screen10*.png` | `/projects` | 4 |
| 6 | Contact / RFQ | `screen7*.png` | `/contact` | 4 |
| 7 | Admin dashboard | Not in Stitch exports | `/admin/*` | 5 |

Shared chrome: top utility bar, main header, footer — aligned across mocks (navy/orange, REQUEST A QUOTE CTA).

---

## 3. Proposed architecture

```
Rasmi building/
├── web/                 # Next.js public site + admin UI (later)
├── api/                 # Express REST API
├── docs/                # Plans, design references
└── README.md
```

### 3.1 Frontend (`web`)

- **Next.js App Router** — server components for static/marketing; client components for forms, filters, mobile nav
- **Tailwind CSS v4** — design tokens in `globals.css`
- **Lucide React** — icons
- **React Hook Form + Zod** — inquiry/RFQ forms (Contact phase)
- **API client** — `fetch` to `NEXT_PUBLIC_API_URL` (no direct MongoDB)

### 3.2 Backend (`api`)

- **Express + TypeScript** — modular routes/controllers/services
- **Mongoose** — Product, Category, Inquiry, AdminUser, Project (Phase 6)
- **Security** — bcrypt passwords, JWT or httpOnly session cookies, rate limits, CORS allowlist, Zod validation
- **Media** — Cloudinary upload for admin product images (Phase 5–6)

### 3.3 Deployment (recommended)

| Layer | Suggestion |
|-------|------------|
| Frontend | Vercel or similar |
| API | Railway, Render, or Fly.io |
| MongoDB | MongoDB Atlas |
| Images | Cloudinary |

---

## 4. Frontend implementation phases

| Phase | Scope | Deliverables |
|-------|--------|--------------|
| **1** | Foundation + homepage | Layout, tokens, logo, homepage sections, stub routes, build passing |
| **2** | Products catalog | Search, filters, grid, API integration, loading/empty/error |
| **3** | Product detail | Gallery, specs, related products, quote CTA |
| **4** | About, Projects, Contact | Page fidelity, RFQ form → API |
| **5** | Admin UI | Auth, CRUD products/categories, inquiries |
| **6** | Polish | SEO, sitemap, a11y audit, responsive QA vs Stitch |

---

## 5. Backend and database phases

| Phase | Scope |
|-------|--------|
| **6a** | MongoDB connection, env config, health route |
| **6b** | Models + seed script (optional, admin-created data preferred) |
| **6c** | Public GET products/categories/projects with pagination/filter |
| **6d** | POST inquiries with validation + rate limit |
| **6e** | Admin auth + protected CRUD |
| **6f** | Image upload pipeline (Cloudinary) |

---

## 6. Security requirements

- [ ] Password hashing (bcrypt) for admin accounts
- [ ] Server-side authorization on all mutating routes
- [ ] Input validation (Zod) on API and forms
- [ ] Rate limiting on `/auth/login` and `/inquiries`
- [ ] CORS restricted to frontend origin(s)
- [ ] Secure cookies if using sessions (`httpOnly`, `secure` in production, `sameSite`)
- [ ] No secrets in git; `.env.example` only documents keys
- [ ] Sanitized error responses (no stack traces to clients)
- [ ] File upload type/size limits
- [ ] Helmet + sensible HTTP headers

---

## 7. Testing strategy

| Layer | Approach |
|-------|----------|
| Web | `npm run lint`, `npm run build`, manual responsive checks (390 / 768 / 1440) |
| API | `npm run build`, integration tests for auth + CRUD (Phase 6+) |
| E2E | Critical flows: catalog → detail → inquiry, admin login → edit product (later) |

**Phase 1 checks:** lint + production build for `web/`.

---

## 8. Missing assets and business information (action items for client)

1. Confirm **official office address** and map location for Contact page
2. Confirm **phone, WhatsApp, and email** for all regions
3. Provide **product catalog** (names, SKUs, specs, images) or approve CMS-only entry via admin
4. Provide **PDF catalog**, BIM packs, spec sheets (or disable until ready)
5. Confirm **pricing policy** (trade-only quotes vs displayed prices)
6. Admin user provisioning (initial email/password or invite flow)
7. Social media URLs for footer
8. Arabic (AR) copy if bilingual site is required (EN/AR toggles appear in some mocks)

---

## 9. Development and deployment considerations

- Run frontend: `cd web && npm run dev` (default port 3000)
- Run API: `cd api && npm run dev` (default port 4000)
- Copy `web/.env.example` → `web/.env.local` and `api/.env.example` → `api/.env`
- Design QA: compare implemented pages side-by-side with `docs/design-reference/`
- Do not overwrite existing user `.env` files when updating templates

---

## 10. Phase 1 completion checklist

- [x] Monorepo folders `web/`, `api/`, `docs/`
- [x] Design assets copied; logo in `public/images`
- [x] Brand tokens and typography baseline
- [x] Shared header, footer, top bar
- [x] Homepage sections per Stitch homepage mock
- [x] API health endpoint wired (`GET /api/health`)
- [x] README + `.env.example` files
- [x] `web`: `npm run lint` + `npm run build` verified
- [x] `api`: `npm run build` verified

**Next phase:** Products catalog page + MongoDB product listing API.
