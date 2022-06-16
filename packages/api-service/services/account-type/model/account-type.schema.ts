import { OpenAPIV3 } from 'openapi-types';

export const accountTypeSchema: OpenAPIV3.SchemaObject = {
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
