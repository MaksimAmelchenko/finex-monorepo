import { OpenAPIV3_1 } from 'openapi-types';

import { accountSchema } from '../../../../common/schemas/account.schema';

export const getAccountResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    account: accountSchema,
  },
  required: ['account'],
  additionalProperties: false,
};
