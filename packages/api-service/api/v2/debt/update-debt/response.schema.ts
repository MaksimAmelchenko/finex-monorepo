import { OpenAPIV3 } from 'openapi-types';

import { debtSchema } from '../debt.schema';

export const updateDebtResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    debt: debtSchema,
  },
  additionalProperties: false,
  required: ['debt'],
};
