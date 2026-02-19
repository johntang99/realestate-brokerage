# Printing System Implementation Plan

This document summarizes the recommended approach to build a high-standard printing-press platform by reusing the current multi-site Next.js + Admin CMS system.

It is designed for a large printing business (newspapers, magazines, books, commercial print), while keeping a scalable backend admin workflow for many client sites.

---

## 1) Strategic Direction

Use a hybrid model:

- Keep the current backend/admin architecture (sites, content, media, import/export, RBAC, domain routing).
- Build a new industry-specific frontend experience for printing inside the same Next.js framework.
- Treat medical as System A and printing as System C (separate product system/repo if needed).

Why:

- Faster go-to-market with less backend risk.
- High-quality frontend can be designed to industry standards.
- Admin operations remain familiar and scalable.

---

## 2) Target Architecture

### Frontend
- Next.js App Router + TypeScript + Tailwind (same framework as current system).
- Industry-specific page IA for printing.
- Reusable section/component library with explicit data contracts.

### Backend/Admin
- Existing Admin CMS structure retained.
- DB-first content model with file fallback remains.
- Multi-site host routing with `sites` + `site_domains`.
- Media, SEO, header/footer/site settings managed via existing editor.

### Domain model (local + production)
- Production aliases in `site_domains` with `environment = prod`.
- Local aliases in `site_domains` with `environment = dev`.
- Local DNS via `/etc/hosts` for `.local` domains.

---

## 3) Frontend Product Scope (Printing)

Recommended primary pages:

1. Home (value proposition, print categories, CTA)
2. Products (cards and category navigation)
3. Product detail templates:
   - Business cards
   - Flyers/Brochures
   - Magazines
   - Books
   - Newspaper print runs
4. Quote / RFQ flow
5. File upload guidelines (formats, bleed, DPI, color profile)
6. Turnaround and shipping
7. Portfolio / Case Studies
8. About / Facility / Equipment
9. Blog / Resources
10. Contact

Optional enterprise pages:

- Trade accounts / B2B programs
- Brand portal / reorder center
- Large-run consultation booking

---

## 4) Component System Design

Create a component set purpose-built for printing:

- Hero with primary CTA (Get Quote)
- Product category grid
- Product spec blocks (paper, size, finish, quantity)
- Price tier table / calculator block
- Upload requirements checklist
- Timeline/turnaround section
- Portfolio gallery with filters
- Industry trust strip (equipment, certifications, SLA)
- FAQ accordion
- CTA and contact forms

Each component must define:

- Required fields
- Optional fields
- Arrays/repeatable items
- Variant enum
- Default fallback data

---

## 5) Content Contract Model

Before admin integration, define a content contract per page:

- `pages/<slug>.json` for content
- `pages/<slug>.layout.json` for section order/visibility
- global files:
  - `site.json`
  - `header.json`
  - `footer.json`
  - `seo.json`
  - `theme.json`

Use a normalization layer:

- Old/legacy keys -> new frontend props
- Backward-compatible aliases
- Safe defaults for missing fields

This allows old sites to keep working while new printing frontend ships cleanly.

---

## 6) Admin Integration Approach

Keep current admin structure and extend forms:

1. Add printing-specific section form blocks in `ContentEditor`.
2. Keep JSON mode available for advanced edits.
3. Retain existing import/export patterns (`missing` default, overwrite intentional).
4. Reuse media manager for print assets and sample galleries.

Do not rebuild admin from scratch.

---

## 7) Phase-by-Phase Implementation Plan

## Phase 0 - Foundation (1 week)
- Duplicate baseline system for printing product line (System C repo/workspace).
- Apply latest DB schema and RLS.
- Confirm admin auth, site management, domain aliases, and health endpoint.

Deliverables:
- Running printing system shell
- Working admin and multi-site routing

## Phase 1 - Frontend Design + IA (1-2 weeks)
- Finalize information architecture and page map.
- Build high-fidelity frontend in Next.js with mock JSON data.
- Lock visual system (typography, spacing, interaction patterns).

Deliverables:
- Pixel-quality prototype pages
- Component inventory and prop contracts

## Phase 2 - Content Contracts + Data Mapping (1 week)
- Define JSON schema contracts per page/section.
- Add mappers from raw content to component props.
- Ensure locale support (`en`/`zh` if required).

Deliverables:
- Contract docs and typed interfaces
- Normalization utilities

## Phase 3 - Admin Form Extension (1-2 weeks)
- Extend admin form UI to manage printing sections.
- Keep existing Site Settings and shared globals intact.
- Validate import/export compatibility.

Deliverables:
- Editable printing content from admin
- Stable JSON mode fallback

## Phase 4 - Pilot Site Launch (1 week)
- Clone one pilot printing site.
- Configure `site_domains` aliases (prod + dev).
- Populate content, media, SEO, NAP.
- Run smoke tests for routing, admin save, forms.

Deliverables:
- One production-ready printing site

## Phase 5 - Scale to Dozens (ongoing)
- Standardize cloning checklist and launch SOP.
- Add monitoring and routine DB/index checks.
- Use audit logs and backup discipline for safe operations.

Deliverables:
- Repeatable launch process for many sites
- Stable operations dashboard/checklist

---

## 8) Environment and Operations

### Local
- Use `.local` aliases (do not hijack real domains).
- `/etc/hosts` entries map aliases to `127.0.0.1`.

### Production
- Use real domains in `site_domains` with `prod`.
- Manage aliases via Admin Site Settings -> Domain Aliases.

### Safety controls
- Backup/export before overwrite import.
- Site-scoped imports only (`siteId` required).
- Keep overwrite mode intentional, not default.

---

## 9) Performance and Economics Guidance

For SMB-focused sites:

- Shared multi-site platform is best cost/performance baseline.
- Expected practical capacity: dozens of sites with proper ops discipline.
- Isolated per-client system should be reserved for premium/custom/compliance needs.

Recommended operating model:

- System A: medical (shared)
- System B: restaurant (shared)
- System C: printing (shared)
- System D: home/office decor (shared)
- Isolate only exception clients.

---

## 10) Professional Quality Checklist (Frontend)

- Strong product-first homepage
- Fast quote journey
- Clear print specs and file requirements
- Trust assets (portfolio, testimonials, certifications)
- Conversion-optimized CTA placement
- Mobile-first responsiveness
- Performance budget (images, lazy loading, caching)
- SEO metadata and structured content per page

---

## 11) Professional Quality Checklist (Admin/Backend)

- Domain aliases configured correctly (prod/dev)
- No cross-site content edits
- Audit logs reviewed for sensitive actions
- Import/export rollback workflow tested
- Admin role/site access validated
- Health endpoint and smoke tests in release process

---

## 12) Recommended Next Action

Start with a printing pilot:

1. Build one complete printing frontend flow in Next.js (Home -> Product -> Quote -> Contact).
2. Define content contracts for those pages.
3. Integrate admin editing for those exact contracts.
4. Launch one pilot site, then templatize for scale.

