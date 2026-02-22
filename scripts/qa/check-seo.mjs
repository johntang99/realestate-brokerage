#!/usr/bin/env node
/**
 * QA: SEO check — title, description, canonical, hreflang on key pages
 * Usage: node scripts/qa/check-seo.mjs [base_url]
 */

const BASE = process.argv[2] || 'http://localhost:3040';

const PAGES = [
  '/en', '/en/portfolio', '/en/services', '/en/shop', '/en/about',
  '/en/journal', '/en/contact', '/en/faq',
  '/zh', '/zh/portfolio',
  '/en/interior-design/new-york',
  '/en/interior-design-for/home',
  '/en/design-styles/modern',
];

let passed = 0;
let failed = 0;
const issues = [];

async function checkPage(path) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();

  const checks = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim();
  if (!title || title === 'Julia Studio — 25 Years of Timeless Interior Design' || title.length < 5) {
    checks.push('  ⚠ title missing or default');
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
                    html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
  if (!descMatch?.[1]) checks.push('  ⚠ meta description missing');

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  if (!canonicalMatch?.[1]) checks.push('  ⚠ canonical missing');

  // hreflang
  const hreflangCount = (html.match(/hreflang/g) || []).length;
  if (hreflangCount < 2) checks.push('  ⚠ hreflang missing');

  const status = checks.length ? '⚠' : '✓';
  console.log(`  ${status} ${path} — title: "${title?.slice(0, 50) || '??'}"`);
  if (checks.length) {
    checks.forEach(c => console.log(c));
    failed++;
    issues.push({ path, checks });
  } else {
    passed++;
  }
}

async function main() {
  console.log(`\n🔍 SEO check — ${BASE}\n`);
  for (const page of PAGES) {
    try { await checkPage(page); }
    catch (err) { console.log(`  ✗ ${page} ERROR: ${err.message}`); failed++; }
  }
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total: ${PAGES.length} | ✓ ${passed} | ⚠ ${failed}`);
  if (!issues.length) console.log('  ✅ All SEO checks passed\n');
  else console.log(`  ${failed} pages need attention\n`);
}

main();
