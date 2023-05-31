import { OpenAPIV3_1 } from 'openapi-types';

import { accountSchema } from '../account.schema';

export const updateAccountResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    account: accountSchema,
  },
  additionalProperties: false,
  required: ['account'],
};
