import OpenAI from 'openai';
import type { ChatProvider, ChatTurnResult, ProviderRequest, ToolCall } from '../types';
import { toOpenAITools } from '../tool-definitions';

function toOpenAIMessages(messages: ProviderRequest['messages']) {
  return messages.map((msg) => {
    if (msg.role === 'tool') {
      return {
        role: 'user' as const,
        content: `Tool ${msg.toolName || 'unknown'} result:\n${msg.content}`,
      };
    }
    return { role: msg.role as 'user' | 'assistant', content: msg.content };
  });
}

export class OpenAIProvider implements ChatProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async runTurn(request: ProviderRequest): Promise<ChatTurnResult> {
    const completion: any = await this.client.chat.completions.create({
      model: request.model,
      messages: toOpenAIMessages(request.messages),
      tools: toOpenAITools(request.tools),
      tool_choice: 'auto',
    });

    const choice = completion.choices?.[0];
    const assistantText = String(choice?.message?.content || '').trim();
    const toolCalls: ToolCall[] = (choice?.message?.tool_calls || []).map((call: any) => ({
      id: String(call.id),
      name: String(call.function?.name),
      args: JSON.parse(String(call.function?.arguments || '{}')),
    }));

    return {
      assistantText,
      toolCalls,
      toolOutputs: [],
      finishReason: toolCalls.length ? 'tool_use' : 'stop',
      model: request.model,
    };
  }
}
