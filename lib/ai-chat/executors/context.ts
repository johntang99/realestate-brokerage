import fs from 'fs/promises';
import path from 'path';
import { canUseContentDb, deleteContentEntry, fetchContentEntry, listContentEntriesByPrefix, upsertContentEntry } from '@/lib/contentDb';
import { resolveContentPath } from '@/lib/admin/content';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { normalizeMediaUrlsInData } from '@/lib/media-url';

export type ToolContext = {
  siteId: string;
  locale: string;
  actorEmail: string;
  dryRun?: boolean;
};

const DEDICATED_TABLES: Record<string, string> = {
  agents: 'agents',
  events: 'events',
  'new-construction': 'new_construction',
};

function parseBooleanEnv(value: string | undefined): boolean | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function shouldWriteThroughFile() {
  const override = parseBooleanEnv(process.env.CONTENT_WRITE_THROUGH_FILE);
  if (override !== null) return override;
  return process.env.NODE_ENV !== 'production';
}

export async function readJson(ctx: ToolContext, filePath: string): Promise<unknown> {
  if (canUseContentDb()) {
    const entry = await fetchContentEntry(ctx.siteId, ctx.locale, filePath);
    const content = entry?.content ?? entry?.data;
    if (content != null) return content;
  }
  const resolved = resolveContentPath(ctx.siteId, ctx.locale, filePath);
  if (!resolved) throw new Error(`Invalid content path: ${filePath}`);
  return JSON.parse(await fs.readFile(resolved, 'utf-8'));
}

async function syncDedicatedTable(ctx: ToolContext, filePath: string, data: unknown) {
  const dir = filePath.split('/')[0] || '';
  const table = DEDICATED_TABLES[dir];
  if (!table || !data || typeof data !== 'object' || Array.isArray(data)) return;
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const slug = filePath.split('/').pop()?.replace(/\.json$/i, '').toLowerCase() || '';
  const payload: Record<string, unknown> = {
    site_id: ctx.siteId,
    slug,
    data,
    updated_at: new Date().toISOString(),
  };
  if (table === 'events') {
    const source = data as Record<string, unknown>;
    const date = [source.eventDate, source.startDate, source.date].find((v) => typeof v === 'string') as string | undefined;
    payload.event_date = date?.slice(0, 10) || null;
  }
  await supabase.from(table).upsert(payload, { onConflict: 'site_id,slug' });
}

export async function writeJson(ctx: ToolContext, filePath: string, data: unknown) {
  const normalized = normalizeMediaUrlsInData(data, ctx.siteId);
  if (ctx.dryRun) return;
  if (canUseContentDb()) {
    await upsertContentEntry({
      siteId: ctx.siteId,
      locale: ctx.locale,
      path: filePath,
      data: normalized,
      updatedBy: ctx.actorEmail,
    });
  }
  if (shouldWriteThroughFile()) {
    const resolved = resolveContentPath(ctx.siteId, ctx.locale, filePath);
    if (resolved) {
      await fs.mkdir(path.dirname(resolved), { recursive: true });
      await fs.writeFile(resolved, JSON.stringify(normalized, null, 2));
    }
  }
  await syncDedicatedTable(ctx, filePath, normalized);
}

export async function removeJson(ctx: ToolContext, filePath: string) {
  if (ctx.dryRun) return;
  if (canUseContentDb()) {
    await deleteContentEntry({ siteId: ctx.siteId, locale: ctx.locale, path: filePath });
  }
  if (shouldWriteThroughFile()) {
    const resolved = resolveContentPath(ctx.siteId, ctx.locale, filePath);
    if (resolved) {
      try {
        await fs.unlink(resolved);
      } catch {
        // ignore
      }
    }
  }
}

export async function listByPrefix(ctx: ToolContext, prefix: string) {
  return listContentEntriesByPrefix(ctx.siteId, ctx.locale, prefix);
}
