import { getPathValue, setPathValue } from '@/lib/ai-chat/path-utils';
import type { ExecutedToolResult } from './shared';
import { listByPrefix, readJson, writeJson, type ToolContext } from './context';

function pagePath(page: string) {
  const slug = page.replace(/^pages\//, '').replace(/\.json$/i, '').trim().toLowerCase();
  if (!slug) throw new Error('Invalid page slug');
  return `pages/${slug}.json`;
}

function normalizePageFieldPath(current: unknown, rawPath: string) {
  const path = rawPath.trim();
  if (!path.startsWith('content.')) return path;
  const stripped = path.replace(/^content\./, '');
  const strippedExists = getPathValue(current, stripped) !== undefined;
  const contentExists = getPathValue(current, path) !== undefined;
  if (strippedExists || !contentExists) {
    return stripped;
  }
  return path;
}

export async function listPages(ctx: ToolContext): Promise<ExecutedToolResult> {
  const entries = await listByPrefix(ctx, 'pages/');
  const pages = entries
    .filter((entry) => entry.path.endsWith('.json'))
    .map((entry) => entry.path.replace(/^pages\//, '').replace(/\.json$/i, ''))
    .sort((a, b) => a.localeCompare(b));
  const details = pages.length ? pages.join(', ') : 'none';
  return {
    ok: true,
    tool: 'list_pages',
    summary: `Found ${pages.length} pages: ${details}`,
    data: { pages },
    preview: { pages },
  };
}

export async function readPage(ctx: ToolContext, page: string): Promise<ExecutedToolResult> {
  const filePath = pagePath(page);
  const content = await readJson(ctx, filePath);
  return { ok: true, tool: 'read_page', summary: `Loaded ${filePath}`, data: { page, content } };
}

export async function updatePageField(
  ctx: ToolContext,
  page: string,
  fieldPath: string,
  newValue: unknown
): Promise<ExecutedToolResult> {
  const filePath = pagePath(page);
  const current = await readJson(ctx, filePath);
  const normalizedFieldPath = normalizePageFieldPath(current, fieldPath);
  const before =
    typeof current === 'object' && current
      ? JSON.parse(JSON.stringify(current))
      : current;
  const next = setPathValue(current, normalizedFieldPath, newValue);
  await writeJson(ctx, filePath, next);
  return {
    ok: true,
    tool: 'update_page_field',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${filePath}:${normalizedFieldPath}`,
    changedPaths: [filePath],
    preview: { path: filePath, fieldPath: normalizedFieldPath, before, after: next },
  };
}

export async function updatePageFieldsBatch(
  ctx: ToolContext,
  page: string,
  updates: Array<{ field_path: string; new_value: unknown }>
): Promise<ExecutedToolResult> {
  const filePath = pagePath(page);
  let next = await readJson(ctx, filePath);
  const before =
    typeof next === 'object' && next ? JSON.parse(JSON.stringify(next)) : next;
  for (const item of updates) {
    const normalizedFieldPath = normalizePageFieldPath(next, item.field_path);
    next = setPathValue(next, normalizedFieldPath, item.new_value);
  }
  await writeJson(ctx, filePath, next);
  return {
    ok: true,
    tool: 'update_page_fields_batch',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${updates.length} fields in ${filePath}`,
    changedPaths: [filePath],
    preview: { path: filePath, updates, before, after: next },
  };
}
