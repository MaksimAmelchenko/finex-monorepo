import { OpenAPIV3_1 } from 'openapi-types';

export const accountTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    shortName: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['name', 'shortName'],
};
