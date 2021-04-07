import { OpenAPIV3 } from 'openapi-types';
import { accountSchema } from '../../../../common/schemas/account.schema';

export const getAccountsResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    accounts: {
      type: 'array',
      items: accountSchema,
    },
  },
  required: ['accounts'],
  additionalProperties: false,
};
