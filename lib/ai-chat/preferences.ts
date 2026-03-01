import { getSupabaseServerClient } from '@/lib/supabase/server';

type PreferenceRow = {
  preference_key?: string;
  preference_value?: unknown;
  key?: string;
  value?: unknown;
};

export async function listPreferences(siteId: string, locale: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [] as Array<{ key: string; value: unknown }>;

  const { data, error } = await supabase
    .from('ai_chat_preferences')
    .select('preference_key,preference_value')
    .eq('site_id', siteId)
    .eq('locale', locale)
    .order('preference_key', { ascending: true });

  if (!error) {
    return ((data || []) as PreferenceRow[])
      .map((row) => ({
        key: String(row.preference_key || ''),
        value: row.preference_value,
      }))
      .filter((row) => row.key);
  }

  // Legacy fallback schema
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('ai_chat_preferences')
    .select('key,value')
    .eq('site_id', siteId)
    .eq('locale', locale)
    .order('key', { ascending: true });
  if (fallbackError) return [];
  return ((fallbackData || []) as PreferenceRow[])
    .map((row) => ({
      key: String(row.key || ''),
      value: row.value,
    }))
    .filter((row) => row.key);
}

export async function setPreference(
  siteId: string,
  locale: string,
  key: string,
  value: unknown
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const now = new Date().toISOString();
  const payload = {
    site_id: siteId,
    locale,
    preference_key: key,
    preference_value: value,
    updated_at: now,
  };
  const { error } = await supabase
    .from('ai_chat_preferences')
    .upsert(payload, { onConflict: 'site_id,locale,preference_key' });
  if (!error) return;

  // Legacy fallback schema
  await supabase.from('ai_chat_preferences').upsert(
    {
      site_id: siteId,
      locale,
      key,
      value,
      updated_at: now,
    },
    { onConflict: 'site_id,locale,key' }
  );
}

export async function getPreferencesPromptBlock(siteId: string, locale: string) {
  const rows = await listPreferences(siteId, locale);
  if (!rows.length) return '';
  const lines = rows.slice(0, 30).map((row) => {
    const value =
      typeof row.value === 'string'
        ? row.value
        : JSON.stringify(row.value);
    return `- ${row.key}: ${value}`;
  });
  return `Site preferences:\n${lines.join('\n')}`;
}
