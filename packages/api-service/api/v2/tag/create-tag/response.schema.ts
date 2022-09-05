import { OpenAPIV3_1 } from 'openapi-types';

import { tagSchema } from '../tag.schema';

export const createTagResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    tag: tagSchema,
  },
  additionalProperties: false,
  required: ['tag'],
};
