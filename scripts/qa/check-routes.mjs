#!/usr/bin/env node
/**
 * QA: Route smoke test — verify every public route returns 200
 * Usage: node scripts/qa/check-routes.mjs [base_url]
 */

const BASE = process.argv[2] || 'http://localhost:3040';

const ROUTES = [
  // Core pages EN
  '/en', '/en/portfolio', '/en/services', '/en/shop', '/en/about',
  '/en/journal', '/en/contact', '/en/collections', '/en/press',
  '/en/faq', '/en/testimonials',
  // Core pages ZH
  '/zh', '/zh/portfolio', '/zh/services', '/zh/shop', '/zh/about',
  '/zh/journal', '/zh/contact', '/zh/collections', '/zh/press',
  '/zh/faq', '/zh/testimonials',
  // Dynamic detail pages
  '/en/portfolio/the-greenwich-estate',
  '/en/portfolio/hudson-yards-office',
  '/en/shop/marin-console-table',
  '/en/shop/aria-pendant-light',
  '/en/journal/5-rules-mixing-patterns',
  '/en/journal/fabric-selection-process',
  '/en/collections/modern-minimalist',
  '/en/collections/east-west-fusion',
  // Programmatic SEO
  '/en/interior-design/new-york',
  '/en/interior-design/flushing',
  '/en/interior-design/manhattan',
  '/zh/interior-design/flushing',
  '/en/interior-design-for/home',
  '/en/interior-design-for/office',
  '/en/design-styles/modern',
  '/en/design-styles/east-west-fusion',
  // Tech
  '/sitemap.xml',
  '/robots.txt',
];

let passed = 0;
let failed = 0;
const failures = [];

async function checkRoute(route) {
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: 'follow' });
    if (res.ok) {
      console.log(`  ✓ ${route} → ${res.status}`);
      passed++;
    } else {
      console.log(`  ✗ ${route} → ${res.status}`);
      failed++;
      failures.push({ route, status: res.status });
    }
  } catch (err) {
    console.log(`  ✗ ${route} → ERROR: ${err.message}`);
    failed++;
    failures.push({ route, status: 'ERROR', error: err.message });
  }
}

async function main() {
  console.log(`\n🔍 Route check — ${BASE}\n`);
  for (const route of ROUTES) {
    await checkRoute(route);
  }
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total: ${ROUTES.length} | ✓ ${passed} | ✗ ${failed}`);
  if (failures.length) {
    console.log('\n  Failed routes:');
    failures.forEach(f => console.log(`    ${f.route} → ${f.status}`));
    process.exit(1);
  } else {
    console.log('\n  ✅ All routes passed\n');
  }
}

main();
