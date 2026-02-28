import Anthropic from '@anthropic-ai/sdk';
import type { ChatProvider, ChatTurnResult, ProviderRequest, ToolCall } from '../types';

function toAnthropicMessages(
  messages: ProviderRequest['messages']
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages.map((msg) => {
    if (msg.role === 'assistant') {
      return { role: 'assistant' as const, content: msg.content };
    }
    if (msg.role === 'tool') {
      return {
        role: 'user' as const,
        content: `Tool ${msg.toolName || 'unknown'} result:\n${msg.content}`,
      };
    }
    return { role: 'user' as const, content: msg.content };
  });
}

export class AnthropicProvider implements ChatProvider {
  private client: Anthropic;

  constructor(apiKey: string, private maxTokens: number) {
    this.client = new Anthropic({ apiKey });
  }

  async runTurn(request: ProviderRequest): Promise<ChatTurnResult> {
    const response: any = await this.client.messages.create({
      model: request.model,
      max_tokens: this.maxTokens,
      system: request.systemPrompt,
      messages: toAnthropicMessages(request.messages),
      tools: request.tools,
      tool_choice: { type: 'any' },
    });

    const textParts: string[] = [];
    const toolCalls: ToolCall[] = [];
    for (const block of response.content || []) {
      if (block.type === 'text') {
        textParts.push(String(block.text || ''));
      }
      if (block.type === 'tool_use') {
        toolCalls.push({
          id: String(block.id),
          name: String(block.name),
          args: (block.input || {}) as Record<string, unknown>,
        });
      }
    }

    const finishReason =
      response.stop_reason === 'tool_use'
        ? 'tool_use'
        : response.stop_reason === 'max_tokens'
          ? 'length'
          : 'stop';

    return {
      assistantText: textParts.join('\n').trim(),
      toolCalls,
      toolOutputs: [],
      finishReason,
      model: request.model,
    };
  }
}
