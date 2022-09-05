import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const updateMoneyParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    moneyId,
    currencyId: {
      ...id,
      type: ['integer', 'null'],
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
