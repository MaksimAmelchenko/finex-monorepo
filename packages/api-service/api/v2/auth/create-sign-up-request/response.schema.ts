import { OpenAPIV3 } from 'openapi-types';

export const createSignUpRequestResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    signUpRequest: {
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
  required: ['signUpRequest'],
  additionalProperties: false,
};
