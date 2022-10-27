import { OpenAPIV3_1 } from 'openapi-types';

import { cashFlowItemSchema } from '../../cash-flow/cash-flow-item.schema';

export const createCashFlowItemResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowItem: cashFlowItemSchema,
  },
  additionalProperties: false,
  required: ['cashFlowItem'],
};
