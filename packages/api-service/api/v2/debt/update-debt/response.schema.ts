import { OpenAPIV3_1 } from 'openapi-types';

import { debtSchema } from '../debt.schema';

export const updateDebtResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debt: debtSchema,
  },
  additionalProperties: false,
  required: ['debt'],
};
