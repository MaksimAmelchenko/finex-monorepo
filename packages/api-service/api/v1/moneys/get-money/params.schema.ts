import { OpenAPIV3 } from 'openapi-types';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const getMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idMoney: moneyId,
  },
  additionalProperties: false,
  required: ['idMoney'],
};
