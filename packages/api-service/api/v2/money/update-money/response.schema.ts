import { OpenAPIV3_1 } from 'openapi-types';

import { moneySchema } from '../money.schema';

export const updateMoneyResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    money: moneySchema,
  },
  additionalProperties: false,
  required: ['money'],
};
