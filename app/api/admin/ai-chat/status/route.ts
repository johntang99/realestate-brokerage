import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent } from '@/lib/admin/permissions';
import { aiChatEnabled, getAiModel, getAiProvider } from '@/lib/ai-chat/config';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const provider = getAiProvider();
  const anthropicKeyDetected = Boolean(process.env.ANTHROPIC_API_KEY);
  const openaiKeyDetected = Boolean(process.env.OPENAI_API_KEY);

  const providerKeyDetected =
    provider === 'openai' ? openaiKeyDetected : anthropicKeyDetected;

  let model: string | null = null;
  let modelConfigured = false;
  try {
    model = getAiModel();
    modelConfigured = true;
  } catch {
    modelConfigured = false;
  }

  return NextResponse.json({
    success: true,
    enabled: aiChatEnabled(),
    provider,
    model,
    modelConfigured,
    providerKeyDetected,
    keysDetected: {
      anthropic: anthropicKeyDetected,
      openai: openaiKeyDetected,
    },
  });
}
