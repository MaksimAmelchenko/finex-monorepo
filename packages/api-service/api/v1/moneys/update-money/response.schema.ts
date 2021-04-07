import { OpenAPIV3 } from 'openapi-types';
import { moneySchema } from '../../../../common/schemas/money.schema';

export const updateMoneyResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    money: moneySchema,
  },
  additionalProperties: false,
  required: ['money'],
};
