'use client';

import { useEffect, useMemo, useState } from 'react';
import { readSseStream, type StreamEvent } from './ai-chat-stream';

type Msg = { role: 'user' | 'assistant'; text: string };
type ReportData = {
  turnsScanned: number;
  toolsScanned: number;
  failures: number;
  topFailureTags?: Array<{ tag: string; count: number }>;
  topFailurePatterns: Array<{ pattern: string; count: number }>;
  perTool: Array<{ name: string; total: number; success: number; failure: number; failureRate: number }>;
  recentTrace: Array<{
    createdAt: string;
    prompt: string;
    tool: string;
    ok: boolean;
    rawPath: string | null;
    resolvedPath: string | null;
    summary: string;
    errorMessage: string | null;
  }>;
  conversionSignals?: {
    leadsCaptured: number;
    eventsTracked: number;
    topLeadSources: Array<{ source: string; count: number }>;
    leadEvents: Array<{ eventName: string; count: number }>;
  };
};
type PreferenceItem = { key: string; value: unknown };

export function AIChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [siteId, setSiteId] = useState(process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'reb-template');
  const [locale, setLocale] = useState('en');
  const [prompt, setPrompt] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [streamMode, setStreamMode] = useState(true);
  const [dryRunMode, setDryRunMode] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'report'>('chat');
  const [reportDays, setReportDays] = useState(7);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [prefKey, setPrefKey] = useState('');
  const [prefValueText, setPrefValueText] = useState('');
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefStatus, setPrefStatus] = useState('');
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);

  const disabled = useMemo(
    () => loading || !siteId.trim() || !locale.trim() || !prompt.trim(),
    [loading, siteId, locale, prompt]
  );

  function formatToolResultForChat(name: string, preview: unknown): string | null {
    if (!preview || typeof preview !== 'object') return null;
    const record = preview as Record<string, unknown>;

    // Special handling for read_page field listing.
    if (
      name === 'read_page' &&
      typeof record.fieldCount === 'number' &&
      Array.isArray(record.fieldsPreview)
    ) {
      const shown = record.fieldsPreview as string[];
      const lines = shown.slice(0, 30).map((field) => `- ${field}`);
      const total = record.fieldCount;
      const header = `Editable fields (${shown.length}/${total} shown):`;
      return [header, ...lines].join('\n');
    }

    if (name === 'list_variant_options') {
      const rows: string[] = [];
      Object.entries(record).forEach(([section, options]) => {
        if (!Array.isArray(options)) return;
        rows.push(`${section}:`);
        options.forEach((item) => {
          if (!item || typeof item !== 'object') return;
          const option = item as Record<string, unknown>;
          rows.push(`- ${String(option.id || '')} (${String(option.label || '')})`);
        });
      });
      return rows.length ? rows.join('\n') : 'No variant options found.';
    }

    if (name === 'update_page_field' && typeof record.fieldPathRaw === 'string' && typeof record.fieldPath === 'string') {
      return `Resolved path: ${record.fieldPathRaw} -> ${record.fieldPath}`;
    }

    // Generic compact fallback for other tool previews.
    const serialized = JSON.stringify(preview, null, 2);
    if (!serialized) return null;
    return `Tool output (${name}):\n${serialized.slice(0, 1200)}${serialized.length > 1200 ? '\n...truncated' : ''}`;
  }

  async function loadReport() {
    if (!siteId.trim()) return;
    setReportLoading(true);
    setReportError('');
    try {
      const res = await fetch(
        `/api/admin/ai-chat/report?siteId=${encodeURIComponent(siteId.trim())}&days=${reportDays}`
      );
      const data = (await res.json()) as ReportData & { message?: string };
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to load report');
      }
      setReportData(data);
    } catch (error: any) {
      setReportError(error?.message || 'Failed to load report');
    } finally {
      setReportLoading(false);
    }
  }

  async function loadPreferences() {
    if (!siteId.trim()) return;
    setPrefLoading(true);
    setPrefStatus('');
    try {
      const res = await fetch(
        `/api/admin/ai-chat/preferences?siteId=${encodeURIComponent(siteId.trim())}&locale=${encodeURIComponent(locale.trim() || 'en')}`
      );
      const data = (await res.json()) as { preferences?: PreferenceItem[]; message?: string };
      if (!res.ok) throw new Error(data?.message || 'Failed to load preferences');
      setPreferences(Array.isArray(data.preferences) ? data.preferences : []);
    } catch (error: any) {
      setPrefStatus(error?.message || 'Failed to load preferences');
    } finally {
      setPrefLoading(false);
    }
  }

  async function savePreference() {
    const key = prefKey.trim();
    if (!key || !siteId.trim()) return;
    let parsedValue: unknown = prefValueText;
    const candidate = prefValueText.trim();
    if (candidate.startsWith('{') || candidate.startsWith('[') || candidate === 'true' || candidate === 'false' || /^-?\d+(\.\d+)?$/.test(candidate)) {
      try {
        parsedValue = JSON.parse(candidate);
      } catch {
        parsedValue = prefValueText;
      }
    }
    setPrefLoading(true);
    setPrefStatus('');
    try {
      const res = await fetch('/api/admin/ai-chat/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteId.trim(),
          locale: locale.trim() || 'en',
          key,
          value: parsedValue,
        }),
      });
      const data = (await res.json()) as { preferences?: PreferenceItem[]; message?: string };
      if (!res.ok) throw new Error(data?.message || 'Failed to save preference');
      setPreferences(Array.isArray(data.preferences) ? data.preferences : []);
      setPrefStatus(`Saved preference: ${key}`);
    } catch (error: any) {
      setPrefStatus(error?.message || 'Failed to save preference');
    } finally {
      setPrefLoading(false);
    }
  }

  useEffect(() => {
    if (!open || activeTab !== 'report') return;
    void loadReport();
    void loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, siteId, locale, reportDays]);

  function handleStreamEvent(event: StreamEvent) {
    if (event.type === 'status') {
      setStatus(event.message);
      return;
    }
    if (event.type === 'tool_start') {
      setStatus(`Running tool: ${event.name}`);
      return;
    }
    if (event.type === 'tool_result') {
      setStatus(event.summary);
      if (event.preview) {
        setPreview((prev) =>
          `${prev}\n- ${event.name}: ${JSON.stringify(event.preview, null, 2)}`
        );
        const flowText = formatToolResultForChat(event.name, event.preview);
        if (flowText) {
          setMessages((prev) => [...prev, { role: 'assistant', text: flowText }]);
        }
      }
      return;
    }
    if (event.type === 'assistant') {
      setMessages((prev) => [...prev, { role: 'assistant', text: event.text }]);
      return;
    }
    if (event.type === 'done') {
      setConversationId(event.conversationId);
      setStatus(`Model: ${event.model}`);
      const answer = typeof event.answer === 'string' ? event.answer.trim() : '';
      if (answer) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.text === answer) return prev;
          return [...prev, { role: 'assistant', text: answer }];
        });
      }
    }
  }

  async function handleSend() {
    if (disabled) return;
    const userText = prompt.trim();
    setPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    setStatus('');
    setPreview('');
    try {
      const res = await fetch('/api/admin/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteId.trim(),
          locale: locale.trim(),
          message: userText,
          conversationId,
          stream: streamMode,
          dryRun: dryRunMode,
        }),
      });

      if (streamMode) {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || 'AI chat stream failed');
        }
        await readSseStream(res, handleStreamEvent);
      } else {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || 'AI chat request failed');
        }
        setConversationId(data.conversationId);
        setMessages((prev) => [...prev, { role: 'assistant', text: String(data.answer || '') }]);
        const toolCount = Array.isArray(data.toolRuns) ? data.toolRuns.length : 0;
        const modeLabel = data.dryRun ? 'dry-run' : 'write';
        setStatus(`Model: ${data.model || 'n/a'} | Tools: ${toolCount} | Mode: ${modeLabel}`);
        const previews = (Array.isArray(data.toolRuns) ? data.toolRuns : [])
          .map((row: any) => row?.preview)
          .filter(Boolean);
        if (previews.length) {
          setPreview(previews.map((item: unknown) => JSON.stringify(item, null, 2)).join('\n'));
        }
      }
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${error?.message || 'Unknown error'}` }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/25">
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">AI Content Assistant</h2>
            <div className="inline-flex rounded border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-2 py-1 text-xs ${activeTab === 'chat' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`px-2 py-1 text-xs ${activeTab === 'report' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
              >
                Report
              </button>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900">
            Close
          </button>
        </div>
        <div className="px-4 py-3 border-b grid grid-cols-2 gap-2">
          <input className="h-9 rounded border border-gray-300 px-2 text-sm" value={siteId} onChange={(e) => setSiteId(e.target.value)} placeholder="siteId" />
          <input className="h-9 rounded border border-gray-300 px-2 text-sm" value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="locale" />
          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={streamMode} onChange={(e) => setStreamMode(e.target.checked)} />
            Stream mode
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={dryRunMode} onChange={(e) => setDryRunMode(e.target.checked)} />
            Dry-run preview
          </label>
        </div>
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-blue-600 text-white ml-8' : 'bg-white text-gray-900 mr-8 border'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-2">
              <textarea
                className="w-full rounded border border-gray-300 p-2 text-sm min-h-[90px]"
                placeholder="Describe what to update (e.g. update home hero title and CTA)..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{status}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleSend}
                  className="h-9 px-3 rounded bg-gray-900 text-white text-sm disabled:opacity-50"
                >
                  {loading ? 'Running...' : 'Send'}
                </button>
              </div>
              {preview.trim() ? (
                <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900 whitespace-pre-wrap max-h-40 overflow-auto">
                  {preview}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
            <div className="bg-white border rounded p-3 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                AI telemetry report for <span className="font-medium text-gray-900">{siteId || 'n/a'}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={reportDays}
                  onChange={(e) => setReportDays(Number(e.target.value))}
                  className="h-8 rounded border border-gray-300 px-2 text-xs"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
                <button
                  type="button"
                  onClick={loadReport}
                  className="h-8 px-2 rounded bg-gray-900 text-white text-xs"
                  disabled={reportLoading}
                >
                  {reportLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
            {reportError ? (
              <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {reportError}
              </div>
            ) : null}
            {reportData ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded border bg-white p-3">
                    <div className="text-xs text-gray-500">Turns</div>
                    <div className="text-lg font-semibold">{reportData.turnsScanned}</div>
                  </div>
                  <div className="rounded border bg-white p-3">
                    <div className="text-xs text-gray-500">Tools</div>
                    <div className="text-lg font-semibold">{reportData.toolsScanned}</div>
                  </div>
                  <div className="rounded border bg-white p-3">
                    <div className="text-xs text-gray-500">Failures</div>
                    <div className="text-lg font-semibold">{reportData.failures}</div>
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Conversion signals</div>
                  <div className="text-xs text-gray-700 mb-2">
                    Leads: <span className="font-medium">{reportData.conversionSignals?.leadsCaptured || 0}</span> | Events: <span className="font-medium">{reportData.conversionSignals?.eventsTracked || 0}</span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-auto mb-2">
                    {(reportData.conversionSignals?.topLeadSources || []).map((row) => (
                      <div key={row.source} className="text-xs text-gray-700">
                        <span className="font-medium">{row.count}x</span> {row.source}
                      </div>
                    ))}
                    {!reportData.conversionSignals?.topLeadSources?.length ? <div className="text-xs text-gray-500">No lead sources recorded.</div> : null}
                  </div>
                  <div className="space-y-1 max-h-24 overflow-auto">
                    {(reportData.conversionSignals?.leadEvents || []).map((row) => (
                      <div key={row.eventName} className="text-xs text-gray-700">
                        <span className="font-medium">{row.count}x</span> {row.eventName}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Preferences</div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      value={prefKey}
                      onChange={(e) => setPrefKey(e.target.value)}
                      placeholder="key (e.g. tone)"
                      className="h-8 rounded border border-gray-300 px-2 text-xs"
                    />
                    <input
                      value={prefValueText}
                      onChange={(e) => setPrefValueText(e.target.value)}
                      placeholder='value (e.g. "concise")'
                      className="h-8 rounded border border-gray-300 px-2 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={savePreference}
                      disabled={prefLoading || !prefKey.trim()}
                      className="h-8 px-2 rounded bg-gray-900 text-white text-xs disabled:opacity-50"
                    >
                      {prefLoading ? 'Saving...' : 'Save preference'}
                    </button>
                    <button
                      type="button"
                      onClick={loadPreferences}
                      disabled={prefLoading}
                      className="h-8 px-2 rounded border border-gray-300 text-xs"
                    >
                      Reload
                    </button>
                    <span className="text-[11px] text-gray-500">{prefStatus}</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-auto">
                    {preferences.map((item) => (
                      <div key={item.key} className="text-xs text-gray-700">
                        <span className="font-medium">{item.key}</span>: {typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}
                      </div>
                    ))}
                    {!preferences.length ? (
                      <div className="text-xs text-gray-500">No preferences set.</div>
                    ) : null}
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Failure tags</div>
                  <div className="space-y-1 max-h-24 overflow-auto mb-2">
                    {(reportData.topFailureTags || []).map((item) => (
                      <div key={item.tag} className="text-xs text-gray-700">
                        <span className="font-medium">{item.count}x</span> {item.tag}
                      </div>
                    ))}
                    {!reportData.topFailureTags?.length ? <div className="text-xs text-gray-500">No failure tags detected.</div> : null}
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Top failure patterns</div>
                  <div className="space-y-1 max-h-36 overflow-auto">
                    {(reportData.topFailurePatterns || []).slice(0, 8).map((item, index) => (
                      <div key={`${item.pattern}-${index}`} className="text-xs text-gray-700">
                        <span className="font-medium">{item.count}x</span> {item.pattern}
                      </div>
                    ))}
                    {!reportData.topFailurePatterns?.length ? (
                      <div className="text-xs text-gray-500">No failures found in selected window.</div>
                    ) : null}
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Per-tool failure rate</div>
                  <div className="space-y-1 max-h-36 overflow-auto">
                    {(reportData.perTool || []).slice(0, 10).map((tool) => (
                      <div key={tool.name} className="text-xs text-gray-700">
                        <span className="font-medium">{tool.name}</span>{' '}
                        <span className="text-gray-500">
                          total {tool.total}, fail {tool.failure}, rate {Math.round(tool.failureRate * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded border bg-white p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Recent trace</div>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {(reportData.recentTrace || []).slice(0, 12).map((row, index) => (
                      <div key={`${row.createdAt}-${row.tool}-${index}`} className="rounded border border-gray-200 p-2">
                        <div className="text-[11px] text-gray-500">
                          {row.createdAt || 'n/a'} • {row.tool} • {row.ok ? 'ok' : 'fail'}
                        </div>
                        <div className="text-xs text-gray-800 whitespace-pre-wrap">
                          {row.prompt || '(no prompt)'}
                        </div>
                        <div className="text-[11px] text-gray-600">
                          {row.rawPath ? `raw: ${row.rawPath}` : 'raw: -'} | {row.resolvedPath ? `resolved: ${row.resolvedPath}` : 'resolved: -'}
                        </div>
                      </div>
                    ))}
                    {!reportData.recentTrace?.length ? (
                      <div className="text-xs text-gray-500">No recent trace rows.</div>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded border bg-white p-3 text-xs text-gray-500">
                No report loaded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
