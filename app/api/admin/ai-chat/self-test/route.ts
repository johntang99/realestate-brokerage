import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { aiChatEnabled } from '@/lib/ai-chat/config';
import { buildToolContext, executeTool } from '@/lib/ai-chat/tool-executor';
import { getPathValue, setPathValue } from '@/lib/ai-chat/path-utils';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  if (!canWriteContent(session.user)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  if (!aiChatEnabled()) return NextResponse.json({ message: 'AI chat is disabled' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId') || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'reb-template';
  const locale = searchParams.get('locale') || 'en';

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const ctx = buildToolContext({ siteId, locale, actorEmail: session.user.email });
  const checks: Array<{ check: string; pass: boolean; detail?: string }> = [];

  try {
    const obj = setPathValue({ a: { b: 1 } }, 'a.b', 2) as Record<string, unknown>;
    const value = getPathValue(obj, 'a.b');
    checks.push({ check: 'path-utils.set/get', pass: value === 2 });
  } catch (error: any) {
    checks.push({ check: 'path-utils.set/get', pass: false, detail: error?.message });
  }

  for (const step of [
    { tool: 'list_pages', args: {} },
    { tool: 'get_site_settings', args: {} },
    { tool: 'list_entities', args: { entity_type: 'agents' } },
    { tool: 'list_entities', args: { entity_type: 'events' } },
    { tool: 'list_entities', args: { entity_type: 'guides' } },
    { tool: 'list_media', args: { type: 'all' } },
  ]) {
    try {
      const result = await executeTool(ctx, step.tool, step.args);
      checks.push({ check: step.tool, pass: result.ok, detail: result.summary });
    } catch (error: any) {
      checks.push({ check: step.tool, pass: false, detail: error?.message });
    }
  }

  const passed = checks.filter((item) => item.pass).length;
  return NextResponse.json({
    success: true,
    siteId,
    locale,
    total: checks.length,
    passed,
    failed: checks.length - passed,
    checks,
  });
}
