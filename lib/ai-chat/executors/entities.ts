import { setPathValue, slugify } from '@/lib/ai-chat/path-utils';
import { resolveFriendlyFieldPath } from '@/lib/ai-chat/field-aliases';
import type { ExecutedToolResult } from './shared';
import { listByPrefix, readJson, removeJson, writeJson, type ToolContext } from './context';

const ENTITY_DIRS: Record<string, string> = {
  agents: 'agents',
  properties: 'properties',
  neighborhoods: 'neighborhoods',
  testimonials: 'testimonials',
  events: 'events',
  guides: 'guides',
  'new-construction': 'new-construction',
  'knowledge-center': 'knowledge-center',
  'market-reports': 'market-reports',
};

function dirOf(entityType: string) {
  const dir = ENTITY_DIRS[entityType];
  if (!dir) throw new Error(`Unsupported entity type: ${entityType}`);
  return dir;
}

function toPath(entityType: string, entityId: string) {
  return `${dirOf(entityType)}/${entityId.replace(/\.json$/i, '')}.json`;
}

export async function listEntities(ctx: ToolContext, entityType: string): Promise<ExecutedToolResult> {
  if (entityType === 'testimonials') {
    const list = (await readJson(ctx, 'testimonials.json')) as unknown[];
    const rows = (Array.isArray(list) ? list : []).map((item, index) => {
      const row = (item || {}) as Record<string, unknown>;
      const id = String(row.id || row.slug || `item-${index + 1}`);
      return { id, title: String(row.name || row.title || row.quote || id) };
    });
    return { ok: true, tool: 'list_entities', summary: `Found ${rows.length} testimonials`, data: { items: rows } };
  }
  const entries = await listByPrefix(ctx, `${dirOf(entityType)}/`);
  const rows = entries
    .filter((entry) => entry.path.endsWith('.json'))
    .map((entry) => {
      const slug = entry.path.split('/').pop()?.replace(/\.json$/i, '') || '';
      const record = (entry.content ?? entry.data) as Record<string, unknown>;
      return { id: String(record?.id || slug), slug, title: String(record?.title || record?.name || slug) };
    });
  return { ok: true, tool: 'list_entities', summary: `Found ${rows.length} ${entityType}`, data: { items: rows } };
}

export async function readEntity(ctx: ToolContext, entityType: string, entityId: string): Promise<ExecutedToolResult> {
  if (entityType === 'testimonials') {
    const list = (await readJson(ctx, 'testimonials.json')) as unknown[];
    const row = (Array.isArray(list) ? list : []).find((item) => {
      const record = (item || {}) as Record<string, unknown>;
      return String(record.id || record.slug || '') === entityId;
    });
    if (!row) throw new Error(`Entity not found: ${entityId}`);
    return { ok: true, tool: 'read_entity', summary: `Loaded testimonial ${entityId}`, data: row };
  }
  const filePath = toPath(entityType, entityId);
  const content = await readJson(ctx, filePath);
  return { ok: true, tool: 'read_entity', summary: `Loaded ${filePath}`, data: content };
}

export async function updateEntityField(
  ctx: ToolContext,
  entityType: string,
  entityId: string,
  fieldPath: string,
  newValue: unknown
): Promise<ExecutedToolResult> {
  if (entityType === 'testimonials') {
    const list = (await readJson(ctx, 'testimonials.json')) as unknown[];
    const next = [...(Array.isArray(list) ? list : [])];
    const index = next.findIndex((item) => {
      const row = (item || {}) as Record<string, unknown>;
      return String(row.id || row.slug || '') === entityId;
    });
    if (index < 0) throw new Error(`Entity not found: ${entityId}`);
    const normalizedFieldPath = resolveFriendlyFieldPath(next[index], fieldPath);
    const resolutionNote =
      normalizedFieldPath !== fieldPath.trim()
        ? ` | resolved path: ${fieldPath.trim()} -> ${normalizedFieldPath}`
        : '';
    next[index] = setPathValue(next[index], normalizedFieldPath, newValue);
    await writeJson(ctx, 'testimonials.json', next);
    return {
      ok: true,
      tool: 'update_entity_field',
      summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated testimonial ${entityId}:${normalizedFieldPath}${resolutionNote}`,
      changedPaths: ['testimonials.json'],
      preview: {
        path: 'testimonials.json',
        entityId,
        fieldPathRaw: fieldPath.trim(),
        fieldPath: normalizedFieldPath,
        newValue,
      },
    };
  }
  const filePath = toPath(entityType, entityId);
  const current = await readJson(ctx, filePath);
  const normalizedFieldPath = resolveFriendlyFieldPath(current, fieldPath);
  const resolutionNote =
    normalizedFieldPath !== fieldPath.trim()
      ? ` | resolved path: ${fieldPath.trim()} -> ${normalizedFieldPath}`
      : '';
  const next = setPathValue(current, normalizedFieldPath, newValue);
  await writeJson(ctx, filePath, next);
  return {
    ok: true,
    tool: 'update_entity_field',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Updated ${filePath}:${normalizedFieldPath}${resolutionNote}`,
    changedPaths: [filePath],
    preview: {
      path: filePath,
      fieldPathRaw: fieldPath.trim(),
      fieldPath: normalizedFieldPath,
      newValue,
    },
  };
}

export async function addEntity(ctx: ToolContext, entityType: string, data: Record<string, unknown>): Promise<ExecutedToolResult> {
  if (entityType === 'testimonials') {
    const list = (await readJson(ctx, 'testimonials.json')) as unknown[];
    const id = slugify(String(data.id || data.slug || data.name || data.title || `testimonial-${Date.now()}`));
    const row = { ...data, id, slug: String(data.slug || id) };
    const next = [...(Array.isArray(list) ? list : []), row];
    await writeJson(ctx, 'testimonials.json', next);
    return {
      ok: true,
      tool: 'add_entity',
      summary: `${ctx.dryRun ? '[dry-run] ' : ''}Created testimonial ${id}`,
      changedPaths: ['testimonials.json'],
      data: row,
      preview: { action: 'create', path: 'testimonials.json', id },
    };
  }
  const dir = dirOf(entityType);
  const slug = slugify(String(data.slug || data.id || data.name || data.title || `${entityType}-${Date.now()}`));
  const filePath = `${dir}/${slug}.json`;
  await writeJson(ctx, filePath, { ...data, slug, id: String(data.id || slug) });
  return {
    ok: true,
    tool: 'add_entity',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Created ${filePath}`,
    changedPaths: [filePath],
    data: { slug },
    preview: { action: 'create', path: filePath, slug },
  };
}

export async function removeEntity(
  ctx: ToolContext,
  entityType: string,
  entityId: string,
  confirm: boolean
): Promise<ExecutedToolResult> {
  if (!confirm) throw new Error('Deletion requires confirm=true');
  if (entityType === 'testimonials') {
    const list = (await readJson(ctx, 'testimonials.json')) as unknown[];
    const current = Array.isArray(list) ? list : [];
    const next = current.filter((item) => {
      const row = (item || {}) as Record<string, unknown>;
      return String(row.id || row.slug || '') !== entityId;
    });
    if (next.length === current.length) throw new Error(`Entity not found: ${entityId}`);
    await writeJson(ctx, 'testimonials.json', next);
    return {
      ok: true,
      tool: 'remove_entity',
      summary: `${ctx.dryRun ? '[dry-run] ' : ''}Removed testimonial ${entityId}`,
      changedPaths: ['testimonials.json'],
      preview: { action: 'delete', path: 'testimonials.json', entityId },
    };
  }
  const filePath = toPath(entityType, entityId);
  await removeJson(ctx, filePath);
  return {
    ok: true,
    tool: 'remove_entity',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Removed ${filePath}`,
    changedPaths: [filePath],
    preview: { action: 'delete', path: filePath },
  };
}
