import { OpenAPIV3_1 } from 'openapi-types';

export const categoryPrototypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    parent: {
      type: ['number', 'null'],
    },
  },
  // "true" for patching json via jsonb_set
  additionalProperties: false,
  required: ['name'],
};
