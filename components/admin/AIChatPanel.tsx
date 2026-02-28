'use client';

import { useMemo, useState } from 'react';
import { readSseStream, type StreamEvent } from './ai-chat-stream';

type Msg = { role: 'user' | 'assistant'; text: string };

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
  const [dryRunMode, setDryRunMode] = useState(true);
  const [preview, setPreview] = useState<string>('');

  const disabled = useMemo(
    () => loading || !siteId.trim() || !locale.trim() || !prompt.trim(),
    [loading, siteId, locale, prompt]
  );

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
          <h2 className="text-sm font-semibold text-gray-900">AI Content Assistant</h2>
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
      </div>
    </div>
  );
}
