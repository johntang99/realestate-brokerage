import { listMediaDb } from '@/lib/admin/mediaDb';
import type { ExecutedToolResult } from './shared';
import type { ToolContext } from './context';

function isImagePath(value: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(value);
}

export async function listMedia(
  ctx: ToolContext,
  type: 'all' | 'images' | 'documents'
): Promise<ExecutedToolResult> {
  const rows = await listMediaDb(ctx.siteId);
  const filtered = rows.filter((item) => {
    if (type === 'images') return isImagePath(item.path);
    if (type === 'documents') return !isImagePath(item.path);
    return true;
  });
  return { ok: true, tool: 'list_media', summary: `Found ${filtered.length} media items`, data: { items: filtered.slice(0, 300) } };
}

export async function getImageUrl(ctx: ToolContext, search: string): Promise<ExecutedToolResult> {
  const q = search.trim().toLowerCase();
  if (!q) throw new Error('search is required');
  const rows = await listMediaDb(ctx.siteId);
  const match = rows.find((item) => item.path.toLowerCase().includes(q) || item.url.toLowerCase().includes(q));
  if (!match) throw new Error(`No image found for "${search}"`);
  return { ok: true, tool: 'get_image_url', summary: `Matched ${match.path}`, data: match };
}
