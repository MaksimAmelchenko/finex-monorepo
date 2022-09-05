import { OpenAPIV3_1 } from 'openapi-types';

import { debtItemSchema } from '../debt-item.schema';

export const createDebtItemResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtItem: debtItemSchema,
  },
  additionalProperties: false,
  required: ['debtItem'],
};
