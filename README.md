# PJ's Premium Transportation

Website and booking app for **PJ's Premium Transportation**, a woman-owned, reservation-only private ride service in Myra, Texas (airport runs to DFW and Love Field, medical appointments, WinStar, the DFW Metroplex).

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS. Deploys to Vercel. Works with zero configuration in demo mode, and with Supabase for persistent data.

## What the site does

| Area | Route | What it is |
| --- | --- | --- |
| Home | `/` | Hero, services, why riders choose PJ's, photo gallery, driver standard, reviews, FAQ |
| Services | `/services` | Every service with details and "Get a quote" links |
| Reserve a ride | `/book` | Ride request form → confirmation code → owner is notified |
| Reviews | `/reviews` | Public 1–5 star reviews with average and distribution, review form |
| Drive with PJ's | `/drive` | Lightweight driver application (name, phone, plate, vehicle) |
| Track a ride | `/track`, `/track/CODE` | Live map of the driver's position during an active trip (private link) |
| Driver console | `/driver` | Drivers sign in with name + PIN, consent, start/stop sharing location |
| Owner area | `/admin` | Bookings, review moderation, applicants, drivers, trips, availability |
| Contact, Privacy, Terms | `/contact`, `/privacy`, `/terms` | Contact options, plain-English privacy notice and terms |

Everything is responsive (phone, tablet, laptop, desktop) and accessible.

## Deploy on Vercel (about 5 minutes)

1. In Vercel, **Add New → Project → Import** this GitHub repository. Framework is detected automatically (Next.js). Deploy.
2. Open the project → **Settings → Environment Variables** and add, at minimum:
   - `ADMIN_PASSWORD` — a long private password (8+ characters). Required to open `/admin`.
   - `NEXT_PUBLIC_SITE_URL` — your site address, e.g. `https://pjspremiumtransportation.vercel.app` (or your custom domain).
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables take effect.

Without a database the site runs in **demo mode**: everything works, but bookings, reviews and drivers are stored in memory and reset when the site redeploys or goes idle. For real use, connect Supabase (next section).

## Connect Supabase (persistent data)

1. Create a free project at [supabase.com](https://supabase.com) (any region; `us-east-1` is close to Texas).
2. In the Supabase dashboard open **SQL Editor**, paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it. This creates the tables with row-level security locked down (only the server can read/write).
3. Open **Project Settings → API** and copy:
   - Project URL → Vercel env var `SUPABASE_URL`
   - `service_role` secret key → Vercel env var `SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix with `NEXT_PUBLIC_`)
4. Redeploy on Vercel. The Setup checklist on `/admin/settings` turns green.

## Email notifications (optional)

New ride requests, reviews and driver applications can be emailed to the owner via [Resend](https://resend.com):

- `RESEND_API_KEY` — from the Resend dashboard
- `NOTIFY_EMAIL` — where to send (defaults to pjspremiumtransportation@gmail.com)
- `NOTIFY_FROM` — sender, e.g. `PJ's Website <onboarding@resend.dev>` (use a verified domain for production)

Without these, notifications are written to the Vercel function logs and everything still shows up in `/admin`.

## Owner's guide

- **Sign in** at `/admin` with `ADMIN_PASSWORD`.
- **Availability** — Overview or Settings: Accepting reservations / By appointment / Fully booked, plus an optional note. Shown on the home, contact and reservation pages immediately.
- **Ride requests** — Bookings: confirm, complete or cancel. Each request has a code like `PJ-7K3M9` that the rider also sees.
- **Reviews** — published as they arrive (good or critical). Hide only spam or abuse. You can reply publicly. Turn on "hold new reviews for approval" in Settings if you prefer to read them first.
- **Applicants** — driver applications with status and private notes. Approve → add them on the Drivers page with a 4–6 digit PIN.
- **Drivers** — create drivers, deactivate, reset PINs. Drivers sign in at `/driver`.
- **Trips** — see active and recent location-sharing sessions; end one if a driver forgot to.

## Live tracking, kept legal

Tracking is driver-initiated and consent-based, which is what state tracking-device laws (including Texas Penal Code §16.06) and good practice require:

- A driver signs in with their own name and PIN and must tick a consent box for **each trip**.
- The driver's screen shows a persistent "Sharing your location" indicator and a Stop button.
- Only the driver's position is shared, only while the trip is active, only to people with the private link (`/track/CODE`).
- Riders are never tracked. Only the driver's latest position is stored (no route history), and it is deleted automatically 24 hours after a trip ends (`vercel.json` cron → `/api/cron/purge-locations`; set `CRON_SECRET` in Vercel to protect it).
- Trip links are sent with `Referrer-Policy: no-referrer` and `noindex`, so they do not leak to other sites or search engines.
- The privacy notice at `/privacy` describes all of this in plain English.

To try it in demo mode, set `DEMO_SEED=true` in Vercel: a demo driver "Patsy" with PIN `1234` is created when the driver sign-in page is opened. Remove it before real use.

## Photos and branding

- `public/brand/profile.jpg` — the Facebook profile picture (used as the logo everywhere).
- `public/brand/cover.jpg` — the Facebook cover artwork (hero background).
- `public/brand/og-image.png` — the image shown when the site is shared on Facebook, iMessage, etc.
- `public/gallery/` — **drop any photos here and they appear on the home page automatically**, sorted by file name. Name files like `07-something-descriptive.jpg`. Better captions can be added in `src/lib/gallery.ts`.
- `src/app/icon.png`, `src/app/apple-icon.png` — favicon / home-screen icon.

Higher-resolution originals of the Facebook photos will look noticeably better than the thumbnails Facebook allowed us to download; replace the files in `public/gallery/` with the originals when you have them.

## Changing contact details and copy

- Phone, email, Facebook link, taglines and service area: `src/lib/site.ts`.
- Services and FAQ text: `src/content/services.ts`, `src/content/faq.ts`.
- Home page sections: `src/components/home/`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional
npm run dev                  # http://localhost:3000
npm run lint
npm run build
```

## Project layout

```
src/app/            routes (App Router) — book, reviews, drive, track, driver, admin, api
src/components/     ui (design system), site (nav/footer), home, reviews, booking, tracking, admin
src/lib/            db (Supabase + memory adapters), validation (zod), auth, crypto, rate-limit, notify
src/content/        services and FAQ copy
supabase/migrations 0001_init.sql — the database schema
public/brand        logo, cover, share image
public/gallery      photos shown on the site
```
