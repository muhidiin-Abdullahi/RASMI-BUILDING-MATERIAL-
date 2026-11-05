# Rasmi CMS Guide

This guide is for anyone editing the website.

## Signing in

1. Click **Login** in the website header, or open `/admin/login`.
2. Enter your email and password.

The first account is created once from the command line:

```bash
cd web
npm run create-admin
```

## Editing website content

Open **Content** in the CMS menu. Pick a section on the left, make your changes, and click **Save changes**. Saved changes appear on the website straight away, with no rebuild.

| Section | What it controls |
|---------|------------------|
| Project posts | Add, edit, reorder, hide, or delete project posts, plus the Projects page text |
| Homepage | All homepage text and photos |
| About page | Company story, who you work with, how you work |
| Products page | The header of the Products page |
| Contact page | Contact page text and photo |
| Call-to-action banner | The photo banner on the Home, About, and Projects pages |
| Contact details | Phone, email, address, opening hours, WhatsApp, and social links across the whole site |

Good to know:

- An orange dot beside a section means it has unsaved changes. Each section is saved separately.
- **Undo changes** returns to the last saved version.
- **Restore original** fills the form with the site's original content. Nothing changes on the website until you save.
- Opening hours and social links stay hidden on the website while they are empty. WhatsApp buttons appear once a number is set.
- The first four published project posts also appear on the homepage.

### Stock photos

The original project posts use stock photos that show the *types* of project Rasmi supplies. They are not Rasmi's own work, so do not describe them as completed Rasmi projects. A note under the gallery says this. Once every post uses your own photos, clear **Note under the gallery** in the Project posts section.

## Photos

Open **Media** to upload JPG, PNG, or WebP photos of up to 5 MB each. Any image field in the CMS also has a **Choose or upload image** button.

Deleting an uploaded photo removes it from any page or product using it.

## Other CMS pages

| Page | Description |
|------|-------------|
| Dashboard | Totals and recent activity |
| Products | Create, edit, publish, and delete products |
| Categories | Manage categories. A category with products cannot be deleted. |
| Inquiries | Customer inquiries. Statuses: `new`, `in_progress`, `responded`, `closed` |
| Settings | Change your password |
| Users | Super admins only: manage accounts |

## Sessions

You stay signed in for up to 7 days without being signed out during an edit. Click **Sign out** when using a shared computer.

## Audit log

Sign-ins and changes to content, media, products, categories, inquiry statuses, and accounts are recorded in the `AuditLog` database collection.

## For developers

- Fields, sections, and defaults live in `web/src/lib/content`: `schema.ts` (validation), `fields.ts` (the editor form), and `defaults.ts` (starting content).
- To add a field, add it to all three. A test fails if the schema and the editor form disagree.
- Public pages read content with `getSiteContent()`, which is cached. Saving in the CMS clears that cache.
- Uploaded images are stored in MongoDB, because files written to `public/` at runtime are not served by `next start`.
