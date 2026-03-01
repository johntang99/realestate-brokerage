# REB Non-AI Implementation Status

This file tracks scoped completion for the non-AI phase plan.

## Phase A — Core Page / Trust Gap Closure

- **Done:** Home consultation CTA now supports in-line social proof quote.
  - Evidence: `app/[locale]/page.tsx`, `content/reb-template/en/pages/home.json`
- **Done:** Selling page now renders seller concerns and seller testimonials blocks.
  - Evidence: `app/[locale]/selling/page.tsx`, `content/reb-template/en/pages/selling.json`
- **Done:** Buying page now includes a dedicated showing-request conversion form.
  - Evidence: `app/[locale]/buying/page.tsx`, `content/reb-template/en/pages/buying.json`
- **Done:** Region copy alignment updates (Orange County, NY) across key conversion paths touched in this pass.
  - Evidence: `app/[locale]/page.tsx`, `app/[locale]/buying/page.tsx`, `app/[locale]/selling/page.tsx`, related page JSON files

## Phase B — Persistent CTA Stack

- **Done:** Added persistent call/text/schedule CTA stack for desktop and mobile.
  - Evidence: `components/layout/PersistentContactCtas.tsx`, `app/[locale]/layout.tsx`
- **Done:** Header contact actions now include call + text quick links when configured.
  - Evidence: `components/layout/Header.tsx`

## Phase C — Mobile UX Hardening

- **Done:** Added mobile-safe spacing for persistent CTA bar and tightened tap-target baseline.
  - Evidence: `app/[locale]/layout.tsx`, `styles/globals.css`
- **Done:** Reduced section spacing on mobile to improve conversion-page scannability.
  - Evidence: `styles/globals.css`

## Phase D — Admin Workflow Reliability

- **Done:** `Create` and `Duplicate` now file-sync in DB mode when write-through is enabled.
  - Evidence: `app/api/admin/content/file/route.ts`
- **Done:** Duplicate operation now prevents target slug collisions in DB mode.
  - Evidence: `app/api/admin/content/file/route.ts`

## Phase E — Legal / Compliance Finish

- **Done:** Footer now renders compliance fields from site info reliably (license and broker license fallbacks).
  - Evidence: `components/layout/Footer.tsx`
- **Done:** Fair housing and equal housing statements are rendered when provided.
  - Evidence: `components/layout/Footer.tsx`

## Validation and SOP Artifacts

- **Done:** Reusable admin SOP checklist for one-pass verification/fix flow.
  - Evidence: `docs/ADMIN_SOP_CHECKLIST.md`
