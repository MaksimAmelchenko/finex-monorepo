import { OpenAPIV3 } from 'openapi-types';
import { categoryId } from '../../../../common/schemas/fields/category-id';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const updateMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idMoney: moneyId,
    idCurrency: {
      ...categoryId,
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    precision: {
      type: 'integer',
    },
    symbol: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['idMoney'],
};
