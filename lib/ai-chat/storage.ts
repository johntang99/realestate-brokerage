import { v4 as uuidv4 } from 'uuid';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ChatMessageRecord, ChatRole } from './types';

export function createConversationId() {
  return `chat_${uuidv4()}`;
}

function mapRowToMessage(row: Record<string, unknown>): ChatMessageRecord {
  return {
    id: String(row.id || uuidv4()),
    role: String(row.role || 'assistant') as ChatRole,
    content: String(row.content || ''),
    createdAt: String(row.created_at || new Date().toISOString()),
    toolName: typeof row.tool_name === 'string' ? row.tool_name : undefined,
  };
}

export async function loadConversation(args: {
  siteId: string;
  locale: string;
  conversationId: string;
  limit?: number;
}): Promise<ChatMessageRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id,role,content,tool_name,created_at')
    .eq('site_id', args.siteId)
    .eq('locale', args.locale)
    .eq('conversation_id', args.conversationId)
    .order('created_at', { ascending: true })
    .limit(args.limit || 60);
  if (error) return [];
  return (data || []).map((row) => mapRowToMessage(row as Record<string, unknown>));
}

export async function saveMessage(args: {
  siteId: string;
  locale: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  toolName?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  await supabase.from('chat_messages').insert({
    id: uuidv4(),
    site_id: args.siteId,
    locale: args.locale,
    conversation_id: args.conversationId,
    role: args.role,
    content: args.content,
    tool_name: args.toolName || null,
    created_at: new Date().toISOString(),
  });
}
