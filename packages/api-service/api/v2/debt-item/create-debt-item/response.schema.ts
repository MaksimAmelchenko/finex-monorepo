import { OpenAPIV3 } from 'openapi-types';

import { debtItemSchema } from '../debt-item.schema';

export const createDebtItemResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    debtItem: debtItemSchema,
  },
  additionalProperties: false,
  required: ['debtItem'],
};
