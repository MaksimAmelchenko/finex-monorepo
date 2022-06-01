import { OpenAPIV3 } from 'openapi-types';

import { tagSchema } from '../tag.schema';

export const updateTagResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    tag: tagSchema,
  },
  additionalProperties: false,
  required: ['tag'],
};
