import { OpenAPIV3 } from 'openapi-types';

export const createProjectParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    editors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: ['name'],
};
