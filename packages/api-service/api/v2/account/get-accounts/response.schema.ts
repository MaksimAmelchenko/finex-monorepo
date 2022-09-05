import { OpenAPIV3_1 } from 'openapi-types';

import { accountSchema } from '../account.schema';

export const getAccountsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accounts: {
      type: 'array',
      items: accountSchema,
    },
  },
  additionalProperties: false,
  required: ['accounts'],
};
