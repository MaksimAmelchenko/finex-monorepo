import { OpenAPIV3_1 } from 'openapi-types';

import { accountSchema } from '../account.schema';

export const unlinkAccountResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    account: accountSchema,
  },
  additionalProperties: false,
  required: ['account'],
};
