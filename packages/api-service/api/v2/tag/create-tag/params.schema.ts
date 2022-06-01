import { OpenAPIV3 } from 'openapi-types';

export const createTagParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },

  additionalProperties: false,
  required: ['name'],
};
