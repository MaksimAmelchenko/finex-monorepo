import { OpenAPIV3_1 } from 'openapi-types';

import { planTransactionSchema } from '../plan-transaction.schema';

export const createPlanTransactionResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    planTransaction: planTransactionSchema,
  },
  additionalProperties: false,
  required: ['planTransaction'],
};
