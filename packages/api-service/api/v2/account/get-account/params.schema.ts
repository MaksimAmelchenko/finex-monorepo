import { OpenAPIV3_1 } from 'openapi-types';

export const getAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accountId: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['accountId'],
};
