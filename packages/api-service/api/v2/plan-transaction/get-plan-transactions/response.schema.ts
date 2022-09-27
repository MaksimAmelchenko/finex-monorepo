import { OpenAPIV3_1 } from 'openapi-types';

import { planTransactionSchema } from '../plan-transaction.schema';

export const getPlanTransactionsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    planTransactions: {
      type: 'array',
      items: planTransactionSchema,
    },
  },
  additionalProperties: false,
  required: ['planTransactions'],
};
