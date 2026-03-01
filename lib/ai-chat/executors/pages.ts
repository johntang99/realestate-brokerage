import { setPathValue } from '@/lib/ai-chat/path-utils';
import { resolveFriendlyFieldPath } from '@/lib/ai-chat/field-aliases';
import { getVariantOptions } from '@/lib/ai-chat/variant-options';
import type { ExecutedToolResult } from './shared';
import { listByPrefix, readJson, writeJson, type ToolContext } from './context';

function pagePath(page: string) {
  const slug = page.replace(/^pages\//, '').replace(/\.json$/i, '').trim().toLowerCase();
  if (!slug) throw new Error('Invalid page slug');
  return `pages/${slug}.json`;
}

function normalizePageFieldPath(current: unknown, rawPath: string) {
  return resolveFriendlyFieldPath(current, rawPath);
}

function flattenFieldPaths(input: unknown, parent = ''): string[] {
  if (input == null) return parent ? [parent] : [];
  if (Array.isArray(input)) {
    if (!input.length) return parent ? [parent] : [];
    const paths = new Set<string>();
    if (parent) paths.add(parent);
    const first = input[0];
    if (first && typeof first === 'object') {
      for (const child of flattenFieldPaths(first, parent ? `${parent}[]` : '[]')) {
        paths.add(child);
      }
    }
    return Array.from(paths);
  }
  if (typeof input !== 'object') return parent ? [parent] : [];
  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);
  if (!keys.length) return parent ? [parent] : [];
  const paths: string[] = [];
  for (const key of keys) {
    const next = parent ? `${parent}.${key}` : key;
    const value = record[key];
    if (value && typeof value === 'object') {
      paths.push(...flattenFieldPaths(value, next));
    } else {
      paths.push(next);
    }
  }
  return paths;
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
  const allFields = flattenFieldPaths(content)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const previewFields = allFields.slice(0, 30);
  return {
    ok: true,
    tool: 'read_page',
    summary: `Loaded ${filePath} | editable fields: ${allFields.length} (showing ${previewFields.length})`,
    data: { page, content },
    preview: {
      path: filePath,
      fieldCount: allFields.length,
      fieldsPreview: previewFields,
      fieldsAll: allFields,
    },
  };
}

export async function listVariantOptions(
  _ctx: ToolContext,
  section?: string
): Promise<ExecutedToolResult> {
  const normalizedSection = (section || 'all').trim().toLowerCase();
  const data = getVariantOptions(normalizedSection);
  const sections = Object.keys(data);
  const summary = sections.length
    ? `Variant options loaded for: ${sections.join(', ')}`
    : `No variant options found for section '${normalizedSection}'`;
  return {
    ok: true,
    tool: 'list_variant_options',
    summary,
    data,
    preview: data,
  };
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
  const resolutionNote =
    normalizedFieldPath !== fieldPath.trim()
      ? ` | resolved path: ${fieldPath.trim()} -> ${normalizedFieldPath}`
      : '';
  const before =
    typeof current === 'object' && current
      ? JSON.parse(JSON.stringify(current))
      : current;
  const next = setPathValue(current, normalizedFieldPath, newValue);
  await writeJson(ctx, filePath, next);
  return {
    ok: true,
    tool: 'update_page_field',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${filePath}:${normalizedFieldPath}${resolutionNote}`,
    changedPaths: [filePath],
    preview: {
      path: filePath,
      fieldPathRaw: fieldPath.trim(),
      fieldPath: normalizedFieldPath,
      before,
      after: next,
    },
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
  const resolvedPairs: Array<{ from: string; to: string }> = [];
  for (const item of updates) {
    const normalizedFieldPath = normalizePageFieldPath(next, item.field_path);
    if (normalizedFieldPath !== item.field_path.trim()) {
      resolvedPairs.push({ from: item.field_path.trim(), to: normalizedFieldPath });
    }
    next = setPathValue(next, normalizedFieldPath, item.new_value);
  }
  await writeJson(ctx, filePath, next);
  const resolutionNote = resolvedPairs.length
    ? ` | resolved path${resolvedPairs.length > 1 ? 's' : ''}: ${resolvedPairs
        .map((pair) => `${pair.from} -> ${pair.to}`)
        .join('; ')}`
    : '';
  return {
    ok: true,
    tool: 'update_page_fields_batch',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${updates.length} fields in ${filePath}${resolutionNote}`,
    changedPaths: [filePath],
    preview: { path: filePath, updates, resolvedPairs, before, after: next },
  };
}
