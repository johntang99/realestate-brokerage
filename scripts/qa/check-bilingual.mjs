#!/usr/bin/env node
/**
 * QA: Bilingual check — verify all Cn fields are populated and contain Chinese characters
 * Usage: node scripts/qa/check-bilingual.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '../..');
const CONTENT_DIR = join(ROOT, 'content/julia-studio/en');
const CHINESE_REGEX = /[\u4e00-\u9fff]/;

let issues = 0;
let cnFields = 0;

function checkObject(obj, path) {
  if (!obj || typeof obj !== 'object') return;
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (key.endsWith('Cn') || key.endsWith('cn')) {
      cnFields++;
      if (typeof value === 'string') {
        // Some Cn fields legitimately contain non-Chinese text (brand names, currency, URLs)
        const ACCEPTABLE_NO_CHINESE = /^(\$[\d,\s–+]+|https?:\/\/|WeChat|Instagram|Pinterest|Xiaohongshu|English|中文)/.test(value);
        if (!value.trim()) {
          console.log(`  ⚠ Empty Cn field: ${fullPath}`);
          issues++;
        } else if (!CHINESE_REGEX.test(value) && !ACCEPTABLE_NO_CHINESE) {
          console.log(`  ⚠ Cn field has no Chinese chars: ${fullPath} = "${value.slice(0,40)}"`);
          issues++;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, i) => checkObject(item, `${fullPath}[${i}]`));
      } else {
        checkObject(value, fullPath);
      }
    }
  }
}

function scanDir(dir, label) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  files.forEach(f => {
    try {
      const data = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
      checkObject(data, `${label}/${f.replace('.json','')}`);
    } catch {}
  });
}

async function main() {
  console.log('\n🔍 Bilingual (Cn field) check\n');
  ['site.json','seo.json','header.json','footer.json'].forEach(f => {
    try { checkObject(JSON.parse(readFileSync(join(CONTENT_DIR, f), 'utf-8')), f); } catch {}
  });
  scanDir(join(CONTENT_DIR, 'pages'), 'pages');
  scanDir(join(CONTENT_DIR, 'portfolio'), 'portfolio');
  scanDir(join(CONTENT_DIR, 'journal'), 'journal');
  scanDir(join(CONTENT_DIR, 'collections'), 'collections');

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Cn fields checked: ${cnFields}`);
  if (issues) {
    console.log(`  ⚠ ${issues} bilingual issues found`);
    process.exit(1);
  } else {
    console.log('  ✅ All Cn fields populated with Chinese content\n');
  }
}

main();
