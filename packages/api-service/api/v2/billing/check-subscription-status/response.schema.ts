import { OpenAPIV3_1 } from 'openapi-types';

export const checkSubscriptionStatusResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['status'],
};
