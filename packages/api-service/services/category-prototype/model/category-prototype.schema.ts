import { OpenAPIV3 } from 'openapi-types';

export const categoryPrototypeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    parent: {
      type: 'number',
      nullable: true,
    },
  },
  // "true" for patching json via jsonb_set
  additionalProperties: false,
  required: ['name'],
};
