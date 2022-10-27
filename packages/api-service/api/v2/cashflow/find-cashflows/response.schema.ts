import { OpenAPIV3_1 } from 'openapi-types';

import { cashFlowSchema } from '../cashflow.schema';

export const findCashFlowsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlows: {
      type: 'array',
      items: cashFlowSchema,
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
  required: ['cashFlows', 'metadata'],
};
