import { OpenAPIV3_1 } from 'openapi-types';

export const badgeSchema: OpenAPIV3_1.SchemaObject = {
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
