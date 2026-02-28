import { setPathValue } from '@/lib/ai-chat/path-utils';
import type { ExecutedToolResult } from './shared';
import { readJson, writeJson, type ToolContext } from './context';

export async function getSiteSettings(ctx: ToolContext): Promise<ExecutedToolResult> {
  const [site, header, footer, seo, theme] = await Promise.all([
    readJson(ctx, 'site.json'),
    readJson(ctx, 'header.json'),
    readJson(ctx, 'footer.json'),
    readJson(ctx, 'seo.json'),
    readJson(ctx, 'theme.json'),
  ]);
  return { ok: true, tool: 'get_site_settings', summary: 'Loaded settings', data: { site, header, footer, seo, theme } };
}

export async function updateBusinessInfo(
  ctx: ToolContext,
  field: string,
  value: unknown
): Promise<ExecutedToolResult> {
  const key = field.trim();
  if (!key) throw new Error('field is required');
  const addressKeys = ['street', 'city', 'state', 'zip', 'full', 'lat', 'lng', 'mapsUrl', 'mapsEmbedUrl'];
  const target = key.includes('.') ? key : addressKeys.includes(key) ? `address.${key}` : key;
  const next = setPathValue(await readJson(ctx, 'site.json'), target, value);
  await writeJson(ctx, 'site.json', next);
  return {
    ok: true,
    tool: 'update_business_info',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated site.json:${target}`,
    changedPaths: ['site.json'],
    preview: { path: 'site.json', field: target, value },
  };
}

export async function updateBusinessHours(
  ctx: ToolContext,
  hours: Array<{ key: string; value: string }>
): Promise<ExecutedToolResult> {
  let next = await readJson(ctx, 'site.json');
  for (const row of hours) {
    next = setPathValue(next, `officeHours.${row.key}`, row.value);
  }
  await writeJson(ctx, 'site.json', next);
  return {
    ok: true,
    tool: 'update_business_hours',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${hours.length} business hours`,
    changedPaths: ['site.json'],
    preview: { path: 'site.json', hours },
  };
}

export async function updateSeo(
  ctx: ToolContext,
  page: string,
  title?: string,
  description?: string,
  keywords?: string
): Promise<ExecutedToolResult> {
  if (page === 'global') {
    let next = await readJson(ctx, 'seo.json');
    if (typeof title === 'string') next = setPathValue(next, 'defaultTitle', title);
    if (typeof description === 'string') next = setPathValue(next, 'defaultDescription', description);
    if (typeof keywords === 'string') next = setPathValue(next, 'keywords', keywords);
    await writeJson(ctx, 'seo.json', next);
    return {
      ok: true,
      tool: 'update_seo',
      summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated global SEO`,
      changedPaths: ['seo.json'],
      preview: { path: 'seo.json', title, description, keywords },
    };
  }

  const slug = page.replace(/^pages\//, '').replace(/\.json$/i, '').trim().toLowerCase();
  if (!slug) throw new Error('page is required');
  const filePath = `pages/${slug}.json`;
  let next = await readJson(ctx, filePath);
  if (typeof title === 'string') next = setPathValue(next, 'seo.title', title);
  if (typeof description === 'string') next = setPathValue(next, 'seo.description', description);
  if (typeof keywords === 'string') next = setPathValue(next, 'seo.keywords', keywords);
  await writeJson(ctx, filePath, next);
  return {
    ok: true,
    tool: 'update_seo',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated page SEO in ${filePath}`,
    changedPaths: [filePath],
    preview: { path: filePath, title, description, keywords },
  };
}

export async function updateSocialLinks(
  ctx: ToolContext,
  platform: string,
  url: string
): Promise<ExecutedToolResult> {
  const key = platform.trim();
  if (!key) throw new Error('platform is required');
  const next = setPathValue(await readJson(ctx, 'site.json'), `social.${key}`, url);
  await writeJson(ctx, 'site.json', next);
  return {
    ok: true,
    tool: 'update_social_links',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated social.${key}`,
    changedPaths: ['site.json'],
    preview: { path: 'site.json', field: `social.${key}`, value: url },
  };
}
