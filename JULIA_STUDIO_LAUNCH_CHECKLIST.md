# Julia Studio — Phase 4 Launch Checklist
> Generated: February 2026
> Run `npm run qa:all` to auto-check what you can before launch.

---

## 1 — Content Swap (Before Deploy)

These items require real content from Julia before launch:

### Critical — Site won't look professional without these
- [ ] `site.json` → real phone number, email, studio address
- [ ] Hero images → real project photography (replace Unsplash placeholders)
- [ ] About page → real Julia portrait + team photos
- [ ] Portfolio projects → real cover images + gallery photos (min 12 projects)

### Important
- [ ] Testimonials → real client quotes (min 8, ideally 20+)
- [ ] Journal articles → 6-10 real articles (proofread EN + ZH)
- [ ] Video post → real YouTube/Vimeo embed URL (replace PLACEHOLDER)
- [ ] Awards & press → real logos and feature links
- [ ] WeChat QR image → upload real QR code to Supabase Media

### Shop
- [ ] Product photos → real product photography
- [ ] Prices → confirm real pricing
- [ ] Lead times → confirm accurate

### Legal
- [ ] Privacy Policy → review and update with real business details
- [ ] Terms of Service → review and update

---

## 2 — Vercel Deploy Steps

### A. Create Vercel Project
1. Go to vercel.com → New Project
2. Import your Git repository (`design/homedecor`)
3. Framework: Next.js (auto-detected)
4. Root directory: `design/homedecor`

### B. Set Environment Variables in Vercel Dashboard
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key from Supabase dashboard → Settings → API]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key from Supabase dashboard → Settings → API]
JWT_SECRET=[run: openssl rand -hex 32]
SUPABASE_STORAGE_BUCKET=media
NEXT_PUBLIC_SITE_URL=https://studio-julia.com
NEXT_PUBLIC_DEFAULT_SITE_ID=julia-studio
RESEND_API_KEY=[from resend.com dashboard]
RESEND_FROM=No-Reply<no-reply@yourdomain.com>
CONTACT_FALLBACK_TO=hello@studio-julia.com
UNSPLASH_ACCESS_KEY=[from unsplash.com/oauth/applications]
PEXELS_API_KEY=[from pexels.com/api]
```

### C. Domain Setup
1. Vercel Dashboard → Settings → Domains → Add `studio-julia.com`
2. Add DNS records at registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
3. Add redirect: `www.studio-julia.com` → `studio-julia.com`
4. SSL: automatic (Let's Encrypt via Vercel)
5. Wait 24-48 hours for DNS propagation

---

## 3 — Post-Deploy Verification

Run after deploy to preview URL (*.vercel.app):

```bash
node scripts/qa/check-routes.mjs https://your-preview.vercel.app
node scripts/qa/check-seo.mjs https://your-preview.vercel.app
```

Manual checks:
- [ ] `https://your-preview.vercel.app/en` loads ✓
- [ ] Admin login at `/admin` works ✓
- [ ] Contact form submission → email arrives ✓
- [ ] `/sitemap.xml` accessible ✓
- [ ] `/robots.txt` blocks `/admin/` ✓
- [ ] Chinese pages `/zh/` load correctly ✓

---

## 4 — Search Engine Submission

### Google Search Console
1. Go to search.google.com/search-console
2. Add property: `studio-julia.com`
3. Verify ownership (DNS TXT record method recommended)
4. Submit sitemap: `https://studio-julia.com/sitemap.xml`
5. Request indexing for: `/`, `/en/portfolio`, `/en/services`, `/en/shop`, `/en/about`

### Bing Webmaster Tools
1. Go to bing.com/webmasters
2. Add site + verify
3. Submit sitemap
4. Enable IndexNow (optional, for faster crawling)

### Google Business Profile (if Julia has a physical studio)
1. business.google.com → Create Profile
2. Category: "Interior Designer"
3. Add: address, phone, hours, website, project photos
4. Add bilingual description (EN + ZH)

---

## 5 — Analytics Setup

### Option A: Vercel Analytics (simplest)
1. Vercel Dashboard → Analytics → Enable
2. No code changes needed

### Option B: Google Analytics 4
1. Create GA4 property at analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `app/layout.tsx`:
```tsx
<Script src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} />
```

---

## 6 — Content Backup

```bash
# Export all content from Admin → Import/Export → Export JSON
# Or manually via curl:
curl -s "https://neyofqtnquqygiusnfdu.supabase.co/rest/v1/content_entries?site_id=eq.julia-studio" \
  -H "apikey: [SERVICE_KEY]" -H "Authorization: Bearer [SERVICE_KEY]" \
  > backup-$(date +%Y%m%d).json
```

---

## 7 — QA Results (Pre-Deploy)

| Check | Status | Notes |
|-------|--------|-------|
| `npm run type-check` | ✅ 0 errors | |
| `npm run qa:routes` | ✅ 40/40 pass | |
| `npm run qa:bilingual` | ✅ 309 Cn fields | |
| `npm run qa:content` | ⚠ 3 placeholders | Replace phone/address in site.json |
| Admin: 45 EN + 33 ZH entries | ✅ | |
| Schema.org: LocalBusiness, Org, WebSite | ✅ | |
| Sitemap: 100+ URLs with hreflang | ✅ | |
| robots.txt | ✅ | |
| 404 page | ✅ | |
| Privacy + Terms pages | ✅ | |

---

## 8 — Final Launch Gate

- [ ] All content placeholder strings replaced
- [ ] Real photography loaded in all sections
- [ ] `npm run qa:all` → 0 errors
- [ ] Admin login verified on production
- [ ] Contact form → email confirmed working
- [ ] Sitemap submitted to Google + Bing
- [ ] `git tag v1.0-production`

**Once all boxes checked: LAUNCH ✅**
