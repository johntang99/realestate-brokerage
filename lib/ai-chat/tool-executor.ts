import { listPages, listVariantOptions, readPage, updatePageField, updatePageFieldsBatch } from './executors/pages';
import { addEntity, listEntities, readEntity, removeEntity, updateEntityField } from './executors/entities';
import { getImageUrl, listMedia } from './executors/media';
import { getSiteSettings, updateBusinessHours, updateBusinessInfo, updateSeo, updateSocialLinks } from './executors/settings';
import { getPreferences, setPreferenceValue } from './executors/preferences';
import type { ToolContext } from './executors/context';
import type { ExecutedToolResult } from './executors/shared';

export type { ToolContext, ExecutedToolResult };

export function buildToolContext(args: { siteId: string; locale: string; actorEmail: string; dryRun?: boolean }): ToolContext {
  return {
    siteId: args.siteId,
    locale: args.locale || 'en',
    actorEmail: args.actorEmail,
    dryRun: Boolean(args.dryRun),
  };
}

export function buildSafetyNote() {
  return 'Never perform destructive changes unless explicit confirmation is provided by the user.';
}

export async function executeTool(
  ctx: ToolContext,
  toolName: string,
  args: Record<string, unknown>
): Promise<ExecutedToolResult> {
  switch (toolName) {
    case 'list_pages':
      return listPages(ctx);
    case 'read_page':
      return readPage(ctx, String(args.page || ''));
    case 'list_variant_options':
      return listVariantOptions(ctx, typeof args.section === 'string' ? args.section : 'all');
    case 'update_page_field':
      return updatePageField(ctx, String(args.page || ''), String(args.field_path || ''), args.new_value);
    case 'update_page_fields_batch':
      return updatePageFieldsBatch(
        ctx,
        String(args.page || ''),
        (Array.isArray(args.updates) ? args.updates : []) as Array<{ field_path: string; new_value: unknown }>
      );
    case 'update_section_variant':
      return updatePageField(ctx, String(args.page || ''), `${String(args.section || '')}.variant`, String(args.variant || ''));
    case 'list_entities':
      return listEntities(ctx, String(args.entity_type || ''));
    case 'read_entity':
      return readEntity(ctx, String(args.entity_type || ''), String(args.entity_id || ''));
    case 'update_entity_field':
      return updateEntityField(
        ctx,
        String(args.entity_type || ''),
        String(args.entity_id || ''),
        String(args.field_path || ''),
        args.new_value
      );
    case 'add_entity':
      return addEntity(ctx, String(args.entity_type || ''), (args.data || {}) as Record<string, unknown>);
    case 'remove_entity':
      return removeEntity(ctx, String(args.entity_type || ''), String(args.entity_id || ''), Boolean(args.confirm));
    case 'get_site_settings':
      return getSiteSettings(ctx);
    case 'update_business_info':
      return updateBusinessInfo(ctx, String(args.field || ''), args.value);
    case 'update_business_hours':
      return updateBusinessHours(
        ctx,
        (Array.isArray(args.hours) ? args.hours : []) as Array<{ key: string; value: string }>
      );
    case 'update_seo':
      return updateSeo(
        ctx,
        String(args.page || 'global'),
        typeof args.title === 'string' ? args.title : undefined,
        typeof args.description === 'string' ? args.description : undefined,
        typeof args.keywords === 'string' ? args.keywords : undefined
      );
    case 'update_social_links':
      return updateSocialLinks(ctx, String(args.platform || ''), String(args.url || ''));
    case 'list_media':
      return listMedia(
        ctx,
        (String(args.type || 'all') as 'all' | 'images' | 'documents')
      );
    case 'get_image_url':
      return getImageUrl(ctx, String(args.search || ''));
    case 'get_preferences':
      return getPreferences(ctx);
    case 'set_preference':
      return setPreferenceValue(ctx, String(args.key || ''), args.value);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
