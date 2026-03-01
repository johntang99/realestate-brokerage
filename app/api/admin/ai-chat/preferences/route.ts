import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { listPreferences, setPreference } from '@/lib/ai-chat/preferences';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  if (!canWriteContent(session.user)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const locale = searchParams.get('locale') || 'en';
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const preferences = await listPreferences(siteId, locale);
  return NextResponse.json({ success: true, siteId, locale, preferences });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  if (!canWriteContent(session.user)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  let payload: {
    siteId?: string;
    locale?: string;
    key?: string;
    value?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const siteId = String(payload.siteId || '').trim();
  const locale = String(payload.locale || 'en').trim() || 'en';
  const key = String(payload.key || '').trim();
  if (!siteId || !key) {
    return NextResponse.json({ message: 'siteId and key are required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await setPreference(siteId, locale, key, payload.value);
  const preferences = await listPreferences(siteId, locale);
  return NextResponse.json({ success: true, siteId, locale, preferences });
}
