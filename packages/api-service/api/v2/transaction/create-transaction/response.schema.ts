import { OpenAPIV3 } from 'openapi-types';

import { transactionSchema } from '../transaction.schema';

export const createTransactionResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    transaction: transactionSchema,
  },
  additionalProperties: false,
  required: ['transaction'],
};
