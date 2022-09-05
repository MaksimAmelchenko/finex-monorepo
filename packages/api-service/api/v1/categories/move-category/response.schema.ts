import { OpenAPIV3_1 } from 'openapi-types';

export const moveCategoryResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    count: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['count'],
};
