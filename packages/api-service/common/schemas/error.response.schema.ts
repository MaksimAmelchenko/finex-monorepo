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
        status: {
          type: 'integer',
          enum: [400, 401, 403, 404, 409],
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
      required: ['code', 'status', 'message'],
      additionalProperties: false,
    },
  },
  required: ['error'],
  additionalProperties: false,
};
