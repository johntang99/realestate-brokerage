import { getAiMaxTokens, getAiProvider } from './config';
import type { ChatProvider } from './types';
import { AnthropicProvider } from './providers/anthropic-provider';
import { OpenAIProvider } from './providers/openai-provider';

export function createProvider(): ChatProvider {
  const provider = getAiProvider();
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is missing');
    return new OpenAIProvider(key);
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is missing');
  return new AnthropicProvider(key, getAiMaxTokens());
}
