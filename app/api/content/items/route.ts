import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { canUseContentDb, listContentEntriesByPrefix } from '@/lib/contentDb';
import { getRequestSiteId } from '@/lib/content';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const ALLOWED_DIRECTORIES = [
  'portfolio', 'shop-products', 'journal', 'collections',
  'properties', 'neighborhoods', 'blog', 'market-reports',
  'agents', 'knowledge-center', 'new-construction',
] as const;
// Directories stored in dedicated tables rather than content_entries
const DEDICATED_TABLES: Record<string, string> = {
  agents: 'agents',
  'new-construction': 'new_construction',
  events: 'events',
};
type AllowedDirectory = (typeof ALLOWED_DIRECTORIES)[number];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteIdParam = searchParams.get('siteId');
  const locale = searchParams.get('locale');
  const directory = searchParams.get('directory') as AllowedDirectory | null;

  if (!locale || !directory) {
    return NextResponse.json(
      { message: 'locale and directory are required' },
      { status: 400 }
    );
  }

  if (!ALLOWED_DIRECTORIES.includes(directory)) {
    return NextResponse.json({ message: 'Invalid directory' }, { status: 400 });
  }

  try {
    const siteId = siteIdParam || (await getRequestSiteId());

    if (canUseContentDb()) {
      // Some collections (agents, new_construction) live in dedicated tables
      const dedicatedTable = DEDICATED_TABLES[directory];
      if (dedicatedTable) {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          const { data, error } = await supabase
            .from(dedicatedTable)
            .select('data')
            .eq('site_id', siteId)
            .order('created_at', { ascending: true });
          if (!error && data) {
            const items = data.map((row: any) => row.data).filter(Boolean);
            return NextResponse.json({ items });
          }
        }
      }

      const entries = await listContentEntriesByPrefix(siteId, locale, `${directory}/`);
      const items = entries.map((entry: any) => entry.content ?? entry.data);
      return NextResponse.json({ items });
    }

    const dirPath = path.join(CONTENT_DIR, siteId, locale, directory);
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));
    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(raw);
      })
    );
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
