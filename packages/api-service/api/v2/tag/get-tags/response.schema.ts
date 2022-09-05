import { OpenAPIV3_1 } from 'openapi-types';

import { tagSchema } from '../tag.schema';

export const getTagsResponseSchema: OpenAPIV3_1.SchemaObject = {
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
