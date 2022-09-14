import { OpenAPIV3_1 } from 'openapi-types';

import { plannedTransactionSchema } from '../planned-transaction.schema';
import { transactionSchema } from '../transaction.schema';

export const findTransactionsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transactions: {
      type: 'array',
      items: {
        oneOf: [
          //
          transactionSchema,
          plannedTransactionSchema,
        ],
      },
    },
    metadata: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
        },
        offset: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
      },
    },
  },
  additionalProperties: false,
  required: ['transactions', 'metadata'],
};
