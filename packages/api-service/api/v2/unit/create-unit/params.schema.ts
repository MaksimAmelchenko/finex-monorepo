import { OpenAPIV3_1 } from 'openapi-types';

export const createUnitParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },

  additionalProperties: false,
  required: ['name'],
};
