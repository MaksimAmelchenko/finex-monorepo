import { OpenAPIV3 } from 'openapi-types';
import { accountSchema } from '../../../../common/schemas/account.schema';

export const updateAccountResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    account: accountSchema,
  },
  required: ['account'],
  additionalProperties: false,
};
