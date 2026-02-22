# Julia Studio — Complete Implementation Plan (BAAM System F)

> **Business:** Julia Studio — Interior & Soft Design
> **Domain:** studio-julia.com
> **Market:** US + China-speaking clients, luxury residential & commercial
> **Positioning:** Premium, 25-year authority, full-service design + shop
> **Languages:** English (default) + Chinese (中文)
> **BAAM System:** System F (Interior Design)
> **Date:** February 2026

---

## Table of Contents

### Stage A — Strategy & Design
- [A1: Industry Deep Dive](#a1-industry-deep-dive)
- [A2: Brand Positioning & Differentiation](#a2-brand-positioning--differentiation)
- [A3: Site Architecture & Page Design](#a3-site-architecture--page-design)
- [A4: Component Inventory & Unique Features](#a4-component-inventory--unique-features)
- [A5: Visual Design Direction](#a5-visual-design-direction)
- [A6: Content Strategy & Conversion Funnel](#a6-content-strategy--conversion-funnel)
- [Stage A Acceptance Gates](#stage-a-acceptance-gates)

### Stage B — Implementation
- [Phase 0: Infrastructure + Content Contracts](#phase-0-infrastructure--content-contracts)
- [Phase 1: Core Pages — Build / Wire / Verify](#phase-1-core-pages--build--wire--verify)
- [Phase 2: Conversion + Content + Shop + Polish](#phase-2-conversion--content--shop--polish)
- [Phase 3: Admin Hardening + SEO](#phase-3-admin-hardening--seo)
- [Phase 4: QA + Launch](#phase-4-qa--launch)
- [Phase 5: 12-Month Growth Plan](#phase-5-12-month-growth-plan)

---

# STAGE A — STRATEGY & DESIGN

---

## A1: Industry Deep Dive

### Competitor Analysis

| Competitor | URL | Strengths | Key Features | Conversion |
|-----------|-----|-----------|-------------|------------|
| **Studio McGee** | studio-mcgee.com | Best-in-class: Read/Watch/Shop/Studio/Portfolio navigation. Massive content hub. Netflix show. McGee & Co shop. Project tours with storytelling. | Read (blog), Watch (video), Shop (products + partner brands), Portfolio (project tours), Full-service + Virtual design | Content → Shop → Design inquiry |
| **Nate Berkus** | nateberkus.com | Strong personal brand. Shop antiques. Brand partner collections. Minimal, gallery-like homepage. Design firm page. Books. | Design Firm, The Book, Shop Antiques (seating, lighting, tables, décor), Brand Partners (rugs, shades, furniture), Press & Media | Shop → Design inquiry |
| **Amber Interiors** | amberinteriordesign.com | California aesthetic, strong Instagram, shop (Shoppe Amber Interiors) | Portfolio, Services, Blog, Shop | Portfolio → Inquiry |
| **Jeremiah Brent** | jeremiahbrent.com | Editorial feel, strong project photography, personal story | Projects, About, Press, Contact | Portfolio → Contact |
| **Havenly** | havenly.com | Online-first, style quiz, affordable, massive scale | Style Quiz, Designer matching, 3D rendering, Shop checkout, Packages | Quiz → Package purchase |
| **Taylor Howes** | taylorhowes.co.uk | 30-year luxury London studio, awards front and center, paint-stroke brand identity | Services, Portfolio, Awards, Journal, Contact | Portfolio → Inquiry |
| **London Design Group** | londondesigngroup.co.uk | Parallax photography, quiet luxury, 25-year heritage | Projects, Services, About, Press | Portfolio → Contact |

### Key Patterns from Top Studios

1. **Photography is everything.** Every top design site is image-first. Full-bleed hero images, large project galleries, minimal text. The work speaks.
2. **Portfolio is the centerpiece.** Not "Services" — the portfolio/projects page is the primary trust builder. Project tours with storytelling convert better than photo galleries alone.
3. **Shop is revenue.** Studio McGee, Nate Berkus, Amber Interiors all have product shops — furniture, décor, antiques. This is a major revenue stream alongside design services.
4. **Content builds authority.** Blog + video (Read + Watch in Studio McGee's model) = SEO engine + social content + brand building.
5. **Bilingual is rare.** Almost no US luxury design studios have Chinese-language sites. This is Julia's competitive advantage for Chinese-speaking clients.
6. **Personal brand matters.** The designer's story, philosophy, and aesthetic vision are front and center.

### Customer Profile

**Primary:** Affluent homeowners and business owners (35-65) seeking full-service interior design.

**Segments:**
- English-speaking homeowners wanting luxury residential design
- Chinese-speaking families wanting bilingual design service (unique advantage)
- Commercial clients: offices, medical practices, retail spaces
- Exhibition/event clients: trade shows, art installations, galleries
- Product shoppers: furniture and décor buyers inspired by Julia's aesthetic

**Buyer Journey:**
1. Discover (Instagram, Google, referral, Chinese social media WeChat/Xiaohongshu)
2. Browse portfolio → impressed by quality and range
3. Read about Julia's story and philosophy → trust builds
4. Explore shop → see the aesthetic is purchasable
5. Contact / Book consultation → become design client
6. OR → purchase products directly from shop

### Industry-Specific Requirements

- **Professional photography** is non-negotiable — stock photos are a signal of amateur status
- **Awards and press mentions** are major trust signals
- **Process transparency** — clients want to understand design process and pricing approach
- **Bilingual service** for Chinese clients requires complete Chinese content, not just translated nav
- **Product e-commerce** needs cart, checkout, and order management (can be external link to Shopify or built-in)

---

## A2: Brand Positioning & Differentiation

### Core Positioning Statement

**"Julia Studio is a premier interior design house with 25 years of refined expertise, creating timeless spaces for homes, offices, and exhibitions — with the rare ability to serve both English and Chinese-speaking clients with equal mastery."**

### Five Pillars of Differentiation

| Pillar | Claim | Evidence | Site Communication |
|--------|-------|----------|-------------------|
| **1. 25 Years of Mastery** | Quarter-century of design excellence | 1,000+ completed projects, portfolio depth | About page story, stats, timeline |
| **2. Complete Service** | Design + Construction + Furnishing under one roof | In-house design, construction team, furniture purchasing | Services page showing full pipeline |
| **3. Competitive Pricing on Furnishings** | Direct furniture purchasing at competitive prices | Trade pricing, supplier relationships, curated shop | Shop section, pricing advantage messaging |
| **4. Bilingual Excellence** | Full Chinese-language experience, not just translation | Native Chinese content, culturally aware design, WeChat integration | Language switcher, culturally resonant Chinese copy |
| **5. Diverse Portfolio** | Home, office, exhibition, art shows — proven across categories | 1,000+ projects across multiple categories | Portfolio with category filters |

### Scale Perception

- **1,000+** projects completed
- **25** years in business
- **500+** happy clients
- **15+** awards and press features (or industry recognitions)
- **50+** design collections in portfolio
- Multiple project categories: residential, commercial, exhibition, arts

### Conversion Path

- **Primary:** Book a Consultation (design inquiry form)
- **Secondary:** Shop products (furniture, décor)
- **Tertiary:** Subscribe to newsletter / follow on social

---

## A3: Site Architecture & Page Design

### Complete Page Map

#### Tier 1 — Core (Launch)

| # | Page | Route | Purpose | Conversion Role |
|---|------|-------|---------|----------------|
| 1 | **Home** | / | First impression — luxury, mastery, range | Hook → Portfolio / Shop / Consult |
| 2 | **Portfolio** | /portfolio | Showcase of all projects — THE trust builder | Impress → Category browse → Project detail → Consult |
| 3 | **Portfolio Detail** | /portfolio/[slug] | Individual project story with photography | Deep trust → Consult |
| 4 | **Services** | /services | Full-service breakdown: design, construction, furnishing | Educate → Consult |
| 5 | **Shop** | /shop | Curated furniture, décor, and accessories for purchase | Browse → Purchase / Inquiry |
| 6 | **Shop Product** | /shop/[slug] | Individual product detail | Purchase |
| 7 | **About** | /about | Julia's story, philosophy, team, awards, timeline | Trust → Consult |
| 8 | **Journal** | /journal | Blog (articles) + Video content | Authority + SEO |
| 9 | **Journal Post** | /journal/[slug] | Individual article or video | Educate → Consult / Shop |
| 10 | **Contact / Book** | /contact | Consultation booking form + direct contact | CONVERT |

#### Tier 2 — Authority (Post-launch or launch if content available)

| # | Page | Route | Purpose |
|---|------|-------|---------|
| 11 | **Collections** | /collections | Curated design collections by theme/style (e.g., "Modern Minimalist", "East-West Fusion") |
| 12 | **Collection Detail** | /collections/[slug] | Individual collection with photos, products, inspiration |
| 13 | **Press** | /press | Media features, awards, publications |
| 14 | **FAQ** | /faq | Process, pricing, timeline questions |
| 15 | **Testimonials** | /testimonials | Client reviews and endorsements |

#### Tier 3 — SEO Programmatic

- /interior-design/[city] — Location pages (New York, Flushing, Manhattan, etc.)
- /interior-design-for-[type] — Type pages (home, office, restaurant, medical)
- /design-styles/[style] — Style pages (modern, transitional, contemporary, minimalist)

### Detailed Page Designs

#### HOME PAGE

```
Purpose: First impression. Gallery-like, editorial, luxurious.
Conversion: Browse Portfolio → Book Consultation → Shop
Target: Anyone discovering Julia Studio

Sections:
1. HERO — Full-screen image slideshow (3-5 stunning project photos, slow crossfade)
   Minimal text: "Julia Studio" logo + tagline "25 Years of Timeless Design"
   No heavy text — let the imagery speak. Subtle scroll indicator.

2. INTRODUCTION — Brief, elegant statement (2-3 sentences)
   "Julia Studio creates spaces that transcend trends. For 25 years, we've designed
    homes, offices, and exhibitions that reflect the unique vision of each client."
   Side-by-side: text left, curated project photo right

3. PORTFOLIO PREVIEW — 4-6 project thumbnails in a masonry or grid layout
   Each: full-bleed photo, project name, category tag (Residential, Commercial, Exhibition)
   Hover: subtle zoom or caption reveal
   "View All Projects →" link

4. SERVICES OVERVIEW — 3 cards, minimal:
   - Interior Design — "From concept to completion"
   - Construction & Installation — "Precision craftsmanship"
   - Furniture & Décor — "Curated at competitive prices"
   Each: icon or small image, brief description, "Learn More →"

5. FEATURED COLLECTION — One curated design collection highlight
   Large image + collection name + brief description
   "Explore Collection →"

6. SHOP PREVIEW — 4-6 product cards from the shop
   Each: product photo, name, price
   "Shop All →"

7. JOURNAL PREVIEW — 2-3 latest journal entries (mix of articles and videos)
   Each: thumbnail, category (Design Tips / Behind the Scenes / Video), title, date
   "Read More →"

8. ABOUT TEASER — Julia's portrait + brief bio (2 sentences) + key stat
   "25 years. 1,000+ projects. One vision: timeless design."
   "Meet Julia →"

9. CONSULTATION CTA — Elegant, full-width
   "Begin Your Design Journey"
   "Book a complimentary consultation to discuss your project."
   Button: "Book Consultation"

10. INSTAGRAM FEED — 6-8 latest Instagram posts (embedded or static grid)

CTA Strategy:
- Primary: "Book Consultation" (in hero, CTA section, header)
- Secondary: "Shop" (shop preview, header)
```

#### PORTFOLIO PAGE

```
Purpose: THE showcase. This page SELLS the studio's capability.
Conversion: Browse → Click project → Be amazed → Book consultation

Sections:
1. HERO — "Our Work" or simply "Portfolio"
   Subtitle: "25 years. 1,000+ projects. Every space tells a story."
   Clean, minimal, photo background optional.

2. FILTER BAR — Category filters:
   All | Residential | Commercial | Exhibition | Art & Shows
   Optional sub-filters: Style (Modern, Traditional, Transitional, East-West Fusion)
   Optional: Room type (Living Room, Kitchen, Bedroom, Office, Lobby)

3. PROJECT GRID — Masonry or uniform grid of 20-30 project cards
   Each card: large photo, project name, location, category tag
   Hover: second photo or subtle overlay with "View Project →"
   Load more / pagination for additional projects
   The grid should feel like a curated gallery — generous whitespace, no clutter.

4. CTA — "Inspired? Let's create something extraordinary together."
   "Book Consultation →"
```

#### PORTFOLIO DETAIL (/portfolio/[slug])

```
Purpose: Deep dive into a single project — storytelling that builds trust.
Following Studio McGee's model: this is a PROJECT TOUR, not just photos.

Sections:
1. HERO — Full-width hero image of the project
   Project name, location, category, year

2. PROJECT OVERVIEW — 2-3 paragraphs describing:
   - The client's vision and brief
   - The design approach and inspiration
   - Key challenges and solutions

3. PHOTO GALLERY — 10-20 high-quality images
   Mix of: wide room shots, detail close-ups, before/after (if available)
   Layout: alternating full-width and 2-column grid
   Optional: lightbox for full-screen viewing

4. DESIGN DETAILS — Sidebar or inline callouts:
   - Style: Modern Minimalist
   - Scope: Full home redesign
   - Duration: 6 months
   - Rooms: Living, Kitchen, Master Bedroom, 2 Bathrooms
   - Key materials: White oak, Italian marble, custom millwork

5. FEATURED PRODUCTS — "Shop This Look"
   Products from the shop used in this project
   Each: product image, name, price, "Shop →"
   (This is the Studio McGee / Nate Berkus revenue model)

6. CLIENT TESTIMONIAL — Quote from the client about the project

7. RELATED PROJECTS — 3 similar project cards
   "You May Also Like"

8. CTA — "Ready to transform your space?"
   "Book Consultation →"
```

#### SERVICES PAGE

```
Purpose: Explain Julia's full-service model: Design + Construction + Furnishing.

Sections:
1. HERO — "Our Services"
   "From concept to completion — a seamless design experience."

2. DESIGN SERVICES (detailed):
   - Full-Service Interior Design: concept, space planning, material selection, project management
   - Virtual / E-Design: remote design consultations with mood boards and shopping lists
   - Room Refresh: smaller-scale updates (single room, styling, accessories)
   
3. CONSTRUCTION & INSTALLATION:
   - Custom millwork and cabinetry
   - Renovation management
   - Furniture assembly and installation
   - "Our in-house construction team ensures design integrity from plan to reality"

4. FURNITURE & DÉCOR PURCHASING:
   - Access to trade-only suppliers
   - Competitive pricing (passed to clients)
   - Custom upholstery and furnishings
   - "Shop our curated collection or let us source specifically for your project"

5. PROCESS TIMELINE:
   Step 1: Consultation (free, 30 min) → understand vision and budget
   Step 2: Design Concept → mood boards, space plans, material palettes
   Step 3: Design Development → detailed drawings, specifications, selections
   Step 4: Procurement → furniture, materials, fixtures ordered
   Step 5: Construction & Installation → our team executes
   Step 6: Reveal → styled, photographed, enjoyed

6. SPECIALTIES:
   - Residential: homes, apartments, penthouses
   - Commercial: offices, medical practices, retail
   - Exhibition & Events: trade shows, art installations, galleries
   - Custom Furniture: bespoke pieces designed and crafted

7. CTA: "Every great space starts with a conversation."
   "Book Your Free Consultation →"
```

#### SHOP PAGE

```
Purpose: Curated products for purchase — furniture, décor, accessories.
Model: Similar to McGee & Co or Nate Berkus antiques.

Options for implementation:
A) Built-in shop (product listing + inquiry/order form — simpler, BAAM-native)
B) External Shopify store linked from site (full e-commerce)
C) Hybrid: showcase products on BAAM site, "Buy" links to Shopify

Recommended for launch: Option A — product showcase with inquiry/order form.
Full Shopify integration can come later.

Sections:
1. HERO — "Shop Julia Studio"
   "Furniture and décor curated by Julia — at competitive prices."

2. CATEGORY FILTERS:
   All | Furniture | Lighting | Textiles | Art & Décor | Accessories
   Sub-filters: Room (Living, Bedroom, Dining, Office) | Style | Price range

3. PRODUCT GRID — Cards with:
   Photo, name, price (or "From $XXX"), "View Details" or "Inquire"

4. FEATURED COLLECTIONS — "Julia's Picks" or seasonal highlights

5. TRADE PROGRAM — CTA for design professionals:
   "Interior designers: access trade pricing."
```

#### SHOP PRODUCT DETAIL (/shop/[slug])

```
1. Product images (gallery, 3-5 photos)
2. Name, price, brief description
3. Specifications: dimensions, materials, colors, lead time
4. "Add to Cart" or "Inquire About This Piece" button
5. "Seen in These Projects" — link to portfolio projects featuring this piece
6. Related products
```

#### ABOUT PAGE

```
Sections:
1. HERO — Julia portrait + "About Julia Studio"
2. JULIA'S STORY — Personal narrative, 25-year journey, philosophy
   Written in first person or warm third person
3. DESIGN PHILOSOPHY — Core beliefs about design (2-3 paragraphs)
4. BY THE NUMBERS — 25 Years | 1,000+ Projects | 500+ Clients | 15+ Awards
5. TEAM — Julia + key team members (design director, lead architect, construction manager)
6. TIMELINE — Visual timeline of studio milestones (founding, major projects, expansions)
7. AWARDS & PRESS — Logos, badges, publication features
8. CTA — "Let's create something beautiful together."
```

#### JOURNAL PAGE

```
Purpose: Blog (articles) + Video content in one hub.
Model: Studio McGee's Read + Watch combined.

Sections:
1. FEATURED POST — Large hero post (article or video)
2. FILTER: All | Design Tips | Behind the Scenes | Project Stories | Video | Trends
3. CONTENT GRID — Cards mixing articles and video
   Article cards: thumbnail, title, category, date, excerpt
   Video cards: thumbnail with play icon, title, duration, category
4. NEWSLETTER CTA: "Design inspiration, delivered weekly."
```

#### CONTACT / BOOK PAGE

```
Sections:
1. HERO — "Begin Your Design Journey"
2. CONSULTATION FORM:
   - Name
   - Email
   - Phone
   - Project type: Residential / Commercial / Exhibition / Other
   - Project scope: Full Design / Room Refresh / Virtual Design / Furniture Only
   - Budget range: Under $25K / $25K-$75K / $75K-$200K / $200K+
   - Project location
   - How did you hear about us?
   - Tell us about your vision (textarea)
   - Preferred language: English / Chinese
   - Submit: "Request Consultation"
3. DIRECT CONTACT — Phone, email, studio address, hours
4. SOCIAL LINKS — Instagram, Pinterest, WeChat QR code, Xiaohongshu
```

---

## A4: Component Inventory & Unique Features

| Component | Industry-Specific? | Description | Medical Equivalent? |
|-----------|-------------------|-------------|---------------------|
| ImageHero | Reuse (adapt) | Full-screen image slideshow with minimal text overlay | Hero |
| PortfolioGrid | **NEW** | Masonry/grid with category filters, hover effects, load more | No equivalent |
| ProjectGallery | **NEW** | Full project tour: narrative + photo gallery + details sidebar | No equivalent |
| ShopProductGrid | **NEW** | Product cards with price, category filter, cart/inquiry | No equivalent |
| ProductDetail | **NEW** | Product images, specs, "Shop This Look" cross-links | No equivalent |
| ServiceCards | Reuse (adapt) | Service type cards with process timeline | Services |
| ProcessTimeline | Reuse (adapt) | 6-step design process visualization | HowItWorks |
| JournalGrid | Reuse (adapt) | Content grid mixing articles and videos | Blog |
| VideoCard | **NEW** | Thumbnail with play icon, duration badge, video embed on click | No equivalent |
| TeamGrid | Reuse (adapt) | Team member cards with photos and bios | Team section |
| StudioTimeline | **NEW** | Visual milestone timeline (25 years of history) | No equivalent |
| AwardsStrip | Reuse (adapt) | Awards and press badges | Certifications |
| InstagramFeed | **NEW** | Embedded or static Instagram post grid | No equivalent |
| DesignCollectionCard | **NEW** | Collection showcase: theme name, mood image, description | No equivalent |
| ShopThisLook | **NEW** | Product cross-sell within project detail pages | No equivalent |
| ConsultationForm | **NEW** | Design inquiry with project type, scope, budget, language | ContactForm (adapted) |
| LanguageSwitcher | Reuse | EN/CN toggle in header | Existing (medical has bilingual) |
| WeChatQR | **NEW** | WeChat QR code display for Chinese clients | No equivalent |

**Summary: 10 genuinely NEW components, 8 adapted from existing patterns.**

---

## A5: Visual Design Direction

### Color Palette

| Role | Color | Hex | Rationale |
|------|-------|-----|-----------|
| Primary | Warm charcoal | #2C2C2C | Sophisticated, lets photos dominate |
| Secondary | Soft gold / champagne | #C4A265 | Luxury, warmth, premium feel |
| Accent | Sage green | #8B9D83 | Natural, organic, design-forward |
| Background light | Warm white | #FAF8F5 | Inviting, not clinical |
| Background dark | Deep charcoal | #1A1A1A | Dramatic sections, premium feel |
| Text primary | Soft black | #2C2C2C | Readable, warm |
| Text secondary | Warm gray | #6B6B6B | Captions, metadata |
| CTA | Gold | #C4A265 | Stands out against both light and dark |

**Psychology:** Warm, not cold. Sophisticated, not corporate. The site should feel like walking into a beautifully designed room — inviting, curated, personal.

### Typography

| Role | Font | Weight | Size | Rationale |
|------|------|--------|------|-----------|
| Display / Headlines | **Playfair Display** (serif) | 400-700 | 3-4rem | Elegant, editorial, timeless |
| Body / Navigation | **Inter** or **DM Sans** (sans-serif) | 300-500 | 1rem | Clean, modern, readable |
| Chinese | **Noto Serif SC** (serif) | 400-700 | Same scale | Elegant Chinese serif to match Playfair's personality |

**Serif headlines are essential for interior design sites** — they communicate luxury and editorial quality. Sans-serif body maintains readability.

### Photography & Visual Style

- **Hero images:** Full-bleed, high-resolution project photography. Warm-toned, well-lit interiors.
- **Portfolio:** Consistent photography style across projects — warm natural light, styled spaces, detail shots
- **Product shots:** Clean, white or lifestyle backgrounds — consistent format
- **Team photos:** Natural, approachable, professional — not overly corporate
- **Journal:** Mix of project photos and lifestyle imagery
- **NO stock photos on portfolio or team pages** — only real project and people photography
- **Stock OK for:** Blog illustrations, decorative elements, style guide references (from Unsplash)

### Layout Principles

- **Image-first:** Photos take 60-70% of viewport. Text is supplementary.
- **Generous whitespace:** Interior design is about space. The site should breathe.
- **Minimal UI chrome:** Thin headers, subtle navigation, no heavy borders or shadows.
- **Gallery feel:** The site should feel like a curated design magazine, not a corporate website.
- **Slow, elegant transitions:** Subtle fade-ins, parallax on scroll, image crossfades.
- **No animated stat counters** (unlike freight) — instead, let numbers speak quietly.

### Design Reference Sites

| Site | Reference For |
|------|--------------|
| **studio-mcgee.com** | Navigation model (Read/Watch/Shop/Portfolio), project tours, content hub structure |
| **nateberkus.com** | Gallery-like homepage, shop integration (antiques + brand collections), minimal editorial design |
| **taylorhowes.co.uk** | Luxury heritage brand, awards display, sophisticated color palette |
| **londondesigngroup.co.uk** | Parallax photography, quiet luxury, 25-year heritage |
| **jessicahelgerson.com (JHID)** | Portfolio storytelling, editorial approach, clean grid |
| **bryanosullivanstudio.com** | Full-bleed imagery, shoppable products linked from portfolio |

---

## A6: Content Strategy & Conversion Funnel

### Launch Content Minimums

| Content Type | Minimum | Ideal |
|-------------|---------|-------|
| Portfolio projects (with full gallery) | 12 | 20-30 |
| Products in shop | 20 | 50+ |
| Journal articles | 6 | 10 |
| Journal videos | 2 | 5 |
| Client testimonials | 8 | 15 |
| Design collections | 3 | 6 |
| Awards/press mentions | 5 | 10+ |

### Conversion Funnel

```
Discovery: Instagram / Pinterest / Google / WeChat / Xiaohongshu / Referral
   ↓
Browse: Portfolio page → filter by category → click project
   ↓
Trust: Project detail (storytelling + photography) → About page (25 years, 1000+ projects)
   ↓
Engage: Shop products → Journal content → Collections
   ↓
Convert: Book Consultation form OR Purchase product from shop
   ↓
Retain: Newsletter → Social follow → Repeat purchase → Referral
```

### CTA Placement

| Page | Primary CTA | Secondary CTA |
|------|------------|---------------|
| Home | "Book Consultation" | "View Portfolio" / "Shop" |
| Portfolio | "Book Consultation" | — |
| Portfolio Detail | "Book Consultation" | "Shop This Look" |
| Services | "Book Your Free Consultation" | — |
| Shop | "Inquire" / "Add to Cart" | "Book Consultation" |
| About | "Begin Your Design Journey" | — |
| Journal | "Book Consultation" (sidebar) | "Shop" |
| Contact | "Request Consultation" (form) | — |

### Post-Launch Content Velocity

- **Journal articles:** 1-2 per week (design tips, project stories, trend pieces)
- **Journal videos:** 1-2 per month (project tours, behind-the-scenes, design tips)
- **New products in shop:** 5-10 per month
- **New portfolio projects:** 1-2 per month (as projects complete)
- **Chinese content:** Mirror all key content in Chinese (prioritize: About, Services, Portfolio, Contact)

---

## Stage A Acceptance Gates

| Gate | Criteria | Status |
|------|----------|--------|
| A-Gate-1: Page Map | All 15 pages defined with route, purpose, sections, CTA | ✅ Above |
| A-Gate-2: Conversion Funnel | Full funnel mapped, primary/secondary CTA per page | ✅ Above |
| A-Gate-3: Content Contracts | JSON schema needed for all launch pages | → Phase 0 |
| A-Gate-4: Variant Registry | Section variants defined for portfolio, shop, hero, journal | → Phase 0 |
| A-Gate-5: Content Minimums | 12 projects, 20 products, 6 articles, 2 videos, 8 testimonials confirmed | Pending content |
| A-Gate-6: Visual Direction | Color palette, typography, photography style documented | ✅ Above |
| A-Gate-7: Component Inventory | 10 NEW + 8 REUSE classified with data shapes | ✅ Above |

---

# STAGE B — IMPLEMENTATION

---

## Phase 0: Infrastructure + Content Contracts

### Prompt 0A — Project Setup

```
Duplicate medical codebase as foundation for Julia Studio interior design site.

Keep: Admin CMS, content loading (DB-first), media system, theme system,
domain routing, import/export, RBAC, auth, bilingual support (EN + ZH).

Remove: Medical-specific sections (Conditions, Credentials, Specializations,
Philosophy, Journey, Affiliations, Clinic), Booking system.

Keep and adapt: Bilingual content infrastructure (locale routing, language
switcher, Chinese font support).

New Supabase project: "JuliaStudio" — fully isolated.
Schema SQL: admin + content tables (skip booking tables).
Storage bucket: "media"
Environment: all new keys.

Site entry:
- id: "julia-studio"
- name: "Julia Studio"
- domain: "studio-julia.com"
- defaultLocale: "en"
- supportedLocales: ["en", "zh"]

Local domain: studio-julia.local
```

### Prompt 0B — Theme & Design System

```
Theme: warm, luxurious interior design studio.

Colors:
- primary: #2C2C2C (warm charcoal)
- primary.light: #4A4A4A
- primary.dark: #1A1A1A
- secondary: #C4A265 (champagne gold)
- secondary.light: #D4B87A
- secondary.dark: #A88B50
- accent: #8B9D83 (sage green)
- backdrop.primary: #FAF8F5 (warm white)
- backdrop.secondary: #1A1A1A (deep charcoal for dark sections)
- text.primary: #2C2C2C
- text.secondary: #6B6B6B

Typography:
- Headlines: Playfair Display (serif) — elegant, editorial
- Body/Nav: DM Sans (sans-serif) — clean, modern
- Chinese: Noto Serif SC (serif) — matches Playfair's personality
- Both via next/font

Global settings:
- site.json: Julia Studio, tagline, contact info
- header.json: minimal nav — Portfolio, Services, Shop, Journal, About, Contact
  + Language switcher (EN | 中文)
  + "Book Consultation" CTA button (gold)
- footer.json: studio info, social links (Instagram, Pinterest, WeChat QR),
  copyright, "Privacy Policy" / "Terms"
- navigation.json
- seo.json: "Julia Studio — 25 Years of Timeless Interior Design"
```

### Prompt 0C — Content Contracts

Define JSON contracts for ALL pages following the page designs in Stage A:

**Pages to contract:**
- pages/home.json + home.layout.json
- pages/portfolio.json + portfolio.layout.json
- pages/services.json + services.layout.json
- pages/shop.json + shop.layout.json
- pages/about.json + about.layout.json
- pages/journal.json + journal.layout.json
- pages/contact.json + contact.layout.json
- pages/collections.json + collections.layout.json
- pages/press.json + press.layout.json
- pages/faq.json + faq.layout.json
- pages/testimonials.json + testimonials.layout.json

**Collections to contract:**
- portfolio/[slug].json (individual project)
- shop-products/[slug].json (individual product)
- journal/[slug].json (article or video post)
- collections/[slug].json (design collection)
- testimonials.json (array)

**Section variant definitions for:**
- hero: slideshow, single-image, video-bg, minimal-text
- portfolioGrid: masonry, uniform, featured-large
- projectGallery: alternating, lightbox, filmstrip
- shopProductGrid: grid-4, grid-3, list
- journalGrid: featured-hero, grid, list
- processTimeline: horizontal, vertical, numbered
- teamGrid: cards, editorial, compact
- cta: centered, split, full-image

### Prompt 0D — Seed Content + Media

Seed all JSON into Supabase with realistic placeholder content.

Media setup via Unsplash/Pexels import:
- /julia-studio/hero/ — stunning interior design photos (5-8)
- /julia-studio/portfolio/ — room/space photos by category: living room, kitchen,
  bedroom, office, lobby, exhibition (20-30 images)
- /julia-studio/products/ — furniture and décor product photos (20-30)
- /julia-studio/team/ — professional headshots (4-5)
- /julia-studio/journal/ — blog/article feature images (6-10)
- /julia-studio/about/ — studio photos, milestone images (5-8)
- /julia-studio/collections/ — mood board style images (6-10)

**Unsplash search terms:** "luxury interior design", "modern living room design",
"office interior design", "designer furniture", "interior design studio",
"exhibition design", "bedroom interior", "kitchen design luxury"

---

## Phase 1: Core Pages — Build / Wire / Verify

### Build Order

| # | Prompt | Page | Complexity | Key NEW Components |
|---|--------|------|------------|-------------------|
| 1 | Home | / | High — slideshow hero, portfolio preview, shop preview, journal preview | ImageHero slideshow, PortfolioGrid (preview), ShopPreview |
| 2 | Header + Footer | Layout | Medium — minimal luxury nav, language switcher, social links, WeChat QR | LanguageSwitcher, WeChatQR |
| 3 | Portfolio Hub | /portfolio | High — filterable masonry grid, 20-30 projects | PortfolioGrid with filters |
| 4 | Portfolio Detail | /portfolio/[slug] | High — project tour, gallery, "Shop This Look" | ProjectGallery, ShopThisLook |
| 5 | Services | /services | Medium — 3 service categories + process timeline | ProcessTimeline |
| 6 | About | /about | Medium — Julia's story, team, timeline, awards | StudioTimeline, AwardsStrip |

**Each page: Build → Wire → Verify (admin Form edit + JSON sync + variant switch + layout reorder)**

**SEO baseline in Phase 1:** Every page gets unique title, description, canonical, OG tags.

### Phase 1 Design Notes

**The Portfolio Grid is the most important component.** It must feel like a curated gallery:
- Generous spacing between cards
- Consistent aspect ratios (4:3 or 3:2 landscape)
- Hover: subtle zoom + project name overlay
- Filter transitions: smooth fade/reflow, not jarring
- Load more: infinite scroll or "Load More" button, not pagination

**The Portfolio Detail is the most important page.** Study Studio McGee's project tours:
- Lead with one stunning hero image
- Tell the story in 2-3 paragraphs (not just "see the photos")
- Mix full-width and 2-column image layouts
- Include design details (style, scope, materials)
- "Shop This Look" products cross-linked from the shop
- Client testimonial embedded

**Header must be minimal.** For interior design, heavy navigation kills the aesthetic:
- Logo left, nav center or right, language switcher + "Book" button right
- Transparent on hero sections (text overlaying images)
- Solid background on scroll
- Mobile: clean hamburger, full-screen overlay

---

## Phase 2: Conversion + Content + Shop + Polish

| # | Prompt | Page | Notes |
|---|--------|------|-------|
| 7 | Shop Hub | /shop | Product grid with category filters, price display |
| 8 | Shop Product Detail | /shop/[slug] | Image gallery, specs, "Seen in Projects" cross-link, inquiry/cart |
| 9 | Journal Hub + Post | /journal + /journal/[slug] | Articles AND videos mixed, category filter, video embed support |
| 10 | Contact / Book | /contact | Consultation form with project type, scope, budget, language preference |
| 11 | Collections Hub + Detail | /collections + /collections/[slug] | Curated collections: theme, photos, linked products |
| 12 | Press + Testimonials | /press + /testimonials | Awards grid, press logos, client quotes |
| 13 | FAQ | /faq | Process, pricing, timeline questions with accordion |
| 14 | Chinese Content | All pages (zh locale) | Full Chinese translations, culturally aware content |
| 15 | Responsive Polish | All pages | Mobile/tablet/desktop, image optimization, transitions |

### Blog Editor Boundary
- Journal posts → Blog Posts Editor (create/edit/delete)
- Journal hub page settings → Content Editor at pages/journal.json
- Portfolio projects → dedicated Portfolio Editor (NEW collection editor)
- Shop products → dedicated Shop Editor (NEW collection editor)
- Testimonials → dedicated Testimonials Editor

### Admin Collection Editors for Julia Studio
Following Section 18 of the Master Plan:

```
Admin Dashboard
├── Sites
├── Site Settings
├── Content          ← Pages + layouts + globals only
├── Journal          ← Article and video posts (journal/*.json)
├── Portfolio        ← Project entries (portfolio/*.json)
├── Shop Products    ← Product entries (shop-products/*.json)
├── Collections      ← Design collections (collections/*.json)
├── Testimonials     ← Client testimonials
├── Media
├── Components
├── Variants
├── Users
├── Settings
```

---

## Phase 3: Admin Hardening + SEO

**Admin gap audit** → 100% coverage target

**Programmatic SEO pages:**
- /interior-design/[city] — 15 location pages (Flushing, Manhattan, Brooklyn, etc.)
- /interior-design-for-[type] — 6 type pages (home, office, restaurant, medical, exhibition, retail)
- /design-styles/[style] — 8 style pages (modern, transitional, contemporary, minimalist, east-west-fusion, classic, bohemian, industrial)

**Schema.org:** LocalBusiness, Service, Article, Product, FAQPage, BreadcrumbList, AggregateRating

**Performance:** Image optimization critical (interior design = heavy photography). WebP, lazy loading, blur placeholders, priority loading on hero images.

---

## Phase 4: QA + Launch

Full acceptance testing per Master Plan V3.1 Section 15.

**Additional Julia-specific checks:**
- [ ] Chinese content renders correctly on ALL pages (font, layout, line breaks)
- [ ] Language switcher works: EN → ZH → EN roundtrip, URL updates
- [ ] Portfolio filter works across 20+ projects
- [ ] Shop product inquiry/cart flow works
- [ ] Instagram embed loads (or graceful fallback)
- [ ] WeChat QR code displays correctly on Contact page
- [ ] All project photos optimized (WebP, appropriate sizes)
- [ ] "Shop This Look" cross-links work from portfolio detail to shop

Production deploy → Vercel → studio-julia.com + www redirect + SSL

---

## Phase 5: 12-Month Growth Plan

### Month 1-2: Launch + Content Velocity

- Publish 8-10 journal articles (design tips, project stories)
- Publish 2-3 video content pieces (project tours, design process)
- Add 10+ products to shop monthly
- 1-2 new portfolio projects per month
- Set up Instagram integration
- Set up WeChat/Xiaohongshu presence for Chinese audience
- Submit sitemap to Google/Bing

### Month 3-4: SEO + Chinese Market

- Expand programmatic pages to 50+
- Translate all journal content to Chinese
- Publish Chinese-specific content (Xiaohongshu cross-posts, WeChat articles)
- Pinterest strategy: pin every portfolio project and journal post
- Guest features in design publications

### Month 5-6: Shop Growth

- Expand shop to 100+ products
- Launch seasonal collections (Spring/Fall)
- Email marketing: product launches, design inspiration newsletter
- Consider: Shopify integration for full e-commerce if volume justifies

### Month 7-9: Authority Building

- 50+ journal posts, 10+ videos
- 30+ portfolio projects
- Apply for design awards (local + national)
- Seek press features
- Partnerships with furniture brands

### Month 10-12: BAAM Template + Scale

- Extract BAAM System F template for interior design industry
- Target: 3-5 design studio clients at $20/month
- Document: which components, content structure, and shop model work best
- Onboarding SOP for new design studio clients

### Growth Targets by Month 12

| Metric | Target |
|--------|--------|
| Organic monthly traffic | 3,000-8,000 visits |
| Monthly consultations booked | 10-20 |
| Monthly shop orders/inquiries | 20-50 |
| Portfolio projects displayed | 40+ |
| Journal posts published | 60+ |
| Shop products listed | 150+ |
| Chinese-language content pieces | 30+ |
| Instagram followers | 5,000+ |
| BAAM template clients | 3-5 |
