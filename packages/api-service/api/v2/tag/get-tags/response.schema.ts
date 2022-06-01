import { OpenAPIV3 } from 'openapi-types';

import { tagSchema } from '../tag.schema';

export const getTagsResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: tagSchema,
    },
  },
  additionalProperties: false,
  required: ['tags'],
};
