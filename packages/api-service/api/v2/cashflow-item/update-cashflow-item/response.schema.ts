import { OpenAPIV3_1 } from 'openapi-types';

import { cashFlowItemSchema } from '../../cashflow/cashflow-item.schema';

export const updateCashFlowItemResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowItem: cashFlowItemSchema,
  },
  additionalProperties: false,
  required: ['cashFlowItem'],
};
