import { OpenAPIV3_1 } from 'openapi-types';

import { transactionSchema } from '../transaction.schema';

export const getTransactionsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transactions: {
      type: 'array',
      items: transactionSchema,
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
        totalPlanned: {
          type: 'integer',
        },
      },
    },
  },
  additionalProperties: false,
  required: ['transactions', 'metadata'],
};
