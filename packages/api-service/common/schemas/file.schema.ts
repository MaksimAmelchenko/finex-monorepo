import { OpenAPIV3 } from 'openapi-types';

export const fileSchema: OpenAPIV3.SchemaObject = {
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
