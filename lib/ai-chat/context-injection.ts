import { listByPrefix, readJson, type ToolContext } from './executors/context';
import { getPreferencesPromptBlock } from './preferences';

type PageHint = {
  slug: string;
  topLevelKeys: string[];
  heroKeys: string[];
  seoKeys: string[];
};

function extractExplicitPageSlug(input: string) {
  const direct = input.match(/pages\/([a-z0-9-]+)\.json/i);
  if (direct?.[1]) return direct[1].toLowerCase();
  const pageNamed = input.match(/\bpage\s+([a-z0-9-]+)\b/i);
  if (pageNamed?.[1]) return pageNamed[1].toLowerCase();
  const namedPage = input.match(/\b([a-z0-9-]+)\s+page\b/i);
  if (namedPage?.[1]) return namedPage[1].toLowerCase();
  return null;
}

function keywordMatch(slug: string, input: string) {
  const slugWord = slug.toLowerCase();
  const spaced = slugWord.replace(/-/g, ' ');
  const text = input.toLowerCase();
  return (
    text.includes(`page ${slugWord}`) ||
    text.includes(`${slugWord} page`) ||
    text.includes(`page ${spaced}`) ||
    text.includes(`${spaced} page`)
  );
}

async function detectPageHint(ctx: ToolContext, userMessage: string): Promise<PageHint | null> {
  const entries = await listByPrefix(ctx, 'pages/');
  const slugs = entries
    .map((entry) => entry.path.replace(/^pages\//, '').replace(/\.json$/i, ''))
    .filter(Boolean);
  if (!slugs.length) return null;

  const explicit = extractExplicitPageSlug(userMessage);
  const slug =
    (explicit && slugs.includes(explicit) ? explicit : null) ||
    slugs.find((candidate) => keywordMatch(candidate, userMessage));

  if (!slug) return null;
  const page = (await readJson(ctx, `pages/${slug}.json`)) as Record<string, unknown>;
  const topLevelKeys = Object.keys(page || {}).slice(0, 25);
  const heroKeys =
    page?.hero && typeof page.hero === 'object'
      ? Object.keys(page.hero as Record<string, unknown>).slice(0, 20)
      : [];
  const seoKeys =
    page?.seo && typeof page.seo === 'object'
      ? Object.keys(page.seo as Record<string, unknown>).slice(0, 20)
      : [];
  return { slug, topLevelKeys, heroKeys, seoKeys };
}

export function isWriteIntent(input: string) {
  return /\b(update|change|set|replace|edit|modify|add|remove|delete|create|rename)\b/i.test(
    input
  );
}

export async function buildContextBlock(ctx: ToolContext, userMessage: string) {
  const lines: string[] = [];
  const hint = await detectPageHint(ctx, userMessage);
  if (hint) {
    lines.push(`Detected target page: ${hint.slug}`);
    lines.push(`Top-level keys: ${hint.topLevelKeys.join(', ') || '(none)'}`);
    if (hint.heroKeys.length) {
      lines.push(`hero keys: ${hint.heroKeys.join(', ')}`);
    }
    if (hint.seoKeys.length) {
      lines.push(`seo keys: ${hint.seoKeys.join(', ')}`);
    }
  }

  lines.push(
    'Alias hints: title/heading/header -> headline (except seo.title), subtitle/subheadline/subheading -> subline.'
  );
  lines.push('Use exact existing keys when available; do not invent new nested wrappers.');
  const prefBlock = await getPreferencesPromptBlock(ctx.siteId, ctx.locale);
  if (prefBlock) {
    lines.push(prefBlock);
  }

  return lines.join('\n');
}
