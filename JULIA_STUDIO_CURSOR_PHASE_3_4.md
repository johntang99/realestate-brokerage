# Julia Studio — Cursor Instructions: Phase 3 & 4

> **System:** BAAM System F — Interior Design
> **Prerequisite:** Phase 0-2 complete (all pages built, admin-wired, responsive, bilingual)
> **Reference files:** Always include in every Cursor conversation:
> - `@JULIA_STUDIO_COMPLETE_PLAN.md`
> - `@JULIA_STUDIO_CONTENT_CONTRACTS.md`
> - `@JULIA_STUDIO_CURSOR_INSTRUCTIONS.md` (Phase 0-2 for context)

---

## Phase 3 — Admin Hardening + SEO (Week 4)

### Prompt 15: Admin Gap Audit + Fix

```
Run a complete admin content coverage audit for Julia Studio.

For EVERY public route on the site, verify that content is:
1. Stored in Supabase content_entries (DB-first)
2. Editable in admin via Form mode with correct fields
3. Editable in admin via JSON mode with full contract shape
4. Variant dropdown present (where applicable)
5. Layout reorder works (where applicable)
6. Chinese (Cn) fields editable and rendering

Check these routes:

PAGES (managed in Content Editor):
| Route | Content Path | Form OK? | JSON OK? | Variant? | Layout? | CN? |
|-------|-------------|----------|----------|----------|---------|-----|
| / | pages/home.json | | | | | |
| /portfolio | pages/portfolio.json | | | | | |
| /services | pages/services.json | | | | | |
| /shop | pages/shop.json | | | | | |
| /about | pages/about.json | | | | | |
| /journal | pages/journal.json | | | | | |
| /contact | pages/contact.json | | | | | |
| /collections | pages/collections.json | | | | | |
| /press | pages/press.json | | | | | |
| /faq | pages/faq.json | | | | | |
| /testimonials | pages/testimonials.json | | | | | |

GLOBAL SETTINGS (managed in Content Editor / Site Settings):
| File | Form OK? | JSON OK? | CN fields? |
|------|----------|----------|------------|
| site.json | | | |
| header.json | | | |
| footer.json | | | |
| seo.json | | | |
| theme.json | | | |
| navigation.json | | | |

COLLECTION EDITORS (dedicated editors):
| Editor | List view? | Create? | Edit? | Delete? | Duplicate? |
|--------|-----------|---------|-------|---------|------------|
| Portfolio | | | | | |
| Shop Products | | | | | |
| Journal | | | | | |
| Collections | | | | | |
| Testimonials | | | | | |

COLLECTION DETAIL PAGES (dynamic routes):
| Route Pattern | Loads from | Renders? | Admin editable? | CN? |
|---------------|-----------|----------|-----------------|-----|
| /portfolio/[slug] | portfolio/*.json | | | |
| /shop/[slug] | shop-products/*.json | | | |
| /journal/[slug] | journal/*.json | | | |
| /collections/[slug] | collections/*.json | | | |

CROSS-PAGE FEATURES:
- [ ] Header loads from header.json, editable, bilingual
- [ ] Footer loads from footer.json, editable, bilingual
- [ ] Language switcher works on every page
- [ ] "Shop This Look" on portfolio detail → correct products render
- [ ] "Seen In Projects" on shop product → correct projects render
- [ ] Related items cross-links work (relatedProjects, relatedProducts, relatedPosts)

FIX any gaps found. If Phase 1-2 followed Build → Wire → Verify,
this should be a SMALL task (< 1 day of fixes).

Target: 100% coverage across all routes and editors.
```

### Prompt 16: Programmatic SEO — Location Pages

```
Build programmatic SEO location pages for Julia Studio.

Route: /interior-design/[city] (and /zh/interior-design/[city])

Create a data file at /data/locations.ts:

const locations = [
  {
    slug: "new-york",
    city: "New York",
    cityCn: "纽约",
    state: "NY",
    region: "Manhattan, Brooklyn, Queens, Bronx, Staten Island",
    regionCn: "曼哈顿、布鲁克林、皇后区、布朗克斯、史坦顿岛",
    description: "Julia Studio brings 25 years of interior design excellence to New York City. From Manhattan penthouses to Brooklyn brownstones, we create timeless spaces tailored to the city's unique architecture and lifestyle.",
    descriptionCn: "Julia Studio 为纽约市带来25年的室内设计卓越经验。从曼哈顿顶层公寓到布鲁克林褐石建筑，我们打造适合这座城市独特建筑和生活方式的永恒空间。",
    serviceHighlights: ["Residential lofts & penthouses", "Commercial office spaces", "Gallery & exhibition design"],
    serviceHighlightsCn: ["住宅阁楼与顶层公寓", "商业办公空间", "画廊与展览设计"],
    nearbyLocations: ["brooklyn", "manhattan", "flushing", "long-island"]
  },
  {
    slug: "flushing",
    city: "Flushing",
    cityCn: "法拉盛",
    state: "NY",
    region: "Flushing, Bayside, Fresh Meadows, Whitestone",
    regionCn: "法拉盛、贝赛、新鲜草原、白石",
    description: "Serving the vibrant Flushing community with bilingual interior design services. Julia Studio understands the cultural preferences and lifestyle needs of our Chinese-American clients.",
    descriptionCn: "以双语室内设计服务服务充满活力的法拉盛社区。Julia Studio 了解华裔美国客户的文化偏好和生活方式需求。",
    serviceHighlights: ["Bilingual design consultations", "East-West fusion interiors", "Commercial spaces for Asian businesses"],
    serviceHighlightsCn: ["双语设计咨询", "东西融合室内设计", "亚裔企业商业空间"],
    nearbyLocations: ["new-york", "queens", "bayside", "long-island"]
  },
  // Continue for 13-18 more locations:
  // manhattan, brooklyn, queens, long-island, westchester, greenwich,
  // hoboken, jersey-city, stamford, great-neck, bayside,
  // los-angeles, san-francisco, boston (if Julia serves these)
];

PAGE TEMPLATE at /app/interior-design/[city]/page.tsx:

1. HERO
   - H1: "Interior Design in [City]" / "[City]室内设计"
   - Subline: unique description from data

2. INTRODUCTION (2-3 paragraphs)
   - Unique content about Julia Studio's service in this location
   - Mention local architecture, neighborhoods, design trends
   - NOT duplicate content from other location pages

3. SERVICES HIGHLIGHT
   - 3 service highlights specific to this location
   - Link to /services for full details

4. PORTFOLIO HIGHLIGHT
   - Show 3-4 portfolio projects (ideally matching this location)
   - If no location-specific projects, show featured projects

5. TESTIMONIAL
   - 1 testimonial (ideally from this area, or general)

6. SERVICE AREA MAP / NEIGHBORHOODS
   - List of neighborhoods/areas served from this location
   - Internal links to nearby location pages

7. CTA
   - "Ready to transform your [City] space?"
   - "Book Your Free Consultation →"

SEO per page:
- Title: "Interior Design in [City] | Julia Studio"
- TitleCn: "[City]室内设计 | Julia Studio"
- Description: unique, keyword-rich, under 160 chars
- Canonical: /interior-design/[city]
- hreflang: en + zh versions

generateStaticParams(): Generate all location slugs.
ISR: revalidate 86400 (24 hours).

Internal linking: each location page links to 3-4 nearby locations.
```

### Prompt 17: Programmatic SEO — Service Type + Style Pages

```
Build two more sets of programmatic SEO pages:

--- SERVICE TYPE PAGES ---
Route: /interior-design-for-[type] (and /zh/ variant)

Create /data/service-types.ts:

const serviceTypes = [
  {
    slug: "home",
    title: "Interior Design for Homes",
    titleCn: "住宅室内设计",
    description: "Transform your home into a sanctuary...",
    descriptionCn: "将您的家变成一处静谧之所...",
    projectCategory: "residential",
    keyServices: ["Full home redesign", "Kitchen & bath renovation", "Furniture selection"],
    keyServicesCn: ["全屋重新设计", "厨房和浴室翻新", "家具选购"]
  },
  {
    slug: "office",
    title: "Office Interior Design",
    titleCn: "办公室室内设计",
    // ...
  },
  // Also: restaurant, medical-practice, retail, exhibition, hotel, art-gallery
];

Page template similar to location pages but focused on service type:
1. Hero with H1: "[Service Type] Interior Design"
2. Description of Julia's expertise in this type
3. Portfolio projects filtered by matching category
4. Process adapted for this project type
5. FAQ items relevant to this type
6. CTA

--- DESIGN STYLE PAGES ---
Route: /design-styles/[style] (and /zh/ variant)

Create /data/design-styles.ts:

const designStyles = [
  {
    slug: "modern",
    title: "Modern Interior Design",
    titleCn: "现代室内设计",
    description: "Clean lines, open spaces, and contemporary materials...",
    descriptionCn: "简洁线条、开放空间和当代材料...",
    portfolioStyle: "modern",
    characteristics: ["Clean lines", "Neutral palettes", "Open floor plans", "Natural light"],
    characteristicsCn: ["简洁线条", "中性色调", "开放式平面", "自然光线"]
  },
  // Also: transitional, contemporary, minimalist, east-west-fusion, classic, bohemian, industrial
];

Page template:
1. Hero with H1 and style description
2. Characteristics of this design style (icon list)
3. Portfolio projects filtered by style
4. How Julia approaches this style
5. Related styles with cross-links
6. CTA

Both sets:
- generateStaticParams() for all slugs
- ISR: 86400s
- Unique title, description, canonical per page
- hreflang for en + zh
- Internal linking between related pages
- Bilingual content throughout
```

### Prompt 18: Schema.org Structured Data

```
Implement schema.org structured data across Julia Studio.

Create /lib/schema.ts with helper functions:

1. SITE-WIDE (in root layout):
   - LocalBusiness schema:
     name, description, address, phone, email, url, image,
     priceRange: "$$$", openingHours, sameAs (social links),
     areaServed, founder
   - Organization schema: name, url, logo, contactPoint

2. HOME PAGE:
   - WebSite schema with potentialAction (SearchAction)

3. SERVICES PAGE:
   - Service schema for each service type
   - Offer schema if pricing information is available

4. PORTFOLIO DETAIL (/portfolio/[slug]):
   - Article schema: headline, image, datePublished, author, description
   - BreadcrumbList: Home > Portfolio > [Project Name]

5. SHOP PRODUCT (/shop/[slug]):
   - Product schema: name, description, image, offers (price, currency, availability)
   - BreadcrumbList: Home > Shop > [Product Name]

6. JOURNAL POST (/journal/[slug]):
   - Article or BlogPosting schema
   - For video posts: VideoObject schema (name, description, thumbnailUrl, uploadDate, duration)
   - BreadcrumbList: Home > Journal > [Post Title]

7. FAQ PAGE:
   - FAQPage schema with all questions/answers

8. TESTIMONIALS PAGE:
   - AggregateRating (if ratings present)

9. LOCATION PAGES (/interior-design/[city]):
   - LocalBusiness with areaServed for specific city
   - Service schema
   - BreadcrumbList

Implementation:
- Use Next.js metadata API + generateMetadata()
- JSON-LD via <script type="application/ld+json"> in head
- Each page's generateMetadata() includes appropriate schema
- Validate with Google Rich Results Test

Verify:
- [ ] Rich Results Test passes for: Home, Portfolio detail, Product detail, Journal post, FAQ
- [ ] BreadcrumbList renders in search results preview
- [ ] Product schema shows price in search preview
- [ ] FAQ schema shows expandable Q&A in search preview
```

### Prompt 19: Sitemap, Robots, IndexNow, Canonical

```
Implement technical SEO infrastructure for Julia Studio.

1. DYNAMIC SITEMAP (/app/sitemap.ts):

Generate sitemap.xml including ALL URLs:

Static pages (each with en + zh variants):
- / and /zh/
- /portfolio and /zh/portfolio
- /services and /zh/services
- /shop and /zh/shop
- /about and /zh/about
- /journal and /zh/journal
- /contact and /zh/contact
- /collections and /zh/collections
- /press and /zh/press
- /faq and /zh/faq
- /testimonials and /zh/testimonials
- /privacy and /zh/privacy
- /terms and /zh/terms

Dynamic pages (en + zh):
- /portfolio/[slug] for each portfolio entry
- /shop/[slug] for each product
- /journal/[slug] for each journal post
- /collections/[slug] for each collection

Programmatic SEO (en + zh):
- /interior-design/[city] for each location
- /interior-design-for-[type] for each service type
- /design-styles/[style] for each design style

Set priority:
- Home: 1.0
- Portfolio, Services, Shop: 0.9
- Portfolio/Shop/Journal detail pages: 0.8
- About, Contact, Collections: 0.7
- Programmatic SEO pages: 0.6
- FAQ, Press, Testimonials, Privacy, Terms: 0.5

Set changefreq:
- Home, Journal: weekly
- Portfolio, Shop: weekly (new projects/products)
- Static pages: monthly
- Programmatic: monthly

2. ROBOTS.TXT (/app/robots.ts):

Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/
Sitemap: https://studio-julia.com/sitemap.xml

3. INDEXNOW INTEGRATION:

Create /lib/indexnow.ts:
- IndexNow API key file at /public/indexnow-key.txt
- Function: notifyIndexNow(urls: string[])
- Call after: new blog post published, new portfolio project, new product
- Targets: Bing, Yandex (Google doesn't support IndexNow but uses sitemap)

Add IndexNow trigger in admin save handlers for:
- Portfolio entries
- Journal posts
- Shop products

4. CANONICAL URLS:

Ensure every page has:
- <link rel="canonical" href="https://studio-julia.com/[path]">
- For zh pages: canonical points to the zh URL, not en
  e.g., /zh/portfolio canonical = https://studio-julia.com/zh/portfolio

5. HREFLANG TAGS:

Every page must have:
<link rel="alternate" hreflang="en" href="https://studio-julia.com/[path]">
<link rel="alternate" hreflang="zh" href="https://studio-julia.com/zh/[path]">
<link rel="alternate" hreflang="x-default" href="https://studio-julia.com/[path]">

Implement in root layout or per-page generateMetadata().

6. OG TAGS + TWITTER CARDS:

Every page:
- og:title (from page title)
- og:description (from page description)
- og:image (from page hero or default OG image)
- og:url (canonical URL)
- og:type: website (home), article (journal), product (shop)
- og:locale: en_US or zh_CN based on current locale
- twitter:card: summary_large_image
- twitter:site: @juliastudio

Verify:
- [ ] /sitemap.xml loads and lists ALL URLs (count: should be 80+ URLs)
- [ ] /robots.txt blocks /admin/ and /api/admin/
- [ ] Every page has correct canonical URL
- [ ] Every page has hreflang en + zh + x-default
- [ ] OG tags render correctly (test with Facebook Sharing Debugger)
- [ ] IndexNow key file accessible at /indexnow-key.txt
```

### Prompt 20: Performance Optimization

```
Performance optimization for Julia Studio.

Interior design sites are IMAGE-HEAVY. Performance is critical for both
user experience and SEO (Core Web Vitals).

1. IMAGE OPTIMIZATION (highest impact):

All images must use next/image with:
- format: WebP automatic conversion
- quality: 80 (good balance of quality vs size)
- sizes prop: appropriate for each usage context
- priority: true for hero images and above-fold content
- placeholder="blur" with blurDataURL for smooth loading
- loading="lazy" for all below-fold images (default in next/image)

Specific sizes configurations:
- Hero slideshow: sizes="100vw", priority={index === 0}
- Portfolio grid card: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
- Portfolio detail gallery (full): sizes="100vw"
- Portfolio detail gallery (half): sizes="(max-width: 768px) 100vw, 50vw"
- Shop product grid: sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
- Shop product detail main: sizes="(max-width: 768px) 100vw, 60vw"
- Journal grid card: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
- Team photos: sizes="(max-width: 768px) 100vw, 300px"

2. FONT OPTIMIZATION:

next/font config:
- Playfair Display: subsets ['latin'], display 'swap', preload true
  weights: [400, 500, 600, 700]
- DM Sans: subsets ['latin'], display 'swap', preload true
  weights: [300, 400, 500, 700]
- Noto Serif SC: subsets ['latin'], display 'swap', preload false
  (preload false for Chinese — only load when zh locale active)
  weights: [400, 500, 700]

3. CODE SPLITTING + DYNAMIC IMPORTS:

Dynamic import these components (loaded only when needed):
- Lightbox component (only on portfolio detail and shop detail)
- Video player / YouTube embed (only on journal video posts)
- Instagram feed embed (only on home page, lazy)
- Image slideshow (loaded after first image renders)
- Portfolio filter logic (loaded after initial grid renders)
- Newsletter form submission handler

Use next/dynamic with { loading: () => <Skeleton /> }

4. CACHING + ISR:

| Page Type | Revalidation |
|-----------|-------------|
| Home | 3600s (1 hour) |
| Portfolio hub | 3600s |
| Portfolio detail | 3600s |
| Services | 86400s (24 hours) |
| Shop hub | 3600s |
| Shop detail | 3600s |
| Journal hub | 1800s (30 min) |
| Journal post | 3600s |
| About | 86400s |
| Contact | 86400s |
| Collections | 86400s |
| Press | 86400s |
| FAQ | 86400s |
| Testimonials | 3600s |
| Location pages | 86400s |
| Style/type pages | 86400s |

5. CORE WEB VITALS TARGETS:

- LCP (Largest Contentful Paint): < 2.5s
  - Hero image must be priority loaded
  - Font preload prevents FOIT
- INP (Interaction to Next Paint): < 200ms
  - Dynamic imports prevent blocking
  - Filter transitions should be smooth
- CLS (Cumulative Layout Shift): < 0.1
  - All images must have explicit width/height or aspect-ratio
  - Font swap should not cause layout shift
  - No late-loading elements that push content

6. LIGHTHOUSE AUDIT:

Run Lighthouse on these pages and fix until ALL scores > 90:
- / (Home)
- /portfolio (Portfolio hub)
- /portfolio/[any-project] (Portfolio detail)
- /shop (Shop hub)
- /shop/[any-product] (Product detail)
- /journal (Journal hub)
- /journal/[any-post] (Journal post)
- /interior-design/new-york (Location page)

Record scores:
| Page | Performance | Accessibility | Best Practices | SEO |
|------|------------|---------------|----------------|-----|
| Home | | | | |
| Portfolio | | | | |
| ... | | | | |

Fix any score below 90.

Verify:
- [ ] No image loads without next/image wrapper
- [ ] Hero images use priority loading
- [ ] Chinese font only loads on zh pages
- [ ] Lighthouse > 90 on all tested pages
- [ ] No CLS > 0.1 on any page
- [ ] LCP < 2.5s on Home and Portfolio
```

### Prompt 21: Automated QA Checks

```
Create automated QA check scripts for Julia Studio.

Following BAAM Master Plan Section 21 (Minimum Automation Checks).

Create /scripts/qa/ directory with these scripts:

1. /scripts/qa/check-schema.ts
   - Load all content JSON files from Supabase
   - Validate each against TypeScript interfaces
   - Check: required fields present, correct types
   - Check: all bilingual fields have both en and Cn values
   - Report: file name, field, issue
   - Run: npm run qa:schema

2. /scripts/qa/check-routes.ts
   - Fetch every public route (static + dynamic)
   - For each, verify:
     - HTTP 200 response
     - HTML contains <h1> (not empty)
     - HTML contains <title> (not empty, not default)
     - HTML contains <link rel="canonical">
     - No server error in response
   - Also check zh variants (/zh/[path])
   - Report: route, status, issues
   - Run: npm run qa:routes

3. /scripts/qa/check-seo.ts
   - For each public route, verify:
     - <title> is unique (no two pages share same title)
     - <meta name="description"> exists and is unique
     - <link rel="canonical"> is correct (matches current URL)
     - hreflang tags present (en + zh + x-default)
     - og:title and og:description present
     - <h1> exists and is unique on page
   - Report: route, missing elements
   - Run: npm run qa:seo

4. /scripts/qa/check-links.ts
   - Crawl all internal links on all pages
   - Verify no 404 responses
   - Check external links (with timeout, non-blocking)
   - Report: source page, broken link, status
   - Run: npm run qa:links

5. /scripts/qa/check-content.ts
   - Load all content JSON files
   - Check for: "placeholder", "TODO", "lorem ipsum", "XXXXX",
     "TBD", "[replace]", empty required fields
   - Check all image URLs resolve (HEAD request)
   - Report: file, field, issue
   - Run: npm run qa:content

6. /scripts/qa/check-bilingual.ts
   - Load all content JSON files
   - For every field with a Cn variant, verify:
     - Cn field is not empty
     - Cn field is not identical to En field (likely not translated)
     - Cn field contains Chinese characters
   - Report: file, field, issue
   - Run: npm run qa:bilingual

Add to package.json scripts:
  "qa:schema": "ts-node scripts/qa/check-schema.ts",
  "qa:routes": "ts-node scripts/qa/check-routes.ts",
  "qa:seo": "ts-node scripts/qa/check-seo.ts",
  "qa:links": "ts-node scripts/qa/check-links.ts",
  "qa:content": "ts-node scripts/qa/check-content.ts",
  "qa:bilingual": "ts-node scripts/qa/check-bilingual.ts",
  "qa:all": "npm run qa:schema && npm run qa:routes && npm run qa:seo && npm run qa:links && npm run qa:content && npm run qa:bilingual"

Verify:
- [ ] npm run qa:all completes without fatal errors
- [ ] Known placeholder content is flagged (expected at this stage)
- [ ] Route check covers all static + dynamic + programmatic pages
- [ ] Bilingual check catches empty Cn fields
```

### Phase 3 Done-Gate Checklist

```
Before proceeding to Phase 4, verify ALL:

- [ ] Admin gap matrix: 100% coverage (every page editable, every editor working)
- [ ] Location pages built: 15+ cities with unique content
- [ ] Service type pages built: 6+ types
- [ ] Design style pages built: 8+ styles
- [ ] Schema.org validates on: Home, Portfolio detail, Product, Journal post, FAQ
- [ ] Sitemap includes ALL URLs (count verified, should be 80-120+ URLs)
- [ ] Robots.txt blocks admin routes
- [ ] IndexNow integration functional
- [ ] Canonical URLs correct on all pages
- [ ] hreflang tags present on all pages (en + zh + x-default)
- [ ] OG tags render correctly on all pages
- [ ] Lighthouse > 90 on all core pages
- [ ] LCP < 2.5s on Home and Portfolio
- [ ] Automated QA scripts created and runnable
- [ ] npm run qa:routes — all routes return 200
- [ ] npm run qa:seo — all pages have unique title + description
- [ ] Git tagged: v0.3-launch-ready
```

---

## Phase 4 — QA + Pre-Launch + Deploy (Week 5)

### Prompt 22: Full Acceptance Testing

```
Run comprehensive acceptance testing for Julia Studio before launch.

ADMIN ROUNDTRIP TEST — every page:

| Page | Form Edit | JSON Edit | Variant Switch | Layout Reorder | Media | CN Fields | PASS |
|------|-----------|-----------|----------------|----------------|-------|-----------|------|
| Home | | | | | | | |
| Portfolio Hub | | | | | | | |
| Services | | | | | | | |
| Shop Hub | | | | | | | |
| About | | | | | | | |
| Journal Hub | | | | | | | |
| Contact | | | | | | | |
| Collections Hub | | | | | | | |
| Press | | | | | | | |
| FAQ | | | | | | | |
| Testimonials | | | | | | | |

COLLECTION EDITOR TEST — every editor:

| Editor | List View | Create New | Edit Existing | Delete | Duplicate | CN Fields | PASS |
|--------|----------|------------|---------------|--------|-----------|-----------|------|
| Portfolio | | | | | | | |
| Shop Products | | | | | | | |
| Journal | | | | | | | |
| Collections | | | | | | | |
| Testimonials | | | | | | | |

DYNAMIC PAGE TEST — every detail template:

| Route | Renders | Admin Editable | Gallery/Images | Cross-links | CN | PASS |
|-------|---------|---------------|----------------|-------------|----| -----|
| /portfolio/[slug] | | | | Shop This Look | | |
| /shop/[slug] | | | | Seen In Projects | | |
| /journal/[slug] | | | | Related Posts | | |
| /collections/[slug] | | | | Projects + Products | | |

CROSS-SITE FEATURES:

- [ ] Header navigation: every link goes to correct page
- [ ] Footer links: all correct
- [ ] Language switcher: test on 5+ pages — EN↔ZH roundtrip works
- [ ] Mobile nav: hamburger opens/closes, all links work
- [ ] Newsletter form: submit → success state shown
- [ ] Consultation form: submit → email arrives → DB entry created
- [ ] Product inquiry: submit → email arrives with product info
- [ ] Portfolio filter: each category filters correctly
- [ ] Shop filter: each category + room filter works
- [ ] Journal filter: each category filters (including Video)
- [ ] Load More: works on Portfolio, Shop, Journal
- [ ] Lightbox: works on portfolio gallery and product images
- [ ] Video embed: plays on journal video posts
- [ ] 404 page: styled, has navigation
- [ ] Back button: works correctly after deep navigation

Run all automated checks:
- [ ] npm run qa:all — review and resolve all issues
```

### Prompt 23: Content Swap — Real Content

```
Replace all placeholder content with real Julia Studio content.

This is the most important step before launch. A site with placeholder
content destroys trust instantly.

CONTENT SWAP CHECKLIST:

Global:
- [ ] site.json: real phone number, email, address
- [ ] header.json: final nav labels confirmed
- [ ] footer.json: real social links (Instagram, Pinterest, WeChat QR)
- [ ] seo.json: final title templates and descriptions
- [ ] Favicon: Julia Studio favicon and apple-touch-icon

Portfolio:
- [ ] Replace placeholder projects with real Julia Studio projects
- [ ] Real project photography (professional quality, high resolution)
- [ ] Real project descriptions and details
- [ ] Real client testimonials per project (with permission)
- [ ] Minimum: 12 projects for launch, goal: 20+
- [ ] Cover images: compelling, variety of spaces

Shop:
- [ ] Real product listings with actual prices
- [ ] Real product photography (consistent style, clean backgrounds)
- [ ] Real specifications (dimensions, materials, finish)
- [ ] Minimum: 20 products for launch

Journal:
- [ ] Real articles (6-10 for launch)
- [ ] Real video content (2-3 for launch)
- [ ] Professional cover images
- [ ] Proofread all content (English and Chinese)

About:
- [ ] Real Julia portrait (professional headshot)
- [ ] Real team photos
- [ ] Accurate biography and studio history
- [ ] Real timeline milestones
- [ ] Real awards and press logos (with permission)

Testimonials:
- [ ] Real client testimonials (minimum 8)
- [ ] Real names and titles (with permission) or "Homeowner, [City]"
- [ ] Mix of categories (residential, commercial, exhibition)

Chinese Content:
- [ ] All Chinese text reviewed by native speaker
- [ ] Cultural appropriateness verified
- [ ] No machine-translation artifacts
- [ ] WeChat QR code real and functional

Media:
- [ ] All placeholder Unsplash images replaced with real photography
- [ ] Image quality consistent across site
- [ ] All images properly compressed (< 500KB for grid, < 1MB for hero)
- [ ] No broken image links

Legal:
- [ ] Privacy Policy page created with real content
- [ ] Terms of Service page created with real content

Run qa:content after swap:
- [ ] npm run qa:content — 0 placeholder strings remaining
- [ ] npm run qa:bilingual — all Cn fields populated with real Chinese
```

### Prompt 24: Production Deploy

```
Deploy Julia Studio to production.

1. CREATE VERCEL PROJECT:
   - New Vercel project: "julia-studio"
   - Connect to Git repository
   - Framework: Next.js (auto-detected)

2. ENVIRONMENT VARIABLES (set in Vercel):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET
   - RESEND_API_KEY
   - UNSPLASH_ACCESS_KEY
   - PEXELS_API_KEY
   - NEXT_PUBLIC_SITE_URL=https://studio-julia.com
   - NEXT_PUBLIC_DEFAULT_SITE_ID=julia-studio

3. DEPLOY AND VERIFY ON PREVIEW URL:
   - Deploy to Vercel
   - Open preview URL (*.vercel.app)
   - Verify: all pages load, images render, forms work
   - Verify: admin login works on preview
   - Run Lighthouse on preview URL

4. CONFIGURE CUSTOM DOMAIN:
   - In Vercel: Settings > Domains > Add "studio-julia.com"
   - Add DNS records at domain registrar:
     A record: 76.76.21.21
     CNAME: cname.vercel-dns.com (for www)
   - Add redirect: www.studio-julia.com → studio-julia.com
   - SSL: automatic via Vercel (Let's Encrypt)
   - Wait for DNS propagation (up to 48 hours)

5. VERIFY PRODUCTION:
   - [ ] https://studio-julia.com loads correctly
   - [ ] https://www.studio-julia.com redirects to studio-julia.com
   - [ ] SSL certificate active (green lock)
   - [ ] All pages render on production domain
   - [ ] Admin works on production
   - [ ] Forms submit on production
   - [ ] Images load from Supabase storage
   - [ ] /zh/ pages work with Chinese content
   - [ ] /sitemap.xml accessible
   - [ ] /robots.txt accessible

6. DOMAIN ROUTING VERIFICATION:
   - Middleware routes studio-julia.com → julia-studio site_id
   - Content loads from correct Supabase project
   - No cross-site data leakage

7. POST-DEPLOY LIGHTHOUSE:
   Run Lighthouse on production:
   | Page | Perf | A11y | BP | SEO |
   |------|------|------|----|-----|
   | Home | | | | |
   | Portfolio | | | | |
   | Shop | | | | |
   | Journal | | | | |

   All scores must be > 90.
```

### Prompt 25: Search Engine Submission + Go-Live

```
Submit Julia Studio to search engines and finalize go-live.

1. GOOGLE SEARCH CONSOLE:
   - Verify domain ownership (DNS TXT record or HTML file)
   - Submit sitemap: https://studio-julia.com/sitemap.xml
   - Request indexing for key pages:
     - / (Home)
     - /portfolio
     - /services
     - /shop
     - /about
     - /journal
   - Check: no crawl errors, sitemap accepted, pages discovered

2. BING WEBMASTER TOOLS:
   - Submit sitemap
   - Verify IndexNow key
   - Trigger IndexNow for all URLs

3. GOOGLE BUSINESS PROFILE (if applicable):
   - Create or claim business profile for "Julia Studio"
   - Add: address, phone, hours, website URL, photos
   - Category: "Interior Designer"
   - Add bilingual description

4. SOCIAL META VERIFICATION:
   - Test with Facebook Sharing Debugger: enter studio-julia.com
   - Test with Twitter Card Validator (if applicable)
   - Verify: correct title, description, image for Home, Portfolio, Shop

5. ANALYTICS SETUP:
   - Enable Vercel Analytics OR
   - Set up Google Analytics 4 (if preferred)
   - Verify: page views tracked, no blocked scripts
   - Set up conversion tracking for consultation form submissions

6. CONTENT EXPORT + BACKUP:
   - Export full site content via admin Import/Export
   - Save JSON export as release snapshot
   - Commit to repository
   - Tag: v1.0-production

7. GO-LIVE CHECKLIST:
   - [ ] Production URL live with SSL
   - [ ] All pages render correctly
   - [ ] All forms submit and send notifications
   - [ ] Admin works on production
   - [ ] Google Search Console verified, sitemap submitted
   - [ ] Bing submitted
   - [ ] Analytics tracking active
   - [ ] Content backup exported
   - [ ] Git tagged: v1.0-production
   - [ ] Share URL with Julia for final review

LAUNCH COMPLETE. 🎉
Proceed to Phase 5 (12-Month Growth Plan) per JULIA_STUDIO_COMPLETE_PLAN.md.
```

### Phase 4 Done-Gate — FINAL LAUNCH GATE

```
JULIA STUDIO LAUNCH GATE — All must pass:

SITE:
- [ ] https://studio-julia.com live, SSL active
- [ ] All pages render in English and Chinese
- [ ] All forms functional (consultation, newsletter, product inquiry)
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] No broken links (npm run qa:links)
- [ ] No broken images
- [ ] No placeholder content (npm run qa:content)
- [ ] 404 page styled

ADMIN:
- [ ] Admin login works on production
- [ ] All 5 collection editors functional
- [ ] Content Editor shows pages + globals only
- [ ] Form/JSON/Variant roundtrip verified on 3+ pages

SEO:
- [ ] Sitemap submitted to Google and Bing
- [ ] All pages have unique title, description, canonical
- [ ] hreflang tags on all pages
- [ ] Schema.org validates on key pages
- [ ] Lighthouse > 90 on Home, Portfolio, Shop

PERFORMANCE:
- [ ] LCP < 2.5s on Home
- [ ] No CLS > 0.1 on any page
- [ ] Images optimized (WebP, appropriate sizes)

DATA:
- [ ] Content backup exported
- [ ] Git tagged v1.0-production
- [ ] Rollback plan confirmed (Vercel deploy history)

SIGNED OFF: _______ Date: _______
```
