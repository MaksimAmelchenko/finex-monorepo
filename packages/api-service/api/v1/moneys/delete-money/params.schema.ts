import { OpenAPIV3 } from 'openapi-types';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const deleteMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idMoney: moneyId,
  },
  additionalProperties: false,
  required: ['idMoney'],
};
