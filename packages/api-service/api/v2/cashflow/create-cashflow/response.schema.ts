import { OpenAPIV3_1 } from 'openapi-types';

import { cashFlowSchema } from '../cashflow.schema';

export const createCashFlowResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlow: cashFlowSchema,
  },
  additionalProperties: false,
  required: ['cashFlow'],
};
