import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import { aiChatEnabled } from '@/lib/ai-chat/config';
import { runChatTurn } from '@/lib/ai-chat/engine';
import type { ChatRequestPayload } from '@/lib/ai-chat/types';
import { encodeSseEvent, sseHeaders } from '@/lib/ai-chat/sse';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!aiChatEnabled()) {
    return NextResponse.json({ message: 'AI chat is disabled' }, { status: 404 });
  }

  let payload: ChatRequestPayload;
  try {
    payload = (await request.json()) as ChatRequestPayload;
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  if (!payload.siteId || !payload.locale || !payload.message?.trim()) {
    return NextResponse.json(
      { message: 'siteId, locale, and message are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, payload.siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    if (payload.stream) {
      const stream = new ReadableStream({
        start(controller) {
          const send = (event: unknown) =>
            controller.enqueue(new TextEncoder().encode(encodeSseEvent(event)));

          runChatTurn({
            siteId: payload.siteId,
            locale: payload.locale,
            actorEmail: session.user.email,
            userMessage: payload.message,
            conversationId: payload.conversationId,
            dryRun: Boolean(payload.dryRun),
            onEvent: (event) => send(event),
          })
            .then(async (result) => {
              await writeAuditLog({
                actor: { id: session.user.id, email: session.user.email },
                action: 'ai_chat_turn',
                siteId: payload.siteId,
                metadata: {
                  locale: payload.locale,
                  conversationId: result.conversationId,
                  model: result.model,
                  dryRun: Boolean(payload.dryRun),
                  toolRuns: result.toolRuns.map((item) => ({
                    name: item.name,
                    ok: item.ok,
                  })),
                },
              });
              send({
                type: 'done',
                conversationId: result.conversationId,
                model: result.model,
                answer: result.answer,
              });
              controller.close();
            })
            .catch((error: any) => {
              send({ type: 'status', message: `Error: ${error?.message || 'AI chat failed'}` });
              controller.close();
            });
        },
      });

      return new Response(stream, { headers: sseHeaders() });
    }

    const result = await runChatTurn({
      siteId: payload.siteId,
      locale: payload.locale,
      actorEmail: session.user.email,
      userMessage: payload.message,
      conversationId: payload.conversationId,
      dryRun: Boolean(payload.dryRun),
    });

    await writeAuditLog({
      actor: { id: session.user.id, email: session.user.email },
      action: 'ai_chat_turn',
      siteId: payload.siteId,
      metadata: {
        locale: payload.locale,
        conversationId: result.conversationId,
        model: result.model,
        dryRun: Boolean(payload.dryRun),
        toolRuns: result.toolRuns.map((item) => ({
          name: item.name,
          ok: item.ok,
        })),
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: result.conversationId,
      answer: result.answer,
      toolRuns: result.toolRuns,
      model: result.model,
      dryRun: Boolean(payload.dryRun),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'AI chat failed' },
      { status: 500 }
    );
  }
}
