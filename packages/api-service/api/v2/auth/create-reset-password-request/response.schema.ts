import { OpenAPIV3 } from 'openapi-types';

export const resetPasswordRequestResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    resetPasswordRequest: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '2497afaa-b03c-4b05-9c0c-7088cbadf4be',
          description: 'Request ID for the resending confirmation email',
        },
      },
      required: ['id'],
    },
  },
  required: ['resetPasswordRequest'],
  additionalProperties: false,
};
