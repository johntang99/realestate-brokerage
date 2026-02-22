# Julia Studio — Cursor Instructions: Phase 0, 1, 2

> **System:** BAAM System F — Interior Design
> **Reference files:** Always include these in every Cursor conversation:
> - `@JULIA_STUDIO_COMPLETE_PLAN.md` — Full strategy and page designs
> - `@JULIA_STUDIO_CONTENT_CONTRACTS.md` — JSON schemas, variants, form fields
> **Method:** Contract-First + Admin Done-Gate (Build → Wire → Verify)

---

## Phase 0 — Infrastructure + Content Contracts

### Prompt 0A: Project Setup

```
We're building Julia Studio, a premium bilingual interior design studio website.
Domain: studio-julia.com. Languages: English (default) + Chinese.

Starting from the medical BAAM codebase. Please:

1. STRIP industry-specific code:
   - Remove: medical conditions, clinic specializations, credentialing,
     TCM philosophy, patient journey, booking system, booking tables
   - Remove: all content in /content/ directories except structure
   - Remove: medical-specific section components

2. KEEP core infrastructure:
   - Admin CMS: ContentEditor, SiteSettings, Media, Variants, Users, Sites
   - Content loading: lib/content.ts, lib/contentDb.ts (DB-first, file fallback)
   - Media system: upload, list, delete, Unsplash/Pexels import, URL normalization
   - Theme system: theme.json → CSS variables
   - Domain routing middleware
   - Import/export system
   - Auth + RBAC
   - Bilingual infrastructure: locale routing, language switcher, [locale] URL pattern

3. Create new Supabase project "JuliaStudio":
   - Run schema SQL: admin + content tables (skip booking/appointment tables)
   - Create storage bucket: "media"
   - Set RLS policies

4. Configure site entry:
   - id: "julia-studio"
   - name: "Julia Studio"
   - domain: "studio-julia.com"
   - defaultLocale: "en"
   - supportedLocales: ["en", "zh"]

5. Set up environment variables for new Supabase project.

6. Local domain alias: studio-julia.local

Verify: App boots, admin login works, content loading system functional.
```

### Prompt 0B: Theme & Design System

```
Implement the Julia Studio visual design system.

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — theme.json section.

1. Create theme.json with these exact colors:
   - primary: #2C2C2C (warm charcoal)
   - secondary: #C4A265 (champagne gold)
   - accent: #8B9D83 (sage green)
   - backdropPrimary: #FAF8F5 (warm white)
   - backdropSecondary: #1A1A1A (deep charcoal)
   - Full color set per theme.json contract

2. Typography via next/font:
   - Headings: Playfair Display (serif) — weight 400, 500, 600, 700
   - Body/Nav: DM Sans (sans-serif) — weight 300, 400, 500, 700
   - Chinese: Noto Serif SC (serif) — weight 400, 500, 700
   - Apply font-family CSS variables based on current locale:
     when locale is 'zh', heading font = Noto Serif SC, body uses system Chinese fallback
     when locale is 'en', heading font = Playfair Display, body = DM Sans

3. Tailwind config:
   - Extend colors with all theme.json values
   - Set font families

4. Global CSS:
   - Inject CSS custom properties from theme.json
   - Base styles: smooth scroll, antialiased text, selection color (gold)
   - Subtle transitions on links/buttons (0.2s ease)

5. Seed global settings into Supabase:
   - site.json (per contract)
   - header.json (per contract)
   - footer.json (per contract)
   - seo.json (per contract)
   - theme.json (per contract)
   - navigation.json

Verify:
- App renders with warm white background, charcoal text
- Playfair Display renders for headings (English)
- Noto Serif SC renders for headings (Chinese)
- Gold accent visible on buttons/links
- Admin Content Editor shows all global settings files
```

### Prompt 0C: Content Contracts — All Page JSONs

```
Create all page content JSON files and layout files per
@JULIA_STUDIO_CONTENT_CONTRACTS.md.

Create these files with realistic placeholder content:

Pages:
- pages/home.json + pages/home.layout.json
- pages/portfolio.json + pages/portfolio.layout.json
- pages/services.json + pages/services.layout.json
- pages/shop.json + pages/shop.layout.json
- pages/about.json + pages/about.layout.json
- pages/journal.json + pages/journal.layout.json
- pages/contact.json + pages/contact.layout.json
- pages/collections.json + pages/collections.layout.json
- pages/press.json + pages/press.layout.json
- pages/faq.json + pages/faq.layout.json
- pages/testimonials.json + pages/testimonials.layout.json

Collections (seed 3-5 entries each):
- portfolio/the-greenwich-estate.json (residential, transitional)
- portfolio/hudson-yards-office.json (commercial, modern)
- portfolio/soho-gallery-exhibition.json (exhibition, contemporary)
- portfolio/brooklyn-brownstone.json (residential, classic)
- portfolio/midtown-penthouse.json (residential, minimalist)

- shop-products/marin-console-table.json (furniture, living)
- shop-products/aria-pendant-light.json (lighting, dining)
- shop-products/woven-throw-blanket.json (textiles, bedroom)
- shop-products/ceramic-vase-set.json (accessories, living)
- shop-products/abstract-wall-art.json (art, living)

- journal/5-rules-mixing-patterns.json (article, design-tips)
- journal/greenwich-estate-tour.json (article, project-stories)
- journal/behind-the-scenes-fabric-selection.json (video, behind-the-scenes)

- collections/modern-minimalist.json
- collections/east-west-fusion.json
- collections/warm-transitional.json

- testimonials.json (seed 8 testimonials across categories)

ALL content must include both English and Chinese fields.
Use realistic, high-quality placeholder text — NOT lorem ipsum.

Seed ALL files into Supabase content_entries.
Register ALL variant definitions in admin Variants panel.

Verify:
- Admin Content Editor shows all page files
- Each file has Form mode with correct fields
- JSON tab shows full contract shape
- Variant dropdowns populated
- Chinese fields visible in both Form and JSON mode
```

### Prompt 0D: Media Seeding from Unsplash

```
Seed placeholder images from Unsplash into Supabase Media storage.

Use the admin Media panel's Unsplash import feature to search and import:

Hero images (5-8 images):
- Search: "luxury interior design living room"
- Search: "modern bedroom design"
- Search: "elegant kitchen interior"
- Search: "designer office space"
- Search: "art gallery interior"

Portfolio project images (25-30 images):
- Search: "luxury home interior" (6-8 for residential)
- Search: "modern office interior design" (4-5 for commercial)
- Search: "exhibition design gallery" (3-4 for exhibition)
- Search: "penthouse living room design" (3-4)
- Search: "brownstone interior design" (3-4)

Product images (20-25 images):
- Search: "designer console table"
- Search: "pendant light modern"
- Search: "luxury throw blanket"
- Search: "ceramic vase modern"
- Search: "abstract wall art"
- Search: "designer chair"
- Search: "modern side table"

Team/About (5-8 images):
- Search: "interior designer portrait professional"
- Search: "design studio workspace"

Journal (6-10 images):
- Search: "interior design details"
- Search: "fabric textile design"
- Search: "designer workspace mood board"

After importing, update content JSON files with correct media URLs
from Supabase storage.

Verify: All images load in frontend and admin Media panel.
```

### Phase 0 Done-Gate Checklist

```
Before proceeding to Phase 1, verify ALL:

- [ ] App boots without errors
- [ ] Admin login works
- [ ] Theme renders: warm white bg, Playfair Display headings, gold accents
- [ ] Chinese fonts render: Noto Serif SC for headings
- [ ] Language switcher toggles EN/ZH
- [ ] ALL 11 page JSON files seeded in Supabase
- [ ] ALL 11 layout JSON files seeded
- [ ] 5 portfolio projects seeded
- [ ] 5 shop products seeded
- [ ] 3 journal posts seeded
- [ ] 3 collections seeded
- [ ] 8 testimonials seeded
- [ ] ALL global settings seeded (site, header, footer, seo, theme, nav)
- [ ] Admin Content Editor shows all files with form panels
- [ ] Variant dropdowns populated for hero, portfolioGrid, etc.
- [ ] Media images imported from Unsplash
- [ ] Git committed and tagged: v0.0-foundation
```

---

## Phase 1 — Core Pages: Build / Wire / Verify

**Method:** Each page follows Build → Wire → Verify. A page is NOT done until admin roundtrip passes.

### Prompt 1: Home Page

```
Build the Julia Studio Home page at / (English) and /zh/ (Chinese).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Home section.
Reference @JULIA_STUDIO_COMPLETE_PLAN.md — Home Page design.

This page loads from: pages/home.json (via loadPageContent, DB-first)
Layout from: pages/home.layout.json

DESIGN PRINCIPLES (critical for interior design):
- Image-first: photos dominate, text is supplementary
- Generous whitespace — the site should breathe
- Minimal UI chrome — thin borders, subtle shadows, no heavy elements
- Slow, elegant transitions — subtle fade-in on scroll, image crossfade
- Serif headlines (Playfair Display) for editorial luxury feel
- ALL colors via theme CSS variables — NO hardcoded hex

SECTIONS (build in layout order):

1. HERO (variant: slideshow)
   - Full-viewport image slideshow (3-5 slides from content)
   - Slow crossfade transition (5-6 second interval, 1.5s fade)
   - Minimal overlay: studio logo/name + tagline
   - Subtle scroll-down indicator (animated arrow/chevron)
   - Text should be minimal — let images speak
   - On mobile: maintain full-viewport height, reduce text size

2. INTRODUCTION (variant: text-image)
   - Text on left (60%), image on right (40%)
   - Headline in Playfair Display, body in DM Sans
   - CTA link to About page
   - On mobile: stack (image on top, text below)

3. PORTFOLIO PREVIEW (variant: grid-featured)
   - Load 6 projects by slug from content
   - First project card: 2x size (featured)
   - Remaining 5: standard size
   - Each card: cover image, project name, category tag
   - Hover: subtle scale(1.02) + overlay with "View Project →"
   - "View All Projects →" link at bottom
   - On mobile: 1 column, all same size

4. SERVICES OVERVIEW (variant: three-cards)
   - 3 cards: Design, Construction, Furniture
   - Each: icon (lucide-react), title, description, "Learn More →"
   - Cards on warm white background with subtle border
   - On mobile: stack vertically

5. FEATURED COLLECTION (variant: hero-card)
   - Large background image from the collection
   - Collection name + description overlay
   - "Explore Collection →" link
   - Full-width, dark overlay for text readability

6. SHOP PREVIEW (variant: product-row)
   - Horizontal row of 6 product cards
   - Each: product image, name, price
   - Horizontal scroll on mobile
   - "Shop All →" link

7. JOURNAL PREVIEW (variant: three-cards)
   - Load 3 most recent journal posts
   - Each: thumbnail, category tag, title, date
   - Video posts show play icon overlay on thumbnail
   - "Read More →" link

8. ABOUT TEASER (variant: portrait-text)
   - Julia's portrait on left (40%), text on right (60%)
   - Brief stat: "25 years. 1,000+ projects. One vision: timeless design."
   - "Our Story →" link
   - On mobile: portrait above, text below

9. CONSULTATION CTA (variant: full-width-elegant)
   - Full-width background image with dark overlay
   - Centered: headline + subline + gold "Book Consultation" button
   - Button style: gold background (#C4A265), dark text, subtle hover glow

BILINGUAL:
- All text fields have En/Cn variants in JSON
- Render based on current locale
- Locale comes from URL path (/zh/ prefix for Chinese)

AFTER BUILDING — Admin Done-Gate:
- [ ] Edit hero tagline in admin Form mode → save → frontend shows change
- [ ] Edit introduction body in admin → save → text updates
- [ ] Switch hero variant to "single-image" → save → layout changes
- [ ] Reorder sections in home.layout.json → save → page reorders
- [ ] Edit Chinese fields → switch to /zh/ → Chinese text renders
- [ ] All images load from Supabase media
```

### Prompt 2: Header + Footer

```
Build the shared Header and Footer components for Julia Studio.

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — header.json, footer.json.

HEADER:
- Minimal, luxury aesthetic. Thin, refined.
- Logo: "Julia Studio" in Playfair Display, left-aligned
- Navigation: center or right — Portfolio, Services, Shop, Journal, About, Contact
- Language switcher: "EN | 中文" toggle, right side
- CTA button: "Book Consultation" (gold background, right side)
- Transparent on pages with hero images (text white on dark overlay)
- Solid warm-white background on scroll (transition: add bg when scrolled > 50px)
- Mobile: hamburger menu → full-screen overlay with centered nav links
  Navigation overlay: dark background (#1A1A1A), gold links, elegant transitions

FOOTER:
- Dark section (backdropSecondary: #1A1A1A) with light text
- Layout: 3-4 columns
  Col 1: Logo + tagline + social icons (Instagram, Pinterest)
  Col 2: "Explore" links (Portfolio, Services, Shop, Journal)
  Col 3: "Studio" links (About, Press, FAQ, Contact)
  Col 4: Newsletter signup (email input + "Subscribe" button)
- WeChat QR code display (small, in social section)
- Bottom bar: copyright + Privacy Policy + Terms of Service
- Bilingual: all labels from footer.json with En/Cn fields

BOTH load from global settings (header.json, footer.json via DB-first).

Admin Done-Gate:
- [ ] Edit nav item label in admin → save → header updates
- [ ] Edit CTA button label → save → button text changes
- [ ] Toggle showLanguageSwitcher → save → switcher hides/shows
- [ ] Edit footer tagline → save → footer updates
- [ ] Edit newsletter headline → save → footer newsletter updates
```

### Prompt 3: Portfolio Hub

```
Build the Portfolio hub page at /portfolio (and /zh/portfolio).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Portfolio Hub + Portfolio Project.
Reference @JULIA_STUDIO_COMPLETE_PLAN.md — Portfolio page design.

This page loads from: pages/portfolio.json
Layout from: pages/portfolio.layout.json
Projects from: portfolio/*.json collection entries

THIS IS THE MOST IMPORTANT PAGE ON THE SITE.
It must feel like a curated art gallery, not a grid of cards.

SECTIONS:

1. HERO (variant: minimal-text)
   - Clean headline "Our Work" + subline
   - Optional background image (subtle, low opacity)
   - Generous top/bottom padding

2. FILTER BAR
   - Category filters from portfolio.json filters.categories
   - Style filters from portfolio.json filters.styles
   - Pill-style filter buttons, gold active state
   - "All" selected by default
   - Smooth filter transitions (fade/reflow, not jarring jump)
   - Bilingual: filter labels have labelCn

3. PROJECT GRID (variant: masonry)
   - Load all portfolio/*.json entries
   - Masonry layout with 3 columns desktop, 2 tablet, 1 mobile
   - Each card:
     - Cover image (coverImage field)
     - Project name (bottom overlay on hover, or always visible)
     - Category tag (small pill)
     - Subtle hover: scale(1.02), slight shadow lift
     - Click → navigate to /portfolio/[slug]
   - Generous gap between cards (24-32px)
   - Load more: "Load More Projects" button after first 12
   - Aspect ratios: mix of 4:3 and 3:2 for visual variety in masonry

4. CTA (variant: centered)
   - "Inspired? Let's create something extraordinary."
   - "Book Consultation →" button

CRITICAL DESIGN DETAILS:
- The grid whitespace IS the design. Don't pack cards tightly.
- Cards should have NO border, NO shadow at rest — just the image.
- Only on hover: subtle elevation effect.
- Typography: project names in Playfair Display (serif).

Admin Done-Gate:
- [ ] Edit hero headline in admin → save → page updates
- [ ] Edit filter categories (add/remove) → save → filters update
- [ ] Switch grid variant to "uniform" → save → layout changes
- [ ] Portfolio entries visible in Portfolio collection editor
- [ ] Create new portfolio entry → appears in grid
```

### Prompt 4: Portfolio Detail

```
Build the Portfolio Detail page at /portfolio/[slug] (and /zh/portfolio/[slug]).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Portfolio Project collection.
This is a DYNAMIC route. Each portfolio/*.json entry becomes a page.

THIS IS THE PAGE THAT CONVERTS VISITORS INTO CLIENTS.
Study Studio McGee's project tours: storytelling, not just photos.

SECTIONS:

1. HERO
   - Full-width cover image (coverImage from project JSON)
   - Overlay at bottom: project title, location, category, year
   - On mobile: image full-width, title below

2. PROJECT OVERVIEW
   - 2-3 paragraphs: overview.body / overview.bodyCn
   - Clean typography, generous line-height (1.8)
   - Max-width 720px for comfortable reading

3. DESIGN DETAILS (sidebar or inline cards)
   - Scope, Duration, Rooms, Key Materials
   - Styled as a subtle info card (warm white bg, thin border)
   - Bilingual labels

4. PHOTO GALLERY
   - Gallery images from gallery[] array
   - Each image has a layout: "full" (full-width) or "half" (2-column)
   - Alternate between full-width and 2-up layouts
   - Click image → lightbox (full-screen view with navigation)
   - Lazy load images below the fold
   - On mobile: all images stack full-width

5. SHOP THIS LOOK
   - If shopThisLook[] has product slugs, show section
   - Header: "Shop This Look" / "选购同款"
   - Product cards: image, name, price, "View Product →"
   - Horizontal scroll on mobile
   - Cross-links to /shop/[product-slug]

6. CLIENT TESTIMONIAL
   - If testimonial exists on project, show quote block
   - Large serif quote text, author name below
   - Subtle gold left border or large quote marks

7. RELATED PROJECTS
   - 3 project cards from relatedProjects[] slugs
   - Same card style as portfolio grid

8. CTA
   - "Ready to transform your space?"
   - "Book Consultation →"

generateStaticParams(): Load all portfolio/*.json slugs.
ISR: revalidate 3600 (1 hour).

Admin Done-Gate:
- [ ] Edit project title in Portfolio Editor → save → page title updates
- [ ] Add image to gallery → save → image appears
- [ ] Edit Chinese overview text → save → /zh/ page shows Chinese
- [ ] Change shopThisLook slugs → save → products update
- [ ] Edit testimonial quote → save → quote updates
```

### Prompt 5: Services Page

```
Build the Services page at /services (and /zh/services).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Services section.

SECTIONS:

1. HERO (variant: single-image)
   - Background image + headline "Our Services" + subline

2. DESIGN SERVICES (variant: detailed-list)
   - 3 items: Full-Service, Virtual Design, Room Refresh
   - Each: title, description, image
   - Layout: alternating text-image (first: text left/image right, second: opposite)
   - Images generous size (50% width on desktop)

3. CONSTRUCTION & INSTALLATION (variant: text-image)
   - Image on one side, text + capabilities list on other
   - Capabilities: styled as subtle list with checkmarks or small icons

4. FURNITURE & DÉCOR (variant: text-image)
   - Opposite layout from construction section
   - CTA: "Shop Our Collection →"

5. PROCESS (variant: horizontal)
   - 6-step process timeline
   - Desktop: horizontal bar with numbered circles and lines between
   - Each step: number, title, description below
   - Mobile: vertical timeline
   - Subtle gold accent on active/hover step

6. SPECIALTIES (variant: icon-grid)
   - 6 icons in 2×3 grid: Residential, Commercial, Exhibition, Art, Retail, Custom Furniture
   - Icons from lucide-react
   - Bilingual labels

7. CTA (variant: full-width-elegant)
   - Background image + "Every great space starts with a conversation."
   - Gold "Book Your Free Consultation" button

Admin Done-Gate:
- [ ] Edit service items → save → frontend updates
- [ ] Edit process steps → save → timeline updates
- [ ] Switch process variant to "vertical" → save → layout changes
- [ ] Edit Chinese content → /zh/ shows Chinese
```

### Prompt 6: About Page

```
Build the About page at /about (and /zh/about).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — About section.

SECTIONS:

1. HERO (variant: single-image)
   - Julia Studio atmosphere image + "About Julia Studio"

2. STORY (variant: text-image-alternating)
   - 2 blocks, each with text + image
   - Alternating layout (text left/image right, then reversed)
   - Warm, personal writing tone
   - Generous line-height, comfortable max-width

3. PHILOSOPHY (variant: centered-text)
   - Centered text block on warm white background
   - Large Playfair Display headline
   - Max-width 720px body text
   - Subtle decorative element (thin gold line above and below)

4. STATS (variant: quiet-numbers)
   - 4 numbers in a row: 25 Years, 1,000+ Projects, 500+ Clients, 15+ Awards
   - NO animated counters — this is interior design, not freight
   - Elegant serif numbers (Playfair Display, large size)
   - Quiet, understated — the numbers speak for themselves
   - On mobile: 2×2 grid

5. TEAM (variant: editorial)
   - Julia's card: large image (40%), name, title, full bio
   - Other team members: smaller cards, image + name + title + brief bio
   - Images: natural, professional, approachable
   - Bilingual: titleCn, bioCn

6. TIMELINE (variant: horizontal)
   - Visual milestone timeline: 2001-2026
   - Desktop: horizontal scroll or horizontal bar with dots
   - Each milestone: year, event description
   - Gold dot for each milestone, subtle connecting line
   - Mobile: vertical timeline

7. AWARDS (variant: logo-grid)
   - Grid of award/press logos
   - Grayscale by default, color on hover (subtle sophistication)

8. CTA (variant: centered)
   - "Let's create something beautiful together."
   - Gold "Book Consultation" button

Admin Done-Gate:
- [ ] Edit Julia's bio in admin → save → About page updates
- [ ] Add team member → save → new member appears
- [ ] Add timeline milestone → save → timeline extends
- [ ] Edit Chinese fields → /zh/ renders Chinese
```

### Phase 1 Done-Gate Checklist

```
Before proceeding to Phase 2, verify ALL:

- [ ] Home page renders all 9 sections from DB content
- [ ] Header: transparent on hero, solid on scroll, mobile hamburger works
- [ ] Footer: 4 columns, newsletter signup, WeChat QR, bilingual
- [ ] Portfolio hub: masonry grid, category filters, load more works
- [ ] Portfolio detail: project tour with gallery, shop-this-look, testimonial
- [ ] Services: 3 service types, process timeline, specialties grid
- [ ] About: story, philosophy, stats, team, timeline, awards
- [ ] ALL pages admin-editable (Form + JSON mode roundtrip)
- [ ] Variant switching works on: hero, portfolioGrid, process, team, stats
- [ ] Layout reordering works on all pages
- [ ] Language switcher: EN → ZH → EN works on all pages
- [ ] Chinese content renders with Noto Serif SC
- [ ] ALL colors from theme tokens — NO hardcoded hex
- [ ] SEO baseline: unique title, description, canonical, OG on all pages
- [ ] Git tagged: v0.1-core-pages
```

---

## Phase 2 — Conversion + Content + Shop + Polish

### Prompt 7: Shop Hub + Product Detail

```
Build the Shop section:
- Shop hub at /shop (and /zh/shop)
- Product detail at /shop/[slug] (and /zh/shop/[slug])

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Shop Hub + Shop Product.

SHOP HUB:

1. HERO (variant: minimal-text)
   - "Shop Julia Studio" + subline about competitive pricing

2. FILTER BAR
   - Category filters: All, Furniture, Lighting, Textiles, Art & Décor, Accessories
   - Room filters: All Rooms, Living, Bedroom, Dining, Office, Outdoor
   - Pill buttons, gold active state

3. PRODUCT GRID (variant: grid-4)
   - 4 columns desktop, 3 tablet, 2 mobile
   - Each card: product image, name, price ("$1,200"), category tag
   - Hover: subtle scale + "View Details" overlay
   - Load more after 16 items

4. TRADE PROGRAM section
   - If enabled: show trade program CTA at bottom
   - "Interior designers: access exclusive pricing."
   - "Apply for Trade Pricing →" link to contact page

PRODUCT DETAIL (/shop/[slug]):

1. IMAGE GALLERY
   - Left side (60%): main image with thumbnail strip below (3-5 images)
   - Click thumbnail to change main image
   - Click main image → lightbox

2. PRODUCT INFO (right side, 40%)
   - Name (Playfair Display), price, brief description
   - Specifications: dimensions, material, finish, lead time
   - "Inquire About This Piece" button (gold)
   OR "Add to Cart" → simple cart system
   - Bilingual: descriptionCn, specs labels in Chinese

3. SEEN IN PROJECTS
   - If seenInProjects[] has slugs, show project cards
   - "Seen in These Projects" / "相关项目"
   - Links to portfolio detail pages

4. RELATED PRODUCTS
   - 4 related product cards from relatedProducts[]

For Phase 1 launch: use "Inquire" (sends to contact form with product pre-filled).
Full cart/checkout can be Phase 5 or Shopify integration.

Managed by: Shop Products Editor (dedicated collection editor in admin sidebar).

Admin Done-Gate:
- [ ] Create new product in Shop Products Editor → appears in grid
- [ ] Edit product price → save → price updates on frontend
- [ ] Filter by category → correct products shown
- [ ] Edit Chinese product description → /zh/ page updates
```

### Prompt 8: Journal Hub + Post

```
Build the Journal section:
- Hub at /journal (and /zh/journal)
- Post at /journal/[slug] (and /zh/journal/[slug])

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Journal Hub + Journal Post.

This combines blog articles AND video content in one hub.

JOURNAL HUB:

1. HERO (variant: minimal-text)

2. FEATURED POST
   - If featured.postSlug is set, show large featured card at top
   - Full-width image, title, excerpt, category, date
   - Video posts: show play icon overlay

3. FILTER BAR
   - All, Design Tips, Project Stories, Behind the Scenes, Video, Trends
   - Pill buttons, gold active state

4. CONTENT GRID (variant: featured-hero)
   - Mix of article and video cards
   - Article cards: thumbnail, title, category tag, date, excerpt (2 lines)
   - Video cards: thumbnail with PLAY ICON OVERLAY + duration badge, title
   - 3 columns desktop, 2 tablet, 1 mobile
   - Load more after 9

5. NEWSLETTER CTA (variant: inline)
   - "Design inspiration, delivered weekly."
   - Email input + Subscribe button
   - Positioned between grid rows or at bottom

JOURNAL POST (/journal/[slug]):

1. POST HEADER
   - Cover image (full-width)
   - Below: title (Playfair Display, large), category, date, author
   - Bilingual title/date

2. POST BODY
   - For articles: render body markdown as HTML
   - For videos: embed video player (YouTube/Vimeo) + body text below
   - Max-width 720px, generous line-height
   - Support images within body (markdown img tags)

3. RELATED PRODUCTS
   - If relatedProducts[] has slugs, show "Shop This Story" section
   - Product cards linking to shop

4. RELATED POSTS
   - 3 cards from relatedPosts[]

5. CTA
   - "Book Consultation" or "Subscribe to Journal"

Managed by: Journal Editor (dedicated collection editor in admin sidebar).
CRITICAL: Journal posts managed in Journal Editor, NOT Content Editor.
Journal hub page settings (hero, filters, featured) managed in Content Editor.

Admin Done-Gate:
- [ ] Create new article in Journal Editor → appears in hub grid
- [ ] Create new video post → appears with play icon overlay
- [ ] Edit post body → save → content updates
- [ ] Filter by "Video" → only video posts shown
- [ ] Edit Chinese content → /zh/ pages render Chinese
```

### Prompt 9: Contact / Book Consultation

```
Build the Contact page at /contact (and /zh/contact).

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Contact section.

THIS IS THE PRIMARY CONVERSION PAGE. Design it to feel welcoming, not corporate.

SECTIONS:

1. HERO (variant: minimal-text)
   - "Begin Your Design Journey" + warm subline

2. CONSULTATION FORM
   - Left side (60%): the form
   - Right side (40%): direct contact info + social links

   Form fields from contact.json:
   - Full Name (text, required)
   - Email (email, required)
   - Phone (tel, optional)
   - Project Type (select: Residential, Commercial, Exhibition, Furniture, Other)
   - Project Scope (select: Full-Service, Room Refresh, Virtual, Consultation)
   - Budget Range (select: Under $25K, $25-75K, $75-200K, $200K+)
   - Project Location (text, optional)
   - How did you hear about us? (select: Instagram, Pinterest, Google, WeChat, Referral, Other)
   - Preferred Language (select: English, 中文)
   - Tell us about your vision (textarea, required)

   All labels bilingual (label + labelCn, render based on locale).

   Submit button: gold, "Request Consultation" / "提交咨询请求"
   Success state: elegant confirmation message with next steps

   Form submission:
   - Validate all required fields with inline errors
   - Submit via API route → save to Supabase table `consultation_requests`
   - Send email notification via Resend
   - Show success message

3. DIRECT CONTACT (right sidebar on desktop, below form on mobile)
   - Phone number (clickable on mobile)
   - Email address
   - Studio address
   - Office hours
   - Bilingual labels

4. SOCIAL LINKS
   - Instagram icon + link
   - Pinterest icon + link
   - WeChat QR code image (display as small card with QR)
   - Xiaohongshu link

DESIGN:
- Warm, inviting — not a cold corporate form
- Subtle gold accents on focused input fields
- Input styling: thin bottom border (not full border box), clean
- Generous spacing between fields

Admin Done-Gate:
- [ ] Edit form field labels in admin → save → labels update
- [ ] Edit success message → save → confirmation updates
- [ ] Submit form → email notification arrives → entry in Supabase
- [ ] Chinese locale → all labels render in Chinese
```

### Prompt 10: Collections Hub + Detail

```
Build the Collections section:
- Hub at /collections (and /zh/collections)
- Detail at /collections/[slug] (and /zh/collections/[slug])

Reference @JULIA_STUDIO_CONTENT_CONTRACTS.md — Collections Hub + Design Collection.

COLLECTIONS HUB:
- Simple grid of collection cards
- Each: large cover image, collection title, brief description
- Click → /collections/[slug]
- 2 columns desktop, 1 mobile

COLLECTION DETAIL:
1. HERO — Cover image + collection title + description
2. MOOD IMAGES — Grid of mood/inspiration images
3. FEATURED PROJECTS — Projects from this collection (portfolio cards)
4. SHOP PRODUCTS — Products from this collection (product cards)
5. CTA — "Explore More Collections" or "Book Consultation"

Managed by: Collections Editor (dedicated admin section).

Admin Done-Gate:
- [ ] Create new collection → appears in hub
- [ ] Link portfolio projects → they display on collection page
- [ ] Link shop products → they display
```

### Prompt 11: Press + Testimonials + FAQ

```
Build the remaining authority pages:

PRESS (/press):
- Awards section: grid of award badges/logos with name + year
- Press section: list of press features with publication logo, article title, date, link
- Managed via Content Editor (pages/press.json)

TESTIMONIALS (/testimonials):
- Hero + filter (by category)
- Masonry card layout of testimonials
- Each: large quote text, author, title, category, rating (gold stars)
- Featured testimonials shown larger
- Managed by: Testimonials Editor (dedicated admin section)

FAQ (/faq):
- Accordion by category (Design Process, Pricing & Budget, Timeline, Shop)
- Each category: collapsible section with Q&A items
- Smooth expand/collapse animation
- Bilingual: questionCn, answerCn
- Bottom CTA: "Still have questions? Contact Us →"
- Managed via Content Editor (pages/faq.json)

Admin Done-Gate:
- [ ] Add testimonial in Testimonials Editor → appears on page
- [ ] Edit FAQ question → save → updates
- [ ] Add press item → save → appears in list
```

### Prompt 12: Admin Collection Editors

```
Build dedicated admin collection editors for Julia Studio.

Following the pattern already established by Blog Posts Editor, create:

1. PORTFOLIO EDITOR (admin sidebar: "Portfolio")
   - Left panel: list of all portfolio/*.json entries
     Show: cover image thumbnail, title, category tag, year
     Sort: newest first
   - Right panel: edit form for selected project
     All fields from Portfolio Project contract
     Image gallery management: add/remove/reorder images
     Shop This Look: product slug selector
     Related Projects: project slug selector
   - CRUD: Create new project, Edit, Duplicate, Delete

2. SHOP PRODUCTS EDITOR (admin sidebar: "Shop Products")
   - Left panel: product list with thumbnail, name, price, category, status
     Filter by category
   - Right panel: edit form
     All fields from Shop Product contract
     Image gallery management
     Seen In Projects: project slug selector
   - CRUD: Create, Edit, Duplicate, Delete

3. JOURNAL EDITOR (admin sidebar: "Journal")
   - Left panel: post list with thumbnail, title, type (article/video), date
   - Right panel: edit form
     All fields from Journal Post contract
     Type toggle: Article vs Video
     Markdown body editor for articles
     Video URL input for videos
   - CRUD: Create, Edit, Duplicate, Delete

4. COLLECTIONS EDITOR (admin sidebar: "Collections")
   - Left panel: collection list
   - Right panel: edit form with project/product slug selectors

5. TESTIMONIALS EDITOR (admin sidebar: "Testimonials")
   - List all testimonials with quote preview, author, category
   - Add/Edit/Remove/Reorder
   - Featured toggle

IMPORTANT: Content Editor file list must EXCLUDE:
- portfolio/*.json (managed by Portfolio Editor)
- shop-products/*.json (managed by Shop Products Editor)
- journal/*.json (managed by Journal Editor)
- collections/*.json (managed by Collections Editor)

Content Editor shows ONLY: pages/*.json, *.layout.json, globals.

Admin Done-Gate:
- [ ] Each editor appears in sidebar
- [ ] Create entry in each editor → saved to Supabase
- [ ] Edit entry → save → frontend page updates
- [ ] Delete entry → removed from frontend
- [ ] Content Editor does NOT show collection entries
```

### Prompt 13: Chinese Content + Language Polish

```
Ensure complete bilingual support across the entire site.

1. Verify ALL content JSON files have complete Chinese (Cn) fields:
   - Every headline → headlineCn
   - Every body → bodyCn
   - Every label → labelCn
   - Every alt → altCn

2. Chinese typography:
   - Verify Noto Serif SC renders for headings in zh locale
   - Body text: DM Sans with Chinese system font fallback
   - Line-height: increase slightly for Chinese text (1.9 vs 1.7)
   - Letter-spacing: normal (not the tight spacing used for English)

3. Language switcher:
   - URL pattern: /portfolio/[slug] (en) → /zh/portfolio/[slug] (zh)
   - Switcher preserves current page when toggling
   - SEO: hreflang tags on every page (en + zh)

4. Chinese-specific:
   - WeChat QR code prominently displayed on contact page
   - Social links include Xiaohongshu for Chinese users
   - Date formatting: Chinese format for zh locale (2026年2月21日)
   - Currency: same (USD) but consider showing ¥ equivalent later

5. Content quality review:
   - Chinese text reads naturally (not machine-translated feel)
   - Cultural sensitivity: appropriate imagery and phrasing

Verify:
- [ ] Navigate entire site in Chinese — all text renders in Chinese
- [ ] Switch EN → ZH on every page — works correctly
- [ ] No English text leaking through in Chinese locale
- [ ] hreflang tags present in HTML head
```

### Prompt 14: Responsive Polish + Performance

```
Final responsive and performance polish for all Julia Studio pages.

RESPONSIVE (test at 375px, 768px, 1024px, 1440px):

Mobile (< 768px):
- Hamburger menu → full-screen dark overlay with gold links
- All grids → single column
- Portfolio masonry → single column with consistent aspect ratio
- Shop product detail → stacked (images above, info below)
- Hero slideshows → maintain full-viewport height
- CTAs: full-width buttons, min 48px height (touch-friendly)
- Phone numbers: clickable tel: links
- Horizontal scroll for product preview rows
- Remove parallax effects on mobile

Tablet (768-1024px):
- Portfolio grid: 2 columns
- Shop grid: 2-3 columns
- Journal grid: 2 columns
- Navigation: can show full nav or hamburger (test both)

Desktop (1024px+):
- Max-width container: 1280px with generous side padding
- Portfolio grid: 3 columns masonry
- Shop grid: 4 columns

PERFORMANCE (critical — interior design = heavy imagery):
- ALL images: next/image with appropriate sizes prop
  - Hero: priority loading, sizes="100vw"
  - Portfolio grid: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  - Shop grid: sizes="(max-width: 768px) 50vw, 25vw"
  - Detail galleries: lazy load below fold
- Blur placeholder: use blurDataURL for smooth loading
- next/font: preload for Playfair Display and DM Sans
- Dynamic imports for: lightbox component, Instagram embed, video player
- ISR: 3600s for pages, 86400s for programmatic SEO pages

TARGET: Lighthouse > 90 on all categories for Home, Portfolio, and Shop.

Verify:
- [ ] No horizontal overflow on any page at any width
- [ ] All images load with proper sizing (no layout shift)
- [ ] Lighthouse Performance > 90 on Home page
- [ ] LCP < 2.5s on Portfolio page
- [ ] Mobile nav opens/closes smoothly
```

### Phase 2 Done-Gate Checklist

```
Before proceeding to Phase 3, verify ALL:

- [ ] Shop hub: product grid with filters, load more
- [ ] Shop detail: image gallery, specs, inquiry button, seen-in-projects
- [ ] Journal hub: articles + videos mixed, category filter, newsletter CTA
- [ ] Journal post: article renders markdown, video embeds player
- [ ] Contact: consultation form submits, email notification, DB storage
- [ ] Collections: hub + detail with linked projects and products
- [ ] Press: awards grid + press features list
- [ ] Testimonials: masonry cards, category filter, featured display
- [ ] FAQ: accordion by category, bilingual
- [ ] ALL 5 collection editors working (Portfolio, Shop, Journal, Collections, Testimonials)
- [ ] Content Editor shows ONLY page files and globals (no collections)
- [ ] Complete Chinese content on all pages
- [ ] Language switcher works on every page
- [ ] Mobile responsive on all pages
- [ ] All forms submit correctly
- [ ] Lighthouse > 90 on core pages
- [ ] Git tagged: v0.2-complete-frontend
```

---

## What Comes Next

**Phase 3 (Week 4):** Admin gap audit, programmatic SEO pages (location, type, style), schema.org, sitemap, performance hardening. Use the same Cursor prompt pattern with @reference files.

**Phase 4 (Week 5):** Full QA, content swap (replace placeholders with real Julia Studio content and photography), production deploy to studio-julia.com, search engine submission.

**Phase 5 (Month 1-12):** Growth plan per JULIA_STUDIO_COMPLETE_PLAN.md Section Phase 5.
