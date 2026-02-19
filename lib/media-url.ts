const UPLOADS_PREFIX = '/uploads/';

function getSupabasePublicBaseUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROD_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL ||
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_PROD_URL ||
    process.env.SUPABASE_STAGING_URL ||
    '';
  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    '';

  if (!rawUrl || !bucket) return null;

  try {
    const origin = new URL(rawUrl).origin;
    return `${origin}/storage/v1/object/public/${bucket}`;
  } catch {
    return null;
  }
}

export function resolveMediaUrl(src?: string | null): string {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith(UPLOADS_PREFIX)) return src;

  const publicBase = getSupabasePublicBaseUrl();
  if (!publicBase) return src;

  const objectPath = src.slice(UPLOADS_PREFIX.length);
  return `${publicBase}/${objectPath}`;
}
