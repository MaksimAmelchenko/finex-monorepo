import { OpenAPIV3 } from 'openapi-types';

import { accountSchema } from '../account.schema';

export const updateAccountResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    account: accountSchema,
  },
  additionalProperties: false,
  required: ['account'],
};
