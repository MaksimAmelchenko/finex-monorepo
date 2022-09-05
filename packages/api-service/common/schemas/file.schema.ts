import { OpenAPIV3_1 } from 'openapi-types';

export const fileSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'ID.png',
    },
    contentType: {
      type: 'string',
      example: 'image/png',
    },
    content: {
      type: 'object',
    },
    size: {
      type: 'integer',
      example: 2345,
    },
  },
  required: ['name', 'contentType', 'content', 'size'],
  additionalProperties: false,
};
