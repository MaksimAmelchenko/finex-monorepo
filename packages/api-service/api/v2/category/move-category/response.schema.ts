import { OpenAPIV3 } from 'openapi-types';

export const moveCategoryResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    count: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['count'],
};
