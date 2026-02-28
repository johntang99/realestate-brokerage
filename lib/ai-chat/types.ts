import type { ToolSchema } from './tool-definitions';

export type ChatRole = 'user' | 'assistant' | 'tool';

export interface ChatMessageRecord {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  toolName?: string;
}

export interface ChatRequestPayload {
  siteId: string;
  locale: string;
  message: string;
  conversationId?: string;
  stream?: boolean;
  dryRun?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ToolOutput {
  toolCallId: string;
  toolName: string;
  output: unknown;
  ok: boolean;
}

export interface ChatTurnResult {
  assistantText: string;
  toolCalls: ToolCall[];
  toolOutputs: ToolOutput[];
  finishReason: 'stop' | 'tool_use' | 'length' | 'error';
  model: string;
}

export type ChatStreamEvent =
  | { type: 'status'; message: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_result'; name: string; ok: boolean; summary: string; preview?: unknown }
  | { type: 'assistant'; text: string }
  | { type: 'done'; conversationId: string; model: string; answer?: string };

export interface ProviderRequest {
  model: string;
  systemPrompt: string;
  tools: ToolSchema[];
  messages: Array<{ role: ChatRole; content: string; toolName?: string; toolCallId?: string }>;
}

export interface ChatProvider {
  runTurn(request: ProviderRequest): Promise<ChatTurnResult>;
}
