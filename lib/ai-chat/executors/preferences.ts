import { listPreferences, setPreference } from '@/lib/ai-chat/preferences';
import type { ToolContext } from './context';
import type { ExecutedToolResult } from './shared';

export async function getPreferences(ctx: ToolContext): Promise<ExecutedToolResult> {
  const rows = await listPreferences(ctx.siteId, ctx.locale);
  return {
    ok: true,
    tool: 'get_preferences',
    summary: `Loaded ${rows.length} preference${rows.length === 1 ? '' : 's'}`,
    data: { preferences: rows },
  };
}

export async function setPreferenceValue(
  ctx: ToolContext,
  key: string,
  value: unknown
): Promise<ExecutedToolResult> {
  const normalizedKey = key.trim();
  if (!normalizedKey) throw new Error('Preference key is required');
  if (!ctx.dryRun) {
    await setPreference(ctx.siteId, ctx.locale, normalizedKey, value);
  }
  return {
    ok: true,
    tool: 'set_preference',
    summary: `${ctx.dryRun ? '[dry-run] ' : ''}Set preference ${normalizedKey}`,
    preview: { key: normalizedKey, value },
  };
}
