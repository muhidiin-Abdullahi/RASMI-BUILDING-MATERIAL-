# Rasmi Building Materials Co. — Website

The public website and CMS, built as a single Next.js app with MongoDB as its database. There is no separate backend server.

## Structure

| Path | Description |
|------|-------------|
| `web/src/app/(site)` | Public pages |
| `web/src/app/admin` | CMS pages |
| `web/src/app/api/v1` | API routes (Next.js Route Handlers) |
| `web/src/server` | Database models, business logic, and validation |
| `web/src/lib/content` | Editable website content: schema, CMS form, and defaults |
| `docs/` | CMS guide, API spec, database schema, image credits |

To edit the website, see [`docs/CMS_GUIDE.md`](docs/CMS_GUIDE.md).

## Prerequisites

- Node.js 20+
- npm
- MongoDB (local `mongodb://127.0.0.1:27017/rbm_dev` or MongoDB Atlas)

## Setup

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

In `.env.local`, set `MONGODB_URI` and long random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

Create the first CMS account, then sign in with **Login** in the website header:

```bash
npm run create-admin
```

Optionally add sample catalog data. This overwrites any product or category with the same slug as a sample record:

```bash
npm run seed
```

To browse the catalog without MongoDB, set `NEXT_PUBLIC_CATALOG_DATA_SOURCE=fixture`. The CMS needs MongoDB.

## Quality checks

```bash
cd web
npm run lint
npm test
npm run build
```

`npm test` runs the API tests against a temporary in-memory MongoDB.

## Deploying

- Run `npm run build` with `MONGODB_URI` set and the database reachable, so pages are built with your saved content.
- Serve the site over HTTPS. In production, sign-in cookies are `Secure` and browsers reject them on plain HTTP, except on localhost.
- Rate limits are held in server memory. On a single Node server they work as set. On serverless hosts each process counts separately, so add a shared store if you need a hard limit.

## Contact details

Phone, email, address, opening hours, WhatsApp, and social links are edited in the CMS under **Content > Contact details**. The `NEXT_PUBLIC_*` values in `.env.local` are only the starting values until that section is first saved.

## Images

Stock photography sources and licences are listed in [`docs/IMAGE_CREDITS.md`](docs/IMAGE_CREDITS.md). Project and product photos are illustrative, so replace them with real Rasmi photography when it is available.
