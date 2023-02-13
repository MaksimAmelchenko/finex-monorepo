import { OpenAPIV3_1 } from 'openapi-types';

import { debtItemSchema } from '../debt-item.schema';
import { exchangeSchema } from '../exchange.schema';
import { transactionSchema } from '../transaction.schema';
import { transferSchema } from '../transfer.schema';

export const findOperationsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    operations: {
      type: 'array',
      items: {
        oneOf: [
          transactionSchema,
          debtItemSchema,
          transferSchema,
          exchangeSchema,
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
  required: ['operations', 'metadata'],
};
