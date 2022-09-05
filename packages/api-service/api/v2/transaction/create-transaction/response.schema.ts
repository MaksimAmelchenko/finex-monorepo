import { OpenAPIV3_1 } from 'openapi-types';

import { transactionSchema } from '../transaction.schema';

export const createTransactionResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    transaction: transactionSchema,
  },
  additionalProperties: false,
  required: ['transaction'],
};
