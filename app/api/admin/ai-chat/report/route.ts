import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type AuditRow = {
  created_at?: string;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  action?: string;
};

type ToolRun = {
  name?: string;
  ok?: boolean;
  summary?: string;
  rawPath?: string | null;
  resolvedPath?: string | null;
  errorMessage?: string | null;
  failureTag?: string | null;
};

function asObject(value: unknown) {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function toToolRuns(metadata: Record<string, unknown>): ToolRun[] {
  const value = metadata.toolRuns;
  if (!Array.isArray(value)) return [];
  return value.map((item) => asObject(item) as ToolRun);
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  if (!canWriteContent(session.user)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const days = Math.max(1, Math.min(Number(searchParams.get('days') || 7), 90));
  const limit = Math.max(20, Math.min(Number(searchParams.get('limit') || 300), 2000));

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'Supabase is not configured' }, { status: 503 });
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  let data: AuditRow[] = [];
  {
    const { data: rows, error } = await supabase
      .from('admin_audit_logs')
      .select('created_at,details')
      .eq('action', 'ai_chat_turn')
      .eq('site_id', siteId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (!error) {
      data = (rows || []) as AuditRow[];
    } else {
      const { data: fallbackRows, error: fallbackError } = await supabase
        .from('admin_audit_logs')
        .select('created_at,metadata')
        .eq('action', 'ai_chat_turn')
        .eq('site_id', siteId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (fallbackError) {
        return NextResponse.json({ message: 'Unable to read audit logs' }, { status: 500 });
      }
      data = (fallbackRows || []) as AuditRow[];
    }
  }

  const patternCounts = new Map<string, number>();
  const failureTagCounts = new Map<string, number>();
  const toolStats = new Map<string, { total: number; success: number; failure: number }>();
  const recentTrace: Array<{
    createdAt: string;
    prompt: string;
    tool: string;
    ok: boolean;
    rawPath: string | null;
    resolvedPath: string | null;
    summary: string;
    errorMessage: string | null;
  }> = [];
  let totalTurns = 0;
  let totalTools = 0;
  let failedTools = 0;

  for (const row of data) {
    const metadata = asObject(row.details ?? row.metadata);
    const prompt = typeof metadata.prompt === 'string' ? metadata.prompt : '';
    const createdAt = typeof row.created_at === 'string' ? row.created_at : '';
    const toolRuns = toToolRuns(metadata);
    totalTurns += 1;
    for (const run of toolRuns) {
      const name = typeof run.name === 'string' ? run.name : 'unknown';
      const ok = run.ok === true;
      const rawPath = typeof run.rawPath === 'string' ? run.rawPath : null;
      const resolvedPath = typeof run.resolvedPath === 'string' ? run.resolvedPath : null;
      const summary = typeof run.summary === 'string' ? run.summary : '';
      const errorMessage = typeof run.errorMessage === 'string' ? run.errorMessage : null;
      const failureTag = typeof run.failureTag === 'string' ? run.failureTag : null;
      totalTools += 1;
      if (!ok) failedTools += 1;

      const stat = toolStats.get(name) || { total: 0, success: 0, failure: 0 };
      stat.total += 1;
      if (ok) stat.success += 1;
      else stat.failure += 1;
      toolStats.set(name, stat);

      if (recentTrace.length < 80) {
        recentTrace.push({
          createdAt,
          prompt,
          tool: name,
          ok,
          rawPath,
          resolvedPath,
          summary,
          errorMessage,
        });
      }

      if (!ok) {
        const pathPart = resolvedPath || rawPath || 'no-path';
        const err = errorMessage || 'unknown-error';
        const pattern = `${name} | ${pathPart} | ${err}`;
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
        if (failureTag) {
          failureTagCounts.set(failureTag, (failureTagCounts.get(failureTag) || 0) + 1);
        }
      }
    }
  }

  const topFailurePatterns = Array.from(patternCounts.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const perTool = Array.from(toolStats.entries())
    .map(([name, stats]) => ({
      name,
      total: stats.total,
      success: stats.success,
      failure: stats.failure,
      failureRate: stats.total ? Number((stats.failure / stats.total).toFixed(3)) : 0,
    }))
    .sort((a, b) => b.failure - a.failure);
  const topFailureTags = Array.from(failureTagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  let leadRows: AuditRow[] = [];
  {
    const { data: rows, error } = await supabase
      .from('admin_audit_logs')
      .select('created_at,action,details')
      .in('action', ['lead_capture', 'lead_event'])
      .eq('site_id', siteId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (!error) {
      leadRows = (rows || []) as AuditRow[];
    } else {
      const { data: fallbackRows } = await supabase
        .from('admin_audit_logs')
        .select('created_at,action,metadata')
        .in('action', ['lead_capture', 'lead_event'])
        .eq('site_id', siteId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);
      leadRows = (fallbackRows || []) as AuditRow[];
    }
  }

  const leadBySource = new Map<string, number>();
  const eventByName = new Map<string, number>();
  let leadsCaptured = 0;
  let eventsTracked = 0;
  for (const row of leadRows) {
    const action = typeof row.action === 'string' ? row.action : '';
    const details = asObject(row.details ?? row.metadata);
    const source = typeof details.source === 'string' ? details.source : 'unknown';
    if (action === 'lead_capture') {
      leadsCaptured += 1;
      leadBySource.set(source, (leadBySource.get(source) || 0) + 1);
    } else if (action === 'lead_event') {
      eventsTracked += 1;
      const eventName = typeof details.eventName === 'string' ? details.eventName : 'unknown';
      eventByName.set(eventName, (eventByName.get(eventName) || 0) + 1);
    }
  }
  const topLeadSources = Array.from(leadBySource.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const leadEvents = Array.from(eventByName.entries())
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    success: true,
    siteId,
    days,
    turnsScanned: totalTurns,
    toolsScanned: totalTools,
    failures: failedTools,
    topFailureTags,
    topFailurePatterns,
    perTool,
    recentTrace,
    conversionSignals: {
      leadsCaptured,
      eventsTracked,
      topLeadSources,
      leadEvents,
    },
  });
}
