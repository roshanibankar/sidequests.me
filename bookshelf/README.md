# My Bookshelf

A horizontally-scrolling bookshelf of current reads and recommendations,
seeded from your Booklist spreadsheet. Browse by **Type** (top tabs), then
narrow by **Genre** (toggle chips that appear once a type is selected). Log
in as the admin to add books with a cover image, rating, and review.

Built with Next.js 14 (App Router) + TypeScript, Prisma, and Tailwind.

## What's included

- **Home shelf** — three horizontal rows (Currently Reading / Recommended /
  Finished), filterable by Type then Genre, each book rendered as a spine
  (with real cover art if you've uploaded one, otherwise a generated
  color-by-genre placeholder).
- **Book detail modal** — click any book to see author, rating, and review.
- **Single-admin login** — one password gates write access (no need for a
  full multi-user account system for a personal shelf).
- **Add / edit form** — title, author, type, genre, status, rating, cover
  upload, review.
- **Color-coded by type** — Fiction, Non Fiction, Biography, Autobiography,
  and Other each get their own color, applied to both the top tabs and
  every spine, so the shelf reads by type at a glance.
- **Empty by default** — the shelf ships with no books. Log in and use
  "+ Add a book" to build your shelf from scratch.

## Run it locally (zero cloud setup required)

```bash
npm install
cp .env.example .env      # then edit ADMIN_PASSWORD and SESSION_SECRET
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000. Log in at `/login` with the `ADMIN_PASSWORD`
you set, then use "+ Add a book" to build your shelf.

Already have books in your database from an earlier version and want a
clean slate? Run `npm run clear` — it wipes every book (schema stays
intact) so you can start adding your own.

Locally, cover uploads are stored as inline base64 images (no cloud
storage needed) — see "Cover storage" below for production.

## Deploying to Vercel

The local setup above uses SQLite, which **will not persist** on Vercel's
serverless filesystem. Before deploying, switch to a real Postgres
database — this takes two steps:

1. **Create a Postgres database.** In the Vercel dashboard, go to
   **Storage → Create Database → Postgres** (or use
   [Neon](https://neon.tech), which has a generous free tier). Either way
   you'll get a connection string.

2. **Point Prisma at it.** In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

Then:

```bash
git init && git add -A && git commit -m "My Bookshelf"
gh repo create my-bookshelf --source=. --push   # or push to GitHub manually
```

In the Vercel dashboard, **Import Project** from your GitHub repo, and set
these Environment Variables before the first deploy:

| Variable | Value |
|---|---|
| `DATABASE_URL` | your Postgres connection string |
| `ADMIN_PASSWORD` | a real password for logging in |
| `SESSION_SECRET` | a long random string (`openssl rand -base64 32`) |
| `BLOB_READ_WRITE_TOKEN` | see "Cover storage" below |

After the first deploy, run the migration against your production database
once (from your machine, with `DATABASE_URL` pointed at production):

```bash
npx prisma migrate deploy
```

### Naming it `mysidequests.vercel.app`

In the Vercel project's **Settings → Domains**, if `mysidequests.vercel.app`
is free, you can set the project name to `mysidequests` (Settings →
General → Project Name) and Vercel will serve it at that `.vercel.app`
subdomain automatically.

### Cover storage

Uploads use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) when
configured — add a Blob store from **Storage → Create → Blob** in your
Vercel project, which auto-populates `BLOB_READ_WRITE_TOKEN`. Without it,
the app falls back to storing covers as inline base64 data, which works
but bloats the database — fine for a prototype, worth switching on Blob
before you upload many covers.

## Project structure

```
prisma/schema.prisma      Book model
prisma/seed.ts             your Booklist data
src/app/page.tsx           the shelf (home page)
src/app/login/page.tsx     admin login
src/app/add/page.tsx       add/edit form (protected)
src/app/api/books/         CRUD API for books
src/app/api/upload/        cover image upload
src/app/api/auth/          login/logout/session-check
src/components/            BookSpine, Shelf, TypeTabs, GenreFilter, BookModal
src/middleware.ts          protects /add route
```

## Notes for next steps

- Genre and Type suggestions live in `src/app/add/page.tsx` and
  `src/lib/types.ts` — add your own to the lists as your shelf grows.
- The admin login is a single shared password by design (personal site,
  not a multi-user app). If you ever want real per-user accounts, swap
  `src/lib/auth.ts` for NextAuth.
