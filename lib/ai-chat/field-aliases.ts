import { getPathValue } from './path-utils';

function normalizePathInput(rawPath: string) {
  return rawPath
    .trim()
    .replace(/\s*>\s*/g, '.')
    .replace(/\s+/g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/^\./, '')
    .replace(/\.$/, '');
}

function normalizeContentPrefix(path: string) {
  if (!path.startsWith('content.')) return path;
  return path.replace(/^content\./, '');
}

function canonicalizeSegment(segment: string, parent: string | null) {
  const value = segment.trim();
  const lower = value.toLowerCase();

  if (['subtitle', 'subheadline', 'subheading'].includes(lower)) return 'subline';
  if (['desc', 'blurb', 'copy'].includes(lower)) return 'description';
  if (['imageurl', 'photo', 'picture', 'photo_url', 'image_url'].includes(lower)) return 'image';
  if (['alt', 'alttext', 'alt_text'].includes(lower)) return 'imageAlt';
  if (['buttontext', 'ctatext', 'button_label'].includes(lower)) return 'ctaLabel';
  if (['buttonlink', 'ctalink', 'button_href'].includes(lower)) return 'ctaHref';

  // Keep SEO title intact; map non-SEO title/heading to headline.
  if (['title', 'heading', 'header'].includes(lower)) {
    if (parent === 'seo') return value;
    return 'headline';
  }

  return value;
}

function canonicalizePath(path: string) {
  const segments = path.split('.');
  return segments
    .map((segment, index) => {
      const parent = index > 0 ? segments[index - 1].toLowerCase() : null;
      return canonicalizeSegment(segment, parent);
    })
    .join('.');
}

export function resolveFriendlyFieldPath(root: unknown, rawPath: string) {
  const input = normalizePathInput(rawPath);
  if (!input) return input;

  const withoutContent = normalizeContentPrefix(input);
  const exact = getPathValue(root, withoutContent);
  if (exact !== undefined) return withoutContent;

  const canonical = canonicalizePath(withoutContent);
  const canonicalValue = getPathValue(root, canonical);
  if (canonicalValue !== undefined) return canonical;

  // If neither exists, still return canonicalized path to avoid creating
  // common alias fields like "title" where "headline" is intended.
  return canonical;
}
