import { OpenAPIV3 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const updateMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    moneyId,
    currencyId: {
      ...id,
      nullable: true,
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    precision: {
      type: 'integer',
    },
    isEnabled: {
      type: 'boolean',
    },
    sorting: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: ['moneyId'],
};
