# DrHuang Clinic Reproduction Guide

This document describes the current production architecture for `dr-huang-clinic` inside `medical-clinic/chinese-medicine`, so another developer can reproduce the same site structure and behavior.

It covers:
- DB-first + file fallback content model
- page layout control via `*.layout.json`
- section variants via page JSON (`*.json`)
- theme-driven typography and colors
- admin editing flows and import/export behavior

---

## 1) System Architecture

DrHuang clinic is implemented as a multi-site, multi-locale Next.js app with:

- **App router + host-based site resolution**
  - Site is resolved by host, fallback to `dr-huang-clinic`
  - Locale routes are under `app/[locale]`
- **DB-first content loading**
  - Read from Supabase `content_entries` first
  - Fallback to JSON files under `content/` if DB entry not present
- **Admin CMS**
  - Admin writes directly to DB when `SUPABASE_SERVICE_ROLE_KEY` is configured
  - Local filesystem mode is fallback only
- **Layout composition**
  - Per-page section order/visibility is controlled by `pages/<page>.layout.json`
- **Variant-driven rendering**
  - Section visual style/layout is controlled by `variant` inside each page JSON section
- **Theme variables**
  - `theme.json` drives runtime CSS variables for typography sizes, font families, and colors

---

## 2) Required Project Paths

Core app and data paths:

- `app/[locale]/*/page.tsx` - public page renderers
- `app/[locale]/layout.tsx` - site shell + theme variable injection
- `components/sections/*` - reusable variant-capable sections
- `components/admin/ContentEditor.tsx` - Form + JSON editor (includes variant dropdowns)
- `lib/content.ts` - DB-first loader + file fallback
- `lib/contentDb.ts` - Supabase content adapters
- `lib/types.ts` - shared content and variant types
- `content/dr-huang-clinic/*` - site content source
- `supabase/admin-schema.sql` - admin/site/media/booking tables
- `supabase/rls.sql` - deny-public RLS policies

---

## 3) DrHuang Content Structure

Current site content root:

- `content/dr-huang-clinic/theme.json`
- `content/dr-huang-clinic/en/*`
- `content/dr-huang-clinic/zh/*`

Per-locale base files:

- `site.json`
- `navigation.json`
- `header.json`
- `footer.json`
- `seo.json`
- `pages/*.json`
- `pages/*.layout.json`
- `blog/*.json` (EN currently has blog post files)

Booking files (filesystem backup/source):

- `content/dr-huang-clinic/booking/services.json`
- `content/dr-huang-clinic/booking/settings.json`
- `content/dr-huang-clinic/booking/bookings/*.json`

---

## 4) Layout JSON Pattern (`page.layout`)

Each page layout file contains ordered section IDs:

```json
{
  "sections": [
    { "id": "hero" },
    { "id": "services" },
    { "id": "cta" }
  ]
}
```

Rules:
- If a section ID exists in layout and renderer supports it, it is shown.
- If omitted, the section is hidden.
- Order in `sections[]` controls render order.
- If no layout exists, renderer falls back to default order.

Files in DrHuang already include layout JSON for:
- `home`, `about`, `contact`, `services`, `conditions`, `pricing`, `gallery`, `blog`, `case-studies`, `new-patients` (EN + ZH)

---

## 5) Variant Control Pattern (`page.json`)

Section variants are controlled in page JSON, for example:

```json
{
  "hero": {
    "variant": "split-photo-right",
    "title": "...",
    "subtitle": "..."
  }
}
```

Current variant support is wired in page/section renderers for:

- `about.json`
  - `hero`, `profile`, `credentials`, `specializations`, `philosophy`, `journey`, `affiliations`, `continuingEducation`, `clinic`, `cta`
- `contact.json`
  - `hero`, `introduction`, `hours`, `form`, `map`, `faq`
- `pricing.json`
  - `hero`, `individualTreatments`, `packages`, `insurance`, `policies`, `faq`, optional `cta`
- Other pages (already wired)
  - `services`, `conditions`, `blog`, `gallery`, `case-studies`, `new-patients`

Important distinction:
- `*.layout.json` controls **order/visibility**
- section `variant` in `*.json` controls **visual layout style**

---

## 6) Theme System (Typography + Colors + Fonts)

Theme source:
- `content/<siteId>/theme.json`

Runtime injection:
- `app/[locale]/layout.tsx` injects `:root` CSS variables from theme
- `styles/globals.css` consumes variables in utilities/classes

Controlled values:
- Typography sizes: `display`, `heading`, `subheading`, `body`, `small`
- Font families: `typography.fonts.display|heading|subheading|body|small`
- Colors:
  - `colors.primary` (`DEFAULT`, `dark`, `light`, `50`, `100`)
  - `colors.secondary` (`DEFAULT`, `dark`, `light`, `50`)
  - `colors.backdrop` (`primary`, `secondary`)

---

## 7) DB + File Data Model

### DB-first behavior

When `SUPABASE_SERVICE_ROLE_KEY` exists:
- reads/writes use DB tables via `lib/contentDb.ts`
- filesystem is fallback source for missing DB content

When key is absent:
- filesystem mode is used

### Primary content tables expected

- `content_entries`
  - expected fields used by code: `id`, `site_id`, `locale`, `path`, `data`, `updated_at`, `updated_by`
  - unique key expected by upsert: `(site_id, locale, path)`
- `content_revisions`
  - stores prior versions when admin updates content entries

### Admin/ops tables (in `supabase/admin-schema.sql`)

- `sites`
- `admin_users`
- `media_assets`
- `booking_services`
- `booking_settings`
- `bookings`

### RLS posture

`supabase/rls.sql` enables RLS and creates deny-public policies on:
- `sites`, `admin_users`, `media_assets`
- `booking_services`, `booking_settings`, `bookings`
- `content_entries`, `content_revisions`

The app uses service-role server client for admin operations.

---

## 8) Required Environment Variables

At minimum for DB-first:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` (if used in local scripts/utilities)
- `JWT_SECRET` (admin auth/session signing)

Without `SUPABASE_SERVICE_ROLE_KEY`, content falls back to filesystem mode.

---

## 9) Admin APIs Used For Reproduction

Core content APIs:
- `GET /api/admin/content/files`
- `GET/PUT/POST/DELETE /api/admin/content/file`
- `POST /api/admin/content/import` (`mode: missing|overwrite`)
- `POST /api/admin/content/export`

Migration/ops APIs:
- `POST /api/admin/users/import`
- `POST /api/admin/sites/import`
- `POST /api/admin/booking/import`
- `POST /api/admin/media/import`

Auth + RBAC:
- `lib/admin/permissions.ts`
  - `requireSiteAccess`, `canWriteContent`, `canManageBookings`, `canManageMedia`

---

## 10) Admin Editor Features Needed

`components/admin/ContentEditor.tsx` should include:

- **Form mode + JSON mode**
- variant dropdowns in Form mode (`Section Variants` panel)
- theme form editing for typography/font/color
- import/export buttons with loading states
- safe import default (`missing`)
- overwrite import as explicit action

If reproducing from older branch, ensure this file contains variant dropdown logic and theme panel support.

---

## 11) Reproduce DrHuang on a Fresh Environment

### A. Code + files

1. Copy project codebase.
2. Ensure DrHuang files exist under:
   - `content/dr-huang-clinic/theme.json`
   - `content/dr-huang-clinic/en/*`
   - `content/dr-huang-clinic/zh/*`
   - including all `pages/*.layout.json`

### B. Database

1. Run `supabase/admin-schema.sql`.
2. Ensure `content_entries` + `content_revisions` exist with required columns.
3. Run `supabase/rls.sql`.

### C. Env setup

1. Set Supabase + JWT env vars.
2. Start app:
   - `npm install`
   - `npm run dev`

### D. Seed DB content

From admin UI:
1. Import users/sites (bootstrap)
2. Import content JSON (`missing` first)
3. If needed, run overwrite import intentionally
4. Verify pages load from DB and admin edits persist

---

## 12) Verification Checklist

Use this checklist before handing off:

- [ ] `/en` and `/zh` resolve correctly for DrHuang domain/host
- [ ] Theme changes in admin immediately affect typography/colors
- [ ] Page order changes via `*.layout.json` reflect on frontend
- [ ] Variant changes in page JSON reflect in frontend section layout
- [ ] Admin content save writes to DB (not only local files)
- [ ] Import/export works and `missing` mode does not overwrite
- [ ] RBAC restrictions are enforced per role + site
- [ ] `npm run build` succeeds

---

## 13) Notes for Multi-Site Reuse

To reproduce another clinic quickly:

1. Copy `dr-huang-clinic` content tree to new `content/<new-site-id>/`.
2. Update `site.json`, `navigation.json`, `theme.json`, SEO.
3. Keep page/section structure, layout files, and variant schema intact.
4. Create site in admin (or import site JSON), then import content.
5. Customize variants/layout in admin per site.

This preserves a shared platform while allowing each site to look different.

