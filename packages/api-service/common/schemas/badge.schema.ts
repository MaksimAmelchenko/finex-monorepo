import { OpenAPIV3 } from 'openapi-types';

export const badgeSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    menuItem: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    value: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['menuItem', 'title', 'value'],
};
