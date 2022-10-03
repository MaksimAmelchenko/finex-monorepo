import { OpenAPIV3_1 } from 'openapi-types';

export const errorResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
        },
        message: {
          type: 'string',
          minLength: 1,
        },
        stack: {
          type: 'string',
          minLength: 1,
        },
        data: {
          type: 'object',
        },
      },
      required: ['code', 'message'],
      additionalProperties: false,
    },
  },
  required: ['error'],
  additionalProperties: false,
};
