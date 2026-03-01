import { allTools } from './tool-definitions';
import { buildSystemPrompt } from './system-prompt';
import { createProvider } from './provider';
import { buildToolContext, executeTool } from './tool-executor';
import { createConversationId, loadConversation, saveMessage } from './storage';
import { getAiModel } from './config';
import type { ChatStreamEvent } from './types';
import { buildContextBlock, isWriteIntent } from './context-injection';

type RunChatArgs = {
  siteId: string;
  locale: string;
  actorEmail: string;
  userMessage: string;
  conversationId?: string;
  dryRun?: boolean;
  onEvent?: (event: ChatStreamEvent) => void;
};

type ToolRun = {
  name: string;
  ok: boolean;
  summary: string;
  preview?: unknown;
  rawPath?: string;
  resolvedPath?: string;
  errorMessage?: string;
  failureTag?: string;
};

function classifyFailureTag(args: Record<string, unknown>, summary: string) {
  const text = summary.toLowerCase();
  if (text.includes('variant')) return 'invalid_variant';
  if (text.includes('path') || typeof args.field_path === 'string') return 'field_path_error';
  if (text.includes('forbidden') || text.includes('not authenticated')) return 'auth_error';
  return 'tool_error';
}

export async function runChatTurn(args: RunChatArgs) {
  const conversationId = args.conversationId || createConversationId();
  const history = await loadConversation({
    siteId: args.siteId,
    locale: args.locale,
    conversationId,
    limit: 50,
  });
  const messages = history.map((item) => ({
    role: item.role,
    content: item.content,
    toolName: item.toolName,
  })) as Array<{ role: 'user' | 'assistant' | 'tool'; content: string; toolName?: string }>;

  const provider = createProvider();
  const model = getAiModel();
  const ctx = buildToolContext({
    siteId: args.siteId,
    locale: args.locale,
    actorEmail: args.actorEmail,
    dryRun: Boolean(args.dryRun),
  });
  args.onEvent?.({
    type: 'status',
    message: `Running model ${model}${args.dryRun ? ' in dry-run mode' : ''}`,
  });
  const writeIntent = isWriteIntent(args.userMessage);
  const contextBlock = await buildContextBlock(ctx, args.userMessage);
  const enrichedUserMessage = contextBlock
    ? `${args.userMessage}\n\n[Execution Context]\n${contextBlock}`
    : args.userMessage;
  messages.push({ role: 'user', content: enrichedUserMessage });
  if (contextBlock) {
    args.onEvent?.({ type: 'status', message: 'Context injected for schema guidance.' });
  }

  await saveMessage({
    siteId: args.siteId,
    locale: args.locale,
    conversationId,
    role: 'user',
    content: args.userMessage,
  });

  let assistantText = '';
  const toolRuns: ToolRun[] = [];
  const seenToolCalls = new Set<string>();

  for (let i = 0; i < 4; i += 1) {
    args.onEvent?.({ type: 'status', message: `Assistant turn ${i + 1}` });
    const turn = await provider.runTurn({
      model,
      systemPrompt: buildSystemPrompt({ siteId: args.siteId, locale: args.locale }),
      tools: allTools,
      messages,
    });

    if (turn.assistantText) {
      assistantText = turn.assistantText;
      messages.push({ role: 'assistant', content: turn.assistantText });
      args.onEvent?.({ type: 'assistant', text: turn.assistantText });
    }

    if (!turn.toolCalls.length) break;

    let executedAnyTool = false;
    for (const call of turn.toolCalls) {
      const signature = `${call.name}:${JSON.stringify(call.args || {})}`;
      if (seenToolCalls.has(signature)) {
        continue;
      }
      seenToolCalls.add(signature);
      executedAnyTool = true;
      args.onEvent?.({ type: 'tool_start', name: call.name });
      try {
        const result = await executeTool(ctx, call.name, call.args);
        const summary = `${result.summary}`;
        const previewRecord =
          result.preview && typeof result.preview === 'object'
            ? (result.preview as Record<string, unknown>)
            : null;
        const rawPath =
          previewRecord && typeof previewRecord.fieldPathRaw === 'string'
            ? previewRecord.fieldPathRaw
            : undefined;
        const resolvedPath =
          previewRecord && typeof previewRecord.fieldPath === 'string'
            ? previewRecord.fieldPath
            : undefined;
        toolRuns.push({
          name: call.name,
          ok: true,
          summary,
          preview: result.preview,
          rawPath,
          resolvedPath,
        });
        args.onEvent?.({
          type: 'tool_result',
          name: call.name,
          ok: true,
          summary,
          preview: result.preview,
        });
        messages.push({
          role: 'tool',
          content: JSON.stringify(result),
          toolName: call.name,
        });
        await saveMessage({
          siteId: args.siteId,
          locale: args.locale,
          conversationId,
          role: 'tool',
          content: JSON.stringify(result),
          toolName: call.name,
        });
      } catch (error: any) {
        const summary = error?.message || 'Tool execution failed';
        const rawPath = typeof call.args?.field_path === 'string' ? call.args.field_path : undefined;
        toolRuns.push({
          name: call.name,
          ok: false,
          summary,
          rawPath,
          errorMessage: summary,
          failureTag: classifyFailureTag(call.args || {}, summary),
        });
        args.onEvent?.({
          type: 'tool_result',
          name: call.name,
          ok: false,
          summary,
        });
        messages.push({
          role: 'tool',
          content: JSON.stringify({ ok: false, error: summary }),
          toolName: call.name,
        });
        await saveMessage({
          siteId: args.siteId,
          locale: args.locale,
          conversationId,
          role: 'tool',
          content: JSON.stringify({ ok: false, error: summary }),
          toolName: call.name,
        });
      }
    }
    if (!executedAnyTool) {
      break;
    }
  }

  const uniqueToolSummaries = Array.from(new Set(toolRuns.map((item) => item.summary)));
  const finalText =
    (writeIntent && !toolRuns.some((item) => item.ok)
      ? 'No changes were applied. I could not complete a write tool action for this request.'
      : assistantText) ||
    (uniqueToolSummaries.length
      ? `Tool results:\n${uniqueToolSummaries.map((item) => `- ${item}`).join('\n')}`
      : 'Done. I applied the requested changes.');
  await saveMessage({
    siteId: args.siteId,
    locale: args.locale,
    conversationId,
    role: 'assistant',
    content: finalText,
  });

  return {
    conversationId,
    answer: finalText,
    toolRuns,
    model,
    dryRun: Boolean(args.dryRun),
  };
}
