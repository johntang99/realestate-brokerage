export function aiChatEnabled() {
  const value = String(process.env.AI_CHAT_ENABLED || '').trim().toLowerCase();
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value);
}

export function getAiProvider() {
  const value = String(process.env.AI_CHAT_PROVIDER || 'anthropic').trim().toLowerCase();
  if (value === 'openai') return 'openai' as const;
  return 'anthropic' as const;
}

export function getAiModel() {
  const value = String(process.env.AI_CHAT_MODEL || '').trim();
  if (value) return value;
  throw new Error('AI_CHAT_MODEL is required');
}

export function getAiMaxTokens() {
  const parsed = Number(process.env.AI_CHAT_MAX_TOKENS || 1800);
  if (!Number.isFinite(parsed)) return 1800;
  return Math.max(300, Math.min(parsed, 6000));
}
