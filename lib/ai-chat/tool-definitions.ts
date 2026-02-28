export type ToolSchema = {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};

const entityTypeEnum = [
  'agents',
  'properties',
  'neighborhoods',
  'testimonials',
  'events',
  'guides',
  'new-construction',
  'knowledge-center',
  'market-reports',
] as const;

export const allTools: ToolSchema[] = [
  {
    name: 'list_pages',
    description: 'List all editable page JSON files for the current site and locale.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'read_page',
    description: 'Read full JSON content for a page by slug (e.g. home, about).',
    input_schema: {
      type: 'object',
      properties: { page: { type: 'string', description: 'Page slug without extension' } },
      required: ['page'],
    },
  },
  {
    name: 'update_page_field',
    description: 'Update one field in a page JSON using dot-path notation.',
    input_schema: {
      type: 'object',
      properties: {
        page: { type: 'string' },
        field_path: { type: 'string', description: 'Dot path, supports array index like hero.slides[0].alt' },
        new_value: { description: 'New value (string/object/number/boolean/array)' },
      },
      required: ['page', 'field_path', 'new_value'],
    },
  },
  {
    name: 'update_page_fields_batch',
    description: 'Update multiple page fields in one call.',
    input_schema: {
      type: 'object',
      properties: {
        page: { type: 'string' },
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field_path: { type: 'string' },
              new_value: {},
            },
            required: ['field_path', 'new_value'],
          },
        },
      },
      required: ['page', 'updates'],
    },
  },
  {
    name: 'update_section_variant',
    description: 'Set a section variant value in page JSON, usually <section>.variant.',
    input_schema: {
      type: 'object',
      properties: {
        page: { type: 'string' },
        section: { type: 'string' },
        variant: { type: 'string' },
      },
      required: ['page', 'section', 'variant'],
    },
  },
  {
    name: 'list_entities',
    description: 'List entities for a collection type.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: [...entityTypeEnum] },
      },
      required: ['entity_type'],
    },
  },
  {
    name: 'read_entity',
    description: 'Read one entity by ID or slug for a collection type.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: [...entityTypeEnum] },
        entity_id: { type: 'string' },
      },
      required: ['entity_type', 'entity_id'],
    },
  },
  {
    name: 'update_entity_field',
    description: 'Update one field on an entity by ID or slug.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: [...entityTypeEnum] },
        entity_id: { type: 'string' },
        field_path: { type: 'string' },
        new_value: {},
      },
      required: ['entity_type', 'entity_id', 'field_path', 'new_value'],
    },
  },
  {
    name: 'add_entity',
    description: 'Add a new entity to a collection. Provide the full data object.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: [...entityTypeEnum] },
        data: { type: 'object' },
      },
      required: ['entity_type', 'data'],
    },
  },
  {
    name: 'remove_entity',
    description: 'Remove an entity by ID or slug. Requires confirm=true.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: [...entityTypeEnum] },
        entity_id: { type: 'string' },
        confirm: { type: 'boolean', description: 'Must be true to execute destructive delete' },
      },
      required: ['entity_type', 'entity_id', 'confirm'],
    },
  },
  {
    name: 'get_site_settings',
    description: 'Read current site/header/footer/seo/theme settings for this site and locale.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'update_business_info',
    description: 'Update site.json business info field.',
    input_schema: {
      type: 'object',
      properties: {
        field: { type: 'string', description: 'Top-level field or address.* path' },
        value: {},
      },
      required: ['field', 'value'],
    },
  },
  {
    name: 'update_business_hours',
    description: 'Update office hours values in site.json.officeHours.',
    input_schema: {
      type: 'object',
      properties: {
        hours: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                enum: ['weekdays', 'saturday', 'sunday'],
              },
              value: { type: 'string' },
            },
            required: ['key', 'value'],
          },
        },
      },
      required: ['hours'],
    },
  },
  {
    name: 'update_seo',
    description: 'Update global seo.json or page-level seo object.',
    input_schema: {
      type: 'object',
      properties: {
        page: { type: 'string', description: "Use 'global' or page slug like 'about'" },
        title: { type: 'string' },
        description: { type: 'string' },
        keywords: { type: 'string' },
      },
      required: ['page'],
    },
  },
  {
    name: 'update_social_links',
    description: 'Update social platform URL in site.json.social.',
    input_schema: {
      type: 'object',
      properties: {
        platform: { type: 'string', enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'] },
        url: { type: 'string' },
      },
      required: ['platform', 'url'],
    },
  },
  {
    name: 'list_media',
    description: 'List media files known to the site media DB.',
    input_schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['all', 'images', 'documents'] },
      },
      required: [],
    },
  },
  {
    name: 'get_image_url',
    description: 'Find a media image by search text and return URL.',
    input_schema: {
      type: 'object',
      properties: { search: { type: 'string' } },
      required: ['search'],
    },
  },
];

export function toOpenAITools(tools: ToolSchema[]) {
  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}
